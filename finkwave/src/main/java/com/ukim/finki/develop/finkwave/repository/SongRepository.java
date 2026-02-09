package com.ukim.finki.develop.finkwave.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ukim.finki.develop.finkwave.model.Song;
import com.ukim.finki.develop.finkwave.model.dto.BasicSongDto;
import com.ukim.finki.develop.finkwave.model.dto.MusicalEntityDto;
import com.ukim.finki.develop.finkwave.model.dto.SongDto;

@Repository
public interface SongRepository extends JpaRepository<Song, Long> {


    @Query("""
        SELECT NEW com.ukim.finki.develop.finkwave.model.dto.MusicalEntityDto(
            s.id, me.title, me.genre, 'SONG', u.fullName, u.username, me.cover,
            (CASE WHEN :currentUserId IS NOT NULL AND l.id IS NOT NULL THEN true ELSE false END)
        )
        FROM Song s
        JOIN s.musicalEntities me
        JOIN me.releasedBy a
        JOIN a.nonAdminUser nau
        JOIN nau.user u
        LEFT JOIN Like l ON l.musicalEntity.id = s.id AND l.listener.id = :currentUserId
        WHERE s.album.id = :albumId
    """)
    List<MusicalEntityDto>findSongsByAlbum(@Param("albumId") Long albumId, @Param("currentUserId")Long currentUserId);


    @Query("""
        SELECT NEW com.ukim.finki.develop.finkwave.model.dto.MusicalEntityDto(
            s.id, me.title, me.genre, 'SONG', u.fullName, u.username, me.cover,
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
        SELECT NEW com.ukim.finki.develop.finkwave.model.dto.SongDto(
            s.id,
            s.musicalEntities.title,
            s.musicalEntities.genre,
            'SONG',
            s.musicalEntities.releasedBy.nonAdminUser.user.fullName,
            s.musicalEntities.releasedBy.nonAdminUser.user.username,
            s.musicalEntities.cover,
            (EXISTS (SELECT 1 FROM Like l WHERE l.musicalEntity.id = s.id AND l.listener.id = :currentUserId)),
            s.album.musicalEntities.title,
            s.album.musicalEntities.id,
            s.link
        )
        FROM Song s
        JOIN Listen l on l.id.songId = s.id
        GROUP BY
            s.id,
            s.musicalEntities.title,
            s.musicalEntities.genre,
            s.musicalEntities.releasedBy.nonAdminUser.user.fullName,
            s.musicalEntities.releasedBy.nonAdminUser.user.username,
            s.musicalEntities.cover,
            s.album.musicalEntities.title,
            s.album.musicalEntities.id
        ORDER BY count(*) desc
    """)
    // todo: add paging
    List<SongDto> findTopByListens(@Param("currentUserId")Long currentUserId);

    @Query("""
        SELECT NEW com.ukim.finki.develop.finkwave.model.dto.SongDto(
            s.id,
            s.musicalEntities.title,
            s.musicalEntities.genre,
            'SONG',
            s.musicalEntities.releasedBy.nonAdminUser.user.fullName,
            s.musicalEntities.releasedBy.nonAdminUser.user.username,
            s.musicalEntities.cover,
            (EXISTS (SELECT 1 FROM Like l WHERE l.musicalEntity.id = s.id AND l.listener.id = :currentUserId)),
            s.album.musicalEntities.title,
            s.album.musicalEntities.id,
            s.link
        )
        FROM Song s
        WHERE s.musicalEntities.title ILIKE '%' || :searchTerm || '%'
    """)
    List<SongDto> searchSongs(@Param("currentUserId")Long currentUserId, @Param("searchTerm") String searchTerm);


    @Query(value = """
        SELECT
            t.song_id,
            t.title,
            t.full_name,
            t.username,
            t.link,
            t.cover
        FROM (
                 SELECT DISTINCT ON (l.song_id)
                     l.song_id,
                     me.title,
                     u.full_name,
                     u.username,
                     me.cover,
                     s.link,
                     l.timestamp
                 FROM listens l
                     JOIN musical_entities me ON me.id = l.song_id
                     JOIN songs s on s.id = l.song_id
                     JOIN users u ON u.user_id = me.released_by
                     WHERE l.listener_id = :userId
                 ORDER BY l.song_id, l.timestamp DESC
             ) t
        ORDER BY t.timestamp DESC
        LIMIT 5;
    """, nativeQuery = true)
    List<BasicSongDto> getRecentlyListened(@Param("userId")Long userId);

    @Query(value = """
        SELECT NEW com.ukim.finki.develop.finkwave.model.dto.SongDto(
            s.id,
            me.title,
            me.genre,
            'SONG',
            u.fullName,
            u.username,
            me.cover,
            (EXISTS (
                SELECT 1 FROM Like l
                WHERE l.musicalEntity.id = s.id
                  AND l.listener.id = :userId
            )),
            albumMe.title,
            albumMe.id,
            s.link
        )
        FROM Song s
        JOIN s.musicalEntities me
        JOIN me.releasedBy a
        JOIN a.nonAdminUser nau
        JOIN nau.user u
        LEFT JOIN s.album album
        LEFT JOIN album.musicalEntities albumMe
        WHERE s.id = :songId
    """)
    SongDto getSongById(@Param("songId") Long songId, @Param("userId") Long userId);
}
