package com.sistemaacademico.sistema_academico.controller;

import com.sistemaacademico.sistema_academico.dto.CrearUsuarioRequest;
import com.sistemaacademico.sistema_academico.dto.UsuarioResponse;
import com.sistemaacademico.sistema_academico.model.Rol;
import com.sistemaacademico.sistema_academico.service.UsuarioService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/** El administrador crea, lista, activa/desactiva y elimina docentes y estudiantes. */
@RestController
@RequestMapping("/api/admin/usuarios")
public class AdminUsuarioController {

    private final UsuarioService usuarioService;

    public AdminUsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @PostMapping("/docentes")
    public ResponseEntity<UsuarioResponse> crearDocente(@Valid @RequestBody CrearUsuarioRequest req) {
        return ResponseEntity.ok(usuarioService.crearDocente(req));
    }

    @PostMapping("/estudiantes")
    public ResponseEntity<UsuarioResponse> crearEstudiante(@Valid @RequestBody CrearUsuarioRequest req) {
        return ResponseEntity.ok(usuarioService.crearEstudiante(req));
    }

    @GetMapping("/docentes")
    public List<UsuarioResponse> listarDocentes() {
        return usuarioService.listarPorRol(Rol.DOCENTE);
    }

    @GetMapping("/estudiantes")
    public List<UsuarioResponse> listarEstudiantes() {
        return usuarioService.listarPorRol(Rol.ESTUDIANTE);
    }

    @PatchMapping("/{id}/estado")
    public UsuarioResponse cambiarEstado(@PathVariable Long id, @RequestParam boolean activo) {
        return usuarioService.cambiarEstado(id, activo);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        usuarioService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
