package com.ukim.finki.develop.finkwave.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "listens", schema = "project")
public class Listen {
    @EmbeddedId
    private ListenId id;

    @MapsId("listenerId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JsonIgnore
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "listener_id", nullable = false)
    private Listener listener;

    @MapsId("songId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JsonIgnore
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "song_id", nullable = false)
    private Song song;

}