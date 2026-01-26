package com.ukim.finki.develop.finkwave.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ukim.finki.develop.finkwave.model.Listener;

@Repository
public interface ListenerRepository extends JpaRepository<Listener, Long> {
    @Query("SELECT DISTINCT l FROM Listener l " +
           "JOIN FETCH l.nonAdminUser nu " +
           "JOIN FETCH nu.user " +
           "WHERE l.id = :listenerId")
    Optional<Listener> findByIdWithUser(@Param("listenerId") Long listenerId);
}
