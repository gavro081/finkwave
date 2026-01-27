package com.ukim.finki.develop.finkwave.service;

import com.ukim.finki.develop.finkwave.exceptions.FollowException;
import com.ukim.finki.develop.finkwave.exceptions.UserNotFoundException;
import com.ukim.finki.develop.finkwave.model.Follow;
import com.ukim.finki.develop.finkwave.model.FollowId;
import com.ukim.finki.develop.finkwave.model.NonAdminUser;
import com.ukim.finki.develop.finkwave.repository.FollowRepository;
import com.ukim.finki.develop.finkwave.repository.NonAdminUserRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class FollowService {

    private final FollowRepository followRepository;
    private final NonAdminUserRepository nonAdminUserRepository;
    private final AuthService authService;


    public boolean toggleFollow(Long id){
        Long currentUserId=authService.getCurrentUserID();

        if (currentUserId.equals(id)){
            throw new FollowException("Cannot follow yourself");
        }

        FollowId followId=new FollowId(currentUserId,id);


        if (followRepository.existsById(followId)){
            followRepository.deleteById(followId);
            return false;
        }else{
            NonAdminUser follower = nonAdminUserRepository.findById(currentUserId)
                    .orElseThrow(UserNotFoundException::new);
            NonAdminUser followee = nonAdminUserRepository.findById(id)
                    .orElseThrow(UserNotFoundException::new);

            followRepository.save(new Follow(follower, followee));
            return true;
        }

    }
}
