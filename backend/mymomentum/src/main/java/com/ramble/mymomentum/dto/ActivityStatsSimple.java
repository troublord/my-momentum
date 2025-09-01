package com.ramble.mymomentum.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ActivityStatsSimple {
    private Integer totalTime;      // All time total minutes
    private Integer weeklyTime;     // Current week minutes
    private Double completionRate;  // Current week completion rate
}
