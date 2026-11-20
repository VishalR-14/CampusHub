
package com.campushub.repository;

import com.campushub.entity.EventRegistration;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EventRegistrationRepository
        extends JpaRepository<EventRegistration, Long> {

    boolean existsByEventIdAndStudentId(Long eventId, Long studentId);

    List<EventRegistration> findByStudentId(Long studentId);

    List<EventRegistration> findByEventId(Long eventId);

    long countByEventId(Long eventId);
}
