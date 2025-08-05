package com.ramble.mymomentum.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateActivityRequest {
    private String name;
    private Integer goalTime; // Weekly goal time in seconds
    private String color;
    private String icon;
} 