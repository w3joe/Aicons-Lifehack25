package aicon.lifehack.central_learning.controller;
import aicon.lifehack.central_learning.dto.LoginRequestDTO;
import aicon.lifehack.central_learning.model.User;
import aicon.lifehack.central_learning.service.UserService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.ResponseEntity.BodyBuilder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService UserService;

    public AuthController(UserService UserService) {
        this.UserService = UserService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO loginRequest)
            throws ExecutionException, InterruptedException {
        
        User user = UserService.loginUser(loginRequest.getEmail(), loginRequest.getPassword());

        if (user != null) {
            // Successful login, return the user data (password will be ignored by Jackson)
            //return ResponseEntity.ok(user);
            return ResponseEntity.status(HttpStatus.OK).body(ResponseEntity.ok().body(user)); // 200 OK
        } else {
            // Let our GlobalExceptionHandler handle this for a clean 401 Unauthorized
            //throw new AuthenticationException("Invalid email or password");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(((BodyBuilder) ResponseEntity.notFound()).body("Invalid email or password"));
        }
    }
}