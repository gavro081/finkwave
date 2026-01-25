package com.ukim.finki.develop.finkwave.controller;

import com.ukim.finki.develop.finkwave.model.Admin;
import com.ukim.finki.develop.finkwave.model.EventProjection;
import com.ukim.finki.develop.finkwave.repository.AdminRepository;
import com.ukim.finki.develop.finkwave.repository.EventRepository;
import com.ukim.finki.develop.finkwave.repository.ListenRepository;
import com.ukim.finki.develop.finkwave.repository.SongRepository;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin("*")
@AllArgsConstructor
@RequestMapping("/all")
public class AllController {
    private final AdminRepository adminRepository;
    private final EventRepository eventRepository;
    private final ListenRepository listenRepository;

    @GetMapping("/admins")
        public HttpEntity<List<Admin>> getAllAdmins(){
        return ResponseEntity.ok(adminRepository.findAll());
    }
    @GetMapping("/events")
    public HttpEntity<List<EventProjection>> getAllEvents(){
        return ResponseEntity.ok(eventRepository.findAllByLocation("Skopje, Macedonia"));
    }
    @GetMapping("/listens")
    public HttpEntity<Map<String,?>> getAllListen(){
        return ResponseEntity.ok(Map.of(
                "links", listenRepository.findAll().stream().map(s -> s.getSong().getLink()).limit(10).toList()));
    }
}