package com.ramble.mymomentum.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "全部活動紀錄分頁響應")
public class PagedOverviewLogResponse {

    @Schema(description = "紀錄列表")
    private List<OverviewLogItem> data;

    @Schema(description = "當前頁碼（從 0 開始）", example = "0")
    private int page;

    @Schema(description = "每頁大小", example = "50")
    private int size;

    @Schema(description = "總紀錄數", example = "150")
    private long total;
}



