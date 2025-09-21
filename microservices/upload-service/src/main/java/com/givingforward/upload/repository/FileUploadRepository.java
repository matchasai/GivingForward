package com.givingforward.upload.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.givingforward.upload.model.FileUpload;

@Repository
public interface FileUploadRepository extends JpaRepository<FileUpload, Long> {
    // Additional query methods if needed
}
