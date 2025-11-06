# Epic 5: Transaction Service - CSV Import

**Epic ID:** EPIC-05
**Priority:** P1 (High)
**Status:** Not Started
**Estimated Duration:** 5-7 days
**Owner:** Dev Team
**Depends On:** Epic 4 (Transaction CRUD)

---

## Epic Overview

Implement CSV import functionality allowing users to upload bank export files, map columns flexibly, save templates for reuse, and efficiently import thousands of transactions. This is a critical feature for multi-account visibility and reducing manual data entry.

**Goal:** Enable users to import CSV files from any bank format with flexible column mapping and template reuse.

---

## Stories

### Story 5.1: Implement CSV Parser Service (CsvHelper Library)
**Story ID:** STORY-05-01
**Priority:** P0
**Estimated:** 3 hours

**Description:**
Create a robust CSV parsing service that can handle various formats, delimiters, and encodings.

**Acceptance Criteria:**
- [ ] CsvHelper NuGet package installed
- [ ] ICsvParser interface defined in Core/Interfaces
- [ ] CsvParser implementation in Infrastructure/Csv
- [ ] Supports multiple delimiters: comma, semicolon, tab (auto-detect)
- [ ] Supports various encodings: UTF-8, UTF-16, Windows-1252
- [ ] Handles quoted fields with embedded delimiters
- [ ] Handles empty rows gracefully (skip)
- [ ] Returns parsed data as IEnumerable<Dictionary<string, string>> (header → value mapping)
- [ ] Detects headers automatically from first row
- [ ] Configurable skip rows option (for files with metadata before headers)
- [ ] Memory-efficient streaming for large files (1000+ rows)

**Implementation Notes:**
- Use CsvHelper's CsvConfiguration for flexibility
- Detect delimiter by analyzing first few rows
- Handle BOM (Byte Order Mark) for encoding detection
- Stream processing to avoid loading entire file in memory

**Testing:**
- Unit tests with various CSV formats
- Test delimiter detection
- Test encoding detection
- Test large file handling (10,000+ rows)
- Test malformed CSV files

**Dependencies:**
- Epic 4: Transaction Service structure

---

### Story 5.2: Create ImportController with Upload Endpoint
**Story ID:** STORY-05-02
**Priority:** P0
**Estimated:** 3 hours

**Description:**
Implement API endpoint to receive CSV file uploads and initiate import process.

**Acceptance Criteria:**
- [ ] POST /api/transactions/import endpoint
- [ ] Accepts multipart/form-data with CSV file
- [ ] Maximum file size: 10MB
- [ ] File extension validation (.csv only)
- [ ] File content type validation (text/csv, application/csv)
- [ ] Request DTO includes: file, column mappings (JSON), account name, date format
- [ ] Returns import results: total rows, imported count, failed count, error details
- [ ] Async processing for large files
- [ ] Progress tracking (future: use SignalR for real-time updates)
- [ ] Endpoint requires authentication

**Implementation Notes:**
- Use IFormFile for file upload
- Validate file before parsing
- Consider background job for very large imports (future enhancement)
- Return 400 Bad Request for invalid files

**Testing:**
- Test valid CSV upload
- Test file size limit
- Test invalid file types
- Test missing required parameters

**Dependencies:**
- Story 5.1

---

### Story 5.3: Implement Flexible CSV Column Mapping
**Story ID:** STORY-05-03
**Priority:** P0
**Estimated:** 4 hours

**Description:**
Allow users to map CSV columns to transaction fields dynamically, handling various bank formats.

**Acceptance Criteria:**
- [ ] ColumnMapping DTO defined with properties: dateColumn, amountColumn, merchantColumn, accountColumn (optional), notesColumn (optional), categoryColumn (optional)
- [ ] Columns specified by header name or index
- [ ] Required mappings: date, amount, merchant
- [ ] Optional mappings: account, notes, category
- [ ] Validation: required columns must be mapped
- [ ] Validation: columns must exist in CSV headers
- [ ] Support for inverted amounts (some banks use positive for expenses)
- [ ] Support for separate debit/credit columns (map both, calculate final amount)
- [ ] Mapping logic in ImportService

**Implementation Notes:**
- Create ColumnMappingValidator for validation
- Handle case-insensitive column name matching
- Allow index-based mapping (column 0, column 1, etc.) for headerless CSVs
- Document common bank formats (ING, Revolut, BofA, Chase)

**Testing:**
- Test various column mapping combinations
- Test validation errors
- Test debit/credit column handling
- Test inverted amount handling

**Dependencies:**
- Story 5.2

---

### Story 5.4: Implement CSV Template CRUD (Save/Reuse Mappings)
**Story ID:** STORY-05-04
**Priority:** P0
**Estimated:** 3 hours

**Description:**
Allow users to save column mapping configurations as templates for reuse with the same bank.

**Acceptance Criteria:**
- [ ] POST /api/transactions/import-templates - Create template
- [ ] GET /api/transactions/import-templates - List user's templates
- [ ] GET /api/transactions/import-templates/{id} - Get single template
- [ ] PUT /api/transactions/import-templates/{id} - Update template
- [ ] DELETE /api/transactions/import-templates/{id} - Delete template
- [ ] Template includes: name, column mappings, date format, skip rows, account name (optional)
- [ ] Templates are user-specific (UserId foreign key)
- [ ] Template names must be unique per user
- [ ] Templates stored in CSVImportTemplates table

**Implementation Notes:**
- Store column mappings as JSON in database
- Validate template before saving
- Return templates sorted by most recently used

**Testing:**
- Test template CRUD operations
- Test template uniqueness validation
- Test template authorization (users can't access others' templates)

**Dependencies:**
- Story 5.3
- Epic 4: CSVImportTemplate entity

---

### Story 5.5: Implement Bulk Transaction Insertion (Efficient Batching)
**Story ID:** STORY-05-05
**Priority:** P0
**Estimated:** 3 hours

**Description:**
Optimize transaction insertion for importing thousands of rows efficiently.

**Acceptance Criteria:**
- [ ] Bulk insert using EF Core AddRange
- [ ] Batch size: 500 transactions per database round-trip
- [ ] Transaction wrapping: all or nothing per batch (with retry)
- [ ] Performance: <5 seconds for 1,000 rows (NFR7)
- [ ] Performance: <30 seconds for 5,000 rows
- [ ] Database indexes optimized for bulk inserts
- [ ] ImportBatchId assigned to all transactions in same import
- [ ] Timestamps set correctly (CreatedAt, UpdatedAt)
- [ ] Duplicate detection runs per batch (not per transaction)

**Implementation Notes:**
- Disable EF Core change tracking for bulk inserts (AsNoTracking)
- Consider using Dapper or EF Core BulkExtensions for even better performance
- Use database transactions for atomicity
- Log batch progress for debugging

**Testing:**
- Performance test with 1,000 rows
- Performance test with 5,000 rows
- Test transaction rollback on error
- Test duplicate detection with bulk data

**Dependencies:**
- Story 5.4

---

### Story 5.6: Implement Error Handling for Malformed CSV Rows
**Story ID:** STORY-05-06
**Priority:** P0
**Estimated:** 3 hours

**Description:**
Handle CSV parsing and validation errors gracefully, allowing partial imports to succeed.

**Acceptance Criteria:**
- [ ] Invalid date formats logged with row number
- [ ] Invalid amount formats logged with row number
- [ ] Missing required fields logged with row number
- [ ] Errors don't stop entire import (skip row, continue processing)
- [ ] Maximum error threshold: 20% failure rate (otherwise abort import)
- [ ] Error details returned in import response
- [ ] Errors include: row number, field name, error message, field value
- [ ] Successfully imported rows committed even if some rows fail
- [ ] Failed rows available for download (CSV with error column)

**Implementation Notes:**
- Use try-catch per row processing
- Collect errors in list during import
- Abort import if error rate > 20%
- Create ErrorRow DTO for failed rows

**Testing:**
- Test CSV with various errors
- Test error threshold (import with 19% errors succeeds, 21% fails)
- Test error details in response
- Test partial import success

**Dependencies:**
- Story 5.5

---

### Story 5.7: Implement Import Summary Response
**Story ID:** STORY-05-07
**Priority:** P0
**Estimated:** 2 hours

**Description:**
Return comprehensive import results to user showing success/failure statistics.

**Acceptance Criteria:**
- [ ] ImportResult DTO with properties: totalRows, importedCount, failedCount, errors (array), importBatchId, duration (ms)
- [ ] Success status code: 200 OK if >0 rows imported, 400 Bad Request if all rows failed
- [ ] Detailed error list with row numbers and reasons
- [ ] Summary message: "Successfully imported 487 of 500 transactions. 13 rows failed."
- [ ] ImportBatchId returned for tracking
- [ ] Import duration logged and returned

**Implementation Notes:**
- Track import start/end time
- Format error messages for user readability
- Log import summary for analytics

**Testing:**
- Test fully successful import
- Test partially successful import
- Test completely failed import
- Verify error messages are user-friendly

**Dependencies:**
- Story 5.6

---

### Story 5.8: Add Unit Tests for CSV Parsing Edge Cases
**Story ID:** STORY-05-08
**Priority:** P1
**Estimated:** 4 hours

**Description:**
Create comprehensive unit tests for CSV parsing with various edge cases and formats.

**Acceptance Criteria:**
- [ ] Tests for different delimiters (comma, semicolon, tab)
- [ ] Tests for different date formats (MM/DD/YYYY, DD/MM/YYYY, YYYY-MM-DD, DD-MM-YYYY)
- [ ] Tests for positive/negative amount representations
- [ ] Tests for amounts with parentheses (e.g., "(50.00)" = -50)
- [ ] Tests for quoted fields with embedded commas
- [ ] Tests for empty rows and trailing commas
- [ ] Tests for UTF-8 with BOM
- [ ] Tests for malformed CSV (unclosed quotes, mismatched columns)
- [ ] Tests for very large files (streaming verification)
- [ ] Mock file system for testing

**Implementation Notes:**
- Create test CSV files as embedded resources
- Test realistic bank CSV formats (ING, Revolut, Chase, BofA)
- Use FluentAssertions for readable assertions

**Testing:**
```bash
dotnet test --filter "Category=CsvParsing"
```

**Dependencies:**
- Story 5.7

---

### Story 5.9: Add Integration Tests for CSV Import with Sample Files
**Story ID:** STORY-05-09
**Priority:** P1
**Estimated:** 4 hours

**Description:**
Create end-to-end integration tests with real bank CSV samples.

**Acceptance Criteria:**
- [ ] Sample CSV files for 3+ banks (ING, Revolut, BofA or Chase)
- [ ] Integration test: Upload ING CSV → verify transactions created
- [ ] Integration test: Upload Revolut CSV → verify transactions created
- [ ] Integration test: Upload with template → verify mapping applied
- [ ] Integration test: Upload with errors → verify partial import
- [ ] Integration test: Verify TransactionsBulkImported event published
- [ ] Integration test: Verify ImportBatchId assigned correctly
- [ ] All tests use Testcontainers for PostgreSQL
- [ ] Tests clean up data after execution

**Implementation Notes:**
- Store sample CSV files in test project
- Anonymize sample data (no real personal information)
- Test realistic file sizes (100-500 rows)

**Testing:**
```bash
dotnet test --filter "Category=Integration&Category=CsvImport"
```

**Dependencies:**
- Story 5.8

---

### Story 5.10: Create Frontend CSV Upload Dialog
**Story ID:** STORY-05-10
**Priority:** P0
**Estimated:** 3 hours

**Description:**
Build the first step of CSV import wizard: file upload interface.

**Acceptance Criteria:**
- [ ] CSV import button on Transactions page opens multi-step wizard
- [ ] Step 1: File upload with drag-and-drop support
- [ ] File input accepts .csv files only
- [ ] Displays selected file name and size
- [ ] File size validation (max 10MB)
- [ ] Error message if file too large or wrong type
- [ ] "Next" button disabled until file selected
- [ ] "Cancel" button closes wizard
- [ ] Progress indicator shows step 1 of 4

**Implementation Notes:**
- Use MUI Dialog component
- Use react-dropzone for drag-and-drop
- Style upload area to be visually appealing
- Responsive design for mobile

**Testing:**
- Test file selection via button
- Test drag-and-drop
- Test file validation
- Test on mobile devices

**Dependencies:**
- Story 5.9
- Epic 4: Frontend transaction components

---

### Story 5.11: Create Frontend Column Mapping UI
**Story ID:** STORY-05-11
**Priority:** P0
**Estimated:** 5 hours

**Description:**
Build the column mapping step of CSV import wizard with preview and dropdowns.

**Acceptance Criteria:**
- [ ] Step 2: Column mapping interface
- [ ] CSV preview showing first 10 rows in table
- [ ] Headers detected and displayed
- [ ] Dropdown for each required field (Date, Amount, Merchant) to select CSV column
- [ ] Dropdowns for optional fields (Account, Category, Notes)
- [ ] Date format selector dropdown (MM/DD/YYYY, DD/MM/YYYY, YYYY-MM-DD, DD-MM-YYYY)
- [ ] Amount format option: Normal or Inverted (for some banks)
- [ ] Option for separate debit/credit columns
- [ ] Validation: required fields must be mapped
- [ ] Preview updates to highlight mapped columns
- [ ] "Back" button returns to file upload
- [ ] "Next" button validates and proceeds

**Implementation Notes:**
- Parse CSV on frontend using PapaParse
- Store parsed data in component state
- Highlight mapped columns in preview table
- Use MUI Select components for dropdowns

**Testing:**
- Test column mapping with various CSV formats
- Test validation
- Test preview highlighting
- Test responsive layout

**Dependencies:**
- Story 5.10

---

### Story 5.12: Implement CSV Template Dropdown and Management
**Story ID:** STORY-05-12
**Priority:** P0
**Estimated:** 3 hours

**Description:**
Allow users to select saved templates in import wizard and manage templates.

**Acceptance Criteria:**
- [ ] Step 1 includes "Use saved template" dropdown
- [ ] Dropdown populated from GET /api/transactions/import-templates
- [ ] Selecting template auto-fills column mappings in Step 2
- [ ] Template includes date format and skip rows
- [ ] User can modify template selections (doesn't update saved template)
- [ ] Option to "Save as new template" after mapping
- [ ] Option to "Update existing template" if loaded from template
- [ ] Settings page shows "Saved Import Templates" section
- [ ] Templates list with name and "Delete" button
- [ ] Delete confirmation dialog

**Implementation Notes:**
- Fetch templates on wizard mount
- Store selected template in wizard state
- Create TemplateManager component for settings page

**Testing:**
- Test template selection and auto-fill
- Test save new template
- Test update existing template
- Test template deletion

**Dependencies:**
- Story 5.11

---

### Story 5.13: Display Import Progress and Results
**Story ID:** STORY-05-13
**Priority:** P0
**Estimated:** 3 hours

**Description:**
Show user the import progress and results with success/error details.

**Acceptance Criteria:**
- [ ] Step 3: Account details input (account name, currency readonly)
- [ ] Step 4: Review summary (file name, rows, account, mappings)
- [ ] "Import" button triggers upload with loading state
- [ ] Progress indicator during upload (spinner or progress bar)
- [ ] Success screen showing: "Imported X of Y transactions"
- [ ] Error details section (expandable) showing failed rows
- [ ] Download failed rows as CSV option
- [ ] "View Transactions" button navigates to transaction list filtered by ImportBatchId
- [ ] "Import Another File" button restarts wizard
- [ ] Toast notification on successful import

**Implementation Notes:**
- Use axios for file upload with progress tracking
- Parse import response for success/error details
- Create FailedRowsTable component
- Generate CSV from failed rows for download

**Testing:**
- Test successful import flow
- Test import with errors
- Test progress indicator
- Test failed rows display and download

**Dependencies:**
- Story 5.12

---

### Story 5.14: Add Sample CSV Files for Testing (Chase, BofA, Wells Fargo Formats)
**Story ID:** STORY-05-14
**Priority:** P2
**Estimated:** 2 hours

**Description:**
Create realistic sample CSV files for popular banks to help users test import functionality.

**Acceptance Criteria:**
- [ ] Sample CSV for Chase bank format
- [ ] Sample CSV for Bank of America format
- [ ] Sample CSV for Wells Fargo format
- [ ] Sample CSV for ING bank format
- [ ] Sample CSV for Revolut format
- [ ] Each file has 20-50 sample transactions
- [ ] Sample files available for download from app (Help section)
- [ ] Sample files documented with column descriptions
- [ ] Sample data anonymized (no real personal information)

**Implementation Notes:**
- Store sample files in public/samples/ directory
- Create SampleFilesPage component
- Document format differences between banks
- Add instructions for each bank format

**Testing:**
- Import each sample file successfully
- Verify templates work for each bank
- Document any format quirks

**Dependencies:**
- Story 5.13

---

## Epic Acceptance Criteria

- ✅ System handles CSV files with 1000+ rows efficiently
- ✅ Users can map CSV columns to transaction fields flexibly
- ✅ Templates saved and reusable for same bank
- ✅ Import errors displayed with row numbers
- ✅ Bulk insert completes in <5 seconds for 1000 rows
- ✅ Various bank CSV formats supported (different headers, date formats)
- ✅ Frontend CSV import workflow intuitive and responsive
- ✅ Sample CSV files import successfully
- ✅ Integration tests pass for end-to-end import flow
- ✅ Events published after bulk import

---

## Dependencies

**Blocks:**
- None (extends Epic 4 functionality)

**Depends On:**
- Epic 4: Transaction Service CRUD
- Epic 1: RabbitMQ for event publishing

**Enables:**
- Multi-account visibility (primary value proposition)
- Reduces manual data entry burden significantly

---

## Notes

- CSV import is critical for user adoption - invest in polish and error handling
- Consider adding import history/audit log (future enhancement)
- Future: Add support for OFX/QFX formats (Quicken/QuickBooks)
- Future: Add scheduled imports from cloud storage (Dropbox/Google Drive)
- Future: Direct bank API integration (Phase 2 with Plaid)
- Document common bank formats in user guide
- Test with real user CSV files during beta

---

**Created:** 2025-01-05
**Last Updated:** 2025-01-05
