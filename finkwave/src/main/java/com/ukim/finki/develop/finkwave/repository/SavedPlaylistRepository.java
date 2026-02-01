package com.ukim.finki.develop.finkwave.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ukim.finki.develop.finkwave.model.SavedPlaylist;
import com.ukim.finki.develop.finkwave.model.SavedPlaylistId;

import java.util.List;

@Repository
public interface SavedPlaylistRepository extends JpaRepository<SavedPlaylist, SavedPlaylistId> {

    List<SavedPlaylist>findAllByListener_Id(Long currentUserId);
}
