package com.ukim.finki.develop.finkwave.controller;

import com.ukim.finki.develop.finkwave.model.Users;
import com.ukim.finki.develop.finkwave.service.UsersService;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@CrossOrigin("*")
public class UsersController {
    private final UsersService usersService;

    public UsersController(UsersService usersService) {
        this.usersService = usersService;
    }

    @GetMapping
    public HttpEntity<List<Users>> getAllUsers(){
        return ResponseEntity.ok(usersService.getAll());
    }
}
