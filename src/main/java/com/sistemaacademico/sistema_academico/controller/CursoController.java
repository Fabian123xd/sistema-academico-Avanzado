package com.sistemaacademico.sistema_academico.controller;

import com.sistemaacademico.sistema_academico.model.Curso;
import com.sistemaacademico.sistema_academico.repository.CursoRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cursos")
public class CursoController {

    private final CursoRepository repo;

    public CursoController(CursoRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Curso> list() {
        return repo.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Curso> get(@PathVariable Long id) {
        return repo.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Curso> create(@RequestBody Curso c) {
        return ResponseEntity.ok(repo.save(c));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Curso> update(@PathVariable Long id, @RequestBody Curso c) {
        return repo.findById(id).map(existing -> {
            existing.setCodigo(c.getCodigo());
            existing.setNombre(c.getNombre());
            existing.setCreditos(c.getCreditos());
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
