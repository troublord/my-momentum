package com.ramble.mymomentum.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WeeklyTrendItem {
    private String weekStart;  // YYYY-MM-DD format (Monday start)
    private Integer minutes;   // Total minutes for that week
}
