package com.ogs.autograde.services;

import com.ogs.autograde.Repository.FacultyRepo;
import com.ogs.autograde.Repository.StudentRepo;
import com.ogs.autograde.models.Faculty;
import com.ogs.autograde.models.Student;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserDetailsServiceImpl implements UserDetailsService {

    private final FacultyRepo facultyRepo;
    private final StudentRepo studentRepo;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        log.info("Loading user details for email: {}", email);

        // Try to find Faculty by email
        Optional<Faculty> faculty = facultyRepo.findByEmail(email);
        if (faculty.isPresent()) {
            Faculty f = faculty.get();
            log.info("Faculty found with email: {}", email);
            return new User(
                    f.getEmail(),
                    f.getPassword(),
                    Collections.singletonList(new SimpleGrantedAuthority(f.getRole().toString()))
            );
        }

        // Try to find Student by email
        Optional<Student> student = studentRepo.findByEmail(email);
        if (student.isPresent()) {
            Student s = student.get();
            log.info("Student found with email: {}", email);
            return new User(
                    s.getEmail(),
                    s.getPassword(),
                    Collections.singletonList(new SimpleGrantedAuthority(s.getRole().toString()))
            );
        }

        log.error("User not found with email: {}", email);
        throw new UsernameNotFoundException("User not found with email: " + email);
    }
}
