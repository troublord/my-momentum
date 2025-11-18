package com.ramble.mymomentum.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "活動佔比資訊（供圓餅圖/甜甜圈圖使用）")
public class ActivityShareItem {

    @Schema(description = "活動 ID", example = "550e8400-e29b-41d4-a716-446655440000")
    private UUID activityId;

    @Schema(description = "活動名稱", example = "Deep Work")
    private String activityName;

    @Schema(description = "活動圖示（emoji）", example = "📚")
    private String icon;

    @Schema(description = "紀錄次數", example = "24")
    private Integer count;

    @Schema(description = "總紀錄時間（秒）", example = "7200")
    private Long totalDurationSec;
}


