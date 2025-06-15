package aicon.lifehack.central_learning.controller;

import aicon.lifehack.central_learning.model.User;
import aicon.lifehack.central_learning.service.UserService;
import aicon.lifehack.central_learning.dto.UpdateUserDTO;
import aicon.lifehack.central_learning.model.Course; 
import aicon.lifehack.central_learning.service.CourseService; 
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.ResponseEntity.BodyBuilder;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService UserService;
    private final CourseService courseService;

   public UserController(UserService UserService, CourseService courseService) {
        this.UserService = UserService;
        this.courseService = courseService;
    }

    /**
     * Creates a new user.
     * Return 400 if Bad Request
     * Returns 201 Created with the location of the new resource and the created user in the body.
     */
    @PostMapping
    public ResponseEntity<?> createUser(@RequestBody User user) throws ExecutionException, InterruptedException {
        // The service now returns the created user, including the new ID
        User createdUser = UserService.createUser(user);

        // Build the URI for the 'Location' header
        URI location = URI.create("/api/users/" + createdUser.getUser_id());

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ResponseEntity.created(location).body(createdUser));
    }

    /**
     * Retrieves a single user by their ID.
     * Returns 200 OK with the user if found.
     * Returns 404 Not Found if the user does not exist.
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getUser(@PathVariable String id) throws ExecutionException, InterruptedException {
        User user = UserService.getUser(id);
        if (user != null) {
            return ResponseEntity.status(HttpStatus.OK).body(ResponseEntity.ok().body(user)); // 200 OK
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(((BodyBuilder) ResponseEntity.notFound()).body("User not found with ID: " + id));
        }
    }

    /**
     * Retrieves a list of all users.
     * Returns 200 OK with the list of users.
     */
    @GetMapping
    public ResponseEntity<?> getAllUsers() throws ExecutionException, InterruptedException {
        List<User> userList = UserService.getAllUsers();
        //return ResponseEntity.ok(userList); // 200 OK
        return ResponseEntity.status(HttpStatus.OK).body(ResponseEntity.ok().body(userList)); // 200 OK
    }

    // --- GET ALL COURSES LIKED BY A USER ---
    @GetMapping("/{userId}/liked-courses")
    public ResponseEntity<?> getLikedCourses(@PathVariable String userId) 
            throws ExecutionException, InterruptedException {

        User user = UserService.getUser(userId);
        if (user != null) {
            List<Course> likedCourses = courseService.getLikedCoursesByUser(userId);
            return ResponseEntity.status(HttpStatus.OK).body(ResponseEntity.ok().body(likedCourses)); // 200 OK
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(((BodyBuilder) ResponseEntity.notFound()).body("User not found with ID: " + userId));
        }
        
    }


    /**
     * Updates an existing user. The user's ID must be included in the request body.
     * Returns 200 OK with the confirmation message.
     * Consider throwing ResourceNotFoundException if user.getId() is for a non-existent user.
     */
    @PutMapping("/{userId}")
    public ResponseEntity<?> updateUser(@PathVariable String userId, @RequestBody UpdateUserDTO updateUserDTO)
        throws ExecutionException, InterruptedException {
    
    User updatedUser = UserService.updateUser(userId, updateUserDTO);

    if (updatedUser != null) {
        // Return 200 OK with the updated user object.
        //return ResponseEntity.ok(updatedUser);
        return ResponseEntity.status(HttpStatus.OK).body(ResponseEntity.ok().body(updatedUser));
    } else {
        // Let the GlobalExceptionHandler handle this for a clean 404 response
         return ResponseEntity.status(HttpStatus.NOT_FOUND).body(((BodyBuilder) ResponseEntity.notFound()).body("User not found with ID: " + userId));
    }
}

    // In UserController.java
    @DeleteMapping("{id}")
    public ResponseEntity<?> deleteUser(@PathVariable String id) throws ExecutionException, InterruptedException {
    
    boolean deleted = UserService.deleteUser(id);
        
        if (deleted) {
            // Return 200 if succeed
            return ResponseEntity.status(HttpStatus.OK).body(ResponseEntity.ok().body("User " + id + " is deleted"));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(((BodyBuilder) ResponseEntity.notFound()).body("Cannot delete. User not found with ID: " + id));

        }
    }
}