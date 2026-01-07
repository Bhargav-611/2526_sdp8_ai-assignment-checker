package com.ogs.autograde.Repository;

import com.ogs.autograde.models.Faculty;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FacultyRepo extends JpaRepository<Faculty,Long> {
}
