package com.fluentdoc.language.repository;


import com.fluentdoc.language.model.Language;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LanguageRepository extends JpaRepository<Language, String> {

     Language findOneById(String id);

     Language findOneByName(String name);

    List<Language> findAllByCreatorId(String userId);
}
