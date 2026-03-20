package com.sistema.docentes.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

public class AuthDto {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RegisterRequest {
        @NotBlank(message = "El username no puede estar vacío")
        private String username;

        @NotBlank(message = "La contraseña no puede estar vacía")
        private String password;

        @NotBlank(message = "El email no puede estar vacío")
        @Email(message = "El email debe tener un formato válido")
        private String email;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LoginRequest {
        @NotBlank(message = "El username no puede estar vacío")
        private String username;

        @NotBlank(message = "La contraseña no puede estar vacía")
        private String password;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AuthResponse {
        private String token;
        private String username;
        private String rol;
        private String mensaje;
    }
}
