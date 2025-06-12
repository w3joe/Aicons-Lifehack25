package aicon.lifehack.central_learning.exception;

public class ApiServiceException extends RuntimeException {

    public ApiServiceException(String message, Throwable cause) {
        super(message, cause);
    }

    public ApiServiceException(String message) {
        super(message);
    }
}