package com.givingforward.upload.dto;

import java.time.LocalDateTime;

public class FileUploadDto {
    private Long id;
    private String filename;
    private String url;
    private LocalDateTime uploadedAt;
    private Long userId;

    public FileUploadDto(Long id, String filename, String url, LocalDateTime uploadedAt, Long userId) {
        this.id = id;
        this.filename = filename;
        this.url = url;
        this.uploadedAt = uploadedAt;
        this.userId = userId;
    }

    public Long getId() {
        return id;
    }

    public String getFilename() {
        return filename;
    }

    public String getUrl() {
        return url;
    }

    public LocalDateTime getUploadedAt() {
        return uploadedAt;
    }

    public Long getUserId() {
        return userId;
    }
}
