package com.ukim.finki.develop.finkwave.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ukim.finki.develop.finkwave.model.NonAdminUser;

@Repository
public interface NonAdminUserRepository extends JpaRepository<NonAdminUser, Long> {
}
