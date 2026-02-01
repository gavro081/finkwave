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
@RequestMapping("/users")
public class NonAdminUserController {

    private final NonAdminUserService nonAdminUserService;
    private final FollowService followService;

    @GetMapping("/all")
    public HttpEntity<List<NonAdminUserDto>>getAllNonAdminUsers(){
        return ResponseEntity.ok(nonAdminUserService.getAllUsers());
    }

    @GetMapping("/{id}")
    public HttpEntity<NonAdminUserDto>getById(@PathVariable Long id){
        return ResponseEntity.ok(nonAdminUserService.getById(id));
    }

    @GetMapping("/search")
    public HttpEntity<List<NonAdminUserDto>>searchUsers(@RequestParam String name){
        return ResponseEntity.ok(nonAdminUserService.searchUsers(name));
    }

    @GetMapping("/{id}/followers")
    public HttpEntity<List<NonAdminUserDto>>getFollowersForUser(@PathVariable Long id){
        return ResponseEntity.ok(followService.getFollowersForUser(id));
    }

    @GetMapping("/{id}/following")
    public HttpEntity<List<NonAdminUserDto>>getFollowingForUser(@PathVariable Long id){
        return ResponseEntity.ok(followService.getFollowingForUser(id));
    }

    @PostMapping("/{id}/follow")
    public HttpEntity<FollowStatusDto>followUser(@PathVariable Long id){

        return ResponseEntity.ok(followService.toggleFollow(id));
    }


}
