package com.ukim.finki.develop.finkwave.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ukim.finki.develop.finkwave.model.Follow;
import com.ukim.finki.develop.finkwave.model.FollowId;

import java.util.List;

@Repository
public interface FollowRepository extends JpaRepository<Follow, FollowId> {

    // count how many followers the user has
    long countByFolloweeId(Long userId);

    //count how many users does this user follow
    long countByFollowerId(Long userId);

    @Query("SELECT CASE WHEN COUNT (f)>0 THEN  true ELSE false END " +
            "FROM Follow f "+
            "WHERE f.followee.id=:selectedUserId AND f.follower.id=:currentUserId")
    boolean isFollowing(@Param("currentUserId") Long currentUSerId,@Param("selectedUserId")Long selectedUserId);

    List<Follow>getFollowsByFollowee_Id(Long id);

    List<Follow>getFollowsByFollower_Id(Long id);

}
