package com.example.fundapp.controller;

import java.io.IOException;
import java.io.PrintWriter;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.fundapp.dto.AdminUserRequest;
import com.example.fundapp.dto.UserDto;
import com.example.fundapp.model.User;
import com.example.fundapp.repository.UserRepository;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/admin/users")
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {

    private static final Logger log = LoggerFactory.getLogger(AdminUserController.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private com.example.fundapp.repository.DonationRepository donationRepository;

    @PostMapping
    public ResponseEntity<UserDto> create(@Valid @RequestBody AdminUserRequest req) {
        User u = new User();
        u.setName(req.getName());
        u.setEmail(req.getEmail());
        if (req.getPassword() != null && !req.getPassword().isBlank()) {
            u.setPassword(passwordEncoder.encode(req.getPassword()));
        }
        u.setRole(User.Role.valueOf(req.getRole().toUpperCase()));
        User saved = userRepository.save(u);
        return ResponseEntity.ok(toDto(saved));
    }

    @GetMapping
    public ResponseEntity<Page<UserDto>> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt,desc") String sort,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String role) {

        String[] sortParts = sort.split(",");
        Sort s = sortParts.length == 2 && sortParts[1].equalsIgnoreCase("asc")
                ? Sort.by(sortParts[0]).ascending()
                : Sort.by(sortParts[0]).descending();
        Pageable pageable = PageRequest.of(page, size, s);

        var all = userRepository.findAll();
        var filtered = all.stream()
                .filter(u -> search == null || search.isBlank() ||
                        u.getName().toLowerCase().contains(search.toLowerCase()) ||
                        u.getEmail().toLowerCase().contains(search.toLowerCase()))
                .filter(u -> role == null || role.isBlank() || u.getRole().name().equalsIgnoreCase(role))
                .sorted((a, b) -> {
                    int cmp;
                    String prop = sortParts[0];
                    switch (prop) {
                        case "createdAt":
                            cmp = a.getCreatedAt().compareTo(b.getCreatedAt());
                            break;
                        case "name":
                            cmp = a.getName().compareToIgnoreCase(b.getName());
                            break;
                        case "email":
                            cmp = a.getEmail().compareToIgnoreCase(b.getEmail());
                            break;
                        default:
                            cmp = String.valueOf(a.getId()).compareTo(String.valueOf(b.getId()));
                    }
                    return sortParts.length == 2 && sortParts[1].equalsIgnoreCase("asc") ? cmp : -cmp;
                })
                .toList();
        int start = Math.min((int) pageable.getOffset(), filtered.size());
        int end = Math.min(start + pageable.getPageSize(), filtered.size());
        Page<UserDto> dtos = new PageImpl<>(filtered.subList(start, end).stream().map(this::toDto).toList(), pageable,
                filtered.size());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDto> get(@PathVariable String id) {
        return userRepository.findById(id).map(u -> ResponseEntity.ok(toDto(u)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserDto> update(@PathVariable String id, @Valid @RequestBody AdminUserRequest req) {
        return userRepository.findById(id).map(existing -> {
            existing.setName(req.getName());
            existing.setEmail(req.getEmail());
            if (req.getPassword() != null && !req.getPassword().isBlank()) {
                existing.setPassword(passwordEncoder.encode(req.getPassword()));
            }
            existing.setRole(User.Role.valueOf(req.getRole().toUpperCase()));
            User saved = userRepository.save(existing);
            return ResponseEntity.ok(toDto(saved));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        try {
            if (!userRepository.existsById(id)) {
                return ResponseEntity.notFound().build();
            }
            User user = userRepository.findById(id).orElse(null);
            if (user == null) {
                return ResponseEntity.notFound().build();
            }

            // Check if user has donations
            java.util.List<com.example.fundapp.model.Donation> userDonations = donationRepository
                    .findByUserOrderByDonatedAtDesc(user);
            if (!userDonations.isEmpty()) {
                return ResponseEntity.status(409)
                        .header("X-Error-Reason",
                                "User has " + userDonations.size() + " donation(s) and cannot be deleted.")
                        .build();
            }

            // Additional check: prevent deleting admin users if they are the last admin
            if (user.getRole() == com.example.fundapp.model.User.Role.ADMIN) {
                long adminCount = userRepository.count();
                // This is a simple check - you might want to make it more sophisticated
                if (adminCount <= 1) {
                    return ResponseEntity.status(409)
                            .header("X-Error-Reason", "Cannot delete the last admin user.")
                            .build();
                }
            }

            userRepository.deleteById(id);
            return ResponseEntity.noContent().build();

        } catch (org.springframework.dao.DataIntegrityViolationException e) {
            log.warn("Data integrity violation when deleting user {}: {}", id, e.getMessage());
            return ResponseEntity.status(409)
                    .header("X-Error-Reason",
                            "Cannot delete user due to database constraints. User may have related data.")
                    .build();
        } catch (Exception e) {
            // Log the error for debugging (without printing stack to console)
            log.error("Error deleting user with id {}: {}", id, e.getMessage());
            return ResponseEntity.status(500)
                    .header("X-Error-Reason", "Internal server error occurred while deleting user.")
                    .build();
        }
    }

    private UserDto toDto(User u) {
        return new UserDto(u.getId(), u.getName(), u.getEmail(), u.getRole().name(), u.getCreatedAt());
    }

    @GetMapping("/export/csv")
    public void exportUsersToCSV(HttpServletResponse response) throws IOException {
        response.setContentType("text/csv");
        response.setHeader("Content-Disposition", "attachment; filename=\"users_export.csv\"");
        try (PrintWriter writer = response.getWriter()) {
            writer.println("ID,Name,Email,Role,Created At");
            userRepository.findAll().forEach(user -> {
                String name = user.getName() == null ? "" : user.getName().replace("\"", "\"\"");
                String email = user.getEmail() == null ? "" : user.getEmail().replace("\"", "\"\"");
                String role = user.getRole() == null ? "" : user.getRole().name();
                String createdAt = user.getCreatedAt() == null ? "" : user.getCreatedAt().toString();
                writer.printf("\"%s\",\"%s\",\"%s\",\"%s\",\"%s\"%n",
                        user.getId(), name, email, role, createdAt);
            });
        }
    }

}
