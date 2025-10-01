package com.ramble.mymomentum.dto;

import com.ramble.mymomentum.enums.RecordSource;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "最後一次活動日記錄響應")
public class LastDayRecordsResponse {

    @Schema(description = "最後一次有紀錄的日期", example = "2025-10-01")
    private String lastDate;

    @Schema(description = "上次活動日的總時長（秒）", example = "50")
    private Integer lastDateDuration;

    @Schema(description = "活動記錄清單")
    private List<LastDayRecordItem> records;

    @Schema(description = "今日總時長（秒）", example = "30")
    private Integer todayDuration;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "最後活動日記錄項目")
    public static class LastDayRecordItem {

        @Schema(description = "活動名稱", example = "跑步")
        private String activityName;

        @Schema(description = "紀錄時間", example = "08:00")
        private String recordTime;

        @Schema(description = "持續時間（秒）", example = "30")
        private Integer duration;

        @Schema(description = "資料來源", example = "LIVE")
        private RecordSource source;
    }
}
