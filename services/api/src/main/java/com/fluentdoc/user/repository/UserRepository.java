package com.fluentdoc.user.repository;

import com.fluentdoc.user.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, String> {

    // Query for a user in the database by email
    User findOneByEmail(String email);
    User findOneById(String id);
    default List<User> findAllByRolesContaining(String role) {
        return findAll().stream()
                .filter(user -> user.getRoles() != null && user.getRoles().contains(role))
                .toList();
    }

    User findOneByUsername(String username);
}
