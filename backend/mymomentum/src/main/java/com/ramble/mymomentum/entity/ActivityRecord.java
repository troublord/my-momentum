package com.ramble.mymomentum.entity;

import com.ramble.mymomentum.enums.RecordSource;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.GenericGenerator;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "activity_records")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ActivityRecord {

    @Id
    @GeneratedValue(generator = "uuid2")
    @GenericGenerator(name = "uuid2", strategy = "uuid2")
    @Column(name = "id", columnDefinition = "UUID")
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "activity_id", nullable = false)
    private Activity activity;

    @Column(name = "executed_at", nullable = false)
    private LocalDateTime executedAt;

    @Column(name = "duration", nullable = false)
    private Integer duration; // Duration in seconds

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Enumerated(EnumType.STRING)
    @Column(name = "source", nullable = false)
    private RecordSource source;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
} 