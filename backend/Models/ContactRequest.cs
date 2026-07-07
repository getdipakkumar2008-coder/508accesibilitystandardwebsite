using System.ComponentModel.DataAnnotations;

namespace Backend.Models;

/// <summary>
/// Payload for a public contact-form submission. Mirrors the accessible
/// Angular contact form and is validated server-side (defense in depth).
/// </summary>
public sealed class ContactRequest
{
    [Required(ErrorMessage = "Enter your full name.")]
    [StringLength(100, MinimumLength = 1)]
    public string FullName { get; init; } = string.Empty;

    [Required(ErrorMessage = "Enter your email address.")]
    [EmailAddress(ErrorMessage = "Enter a valid email address, such as name@example.com.")]
    [StringLength(254)]
    public string Email { get; init; } = string.Empty;

    [Required(ErrorMessage = "Enter your message.")]
    [StringLength(2000, MinimumLength = 10, ErrorMessage = "Your message must be at least 10 characters.")]
    public string Message { get; init; } = string.Empty;
}
