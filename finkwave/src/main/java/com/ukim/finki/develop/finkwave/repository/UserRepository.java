package com.ukim.finki.develop.finkwave.repository;

import com.ukim.finki.develop.finkwave.model.User;
import com.ukim.finki.develop.finkwave.model.dto.UserSearchResultDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);


    @Query(value = """
        SELECT u.full_name, u.username, u.profile_photo from users u
        WHERE (u.full_name ILIKE '%' || :searchTerm || '%' or u.username ILIKE '%' || :searchTerm || '%')
            and u.listener = true and u.artist = false
        LIMIT :limit
        """, nativeQuery = true)
    List<UserSearchResultDto> searchListeners(@Param("searchTerm") String searchTerm, @Param("limit") Integer limit);

    @Query(value = """
        SELECT u.full_name, u.username, u.profile_photo from users u
        WHERE (u.full_name ILIKE '%' || :searchTerm || '%' or u.username ILIKE '%' || :searchTerm || '%') and u.artist = true
        LIMIT :limit
        """, nativeQuery = true)
    List<UserSearchResultDto> searchArtists(@Param("searchTerm") String searchTerm, @Param("limit") Integer limit);


}
