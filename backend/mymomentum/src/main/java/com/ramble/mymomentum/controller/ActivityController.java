package com.ramble.mymomentum.controller;

import com.ramble.mymomentum.dto.CreateActivityRequest;
import com.ramble.mymomentum.entity.Activity;
import com.ramble.mymomentum.service.ActivityService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/activities")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Activity Management", description = "APIs for managing user activities")
public class ActivityController {

    private final ActivityService activityService;

    @PostMapping
    @Operation(
        summary = "Create a new activity",
        description = "Creates a new activity for the specified user"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "201",
            description = "Activity created successfully",
            content = @Content(schema = @Schema(implementation = Activity.class))
        ),
        @ApiResponse(
            responseCode = "400",
            description = "Bad request - Activity with same name already exists"
        )
    })
    public ResponseEntity<Activity> createActivity(
            @Parameter(description = "User ID", example = "123e4567-e89b-12d3-a456-426614174000")
            @RequestParam UUID userId,
            @RequestBody CreateActivityRequest request) {
        
        log.info("Creating activity for user: {}", userId);
        Activity createdActivity = activityService.createActivity(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdActivity);
    }

    @GetMapping
    @Operation(
        summary = "Get all activities for a user",
        description = "Retrieves all activities belonging to the specified user"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Activities retrieved successfully",
            content = @Content(schema = @Schema(implementation = Activity.class))
        )
    })
    public ResponseEntity<List<Activity>> getActivities(
            @Parameter(description = "User ID", example = "123e4567-e89b-12d3-a456-426614174000")
            @RequestParam UUID userId) {
        
        log.info("Fetching activities for user: {}", userId);
        List<Activity> activities = activityService.getActivitiesByUserId(userId);
        return ResponseEntity.ok(activities);
    }
} 