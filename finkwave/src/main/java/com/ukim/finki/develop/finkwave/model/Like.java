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
@Table(name = "likes", schema = "project")
public class Like {
    @EmbeddedId
    private LikeId id;

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

    public Like(MusicalEntity musicalEntity, Listener listener) {
        this.musicalEntity = musicalEntity;
        this.listener = listener;
        this.id=new LikeId(listener.getId(),musicalEntity.getId());
    }
}