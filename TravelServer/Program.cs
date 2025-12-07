using Microsoft.EntityFrameworkCore;
using TravelServer.Data;

var builder = WebApplication.CreateBuilder(args);

// DB
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("DefaultConnection")
    )
);

// CORS – לאפשר גישה מ-Next.js (localhost:3000)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// Controllers
builder.Services.AddControllers();

var app = builder.Build();

// להשתמש ב-CORS
app.UseCors("AllowAll");

// אין HTTPS, אין Redirect, הכל HTTP נקי
app.MapControllers();

app.Run();