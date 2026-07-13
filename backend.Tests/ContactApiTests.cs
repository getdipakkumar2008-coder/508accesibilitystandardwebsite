using System.Net;
using System.Net.Http.Json;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Testing;

namespace Backend.Tests;

public sealed class ContactApiTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;

    public ContactApiTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task Post_ValidRequest_Returns201WithReference()
    {
        var client = _factory.CreateClient();
        var request = new ContactRequest
        {
            FullName = "Jane Doe",
            Email = "jane@example.com",
            Message = "Hello, this is a valid test message.",
            CaptchaKey = "c1",
            CaptchaAnswer = "7",
        };

        var response = await client.PostAsJsonAsync("/api/contact", request);

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        var body = await response.Content.ReadFromJsonAsync<ContactResponse>();
        Assert.NotNull(body);
        Assert.False(string.IsNullOrWhiteSpace(body!.Reference));
    }

    [Fact]
    public async Task Post_InvalidRequest_ReturnsValidationProblem()
    {
        var client = _factory.CreateClient();
        var request = new ContactRequest
        {
            FullName = "",
            Email = "not-an-email",
            Message = "short",
            CaptchaKey = "c1",
            CaptchaAnswer = "7",
        };

        var response = await client.PostAsJsonAsync("/api/contact", request);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        var problem = await response.Content.ReadFromJsonAsync<ValidationProblemDetails>();
        Assert.NotNull(problem);
        Assert.True(problem!.Errors.ContainsKey(nameof(ContactRequest.Email)));
    }

    [Fact]
    public async Task Post_WrongCaptchaAnswer_ReturnsValidationProblem()
    {
        var client = _factory.CreateClient();
        var request = new ContactRequest
        {
            FullName = "Jane Doe",
            Email = "jane@example.com",
            Message = "Hello, this is a valid test message.",
            CaptchaKey = "c1",     // challenge: "What is 3 plus 4?" → expects "7"
            CaptchaAnswer = "99",  // wrong answer
        };

        var response = await client.PostAsJsonAsync("/api/contact", request);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        var problem = await response.Content.ReadFromJsonAsync<ValidationProblemDetails>();
        Assert.NotNull(problem);
        Assert.True(problem!.Errors.ContainsKey(nameof(ContactRequest.CaptchaAnswer)));
    }

    [Fact]
    public async Task Post_UnknownCaptchaKey_ReturnsValidationProblem()
    {
        var client = _factory.CreateClient();
        var request = new ContactRequest
        {
            FullName = "Jane Doe",
            Email = "jane@example.com",
            Message = "Hello, this is a valid test message.",
            CaptchaKey = "bad",   // valid length but not a known challenge key
            CaptchaAnswer = "7",
        };

        var response = await client.PostAsJsonAsync("/api/contact", request);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        var problem = await response.Content.ReadFromJsonAsync<ValidationProblemDetails>();
        Assert.NotNull(problem);
        Assert.True(problem!.Errors.ContainsKey(nameof(ContactRequest.CaptchaAnswer)));
    }

    [Fact]
    public async Task Post_ValidCaptchaAllChallenges_Returns201()
    {
        // Verify every challenge key+answer pair is accepted by the server.
        var client = _factory.CreateClient();
        var challenges = new[]
        {
            ("c1", "7"), ("c2", "4"), ("c3", "6"), ("c4", "4"), ("c5", "8"),
        };

        foreach (var (key, answer) in challenges)
        {
            var request = new ContactRequest
            {
                FullName = "Jane Doe",
                Email = "jane@example.com",
                Message = "Hello, this is a valid test message.",
                CaptchaKey = key,
                CaptchaAnswer = answer,
            };
            var response = await client.PostAsJsonAsync("/api/contact", request);
            Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        }
    }

    /// <summary>
    /// OWASP NFR-SEC-1: user-supplied data containing script tags or injection
    /// payloads must never be reflected verbatim in any response body.
    /// </summary>
    [Fact]
    public async Task Post_XssInput_IsNotReflectedInResponse()
    {
        var client = _factory.CreateClient();
        var xssPayload = "<script>alert('xss')</script>";
        var request = new ContactRequest
        {
            FullName = xssPayload,
            Email = "test@example.com",
            Message = "This is a message long enough to pass validation.",
            CaptchaKey = "c1",
            CaptchaAnswer = "7",
        };

        var response = await client.PostAsJsonAsync("/api/contact", request);

        // The server should accept the submission (XSS in FullName is still valid
        // plain text from a model standpoint) but must never echo the payload.
        var content = await response.Content.ReadAsStringAsync();
        Assert.DoesNotContain("<script>", content, StringComparison.OrdinalIgnoreCase);
        Assert.DoesNotContain("alert(", content, StringComparison.OrdinalIgnoreCase);
    }

    [Fact]
    public async Task Response_IncludesSecurityHeaders()
    {
        var client = _factory.CreateClient();
        var request = new ContactRequest
        {
            FullName = "Jane Doe",
            Email = "jane@example.com",
            Message = "Hello, this is a valid test message.",
            CaptchaKey = "c1",
            CaptchaAnswer = "7",
        };

        var response = await client.PostAsJsonAsync("/api/contact", request);

        Assert.Equal("nosniff", response.Headers.GetValues("X-Content-Type-Options").Single());
        Assert.Equal("DENY", response.Headers.GetValues("X-Frame-Options").Single());
    }
}
