package com.ukim.finki.develop.finkwave.controller;

import com.ukim.finki.develop.finkwave.model.dto.FollowStatusDto;
import com.ukim.finki.develop.finkwave.model.dto.NonAdminUserDto;
import com.ukim.finki.develop.finkwave.service.FollowService;
import com.ukim.finki.develop.finkwave.service.NonAdminUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("*")
@RequiredArgsConstructor
@RequestMapping("/users/na/")
public class NonAdminUserController {

    private final NonAdminUserService nonAdminUserService;
    private final FollowService followService;

    @GetMapping("/all")
    public HttpEntity<List<NonAdminUserDto>>getAllNonAdminUsers(){
        return ResponseEntity.ok(nonAdminUserService.getAllUsers());
    }

    @GetMapping("/{username}")
    public HttpEntity<NonAdminUserDto>getNonAdminUserById(@PathVariable String username){
        return ResponseEntity.ok(nonAdminUserService.getNonAdminUserProfile(username));
    }

    @GetMapping("/search")
    public HttpEntity<List<NonAdminUserDto>>searchNonAdminUsers(@RequestParam String name){
        return ResponseEntity.ok(nonAdminUserService.searchUsers(name));
    }

    @GetMapping("/{username}/followers")
    public HttpEntity<List<NonAdminUserDto>>getFollowersForUser(@PathVariable String username){
        return ResponseEntity.ok(followService.getFollowersForUser(username));
    }

    @GetMapping("/{username}/following")
    public HttpEntity<List<NonAdminUserDto>>getFollowingForUser(@PathVariable String username){
        return ResponseEntity.ok(followService.getFollowingForUser(username));
    }

    @PostMapping("/{username}/follow")
    public HttpEntity<FollowStatusDto>followUser(@PathVariable String username){

        return ResponseEntity.ok(followService.toggleFollow(username));
    }


}
