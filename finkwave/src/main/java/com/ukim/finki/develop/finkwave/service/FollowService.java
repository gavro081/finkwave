package com.ukim.finki.develop.finkwave.service;

import com.ukim.finki.develop.finkwave.exceptions.FollowException;
import com.ukim.finki.develop.finkwave.exceptions.UserNotFoundException;
import com.ukim.finki.develop.finkwave.model.Follow;
import com.ukim.finki.develop.finkwave.model.FollowId;
import com.ukim.finki.develop.finkwave.model.NonAdminUser;
import com.ukim.finki.develop.finkwave.model.dto.FollowStatusDto;
import com.ukim.finki.develop.finkwave.model.dto.NonAdminUserDto;
import com.ukim.finki.develop.finkwave.repository.ArtistRepository;
import com.ukim.finki.develop.finkwave.repository.FollowRepository;
import com.ukim.finki.develop.finkwave.repository.NonAdminUserRepository;
import com.ukim.finki.develop.finkwave.service.mappers.NonAdminUserMapper;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class FollowService {

    private final FollowRepository followRepository;
    private final NonAdminUserRepository nonAdminUserRepository;
    private final AuthService authService;
    private final ArtistRepository artistRepository;
    private final NonAdminUserMapper mapper;


    private boolean isFollowedByCurrentUser(Long currentUserId,Long otherUserId){
        Set<Long> currentUserFollows = followRepository.getFollowsByFollower_Id(currentUserId)
                .stream()
                .map(f -> f.getFollowee().getId())
                .collect(Collectors.toSet());
        return currentUserFollows.contains(otherUserId);
    }

    public List<NonAdminUserDto>getFollowersForUser(Long id){
        if (artistRepository.existsById(id)){
            throw new FollowException("Cannot view for artist");
        }
        List<Follow> followers = followRepository.findFollowersWithProfile(id);
        Long currentUserId=authService.getCurrentUserID();


        return followers.stream()
                .map(f -> {
                    NonAdminUser follower = f.getFollower();
                    NonAdminUserDto dto = mapper.toDto(follower, null, null, null);

                    dto.setIsFollowedByCurrentUser(isFollowedByCurrentUser(currentUserId,follower.getId()));
                    return dto;
                })
                .toList();
    }

    public List<NonAdminUserDto>getFollowingForUser(Long id){
        if (artistRepository.existsById(id)){
            throw new FollowException("Cannot view for artist");
        }
        List<Follow>followings=followRepository.getFollowsByFollower_Id(id);
        Long currentUserId=authService.getCurrentUserID();
        return followings.stream()
                .map(f->{
                    NonAdminUser followee=f.getFollowee();
                    NonAdminUserDto dto=mapper.toDto(f.getFollowee(),null,null,null);
                    dto.setIsFollowedByCurrentUser(isFollowedByCurrentUser(currentUserId,followee.getId()));
                    return dto;
                })
                .toList();
    }



    public FollowStatusDto toggleFollow(Long id){
        Long currentUserId=authService.getCurrentUserID();
        boolean isFollowing;

        if (currentUserId.equals(id)){
            throw new FollowException("Cannot follow yourself");
        }

        FollowId followId=new FollowId(currentUserId,id);


        if (followRepository.existsById(followId)){
            followRepository.deleteById(followId);
            isFollowing=false;

        }else{
            NonAdminUser follower = nonAdminUserRepository.findById(currentUserId)
                    .orElseThrow(UserNotFoundException::new);
            NonAdminUser followee = nonAdminUserRepository.findById(id)
                    .orElseThrow(UserNotFoundException::new);

            followRepository.save(new Follow(follower, followee));
            isFollowing=true;

        }
        return new FollowStatusDto(
                isFollowing,
                followRepository.countByFolloweeId(id),
                followRepository.countByFollowerId(id));

    }
}
