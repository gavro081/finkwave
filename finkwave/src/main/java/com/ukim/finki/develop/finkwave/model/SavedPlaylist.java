package com.ukim.finki.develop.finkwave.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Getter
@Setter
@Entity
@NoArgsConstructor
@Table(name = "saved_playlists", schema = "project")
public class SavedPlaylist {
    @EmbeddedId
    private SavedPlaylistId id;

    @MapsId("listenerId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "listener_id", nullable = false)
    private Listener listener;

    @MapsId("playlistId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "playlist_id", nullable = false)
    private Playlist playlist;

    public SavedPlaylist( Listener listener, Playlist playlist) {
        this.id=new SavedPlaylistId(listener.getId(),playlist.getId());
        this.listener = listener;
        this.playlist = playlist;
    }
}