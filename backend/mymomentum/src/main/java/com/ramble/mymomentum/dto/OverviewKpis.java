package com.ramble.mymomentum.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "全部活動 KPI 概覽")
public class OverviewKpis {

    @Schema(description = "總完成紀錄數（duration 非空）", example = "120")
    private Integer totalCount;

    @Schema(description = "總紀錄時間（秒）", example = "43200")
    private Long totalDurationSec;

    @Schema(description = "活躍天數（有紀錄的天數）", example = "5")
    private Integer activeDays;

    @Schema(description = "平均每日紀錄時間（秒，依活躍天數計算）", example = "8640")
    private Integer avgDurationPerDaySec;

    @Schema(description = "週環比變化（相較於前一個同長度區間的變化比例）", example = "0.18")
    private Double weekOverWeekChangePct;
}


