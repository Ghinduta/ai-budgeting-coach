namespace TransactionService.Core.DTOs;

public class TransactionSummaryResponse
{
    public decimal TotalIncome { get; set; }
    public decimal TotalExpenses { get; set; }
    public decimal NetCashFlow { get; set; }
    public int TransactionCount { get; set; }
    public Dictionary<string, decimal> CategoryBreakdown { get; set; } = new();
    public Dictionary<string, decimal> AccountBreakdown { get; set; } = new();
    public DateOnly StartDate { get; set; }
    public DateOnly EndDate { get; set; }
}
