package com.givingforward.upload.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.givingforward.upload.dto.FileUploadRequest;
import com.givingforward.upload.model.FileUpload;
import com.givingforward.upload.repository.FileUploadRepository;

@Service
public class FileUploadService {
    @Autowired
    private FileUploadRepository fileUploadRepository;

    public FileUpload saveFile(FileUploadRequest request) {
        FileUpload file = new FileUpload();
        file.setFilename(request.getFilename());
        file.setUrl(request.getUrl());
        file.setUserId(request.getUserId());
        return fileUploadRepository.save(file);
    }

    public List<FileUpload> getFilesByUser(Long userId) {
        return fileUploadRepository.findAll().stream()
                .filter(f -> f.getUserId().equals(userId))
                .toList();
    }
}
