package com.sruthi.NotesApp.repositories;

import com.sruthi.NotesApp.entities.Note;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NoteRepository extends JpaRepository<Note, Long> {
    List<Note> findByUserIdAndTrashedFalseOrderByPinnedDescUpdatedAtDesc(Long userId);
}

