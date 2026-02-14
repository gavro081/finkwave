package com.ukim.finki.develop.finkwave.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.Hibernate;

import java.io.Serializable;
import java.util.Objects;

@Getter
@Setter
@Embeddable
@NoArgsConstructor
public class SavedPlaylistId implements Serializable {
    private static final long serialVersionUID = 678748242066896235L;
    @Column(name = "listener_id", nullable = false)
    private Long listenerId;

    @Column(name = "playlist_id", nullable = false)
    private Long playlistId;

    public SavedPlaylistId(Long listenerId, Long playlistId) {
        this.listenerId = listenerId;
        this.playlistId = playlistId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        SavedPlaylistId entity = (SavedPlaylistId) o;
        return Objects.equals(this.playlistId, entity.playlistId) &&
                Objects.equals(this.listenerId, entity.listenerId);
    }



    @Override
    public int hashCode() {
        return Objects.hash(playlistId, listenerId);
    }

}