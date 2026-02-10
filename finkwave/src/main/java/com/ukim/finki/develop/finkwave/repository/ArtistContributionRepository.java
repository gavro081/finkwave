package com.ukim.finki.develop.finkwave.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ukim.finki.develop.finkwave.model.ArtistContribution;
import com.ukim.finki.develop.finkwave.model.ArtistContributionId;
import com.ukim.finki.develop.finkwave.model.dto.ArtistContributionDto;
import com.ukim.finki.develop.finkwave.model.dto.ArtistContributionSummaryDto;

@Repository
public interface ArtistContributionRepository extends JpaRepository<ArtistContribution, ArtistContributionId> {

    @Query("""
        SELECT NEW com.ukim.finki.develop.finkwave.model.dto.ArtistContributionDto(
            ac.musicalEntity.id, ac.musicalEntity.title, ac.musicalEntity.genre, ac.role,
            (CASE WHEN s.id IS NOT NULL THEN 'SONG'
                  WHEN a.id IS NOT NULL THEN 'ALBUM'
                  ELSE 'Unknown' END),
            (CASE WHEN l.id IS NOT NULL THEN true ELSE false END),
            ac.musicalEntity.cover,
            s.link)
        FROM ArtistContribution ac
        LEFT JOIN Song s  ON s.musicalEntities.id=ac.musicalEntity.id
        LEFT JOIN Album a ON a.musicalEntities.id=ac.musicalEntity.id
        LEFT JOIN Like l ON l.musicalEntity.id=ac.musicalEntity.id AND l.listener.id=:currentUserId
        WHERE ac.artist.id=:artistId
        """)
    List<ArtistContributionDto>findContributionsByArtistId(@Param("currentUserId")Long currentUserId,@Param("artistId")Long artistId);


    @Query("""
    SELECT NEW com.ukim.finki.develop.finkwave.model.dto.ArtistContributionSummaryDto(
    ac.artist.nonAdminUser.user.fullName, ac.role
    )
    FROM ArtistContribution ac
    WHERE ac.id.musicalEntityId = :songId
    """)
    List<ArtistContributionSummaryDto> findContributionsBySongId(@Param("songId")Long songId);
}
