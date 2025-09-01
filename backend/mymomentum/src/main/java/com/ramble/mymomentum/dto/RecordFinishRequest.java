package com.ramble.mymomentum.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "完成LIVE記錄請求")
public class RecordFinishRequest {

    @NotNull(message = "End time is required")
    @Schema(description = "結束時間", example = "2024-01-15T11:30:00Z")
    private Instant endAt;
}
