using Microsoft.EntityFrameworkCore;
using TransactionService.Core.Entities;

namespace TransactionService.Infrastructure.Data;

public class TransactionDbContext : DbContext
{
    public TransactionDbContext(DbContextOptions<TransactionDbContext> options)
        : base(options)
    {
    }

    public DbSet<Transaction> Transactions => Set<Transaction>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Transaction>(entity =>
        {
            entity.HasKey(e => e.Id);

            // Soft delete filter
            entity.HasQueryFilter(e => e.DeletedAt == null);

            // Amount precision
            entity.Property(e => e.Amount)
                .HasPrecision(18, 2)
                .IsRequired();

            // Required fields
            entity.Property(e => e.UserId).IsRequired();
            entity.Property(e => e.Date).IsRequired();
            entity.Property(e => e.Type).IsRequired();

            entity.Property(e => e.Merchant)
                .IsRequired()
                .HasMaxLength(200);

            entity.Property(e => e.Account)
                .IsRequired()
                .HasMaxLength(100);

            entity.Property(e => e.Category)
                .HasMaxLength(100);

            entity.Property(e => e.Notes)
                .HasMaxLength(500);

            // Enum conversions
            entity.Property(e => e.Type)
                .HasConversion<int>();

            entity.Property(e => e.CategorySource)
                .HasConversion<int>();

            // Indexes for performance
            entity.HasIndex(e => e.UserId);
            entity.HasIndex(e => e.Date);
            entity.HasIndex(e => new { e.UserId, e.Date });
            entity.HasIndex(e => e.Category);
            entity.HasIndex(e => e.Merchant);
            entity.HasIndex(e => e.Account);

            // Timestamps
            entity.Property(e => e.CreatedAt).IsRequired();
        });
    }
}
