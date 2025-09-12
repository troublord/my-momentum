package com.ramble.mymomentum.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "活動趨勢數據項目")
public class TrendItem {
    
    @Schema(description = "時段開始日期", example = "2025-08-18")
    private String periodStart;
    
    @Schema(description = "該時段總秒數", example = "5400")
    private Integer totalDurationSec;
    
    @Schema(description = "該時段總記錄數", example = "4")
    private Integer totalCount;
}
