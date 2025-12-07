namespace TravelServer.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = "";
        public string FullName { get; set; } = string.Empty;
        public string PhoneNumber { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}