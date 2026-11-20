
package com.campushub.controller;

import com.campushub.entity.Student;
import com.campushub.repository.StudentRepository;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "http://localhost:5173")
public class StudentController {

    private final StudentRepository repository;
    private final PasswordEncoder passwordEncoder;

    public StudentController(
            StudentRepository repository,
            PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Student student) {

        if (student.getFullName() == null ||
            student.getFullName().isBlank() ||
            student.getEmail() == null ||
            student.getEmail().isBlank() ||
            student.getStudentId() == null ||
            student.getStudentId().isBlank() ||
            student.getPassword() == null ||
            student.getPassword().length() < 8) {

            return ResponseEntity.badRequest().body(
                Map.of("message", "Please fill all required fields. Password must have at least 8 characters.")
            );
        }

        String email = student.getEmail().trim().toLowerCase();
        String studentId = student.getStudentId().trim();

        if (repository.findByEmail(email).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(
                Map.of("message", "Email already registered")
            );
        }

        if (repository.findByStudentId(studentId).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(
                Map.of("message", "Student ID already registered")
            );
        }

        student.setEmail(email);
        student.setStudentId(studentId);
        student.setFullName(student.getFullName().trim());

        student.setPassword(
            passwordEncoder.encode(student.getPassword())
        );

        Student saved = repository.save(student);

        Map<String, Object> response = new HashMap<>();
        response.put("id", saved.getId());
        response.put("fullName", saved.getFullName());
        response.put("email", saved.getEmail());
        response.put("studentId", saved.getStudentId());
        response.put("message", "Registration successful");

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public List<Map<String, Object>> getAllStudents() {

        List<Student> students = repository.findAll();
        List<Map<String, Object>> result = new ArrayList<>();

        for (Student student : students) {
            Map<String, Object> item = new HashMap<>();

            item.put("id", student.getId());
            item.put("fullName", student.getFullName());
            item.put("email", student.getEmail());
            item.put("studentId", student.getStudentId());
            item.put("department", student.getDepartment());
            item.put("studyYear", student.getStudyYear());

            result.add(item);
        }

        return result;
    }
}
