package com.ukim.finki.develop.finkwave.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ukim.finki.develop.finkwave.model.MusicalEntity;

import java.util.List;

@Repository
public interface MusicalEntityRepository extends JpaRepository<MusicalEntity, Long> {

    List<MusicalEntity>findAllByReleasedBy_Id(Long id);
}
