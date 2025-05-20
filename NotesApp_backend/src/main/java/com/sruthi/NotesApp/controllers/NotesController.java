package com.sruthi.NotesApp.controllers;

import com.sruthi.NotesApp.dto.NoteRequest;
import com.sruthi.NotesApp.dto.NoteResponse;
import com.sruthi.NotesApp.dto.NoteVersionResponse;
import com.sruthi.NotesApp.entities.User;
import com.sruthi.NotesApp.services.NoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/notes")
public class NotesController {

    @Autowired
    private NoteService noteService;

    @GetMapping
    public List<NoteResponse> getAll(@AuthenticationPrincipal User user) {
        return noteService.getUserNotes(user.getId());
    }

    @PostMapping
    public NoteResponse create(@AuthenticationPrincipal User user,
                               @RequestBody NoteRequest req) {
        return noteService.createNote(user.getId(), req);
    }

    @GetMapping("/{id}")
    public NoteResponse getNote(@AuthenticationPrincipal User user,
                                @PathVariable Long id) {
        return noteService.getNote(id, user.getId());
    }

    @PutMapping("/{id}")
    public NoteResponse update(@AuthenticationPrincipal User user,
                               @PathVariable Long id,
                               @RequestBody NoteRequest req) {
        return noteService.updateNote(id, req, user.getId());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@AuthenticationPrincipal User user,
                                    @PathVariable Long id) {
        noteService.deleteNote(id, user.getId());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/trash")
    public List<NoteResponse> getTrashed(@AuthenticationPrincipal User user) {
        return noteService.getTrashedNotes(user.getId());
    }

    @PostMapping("/{id}/restore")
    public NoteResponse restore(@AuthenticationPrincipal User user,
                                @PathVariable Long id) {
        return noteService.restoreNote(id, user.getId());
    }

    @PostMapping("/{id}/pin")
    public NoteResponse togglePin(@AuthenticationPrincipal User user,
                                  @PathVariable Long id) {
        return noteService.togglePin(id, user.getId());
    }

    @GetMapping("/{id}/versions")
    public List<NoteVersionResponse> getHistory(@AuthenticationPrincipal User user,
                                                @PathVariable Long id) {
        return noteService.getVersionHistory(id, user.getId());
    }

    @PostMapping("/{noteId}/versions/{versionId}/restore")
    public NoteResponse restoreVersion(@AuthenticationPrincipal User user,
                                       @PathVariable Long noteId,
                                       @PathVariable Long versionId) {
        return noteService.restoreVersion(noteId, versionId, user.getId());
    }

    @GetMapping("/filter")
    public List<NoteResponse> filterByTag(@AuthenticationPrincipal User user,
                                          @RequestParam String tag) {
        return noteService.getNotesByTag(tag, user.getId());
    }

    @PutMapping("/{noteId}/autosave")
    public NoteResponse autoSaveNote(@AuthenticationPrincipal User user,
                                     @PathVariable Long noteId,
                                     @RequestBody NoteRequest req) {
        return noteService.autoSaveNote(noteId, req, user.getId());
    }

}
