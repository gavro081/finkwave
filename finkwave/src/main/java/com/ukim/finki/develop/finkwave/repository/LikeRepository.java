package com.ukim.finki.develop.finkwave.repository;

import com.ukim.finki.develop.finkwave.model.MusicalEntity;
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
    @Query("SELECT NEW com.ukim.finki.develop.finkwave.model.dto.MusicalEntityDto(" +
            "me.id, " +
            "me.title, " +
            "me.genre, " +
            "CASE WHEN s.id IS NOT NULL THEN 'SONG' " +
            "     WHEN a.id IS NOT NULL THEN 'ALBUM' " +
            "     ELSE 'UNKNOWN' END, " +
            "u.fullName, " +
            "(CASE WHEN currentUserLike.id IS NOT NULL THEN true ELSE false END)" +
            ") " +
            "FROM Like l " +
            "JOIN l.musicalEntity me " +
            "JOIN me.releasedBy nu " +
            "JOIN nu.nonAdminUser.user u " +
            "LEFT JOIN Song s ON s.musicalEntities.id = me.id " +
            "LEFT JOIN Album a ON a.musicalEntities.id = me.id " +
            "LEFT JOIN Like currentUserLike ON currentUserLike.musicalEntity.id = me.id " +
            "AND currentUserLike.listener.id = :currentUserId " +
            "WHERE l.listener.id = :listenerId")
    List<MusicalEntityDto> findLikedEntitiesWithTypeByListenerId(@Param("currentUserId")Long currentUserId,@Param("listenerId") Long listenerId);


    @Query("SELECT CASE WHEN COUNT (l)>0 THEN true ELSE false END " +
            "FROM MusicalEntity  me " +
            "JOIN Like  l on l.musicalEntity.id=me.id " +
            "WHERE l.listener.id=:userId"

    )
    boolean isLikedByUser(@Param("userId") Long userId);
}
