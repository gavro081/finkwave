package com.ukim.finki.develop.finkwave.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ukim.finki.develop.finkwave.model.NonAdminUser;

import java.util.List;
import java.util.Optional;

@Repository
public interface NonAdminUserRepository extends JpaRepository<NonAdminUser, Long> {

    @Query("""
        SELECT n FROM NonAdminUser n JOIN FETCH n.user
    """)
    List<NonAdminUser> findAllWithUser();

    @Query("""
        SELECT u FROM NonAdminUser u
        WHERE u.user.fullName ILIKE '%' || :name || '%'
        OR  u.user.username ILIKE '%' || :name || '%'
    """)
    List<NonAdminUser> searchByName(String name);

    @Query("""
        SELECT nau FROM NonAdminUser nau
        JOIN FETCH nau.user u
        WHERE u.username = :username
        """)
    Optional<NonAdminUser> findByUsername(@Param("username") String username);



}
