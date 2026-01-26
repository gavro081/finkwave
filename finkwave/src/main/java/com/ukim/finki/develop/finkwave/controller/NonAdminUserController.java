package com.ukim.finki.develop.finkwave.controller;

import com.ukim.finki.develop.finkwave.model.dto.NonAdminUserDTO;
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

    @GetMapping("/all")
    public HttpEntity<List<NonAdminUserDTO>>getAllNonAdminUsers(){
        return ResponseEntity.ok(nonAdminUserService.getAllUsers());
    }

    @GetMapping("/{id}")
    public HttpEntity<NonAdminUserDTO>getById(@PathVariable Long id){
        return ResponseEntity.ok(nonAdminUserService.getById(id));
    }

    @GetMapping("/search")
    public HttpEntity<List<NonAdminUserDTO>>searchUsers(@RequestParam String name){
        return ResponseEntity.ok(nonAdminUserService.searchUsers(name));
    }
}
