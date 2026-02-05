package com.ukim.finki.develop.finkwave.repository;

import com.ukim.finki.develop.finkwave.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);


    @Query("""
        SELECT u from User u
        WHERE (u.fullName ilike %:searchTerm% or u.username ilike %:searchTerm%)
            and u.listener = true and u.artist = false 
        """)
    List<User> searchListeners(String searchTerm);

    @Query("""
        SELECT u from User u
        WHERE (u.fullName ilike %:searchTerm% or u.username ilike %:searchTerm%)
            and u.artist = true
        """)
    List<User> searchArtists(String searchTerm);
}
