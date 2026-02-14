package com.ukim.finki.develop.finkwave.service;

import com.ukim.finki.develop.finkwave.exceptions.FollowException;
import com.ukim.finki.develop.finkwave.exceptions.UserNotFoundException;
import com.ukim.finki.develop.finkwave.model.Artist;
import com.ukim.finki.develop.finkwave.model.Follow;
import com.ukim.finki.develop.finkwave.model.FollowId;
import com.ukim.finki.develop.finkwave.model.NonAdminUser;
import com.ukim.finki.develop.finkwave.model.dto.statusDto.FollowStatusDto;
import com.ukim.finki.develop.finkwave.model.dto.NonAdminUserDto;
import com.ukim.finki.develop.finkwave.repository.ArtistRepository;
import com.ukim.finki.develop.finkwave.repository.FollowRepository;
import com.ukim.finki.develop.finkwave.repository.NonAdminUserRepository;
import com.ukim.finki.develop.finkwave.service.mappers.NonAdminUserMapper;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
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

    private  NonAdminUser getNonAdminUser(String username){
        Optional<Artist>artistOptional=artistRepository.findByUsername(username);
        if (artistOptional.isPresent()){
            throw new FollowException("Cannot view for artist");
        }
        return nonAdminUserRepository.findByUsername(username)
                .orElseThrow(()-> new UserNotFoundException("Cannot find user with username: "+ username));
    }

    public List<NonAdminUserDto>getFollowersForUser(String username){
        NonAdminUser nonAdminUser=getNonAdminUser(username);

        Long id=nonAdminUser.getId();
        List<Follow> followers = followRepository.findFollowersWithProfile(id);
        Long currentUserId=authService.getCurrentUserIDOptional().orElse(null);


        return followers.stream()
                .map(f -> {
                    NonAdminUser follower = f.getFollower();
                    boolean isFollowedByCurrentUser=isFollowedByCurrentUser(currentUserId,follower.getId());

                    return mapper.toDto(follower, null, new FollowStatusDto(isFollowedByCurrentUser,null,null));
                })
                .toList();
    }

    public List<NonAdminUserDto>getFollowingForUser(String username){
        NonAdminUser nonAdminUser=getNonAdminUser(username);
        Long id=nonAdminUser.getId();
        List<Follow>followings=followRepository.getFollowsByFollower_Id(id);
        Long currentUserId=authService.getCurrentUserID();
        return followings.stream()
                .map(f->{
                    NonAdminUser followee=f.getFollowee();
                    boolean isFollowedByCurrentUser=isFollowedByCurrentUser(currentUserId,followee.getId());
                    return mapper.toDto(f.getFollowee(),null,new FollowStatusDto(isFollowedByCurrentUser,null,null));
                })
                .toList();
    }



    public FollowStatusDto toggleFollow(String username){
        Long currentUserId=authService.getCurrentUserID();
        boolean isFollowing;
        NonAdminUser nonAdminUser=nonAdminUserRepository.findByUsername(username)
                .orElseThrow(()-> new UserNotFoundException("Cannot find user with username: "+ username));
        Long id=nonAdminUser.getId();

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
