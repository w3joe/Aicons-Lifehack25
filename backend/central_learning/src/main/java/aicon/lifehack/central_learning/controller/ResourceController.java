package aicon.lifehack.central_learning.controller;

import aicon.lifehack.central_learning.model.Resource;
import aicon.lifehack.central_learning.service.ResourceService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.ResponseEntity.BodyBuilder;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/api/resources")
public class ResourceController {

    private final ResourceService resourceService;

    public ResourceController(ResourceService resourceService) {
        this.resourceService = resourceService;
    }

    @PostMapping
    public ResponseEntity<?> createResource(@RequestBody Resource resource) throws ExecutionException, InterruptedException {
        Resource createdResource = resourceService.createResource(resource);
        URI location = URI.create("/api/resources/" + createdResource.getResource_id());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ResponseEntity.created(location).body(createdResource));

    }

    @GetMapping("/{resourceId}")
    public ResponseEntity<?> getResource(@PathVariable String resourceId) throws ExecutionException, InterruptedException {
        Resource resource = resourceService.getResource(resourceId);
        if (resource != null) {
            return ResponseEntity.status(HttpStatus.OK).body(ResponseEntity.ok().body(resource)); // 200 OK
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(((BodyBuilder) ResponseEntity.notFound()).body("Resource not found with ID: " + resourceId));

        }
    }
    
    @PutMapping("/{resourceId}")
    public ResponseEntity<?> updateResource(@PathVariable String resourceId, @RequestBody Resource resource) throws ExecutionException, InterruptedException {
        Resource updatedResource = resourceService.updateResource(resourceId, resource);
        if (updatedResource != null) {
            return ResponseEntity.status(HttpStatus.OK).body(ResponseEntity.ok().body(updatedResource)); // 200 OK
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(((BodyBuilder) ResponseEntity.notFound()).body("Cannot update. Resource not found with ID: " + resourceId));

        }
    }
    
    @DeleteMapping("/{resourceId}")
    public ResponseEntity<?> deleteResource(@PathVariable String resourceId) throws ExecutionException, InterruptedException {
        if (resourceService.deleteResource(resourceId)) {
            return ResponseEntity.status(HttpStatus.OK).body(ResponseEntity.ok().body("User " + resourceId + " is deleted"));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(((BodyBuilder) ResponseEntity.notFound()).body("Cannot delete. Resource not found with ID: " + resourceId));

        }
    }
}