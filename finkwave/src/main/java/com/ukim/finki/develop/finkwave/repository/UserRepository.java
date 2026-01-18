package com.ukim.finki.develop.finkwave.repository;

import com.ukim.finki.develop.finkwave.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
}
