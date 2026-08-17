package com.sistemaacademico.sistema_academico.controller;

import com.sistemaacademico.sistema_academico.model.Nota;
import com.sistemaacademico.sistema_academico.repository.NotaRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notas")
public class NotaController {

    private final NotaRepository repo;

    public NotaController(NotaRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Nota> list() {
        return repo.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Nota> get(@PathVariable Long id) {
        return repo.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Nota> create(@RequestBody Nota n) {
        return ResponseEntity.ok(repo.save(n));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Nota> update(@PathVariable Long id, @RequestBody Nota n) {
        return repo.findById(id).map(existing -> {
            existing.setMatricula(n.getMatricula());
            existing.setValor(n.getValor());
            existing.setComentario(n.getComentario());
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
