using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using WebjetMovieApp.API.Models;
using WebjetMovieApp.API.Services;

namespace WebjetMovieApp.API.Controllers
{
    [ApiController]
    [Route("api/movies")]
    public class MoviesController : ControllerBase
    {
        private readonly IMovieService _movieService;

        public MoviesController(IMovieService movieService) => _movieService = movieService;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MovieResponse>>> Get()
            => Ok(await _movieService.GetMoviesWithPrices());
    }
}