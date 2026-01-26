package com.ukim.finki.develop.finkwave.repository;

import com.ukim.finki.develop.finkwave.model.dto.NonAdminUserDTO;
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
            "WHERE LOWER(u.user.fullName) LIKE LOWER(CONCAT('%', :name, '%') )"+
            "OR  LOWER(u.user.username) LIKE LOWER(CONCAT('%', :name, '%' )) ")
    List<NonAdminUser> searchByName(String name);



}
