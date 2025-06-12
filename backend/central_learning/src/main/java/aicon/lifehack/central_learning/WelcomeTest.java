package aicon.lifehack.central_learning;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class WelcomeTest {
    
    @GetMapping("/welcome")
    public String WelomeTest(){
        return "Welcome to Sprng";
    }
}
