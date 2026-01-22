package com.ukim.finki.develop.finkwave.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.Hibernate;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Objects;

@Getter
@Setter
@Embeddable
public class ListenId implements Serializable {
    @Serial
    private static final long serialVersionUID = 7485589950837124664L;
    @Column(name = "listener_id", nullable = false)
    private Long listenerId;

    @Column(name = "song_id", nullable = false)
    private Long songId;

    @Column(name = "timestamp", nullable = false)
    private LocalDateTime timestamp;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        ListenId entity = (ListenId) o;
        return Objects.equals(this.listenerId, entity.listenerId) &&
                Objects.equals(this.songId, entity.songId) &&
                Objects.equals(this.timestamp, ((ListenId) o).timestamp);
    }

    @Override
    public int hashCode() {
        return Objects.hash(listenerId, songId, timestamp);
    }

}