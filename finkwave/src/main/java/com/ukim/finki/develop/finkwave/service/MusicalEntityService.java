package com.ukim.finki.develop.finkwave.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.ukim.finki.develop.finkwave.exceptions.InvalidFileException;
import com.ukim.finki.develop.finkwave.model.Album;
import com.ukim.finki.develop.finkwave.model.Artist;
import com.ukim.finki.develop.finkwave.model.ArtistContribution;
import com.ukim.finki.develop.finkwave.model.ArtistContributionId;
import com.ukim.finki.develop.finkwave.model.MusicalEntity;
import com.ukim.finki.develop.finkwave.model.Song;
import com.ukim.finki.develop.finkwave.model.dto.AlbumSongsDto;
import com.ukim.finki.develop.finkwave.model.dto.ArtistContributionSummaryDto;
import com.ukim.finki.develop.finkwave.model.dto.PublishAlbumRequestDto;
import com.ukim.finki.develop.finkwave.model.dto.PublishSongRequestDto;
import com.ukim.finki.develop.finkwave.repository.AlbumRepository;
import com.ukim.finki.develop.finkwave.repository.ArtistContributionRepository;
import com.ukim.finki.develop.finkwave.repository.MusicalEntityRepository;
import com.ukim.finki.develop.finkwave.repository.SongRepository;

import lombok.AllArgsConstructor;

@AllArgsConstructor
@Service
public class MusicalEntityService {
    private final AuthService authService;
    private final ArtistService artistService;
    private final SongRepository songRepository;
    private final AlbumRepository albumRepository;
    private final ArtistContributionRepository artistContributionRepository;
    MusicalEntityRepository musicalEntityRepository;

    private static final long MAX_FILE_SIZE = 2_000_000;
    private static final String MAIN_VOCAL_ROLE = "MAIN VOCAL";
    
    @Transactional
    public void handleSongPublish(PublishSongRequestDto requestDto) throws IOException {
        Long userId = authService.getCurrentUserID();
        Artist artist = artistService.getArtistById(userId);

        MusicalEntity musicalEntity = createMusicalEntity(
                requestDto.getTitle(),
                requestDto.getGenre(),
                requestDto.getCover(),
                artist
        );

        Song song = new Song();
        song.setAlbum(null);
        song.setLink(requestDto.getLink());
        song.setMusicalEntities(musicalEntity);
        songRepository.save(song);

        // add publishing artist
        saveContribution(artist, musicalEntity, MAIN_VOCAL_ROLE);

        // add additional contributors
        saveContributionsFromDto(musicalEntity, requestDto.getContributors());
    }

    @Transactional
    protected MusicalEntity createMusicalEntity(String title, String genre, MultipartFile cover, Artist releasedBy)
            throws IOException {
        MusicalEntity.MusicalEntityBuilder builder = MusicalEntity.builder()
                .title(title)
                .genre(genre)
                .releaseDate(LocalDate.now())
                .releasedBy(releasedBy);

        if (cover != null && !cover.isEmpty()) {
            try {
                String filename = saveCoverPhoto(cover);
                builder.cover("profile-pictures/" + filename);
            } catch (Exception ignored) {}
        }

        return musicalEntityRepository.save(builder.build());
    }

    @Transactional
    protected void saveContribution(Artist artist, MusicalEntity musicalEntity, String role) {
        ArtistContributionId id = new ArtistContributionId();
        id.setArtistId(artist.getId());
        id.setMusicalEntityId(musicalEntity.getId());

        ArtistContribution contribution = new ArtistContribution();
        contribution.setId(id);
        contribution.setArtist(artist);
        contribution.setMusicalEntity(musicalEntity);
        contribution.setRole(role);

        artistContributionRepository.save(contribution);
    }

    @Transactional
    protected void saveContributionsFromDto(MusicalEntity musicalEntity, List<ArtistContributionSummaryDto> contributors) {
        if (contributors == null) return;

        for (ArtistContributionSummaryDto contributorDto : contributors) {
            if (contributorDto.getId() == null) continue;

            Artist contributor = artistService.getArtistById(contributorDto.getId());
            saveContribution(contributor, musicalEntity, contributorDto.getRole());
        }
    }
    // todo: add business logic (max songs per album, max contributors etc.)

    @Transactional
    public void handleAlbumPublish(PublishAlbumRequestDto requestDto) throws IOException {
        Long userId = authService.getCurrentUserID();
        Artist artist = artistService.getArtistById(userId);

        MusicalEntity albumMusicalEntity = createMusicalEntity(
                requestDto.getTitle(),
                requestDto.getGenre(),
                requestDto.getCover(),
                artist
        );

        Album album = new Album();
        album.setMusicalEntities(albumMusicalEntity);
        album = albumRepository.save(album);

        // add publishing artist
        saveContribution(artist, albumMusicalEntity, MAIN_VOCAL_ROLE);

        // track artists already added to avoid duplicates
        Set<Long> albumContributorIds = new HashSet<>();
        albumContributorIds.add(artist.getId());

        List<AlbumSongsDto> albumSongs = requestDto.getAlbumSongs();
        for (AlbumSongsDto songDto : albumSongs) {
            createSongForAlbum(albumMusicalEntity, album, songDto, artist, albumContributorIds);
        }
    }


    @Transactional
    protected void createSongForAlbum(MusicalEntity albumMe, Album album, AlbumSongsDto songDto,
                                     Artist publishingArtist, Set<Long> albumContributorIds) {
        MusicalEntity songMusicalEntity = MusicalEntity.builder()
                .title(songDto.getTitle())
                .releaseDate(albumMe.getReleaseDate())
                .releasedBy(albumMe.getReleasedBy())
                .cover(albumMe.getCover())
                .genre(albumMe.getGenre())
                .build();
        songMusicalEntity = musicalEntityRepository.save(songMusicalEntity);

        Song song = new Song();
        song.setLink(songDto.getLink());
        song.setAlbum(album);
        song.setMusicalEntities(songMusicalEntity);
        songRepository.save(song);

        // add publishing artist as MAIN VOCAL to this song
        saveContribution(publishingArtist, songMusicalEntity, MAIN_VOCAL_ROLE);

        // add song-specific contributors
        List<ArtistContributionSummaryDto> songContributors = songDto.getContributors();
        if (songContributors != null) {
            for (ArtistContributionSummaryDto contributorDto : songContributors) {
                if (contributorDto.getId() == null) continue;
                
                Artist contributor = artistService.getArtistById(contributorDto.getId());
                
                // first add to song
                saveContribution(contributor, songMusicalEntity, contributorDto.getRole());
                
                // then add to album if not already added
                if (!albumContributorIds.contains(contributor.getId())) {
                    saveContribution(contributor, album.getMusicalEntities(), contributorDto.getRole());
                    albumContributorIds.add(contributor.getId());
                }
            }
        }
    }



    private String saveCoverPhoto(MultipartFile coverPhoto) throws IOException {
        String contentType = coverPhoto.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw InvalidFileException.invalidType();
        }

        if (coverPhoto.getSize() > MAX_FILE_SIZE) {
            throw InvalidFileException.tooLarge(MAX_FILE_SIZE);
        }

        String filename = UUID.randomUUID() + "-" + coverPhoto.getOriginalFilename();
        Path path = Paths.get("uploads/profile-pictures", filename);
        Files.copy(coverPhoto.getInputStream(), path);
        return filename;
    }
}