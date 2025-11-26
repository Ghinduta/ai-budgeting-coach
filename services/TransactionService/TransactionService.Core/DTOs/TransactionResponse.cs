namespace TransactionService.Core.DTOs;

public record TransactionResponse(
    Guid Id,
    DateOnly Date,
    decimal Amount,
    string Type,
    string Merchant,
    string Account,
    string? Category,
    int? CategoryConfidence,
    string CategorySource,
    string? Notes,
    DateTime CreatedAt,
    DateTime? UpdatedAt
);
