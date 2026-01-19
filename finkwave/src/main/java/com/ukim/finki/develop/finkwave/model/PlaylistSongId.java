package com.ukim.finki.develop.finkwave.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.Hibernate;

import java.io.Serializable;
import java.util.Objects;

@Getter
@Setter
@Embeddable
public class PlaylistSongId implements Serializable {
    private static final long serialVersionUID = -1096457880126729057L;
    @Column(name = "song_id", nullable = false)
    private Long songId;

    @Column(name = "playlist_id", nullable = false)
    private Long playlistId;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        PlaylistSongId entity = (PlaylistSongId) o;
        return Objects.equals(this.playlistId, entity.playlistId) &&
                Objects.equals(this.songId, entity.songId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(playlistId, songId);
    }

}