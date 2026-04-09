using System.Net;
using System.Text.Json;

namespace StudentManagementSystem.Middleware
{
    /// Middleware responsible for handling all unhandled exceptions globally.
   
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionMiddleware> _logger;

        /// Constructor for injecting RequestDelegate and Logger dependencies.
   
        public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }
        /// Invokes the middleware to process the HTTP request.
    
        public async Task Invoke(HttpContext context)
        {
            try
            {
                // Pass control to the next middleware/component
                await _next(context);
            }
            catch (Exception ex)
            {
                // Log the exception details
                _logger.LogError(ex, ex.Message);

                // Handle and format the exception response
                await HandleExceptionAsync(context, ex);
            }
        }
        /// Handles the exception and returns a structured JSON response.
        private Task HandleExceptionAsync(HttpContext context, Exception ex)
        {
            // Set response content type to JSON
            context.Response.ContentType = "application/json";

            // Default response object
            var response = new
            {
                StatusCode = context.Response.StatusCode,
                Message = ex.Message,
                Details = ex.InnerException?.Message
            };

            // Map exception types to HTTP status codes
            switch (ex)
            {
                case KeyNotFoundException:
                    // Resource not found 
                    context.Response.StatusCode = (int)HttpStatusCode.NotFound;
                    break;

                case UnauthorizedAccessException:
                    // Unauthorized access attempt
                    context.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                    break;

                case ArgumentException:
                    // Invalid input or bad request
                    context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                    break;

                default:
                    // Internal server error 
                    context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                    break;
            }

            // Return serialized JSON response
            return context.Response.WriteAsync(JsonSerializer.Serialize(response));
        }
    }
}