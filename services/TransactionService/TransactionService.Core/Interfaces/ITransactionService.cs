using TransactionService.Core.DTOs;

namespace TransactionService.Core.Interfaces;

public interface ITransactionService
{
    Task<TransactionResponse> CreateAsync(Guid userId, CreateTransactionRequest request);
    Task<PagedResponse<TransactionResponse>> GetAllAsync(Guid userId, int page, int pageSize, TransactionFilterRequest? filter = null);
    Task<TransactionResponse?> GetByIdAsync(Guid userId, Guid id);
    Task<TransactionResponse?> UpdateAsync(Guid userId, Guid id, UpdateTransactionRequest request);
    Task<bool> DeleteAsync(Guid userId, Guid id);
    Task<TransactionSummaryResponse> GetSummaryAsync(Guid userId, DateOnly startDate, DateOnly endDate);
}
