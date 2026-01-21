package com.example.fundapp.constants;

public final class AppConstants {

    private AppConstants() {
        // Prevent instantiation
    }

    // Default Admin User
    public static final String DEFAULT_ADMIN_EMAIL = "admin@fundapp.com";
    public static final String DEFAULT_ADMIN_NAME = "Admin User";
    public static final String DEFAULT_ADMIN_PASSWORD = "admin123";

    // Default Values
    public static final String DEFAULT_FRONTEND_URL = "http://localhost:5173";
    public static final int DEFAULT_SERVER_PORT = 8081;
    public static final String DEFAULT_UPLOAD_PATH = "uploads/";

    // JWT
    public static final long DEFAULT_JWT_EXPIRATION_MS = 86400000L; // 1 day

    // Pagination
    public static final int DEFAULT_PAGE_SIZE = 10;
    public static final int DEFAULT_PAGE_NUMBER = 0;
    public static final String DEFAULT_SORT_DIRECTION = "asc";

    // File Upload
    public static final long MAX_FILE_SIZE_BYTES = 10485760L; // 10MB
    public static final String[] ALLOWED_IMAGE_TYPES = { "image/jpeg", "image/png", "image/gif", "image/webp" };

    // Email
    public static final String DEFAULT_MAIL_HOST = "smtp.gmail.com";
    public static final int DEFAULT_MAIL_PORT = 587;

    // Razorpay
    public static final String CURRENCY_INR = "INR";
    public static final long RAZORPAY_MIN_AMOUNT_PAISE = 100L; // INR 1.00
    public static final int RAZORPAY_RECEIPT_MAX_LENGTH = 40;

    // Password Reset
    public static final long PASSWORD_RESET_TOKEN_EXPIRY_SECONDS = 3600L; // 1 hour

    // Refresh Token
    public static final long REFRESH_TOKEN_EXPIRY_DAYS = 7L;

    // Notification Polling
    public static final long NOTIFICATION_POLL_INTERVAL_MS = 30000L; // 30 seconds

    // HTTP Ports
    public static final int HTTP_PORT = 80;
    public static final int HTTPS_PORT = 443;

    // Roles
    public static final String ROLE_USER = "USER";
    public static final String ROLE_ADMIN = "ADMIN";
    public static final String ROLE_PREFIX = "ROLE_";

    // Messages
    public static final String MSG_EMAIL_EXISTS = "Email already exists";
    public static final String MSG_USER_NOT_FOUND = "User not found";
    public static final String MSG_CAMPAIGN_NOT_FOUND = "Campaign not found";
    public static final String MSG_DONATION_NOT_FOUND = "Donation not found";
    public static final String MSG_INVALID_CREDENTIALS = "Invalid email or password";
    public static final String MSG_ACCESS_DENIED = "Access denied - insufficient permissions";
    public static final String MSG_UNAUTHORIZED = "Authentication required";
    public static final String MSG_INVALID_TOKEN = "Invalid or expired token";
    public static final String MSG_EMAIL_VERIFIED = "Email already verified";
    public static final String MSG_PASSWORD_CHANGED = "Your password has been successfully changed";
}
