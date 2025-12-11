package com.sruthi.NotesApp.repositories;

import com.sruthi.NotesApp.entities.NoteVersion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

public interface NoteVersionRepository extends JpaRepository<NoteVersion, Long> {
    List<NoteVersion> findByNoteIdOrderByVersionedAtDesc(Long noteId);

    @Modifying
    @Transactional
    void deleteByNoteIdAndVersionedAtAfter(Long noteId, LocalDateTime versionedAt);
}

