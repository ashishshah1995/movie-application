using System.Collections.Generic;
using System.Threading.Tasks;
using WebjetMovieApp.API.Models;

namespace WebjetMovieApp.API.Services
{
    public interface IMovieService
    {
        Task<IEnumerable<MovieResponse>> GetMoviesWithPrices();
    }
}