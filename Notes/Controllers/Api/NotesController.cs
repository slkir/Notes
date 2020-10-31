using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Notes.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Notes.Controllers.Api
{
    [ApiController]
    [Route("api/notes")]
    public class NotesController : Controller
    {
        private NoteDbContext _context;

        public NotesController(NoteDbContext context)
        {
            _context = context;
        }

        // GET /api/notes/{id}
        [HttpGet("{id}", Name = "GetNote")]
        public async Task<ActionResult<Note>> GetNote(int id)
        {
            var note = await _context.Notes.FirstOrDefaultAsync(x => x.Id == id);
            if (note == null)
                return NotFound();

            return note;
        }

        // GET /api/notes/
        [HttpGet]
        public async Task<IEnumerable<Note>> GetNotes()
        {
            return await _context.Notes.ToListAsync();
        }

        // POST /api/notes/{note}
        [HttpPost]
        public ActionResult CreateNote(Note note)
        {
            _context.Notes.Add(note);
            _context.SaveChanges();

            return CreatedAtRoute(nameof(GetNote), new { Id = note.Id }, note);
        }

        // DELETE /api/notes/{id}
        [HttpDelete("{id}")]
        public ActionResult DeleteNote(int id)
        {
            var existingNote = _context.Notes.FirstOrDefault(x => x.Id == id);
            if (existingNote == null)
                return NotFound();
            _context.Notes.Remove(existingNote);
            _context.SaveChanges();

            return Ok();
        }

        // PUT /api/notes/
        [HttpPut("{id}")]
        public ActionResult UpdateNote(int id, Note note)
        {
            var existingNote = _context.Notes.FirstOrDefault(x => x.Id == id);
            if (existingNote == null)
                return NotFound();

            existingNote.Text = note.Text;
            existingNote.IsCompleted = note.IsCompleted;
            existingNote.IsImportant = note.IsImportant;

            _context.SaveChanges();

            return Ok();
        }
    }
}
