namespace Blog.API.Models
{
    public class ErrorResponse
    {
        public int StatusCode { get; set; }
        public string Message { get; set; } = string.Empty;
        public string? Path { get; set; }
        public DateTime Timestamp { get; set; }
        public string? StackTrace { get; set; }
        public IDictionary<string, string[]>? Errors { get; set; }
    }
}
