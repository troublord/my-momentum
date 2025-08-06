package com.ramble.mymomentum.repository;

import com.ramble.mymomentum.entity.Activity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ActivityRepository extends JpaRepository<Activity, UUID> {
    
    /**
     * Find all activities by user ID
     */
    List<Activity> findByUserId(UUID userId);
    
    /**
     * Check if activity exists by user ID and name
     */
    boolean existsByUserIdAndName(UUID userId, String name);
} 