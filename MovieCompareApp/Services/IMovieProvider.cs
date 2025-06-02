using System.Collections.Generic;
using System.Threading.Tasks;
using WebjetMovieApp.API.Models;

namespace WebjetMovieApp.API.Services
{
    public interface IMovieProvider
    {
        string ProviderName { get; }
        Task<IEnumerable<Movie>> GetMovies();
        Task<MovieDetails> GetMoviePrice(string id);
    }
}