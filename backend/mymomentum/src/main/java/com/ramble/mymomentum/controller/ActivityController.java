package com.ramble.mymomentum.controller;

import com.ramble.mymomentum.dto.ActivityResponse;
import com.ramble.mymomentum.dto.CreateActivityRequest;
import com.ramble.mymomentum.dto.UpdateActivityRequest;
import com.ramble.mymomentum.dto.DistributionItem;
import com.ramble.mymomentum.dto.TrendItem;
import com.ramble.mymomentum.dto.ActivityKPIs;
import com.ramble.mymomentum.service.ActivityService;
import com.ramble.mymomentum.service.StatisticsService;
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
    private final StatisticsService statisticsService;

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
    
    // ===== NEW FRONTEND STATISTICS ENDPOINTS =====
    
    @GetMapping("/{id}/distribution")
    @Operation(
        summary = "獲取活動分佈數據",
        description = "為分佈圖表提供數據，支援按天/週/月聚合"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "分佈數據獲取成功",
            content = @Content(schema = @Schema(implementation = DistributionItem.class))
        ),
        @ApiResponse(
            responseCode = "400",
            description = "參數錯誤 - 日期格式錯誤或時間粒度無效"
        ),
        @ApiResponse(
            responseCode = "404",
            description = "活動不存在"
        )
    })
    public ResponseEntity<List<DistributionItem>> getActivityDistribution(
            Authentication authentication,
            @Parameter(description = "活動ID") @PathVariable("id") UUID id,
            @Parameter(description = "開始日期 (YYYY-MM-DD)", required = true, example = "2025-09-01") 
            @RequestParam(name = "from") String from,
            @Parameter(description = "結束日期 (YYYY-MM-DD)", required = true, example = "2025-09-30") 
            @RequestParam(name = "to") String to,
            @Parameter(description = "時間粒度", required = true, example = "day") 
            @RequestParam(name = "grain") String grain) {
        
        Long userId = (Long) authentication.getPrincipal();
        log.info("Getting activity distribution for activity: {}, user: {}, from: {}, to: {}, grain: {}", 
                id, userId, from, to, grain);
        
        List<DistributionItem> distribution = statisticsService.getActivityDistribution(id, userId, from, to, grain);
        return ResponseEntity.ok(distribution);
    }
    
    @GetMapping("/{id}/trend")
    @Operation(
        summary = "獲取活動趨勢數據",
        description = "為趨勢線圖提供數據，支援按週/月聚合"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "趨勢數據獲取成功",
            content = @Content(schema = @Schema(implementation = TrendItem.class))
        ),
        @ApiResponse(
            responseCode = "400",
            description = "參數錯誤 - 日期格式錯誤或時間粒度無效"
        ),
        @ApiResponse(
            responseCode = "404",
            description = "活動不存在"
        )
    })
    public ResponseEntity<List<TrendItem>> getActivityTrend(
            Authentication authentication,
            @Parameter(description = "活動ID") @PathVariable("id") UUID id,
            @Parameter(description = "開始日期 (YYYY-MM-DD)", required = true, example = "2025-06-15") 
            @RequestParam(name = "from") String from,
            @Parameter(description = "結束日期 (YYYY-MM-DD)", required = true, example = "2025-09-09") 
            @RequestParam(name = "to") String to,
            @Parameter(description = "時間粒度 (week|month)", required = true, example = "week") 
            @RequestParam(name = "grain") String grain) {
        
        Long userId = (Long) authentication.getPrincipal();
        log.info("Getting activity trend for activity: {}, user: {}, from: {}, to: {}, grain: {}", 
                id, userId, from, to, grain);
        
        List<TrendItem> trend = statisticsService.getActivityTrend(id, userId, from, to, grain);
        return ResponseEntity.ok(trend);
    }
    
    @GetMapping("/{id}/kpis")
    @Operation(
        summary = "獲取活動 KPI 指標",
        description = "為 KPI 卡片提供統計指標，包含平均時長、最長記錄和週環比變化"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "KPI 指標獲取成功",
            content = @Content(schema = @Schema(implementation = ActivityKPIs.class))
        ),
        @ApiResponse(
            responseCode = "400",
            description = "參數錯誤 - 日期格式錯誤"
        ),
        @ApiResponse(
            responseCode = "404",
            description = "活動不存在"
        )
    })
    public ResponseEntity<ActivityKPIs> getActivityKPIs(
            Authentication authentication,
            @Parameter(description = "活動ID") @PathVariable("id") UUID id,
            @Parameter(description = "開始日期 (YYYY-MM-DD)", required = true, example = "2025-09-02") 
            @RequestParam(name = "from") String from,
            @Parameter(description = "結束日期 (YYYY-MM-DD)", required = true, example = "2025-09-09") 
            @RequestParam(name = "to") String to) {
        
        Long userId = (Long) authentication.getPrincipal();
        log.info("Getting activity KPIs for activity: {}, user: {}, from: {}, to: {}", 
                id, userId, from, to);
        
        ActivityKPIs kpis = statisticsService.getActivityKPIs(id, userId, from, to);
        return ResponseEntity.ok(kpis);
    }
} 