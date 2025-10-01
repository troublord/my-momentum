package com.ramble.mymomentum.service;

import com.ramble.mymomentum.dto.*;
import com.ramble.mymomentum.entity.ActivityRecord;
import com.ramble.mymomentum.enums.RecordSource;
import com.ramble.mymomentum.exception.BadRequestException;
import com.ramble.mymomentum.exception.ConflictException;
import com.ramble.mymomentum.exception.NotFoundException;
import com.ramble.mymomentum.repository.ActivityRecordRepository;
import com.ramble.mymomentum.repository.ActivityRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.Instant;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ActivityRecordService {

    private final ActivityRecordRepository activityRecordRepository;
    private final ActivityRepository activityRepository;
    private final CacheEvictionService cacheEvictionService;

    /**
     * Create a new activity record
     */
    public RecordResponse createRecord(Long userId, RecordCreateRequest request) {
        log.info("Creating record for user: {}, activity: {}, source: {}", userId, request.getActivityId(), request.getSource());
        
        // Evict cache for this specific activity
        cacheEvictionService.evictByActivityId(request.getActivityId());
        
        // Validate business rules
        validateCreateRequest(request);
        
        // Verify activity belongs to user
        activityRepository.findById(request.getActivityId())
                .filter(a -> a.getUserId().equals(userId))
                .orElseThrow(() -> new NotFoundException("Activity not found or does not belong to user"));
        
        // Check for running LIVE record if creating a LIVE record
        if (request.getSource() == RecordSource.LIVE) {
            boolean hasRunningRecord = activityRecordRepository.existsByUserIdAndActivityIdAndSourceAndDurationIsNull(
                    userId, request.getActivityId(), RecordSource.LIVE);
            if (hasRunningRecord) {
                throw new ConflictException("A LIVE record is already running for this activity");
            }
        }
        
        // Create and save the record
        ActivityRecord record = new ActivityRecord();
        record.setUserId(userId);
        record.setActivityId(request.getActivityId());
        record.setSource(request.getSource());
        record.setDuration(request.getDuration());
        record.setExecutedAt(request.getExecutedAt());
        
        ActivityRecord savedRecord = activityRecordRepository.save(record);
        log.info("Successfully created record: {}", savedRecord.getId());
        
        return mapToResponse(savedRecord);
    }

    /**
     * Finish a LIVE record by setting its duration
     */
    public RecordResponse finishRecord(Long userId, UUID recordId, RecordFinishRequest request) {
        log.info("Finishing record: {} for user: {}", recordId, userId);
        
        // Load record with ownership check
        ActivityRecord record = activityRecordRepository.findByIdAndUserId(recordId, userId)
                .orElseThrow(() -> new NotFoundException("Record not found or does not belong to user"));
        
        // Evict cache for this specific activity
        cacheEvictionService.evictByActivityId(record.getActivityId());
        
        // Validate it's a running LIVE record
        if (record.getSource() != RecordSource.LIVE || record.getDuration() != null) {
            throw new ConflictException("Record is not a running LIVE record");
        }
        
        // Validate end time is after execution time
        if (!request.getEndAt().isAfter(record.getExecutedAt())) {
            throw new BadRequestException("End time must be after execution time");
        }
        
        // Calculate and set duration
        long durationSeconds = Duration.between(record.getExecutedAt(), request.getEndAt()).getSeconds();
        if (durationSeconds > Integer.MAX_VALUE) {
            throw new BadRequestException("Duration too large");
        }
        record.setDuration((int) durationSeconds);

        ActivityRecord savedRecord = activityRecordRepository.save(record);
        log.info("Successfully finished record: {} with duration: {} seconds", recordId, durationSeconds);
        
        return mapToResponse(savedRecord);
    }

    /**
     * Update an existing record (only MANUAL or finished LIVE records)
     */
    public RecordResponse updateRecord(Long userId, UUID recordId, RecordUpdateRequest request) {
        log.info("Updating record: {} for user: {}", recordId, userId);
        
        // Validate business rules
        validateUpdateRequest(request);
        
        // Load record with ownership check
        ActivityRecord record = activityRecordRepository.findByIdAndUserId(recordId, userId)
                .orElseThrow(() -> new NotFoundException("Record not found or does not belong to user"));
        
        // Evict cache for both old and new activity (if activity changed)
        cacheEvictionService.evictByActivityId(record.getActivityId());
        if (!record.getActivityId().equals(request.getActivityId())) {
            cacheEvictionService.evictByActivityId(request.getActivityId());
        }
        
        // Validate record can be updated
        if (record.getSource() == RecordSource.LIVE && record.getDuration() == null) {
            throw new ConflictException("Cannot update a running LIVE record. Use finish endpoint or delete and recreate.");
        }
        
        // If changing activity, verify new activity belongs to user
        if (!record.getActivityId().equals(request.getActivityId())) {
            activityRepository.findById(request.getActivityId())
                    .filter(a -> a.getUserId().equals(userId))
                    .orElseThrow(() -> new NotFoundException("Target activity not found or does not belong to user"));
        }
        
        // Update fields
        record.setActivityId(request.getActivityId());
        record.setSource(request.getSource());
        record.setDuration(request.getDuration());
        record.setExecutedAt(request.getExecutedAt());
        
        ActivityRecord savedRecord = activityRecordRepository.save(record);
        log.info("Successfully updated record: {}", recordId);
        
        return mapToResponse(savedRecord);
    }

    /**
     * Delete a record
     */
    public void deleteRecord(Long userId, UUID recordId) {
        log.info("Deleting record: {} for user: {}", recordId, userId);
        
        ActivityRecord record = activityRecordRepository.findByIdAndUserId(recordId, userId)
                .orElseThrow(() -> new NotFoundException("Record not found or does not belong to user"));
        
        // Evict cache for this specific activity
        cacheEvictionService.evictByActivityId(record.getActivityId());
        
        activityRecordRepository.delete(record);
        log.info("Successfully deleted record: {}", recordId);
    }

    /**
     * Get a single record
     */
    @Transactional(readOnly = true)
    public RecordResponse getRecord(Long userId, UUID recordId) {
        log.info("Getting record: {} for user: {}", recordId, userId);
        
        ActivityRecord record = activityRecordRepository.findByIdAndUserId(recordId, userId)
                .orElseThrow(() -> new NotFoundException("Record not found or does not belong to user"));
        
        return mapToResponse(record);
    }

    /**
     * List records with optional filters
     */
    @Transactional(readOnly = true)
    public PagedRecordResponse listRecords(Long userId, UUID activityId, Instant from, Instant to, 
                                         RecordSource source, Boolean running, int page, int size) {
        log.info("Listing records for user: {} with filters - activity: {}, from: {}, to: {}, source: {}, running: {}", 
                userId, activityId, from, to, source, running);
        
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "executedAt"));
        Page<ActivityRecord> recordPage;
        
        // Handle running filter
        if (Boolean.TRUE.equals(running)) {
            recordPage = activityRecordRepository.findByUserIdAndSourceAndDurationIsNull(userId, RecordSource.LIVE, pageable);
        } else {
            // Apply filters based on what's provided
            recordPage = getFilteredRecords(userId, activityId, from, to, source, pageable);
        }
        
        return new PagedRecordResponse(
                recordPage.getContent().stream().map(this::mapToResponse).toList(),
                recordPage.getNumber(),
                recordPage.getSize(),
                recordPage.getTotalElements()
        );
    }

    /**
     * List running LIVE records
     * Note: A user can only have one running record at a time, so pagination is not needed
     */
    @Transactional(readOnly = true)
    public PagedRecordResponse listRunningRecords(Long userId) {
        log.info("Listing running records for user: {}", userId);
        
        List<ActivityRecord> records;
        records = activityRecordRepository.findByUserIdAndSourceAndDurationIsNull(userId, RecordSource.LIVE);
        log.info("Result for all activities: {}", records);

        // Convert to PagedRecordResponse with page=0, size=actual count, total=actual count
        return new PagedRecordResponse(
                records.stream().map(this::mapToResponse).toList(),
                0, // Always page 0 since there's only one record
                records.size(), // Actual size
                records.size()  // Total elements
        );
    }

    /* Helper */
    private Page<ActivityRecord> getFilteredRecords(Long userId, UUID activityId, Instant from, Instant to, 
                                                   RecordSource source, Pageable pageable) {
        boolean hasActivityFilter = activityId != null;
        boolean hasTimeFilter = from != null && to != null;
        boolean hasSourceFilter = source != null;
        
        if (hasActivityFilter && hasTimeFilter && hasSourceFilter) {
            return activityRecordRepository.findByUserIdAndActivityIdAndSourceAndExecutedAtRange(userId, activityId, source, from, to, pageable);
        } else if (hasActivityFilter && hasTimeFilter) {
            return activityRecordRepository.findByUserIdAndActivityIdAndExecutedAtRange(userId, activityId, from, to, pageable);
        } else if (hasActivityFilter && hasSourceFilter) {
            return activityRecordRepository.findByUserIdAndActivityIdAndSource(userId, activityId, source, pageable);
        } else if (hasTimeFilter && hasSourceFilter) {
            return activityRecordRepository.findByUserIdAndSourceAndExecutedAtRange(userId, source, from, to, pageable);
        } else if (hasActivityFilter) {
            return activityRecordRepository.findByUserIdAndActivityId(userId, activityId, pageable);
        } else if (hasTimeFilter) {
            return activityRecordRepository.findByUserIdAndExecutedAtRange(userId, from, to, pageable);
        } else if (hasSourceFilter) {
            return activityRecordRepository.findByUserIdAndSource(userId, source, pageable);
        } else {
            return activityRecordRepository.findByUserId(userId, pageable);
        }
    }

    private void validateCreateRequest(RecordCreateRequest request) {
        if (request.getSource() == RecordSource.MANUAL) {
            if (request.getDuration() == null || request.getDuration() <= 0) {
                throw new BadRequestException("Duration is required and must be positive for MANUAL records");
            }
        } else if (request.getSource() == RecordSource.LIVE) {
            if (request.getDuration() != null) {
                throw new BadRequestException("Duration must be null for LIVE records");
            }
        }
    }

    private void validateUpdateRequest(RecordUpdateRequest request) {
        if (request.getSource() == RecordSource.MANUAL) {
            if (request.getDuration() == null || request.getDuration() <= 0) {
                throw new BadRequestException("Duration is required and must be positive for MANUAL records");
            }
        } else if (request.getSource() == RecordSource.LIVE) {
            if (request.getDuration() != null) {
                throw new BadRequestException("Duration must be null for LIVE records");
            }
        }
    }

    /**
     * Get last day records for a user
     */
    @Transactional(readOnly = true)
    public LastDayRecordsResponse getLastDayRecords(Long userId, String timezone) {
        log.info("Getting last day records for user: {} with timezone: {}", userId, timezone);
        
        // Find the last date when user has activity records
        String lastDate = activityRecordRepository.findLastRecordDateByUserId(userId, timezone);
        
        if (lastDate == null) {
            // No records found, return empty response
            return new LastDayRecordsResponse(
                null, 
                0, 
                new ArrayList<>(), 
                0
            );
        }
        
        // Get records for the last date
        List<Object[]> recordData = activityRecordRepository.findRecordsByUserIdAndDate(userId, lastDate, timezone);
        
        // Get total duration for the last date
        Long lastDateDuration = activityRecordRepository.getTotalDurationByUserIdAndDate(userId, lastDate, timezone);
        
        // Get today's total duration
        Long todayDuration = activityRecordRepository.getTodayTotalDurationByUserId(userId, timezone);
        
        // Convert record data to DTO
        List<LastDayRecordsResponse.LastDayRecordItem> records = new ArrayList<>();
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");
        ZoneId zoneId = ZoneId.of(timezone);
        
        for (Object[] row : recordData) {
            // SQL query: SELECT ar.*, a.name as activity_name
            // ar.* includes: id, user_id, activity_id, source, duration, executed_at, created_at, updated_at
            // So: row[0] = id, row[1] = user_id, row[2] = activity_id, row[3] = source, 
            // row[4] = duration, row[5] = executed_at, row[6] = created_at, row[7] = updated_at,
            // row[8] = activity_name
            String activityName = (String) row[8];
            String sourceStr = (String) row[3];
            RecordSource source = RecordSource.valueOf(sourceStr);
            Integer duration = (Integer) row[4];
            Instant executedAt = (Instant) row[5];
            
            // Convert executedAt to local time in the specified timezone
            LocalTime recordTime = executedAt.atZone(zoneId).toLocalTime();
            
            records.add(new LastDayRecordsResponse.LastDayRecordItem(
                activityName,
                recordTime.format(timeFormatter),
                duration,
                source
            ));
        }
        
        return new LastDayRecordsResponse(
            lastDate,
            lastDateDuration.intValue(),
            records,
            todayDuration.intValue()
        );
    }

    private RecordResponse mapToResponse(ActivityRecord record) {
        return new RecordResponse(
                record.getId(),
                record.getActivityId(),
                record.getSource(),
                record.getDuration(),
                record.getExecutedAt(),
                record.getCreatedAt(),
                record.getUpdatedAt()
        );
    }
}
