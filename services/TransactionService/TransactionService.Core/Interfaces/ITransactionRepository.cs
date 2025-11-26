using TransactionService.Core.Entities;
using TransactionService.Core.Enums;

namespace TransactionService.Core.Interfaces;

public interface ITransactionRepository
{
    Task<Transaction> AddAsync(Transaction transaction);
    Task<Transaction?> GetByIdAsync(Guid userId, Guid id);
    Task<List<Transaction>> GetAllAsync(
        Guid userId,
        int skip,
        int take,
        DateOnly? startDate = null,
        DateOnly? endDate = null,
        string? account = null,
        string? category = null,
        string? merchant = null,
        TransactionType? type = null);
    Task<int> GetCountAsync(
        Guid userId,
        DateOnly? startDate = null,
        DateOnly? endDate = null,
        string? account = null,
        string? category = null,
        string? merchant = null,
        TransactionType? type = null);
    Task<List<Transaction>> GetByDateRangeAsync(Guid userId, DateOnly startDate, DateOnly endDate);
    Task<Transaction?> UpdateAsync(Transaction transaction);
    Task<bool> DeleteAsync(Guid userId, Guid id);
}
