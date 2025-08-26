package com.ramble.mymomentum.service;

import com.ramble.mymomentum.dto.ActivityResponse;
import com.ramble.mymomentum.dto.CreateActivityRequest;
import com.ramble.mymomentum.dto.UpdateActivityRequest;
import com.ramble.mymomentum.entity.Activity;
import com.ramble.mymomentum.repository.ActivityRepository;
import com.ramble.mymomentum.repository.ActivityRecordRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ActivityService {

    private final ActivityRepository activityRepository;
    private final ActivityRecordRepository activityRecordRepository;

    /**
     * 建立新活動
     * 
     * @param userId The user ID
     * @param request The activity creation request
     * @return The created activity
     * @throws IllegalArgumentException if activity with same name already exists for the user
     */
    public Activity createActivity(Long userId, CreateActivityRequest request) {
        log.info("Creating activity for user: {}, name: {}", userId, request.getName());
        
        // Check if activity with same name already exists for this user
        if (activityRepository.existsByUserIdAndName(userId, request.getName())) {
            throw new IllegalArgumentException("Activity with name '" + request.getName() + "' already exists for this user");
        }
        
        // Create new activity
        Activity activity = new Activity();
        activity.setUserId(userId);
        activity.setName(request.getName());
        activity.setGoalTime(request.getTargetTime() * 60); // Convert minutes to seconds
        activity.setColor(request.getColor());
        activity.setIcon(request.getIcon());
        
        Activity savedActivity = activityRepository.save(activity);
        log.info("Activity created successfully with ID: {}", savedActivity.getId());
        
        return savedActivity;
    }

    /**
     * 取得某使用者的所有活動
     * 
     * @param userId The user ID
     * @return List of activities for the user
     */
    @Transactional(readOnly = true)
    public List<ActivityResponse> getActivitiesByUserId(Long userId) {
        log.info("Fetching activities for user: {}", userId);
        
        List<Activity> activities = activityRepository.findByUserId(userId);
        log.info("Found {} activities for user: {}", activities.size(), userId);
        
        return activities.stream()
                .map(this::convertToActivityResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get a specific activity by ID and user ID
     *
     * @param activityId The activity ID
     * @param userId The user ID
     * @return The activity if found
     * @throws IllegalArgumentException if activity not found or doesn't belong to user
     */
    @Transactional(readOnly = true)
    public Activity getActivityByIdAndUserId(UUID activityId, Long userId) {
        log.info("Fetching activity: {} for user: {}", activityId, userId);

        Activity activity = activityRepository.findById(activityId)
                .orElseThrow(() -> new IllegalArgumentException("Activity not found with ID: " + activityId));

        if (!activity.getUserId().equals(userId)) {
            throw new IllegalArgumentException("Activity does not belong to user: " + userId);
        }

        return activity;
    }

    /**
     * Update an existing activity
     *
     * @param activityId The activity ID
     * @param userId The user ID
     * @param name New activity name (optional)
     * @param goalTime New goal time (optional)
     * @param color New color (optional)
     * @param icon New icon (optional)
     * @return The updated activity
     */
    public Activity updateActivity(UUID activityId, Long userId, String name, Integer goalTime, String color, String icon) {
        log.info("Updating activity: {} for user: {}", activityId, userId);

        Activity activity = getActivityByIdAndUserId(activityId, userId);

        // Check if new name conflicts with existing activity
        if (name != null && !name.equals(activity.getName()) &&
            activityRepository.existsByUserIdAndName(userId, name)) {
            throw new IllegalArgumentException("Activity with name '" + name + "' already exists for this user");
        }

        // Update fields if provided
        if (name != null) {
            activity.setName(name);
        }
        if (goalTime != null) {
            activity.setGoalTime(goalTime);
        }
        if (color != null) {
            activity.setColor(color);
        }
        if (icon != null) {
            activity.setIcon(icon);
        }

        Activity updatedActivity = activityRepository.save(activity);
        log.info("Activity updated successfully: {}", updatedActivity.getId());

        return updatedActivity;
    }

    /**
     * Delete an activity
     *
     * @param activityId The activity ID
     * @param userId The user ID
     */
    public void deleteActivity(UUID activityId, Long userId) {
        log.info("Deleting activity: {} for user: {}", activityId, userId);

        Activity activity = getActivityByIdAndUserId(activityId, userId);
        activityRepository.delete(activity);

        log.info("Activity deleted successfully: {}", activityId);
    }

    /**
     * Get a single activity as ActivityResponse
     */
    @Transactional(readOnly = true)
    public ActivityResponse getActivityResponseByIdAndUserId(UUID activityId, Long userId) {
        Activity activity = getActivityByIdAndUserId(activityId, userId);
        return convertToActivityResponse(activity);
    }

    /**
     * Create a new activity and return as ActivityResponse
     */
    public ActivityResponse createActivityResponse(Long userId, CreateActivityRequest request) {
        Activity activity = createActivity(userId, request);
        return convertToActivityResponse(activity);
    }

    /**
     * Update activity with new request DTO
     */
    public ActivityResponse updateActivityResponse(UUID activityId, Long userId, UpdateActivityRequest request) {
        Activity activity = updateActivity(
            activityId, 
            userId, 
            request.getName(), 
            request.getTargetTime() != null ? request.getTargetTime() * 60 : null, // Convert minutes to seconds
            request.getColor(), 
            request.getIcon()
        );
        return convertToActivityResponse(activity);
    }

    /**
     * Convert Activity entity to ActivityResponse DTO
     */
    private ActivityResponse convertToActivityResponse(Activity activity) {
        // Calculate total time (in minutes)
        Integer totalTimeSeconds = activityRecordRepository.getTotalTimeByActivityId(activity.getId());
        Integer totalTimeMinutes = totalTimeSeconds / 60;

        // Calculate weekly time (in minutes) - from start of current week
        LocalDateTime weekStart = LocalDateTime.now().truncatedTo(ChronoUnit.DAYS)
                .with(java.time.DayOfWeek.MONDAY);
        Integer weeklyTimeSeconds = activityRecordRepository.getWeeklyTimeByActivityId(activity.getId(), weekStart);
        Integer weeklyTimeMinutes = weeklyTimeSeconds / 60;

        // Convert target time from seconds to minutes
        Integer targetTimeMinutes = activity.getGoalTime() != null ? activity.getGoalTime() / 60 : 0;

        return new ActivityResponse(
            activity.getId().toString(),
            activity.getName(),
            totalTimeMinutes,
            weeklyTimeMinutes,
            targetTimeMinutes,
            activity.getColor(),
            activity.getIcon()
        );
    }
} 