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


    @Query("SELECT NEW com.ukim.finki.develop.finkwave.model.dto.MusicalEntityDto( "+
            "s.id, " +
            "me.title, " +
            "me.genre, " +
            "'SONG'," +
            "u.fullName, " +
            "(CASE WHEN l.id IS NOT NULL THEN true ELSE false END)) "+
            "FROM Song s "+
            "JOIN MusicalEntity  me on me.id=s.musicalEntities.id "+
            "JOIN User u on u.id=me.releasedBy.id "+
            "LEFT JOIN Like  l on l.musicalEntity.id=s.id AND l.listener.id=:currentUserId "+
            "WHERE s.album.id=:albumId"

    )
    List<MusicalEntityDto>findSongsByAlbum(@Param("albumId") Long albumId, @Param("currentUserId")Long currentUserId);
}
