package aicon.lifehack.central_learning.model;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import java.util.List; 
import java.util.Date; 
@Data // Lombok annotation to create all the getters, setters, equals, hash, and toString methods
@JsonInclude(JsonInclude.Include.NON_NULL) // This is the key change
public class User {

    private String user_id;
    private String username;
    private String email;
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;
    private Date created_at;

    private UserRole role;
    private String classroom_id; //For students
    private List<String> classroomIds; //For Teachers
}