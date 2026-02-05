package com.ukim.finki.develop.finkwave.repository;

import com.ukim.finki.develop.finkwave.model.Playlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ukim.finki.develop.finkwave.model.SavedPlaylist;
import com.ukim.finki.develop.finkwave.model.SavedPlaylistId;

import java.util.List;

@Repository
public interface SavedPlaylistRepository extends JpaRepository<SavedPlaylist, SavedPlaylistId> {

    List<SavedPlaylist>findAllByListener_Id(Long currentUserId);

    @Query("""
        SELECT p FROM SavedPlaylist sp
        JOIN sp.playlist p
        JOIN FETCH p.createdBy l
        JOIN FETCH l.nonAdminUser nau
        JOIN FETCH nau.user u
        WHERE sp.id.listenerId = :listenerId
        """)
    List<Playlist> findSavedPlaylistsMetadata(@Param("listenerId") Long listenerId);
}
