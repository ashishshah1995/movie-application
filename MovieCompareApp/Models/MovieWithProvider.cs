namespace WebjetMovieApp.API.Models
{
    public class MovieWithProvider
    {
        public Movie Movie { get; }
        public decimal? Price { get; }
        public string Provider { get; }

        public MovieWithProvider(Movie movie, decimal? price, string provider)
        {
            Movie = movie;
            Price = price;
            Provider = provider;
        }
    }
}