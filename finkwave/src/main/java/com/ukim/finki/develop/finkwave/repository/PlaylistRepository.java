package com.ukim.finki.develop.finkwave.repository;

import com.ukim.finki.develop.finkwave.model.dto.BasicPlaylistDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ukim.finki.develop.finkwave.model.Playlist;

import java.util.List;

@Repository
public interface PlaylistRepository extends JpaRepository<Playlist, Long> {


    @Query("""
        SELECT DISTINCT p FROM Playlist p
        JOIN FETCH p.createdBy l
        JOIN FETCH l.nonAdminUser nu
        JOIN FETCH nu.user u
        WHERE l.id = :creatorId
        """)
    List<Playlist> findByCreatorId(@Param("creatorId") Long creatorId);

    @SuppressWarnings("JpaQlInspection") // count returns long, intellij expects int
    @Query("""
    SELECT NEW com.ukim.finki.develop.finkwave.model.dto.BasicPlaylistDto(
    p.id, p.name, p.cover, (SELECT COUNT(*) FROM PlaylistSong ps where ps.playlist.id = p.id)
    )
    FROM Playlist p
    WHERE p.createdBy.id = :userId
    """)
    List<BasicPlaylistDto> getPlaylistsByIdIs(@Param("userId") Long userId);
}
