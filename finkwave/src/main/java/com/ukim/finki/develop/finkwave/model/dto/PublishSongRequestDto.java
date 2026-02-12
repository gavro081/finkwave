package com.ukim.finki.develop.finkwave.model.dto;

import jakarta.annotation.Nullable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PublishSongRequestDto {
    private String title;
    private String genre;
    private String link;
    @Nullable
    private MultipartFile cover;
    private List<ArtistContributionSummaryDto> contributors;
}
