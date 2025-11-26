using Microsoft.EntityFrameworkCore;
using TransactionService.Core.Entities;
using TransactionService.Core.Enums;
using TransactionService.Core.Interfaces;
using TransactionService.Infrastructure.Data;

namespace TransactionService.Infrastructure.Repositories;

public class TransactionRepository : ITransactionRepository
{
    private readonly TransactionDbContext _context;

    public TransactionRepository(TransactionDbContext context)
    {
        _context = context;
    }

    public async Task<Transaction> AddAsync(Transaction transaction)
    {
        _context.Transactions.Add(transaction);
        await _context.SaveChangesAsync();
        return transaction;
    }

    public async Task<Transaction?> GetByIdAsync(Guid userId, Guid id)
    {
        return await _context.Transactions
            .FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId && t.DeletedAt == null);
    }

    public async Task<List<Transaction>> GetAllAsync(
        Guid userId,
        int skip,
        int take,
        DateOnly? startDate = null,
        DateOnly? endDate = null,
        string? account = null,
        string? category = null,
        string? merchant = null,
        TransactionType? type = null)
    {
        var query = _context.Transactions
            .Where(t => t.UserId == userId && t.DeletedAt == null);

        query = ApplyFilters(query, startDate, endDate, account, category, merchant, type);

        return await query
            .OrderByDescending(t => t.Date)
            .ThenByDescending(t => t.CreatedAt)
            .Skip(skip)
            .Take(take)
            .ToListAsync();
    }

    public async Task<int> GetCountAsync(
        Guid userId,
        DateOnly? startDate = null,
        DateOnly? endDate = null,
        string? account = null,
        string? category = null,
        string? merchant = null,
        TransactionType? type = null)
    {
        var query = _context.Transactions
            .Where(t => t.UserId == userId && t.DeletedAt == null);

        query = ApplyFilters(query, startDate, endDate, account, category, merchant, type);

        return await query.CountAsync();
    }

    public async Task<List<Transaction>> GetByDateRangeAsync(Guid userId, DateOnly startDate, DateOnly endDate)
    {
        return await _context.Transactions
            .Where(t => t.UserId == userId
                && t.Date >= startDate
                && t.Date <= endDate
                && t.DeletedAt == null)
            .ToListAsync();
    }

    public async Task<Transaction?> UpdateAsync(Transaction transaction)
    {
        _context.Transactions.Update(transaction);
        await _context.SaveChangesAsync();
        return transaction;
    }

    public async Task<bool> DeleteAsync(Guid userId, Guid id)
    {
        var transaction = await GetByIdAsync(userId, id);

        if (transaction == null)
            return false;

        transaction.DeletedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return true;
    }

    private static IQueryable<Transaction> ApplyFilters(
        IQueryable<Transaction> query,
        DateOnly? startDate,
        DateOnly? endDate,
        string? account,
        string? category,
        string? merchant,
        TransactionType? type)
    {
        if (startDate.HasValue)
        {
            query = query.Where(t => t.Date >= startDate.Value);
        }

        if (endDate.HasValue)
        {
            query = query.Where(t => t.Date <= endDate.Value);
        }

        if (!string.IsNullOrWhiteSpace(account))
        {
            query = query.Where(t => t.Account == account);
        }

        if (!string.IsNullOrWhiteSpace(category))
        {
            query = query.Where(t => t.Category == category);
        }

        if (!string.IsNullOrWhiteSpace(merchant))
        {
            query = query.Where(t => t.Merchant.ToLower().Contains(merchant.ToLower()));
        }

        if (type.HasValue)
        {
            query = query.Where(t => t.Type == type.Value);
        }

        return query;
    }
}
