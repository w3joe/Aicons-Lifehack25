package aicon.lifehack.central_learning.service;

import aicon.lifehack.central_learning.model.Course;
import aicon.lifehack.central_learning.model.CourseLike;
import aicon.lifehack.central_learning.model.Lesson;
import aicon.lifehack.central_learning.dto.CourseDetailsDTO; 
import aicon.lifehack.central_learning.model.Lesson; 

import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.FieldPath;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.cloud.firestore.WriteBatch;
import com.google.common.collect.Lists; 
import org.springframework.stereotype.Service;
import com.google.cloud.firestore.FieldValue;
import java.util.Date; 
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;

@Service
public class CourseService {

    private final Firestore firestore;
     private final LessonService lessonService;
    private static final String COLLECTION_NAME = "courses";

    public CourseService(Firestore firestore, LessonService lessonService) {
        this.firestore = firestore;
        this.lessonService = lessonService;
    }
    
    private CollectionReference getCoursesCollection() {
        return firestore.collection(COLLECTION_NAME);
    }

    // --- CREATE ---
    public Course createCourse(Course course) throws ExecutionException, InterruptedException {
        // Here you might add a check to ensure the topic_id exists in the topics collection
        DocumentReference docRef = getCoursesCollection().document();
        course.setCourse_id(docRef.getId());
        docRef.set(course).get();
        return course;
    }

    // --- READ (Get One) ---
    public Course getCourse(String courseId) throws ExecutionException, InterruptedException {
        DocumentReference docRef = getCoursesCollection().document(courseId);
        DocumentSnapshot document = docRef.get().get();
        if (document.exists()) {
            return document.toObject(Course.class);
        }
        return null;
    }

    // --- READ (Get All by Topic ID) - The Special Endpoint ---
    public List<Course> getCoursesByTopic(String topicId) throws ExecutionException, InterruptedException {
        List<Course> courseList = new ArrayList<>();
        // Create a query to find all courses where the 'topic_id' field matches
        QuerySnapshot querySnapshot = getCoursesCollection().whereEqualTo("topic_id", topicId).get().get();
        
        querySnapshot.getDocuments().forEach(document -> {
            courseList.add(document.toObject(Course.class));
        });
        return courseList;
    }

    // --- GET COURSE WITH ALL ITS LESSONS ---
    public CourseDetailsDTO getCourseWithLessons(String courseId) throws ExecutionException, InterruptedException {
        //Fetch the main course document
        Course course = getCourse(courseId);

        if (course == null) {
            return null; // Course not found
        }
        
        //Fetch all lessons associated with this course
        List<Lesson> lessons = lessonService.getLessonsByCourse(courseId);
        
        // 3. Assemble the DTO
        CourseDetailsDTO courseDetails = new CourseDetailsDTO();
        courseDetails.setCourse_id(course.getCourse_id());
        courseDetails.setTopic_id(course.getTopic_id());
        courseDetails.setTitle(course.getTitle());
        courseDetails.setDescription(course.getDescription());
        courseDetails.setLike_count(course.getLike_count());
        courseDetails.setLessons(lessons); // Add the list of lessons
        
        return courseDetails;
    }


    public List<Course> getLikedCoursesByUser(String userId) throws ExecutionException, InterruptedException {
        //Find all 'like' documents for the given user.
        QuerySnapshot likesSnapshot = firestore.collection("course_likes")
                .whereEqualTo("user_id", userId)
                .get()
                .get();

        if (likesSnapshot.isEmpty()) {
            return new ArrayList<>(); // Return an empty list if the user has liked nothing.
        }

        //Extract all the 'course_id's from the like documents.
        List<String> likedCourseIds = new ArrayList<>();
        likesSnapshot.getDocuments().forEach(doc -> {
            likedCourseIds.add(doc.getString("course_id"));
        });

        //Fetch all course documents corresponding to the extracted IDs.
        // Firestore's 'in' query is limited to 30 items per query.
        // If a user can like more than 30 courses, we need to partition the list.
        List<Course> likedCourses = new ArrayList<>();
        List<List<String>> partitionedCourseIds = Lists.partition(likedCourseIds, 30);

        for (List<String> partition : partitionedCourseIds) {
            if (!partition.isEmpty()) {
                QuerySnapshot coursesSnapshot = getCoursesCollection()
                        .whereIn(FieldPath.documentId(), partition)
                        .get()
                        .get();
                
                coursesSnapshot.getDocuments().forEach(doc -> {
                    likedCourses.add(doc.toObject(Course.class));
                });
            }
        }
        
        return likedCourses;
    }
    
    // --- UPDATE ---
    public Course updateCourse(String courseId, Course course) throws ExecutionException, InterruptedException {
        DocumentReference docRef = getCoursesCollection().document(courseId);
        DocumentSnapshot document = docRef.get().get();
        
        if (document.exists()) {
            Course existingCourse = document.toObject(Course.class);

            docRef.update("title", course.getTitle());
            docRef.update("description", course.getDescription());
            if (course.getTitle() != null) {
                existingCourse.setTitle(course.getTitle());
            }
            if (course.getDescription() != null) {
                existingCourse.setDescription(course.getDescription());
            }
        docRef.set(existingCourse).get();
        return existingCourse;
        } else {
            return null;
        }
    }
    
    // --- DELETE ---
    public boolean deleteCourse(String courseId) throws ExecutionException, InterruptedException {
        DocumentReference courseDocRef = getCoursesCollection().document(courseId);
        if (!courseDocRef.get().get().exists()) {
            return false; // Course not found
        }
        
        // 1. Find all lessons for this course
        List<Lesson> lessonsToDelete = lessonService.getLessonsByCourse(courseId);
        
        // 2. Delete each lesson
        // For performance on large numbers of deletes, use a batched write
        WriteBatch batch = firestore.batch();
        for (Lesson lesson : lessonsToDelete) {
            DocumentReference lessonDocRef = firestore.collection("lessons").document(lesson.getLesson_id());
            batch.delete(lessonDocRef);
        }
        batch.commit().get(); // Commit all deletes at once

        // 3. Delete the course itself
        courseDocRef.delete();
        
        return true;
    }
    // --- LIKE A COURSE ---
    public boolean likeCourse(String courseId, String userId) throws ExecutionException, InterruptedException {
        DocumentReference courseRef = getCoursesCollection().document(courseId);
        String likeId = userId + "_" + courseId;
        DocumentReference likeRef = firestore.collection("course_likes").document(likeId);

        // Run the like operation as a transaction
        return (boolean) firestore.runTransaction(transaction -> {
            DocumentSnapshot courseSnapshot = transaction.get(courseRef).get();
            DocumentSnapshot likeSnapshot = transaction.get(likeRef).get();

            if (!courseSnapshot.exists()) {
                return("Course not found with ID: " + courseId);
            }
            
            // If the user has NOT already liked this course
            if (!likeSnapshot.exists()) {
                // 1. Increment the like_count on the course document
                transaction.update(courseRef, "like_count", FieldValue.increment(1));
                
                // 2. Create a new document in the course_likes collection
                CourseLike newLike = new CourseLike();
                newLike.setCourse_likes_id(likeId);
                newLike.setCourse_id(courseId);
                newLike.setUser_id(userId);
                newLike.setLiked_at(new Date());
                transaction.set(likeRef, newLike);
                
                return true; // The state was changed (a like was added)
            } else {
                return false; // The state did not change (like already existed)
            }
            
        }).get();
    }

    // --- UNLIKE A COURSE (Corrected Version) ---
    public boolean unlikeCourse(String courseId, String userId) throws ExecutionException, InterruptedException {
        DocumentReference courseRef = getCoursesCollection().document(courseId);
        String likeId = userId + "_" + courseId;
        DocumentReference likeRef = firestore.collection("course_likes").document(likeId);
        
        // Run the unlike operation as a transaction
        return (boolean) firestore.runTransaction(transaction -> {
            DocumentSnapshot courseSnapshot = transaction.get(courseRef).get();
            DocumentSnapshot likeSnapshot = transaction.get(likeRef).get();

            if (!courseSnapshot.exists()) {
                return("Course not found with ID: " + courseId);
            }

            // If the user HAS liked this course
            if (likeSnapshot.exists()) {
                // 1. Decrement the like_count on the course document
                transaction.update(courseRef, "like_count", FieldValue.increment(-1));
                
                // 2. Delete the document from the course_likes collection
                transaction.delete(likeRef);

                return true; // The state was changed (a like was removed)
            } else {
                return false; // The state did not change (there was no like to remove)
            }
        }).get();
    }


    
}