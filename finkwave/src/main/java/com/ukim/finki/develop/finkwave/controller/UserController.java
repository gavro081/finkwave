package com.ukim.finki.develop.finkwave.controller;

import com.ukim.finki.develop.finkwave.model.User;
import com.ukim.finki.develop.finkwave.model.enums.UserType;
import com.ukim.finki.develop.finkwave.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("*")
@RequiredArgsConstructor
@RequestMapping("/users")
public class UserController {
    private final UserService usersService;

    @GetMapping
    public HttpEntity<List<User>> getAllUsers(){
        return ResponseEntity.ok(usersService.getAll());
    }

    @GetMapping("/search")
    public HttpEntity<List<User>> searchArtists(
            @RequestParam(name = "type") UserType userType,
            @RequestParam(name = "q") String searchTerm){
        return ResponseEntity.ok(usersService.search(userType, searchTerm));
    }
}
