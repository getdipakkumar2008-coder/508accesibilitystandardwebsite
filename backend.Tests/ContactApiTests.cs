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
        var request = new ContactRequest { FullName = "", Email = "not-an-email", Message = "short" };

        var response = await client.PostAsJsonAsync("/api/contact", request);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        var problem = await response.Content.ReadFromJsonAsync<ValidationProblemDetails>();
        Assert.NotNull(problem);
        Assert.True(problem!.Errors.ContainsKey(nameof(ContactRequest.Email)));
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
        };

        var response = await client.PostAsJsonAsync("/api/contact", request);

        Assert.Equal("nosniff", response.Headers.GetValues("X-Content-Type-Options").Single());
        Assert.Equal("DENY", response.Headers.GetValues("X-Frame-Options").Single());
    }
}
