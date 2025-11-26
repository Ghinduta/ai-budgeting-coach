using TransactionService.Core.Enums;

namespace TransactionService.Core.Entities;

public class Transaction
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public DateOnly Date { get; set; }
    public decimal Amount { get; set; }
    public TransactionType Type { get; set; }
    public string Merchant { get; set; } = string.Empty;
    public string Account { get; set; } = string.Empty;
    public string? Category { get; set; }
    public int? CategoryConfidence { get; set; }
    public CategorySource CategorySource { get; set; } = CategorySource.None;
    public string? Notes { get; set; }
    public Guid? ImportBatchId { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public DateTime? DeletedAt { get; set; }
}
