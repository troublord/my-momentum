package com.ramble.mymomentum.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "活動分佈數據項目")
public class DistributionItem {
    
    @Schema(description = "日期", example = "2025-09-03")
    private String date;
    
    @Schema(description = "該時段的總秒數", example = "1800")
    private Integer durationSec;
    
    @Schema(description = "該時段的記錄數", example = "1")
    private Integer count;
}
