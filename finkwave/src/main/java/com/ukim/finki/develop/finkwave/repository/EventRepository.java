package com.ukim.finki.develop.finkwave.repository;

import com.ukim.finki.develop.finkwave.model.Event;
import com.ukim.finki.develop.finkwave.model.EventProjection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    List<EventProjection> findAllByLocation(String location);
}
