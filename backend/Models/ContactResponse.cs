namespace Backend.Models;

/// <summary>Response returned after a successful contact submission.</summary>
public sealed record ContactResponse(string Reference, string Message);
