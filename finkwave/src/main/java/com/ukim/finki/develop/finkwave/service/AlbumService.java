package com.ukim.finki.develop.finkwave.service;

import com.ukim.finki.develop.finkwave.exceptions.AlbumNotFoundException;
import com.ukim.finki.develop.finkwave.model.Album;
import com.ukim.finki.develop.finkwave.model.MusicalEntity;
import com.ukim.finki.develop.finkwave.model.dto.AlbumDto;
import com.ukim.finki.develop.finkwave.model.dto.MusicalEntityDto;
import com.ukim.finki.develop.finkwave.repository.AlbumRepository;
import com.ukim.finki.develop.finkwave.repository.LikeRepository;
import com.ukim.finki.develop.finkwave.repository.SongRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class AlbumService {
    private final AlbumRepository albumRepository;
    private final SongRepository songRepository;
    private final AuthService authService;
    private final LikeRepository likeRepository;

    public MusicalEntityDto getAlbum(Long id){
        if (!albumRepository.existsById(id)){
            throw new AlbumNotFoundException(id);
        }
        Long currentUserId=authService.getCurrentUserID();

        Album album=albumRepository.findById(id).orElseThrow(()->new AlbumNotFoundException(id));
        AlbumDto dto=new AlbumDto(album.getId(),
                album.getMusicalEntities().getTitle(),
                album.getMusicalEntities().getGenre(),
                "ALBUM",
                album.getMusicalEntities().getReleasedBy().getNonAdminUser().getUser().getFullName(),
                album.getMusicalEntities().getReleasedBy().getNonAdminUser().getUser().getUsername(),
                likeRepository.isLikedByUser(currentUserId));
        List<MusicalEntityDto>songsFromAlbum=songRepository.findSongsByAlbum(id,currentUserId);

        dto.setSongs(songsFromAlbum);
        return dto;
    }

    public List<MusicalEntityDto> searchAlbums(String searchTerm){
        return albumRepository.searchAlbums(authService.getCurrentUserID(), searchTerm);
    }

}
