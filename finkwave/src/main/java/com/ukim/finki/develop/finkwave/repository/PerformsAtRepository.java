package com.ukim.finki.develop.finkwave.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ukim.finki.develop.finkwave.model.PerformsAt;
import com.ukim.finki.develop.finkwave.model.PerformsAtId;

@Repository
public interface PerformsAtRepository extends JpaRepository<PerformsAt, PerformsAtId> {
}
