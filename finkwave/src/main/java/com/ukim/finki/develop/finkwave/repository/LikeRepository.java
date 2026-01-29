package com.ukim.finki.develop.finkwave.repository;

import com.ukim.finki.develop.finkwave.model.dto.MusicalEntityDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ukim.finki.develop.finkwave.model.Like;
import com.ukim.finki.develop.finkwave.model.LikeId;

import java.util.List;

@Repository
public interface LikeRepository extends JpaRepository<Like, LikeId> {
    @Query("SELECT NEW com.ukim.finki.develop.finkwave.model.dto.MusicalEntityDto(l.musicalEntity.id, " +
            "l.musicalEntity.title," +
            "l.musicalEntity.genre, " +
           "CASE WHEN s.id IS NOT NULL THEN 'SONG' " +
           "WHEN a.id IS NOT NULL THEN 'ALBUM' " +
           "ELSE 'UNKNOWN' END)" +
           "FROM Like l " +
           "LEFT JOIN Song s ON s.musicalEntities.id = l.musicalEntity.id " +
           "LEFT JOIN Album a ON a.musicalEntities.id = l.musicalEntity.id " +
           "WHERE l.listener.id = :listenerId")
    List<MusicalEntityDto> findLikedEntitiesWithTypeByListenerId(@Param("listenerId") Long listenerId);
}
