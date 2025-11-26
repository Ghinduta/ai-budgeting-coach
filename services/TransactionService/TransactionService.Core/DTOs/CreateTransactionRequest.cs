using TransactionService.Core.Enums;

namespace TransactionService.Core.DTOs;

public record CreateTransactionRequest(
    DateOnly Date,
    decimal Amount,
    TransactionType Type,
    string Merchant,
    string Account,
    string? Category,
    string? Notes
);
