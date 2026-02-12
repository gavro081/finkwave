package com.ukim.finki.develop.finkwave.model;

import java.time.LocalDate;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Getter
@Setter
@Entity
@Table(name = "musical_entities", schema = "project")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MusicalEntity {
    @Id
    @Column(name = "id", nullable = false)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "musical_entity_id_gen")
    @SequenceGenerator(name = "musical_entity_id_gen", sequenceName = "musical_entities_id_seq", allocationSize = 1)
    private Long id;

    @Column(name = "title", nullable = false, length = Integer.MAX_VALUE)
    private String title;

    @Column(name = "genre", nullable = false, length = Integer.MAX_VALUE)
    private String genre;

    @Column(name = "release_date", nullable = false)
    private LocalDate releaseDate;

    private String cover;

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "released_by")
    private Artist releasedBy;

}