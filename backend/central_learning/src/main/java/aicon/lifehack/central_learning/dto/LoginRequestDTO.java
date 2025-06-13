package aicon.lifehack.central_learning.dto;
import lombok.Data;

@Data
public class LoginRequestDTO {
    private String email;
    private String password;
}