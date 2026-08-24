package com.sistemaacademico.sistema_academico.config;

import com.fasterxml.jackson.datatype.hibernate6.Hibernate6Module;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Registra el modulo de Jackson para Hibernate 6.
 *
 * Sin esto, cuando un @RestController devuelve directamente una entidad
 * (ej. Curso) que tiene relaciones @ManyToOne/@OneToOne con fetch = LAZY
 * (docente, periodo, etc.), Jackson intenta serializar el proxy interno
 * que genera Hibernate (ByteBuddyInterceptor) y falla con:
 *   "Type definition error: [simple type, class org.hibernate.proxy.pojo.bytebuddy.ByteBuddyInterceptor]"
 *
 * FORCE_LAZY_LOADING hace que, si la relacion todavia no fue cargada,
 * Jackson la inicialice (usando la sesion abierta gracias a
 * spring.jpa.open-in-view=true) y la serialice con sus datos reales,
 * en vez de dejarla en null o lanzar el error de arriba.
 */
@Configuration
public class JacksonConfig {

    @Bean
    public Hibernate6Module hibernate6Module() {
        Hibernate6Module module = new Hibernate6Module();
        module.enable(Hibernate6Module.Feature.FORCE_LAZY_LOADING);
        return module;
    }
}
