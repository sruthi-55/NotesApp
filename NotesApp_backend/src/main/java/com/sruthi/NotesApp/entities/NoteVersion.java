package com.sruthi.NotesApp.entities;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
public class NoteVersion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Lob
    private String content;

    private LocalDateTime versionedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "note_id")
    private Note note;

    public NoteVersion() {}

    public NoteVersion(Note note) {
        this.title = note.getTitle();
        this.content = note.getContent();
        this.versionedAt = LocalDateTime.now();
        this.note = note;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public LocalDateTime getVersionedAt() {
        return versionedAt;
    }

    public void setVersionedAt(LocalDateTime versionedAt) {
        this.versionedAt = versionedAt;
    }

    public Note getNote() {
        return note;
    }

    public void setNote(Note note) {
        this.note = note;
    }
}

