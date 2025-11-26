using FluentValidation;
using TransactionService.Core.DTOs;

namespace TransactionService.Core.Validators;

public class UpdateTransactionRequestValidator : AbstractValidator<UpdateTransactionRequest>
{
    public UpdateTransactionRequestValidator()
    {
        RuleFor(x => x.Date)
            .NotEmpty().WithMessage("Date is required")
            .LessThanOrEqualTo(DateOnly.FromDateTime(DateTime.Today))
            .WithMessage("Date cannot be in the future");

        RuleFor(x => x.Amount)
            .GreaterThan(0).WithMessage("Amount must be greater than 0");

        RuleFor(x => x.Type)
            .IsInEnum().WithMessage("Invalid transaction type");

        RuleFor(x => x.Merchant)
            .NotEmpty().WithMessage("Merchant is required")
            .MaximumLength(200).WithMessage("Merchant cannot exceed 200 characters");

        RuleFor(x => x.Account)
            .NotEmpty().WithMessage("Account is required")
            .MaximumLength(100).WithMessage("Account cannot exceed 100 characters");

        RuleFor(x => x.Category)
            .MaximumLength(100).WithMessage("Category cannot exceed 100 characters")
            .When(x => x.Category != null);

        RuleFor(x => x.Notes)
            .MaximumLength(500).WithMessage("Notes cannot exceed 500 characters")
            .When(x => x.Notes != null);
    }
}
