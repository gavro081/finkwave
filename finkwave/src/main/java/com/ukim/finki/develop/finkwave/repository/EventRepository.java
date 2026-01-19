package com.ukim.finki.develop.finkwave.repository;

import com.ukim.finki.develop.finkwave.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
}
