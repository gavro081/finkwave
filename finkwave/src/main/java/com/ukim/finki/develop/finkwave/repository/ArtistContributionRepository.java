package com.ukim.finki.develop.finkwave.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ukim.finki.develop.finkwave.model.ArtistContribution;
import com.ukim.finki.develop.finkwave.model.ArtistContributionId;

@Repository
public interface ArtistContributionRepository extends JpaRepository<ArtistContribution, ArtistContributionId> {
}
