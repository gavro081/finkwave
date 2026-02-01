package com.ukim.finki.develop.finkwave.controller;

import com.ukim.finki.develop.finkwave.model.dto.LikeStatusDto;
import com.ukim.finki.develop.finkwave.service.LikeService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@AllArgsConstructor
@RequestMapping("/musical-entity")
public class MusicalEntityController {

    private final LikeService likeService;

    @PostMapping("/{id}/like")
    public HttpEntity<LikeStatusDto>likeMusicalEntity(@PathVariable(name = "id") Long entityId){
        return ResponseEntity.ok(likeService.toggleLike(entityId));
    }
}
