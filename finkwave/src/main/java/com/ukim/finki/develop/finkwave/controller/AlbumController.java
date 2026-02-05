package com.ukim.finki.develop.finkwave.controller;

import com.ukim.finki.develop.finkwave.model.dto.MusicalEntityDto;
import com.ukim.finki.develop.finkwave.service.AlbumService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/albums")
public class AlbumController {
    private final AlbumService albumService;

    @GetMapping("/{id}")
    public HttpEntity<MusicalEntityDto> getAlbum(@PathVariable Long id){
        return ResponseEntity.ok(albumService.getAlbum(id));
    }

    @GetMapping("/search")
    public HttpEntity<List<MusicalEntityDto>> searchAlbums(@RequestParam(name = "q") String searchTerm){
        return ResponseEntity.ok(albumService.searchAlbums(searchTerm));
    }

}
