# CommerceHub Identity and Authentication Requirements

| Document Information | Details |
|---|---|
| Project | CommerceHub |
| Document ID | CH-IA-REQ-001 |
| Version | 1.0 |
| Status | Approved |
| Date | 10 November 2026 |
| Sprint | Sprint 2 - Identity and Authentication |
| Related Documents | Technical Architecture; API Standards |

## 1. Purpose

This document defines the functional and non-functional requirements for user identity, authentication, authorization and account security within CommerceHub.

The objective is to establish a secure identity foundation before implementing business functionality.

## 2. Scope

### In scope

- User account registration.
- Email verification.
- User login and logout.
- Session management.
- Password management and recovery.
- Role-based access control.
- Business membership authorization.
- Account status management.
- Security controls and audit logging.

### Out of scope

- Broader business profile and operational onboarding workflows; identity-related creation of a business and its initial Business Owner membership is in scope.
- Product and inventory permissions implementation.
- Payment provider authentication.
- External identity providers and social login.
- Enterprise single sign-on.

These may be considered in later increments.

## 3. User Roles

CommerceHub recognizes the following platform and application roles:

| Role | Description |
|---|---|
| Super Admin | Platform-level administration |
| Business Owner | Manages an authorized business |
| Inventory Manager | Performs authorized inventory operations |
| Sales Officer | Performs authorized sales and order operations |
| Auditor | Reviews authorized business records, reports and audit trails without modifying business data |
| Customer | Uses the customer-facing storefront |

Roles do not automatically grant access to every operation. Permissions must be explicitly defined and enforced by the backend.

## 4. Functional Requirements

### 4.1 User Registration

| ID | Requirement | Priority |
|---|---|---|
| IA-FR-001 | The system shall support public self-registration for Customers and Business Owners, invitation-only registration for Inventory Managers, Sales Officers and Auditors, and controlled provisioning for Super Admins. | Must |
| IA-FR-002 | The system shall validate email addresses and prevent duplicate accounts using the defined identity rules. | Must |
| IA-FR-003 | The system shall securely hash passwords before storage. | Must |
| IA-FR-004 | The system shall require email verification before granting access to protected application functionality. Mobile phone verification shall be optional during registration but mandatory before SMS recovery can be used. | Must |
| IA-FR-005 | The system shall prevent public registration from assigning privileged platform roles. | Must |
| IA-FR-006 | The system shall record account creation timestamps and account status. | Must |

### 4.2 Authentication

| ID | Requirement | Priority |
|---|---|---|
| IA-FR-007 | The system shall authenticate users using their registered credentials. | Must |
| IA-FR-008 | The system shall reject invalid credentials without revealing whether an account exists. | Must |
| IA-FR-009 | The system shall prevent unverified or suspended accounts from accessing protected functionality. | Must |
| IA-FR-010 | The system shall provide authenticated logout functionality. | Must |
| IA-FR-011 | The system shall support secure session-based authentication through Laravel Sanctum. | Must |
| IA-FR-012 | The system shall provide the authenticated user's identity and authorized access context to the frontend. | Must |

### 4.3 Session Management

| ID | Requirement | Priority |
|---|---|---|
| IA-FR-013 | The system shall create an authenticated session following successful login. | Must |
| IA-FR-014 | The system shall invalidate the current session following logout. | Must |
| IA-FR-015 | The system shall protect state-changing authenticated requests against CSRF attacks. | Must |
| IA-FR-016 | The system shall enforce configured session expiration and security policies. | Must |
| IA-FR-017 | The system shall prevent unauthorized session access across users. | Must |

### 4.4 Password Management

| ID | Requirement | Priority |
|---|---|---|
| IA-FR-018 | Users shall be able to request password recovery through their registered email address or verified mobile phone number. | Must |
| IA-FR-019 | Password recovery shall use time-limited, single-use reset tokens. | Must |
| IA-FR-020 | The system shall validate new passwords against the approved password policy. | Must |
| IA-FR-021 | The system shall never store or log plaintext passwords. | Must |
| IA-FR-022 | The system shall notify users when their password is changed. | Should |

### 4.5 Roles and Permissions

| ID | Requirement | Priority |
|---|---|---|
| IA-FR-023 | The system shall enforce role-based access control on protected operations. | Must |
| IA-FR-024 | The system shall authorize operations using backend-enforced permissions. | Must |
| IA-FR-025 | The system shall deny access by default when permission is absent or unresolved. | Must |
| IA-FR-026 | The system shall prevent users from granting themselves privileged roles. | Must |
| IA-FR-027 | The system shall distinguish platform-level roles from business-level roles. | Must |
| IA-FR-028 | The system shall validate role assignments against the user's authorized business membership. | Must |

### 4.6 Business Membership and Tenant Access

| ID | Requirement | Priority |
|---|---|---|
| IA-FR-029 | A user shall be able to belong to multiple businesses through separate memberships. | Must |
| IA-FR-030 | Each business membership shall have its own role and status. | Must |
| IA-FR-031 | Only active and authorized memberships shall grant access to business resources. | Must |
| IA-FR-032 | The backend shall validate business context before granting access to business-scoped resources. | Must |
| IA-FR-033 | The system shall prevent users from accessing another business's resources without explicit authorization. | Must |
| IA-FR-034 | Suspended, pending or revoked memberships shall not authorize business access. | Must |
| IA-FR-035 | The system shall validate membership whenever a user switches active business context. | Must |

### 4.7 Account Lifecycle

| ID | Requirement | Priority |
|---|---|---|
| IA-FR-036 | The system shall support active, suspended and disabled account states. | Must |
| IA-FR-037 | The system shall prevent suspended or disabled accounts from authenticating. | Must |
| IA-FR-038 | Authorized administrators shall be able to manage account status. | Must |
| IA-FR-039 | Account status changes shall be recorded for auditing. | Must |

### 4.8 Security and Auditing

| ID | Requirement | Priority |
|---|---|---|
| IA-FR-040 | The system shall apply rate limits to authentication and password recovery endpoints. | Must |
| IA-FR-041 | The system shall protect against brute-force login attempts. | Must |
| IA-FR-042 | The system shall record relevant authentication and account security events. | Must |
| IA-FR-043 | Audit records shall identify the actor, event, timestamp and relevant outcome where applicable. | Must |
| IA-FR-044 | The system shall not expose passwords, session secrets or sensitive authentication tokens in logs or API responses. | Must |
| IA-FR-045 | Privileged platform-level access shall be explicitly authorized and audited. | Must |
| IA-FR-046 | Auditor permissions shall be read-only, restricted to explicitly authorized business data and audit information, and shall prohibit direct or indirect modification of business records. | Must |
| IA-FR-047 | Users shall be able to add a mobile phone number after registration. | Must |
| IA-FR-048 | The system shall verify mobile phone numbers before enabling SMS account recovery. | Must |
| IA-FR-049 | The system shall support account recovery through email and verified mobile phone numbers. | Must |
| IA-FR-050 | SMS recovery shall use single-use OTPs that expire after five minutes. | Must |
| IA-FR-051 | Password recovery shall revoke all active authenticated sessions after a successful reset. | Must |
| IA-FR-052 | Account recovery shall not bypass mandatory MFA requirements. | Must |
| IA-FR-053 | The system shall enforce mandatory MFA for Super Admins, Business Owners and Auditors. | Must |
| IA-FR-054 | The system shall initially support TOTP authenticator applications for MFA. | Must |
| IA-FR-055 | The system shall generate single-use MFA recovery codes, store only securely hashed representations, and invalidate each code after successful use. | Must |
| IA-FR-056 | The system shall require successful MFA completion before issuing a fully authenticated session to MFA-protected accounts. | Must |
| IA-FR-057 | The system shall enforce a 30-minute idle timeout and a 12-hour absolute session lifetime. | Must |
| IA-FR-058 | The system shall permit multiple concurrent device sessions while keeping remember-me functionality disabled initially. | Must |
| IA-FR-059 | The system shall enforce password lengths between 15 and 128 characters, use Argon2id, and reject known compromised passwords without imposing arbitrary complexity rules. | Must |
| IA-FR-060 | The system shall prevent reuse of recent passwords according to the configured password history policy. | Must |
| IA-FR-061 | The system shall rate-limit SMS recovery requests and OTP verification attempts, enforce attempt limits, and accept recovery only for verified phone numbers. | Must |
| IA-FR-062 | Account recovery responses shall not reveal whether an account or phone number exists. | Must |
| IA-FR-063 | A password change shall revoke all other active authenticated sessions. | Must |
| IA-FR-064 | Suspending or disabling an account shall revoke all its active authenticated sessions. | Must |

## 5. Non-Functional Requirements

### 5.1 Security

- Authentication and authorization must be enforced by the backend.
- Browser authentication must use Sanctum stateful sessions and CSRF protection.
- Long-lived authentication tokens must not be stored in browser localStorage.
- Passwords must use Argon2id with the approved 15–128 character policy.
- Common and compromised passwords must be rejected.
- Recent password reuse must be prevented.
- Passwords must not be subject to arbitrary complexity rules.
- Mandatory MFA must be enforced for Super Admins, Business Owners and Auditors.
- TOTP enrollment and recovery codes must be protected against unauthorized access.
- A fully authenticated session must not be issued before required MFA is completed.
- SMS recovery must require a verified phone number.
- SMS OTP requests and verification attempts must be rate-limited and attempt-limited.
- Recovery responses must not disclose account existence.
- Sensitive operations must require appropriate authorization.
- Security failures must not disclose sensitive internal information.

### 5.2 Reliability

- Authentication failures must not leave partially authenticated sessions.
- Session invalidation must take effect when an account is disabled or suspended.
- Password changes must revoke other active sessions.
- Successful password recovery must revoke all active sessions.
- Session idle and absolute expiration policies must be enforced.
- Password reset tokens must be single-use and expire.
- Account and membership status changes must be consistently enforced.

### 5.3 Maintainability

- Authentication logic must be separated from business-domain functionality.
- Authorization policies must be testable independently.
- API contracts must follow the approved CommerceHub API Standards.
- Security-related configuration must be environment-driven.

### 5.4 Testability

Automated tests must cover:

- Registration and duplicate account prevention.
- Email verification.
- Successful and unsuccessful authentication.
- Logout and session invalidation.
- Password recovery and reset token expiry.
- Role and permission enforcement.
- Membership status and business switching.
- Cross-tenant access prevention.
- Account suspension and disabled accounts.
- Rate limiting and security event recording.
- MFA enrollment, verification, enforcement, and recovery-code single-use behaviour, including invalidation after successful use.
- Session idle timeout and absolute lifetime.
- Concurrent sessions and session revocation after password changes.
- Password length, compromised-password rejection and password history.
- SMS OTP expiry, single-use enforcement and attempt limits.
- Recovery responses that prevent account enumeration.

## 6. Architectural Constraints

The implementation must follow the approved technical architecture:

- Laravel 13 backend.
- Laravel Sanctum.
- React frontend.
- PostgreSQL database.
- Versioned REST API under `/api/v1`.
- Shared-schema multi-tenancy.
- Backend-authoritative authorization.
- Business memberships represented separately from user accounts.

## 7. Acceptance Criteria

Sprint 2 identity and authentication functionality will be accepted when:

1. Eligible users can register and verify their email addresses.
2. Verified users can authenticate securely.
3. Logout invalidates the authenticated session.
4. Password recovery works securely.
5. Protected operations enforce backend permissions.
6. Business membership status determines business access.
7. Cross-business access is denied by default.
8. Suspended and disabled accounts cannot authenticate.
9. Security events are auditable.
10. Automated tests verify the required authentication and authorization behaviour.
11. Auditor permissions enforce read-only access.
12. SMS recovery is available only after mobile phone verification.
13. Mandatory MFA cannot be bypassed through account recovery.
14. Super Admins, Business Owners and Auditors must complete TOTP-based MFA before receiving fully authenticated sessions; recovery codes must be single-use.
15. Sessions must expire after 30 minutes of inactivity or 12 hours, whichever occurs first; concurrent device sessions must work and remember-me must remain disabled.
16. Passwords must comply with the 15–128 character policy, Argon2id hashing, compromised-password checks and password history rules, without arbitrary complexity requirements.
17. SMS recovery must require a verified phone number, use single-use OTPs with five-minute expiry, and enforce request and verification attempt limits.
18. Recovery responses must not disclose whether an account or phone number exists.
19. Password changes, password resets and account suspension must enforce the approved session revocation rules.

## 8. Approved Decisions

| ID | Decision | Approved Direction | Status |
|---|---|---|---|
| IA-DEC-001 | Public registration eligibility | Customers and Business Owners may self-register. Inventory Managers, Sales Officers and Auditors are invitation-only. Super Admins are provisioned through a controlled process. | Approved |
| IA-DEC-002 | Business Owner onboarding | Verified Business Owners submit business details. The backend creates the business and initial owner membership. Ownership transfers require authorization and auditing. | Approved |
| IA-DEC-003 | Super Admin provisioning | No public registration. Initial provisioning uses a secure bootstrap process. Additional Super Admins require existing Super Admin authorization. All privileged actions are audited. | Approved |
| IA-DEC-004 | Multi-factor authentication | Mandatory for Super Admins, Business Owners and Auditors; recommended for Inventory Managers; optional for Sales Officers and Customers. TOTP with recovery codes initially. | Approved |
| IA-DEC-005 | Password policy | Minimum 15 characters, maximum 128, Argon2id, compromised-password checks, no arbitrary complexity rules, and no routine forced expiration. | Approved |
| IA-DEC-006 | Session policy | 30-minute idle timeout, 12-hour absolute lifetime, multiple devices permitted, remember me disabled, and session revocation on password reset or account suspension. | Approved |
| IA-DEC-007 | Email verification | Required before protected access. Single-use verification links expire after 60 minutes. Email changes require verification. | Approved |
| IA-DEC-008 | Account recovery | Email and verified-phone SMS recovery. Phone number optional at registration. SMS OTP expires after five minutes. Recovery cannot bypass mandatory MFA. Successful reset revokes all sessions. | Approved |
## 9. Approval

| Role | Name | Status |
|---|---|---|
| Project Owner | Project owner | Approved |
| Technical Architecture | CommerceHub architecture | Approved |
