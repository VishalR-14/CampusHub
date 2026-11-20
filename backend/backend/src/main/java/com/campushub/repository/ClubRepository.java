package com.campushub.repository;

import com.campushub.entity.Club;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClubRepository extends JpaRepository<Club, Long> {
    boolean existsByNameIgnoreCase(String name);
}