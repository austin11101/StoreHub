# CommerceHub API Standards

| Document Information | Details |
|---|---|
| Project | CommerceHub |
| Document ID | CH-API-STD-001 |
| Version | 1.0 |
| Status | Approved |
| Date | 10 November 2026 |
| Related Document | CommerceHub Technical Architecture |

## 1. Purpose

This document establishes the API design and implementation conventions for CommerceHub.

All backend endpoints must follow these standards unless an explicitly documented exception is approved.

These conventions apply to the Laravel REST API and its React clients, as well as future external integrations.

## 2. API Architecture

- Style: RESTful HTTP API.
- Backend: Laravel.
- API format: JSON.
- Current API version: v1.
- Base path: `/api/v1`.
- API documentation: OpenAPI.
- Authentication: Laravel Sanctum.
- Business logic and authorization remain backend responsibilities.

All application endpoints must be versioned.

Infrastructure health endpoints may use their existing specialized response formats.

## 3. URL Conventions

Use lowercase, plural resource names.

Examples:

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/v1/products` | List products |
| GET | `/api/v1/products/{product}` | Retrieve product |
| POST | `/api/v1/products` | Create product |
| PUT | `/api/v1/products/{product}` | Replace product |
| PATCH | `/api/v1/products/{product}` | Partially update product |
| DELETE | `/api/v1/products/{product}` | Delete product |
| GET | `/api/v1/orders` | List orders |
| GET | `/api/v1/orders/{order}` | Retrieve order |

Additional conventions:

- Use nouns rather than action names in resource URLs.
- Use hyphens for multiword URL segments.
- Avoid exposing database table names.
- Avoid deeply nested resource paths; normally limit nesting to one relationship level.
- Use dedicated action endpoints only where a business operation cannot be represented appropriately through standard resource methods.

Examples of business operations:

- `POST /api/v1/inventory/adjustments`
- `POST /api/v1/orders/{order}/cancellations`

## 4. HTTP Methods

| Method | Intended use |
|---|---|
| GET | Retrieve resources without changing state |
| POST | Create resources or execute defined operations |
| PUT | Replace an existing resource |
| PATCH | Partially update a resource |
| DELETE | Delete or deactivate a resource where permitted |

GET requests must not cause business state changes.

Operations involving inventory, payments and orders must use transactional backend operations.

## 5. Request Standards

All JSON request bodies must use:

`Content-Type: application/json`

Clients should send:

`Accept: application/json`

Additional conventions:

- Validate input through dedicated Laravel Form Request classes.
- Reject invalid or unsupported input.
- Never trust client-supplied ownership, role or authorization information.
- Validate resource identifiers and business context.
- Apply appropriate authorization before performing operations.
- Use explicit validation rules for dates, quantities, monetary values and identifiers.

## 6. Success Response Format

Successful resource responses should use a consistent `data` envelope.

Example:

```json
{
  "data": {
    "id": "resource-identifier",
    "name": "Example product",
    "sku": "PROD-001"
  }
}
```

Collection responses should also use the `data` property.

Additional top-level properties may include:

- `meta`: pagination or supplementary metadata.
- `links`: navigation links.

Do not expose internal database implementation details.

The existing infrastructure health endpoints are exempt from this envelope.

## 7. Error Response Format

Application API errors must use a consistent structure.

Example:

```json
{
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "The supplied information is invalid.",
    "details": {
      "sku": [
        "The SKU has already been taken."
      ]
    },
    "request_id": "request-identifier"
  }
}
```

Rules:

- `code` must be machine-readable and stable.
- `message` must be safe for client display.
- `details` is optional and provides field-level or relevant error information.
- `request_id` supports troubleshooting and log correlation.
- Laravel validation exceptions must be normalized into this documented error structure rather than exposing framework-default response formats.
- Never expose stack traces, SQL queries, credentials or internal exception details.

## 8. HTTP Status Codes

| Status | Meaning | Example |
|---|---|---|
| 200 | OK | Successful retrieval or update |
| 201 | Created | Resource created |
| 202 | Accepted | Operation accepted for asynchronous processing |
| 204 | No Content | Successful deletion without response body |
| 400 | Bad Request | Malformed request |
| 401 | Unauthorized | Missing or invalid authentication |
| 403 | Forbidden | Authenticated user lacks permission |
| 404 | Not Found | Resource unavailable or not visible |
| 409 | Conflict | State conflict or duplicate operation |
| 422 | Unprocessable Content | Validation failure |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Unexpected server failure |
| 503 | Service Unavailable | Required service unavailable |

Do not use HTTP 200 to represent failed operations.

## 9. Pagination

Collection endpoints returning potentially large datasets must support pagination.

Use page-based pagination initially.

Query parameters:

- `page`: requested page number.
- `per_page`: number of records per page.

Default page size: 20.

Maximum page size: 100.

Example:

`GET /api/v1/products?page=2&per_page=20`

Paginated responses should expose:

- Current page.
- Per-page limit.
- Total records.
- Last page.
- Next and previous navigation links where applicable.

Use Laravel pagination through API Resources rather than implementing inconsistent pagination manually.

Cursor pagination may be introduced for datasets where offset pagination becomes unsuitable.

## 10. Filtering, Searching and Sorting

Collection endpoints may support documented query parameters.

Examples:

`GET /api/v1/products?filter[status]=active`

`GET /api/v1/products?search=keyboard`

`GET /api/v1/products?sort=-created_at`

Conventions:

- Use `filter[field]` for field-specific filters.
- Use `search` for supported text searches.
- Use `sort` for sorting.
- Prefix descending sort fields with `-`.
- Allowlist filterable and sortable fields.
- Reject or safely ignore unsupported query parameters according to the endpoint contract.
- Never expose unrestricted database query construction to clients.

## 11. Date and Time Standards

- Use ISO 8601 date and timestamp formats.
- Store application timestamps in UTC.
- Return timestamps with an explicit UTC indicator (`Z`) or offset.
- Use `YYYY-MM-DD` for date-only values.
- Convert timestamps to the user's preferred timezone in the frontend.
- Do not treat date-only values as UTC timestamps.

Example timestamp:

`2026-11-10T10:30:00Z`

## 12. Monetary and Numeric Values

- Store monetary values using PostgreSQL NUMERIC/DECIMAL types.
- Never use floating-point values for financial calculations.
- Represent monetary amounts in JSON as decimal strings.
- Include the applicable ISO 4217 currency code.
- Define currency precision explicitly.

Example:

```json
{
  "amount": "1250.50",
  "currency": "ZAR"
}
```

Quantities and stock levels must use appropriate numeric types and business validation.

## 13. Authentication and Security

The API must follow the approved CommerceHub authentication architecture.

- Use Laravel Sanctum.
- Browser authentication uses stateful session cookies and CSRF protection.
- Do not store long-lived authentication tokens in browser localStorage.
- Protect private endpoints with authentication middleware.
- Apply authorization policies to protected operations.
- Deny access by default.
- Apply rate limits to sensitive and resource-intensive endpoints.
- Never expose passwords, authentication secrets or payment credentials.

## 14. Multi-Tenant Authorization

Business data must always be scoped to an authorized business membership.

- Resolve the active business context on the backend.
- Validate that the authenticated user has an active membership.
- Apply tenant scoping to database queries.
- Enforce permissions through policies and service-layer checks.
- Never treat a client-supplied `business_id` as proof of authorization.
- Prevent cross-business record access by default.
- Return HTTP 404 for resources outside the user's authorized business context to prevent resource enumeration.
- Audit privileged platform-level access.

Tenant isolation applies to reads, writes, exports and background operations.

## 15. Inventory, Orders and Payment Integrity

The following operations require appropriate transaction and concurrency controls:

- Inventory adjustments.
- Stock reservations and releases.
- Order creation and cancellation.
- Payment confirmation.
- Refund processing.

Additional requirements:

- Prevent negative stock.
- Preserve immutable stock movement records.
- Make payment operations idempotent.
- Validate payment provider callbacks on the backend.
- Prevent duplicate payment and order transitions.
- Use the `Idempotency-Key` HTTP request header for supported operations where retries could create duplicate business effects.
- Store and validate idempotency keys on the backend to prevent duplicate business operations.

## 16. API Versioning and Compatibility

The URL path determines the API version.

Example:

`/api/v1/products`

Rules:

- Backward-compatible changes should remain within the current version.
- Breaking contract changes require a new API version.
- Do not silently change the meaning of existing fields.
- Document deprecated endpoints and provide a migration period.
- Maintain compatibility with supported frontend clients.

## 17. API Documentation

OpenAPI must be used to document the API.

Each endpoint specification should include:

- HTTP method and URL.
- Purpose and description.
- Authentication requirements.
- Required permissions.
- Path and query parameters.
- Request body schema.
- Successful response schemas.
- Possible error responses.
- Pagination and filtering behaviour.
- Relevant business rules.

Documentation must be updated alongside endpoint changes.

## 18. Testing Requirements

API endpoints must have appropriate automated tests covering:

- Successful requests.
- Validation failures.
- Authentication and authorization.
- Missing and inaccessible resources.
- Tenant isolation.
- Database failures where relevant.
- Pagination, filtering and sorting.
- Transaction and concurrency behaviour.
- Idempotency for supported operations.

Critical business rules must have automated tests before release.

## 19. Implementation Status

This document defines the proposed API contract.

The following are already implemented:

- `/api/v1` route prefix.
- JSON liveness endpoint.
- JSON readiness endpoint.
- Database availability check.
- JSON rendering for API exceptions.
- Frontend API client with JSON requests and browser credentials.

The remaining conventions must be implemented and verified as the corresponding application features are developed.

## 20. Approval

| Role | Name | Status |
|---|---|---|
| Project Owner | Project owner | Approved |
| Technical Architecture | CommerceHub architecture | Approved |

