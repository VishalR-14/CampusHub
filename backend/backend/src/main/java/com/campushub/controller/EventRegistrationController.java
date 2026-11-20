
package com.campushub.controller;

import com.campushub.entity.Event;
import com.campushub.entity.EventRegistration;
import com.campushub.repository.EventRegistrationRepository;
import com.campushub.repository.EventRepository;
import com.campushub.repository.StudentRepository;

import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/event-registrations")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class EventRegistrationController {

    private final EventRegistrationRepository registrationRepository;
    private final EventRepository eventRepository;
    private final StudentRepository studentRepository;

    public EventRegistrationController(
            EventRegistrationRepository registrationRepository,
            EventRepository eventRepository,
            StudentRepository studentRepository) {
        this.registrationRepository = registrationRepository;
        this.eventRepository = eventRepository;
        this.studentRepository = studentRepository;
    }

    // Register the logged-in student for an event
    @PostMapping("/{eventId}")
    public ResponseEntity<?> registerForEvent(
            @PathVariable Long eventId,
            HttpSession session) {

        Long studentId = (Long) session.getAttribute("studentId");

        if (studentId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Please log in first."));
        }

        if (!studentRepository.existsById(studentId)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Student account not found."));
        }

        Event event = eventRepository.findById(eventId).orElse(null);

        if (event == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Event not found."));
        }

        if (registrationRepository.existsByEventIdAndStudentId(eventId, studentId)) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "You are already registered for this event."));
        }

        long registeredCount = registrationRepository.countByEventId(eventId);

        if (event.getCapacity() != null && registeredCount >= event.getCapacity()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Sorry, this event is full."));
        }

        EventRegistration registration = new EventRegistration();
        registration.setEventId(eventId);
        registration.setStudentId(studentId);

        registrationRepository.save(registration);

        return ResponseEntity.ok(
                Map.of("message", "Successfully registered for the event.")
        );
    }

    // Get registrations of the logged-in student
    @GetMapping("/my")
    public ResponseEntity<?> getMyRegistrations(HttpSession session) {

        Long studentId = (Long) session.getAttribute("studentId");

        if (studentId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Please log in first."));
        }

        List<Map<String, Object>> result = registrationRepository
                .findByStudentId(studentId)
                .stream()
                .map(registration -> {
                    Map<String, Object> item = new HashMap<>();
                    item.put("registrationId", registration.getId());
                    item.put("registeredAt", registration.getRegisteredAt());

                    eventRepository.findById(registration.getEventId())
                            .ifPresent(event -> {
                                item.put("eventId", event.getId());
                                item.put("title", event.getTitle());
                                item.put("category", event.getCategory());
                                item.put("eventDate", event.getEventDate());
                                item.put("eventTime", event.getEventTime());
                                item.put("venue", event.getVenue());
                            });

                    return item;
                })
                .toList();

        return ResponseEntity.ok(result);
    }
}
