# Transaction Service

Transaction management and CSV import microservice.

## Responsibilities

- Transaction CRUD operations
- CSV file import with flexible column mapping
- CSV template management (save/reuse mappings)
- Transaction summaries and aggregations
- Transaction event publishing

## Technology

- ASP.NET Core 8 Web API
- Entity Framework Core 8
- PostgreSQL (transaction_db)
- CsvHelper library
- MassTransit + RabbitMQ

## Database

- **Database Name:** transaction_db
- **Tables:** Transactions, CSVImportTemplates

## API Endpoints

- `GET /api/transactions` - List transactions (paginated, filtered)
- `POST /api/transactions` - Create transaction
- `PUT /api/transactions/{id}` - Update transaction
- `DELETE /api/transactions/{id}` - Delete transaction
- `POST /api/transactions/import` - Import CSV file
- `GET /api/transactions/summary` - Get spending summary
- `GET /api/transactions/import-templates` - List CSV templates
- `POST /api/transactions/import-templates` - Create CSV template
