using System.Collections.Generic;

namespace WebjetMovieApp.API.Models
{
    public class MovieListResponse
    {
        public List<Movie> Movies { get; set; } = new List<Movie>();
    }
}