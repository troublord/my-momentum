package com.ramble.mymomentum.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Summary {
    private Integer weeklyTotalTime;      // Total minutes in the period (duration NOT NULL)
    private String mostFrequentActivity;  // Activity name with largest total minutes, null if no records
    private Double completionRate;        // totalTime / (scaled target), 0 if denominator = 0
}
