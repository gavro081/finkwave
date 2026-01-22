package com.ukim.finki.develop.finkwave.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
@Entity
@Table(name = "events", schema = "project")
public class Event {
    @Id
    @Column(name = "event_id", nullable = false)
    private Long id;

    @Column(nullable = false, length = Integer.MAX_VALUE)
    private String name;

    @Column( nullable = false, length = Integer.MAX_VALUE)
    private String location;

    @Column(nullable = false, length = Integer.MAX_VALUE)
    private String venue;

    @Column(nullable = false)
    private LocalDate date;

    @Column(nullable = false)
    private LocalTime time;

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "creator_artist_id")
    private Artist creatorArtist;

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "creator_admin_id")
    private Admin creatorAdmin;

}