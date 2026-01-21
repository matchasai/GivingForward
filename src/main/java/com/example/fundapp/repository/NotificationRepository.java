package com.example.fundapp.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.example.fundapp.model.Notification;
import com.example.fundapp.model.User;

@Repository
public interface NotificationRepository extends MongoRepository<Notification, String> {
    List<Notification> findByUserOrderByCreatedAtDesc(User user);

    List<Notification> findByUserAndReadOrderByCreatedAtDesc(User user, boolean read);

    long countByUserAndRead(User user, boolean read);

    void deleteByUser(User user);
}
