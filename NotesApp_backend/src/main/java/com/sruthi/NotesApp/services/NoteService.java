package com.sruthi.NotesApp.services;

import com.sruthi.NotesApp.dto.NoteRequest;
import com.sruthi.NotesApp.dto.NoteResponse;
import com.sruthi.NotesApp.dto.NoteVersionResponse;
import com.sruthi.NotesApp.entities.Note;
import com.sruthi.NotesApp.entities.NoteVersion;
import com.sruthi.NotesApp.entities.User;
import com.sruthi.NotesApp.repositories.NoteRepository;
import com.sruthi.NotesApp.repositories.NoteVersionRepository;
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
    @Autowired
    private NoteVersionRepository versionRepo;

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

        // Save current version before modifying
        versionRepo.save(new NoteVersion(note));

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

    public NoteResponse togglePin(Long id, Long userId) {
        Note note = noteRepo.findById(id).orElseThrow();
        if (!note.getUser().getId().equals(userId)) throw new AccessDeniedException("Forbidden");

        note.setPinned(!note.isPinned());  // Toggle the pin
        noteRepo.save(note);
        return new NoteResponse(note);
    }

    public List<NoteVersionResponse> getVersionHistory(Long noteId, Long userId) {
        Note note = noteRepo.findById(noteId).orElseThrow();
        if (!note.getUser().getId().equals(userId)) throw new AccessDeniedException("Forbidden");

        return versionRepo.findByNoteIdOrderByVersionedAtDesc(noteId)
                .stream()
                .map(NoteVersionResponse::new)
                .toList();
    }

    public NoteResponse restoreVersion(Long noteId, Long versionId, Long userId) {
        Note note = noteRepo.findById(noteId).orElseThrow();
        if (!note.getUser().getId().equals(userId)) throw new AccessDeniedException("Forbidden");

        NoteVersion version = versionRepo.findById(versionId)
                .orElseThrow(() -> new RuntimeException("Version not found"));

        if (!version.getNote().getId().equals(noteId))
            throw new IllegalArgumentException("Version does not belong to this note");

        // Save current version before overwriting
        versionRepo.save(new NoteVersion(note));

        // Overwrite with old content
        note.setTitle(version.getTitle());
        note.setContent(version.getContent());
        noteRepo.save(note);

        return new NoteResponse(note);
    }

}
