package com.sruthi.NotesApp.services;

import com.sruthi.NotesApp.dto.NoteRequest;
import com.sruthi.NotesApp.dto.NoteResponse;
import com.sruthi.NotesApp.entities.Note;
import com.sruthi.NotesApp.entities.User;
import com.sruthi.NotesApp.repositories.NoteRepository;
import com.sruthi.NotesApp.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NoteService {

    @Autowired
    private NoteRepository noteRepo;

    @Autowired
    private UserRepository userRepo;

    public List<NoteResponse> getUserNotes(Long userId) {
        return noteRepo.findByUserIdAndTrashedFalseOrderByPinnedDescUpdatedAtDesc(userId)
                .stream()
                .map(NoteResponse::new)
                .toList();
    }

    public NoteResponse createNote(Long userId, NoteRequest req) {
        User user = userRepo.findById(userId).orElseThrow();
        Note note = new Note();
        note.setTitle(req.getTitle());
        note.setContent(req.getContent());
        note.setPinned(req.isPinned());
        note.setUser(user);
        noteRepo.save(note);
        return new NoteResponse(note);
    }

    public NoteResponse updateNote(Long id, NoteRequest req, Long userId) {
        Note note = noteRepo.findById(id).orElseThrow();
        if (!note.getUser().getId().equals(userId)) throw new AccessDeniedException("Forbidden");
        note.setTitle(req.getTitle());
        note.setContent(req.getContent());
        note.setPinned(req.isPinned());
        noteRepo.save(note);
        return new NoteResponse(note);
    }

    public void deleteNote(Long id, Long userId) {
        Note note = noteRepo.findById(id).orElseThrow();
        if (!note.getUser().getId().equals(userId)) throw new AccessDeniedException("Forbidden");
        note.setTrashed(true);
        noteRepo.save(note);
    }

    public NoteResponse getNote(Long id, Long userId) {
        Note note = noteRepo.findById(id).orElseThrow();
        if (!note.getUser().getId().equals(userId)) throw new AccessDeniedException("Forbidden");
        return new NoteResponse(note);
    }


    public List<NoteResponse> getTrashedNotes(Long userId) {
        return noteRepo.findByUserIdAndTrashedTrueOrderByUpdatedAtDesc(userId)
                .stream()
                .map(NoteResponse::new)
                .toList();
    }

    public NoteResponse restoreNote(Long id, Long userId) {
        Note note = noteRepo.findById(id).orElseThrow();
        if (!note.getUser().getId().equals(userId)) throw new AccessDeniedException("Forbidden");

        if (!note.isTrashed()) throw new IllegalStateException("Note is not in trash");

        note.setTrashed(false);
        noteRepo.save(note);
        return new NoteResponse(note);
    }

}
