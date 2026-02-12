package com.ukim.finki.develop.finkwave.controller;

import com.ukim.finki.develop.finkwave.model.dto.LikeStatusDto;
import com.ukim.finki.develop.finkwave.model.dto.PublishAlbumRequestDto;
import com.ukim.finki.develop.finkwave.model.dto.PublishSongRequestDto;
import com.ukim.finki.develop.finkwave.service.LikeService;
import com.ukim.finki.develop.finkwave.service.MusicalEntityService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@AllArgsConstructor
@RequestMapping("/musical-entity")
public class MusicalEntityController {

    private final LikeService likeService;
    private final MusicalEntityService musicalEntityService;

    @PostMapping("/{id}/like")
    public HttpEntity<LikeStatusDto>likeMusicalEntity(@PathVariable(name = "id") Long entityId){
        return ResponseEntity.ok(likeService.toggleLike(entityId));
    }

    @PostMapping(value = "/publish/song", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public HttpEntity<?> publishSong(@ModelAttribute PublishSongRequestDto publishSongRequestDto) throws IOException {
        musicalEntityService.handleSongPublish(publishSongRequestDto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PostMapping(value = "/publish/album", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public HttpEntity<?> publishAlbum(@ModelAttribute PublishAlbumRequestDto publishAlbumRequestDto) throws IOException {
        musicalEntityService.handleAlbumPublish(publishAlbumRequestDto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}
