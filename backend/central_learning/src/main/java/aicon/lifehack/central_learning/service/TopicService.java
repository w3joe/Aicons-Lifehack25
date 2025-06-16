package aicon.lifehack.central_learning.service;

import aicon.lifehack.central_learning.model.Course;
import aicon.lifehack.central_learning.model.Topic;
import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;

@Service
public class TopicService {

    private final Firestore firestore;
    private final CourseService courseService;
    private static final String COLLECTION_NAME = "topics";

    public TopicService(Firestore firestore, CourseService courseService) {
        this.firestore = firestore;
        this.courseService = courseService;
    }
    
    private CollectionReference getTopicsCollection() {
        return firestore.collection(COLLECTION_NAME);
    }

    // --- CREATE ---
    public Topic createTopic(Topic topic) throws ExecutionException, InterruptedException {
        DocumentReference docRef = getTopicsCollection().document();
        topic.setTopic_id(docRef.getId());
        docRef.set(topic).get();
        return topic;
    }

    // --- READ (Get One) ---
    public Topic getTopic(String topicId) throws ExecutionException, InterruptedException {
        DocumentReference docRef = getTopicsCollection().document(topicId);
        DocumentSnapshot document = docRef.get().get();
        if (document.exists()) {
            return document.toObject(Topic.class);
        }
        return null;
    }

    // --- READ (Get All) ---
    public List<Topic> getAllTopics() throws ExecutionException, InterruptedException {
        List<Topic> topicList = new ArrayList<>();
        getTopicsCollection().get().get().getDocuments().forEach(document -> {
            topicList.add(document.toObject(Topic.class));
        });
        return topicList;
    }

    // --- UPDATE ---
    public Topic updateTopic(String topicId, Topic topic) throws ExecutionException, InterruptedException {
        // We only care about the name and description from the request body.
        // The topicId comes from the URL path.
        DocumentReference docRef = getTopicsCollection().document(topicId);
        DocumentSnapshot document = docRef.get().get();
        
        if (document.exists()) {
        Topic existingTopic = document.toObject(Topic.class);
        
        // 4. Selectively update the fields from the DTO
        if (topic.getName() != null) {
            existingTopic.setName(topic.getName());
        }
        if (topic.getDescription() != null) {
            existingTopic.setDescription(topic.getDescription());
        }            
            // Set the ID from the path to return the full object
            docRef.set(existingTopic).get();
            return existingTopic;

        } else {
            return null;
        }
    }
    
    // --- DELETE ---
    public boolean deleteTopic(String topicId) throws ExecutionException, InterruptedException {
        DocumentReference topicDocRef = getTopicsCollection().document(topicId);
        if (!topicDocRef.get().get().exists()) {
            return false; // Topic not found
        }

        // 1. Find all courses for this topic
        List<Course> coursesToDelete = courseService.getCoursesByTopic(topicId);

        // 2. For each course, call its own delete method (which will handle deleting its lessons)
        for (Course course : coursesToDelete) {
            courseService.deleteCourse(course.getCourse_id());
        }

        // 3. Finally, delete the topic itself
        topicDocRef.delete();

        return true;
    }   
}