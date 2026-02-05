package com.ukim.finki.develop.finkwave.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ukim.finki.develop.finkwave.model.Artist;

@Repository
public interface ArtistRepository extends JpaRepository<Artist, Long> {

    @Query("""
        SELECT DISTINCT a FROM Artist a
        JOIN FETCH a.nonAdminUser nu
        JOIN FETCH nu.user
        WHERE a.id=:artistId
        """)
    Optional<Artist>findByIdWithUser(@Param("artistId")Long artistId);

    @Query("""
            SELECT a FROM Artist a
            JOIN FETCH a.nonAdminUser nau
            JOIN FETCH nau.user u
            WHERE u.username = :username
            """)
    Optional<Artist> findByUsername(@Param("username") String username);


}
