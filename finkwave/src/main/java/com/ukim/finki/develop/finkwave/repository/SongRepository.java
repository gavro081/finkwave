package com.ukim.finki.develop.finkwave.repository;

import com.ukim.finki.develop.finkwave.model.dto.MusicalEntityDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ukim.finki.develop.finkwave.model.Song;

import java.util.List;

@Repository
public interface SongRepository extends JpaRepository<Song, Long> {


    @Query("""
            SELECT NEW com.ukim.finki.develop.finkwave.model.dto.MusicalEntityDto(
                s.id, me.title, me.genre, 'SONG', u.fullName, me.cover,
                (CASE WHEN :currentUserId IS NOT NULL AND l.id IS NOT NULL THEN true ELSE false END)
            )
            FROM Song s
            JOIN s.musicalEntities me
            JOIN me.releasedBy a
            JOIN a.nonAdminUser nau
            JOIN nau.user u
            LEFT JOIN Like l ON l.musicalEntity.id = s.id AND l.listener.id = :currentUserId
            WHERE s.album.id = :albumId
            """
    )
    List<MusicalEntityDto>findSongsByAlbum(@Param("albumId") Long albumId, @Param("currentUserId")Long currentUserId);


    @Query("""
            SELECT NEW com.ukim.finki.develop.finkwave.model.dto.MusicalEntityDto(
            s.id, me.title, me.genre, 'SONG', u.fullName, me.cover,
            (CASE WHEN :currentUserId IS NOT NULL AND l.id IS NOT NULL THEN true ELSE false END))
            FROM Song s
            JOIN s.musicalEntities me
            JOIN me.releasedBy a
            JOIN a.nonAdminUser nau
            JOIN nau.user u
            JOIN PlaylistSong ps ON ps.song.id=s.id
            LEFT JOIN Like l ON l.musicalEntity.id=s.id AND l.listener.id=:currentUserId
            WHERE ps.playlist.id=:playlistId
    """)
    List<MusicalEntityDto>findSongsByPlaylistId(@Param("playlistId")Long playlistId, @Param("currentUserId")Long currentUserId);

    @Query("""
            SELECT NEW com.ukim.finki.develop.finkwave.model.dto.MusicalEntityDto(
            s.id, me.title, me.genre, 'SONG', u.fullName, me.cover, FALSE)
            FROM Song s
            JOIN s.musicalEntities me
            JOIN me.releasedBy a
            JOIN a.nonAdminUser nau
            JOIN nau.user u
            JOIN Listen l on l.song.id = s.id
            GROUP BY s.id, me.title, me.genre, u.fullName, me.cover
            ORDER BY count(*) desc
    """
    )
    // todo: handle likes, momentalno site se false za da raboti joinot
    // todo: add paging
    List<MusicalEntityDto> findTopByListens(@Param("currentUserId")Long currentUserId);


    // todo: fix is liked by user, currently returns hard coded false
    @Query("""
            SELECT NEW com.ukim.finki.develop.finkwave.model.dto.MusicalEntityDto(
            s.id, me.title, me.genre, 'SONG', u.fullName, me.cover, FALSE )
            FROM Song s
            JOIN s.musicalEntities me
            JOIN me.releasedBy a
            JOIN a.nonAdminUser nau
            JOIN nau.user u
            WHERE me.title ILIKE %:searchTerm%
            """
    )
    List<MusicalEntityDto> searchSongs(@Param("currentUserId")Long currentUserId, @Param("searchTerm") String searchTerm);

}
