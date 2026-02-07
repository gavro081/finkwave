package com.ukim.finki.develop.finkwave.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
@NoArgsConstructor
public class MusicalEntityDto {
    private Long id;
    private String title;
    private String genre;
    private String type;
    private String releasedBy;
    private String artistUsername;
    private String cover;
    private Boolean isLikedByCurrentUser;
}
