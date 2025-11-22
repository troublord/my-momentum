package com.ramble.mymomentum.dto;

import com.ramble.mymomentum.enums.RecordSource;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "全部活動紀錄列表項目")
public class OverviewLogItem {

    @Schema(description = "紀錄 ID", example = "550e8400-e29b-41d4-a716-446655440000")
    private UUID recordId;

    @Schema(description = "活動 ID", example = "550e8400-e29b-41d4-a716-446655440000")
    private UUID activityId;

    @Schema(description = "活動名稱", example = "Deep Work")
    private String activityName;

    @Schema(description = "活動圖示（emoji）", example = "📚")
    private String icon;

    @Schema(description = "記錄來源", example = "LIVE")
    private RecordSource source;

    @Schema(description = "持續時間（秒）", example = "3600")
    private Integer durationSec;

    @Schema(description = "執行時間", example = "2025-03-21T10:30:00Z")
    private Instant executedAt;
}



