package com.fluentdoc.common.service;

import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
@Slf4j
public class LocalFileStorageService implements FileStorageService {

    private final Path baseDir = Paths.get(System.getProperty("user.home"), ".fluentdoc", "uploads");

    @Value("${server.address:127.0.0.1}")
    private String serverAddress;

    @Value("${server.port:8080}")
    private int serverPort;

    @PostConstruct
    public void init() throws IOException {
        Files.createDirectories(baseDir);
        log.info("Local file storage initialized at: {}", baseDir);
    }

    @Override
    public String upload(String key, byte[] content, String contentType) {
        try {
            Path filePath = baseDir.resolve(key);
            Files.createDirectories(filePath.getParent());
            Files.write(filePath, content);
            String url = "http://" + serverAddress + ":" + serverPort + "/local-files/" + key;
            log.info("Saved locally: {}", url);
            return url;
        } catch (IOException e) {
            log.error("Failed to save file locally: {}", key, e);
            throw new RuntimeException("Failed to save file locally", e);
        }
    }

    @Override
    public void delete(String key) {
        try {
            Path filePath = baseDir.resolve(key);
            Files.deleteIfExists(filePath);
            log.info("Deleted local file: {}", key);
        } catch (IOException e) {
            log.warn("Failed to delete local file: {}", key, e);
        }
    }
}
