package com.sruthi.NotesApp.repositories;

import com.sruthi.NotesApp.entities.NoteVersion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NoteVersionRepository extends JpaRepository<NoteVersion, Long> {
    List<NoteVersion> findByNoteIdOrderByVersionedAtDesc(Long noteId);
}

