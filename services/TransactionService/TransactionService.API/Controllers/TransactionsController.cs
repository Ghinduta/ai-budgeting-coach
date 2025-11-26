using Microsoft.AspNetCore.Mvc;
using TransactionService.Core.DTOs;
using TransactionService.Core.Enums;
using TransactionService.Core.Interfaces;

namespace TransactionService.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TransactionsController : ControllerBase
{
    private readonly ITransactionService _transactionService;

    public TransactionsController(ITransactionService transactionService)
    {
        _transactionService = transactionService;
    }

    // Temporary: hardcoded user ID until auth is implemented
    private static Guid GetUserId() => Guid.Parse("00000000-0000-0000-0000-000000000001");

    [HttpPost]
    public async Task<ActionResult<TransactionResponse>> Create(CreateTransactionRequest request)
    {
        var userId = GetUserId();
        var result = await _transactionService.CreateAsync(userId, request);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    [HttpGet]
    public async Task<ActionResult<PagedResponse<TransactionResponse>>> GetAll(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 50,
        [FromQuery] DateOnly? startDate = null,
        [FromQuery] DateOnly? endDate = null,
        [FromQuery] string? account = null,
        [FromQuery] string? category = null,
        [FromQuery] string? merchant = null,
        [FromQuery] TransactionType? type = null)
    {
        var userId = GetUserId();

        // Validate pagination
        if (page < 1) page = 1;
        if (pageSize < 1) pageSize = 50;
        if (pageSize > 100) pageSize = 100;

        var filter = new TransactionFilterRequest
        {
            StartDate = startDate,
            EndDate = endDate,
            Account = account,
            Category = category,
            Merchant = merchant,
            Type = type
        };

        var result = await _transactionService.GetAllAsync(userId, page, pageSize, filter);
        return Ok(result);
    }

    [HttpGet("summary")]
    public async Task<ActionResult<TransactionSummaryResponse>> GetSummary(
        [FromQuery] DateOnly? startDate = null,
        [FromQuery] DateOnly? endDate = null)
    {
        var userId = GetUserId();

        // Default to current month
        var start = startDate ?? new DateOnly(DateTime.Now.Year, DateTime.Now.Month, 1);
        var end = endDate ?? start.AddMonths(1).AddDays(-1);

        var result = await _transactionService.GetSummaryAsync(userId, start, end);
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<TransactionResponse>> GetById(Guid id)
    {
        var userId = GetUserId();
        var result = await _transactionService.GetByIdAsync(userId, id);

        if (result == null)
            return NotFound();

        return Ok(result);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<TransactionResponse>> Update(Guid id, UpdateTransactionRequest request)
    {
        var userId = GetUserId();
        var result = await _transactionService.UpdateAsync(userId, id, request);

        if (result == null)
            return NotFound();

        return Ok(result);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var userId = GetUserId();
        var deleted = await _transactionService.DeleteAsync(userId, id);

        if (!deleted)
            return NotFound();

        return NoContent();
    }
}
