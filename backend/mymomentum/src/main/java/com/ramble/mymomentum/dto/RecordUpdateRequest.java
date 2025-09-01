package com.ramble.mymomentum.dto;

import com.ramble.mymomentum.enums.RecordSource;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "更新活動記錄請求")
public class RecordUpdateRequest {

    @NotNull(message = "Activity ID is required")
    @Schema(description = "活動ID", example = "550e8400-e29b-41d4-a716-446655440000")
    private UUID activityId;

    @NotNull(message = "Source is required")
    @Schema(description = "記錄來源 (LIVE: 實時記錄, MANUAL: 手動記錄)", allowableValues = {"LIVE", "MANUAL"})
    private RecordSource source;

    @Positive(message = "Duration must be positive when provided")
    @Schema(description = "持續時間（秒）- MANUAL記錄必需，LIVE記錄必須為null", example = "3600")
    private Integer duration;

    @NotNull(message = "Executed at is required")
    @Schema(description = "執行時間", example = "2024-01-15T10:30:00Z")
    private Instant executedAt;
}
