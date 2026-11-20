package com.campushub.controller;

import com.campushub.entity.Announcement;
import com.campushub.repository.AnnouncementRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/announcements")
@CrossOrigin(origins = "http://localhost:5173")
public class AnnouncementController {

    private final AnnouncementRepository repository;

    public AnnouncementController(AnnouncementRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public ResponseEntity<?> getAnnouncements() {
        return ResponseEntity.ok(
                repository.findAll(
                        org.springframework.data.domain.Sort
                                .by(org.springframework.data.domain.Sort.Direction.DESC, "createdAt")
                )
        );
    }

    @PostMapping
    public ResponseEntity<?> createAnnouncement(
            @RequestBody Announcement announcement) {

        if (announcement.getTitle() == null
                || announcement.getTitle().isBlank()
                || announcement.getMessage() == null
                || announcement.getMessage().isBlank()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Title and message are required"));
        }

        announcement.setTitle(announcement.getTitle().trim());

        return ResponseEntity.ok(repository.save(announcement));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAnnouncement(@PathVariable Long id) {
        if (!repository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        repository.deleteById(id);

        return ResponseEntity.ok(
                Map.of("message", "Announcement deleted successfully")
        );
    }
}