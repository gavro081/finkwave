package com.ukim.finki.develop.finkwave.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.ukim.finki.develop.finkwave.model.NonAdminUser;

import java.util.List;

@Repository
public interface NonAdminUserRepository extends JpaRepository<NonAdminUser, Long> {

    @Query("SELECT n FROM NonAdminUser n JOIN FETCH n.user")
    List<NonAdminUser> findAllWithUser();

    @Query("SELECT u FROM NonAdminUser u " +
            "WHERE u.user.fullName ILIKE CONCAT('%', :name, '%' ) "+
            "OR  u.user.username ILIKE CONCAT('%', :name, '%' ) ")
    List<NonAdminUser> searchByName(String name);



}
