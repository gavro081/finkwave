package com.ukim.finki.develop.finkwave.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ukim.finki.develop.finkwave.model.MusicalEntity;

@Repository
public interface MusicalEntityRepository extends JpaRepository<MusicalEntity, Long> {
}
