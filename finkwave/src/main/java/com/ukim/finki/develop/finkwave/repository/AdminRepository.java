package com.ukim.finki.develop.finkwave.repository;

import com.ukim.finki.develop.finkwave.model.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AdminRepository extends JpaRepository<Admin, Long> {
}
