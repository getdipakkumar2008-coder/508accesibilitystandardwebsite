using Backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

/// <summary>
/// Accepts public contact-form submissions. Validation errors are returned as a
/// standard ProblemDetails/ValidationProblem payload so the accessible front-end
/// can map them back to specific fields.
///
/// OWASP security measures in this controller:
/// 1. Input validation — [ApiController] auto-validates DataAnnotations before the
///    action body is reached; malformed or oversized payloads receive a 400.
/// 2. CAPTCHA verification — server-side check of challenge key + answer prevents
///    automated submissions (defense-in-depth; mirrors the front-end check).
/// 3. Output encoding — no user-supplied value is echoed back in any response body
///    or header. The reference returned is a server-generated GUID, not derived
///    from user input, so no encoding is needed for the response.
/// 4. Logging hygiene — only a non-identifying reference is logged; PII (name,
///    email, message, captcha answer) is never written to any log sink.
/// 5. Security headers — X-Content-Type-Options, X-Frame-Options, Referrer-Policy,
///    and Content-Security-Policy are set globally in Program.cs middleware.
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

        // Server-side CAPTCHA verification (defense-in-depth).
        // The front-end performs the same check, but this prevents automated
        // submissions that bypass the UI entirely.
        if (!CaptchaChallenges.IsValid(request.CaptchaKey, request.CaptchaAnswer))
        {
            ModelState.AddModelError(
                nameof(ContactRequest.CaptchaAnswer),
                "Incorrect answer. Please try again.");
            return ValidationProblem();
        }

        var reference = Guid.NewGuid().ToString("N")[..8].ToUpperInvariant();

        // Never log PII (name/email/message/captcha) — log only a non-identifying reference.
        _logger.LogInformation("Contact submission received. Reference {Reference}", reference);

        // A real implementation would enqueue an email/notification here.
        // User-supplied content is never written to the response body, so no
        // HTML-encoding is required for the outbound payload.
        var response = new ContactResponse(reference, "Thank you. Your message has been received.");
        return CreatedAtAction(nameof(Submit), new { reference }, response);
    }
}
