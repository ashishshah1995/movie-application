using System.Net;
using System.Text.Json;
using Microsoft.AspNetCore.Http;

namespace WebjetMovieApp.API.Middleware
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;

        public ExceptionMiddleware(RequestDelegate next) => _next = next;

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (ProviderUnavailableException ex)
            {
                context.Response.StatusCode = (int)HttpStatusCode.ServiceUnavailable;
                context.Response.ContentType = "application/json";
                await context.Response.WriteAsync(JsonSerializer.Serialize(new
                {
                    Error = $"Service unavailable: {ex.ProviderName}",
                    RecommendedAction = "Try again later"
                }));
            }
            catch (Exception ex)
            {
                context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                context.Response.ContentType = "application/json";
                await context.Response.WriteAsync(JsonSerializer.Serialize(new
                {
                    Error = "Internal server error",
                    Details = ex.Message
                }));
            }
        }
    }

    public class ProviderUnavailableException : Exception
    {
        public string ProviderName { get; }
        public ProviderUnavailableException(string providerName) : base($"Provider {providerName} is unavailable") 
            => ProviderName = providerName;
    }
}