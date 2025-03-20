package com.bookshop.controllers;

import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.RequestDispatcher;
import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

@RestController
public class CustomErrorController implements ErrorController {

    @RequestMapping("/error")
    public ResponseEntity<Map<String, Object>> handleError(HttpServletRequest request) {
        Object status = request.getAttribute(RequestDispatcher.ERROR_STATUS_CODE);
        Object exception = request.getAttribute(RequestDispatcher.ERROR_EXCEPTION);
        Object message = request.getAttribute(RequestDispatcher.ERROR_MESSAGE);
        Object requestUri = request.getAttribute(RequestDispatcher.ERROR_REQUEST_URI);
        
        Map<String, Object> errorDetails = new HashMap<>();
        errorDetails.put("status", status != null ? status : "Unknown");
        errorDetails.put("error", exception != null ? exception.toString() : "Unknown error");
        errorDetails.put("message", message != null ? message : "No message available");
        errorDetails.put("path", requestUri != null ? requestUri : request.getRequestURI());
        
        HttpStatus httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
        if (status != null) {
            try {
                httpStatus = HttpStatus.valueOf(Integer.parseInt(status.toString()));
            } catch (NumberFormatException e) {
                // Ignore and use default
            }
        }
        
        return new ResponseEntity<>(errorDetails, httpStatus);
    }

    public String getErrorPath() {
        return "/error";
    }
} 