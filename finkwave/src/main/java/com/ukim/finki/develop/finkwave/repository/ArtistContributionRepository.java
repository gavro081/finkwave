package com.ukim.finki.develop.finkwave.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ukim.finki.develop.finkwave.model.ArtistContribution;
import com.ukim.finki.develop.finkwave.model.ArtistContributionId;

import java.util.List;

@Repository
public interface ArtistContributionRepository extends JpaRepository<ArtistContribution, ArtistContributionId> {

    List<ArtistContribution>findAllByArtist_Id(Long id);
}
