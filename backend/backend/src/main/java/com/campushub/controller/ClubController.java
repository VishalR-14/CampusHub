package com.campushub.controller;

import com.campushub.entity.Club;
import com.campushub.repository.ClubRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/clubs")
@CrossOrigin(origins = "http://localhost:5173")
public class ClubController {

    private final ClubRepository clubRepository;

    public ClubController(ClubRepository clubRepository) {
        this.clubRepository = clubRepository;
    }

    @GetMapping
    public ResponseEntity<?> getClubs() {
        return ResponseEntity.ok(clubRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<?> createClub(@RequestBody Club club) {
        if (club.getName() == null || club.getName().isBlank()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Club name is required"));
        }

        if (clubRepository.existsByNameIgnoreCase(club.getName().trim())) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "A club with this name already exists"));
        }

        club.setName(club.getName().trim());
        club.setMemberCount(0);

        return ResponseEntity.ok(clubRepository.save(club));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteClub(@PathVariable Long id) {
        if (!clubRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        clubRepository.deleteById(id);

        return ResponseEntity.ok(
                Map.of("message", "Club deleted successfully")
        );
    }
}