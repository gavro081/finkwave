package com.ukim.finki.develop.finkwave.controller;

import com.ukim.finki.develop.finkwave.model.User;
import com.ukim.finki.develop.finkwave.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@CrossOrigin("*")
@RequiredArgsConstructor
public class UserController {
    private final UserService usersService;

    @GetMapping
    public HttpEntity<List<User>> getAllUsers(){
        return ResponseEntity.ok(usersService.getAll());
    }
}
