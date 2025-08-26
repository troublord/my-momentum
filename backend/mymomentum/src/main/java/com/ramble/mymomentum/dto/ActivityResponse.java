package com.ramble.mymomentum.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ActivityResponse {
    private String id;
    private String name;
    private Integer totalTime;    // 分鐘
    private Integer weeklyTime;   // 分鐘
    private Integer targetTime;   // 分鐘
    private String color;         // 例: "#3b82f6"
    private String icon;          // 例: "book"
}
