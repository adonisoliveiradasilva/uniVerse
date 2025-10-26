package br.com.my_universe.api.application.ports;

import java.util.List;
import java.util.Optional;
import br.com.my_universe.api.domain.Course;

public interface CourseRepository {
    Course save(Course course);
    Course update(String originalCode, String originalAcronym, Course courseDetails);
    Optional<Course> findByCodeAndInstitutionAcronym(String code, String institutionAcronym);
    List<Course> findAllByInstitutionAcronym(String institutionAcronym);
    List<Course> findAll();
    void deleteByCodeAndInstitutionAcronym(String code, String institutionAcronym);
}
