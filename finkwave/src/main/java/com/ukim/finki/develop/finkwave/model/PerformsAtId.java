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
public class PerformsAtId implements Serializable {
    private static final long serialVersionUID = 1686751772857702507L;
    @Column(name = "event_id", nullable = false)
    private Long eventId;

    @Column(name = "artist_id", nullable = false)
    private Long artistId;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        PerformsAtId entity = (PerformsAtId) o;
        return Objects.equals(this.eventId, entity.eventId) &&
                Objects.equals(this.artistId, entity.artistId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(eventId, artistId);
    }

}