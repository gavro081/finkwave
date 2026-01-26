package com.ukim.finki.develop.finkwave.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ukim.finki.develop.finkwave.model.Follow;
import com.ukim.finki.develop.finkwave.model.FollowId;

@Repository
public interface FollowRepository extends JpaRepository<Follow, FollowId> {

    // count how many followers the user has
    long countByFolloweeId(Long userId);

    //count how many users does this user follow
    long countByFollowerId(Long userId);

}
