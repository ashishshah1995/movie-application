using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebjetMovieApp.API.Models;

namespace WebjetMovieApp.API.Services
{
    public class MovieService : IMovieService
    {
        private readonly IEnumerable<IMovieProvider> _providers;
        private readonly IMemoryCache _cache;
        private readonly ILogger<MovieService> _logger;

        public MovieService(IEnumerable<IMovieProvider> providers, IMemoryCache cache, ILogger<MovieService> logger)
        {
            _providers = providers;
            _cache = cache;
            _logger = logger;
        }

        public async Task<IEnumerable<MovieResponse>> GetMoviesWithPrices()
        {
            const string cacheKey = "movies_with_prices";
            if (_cache.TryGetValue(cacheKey, out List<MovieResponse> cachedMovies))
                return cachedMovies;

            var providerTasks = _providers
                .Select(p => GetMoviesFromProviderSafe(p))
                .ToList();

            var providerResults = await Task.WhenAll(providerTasks);
            var allMovies = providerResults.SelectMany(x => x).ToList();

            // Group movies by title/year
            var groupedMovies = allMovies
                .GroupBy(m => new { m.Movie.Title, m.Movie.Year })
                .Select(g => new MovieResponse
                {
                    Title = g.Key.Title,
                    Year = g.Key.Year,
                    Providers = _providers.ToDictionary(
                        p => p.ProviderName,
                        p => g.FirstOrDefault(m => m.Provider == p.ProviderName)?.Price)
                })
                .ToList();

            // Find cheapest price for each movie
            foreach (var movie in groupedMovies)
            {
                var validPrices = movie.Providers
                    .Where(kvp => kvp.Value.HasValue)
                    .ToList();
                
                if (validPrices.Any())
                {
                    var cheapest = validPrices.MinBy(kvp => kvp.Value);
                    movie.CheapestProvider = cheapest.Key;
                    movie.CheapestPrice = cheapest.Value;
                }
            }

            _cache.Set(cacheKey, groupedMovies, TimeSpan.FromMinutes(10));
            return groupedMovies;
        }

        private async Task<IEnumerable<MovieWithProvider>> GetMoviesFromProviderSafe(IMovieProvider provider)
        {
            try
            {
                return await GetMoviesFromProvider(provider);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Failed to get movies from {provider.ProviderName}");
                return Enumerable.Empty<MovieWithProvider>();
            }
        }

        private async Task<IEnumerable<MovieWithProvider>> GetMoviesFromProvider(IMovieProvider provider)
        {
            var movies = await provider.GetMovies();
            var movieTasks = movies.Select(async movie => 
            {
                try
                {
                    var details = await provider.GetMoviePrice(movie.ID);
                    return new MovieWithProvider(movie, details.Price, provider.ProviderName);
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, $"Failed to get price for movie {movie.ID} from {provider.ProviderName}");
                    return new MovieWithProvider(movie, null, provider.ProviderName);
                }
            });

            return await Task.WhenAll(movieTasks);
        }
    }
}