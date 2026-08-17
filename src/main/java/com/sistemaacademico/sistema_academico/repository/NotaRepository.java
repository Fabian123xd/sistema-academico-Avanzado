package com.sistemaacademico.sistema_academico.repository;

import com.sistemaacademico.sistema_academico.model.Nota;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NotaRepository extends JpaRepository<Nota, Long> {

}
