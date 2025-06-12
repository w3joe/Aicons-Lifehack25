package aicon.lifehack.central_learning.Firebase;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import java.io.IOException;
import java.io.InputStream;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;

@Configuration
public class FirebaseConfig {

    // Inject the path from application.properties
    @Value("${app.firebase.service-account-key-path}")
    private Resource serviceAccountResource;

    @Bean
    public Firestore firestore() throws IOException {
        // Use a service account
        InputStream serviceAccount = serviceAccountResource.getInputStream();

        FirebaseOptions options = FirebaseOptions.builder()
        .setCredentials(GoogleCredentials.fromStream(serviceAccount))
        .build();

        // Initialize the app if it's not already initialized
        if (FirebaseApp.getApps().isEmpty()) {
            FirebaseApp.initializeApp(options);
        }

        return FirestoreClient.getFirestore();
    }
}