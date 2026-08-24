package com.sistemaacademico.sistema_academico.service;

import com.sistemaacademico.sistema_academico.dto.CrearUsuarioRequest;
import com.sistemaacademico.sistema_academico.dto.UsuarioResponse;
import com.sistemaacademico.sistema_academico.exception.ApiException;
import com.sistemaacademico.sistema_academico.model.*;
import com.sistemaacademico.sistema_academico.repository.DocenteRepository;
import com.sistemaacademico.sistema_academico.repository.EstudianteRepository;
import com.sistemaacademico.sistema_academico.repository.UsuarioRepository;
import java.time.LocalDate;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * El administrador usa este servicio para dar de alta/baja docentes y estudiantes.
 * El codigo de acceso (login) vive de forma centralizada en Usuario.codigo, sin
 * importar el rol: es la misma tabla de perfiles descrita en el diseño del sistema.
 */
@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final DocenteRepository docenteRepository;
    private final EstudianteRepository estudianteRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioService(UsuarioRepository usuarioRepository, DocenteRepository docenteRepository,
                           EstudianteRepository estudianteRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.docenteRepository = docenteRepository;
        this.estudianteRepository = estudianteRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public UsuarioResponse crearDocente(CrearUsuarioRequest req) {
        Usuario usuario = crearUsuarioBase(req, Rol.DOCENTE, "D");
        Docente docente = new Docente();
        docente.setUsuario(usuario);
        docente.setEspecialidad(req.especialidad());
        docente.setTelefono(req.telefono());
        docenteRepository.save(docente);
        return toResponse(usuario);
    }

    @Transactional
    public UsuarioResponse crearEstudiante(CrearUsuarioRequest req) {
        Usuario usuario = crearUsuarioBase(req, Rol.ESTUDIANTE, "U");
        Estudiante estudiante = new Estudiante();
        estudiante.setUsuario(usuario);
        estudiante.setTelefono(req.telefono());
        if (req.fechaNacimiento() != null && !req.fechaNacimiento().isBlank()) {
            estudiante.setFechaNacimiento(LocalDate.parse(req.fechaNacimiento()));
        }
        estudianteRepository.save(estudiante);
        return toResponse(usuario);
    }

    private Usuario crearUsuarioBase(CrearUsuarioRequest req, Rol rol, String prefijoCodigo) {
        if (usuarioRepository.existsByEmail(req.email())) {
            throw new ApiException("Ya existe un usuario con ese email", HttpStatus.CONFLICT);
        }
        if (req.codigo() != null && !req.codigo().isBlank() && usuarioRepository.existsByCodigo(req.codigo())) {
            throw new ApiException("Ya existe un usuario con ese codigo", HttpStatus.CONFLICT);
        }

        Usuario usuario = new Usuario();
        usuario.setNombres(req.nombres());
        usuario.setApellidos(req.apellidos());
        usuario.setEmail(req.email());
        usuario.setPassword(passwordEncoder.encode(req.password()));
        usuario.setRol(rol);
        usuario.setActivo(true);
        usuario = usuarioRepository.save(usuario);

        // Si el admin no definio un codigo propio, se autogenera uno legible ligado al id.
        String codigo = (req.codigo() != null && !req.codigo().isBlank())
                ? req.codigo()
                : prefijoCodigo + String.format("%08d", usuario.getId());
        usuario.setCodigo(codigo);
        return usuarioRepository.save(usuario);
    }

    public List<UsuarioResponse> listarPorRol(Rol rol) {
        return usuarioRepository.findByRol(rol).stream().map(this::toResponse).toList();
    }

    @Transactional
    public UsuarioResponse cambiarEstado(Long usuarioId, boolean activo) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new ApiException("Usuario no encontrado", HttpStatus.NOT_FOUND));
        usuario.setActivo(activo);
        usuarioRepository.save(usuario);
        return toResponse(usuario);
    }

    @Transactional
    public void eliminar(Long usuarioId) {
        if (!usuarioRepository.existsById(usuarioId)) {
            throw new ApiException("Usuario no encontrado", HttpStatus.NOT_FOUND);
        }
        usuarioRepository.deleteById(usuarioId);
    }

    private UsuarioResponse toResponse(Usuario u) {
        return new UsuarioResponse(u.getId(), u.getNombres(), u.getApellidos(), u.getEmail(),
                u.getRol().name(), u.isActivo(), u.getCodigo());
    }
}
