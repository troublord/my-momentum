package com.ramble.mymomentum.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "全部活動趨勢資料點")
public class OverviewTrendPoint {

    @Schema(description = "日期（YYYY-MM-DD）", example = "2025-03-21")
    private String date;

    @Schema(description = "該日總紀錄時間（秒）", example = "5400")
    private Long totalDurationSec;

    @Schema(description = "該日總紀錄次數", example = "8")
    private Integer totalCount;
}


