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
public class ReviewId implements Serializable {
    private static final long serialVersionUID = -747031476754115455L;
    @Column(name = "listener_id", nullable = false)
    private Long listenerId;

    @Column(name = "musical_entity_id", nullable = false)
    private Long musicalEntityId;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        ReviewId entity = (ReviewId) o;
        return Objects.equals(this.listenerId, entity.listenerId) &&
                Objects.equals(this.musicalEntityId, entity.musicalEntityId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(listenerId, musicalEntityId);
    }

}