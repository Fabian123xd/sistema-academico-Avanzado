package com.sistemaacademico.sistema_academico.controller;

import com.sistemaacademico.sistema_academico.model.Matricula;
import com.sistemaacademico.sistema_academico.repository.MatriculaRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/matriculas")
public class MatriculaController {

    private final MatriculaRepository repo;

    public MatriculaController(MatriculaRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Matricula> list() {
        return repo.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Matricula> get(@PathVariable Long id) {
        return repo.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Matricula> create(@RequestBody Matricula m) {
        return ResponseEntity.ok(repo.save(m));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Matricula> update(@PathVariable Long id, @RequestBody Matricula m) {
        return repo.findById(id).map(existing -> {
            existing.setAlumno(m.getAlumno());
            existing.setCurso(m.getCurso());
            existing.setFechaMatricula(m.getFechaMatricula());
            existing.setEstado(m.getEstado());
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
