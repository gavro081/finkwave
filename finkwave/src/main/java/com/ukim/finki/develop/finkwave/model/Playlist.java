package com.ukim.finki.develop.finkwave.model;

import jakarta.persistence.*;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "playlists", schema = "project")
@NoArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Playlist {
    @Id
    @Column(name = "playlist_id", nullable = false)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "playlist_seq_gen")
    @SequenceGenerator(name = "playlist_seq_gen", sequenceName = "project.playlists_seq", schema = "project", allocationSize = 1)
    private Long id;

    @Column(name = "cover", length = Integer.MAX_VALUE)
    private String cover;

    @Column(name = "name", nullable = false, length = Integer.MAX_VALUE)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "created_by")
    private Listener createdBy;

    public Playlist(String cover, String name, Listener createdBy) {
        this.cover = cover;
        this.name = name;
        this.createdBy = createdBy;
    }
}