package com.fluentdoc.common.service;

public interface FileStorageService {
    /**
     * Upload a file and return its public URL.
     * @param key storage key (e.g. "avatars/userId/avatar_uuid.svg")
     * @param content file bytes
     * @param contentType MIME type (e.g. "image/svg+xml")
     * @return publicly accessible URL for the uploaded file
     */
    String upload(String key, byte[] content, String contentType);

    /**
     * Delete a file by its storage key. No-op if the file does not exist.
     */
    void delete(String key);
}
