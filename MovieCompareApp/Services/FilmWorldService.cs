using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using WebjetMovieApp.API.Models;

namespace WebjetMovieApp.API.Services
{
    public class FilmWorldService : IMovieProvider
    {
        private readonly IHttpClientFactory _clientFactory;
        private readonly IConfiguration _config;
        public string ProviderName => "filmworld";

        public FilmWorldService(IHttpClientFactory clientFactory, IConfiguration config)
        {
            _clientFactory = clientFactory;
            _config = config;
        }

        public async Task<IEnumerable<Movie>> GetMovies()
        {
            var client = _clientFactory.CreateClient("ResilientClient");
            client.DefaultRequestHeaders.Add("x-access-token", _config["WebjetApiToken"]);
            
            try
            {
                var response = await client.GetAsync("https://webjetapitest.azurewebsites.net/api/filmworld/movies");
                response.EnsureSuccessStatusCode();
                
                var content = await response.Content.ReadAsStringAsync();
                var movieResponse = JsonConvert.DeserializeObject<MovieListResponse>(content);
                
                return movieResponse?.Movies ?? new List<Movie>();
            }
            catch (HttpRequestException ex)
            {
                return new List<Movie>();
            }
        }

        public async Task<MovieDetails> GetMoviePrice(string id)
        {
            var client = _clientFactory.CreateClient("ResilientClient");
            client.DefaultRequestHeaders.Add("x-access-token", _config["WebjetApiToken"]);
            
            try
            {
                var response = await client.GetAsync($"https://webjetapitest.azurewebsites.net/api/filmworld/movie/{id}");
                response.EnsureSuccessStatusCode();
                
                var content = await response.Content.ReadAsStringAsync();
                return JsonConvert.DeserializeObject<MovieDetails>(content) ?? new MovieDetails();
            }
            catch (HttpRequestException ex)
            {
                return new MovieDetails();
            }
        }
    }
}