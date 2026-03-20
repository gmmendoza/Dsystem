package com.sistema.docentes.service;

import com.sistema.docentes.dto.AuthDto;
import com.sistema.docentes.entity.Usuario;
import com.sistema.docentes.repository.UsuarioRepository;
import com.sistema.docentes.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    public AuthDto.AuthResponse register(AuthDto.RegisterRequest request) {
        if (usuarioRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("El username ya está en uso: " + request.getUsername());
        }
        if (usuarioRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("El email ya está registrado: " + request.getEmail());
        }

        Usuario usuario = Usuario.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .email(request.getEmail())
                .rol(Usuario.Rol.DOCENTE)
                .build();

        usuarioRepository.save(usuario);

        String token = jwtUtil.generateToken(usuario);

        return AuthDto.AuthResponse.builder()
                .token(token)
                .username(usuario.getUsername())
                .rol(usuario.getRol().name())
                .mensaje("Usuario registrado exitosamente")
                .build();
    }

    public AuthDto.AuthResponse login(AuthDto.LoginRequest request) {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                request.getUsername(),
                request.getPassword()
            )
        );

        Usuario usuario = usuarioRepository.findByUsername(request.getUsername())
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        String token = jwtUtil.generateToken(usuario);

        return AuthDto.AuthResponse.builder()
                .token(token)
                .username(usuario.getUsername())
                .rol(usuario.getRol().name())
                .mensaje("Login exitoso")
                .build();
    }
}
