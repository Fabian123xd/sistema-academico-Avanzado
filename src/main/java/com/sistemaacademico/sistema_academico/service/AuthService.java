package com.sistemaacademico.sistema_academico.service;

import com.sistemaacademico.sistema_academico.dto.LoginRequest;
import com.sistemaacademico.sistema_academico.dto.LoginResponse;
import com.sistemaacademico.sistema_academico.model.Usuario;
import com.sistemaacademico.sistema_academico.repository.UsuarioRepository;
import com.sistemaacademico.sistema_academico.security.JwtService;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UsuarioRepository usuarioRepository;
    private final JwtService jwtService;

    public AuthService(AuthenticationManager authenticationManager, UsuarioRepository usuarioRepository, JwtService jwtService) {
        this.authenticationManager = authenticationManager;
        this.usuarioRepository = usuarioRepository;
        this.jwtService = jwtService;
    }

    public LoginResponse login(LoginRequest request) {
        // El identificador puede ser el email o el codigo de acceso (A..., D..., U...).
        Usuario usuario = usuarioRepository.findByEmail(request.identificador())
                .or(() -> usuarioRepository.findByCodigo(request.identificador()))
                .orElseThrow(() -> new BadCredentialsException("Credenciales invalidas"));

        // Spring Security autentica siempre contra el email, que es el "username" real del UserDetails.
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(usuario.getEmail(), request.password()));

        String nombreCompleto = usuario.getNombres() + " " + usuario.getApellidos();
        String token = jwtService.generateToken(usuario.getEmail(), usuario.getRol().name(), usuario.getId(), nombreCompleto);

        return new LoginResponse(token, usuario.getId(), nombreCompleto, usuario.getEmail(), usuario.getCodigo(), usuario.getRol().name());
    }
}
