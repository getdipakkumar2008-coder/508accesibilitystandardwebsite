using Backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

/// <summary>
/// Accepts public contact-form submissions. Validation errors are returned as a
/// standard ProblemDetails/ValidationProblem payload so the accessible front-end
/// can map them back to specific fields.
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public sealed class ContactController : ControllerBase
{
    private readonly ILogger<ContactController> _logger;

    public ContactController(ILogger<ContactController> logger)
    {
        _logger = logger;
    }

    [HttpPost]
    [ProducesResponseType(typeof(ContactResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    public IActionResult Submit([FromBody] ContactRequest request)
    {
        // [ApiController] auto-validates DataAnnotations and returns a
        // ValidationProblemDetails (400) before reaching here when invalid.

        var reference = Guid.NewGuid().ToString("N")[..8].ToUpperInvariant();

        // Never log PII (email/message contents) — log only a non-identifying reference.
        _logger.LogInformation("Contact submission received. Reference {Reference}", reference);

        // A real implementation would enqueue an email/notification here.
        var response = new ContactResponse(reference, "Thank you. Your message has been received.");
        return CreatedAtAction(nameof(Submit), new { reference }, response);
    }
}
