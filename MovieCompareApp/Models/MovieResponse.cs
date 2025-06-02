using System.Collections.Generic;

namespace WebjetMovieApp.API.Models
{
    public class MovieResponse
    {
        public string Title { get; set; } = string.Empty;
        public string Year { get; set; } = string.Empty;
                public string Poster { get; set; } = string.Empty; 

        public Dictionary<string, decimal?> Providers { get; set; } = new Dictionary<string, decimal?>();
        public string? CheapestProvider { get; set; }
        public decimal? CheapestPrice { get; set; }
    }
}