package com.ramble.mymomentum.dto;

import com.ramble.mymomentum.enums.RecordSource;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "活動記錄響應")
public class RecordResponse {

    @Schema(description = "記錄ID", example = "550e8400-e29b-41d4-a716-446655440000")
    private UUID id;

    @Schema(description = "活動ID", example = "550e8400-e29b-41d4-a716-446655440000")
    private UUID activityId;

    @Schema(description = "記錄來源", example = "LIVE")
    private RecordSource source;

    @Schema(description = "持續時間（秒）", example = "3600")
    private Integer duration;

    @Schema(description = "執行時間", example = "2024-01-15T10:30:00Z")
    private Instant executedAt;

    @Schema(description = "創建時間", example = "2024-01-15T10:30:00Z")
    private Instant createdAt;

    @Schema(description = "更新時間", example = "2024-01-15T10:30:00Z")
    private Instant updatedAt;
}
