package com.ramble.mymomentum.controller;

import com.ramble.mymomentum.dto.*;
import com.ramble.mymomentum.enums.RecordSource;
import com.ramble.mymomentum.service.ActivityRecordService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.UUID;

@RestController
@RequestMapping("/api/records")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Activity Record Management", description = "活動記錄管理")
@SecurityRequirement(name = "bearerAuth")
public class ActivityRecordController {

    private final ActivityRecordService activityRecordService;

    @PostMapping
    @Operation(
        summary = "創建活動記錄",
        description = "為當前用戶創建新的活動記錄（LIVE或MANUAL）"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "201",
            description = "記錄創建成功",
            content = @Content(schema = @Schema(implementation = RecordResponse.class))
        ),
        @ApiResponse(
            responseCode = "400",
            description = "請求參數錯誤或驗證失敗"
        ),
        @ApiResponse(
            responseCode = "404",
            description = "活動不存在"
        ),
        @ApiResponse(
            responseCode = "409",
            description = "該活動已有正在進行的LIVE記錄"
        )
    })
    public ResponseEntity<RecordResponse> createRecord(
            Authentication authentication,
            @Valid @RequestBody RecordCreateRequest request) {
        
        Long userId = (Long) authentication.getPrincipal();
        log.info("Creating record for user: {}, activity: {}", userId, request.getActivityId());
        RecordResponse record = activityRecordService.createRecord(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(record);
    }

    @PatchMapping("/{id}/finish")
    @Operation(
        summary = "完成LIVE記錄",
        description = "結束正在進行的LIVE記錄並設置持續時間"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "記錄完成成功",
            content = @Content(schema = @Schema(implementation = RecordResponse.class))
        ),
        @ApiResponse(
            responseCode = "400",
            description = "請求參數錯誤"
        ),
        @ApiResponse(
            responseCode = "404",
            description = "記錄不存在"
        ),
        @ApiResponse(
            responseCode = "409",
            description = "記錄不是正在進行的LIVE記錄"
        )
    })
    public ResponseEntity<RecordResponse> finishRecord(
            Authentication authentication,
            @Parameter(description = "記錄ID") @PathVariable("id") UUID id,
            @Valid @RequestBody RecordFinishRequest request) {
        
        Long userId = (Long) authentication.getPrincipal();
        log.info("Finishing record: {} for user: {}", id, userId);
        RecordResponse record = activityRecordService.finishRecord(userId, id, request);
        return ResponseEntity.ok(record);
    }

    @PutMapping("/{id}")
    @Operation(
        summary = "更新記錄",
        description = "更新現有的活動記錄（僅限MANUAL記錄或已完成的LIVE記錄）"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "記錄更新成功",
            content = @Content(schema = @Schema(implementation = RecordResponse.class))
        ),
        @ApiResponse(
            responseCode = "400",
            description = "請求參數錯誤或驗證失敗"
        ),
        @ApiResponse(
            responseCode = "404",
            description = "記錄不存在"
        ),
        @ApiResponse(
            responseCode = "409",
            description = "不能更新正在進行的LIVE記錄"
        )
    })
    public ResponseEntity<RecordResponse> updateRecord(
            Authentication authentication,
            @Parameter(description = "記錄ID") @PathVariable("id") UUID id,
            @Valid @RequestBody RecordUpdateRequest request) {
        
        Long userId = (Long) authentication.getPrincipal();
        log.info("Updating record: {} for user: {}", id, userId);
        RecordResponse record = activityRecordService.updateRecord(userId, id, request);
        return ResponseEntity.ok(record);
    }

    @DeleteMapping("/{id}")
    @Operation(
        summary = "刪除記錄",
        description = "刪除現有的活動記錄"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "204",
            description = "記錄刪除成功"
        ),
        @ApiResponse(
            responseCode = "404",
            description = "記錄不存在"
        )
    })
    public ResponseEntity<Void> deleteRecord(
            Authentication authentication,
            @Parameter(description = "記錄ID") @PathVariable("id") UUID id) {
        
        Long userId = (Long) authentication.getPrincipal();
        log.info("Deleting record: {} for user: {}", id, userId);
        activityRecordService.deleteRecord(userId, id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    @Operation(
        summary = "獲取單一記錄",
        description = "根據ID獲取單一活動記錄"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "記錄獲取成功",
            content = @Content(schema = @Schema(implementation = RecordResponse.class))
        ),
        @ApiResponse(
            responseCode = "404",
            description = "記錄不存在"
        )
    })
    public ResponseEntity<RecordResponse> getRecord(
            Authentication authentication,
            @Parameter(description = "記錄ID") @PathVariable("id") UUID id) {
        
        Long userId = (Long) authentication.getPrincipal();
        log.info("Getting record: {} for user: {}", id, userId);
        RecordResponse record = activityRecordService.getRecord(userId, id);
        return ResponseEntity.ok(record);
    }

    @GetMapping
    @Operation(
        summary = "獲取記錄列表",
        description = "獲取用戶的活動記錄列表，支持多種過濾條件"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "記錄列表獲取成功",
            content = @Content(schema = @Schema(implementation = PagedRecordResponse.class))
        )
    })
    public ResponseEntity<PagedRecordResponse> listRecords(
            Authentication authentication,
            @Parameter(description = "活動ID過濾") @RequestParam(required = false) UUID activityId,
            @Parameter(description = "開始時間過濾") @RequestParam(required = false) Instant from,
            @Parameter(description = "結束時間過濾") @RequestParam(required = false) Instant to,
            @Parameter(description = "記錄來源過濾") @RequestParam(required = false) RecordSource source,
            @Parameter(description = "僅顯示正在進行的LIVE記錄") @RequestParam(required = false) Boolean running,
            @Parameter(description = "頁碼") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "每頁大小") @RequestParam(defaultValue = "20") int size) {
        
        Long userId = (Long) authentication.getPrincipal();
        log.info("Listing records for user: {} with filters", userId);
        PagedRecordResponse records = activityRecordService.listRecords(userId, activityId, from, to, source, running, page, size);
        return ResponseEntity.ok(records);
    }

    @GetMapping("/running")
    @Operation(
        summary = "獲取正在進行的記錄",
        description = "獲取用戶正在進行的LIVE記錄列表"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "正在進行的記錄列表獲取成功",
            content = @Content(schema = @Schema(implementation = PagedRecordResponse.class))
        )
    })
    public ResponseEntity<PagedRecordResponse> listRunningRecords(
            Authentication authentication,
            @Parameter(description = "活動ID過濾") @RequestParam(required = false) UUID activityId,
            @Parameter(description = "頁碼") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "每頁大小") @RequestParam(defaultValue = "20") int size) {
        
        Long userId = (Long) authentication.getPrincipal();
        log.info("Listing running records for user: {}", userId);
        PagedRecordResponse records = activityRecordService.listRunningRecords(userId, activityId, page, size);
        return ResponseEntity.ok(records);
    }
}
