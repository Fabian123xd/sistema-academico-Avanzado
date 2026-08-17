package com.sistemaacademico.sistema_academico.repository;

import com.sistemaacademico.sistema_academico.model.Alumno;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AlumnoRepository extends JpaRepository<Alumno, Long> {

}
