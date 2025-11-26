using TransactionService.Core.DTOs;
using TransactionService.Core.Entities;
using TransactionService.Core.Enums;
using TransactionService.Core.Interfaces;

namespace TransactionService.Core.Services;

public class TransactionService : ITransactionService
{
    private readonly ITransactionRepository _repository;

    public TransactionService(ITransactionRepository repository)
    {
        _repository = repository;
    }

    public async Task<TransactionResponse> CreateAsync(Guid userId, CreateTransactionRequest request)
    {
        var transaction = new Transaction
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Date = request.Date,
            Amount = request.Amount,
            Type = request.Type,
            Merchant = request.Merchant,
            Account = request.Account,
            Category = request.Category,
            CategorySource = request.Category != null ? CategorySource.User : CategorySource.None,
            Notes = request.Notes,
            CreatedAt = DateTime.UtcNow
        };

        await _repository.AddAsync(transaction);

        return MapToResponse(transaction);
    }

    public async Task<PagedResponse<TransactionResponse>> GetAllAsync(
        Guid userId,
        int page,
        int pageSize,
        TransactionFilterRequest? filter = null)
    {
        var skip = (page - 1) * pageSize;

        var totalCount = await _repository.GetCountAsync(
            userId,
            filter?.StartDate,
            filter?.EndDate,
            filter?.Account,
            filter?.Category,
            filter?.Merchant,
            filter?.Type);

        var transactions = await _repository.GetAllAsync(
            userId,
            skip,
            pageSize,
            filter?.StartDate,
            filter?.EndDate,
            filter?.Account,
            filter?.Category,
            filter?.Merchant,
            filter?.Type);

        var data = transactions.Select(MapToResponse).ToList();

        return PagedResponse<TransactionResponse>.Create(data, page, pageSize, totalCount);
    }

    public async Task<TransactionResponse?> GetByIdAsync(Guid userId, Guid id)
    {
        var transaction = await _repository.GetByIdAsync(userId, id);

        return transaction == null ? null : MapToResponse(transaction);
    }

    public async Task<TransactionResponse?> UpdateAsync(Guid userId, Guid id, UpdateTransactionRequest request)
    {
        var transaction = await _repository.GetByIdAsync(userId, id);

        if (transaction == null)
            return null;

        transaction.Date = request.Date;
        transaction.Amount = request.Amount;
        transaction.Type = request.Type;
        transaction.Merchant = request.Merchant;
        transaction.Account = request.Account;
        transaction.Category = request.Category;
        transaction.CategorySource = request.Category != null ? CategorySource.User : CategorySource.None;
        transaction.Notes = request.Notes;
        transaction.UpdatedAt = DateTime.UtcNow;

        await _repository.UpdateAsync(transaction);

        return MapToResponse(transaction);
    }

    public async Task<bool> DeleteAsync(Guid userId, Guid id)
    {
        return await _repository.DeleteAsync(userId, id);
    }

    public async Task<TransactionSummaryResponse> GetSummaryAsync(
        Guid userId,
        DateOnly startDate,
        DateOnly endDate)
    {
        var transactions = await _repository.GetByDateRangeAsync(userId, startDate, endDate);

        var totalIncome = transactions
            .Where(t => t.Type == TransactionType.Income)
            .Sum(t => t.Amount);

        var totalExpenses = transactions
            .Where(t => t.Type == TransactionType.Expense)
            .Sum(t => t.Amount);

        var categoryBreakdown = transactions
            .Where(t => t.Category != null)
            .GroupBy(t => t.Category!)
            .ToDictionary(
                g => g.Key,
                g => g.Sum(t => t.Amount)
            );

        var accountBreakdown = transactions
            .GroupBy(t => t.Account)
            .ToDictionary(
                g => g.Key,
                g => g.Sum(t => t.Type == TransactionType.Income ? t.Amount : -t.Amount)
            );

        return new TransactionSummaryResponse
        {
            TotalIncome = totalIncome,
            TotalExpenses = totalExpenses,
            NetCashFlow = totalIncome - totalExpenses,
            TransactionCount = transactions.Count,
            CategoryBreakdown = categoryBreakdown,
            AccountBreakdown = accountBreakdown,
            StartDate = startDate,
            EndDate = endDate
        };
    }

    private static TransactionResponse MapToResponse(Transaction t) => new(
        t.Id,
        t.Date,
        t.Amount,
        t.Type.ToString(),
        t.Merchant,
        t.Account,
        t.Category,
        t.CategoryConfidence,
        t.CategorySource.ToString(),
        t.Notes,
        t.CreatedAt,
        t.UpdatedAt
    );
}
