namespace Backend.Models;

/// <summary>
/// Static registry of accessible, non-visual CAPTCHA challenges used by the
/// contact form. Each entry maps a stable key to the expected numeric answer.
///
/// The same challenge set is used in the Angular front-end component
/// (captcha.ts → CAPTCHA_CHALLENGES). Keeping both in sync ensures that valid
/// front-end answers always pass server-side validation.
///
/// Security note: these are plain-language arithmetic/logic questions.
/// The primary security value is bot prevention; the answers are intentionally
/// simple so all users — including those with cognitive or visual disabilities —
/// can complete the form without audio or image dependencies (FR-FORM-4).
/// </summary>
internal static class CaptchaChallenges
{
    /// <summary>
    /// Maps each challenge key to its expected answer (case-insensitive, trimmed).
    /// </summary>
    private static readonly IReadOnlyDictionary<string, string> Answers =
        new Dictionary<string, string>(StringComparer.Ordinal)
        {
            ["c1"] = "7",  // What is 3 plus 4?
            ["c2"] = "4",  // What is 10 minus 6?
            ["c3"] = "6",  // What is 2 times 3?
            ["c4"] = "4",  // How many sides does a square have?
            ["c5"] = "8",  // What is 20 minus 12?
        };

    /// <summary>
    /// Returns <c>true</c> when <paramref name="key"/> is a known challenge and
    /// <paramref name="answer"/> matches the expected value after trimming and
    /// case-normalisation. Returns <c>false</c> for unknown keys.
    /// </summary>
    public static bool IsValid(string key, string answer) =>
        Answers.TryGetValue(key, out var expected) &&
        string.Equals(answer.Trim(), expected, StringComparison.OrdinalIgnoreCase);
}
