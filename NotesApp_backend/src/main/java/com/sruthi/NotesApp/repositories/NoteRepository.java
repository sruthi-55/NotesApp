package com.sruthi.NotesApp.repositories;

import com.sruthi.NotesApp.entities.Note;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface NoteRepository extends JpaRepository<Note, Long> {
    List<Note> findByUserIdAndTrashedFalseOrderByPinnedDescUpdatedAtDesc(Long userId);

    List<Note> findByUserIdAndTrashedTrueOrderByUpdatedAtDesc(Long userId);

    @Query("SELECT n FROM Note n JOIN n.tags t WHERE n.user.id = :userId AND n.trashed = false AND t.name = :tagName ORDER BY n.pinned DESC, n.updatedAt DESC")
    List<Note> findByUserIdAndTag(Long userId, String tagName);

}

