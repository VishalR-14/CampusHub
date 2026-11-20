package com.campushub.controller;

import com.campushub.entity.Event;
import com.campushub.repository.EventRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "http://localhost:5173")
public class EventController {

    private final EventRepository eventRepository;

    public EventController(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    @GetMapping
    public ResponseEntity<?> getEvents() {
        return ResponseEntity.ok(
                eventRepository.findAll(
                        org.springframework.data.domain.Sort
                                .by(org.springframework.data.domain.Sort.Direction.ASC, "eventDate")
                )
        );
    }

    @PostMapping
    public ResponseEntity<?> createEvent(@RequestBody Event event) {
        if (event.getTitle() == null || event.getTitle().isBlank()
                || event.getEventDate() == null
                || event.getEventTime() == null
                || event.getVenue() == null || event.getVenue().isBlank()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Title, date, time and venue are required"));
        }

        if (event.getCapacity() != null && event.getCapacity() < 1) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Capacity must be at least 1"));
        }

        return ResponseEntity.ok(eventRepository.save(event));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEvent(@PathVariable Long id) {
        if (!eventRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        eventRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Event deleted successfully"));
    }
}