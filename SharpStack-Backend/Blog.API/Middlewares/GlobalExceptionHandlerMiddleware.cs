using System.Net;
using System.Text.Json;
using Blog.API.Models;
using Blog.Domain.Exceptions;
using Microsoft.EntityFrameworkCore;

namespace Blog.API.Middlewares
{
    public class GlobalExceptionHandlerMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<GlobalExceptionHandlerMiddleware> _logger;
        private readonly IWebHostEnvironment _environment;

        public GlobalExceptionHandlerMiddleware(
            RequestDelegate next,
            ILogger<GlobalExceptionHandlerMiddleware> logger,
            IWebHostEnvironment environment)
        {
            _next = next;
            _logger = logger;
            _environment = environment;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                await HandleExceptionAsync(context, ex);
            }
        }

        private async Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            var response = context.Response;
            response.ContentType = "application/json";

            var errorResponse = new ErrorResponse
            {
                Timestamp = DateTime.UtcNow,
                Path = context.Request.Path
            };

            switch (exception)
            {
                case NotFoundException notFoundException:
                    response.StatusCode = (int)HttpStatusCode.NotFound;
                    errorResponse.StatusCode = (int)HttpStatusCode.NotFound;
                    errorResponse.Message = notFoundException.Message;
                    _logger.LogWarning(notFoundException, "Not Found: {Message}", notFoundException.Message);
                    break;

                case BadRequestException badRequestException:
                    response.StatusCode = (int)HttpStatusCode.BadRequest;
                    errorResponse.StatusCode = (int)HttpStatusCode.BadRequest;
                    errorResponse.Message = badRequestException.Message;
                    _logger.LogWarning(badRequestException, "Bad Request: {Message}", badRequestException.Message);
                    break;

                case Blog.Domain.Exceptions.UnauthorizedAccessException unauthorizedException:
                    response.StatusCode = (int)HttpStatusCode.Unauthorized;
                    errorResponse.StatusCode = (int)HttpStatusCode.Unauthorized;
                    errorResponse.Message = unauthorizedException.Message;
                    _logger.LogWarning(unauthorizedException, "Unauthorized: {Message}", unauthorizedException.Message);
                    break;

                case ForbiddenException forbiddenException:
                    response.StatusCode = (int)HttpStatusCode.Forbidden;
                    errorResponse.StatusCode = (int)HttpStatusCode.Forbidden;
                    errorResponse.Message = forbiddenException.Message;
                    _logger.LogWarning(forbiddenException, "Forbidden: {Message}", forbiddenException.Message);
                    break;

                case DbUpdateException dbUpdateException:
                    response.StatusCode = (int)HttpStatusCode.InternalServerError;
                    errorResponse.StatusCode = (int)HttpStatusCode.InternalServerError;
                    
                    if (_environment.IsDevelopment())
                    {
                        errorResponse.Message = $"Database error: {dbUpdateException.Message}";
                        errorResponse.StackTrace = dbUpdateException.StackTrace;
                    }
                    else
                    {
                        errorResponse.Message = "A database error occurred. Please try again later.";
                    }
                    
                    _logger.LogError(dbUpdateException, "Database error occurred");
                    break;

                case Microsoft.Data.SqlClient.SqlException sqlException:
                    response.StatusCode = (int)HttpStatusCode.InternalServerError;
                    errorResponse.StatusCode = (int)HttpStatusCode.InternalServerError;
                    
                    if (_environment.IsDevelopment())
                    {
                        errorResponse.Message = $"SQL error: {sqlException.Message}";
                        errorResponse.StackTrace = sqlException.StackTrace;
                    }
                    else
                    {
                        errorResponse.Message = "A database connection error occurred. Please try again later.";
                    }
                    
                    _logger.LogError(sqlException, "SQL error occurred");
                    break;

                default:
                    response.StatusCode = (int)HttpStatusCode.InternalServerError;
                    errorResponse.StatusCode = (int)HttpStatusCode.InternalServerError;
                    
                    if (_environment.IsDevelopment())
                    {
                        errorResponse.Message = exception.Message;
                        errorResponse.StackTrace = exception.StackTrace;
                    }
                    else
                    {
                        errorResponse.Message = "An unexpected error occurred. Please try again later.";
                    }
                    
                    _logger.LogError(exception, "Unhandled exception occurred");
                    break;
            }

            var jsonResponse = JsonSerializer.Serialize(errorResponse, new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            });

            await response.WriteAsync(jsonResponse);
        }
    }
}
