package com.ukim.finki.develop.finkwave.repository;

import com.ukim.finki.develop.finkwave.model.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UsersRepository extends JpaRepository<Users, Long> {
}
