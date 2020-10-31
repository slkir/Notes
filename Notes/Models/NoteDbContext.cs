using Microsoft.EntityFrameworkCore;

namespace Notes.Models
{
    public class NoteDbContext : DbContext
    {
        public NoteDbContext(DbContextOptions<NoteDbContext> options)
            : base(options)
        {

        }

        public DbSet<Note> Notes { get; set; }
    }
}
