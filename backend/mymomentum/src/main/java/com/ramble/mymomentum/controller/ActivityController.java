package com.ramble.mymomentum.controller;

import com.ramble.mymomentum.dto.ActivityResponse;
import com.ramble.mymomentum.dto.CreateActivityRequest;
import com.ramble.mymomentum.dto.UpdateActivityRequest;
import com.ramble.mymomentum.service.ActivityService;
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

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/activities")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Activity Management", description = "活動管理")
@SecurityRequirement(name = "bearerAuth")
public class ActivityController {

    private final ActivityService activityService;

    @PostMapping
    @Operation(
        summary = "創建新活動",
        description = "為當前用戶創建新活動"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "201",
            description = "活動創建成功",
            content = @Content(schema = @Schema(implementation = ActivityResponse.class))
        ),
        @ApiResponse(
            responseCode = "400",
            description = "Bad request - 活動名稱已存在或驗證失敗"
        )
    })
    public ResponseEntity<ActivityResponse> createActivity(
            Authentication authentication,
            @Valid @RequestBody CreateActivityRequest request) {
        
        Long userId = (Long) authentication.getPrincipal();
        log.info("Creating activity for user: {}", userId);
        ActivityResponse createdActivity = activityService.createActivityResponse(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdActivity);
    }

    @GetMapping
    @Operation(
        summary = "獲取用戶的所有活動",
        description = "獲取當前用戶的所有活動"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "活動獲取成功",
            content = @Content(schema = @Schema(implementation = ActivityResponse.class))
        )
    })
    public ResponseEntity<Map<String, List<ActivityResponse>>> getActivities(Authentication authentication) {
        
        Long userId = (Long) authentication.getPrincipal();
        log.info("Fetching activities for user: {}", userId);
        List<ActivityResponse> activities = activityService.getActivitiesByUserId(userId);
        return ResponseEntity.ok(Map.of("data", activities));
    }

    @GetMapping("/{id}")
    @Operation(
        summary = "獲取單一活動",
        description = "根據ID獲取單一活動"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "活動獲取成功",
            content = @Content(schema = @Schema(implementation = ActivityResponse.class))
        ),
        @ApiResponse(
            responseCode = "404",
            description = "活動不存在"
        )
    })
    public ResponseEntity<ActivityResponse> getActivity(
            Authentication authentication,
            @Parameter(description = "活動ID") @PathVariable("id") UUID id) {
        
        Long userId = (Long) authentication.getPrincipal();
        log.info("Fetching activity: {} for user: {}", id, userId);
        ActivityResponse activity = activityService.getActivityResponseByIdAndUserId(id, userId);
        return ResponseEntity.ok(activity);
    }

    @PutMapping("/{id}")
    @Operation(
        summary = "更新活動",
        description = "更新現有活動"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "活動更新成功",
            content = @Content(schema = @Schema(implementation = ActivityResponse.class))
        ),
        @ApiResponse(
            responseCode = "400",
            description = "Bad request - 驗證失敗"
        ),
        @ApiResponse(
            responseCode = "404",
            description = "活動不存在"
        )
    })
    public ResponseEntity<ActivityResponse> updateActivity(
            Authentication authentication,
            @Parameter(description = "活動ID") @PathVariable("id") UUID id,
            @Valid @RequestBody UpdateActivityRequest request) {
        
        Long userId = (Long) authentication.getPrincipal();
        log.info("Updating activity: {} for user: {}", id, userId);
        ActivityResponse updatedActivity = activityService.updateActivityResponse(id, userId, request);
        return ResponseEntity.ok(updatedActivity);
    }

    @DeleteMapping("/{id}")
    @Operation(
        summary = "刪除活動",
        description = "刪除現有活動"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "204",
            description = "活動刪除成功"
        ),
        @ApiResponse(
            responseCode = "404",
            description = "活動不存在"
        )
    })
    public ResponseEntity<Void> deleteActivity(
            Authentication authentication,
            @Parameter(description = "活動ID") @PathVariable("id") UUID id) {
        
        Long userId = (Long) authentication.getPrincipal();
        log.info("Deleting activity: {} for user: {}", id, userId);
        activityService.deleteActivity(id, userId);
        return ResponseEntity.noContent().build();
    }
} 