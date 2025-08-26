package com.ramble.mymomentum.dto;

import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateActivityRequest {
    private String name;
    
    @Positive(message = "Target time must be positive")
    private Integer targetTime;  // 分鐘
    
    private String color;
    private String icon;
}
