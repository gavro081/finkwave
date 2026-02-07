package com.ukim.finki.develop.finkwave.repository;

import com.ukim.finki.develop.finkwave.model.dto.MusicalEntityDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ukim.finki.develop.finkwave.model.Album;

import java.util.List;

@Repository
public interface AlbumRepository extends JpaRepository<Album, Long> {

    List<Album>findAllByIdIn(List<Long>ids);

    @Query("""
        SELECT NEW com.ukim.finki.develop.finkwave.model.dto.MusicalEntityDto(
            a.id, me.title, me.genre, 'ALBUM', u.fullName, u.username, me.cover, FALSE )
        FROM Album a
        JOIN a.musicalEntities me
        JOIN me.releasedBy rb
        JOIN rb.nonAdminUser nau
        JOIN nau.user u
        WHERE me.title ILIKE '%' || :searchTerm || '%'
    """)
    List<MusicalEntityDto> searchAlbums(@Param("currentUserId")Long currentUserId, @Param("searchTerm") String searchTerm);

}
