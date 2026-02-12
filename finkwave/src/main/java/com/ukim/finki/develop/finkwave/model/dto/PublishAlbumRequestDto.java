package com.ukim.finki.develop.finkwave.model.dto;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import jakarta.annotation.Nullable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PublishAlbumRequestDto {
    private String title;
    private String genre;
    private String link;
    @Nullable
    private MultipartFile cover;
    private List<AlbumSongsDto> albumSongs;
}
