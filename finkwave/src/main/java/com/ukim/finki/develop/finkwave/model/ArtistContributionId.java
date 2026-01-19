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
public class ArtistContributionId implements Serializable {
    private static final long serialVersionUID = -3193987026608380950L;
    @Column(name = "artist_id", nullable = false)
    private Long artistId;

    @Column(name = "musical_entity_id", nullable = false)
    private Long musicalEntityId;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        ArtistContributionId entity = (ArtistContributionId) o;
        return Objects.equals(this.artistId, entity.artistId) &&
                Objects.equals(this.musicalEntityId, entity.musicalEntityId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(artistId, musicalEntityId);
    }

}