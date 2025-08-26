package com.ramble.mymomentum.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateActivityRequest {
    
    @NotBlank(message = "Activity name is required")
    private String name;
    
    @NotNull(message = "Target time is required")
    @Positive(message = "Target time must be positive")
    private Integer targetTime; // Target time in minutes
    
    @NotBlank(message = "Color is required")
    private String color;
    
    @NotBlank(message = "Icon is required")
    private String icon;
} 