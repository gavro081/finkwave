package com.ukim.finki.develop.finkwave.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.ukim.finki.develop.finkwave.model.PlaylistSong;
import com.ukim.finki.develop.finkwave.model.PlaylistSongId;

import java.util.List;

@Repository
public interface PlaylistSongRepository extends JpaRepository<PlaylistSong, PlaylistSongId> {

    @Query("""
                select ps.id.playlistId
                from PlaylistSong ps
                where ps.song.id=:songId and ps.playlist.createdBy.id=:userId
            """)
    List<Long>getPlaylistsIdsWithSong(Long songId, Long userId);
}
