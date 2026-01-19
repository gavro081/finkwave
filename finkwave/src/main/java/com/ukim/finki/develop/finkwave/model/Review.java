package com.ukim.finki.develop.finkwave.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Getter
@Setter
@Entity
@Table(name = "reviews", schema = "project")
public class Review {
    @EmbeddedId
    private ReviewId id;

    @MapsId("listenerId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "listener_id", nullable = false)
    private Listener listener;

    @MapsId("musicalEntityId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "musical_entity_id", nullable = false)
    private MusicalEntity musicalEntity;

    @Column(name = "grade", nullable = false)
    private Integer grade;

    @Column(name = "comment", length = Integer.MAX_VALUE)
    private String comment;

}