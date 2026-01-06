package com.ogs.autograde.Repository;


import com.ogs.autograde.models.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StudentRepo extends JpaRepository<Student,Long> {
}
