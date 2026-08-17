package com.sistemaacademico.sistema_academico.controller;

import com.sistemaacademico.sistema_academico.model.Alumno;
import com.sistemaacademico.sistema_academico.repository.AlumnoRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/alumnos")
public class AlumnoController {

    private final AlumnoRepository repo;

    public AlumnoController(AlumnoRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Alumno> list() {
        return repo.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Alumno> get(@PathVariable Long id) {
        return repo.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Alumno> create(@RequestBody Alumno a) {
        Alumno saved = repo.save(a);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Alumno> update(@PathVariable Long id, @RequestBody Alumno a) {
        return repo.findById(id).map(existing -> {
            existing.setNombre(a.getNombre());
            existing.setEmail(a.getEmail());
            existing.setFechaNacimiento(a.getFechaNacimiento());
            repo.save(existing);
            return ResponseEntity.ok(existing);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        return repo.findById(id).map(existing -> {
            repo.deleteById(id);
            return ResponseEntity.noContent().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }

}
