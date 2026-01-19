package com.ukim.finki.develop.finkwave.controller;

import com.ukim.finki.develop.finkwave.model.Admin;
import com.ukim.finki.develop.finkwave.model.Event;
import com.ukim.finki.develop.finkwave.model.User;
import com.ukim.finki.develop.finkwave.repository.AdminRepository;
import com.ukim.finki.develop.finkwave.repository.EventRepository;
import com.ukim.finki.develop.finkwave.service.UserService;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@CrossOrigin("*")
@AllArgsConstructor
@RequestMapping("/all")
public class AllController {
    private final AdminRepository adminRepository;
    private final EventRepository eventRepository;

    @GetMapping("/admins")
    public HttpEntity<List<Admin>> getAllAdmins(){
        return ResponseEntity.ok(adminRepository.findAll());
    }
    @GetMapping("/events")
    public HttpEntity<List<Event>> getAllEvents(){
        return ResponseEntity.ok(eventRepository.findAll());
    }
}