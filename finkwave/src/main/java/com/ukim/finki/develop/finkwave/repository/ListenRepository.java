package com.ukim.finki.develop.finkwave.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ukim.finki.develop.finkwave.model.Listen;
import com.ukim.finki.develop.finkwave.model.ListenId;

@Repository
public interface ListenRepository extends JpaRepository<Listen, ListenId> {
}
