package com.ukim.finki.develop.finkwave.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
public class ListenerLikesDTO {
    private Long entityId;
    private String entityTitle;
    private String entityGenre;
    private String entityType;
}
