package com.ramble.mymomentum.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "活動 KPI 指標")
public class ActivityKPIs {
    
    @Schema(description = "平均每次記錄秒數", example = "1550")
    private Integer avgDurationSec;
    
    @Schema(description = "最長單次記錄秒數", example = "4800")
    private Integer maxSingleDurationSec;
    
    @Schema(description = "週環比變化", example = "0.18", minimum = "-1.0", maximum = "1.0")
    private Double weekOverWeekChangePct;
}
