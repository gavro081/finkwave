package com.ukim.finki.develop.finkwave.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Getter
@Setter
@Entity
@Table(name = "artist_contributions", schema = "project")
public class ArtistContribution {
    @EmbeddedId
    private ArtistContributionId id;

    @MapsId("artistId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "artist_id", nullable = false)
    private Artist artist;

    @MapsId("musicalEntityId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "musical_entity_id", nullable = false)
    private MusicalEntity musicalEntity;

    @Column(name = "role", nullable = false, length = Integer.MAX_VALUE)
    private String role;

}