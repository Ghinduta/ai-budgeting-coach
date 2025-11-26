using TransactionService.Core.Enums;

namespace TransactionService.Core.DTOs;

public record UpdateTransactionRequest(
    DateOnly Date,
    decimal Amount,
    TransactionType Type,
    string Merchant,
    string Account,
    string? Category,
    string? Notes
);
