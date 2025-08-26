package com.ramble.mymomentum.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ErrorResponse {
    private ErrorDetail error;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ErrorDetail {
        private String code;
        private String message;
    }
    
    public static ErrorResponse of(String code, String message) {
        return new ErrorResponse(new ErrorDetail(code, message));
    }
}
