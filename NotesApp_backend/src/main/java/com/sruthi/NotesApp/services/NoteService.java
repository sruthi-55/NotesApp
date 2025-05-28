package com.sruthi.NotesApp.services;

import com.sruthi.NotesApp.dto.NoteRequest;
import com.sruthi.NotesApp.dto.NoteResponse;
import com.sruthi.NotesApp.dto.NoteVersionResponse;
import com.sruthi.NotesApp.entities.Note;
import com.sruthi.NotesApp.entities.NoteVersion;
import com.sruthi.NotesApp.entities.User;
import com.sruthi.NotesApp.repositories.NoteRepository;
import com.sruthi.NotesApp.repositories.NoteVersionRepository;
import com.sruthi.NotesApp.repositories.TagRepository;
import com.sruthi.NotesApp.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import com.sruthi.NotesApp.entities.Tag;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import java.util.ArrayList;

@Service
public class NoteService {

    @Autowired
    private NoteRepository noteRepo;

    @Autowired
    private UserRepository userRepo;
    @Autowired
    private NoteVersionRepository versionRepo;

    @Autowired
    private TagRepository tagRepo;

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
        note.setTags(mapTags(req.getTags()));
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

        // Clear and re-add tags instead of replacing the whole list
//        note.getTags().clear();  // clear the existing list to avoid ImmutableList error
        note.getTags().addAll(mapTags(req.getTags()));  // add the new tags

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


    private List<Tag> mapTags(List<String> tagNames) {
        return tagNames.stream()
                .map(name -> tagRepo.findByName(name).orElseGet(() -> new Tag(name)))
                .collect(Collectors.toCollection(ArrayList::new));
    }

    public List<NoteResponse> getNotesByTag(String tag, Long userId) {
        return noteRepo.findByUserIdAndTag(userId, tag)
                .stream().map(NoteResponse::new).toList();
    }

    public NoteResponse autoSaveNote(Long noteId, NoteRequest req, Long userId) {
        Note note = noteRepo.findById(noteId).orElseThrow();

        if (!note.getUser().getId().equals(userId)) throw new AccessDeniedException("Forbidden");

        // If auto-save is disabled, reject
        if (!note.isAutoSaveEnabled()) {
            throw new IllegalStateException("Auto-save is disabled for this note");
        }

        // Check for content change
        if (!note.getContent().equals(req.getContent()) || !note.getTitle().equals(req.getTitle())) {
            versionRepo.save(new NoteVersion(note)); // Save previous version
            note.setTitle(req.getTitle());
            note.setContent(req.getContent());
            note.setUpdatedAt(LocalDateTime.now());
            noteRepo.save(note);
        }

        return new NoteResponse(note);
    }

}
