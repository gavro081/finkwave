package com.ukim.finki.develop.finkwave.model.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ArtistDto extends NonAdminUserDto {
    private List<ArtistContributionDto> contributions;
}
