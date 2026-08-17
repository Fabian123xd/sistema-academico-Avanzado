package com.sistemaacademico.sistema_academico.repository;

import com.sistemaacademico.sistema_academico.model.Matricula;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MatriculaRepository extends JpaRepository<Matricula, Long> {

}
