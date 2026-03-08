package com.ogs.autograde.services.Implemantation;

import com.ogs.autograde.Repository.FacultyRepo;
import com.ogs.autograde.Repository.StudentRepo;
import com.ogs.autograde.models.Faculty;
import com.ogs.autograde.models.Role;
import com.ogs.autograde.models.Student;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;


@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {
    final private StudentRepo studentRepo;
    final private FacultyRepo facultyRepo;
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Optional<Student> student = studentRepo.findByEmail(email);
        if(student.isPresent())
        {
            return buildUserDetails(student.get().getEmail(),student.get().getPassword(),student.get().getRole());
        }
        Optional<Faculty> faculty = facultyRepo.findByEmail(email);
        if(faculty.isPresent())
        {
            return buildUserDetails(faculty.get().getEmail(),faculty.get().getPassword(),faculty.get().getRole());
        }
        throw new IllegalArgumentException("user not found");
    }
    private UserDetails buildUserDetails(String username, String password, Role role) {
        return org.springframework.security.core.userdetails.User
                .withUsername(username)
                .password(password)
                .authorities(role.name())
                .build();
    }
}
