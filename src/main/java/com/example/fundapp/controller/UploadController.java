package com.example.fundapp.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/uploads")
public class UploadController {

    @Value("${file.upload.path:uploads/}")
    private String uploadDir;

    @PostMapping("/image")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> uploadImage(@RequestParam("file") MultipartFile file,
            HttpServletRequest request) throws IOException {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || originalFilename.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        String original = StringUtils.cleanPath(originalFilename);
        String ext = "";
        int i = original.lastIndexOf('.');
        if (i > 0)
            ext = original.substring(i);
        String filename = UUID.randomUUID().toString().replaceAll("-", "") + ext;

        Path dir = Paths.get(uploadDir).toAbsolutePath().normalize();
        Files.createDirectories(dir);
        Path target = dir.resolve(filename);
        Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);

        // Build an absolute URL so frontend can load images even when served from a
        // different origin.
        String scheme = request.getScheme(); // http or https
        String serverName = request.getServerName(); // host
        int serverPort = request.getServerPort();
        String contextPath = request.getContextPath() == null ? "" : request.getContextPath();

        StringBuilder base = new StringBuilder();
        base.append(scheme).append("://").append(serverName);
        // Append port if non-standard (80 for http, 443 for https)
        if ((scheme.equals("http") && serverPort != 80) || (scheme.equals("https") && serverPort != 443)) {
            base.append(":" + serverPort);
        }
        base.append(contextPath);

        String url = base.toString() + "/uploads/" + filename;
        Map<String, Object> body = new HashMap<>();
        body.put("url", url);
        return ResponseEntity.ok(body);
    }
}
