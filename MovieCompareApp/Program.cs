using WebjetMovieApp.API.Extensions;
using WebjetMovieApp.API.Middleware;
using WebjetMovieApp.API.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddResilientHttpClient();
builder.Services.AddMemoryCache();
builder.Services.AddScoped<IMovieProvider, CinemaWorldService>();
builder.Services.AddScoped<IMovieProvider, FilmWorldService>();
builder.Services.AddScoped<IMovieService, MovieService>();

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// Configure pipeline
app.UseCors("AllowAll");

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Fix HTTPS redirect warning
app.Use(async (context, next) =>
{
    if (context.Request.Path == "/")
    {
        context.Response.Redirect("/swagger");
    }
    else
    {
        await next();
    }
});



app.UseAuthorization();
app.UseMiddleware<ExceptionMiddleware>();
app.MapControllers();

app.Run();