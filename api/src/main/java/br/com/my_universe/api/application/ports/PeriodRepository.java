package br.com.my_universe.api.application.ports;

import br.com.my_universe.api.domain.Period;
import java.util.List;
import java.util.Optional;

public interface PeriodRepository {
    Period save(Period period);
    
    Period update(Period period);
    
    void deleteById(Integer id, String studentEmail);
    
    Optional<Period> findById(Integer id, String studentEmail);
    
    List<Period> findAllByStudentEmail(String studentEmail);

    Double getGlobalAverageIndex(String studentEmail);
}