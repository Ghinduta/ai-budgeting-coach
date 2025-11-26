using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.EntityFrameworkCore;
using TransactionService.Core.Interfaces;
using TransactionService.Core.Validators;
using TransactionService.Infrastructure.Data;
using TransactionService.Infrastructure.Repositories;
using CoreServices = TransactionService.Core.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

// Database
builder.Services.AddDbContext<TransactionDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Repository (Infrastructure)
builder.Services.AddScoped<ITransactionRepository, TransactionRepository>();

// Services (Core - Business Logic)
builder.Services.AddScoped<ITransactionService, CoreServices.TransactionService>();

// Validation
builder.Services.AddValidatorsFromAssemblyContaining<CreateTransactionRequestValidator>();
builder.Services.AddFluentValidationAutoValidation();

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// CORS must be before other middleware
app.UseCors("AllowFrontend");

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Commented out for development to avoid HTTPS redirect issues
// app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

// Add a simple health check endpoint for testing
app.MapGet("/health", () => Results.Ok(new { status = "healthy", timestamp = DateTime.UtcNow }));

app.Run();
