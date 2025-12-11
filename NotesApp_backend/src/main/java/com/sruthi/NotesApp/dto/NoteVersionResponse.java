package com.sruthi.NotesApp.dto;

import com.sruthi.NotesApp.entities.NoteVersion;

import java.time.LocalDateTime;

public class NoteVersionResponse {
    private Long id;
    private String title;
    private String content;
    private LocalDateTime versionedAt;

    public NoteVersionResponse(NoteVersion v) {
        this.id = v.getId();
        this.title = v.getTitle();
        this.content = v.getContent();
        this.versionedAt = v.getVersionedAt();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public void setVersionedAt(LocalDateTime versionedAt) {
        this.versionedAt = versionedAt;
    }

    public String getTitle() {
        return title;
    }

    public String getContent() {
        return content;
    }

    public LocalDateTime getVersionedAt() {
        return versionedAt;
    }
}

