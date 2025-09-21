package com.givingforward.upload.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.givingforward.upload.dto.FileUploadDto;
import com.givingforward.upload.service.FileUploadService;

@RestController
@RequestMapping("/api/upload")
public class FileUploadController {
    @PostMapping("/delete/{filename}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteFile(@PathVariable String filename) throws IOException {
        String uploadDir = "uploads/";
        Path filePath = Paths.get(uploadDir).toAbsolutePath().normalize().resolve(filename);
        if (!Files.exists(filePath)) {
            return ResponseEntity.notFound().build();
        }
        Files.delete(filePath);
        // Optionally, remove metadata from DB if tracked
        // TODO: fileUploadService.deleteFileMetadata(filename);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/file/{filename}")
    public ResponseEntity<?> serveFile(@PathVariable String filename) throws IOException {
        String uploadDir = "uploads/";
        Path filePath = Paths.get(uploadDir).toAbsolutePath().normalize().resolve(filename);
        if (!Files.exists(filePath)) {
            return ResponseEntity.notFound().build();
        }
        org.springframework.core.io.Resource resource = new org.springframework.core.io.UrlResource(filePath.toUri());
        String contentType = Files.probeContentType(filePath);
        return ResponseEntity.ok()
                .header("Content-Type", contentType != null ? contentType : "application/octet-stream")
                .header("Content-Disposition", "attachment; filename=\"" + filename + "\"")
                .body(resource);
    }

    @Autowired
    private FileUploadService fileUploadService;

    @PostMapping("/image")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<FileUploadDto> uploadImage(@RequestParam("file") MultipartFile file,
            org.springframework.security.core.Authentication authentication) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || originalFilename.trim().isEmpty()) {
            throw new IllegalArgumentException("Filename is missing");
        }
        String original = StringUtils.cleanPath(originalFilename);
        String ext = "";
        int i = original.lastIndexOf('.');
        if (i > 0)
            ext = original.substring(i);
        // Validate file type (allow only images)
        String allowedTypes = ".jpg,.jpeg,.png,.gif";
        if (!allowedTypes.contains(ext.toLowerCase())) {
            throw new IllegalArgumentException("Invalid file type: " + ext);
        }
        // Validate file size (max 5MB)
        if (file.getSize() > 5 * 1024 * 1024) {
            throw new IllegalArgumentException("File size exceeds 5MB limit");
        }
        String filename = UUID.randomUUID().toString().replaceAll("-", "") + ext;
        String uploadDir = "uploads/";
        Path dir = Paths.get(uploadDir).toAbsolutePath().normalize();
        Files.createDirectories(dir);
        Path target = dir.resolve(filename);
        Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
        String url = "/uploads/" + filename;
        // Extract userId from authentication principal
        Long userId = null;
        // Extract userId from authentication (if available)
        // If using JWT, you may need to parse claims for userId
        // For now, use authentication.getName() as a placeholder (usually email)
        com.givingforward.upload.dto.FileUploadRequest req = new com.givingforward.upload.dto.FileUploadRequest();
        req.setFilename(filename);
        req.setUrl(url);
        req.setUserId(userId);
        com.givingforward.upload.model.FileUpload saved = fileUploadService.saveFile(req);
        FileUploadDto dto = new FileUploadDto(saved.getId(), saved.getFilename(), saved.getUrl(), saved.getUploadedAt(),
                saved.getUserId());
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/user/{userId}")
    public List<FileUploadDto> getFilesByUser(@PathVariable Long userId) {
        return fileUploadService.getFilesByUser(userId).stream()
                .map(f -> new FileUploadDto(f.getId(), f.getFilename(), f.getUrl(), f.getUploadedAt(), f.getUserId()))
                .collect(Collectors.toList());
    }
}
