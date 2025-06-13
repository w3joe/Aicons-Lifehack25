package aicon.lifehack.central_learning.model;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.google.cloud.firestore.annotation.PropertyName;
import lombok.Data;
import java.util.Date; 
@Data // Lombok annotation to create all the getters, setters, equals, hash, and toString methods
public class User {

    private String user_id;
    private String username;
    private String email;
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;

    private Date created_at;
}