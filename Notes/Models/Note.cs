using System.ComponentModel.DataAnnotations;

namespace Notes.Models
{
    public class Note
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(50)]
        public string Text { get; set; }
        public bool IsCompleted { get; set; }
        public bool IsImportant { get; set; }
    }
}
