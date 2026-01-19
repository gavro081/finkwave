package com.ukim.finki.develop.finkwave.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ukim.finki.develop.finkwave.model.Like;
import com.ukim.finki.develop.finkwave.model.LikeId;

@Repository
public interface LikeRepository extends JpaRepository<Like, LikeId> {
}
