# CommerceHub Technical Architecture

**Document status:** Proposed baseline

**Sprint:** Sprint 1

**Increment:** 1 - Technical Architecture and Design

## 1. Project Overview

CommerceHub is a multi-tenant e-commerce and inventory management SaaS platform.

The platform provides customer shopping functionality and business administration capabilities for products, inventory, suppliers, customers, orders, payments and reporting.

The initial architecture is a modular monolith with a separately maintained React frontend and Laravel backend.

## 2. Technology Stack

| Component | Technology |
|---|---|
| Backend framework | Laravel 13 |
| Backend runtime | PHP 8.5 |
| Dependency management | Composer 2 |
| Frontend framework | React 19 |
| Frontend language | TypeScript |
| Frontend build tool | Vite |
| Database | PostgreSQL 18 |
| Authentication | Laravel Sanctum |
| CSS framework | Tailwind CSS |
| Backend testing | Pest |
| Frontend testing | Vitest |
| Infrastructure | Docker and Docker Compose |
| Version control | Git |

Exact package versions must be resolved and locked during application scaffolding.

## 3. Architectural Style

The application will use a modular monolithic architecture.

The backend and frontend will be separate applications:

- Laravel owns business logic, authorization, validation and persistence.
- React owns presentation, navigation and client-side interaction.
- PostgreSQL owns persistent relational data.
- Communication occurs through a versioned REST API.

Microservices are explicitly out of scope for the initial implementation.

## 4. Backend Responsibilities

Laravel is responsible for:

- Authentication and authorization.
- Business and tenant management.
- Product catalogue management.
- Inventory management.
- Supplier and procurement workflows.
- Customer management.
- Shopping cart and checkout.
- Order processing.
- Payment verification and refund workflows.
- Reporting and audit logging.
- Database transactions and business integrity.

Proposed backend structure:

backend/
  app/
    Actions/
    Enums/
    Exceptions/
    Http/
      Controllers/Api/V1/
      Middleware/
      Requests/
      Resources/
    Models/
    Policies/
    Services/
  database/
    factories/
    migrations/
    seeders/
  routes/
  tests/

This is an initial organizational proposal, not a requirement to create every directory immediately.

## 5. Frontend Responsibilities

React is responsible for:

- Customer storefront.
- Customer registration and account experience.
- Shopping cart and checkout interface.
- Business dashboards.
- Product and inventory management interfaces.
- Supplier and procurement interfaces.
- Customer and order management.
- Reporting interfaces.
- Form validation and user feedback.
- API communication.

Proposed frontend structure:

frontend/
  src/
    app/
    components/
    features/
      auth/
      products/
      inventory/
      orders/
      customers/
      dashboard/
    hooks/
    layouts/
    lib/
    services/
    types/

Feature modules should own their specific components, types and API interactions where practical.

## 6. API Design

All application endpoints will use the version prefix:

/api/v1

Initial endpoint examples:

POST   /api/v1/auth/login
POST   /api/v1/auth/logout
GET    /api/v1/auth/user

GET    /api/v1/products
POST   /api/v1/products
GET    /api/v1/inventory
POST   /api/v1/inventory/adjustments

GET    /api/v1/orders
POST   /api/v1/orders

GET    /api/v1/dashboard/summary

API conventions:

- Use appropriate HTTP methods and status codes.
- Validate input through dedicated request classes.
- Use API resources for response serialization.
- Apply authorization policies.
- Use consistent error responses.
- Support pagination and filtering.
- Avoid exposing internal database implementation details.
- Document endpoints using OpenAPI.

## 7. Authentication and Authorization

Laravel Sanctum will provide authentication.

For the browser-based React application, use stateful cookie authentication with CSRF protection.

Authentication and authorization are separate concerns.

Initial roles:

- Super Admin
- Business Owner
- Inventory Manager
- Sales Officer
- Customer

Super Admin is a platform-level role. Business Owner, Inventory Manager and Sales Officer permissions are assigned through business-specific memberships. A user may hold different roles in different businesses. Only an active, authorized membership grants access to business resources. Pending, suspended or revoked memberships must not authorize access.

Administrative permissions must be explicitly enforced by backend policies.

Long-lived authentication tokens must not be stored in browser local storage.

## 8. Multi-Tenant Data Isolation

CommerceHub will initially use a shared database and shared schema.

Business-owned records must be associated with a business identifier.

Tenant isolation requirements:

1. Establish the active business context from an authenticated user's active and authorized membership.
2. Validate membership whenever a user selects or switches their active business.
3. Scope business data queries to the active business.
4. Enforce authorization through policies and service-layer checks.
5. Never trust a client-supplied business identifier as authorization.
6. Prevent cross-business record access by default.
7. Require explicit platform-level permission and audit all privileged cross-business access.

Database constraints and indexes must support tenant isolation.

## 9. Database Design Principles

The database will use PostgreSQL.

Initial logical entities include:

- users
- roles
- permissions
- businesses
- business_memberships (supports multiple businesses per user; each record links one user to one business and stores the business-specific role, membership status, invitation/acceptance state, creation time and revocation time; enforce a unique constraint on business_id and user_id)
- business_settings
- products
- categories
- brands
- product_variants
- warehouses
- inventory_balances
- inventory_reservations
- stock_movements
- suppliers
- purchase_orders
- purchase_order_items
- customers
- carts
- cart_items
- orders
- order_items
- order_status_history
- payments
- refunds
- audit_logs

This list is conceptual. The final schema will be designed and reviewed before migrations are created.

Database rules:

- Use appropriate foreign keys and unique constraints.
- Use NUMERIC/DECIMAL for monetary values.
- Preserve order item product and price snapshots.
- Keep stock movement history immutable.
- Use transactions for multi-step business operations.
- Use row-level locking where necessary for concurrent inventory operations.
- Index frequently queried tenant and relationship columns.

## 10. Inventory and Order Integrity

The following rules are mandatory:

- Inventory must never become negative.
- Stock adjustments require a reason and authenticated actor.
- Stock movement records must preserve history.
- Order creation and inventory reservation must be atomic.
- Concurrent checkout operations must not oversell stock.
- Cancellation must release eligible reservations.
- Inventory reservations must have an explicit status and lifecycle.
- Reservations must have an expiry policy to prevent abandoned checkouts from holding stock indefinitely.
- Reservation creation, confirmation, expiry and release must be handled transactionally.
- Every reservation and release must be traceable to its associated order.
- Order item descriptions, SKUs and prices must be preserved as snapshots.

## 11. Payment Security

Initial payment integration will use sandbox environments.

Requirements:

- Never store raw card numbers or CVV values.
- Verify payment results on the backend.
- Do not trust frontend payment success messages.

- Make payment processing idempotent using unique identifiers for payment requests and provider events, enforced through appropriate uniqueness constraints.
- Duplicate callbacks or webhook deliveries must not create duplicate payments, refunds or order transitions.
- Validate provider callback signatures and timestamps, and apply replay protection using provider event identifiers. Previously processed valid events must be safely acknowledged or ignored without repeating their business effects.
- Audit payment and refund operations.

## 12. Testing Strategy

Backend:
- Unit tests for business rules.
- Feature tests for API endpoints.
- Authorization and tenant isolation tests.
- Database transaction and inventory concurrency tests.

Frontend:
- Component tests.
- Feature interaction tests.
- API integration tests where appropriate.

Critical business rules must have automated tests before production release.

## 13. Infrastructure

Docker Compose will manage local development services.

The React/Vite development server may initially run using the local Node.js environment. Frontend containerization can be introduced when required.

Initial services:
- PHP/Laravel application runtime.
- PostgreSQL database.

Additional services such as Redis, queue workers and a web server will be introduced when required.

Environment secrets must remain in local environment files and must never be committed.

## 14. Non-Functional Requirements

- Secure authentication and authorization.
- Strict tenant data isolation.
- Consistent API contracts.
- Reliable database transactions.
- Maintainable modular code.
- Automated testing.
- Structured logging.
- Auditability of sensitive operations.
- Responsive frontend interfaces.
- Reproducible development environment.

## 15. Out of Scope for Initial Foundation

- Microservices.
- Kubernetes.
- Production payment processing.
- Advanced distributed caching.
- Event-driven distributed architecture.
- Premature performance optimization.

## 16. Architecture Decisions

| ID | Decision | Status |
|---|---|---|
| ADR-001 | Modular monolithic Laravel backend | Accepted |
| ADR-002 | Separate React frontend | Accepted |
| ADR-003 | PostgreSQL shared database | Accepted |
| ADR-004 | Versioned REST API | Accepted |
| ADR-005 | Laravel Sanctum authentication | Accepted |
| ADR-006 | Shared-schema multi-tenancy | Accepted |
| ADR-007 | Docker-based development environment | Accepted |
| ADR-008 | Sandbox payment integration initially | Accepted |

## 17. Acceptance Criteria

Increment 1 is complete when:

- The architecture document exists in the repository.
- Backend and frontend responsibilities are defined.
- Technology choices and boundaries are documented.
- API conventions are established.
- Tenant isolation requirements are documented.
- Database and inventory integrity rules are documented.
- Authentication and payment security approaches are documented.
- The architecture has been reviewed before application scaffolding.
