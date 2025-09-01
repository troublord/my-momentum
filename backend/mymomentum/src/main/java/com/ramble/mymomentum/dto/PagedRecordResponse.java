package com.ramble.mymomentum.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "分頁活動記錄響應")
public class PagedRecordResponse {

    @Schema(description = "記錄數據")
    private List<RecordResponse> data;

    @Schema(description = "當前頁碼", example = "0")
    private int page;

    @Schema(description = "每頁大小", example = "20")
    private int size;

    @Schema(description = "總記錄數", example = "100")
    private long total;
}
