package aicon.lifehack.central_learning.service;

import aicon.lifehack.central_learning.model.Resource;
import com.google.cloud.firestore.*;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;

@Service
public class ResourceService {

    private final Firestore firestore;
    private static final String COLLECTION_NAME = "resources";

    public ResourceService(Firestore firestore) {
        this.firestore = firestore;
    }
    
    private CollectionReference getResourcesCollection() {
        return firestore.collection(COLLECTION_NAME);
    }

    public Resource createResource(Resource resource) throws ExecutionException, InterruptedException {
        DocumentReference docRef = getResourcesCollection().document();
        resource.setResource_id(docRef.getId());
        docRef.set(resource).get();
        return resource;
    }
    
    public Resource getResource(String resourceId) throws ExecutionException, InterruptedException {
        DocumentSnapshot document = getResourcesCollection().document(resourceId).get().get();
        return document.exists() ? document.toObject(Resource.class) : null;
    }

    public List<Resource> getResourcesByLesson(String lessonId) throws ExecutionException, InterruptedException {
        List<Resource> resourceList = new ArrayList<>();
        QuerySnapshot querySnapshot = getResourcesCollection().whereEqualTo("lesson_id", lessonId).get().get();
        
        querySnapshot.getDocuments().forEach(document -> {
            resourceList.add(document.toObject(Resource.class));
        });
        return resourceList;
    }
    
    public Resource updateResource(String resourceId, Resource resource) throws ExecutionException, InterruptedException {
        DocumentReference docRef = getResourcesCollection().document(resourceId);
        if (docRef.get().get().exists()) {
            docRef.update("title", resource.getTitle());
            docRef.update("url_or_content", resource.getUrl_or_content());
            return docRef.get().get().toObject(Resource.class);
        }
        return null;
    }
    
    public boolean deleteResource(String resourceId) throws ExecutionException, InterruptedException {
        // Here you would also need to delete the file from Firebase Storage
        // to avoid orphaned files.
        DocumentReference docRef = getResourcesCollection().document(resourceId);
        if (docRef.get().get().exists()) {
            // TODO: Add logic to delete from Firebase Storage using the URL
            docRef.delete();
            return true;
        }
        return false;
    }
}