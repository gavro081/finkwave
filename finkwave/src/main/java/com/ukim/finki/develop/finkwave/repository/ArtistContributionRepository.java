package com.ukim.finki.develop.finkwave.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.data.repository.query.Param;
import com.ukim.finki.develop.finkwave.model.ArtistContribution;
import com.ukim.finki.develop.finkwave.model.ArtistContributionId;

import java.util.List;

@Repository
public interface ArtistContributionRepository extends JpaRepository<ArtistContribution, ArtistContributionId> {

    @Query("SELECT ac.musicalEntity.id,ac.musicalEntity.title,ac.role, "+
        "CASE WHEN s.id IS NOT NULL THEN 'Song' "+
        "WHEN a.id IS NOT NULL THEN 'Album' "+
        "ELSE 'Unknown' END "+
        "FROM ArtistContribution ac "+
        "LEFT JOIN Song s  ON s.musicalEntities.id=ac.musicalEntity.id "+
        "LEFT JOIN Album a ON a.musicalEntities.id=ac.musicalEntity.id "+
        "WHERE ac.artist.id=:artistId")
    List<Object[]>findContributionsByArtistId(@Param("artistId")Long artistId);
}
