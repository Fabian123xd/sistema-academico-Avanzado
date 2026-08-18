package com.sistemaacademico.sistema_academico.controller;

import com.sistemaacademico.sistema_academico.dto.LoginRequest;
import com.sistemaacademico.sistema_academico.dto.LoginResponse;
import com.sistemaacademico.sistema_academico.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }
}
