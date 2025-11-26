using TransactionService.Core.Enums;

namespace TransactionService.Core.DTOs;

public class TransactionFilterRequest
{
    public DateOnly? StartDate { get; set; }
    public DateOnly? EndDate { get; set; }
    public string? Account { get; set; }
    public string? Category { get; set; }
    public string? Merchant { get; set; }
    public TransactionType? Type { get; set; }
}
