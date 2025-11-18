package com.ramble.mymomentum.controller;

import com.ramble.mymomentum.dto.ActivityStatistics;
import com.ramble.mymomentum.dto.ActivityStatsSimple;
import com.ramble.mymomentum.dto.Summary;
import com.ramble.mymomentum.dto.WeeklyTrendItem;
import com.ramble.mymomentum.dto.ActivityShareItem;
import com.ramble.mymomentum.dto.OverviewKpis;
import com.ramble.mymomentum.dto.OverviewTrendPoint;
import com.ramble.mymomentum.dto.PagedOverviewLogResponse;
import com.ramble.mymomentum.service.StatisticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/statistics")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Statistics", description = "統計數據管理")
@SecurityRequirement(name = "bearerAuth")
public class StatisticsController {

    private final StatisticsService statisticsService;

    @GetMapping("/summary")
    @Operation(
        summary = "獲取統計摘要",
        description = "獲取用戶的統計摘要數據，默認為當前週"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "統計摘要獲取成功",
            content = @Content(schema = @Schema(implementation = Summary.class))
        )
    })
    public ResponseEntity<Summary> getSummary(Authentication authentication) {
        return getSummary(authentication, "week", null, null);
    }

    @GetMapping("/summary/period")
    @Operation(
        summary = "獲取統計摘要（指定參數）",
        description = "獲取用戶的統計摘要數據，可指定時間週期或日期範圍"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "統計摘要獲取成功",
            content = @Content(schema = @Schema(implementation = Summary.class))
        )
    })
    public ResponseEntity<Summary> getSummary(
            Authentication authentication,
            @Parameter(description = "時間週期：week, month, year")
            @RequestParam(name = "period", required = false) String period,
            @Parameter(description = "開始日期 (YYYY-MM-DD)")
            @RequestParam(name = "startDate", required = false) String startDate,
            @Parameter(description = "結束日期 (YYYY-MM-DD)")
            @RequestParam(name = "endDate", required = false) String endDate) {
        
        Long userId = (Long) authentication.getPrincipal();
        log.info("Getting summary for user: {}, period: {}, startDate: {}, endDate: {}", 
                userId, period, startDate, endDate);

        Summary summary;
        if (startDate != null && endDate != null) {
            // Custom date range
            summary = statisticsService.getSummaryByDateRange(userId, startDate, endDate);
        } else {
            // Period-based (default: week)
            summary = statisticsService.getSummary(userId, period);
        }

        return ResponseEntity.ok(summary);
    }

    @GetMapping("/activities/{activityId}")
    @Operation(
        summary = "獲取特定活動的統計數據",
        description = "獲取特定活動的統計數據（簡化版本）"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "活動統計數據獲取成功",
            content = @Content(schema = @Schema(implementation = ActivityStatsSimple.class))
        ),
        @ApiResponse(
            responseCode = "404",
            description = "活動不存在"
        )
    })
    public ResponseEntity<ActivityStatsSimple> getActivityStatistics(
            Authentication authentication,
            @Parameter(description = "活動ID")
            @PathVariable("activityId") String activityId) {
        
        Long userId = (Long) authentication.getPrincipal();
        UUID activityUuid = UUID.fromString(activityId);
        log.info("Getting activity statistics for user: {}, activity: {}", userId, activityId);

        ActivityStatsSimple stats = statisticsService.getActivityStatistics(activityUuid, userId);
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/activities/{activityId}/detailed")
    @Operation(
        summary = "獲取特定活動的詳細統計數據",
        description = "獲取特定活動的詳細統計數據，包含週期信息和趨勢"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "活動詳細統計數據獲取成功",
            content = @Content(schema = @Schema(implementation = ActivityStatistics.class))
        ),
        @ApiResponse(
            responseCode = "404",
            description = "活動不存在"
        )
    })
    public ResponseEntity<ActivityStatistics> getActivityStatisticsDetailed(
            Authentication authentication,
            @Parameter(description = "活動ID")
            @PathVariable("activityId") String activityId,
            @Parameter(description = "時間週期：week, month, year")
            @RequestParam(name = "period", required = false) String period) {
        
        Long userId = (Long) authentication.getPrincipal();
        UUID activityUuid = UUID.fromString(activityId);
        log.info("Getting detailed activity statistics for user: {}, activity: {}, period: {}", 
                userId, activityId, period);

        ActivityStatistics stats = statisticsService.getActivityStatisticsDetailed(activityUuid, userId, period);
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/weekly-trend")
    @Operation(
        summary = "獲取週趨勢數據",
        description = "獲取用戶或特定活動的週趨勢數據（最近8週）"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "週趨勢數據獲取成功",
            content = @Content(schema = @Schema(implementation = WeeklyTrendItem.class))
        ),
        @ApiResponse(
            responseCode = "404",
            description = "活動不存在（當提供activityId時）"
        )
    })
    public ResponseEntity<Map<String, List<WeeklyTrendItem>>> getWeeklyTrend(
            Authentication authentication,
            @Parameter(description = "活動ID（可選）")
            @RequestParam(name = "activityId", required = false) String activityId) {
        
        Long userId = (Long) authentication.getPrincipal();
        UUID activityUuid = activityId != null ? UUID.fromString(activityId) : null;
        log.info("Getting weekly trend for user: {}, activity: {}", userId, activityId);

        List<WeeklyTrendItem> trend = statisticsService.getWeeklyTrend(userId, activityUuid);
        return ResponseEntity.ok(Map.of("data", trend));
    }

    @GetMapping("/overview/kpis")
    @Operation(
        summary = "獲取全部活動 KPI 概覽",
        description = "根據日期區間獲取使用者全部活動的 KPI 指標"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "KPI 概覽獲取成功",
            content = @Content(schema = @Schema(implementation = OverviewKpis.class))
        )
    })
    public ResponseEntity<OverviewKpis> getOverviewKpis(
            Authentication authentication,
            @Parameter(description = "開始日期 (YYYY-MM-DD)", required = true)
            @RequestParam(name = "startDate") String startDate,
            @Parameter(description = "結束日期 (YYYY-MM-DD)", required = true)
            @RequestParam(name = "endDate") String endDate) {

        Long userId = (Long) authentication.getPrincipal();
        log.info("Getting overview KPIs for user: {}, startDate: {}, endDate: {}", userId, startDate, endDate);

        OverviewKpis kpis = statisticsService.getOverviewKpis(userId, startDate, endDate);
        return ResponseEntity.ok(kpis);
    }

    @GetMapping("/overview/distribution")
    @Operation(
        summary = "獲取全部活動佔比",
        description = "根據日期區間獲取使用者全部活動在紀錄次數與時間上的佔比（供甜甜圈圖使用）"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "活動佔比獲取成功",
            content = @Content(schema = @Schema(implementation = ActivityShareItem.class))
        )
    })
    public ResponseEntity<List<ActivityShareItem>> getOverviewDistribution(
            Authentication authentication,
            @Parameter(description = "開始日期 (YYYY-MM-DD)", required = true)
            @RequestParam(name = "startDate") String startDate,
            @Parameter(description = "結束日期 (YYYY-MM-DD)", required = true)
            @RequestParam(name = "endDate") String endDate) {

        Long userId = (Long) authentication.getPrincipal();
        log.info("Getting overview distribution for user: {}, startDate: {}, endDate: {}", userId, startDate, endDate);

        List<ActivityShareItem> items = statisticsService.getOverviewDistribution(userId, startDate, endDate);
        return ResponseEntity.ok(items);
    }

    @GetMapping("/overview/trend")
    @Operation(
        summary = "獲取全部活動趨勢資料",
        description = "根據日期區間獲取使用者全部活動每日總時間與紀錄次數（目前僅支援 day 粒度）"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "趨勢資料獲取成功",
            content = @Content(schema = @Schema(implementation = OverviewTrendPoint.class))
        )
    })
    public ResponseEntity<List<OverviewTrendPoint>> getOverviewTrend(
            Authentication authentication,
            @Parameter(description = "開始日期 (YYYY-MM-DD)", required = true)
            @RequestParam(name = "startDate") String startDate,
            @Parameter(description = "結束日期 (YYYY-MM-DD)", required = true)
            @RequestParam(name = "endDate") String endDate,
            @Parameter(description = "時間粒度，目前僅支援 day", example = "day")
            @RequestParam(name = "grain", defaultValue = "day") String grain) {

        Long userId = (Long) authentication.getPrincipal();
        log.info("Getting overview trend for user: {}, startDate: {}, endDate: {}, grain: {}", userId, startDate, endDate, grain);

        List<OverviewTrendPoint> data = statisticsService.getOverviewTrend(userId, startDate, endDate, grain);
        return ResponseEntity.ok(data);
    }

    @GetMapping("/overview/logs")
    @Operation(
        summary = "獲取全部活動紀錄列表",
        description = "根據日期區間獲取使用者全部活動的紀錄列表（分頁）"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "紀錄列表獲取成功",
            content = @Content(schema = @Schema(implementation = PagedOverviewLogResponse.class))
        )
    })
    public ResponseEntity<PagedOverviewLogResponse> getOverviewLogs(
            Authentication authentication,
            @Parameter(description = "開始日期 (YYYY-MM-DD)", required = true)
            @RequestParam(name = "startDate") String startDate,
            @Parameter(description = "結束日期 (YYYY-MM-DD)", required = true)
            @RequestParam(name = "endDate") String endDate,
            @Parameter(description = "頁碼（從 0 開始）", example = "0")
            @RequestParam(name = "page", defaultValue = "0") int page,
            @Parameter(description = "每頁大小", example = "50")
            @RequestParam(name = "pageSize", defaultValue = "50") int pageSize) {

        Long userId = (Long) authentication.getPrincipal();
        log.info("Getting overview logs for user: {}, startDate: {}, endDate: {}, page: {}, pageSize: {}", userId, startDate, endDate, page, pageSize);

        PagedOverviewLogResponse response = statisticsService.getOverviewLogs(userId, startDate, endDate, page, pageSize);
        return ResponseEntity.ok(response);
    }
}
