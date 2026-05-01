# SKILL: SaaS Domain

## Purpose
Provides specialized architecture guidance and module patterns for Software-as-a-Service (SaaS)
applications. Handles multi-tenancy, authentication, authorization, subscriptions, billing,
and tenant isolation as first-class concerns.

---

## When To Use
- When `global-system-core` detects a SaaS system type.
- When multi-tenancy, auth, or subscription features are being built.
- When validating tenant isolation in generated code.

---

## Domain Modules

| Domain | Core Entities | Key Business Rules |
| :--- | :--- | :--- |
| **Auth** | User, Session, RefreshToken, PasswordReset | JWT with refresh rotation |
| **Tenant** | Tenant, TenantMember, TenantInvitation | Users belong to one or more tenants |
| **Subscription** | Plan, Subscription, SubscriptionItem | One active subscription per tenant |
| **Billing** | Invoice, Payment, PaymentMethod | Payment must match subscription amount |
| **Team** | Member, Role, Permission | Role-based access within tenant |
| **Audit** | AuditLog | Every state change must be logged |

---

## Architecture Requirements

### Backend
- **Architecture**: Clean Architecture — mandatory.
- **Protocol**: REST/Express (or gRPC + Express gateway if microservices).
- **Database**: PostgreSQL recommended for multi-tenant (schema isolation or row-level security).
- **Multi-tenancy Strategy**: Row-level isolation using `tenant_id` foreign key on all tenant-scoped tables.

### Frontend
- **Navigation**: Sidebar-based with top-level sections (Dashboard, Settings, Billing, Team).
- **Auth Flow**: Login → JWT stored in memory (not localStorage); refresh via HTTP-only cookie.
- **Tenant Context**: Active tenant stored in context, passed to all API calls via header.

---

## Execution Steps

### Step 1 — Identify SaaS Concern
Determine the specific SaaS concern:
- Auth & Identity
- Multi-tenancy
- Subscription & Billing
- Team & Role Management

### Step 2 — Apply Multi-Tenancy Rules

**Tenant Isolation (Row-Level):**
- Every API request must extract `tenant_id` from the JWT payload.
- Every database query on tenant-scoped data must include `WHERE tenant_id = ?`.
- Repository layer must ALWAYS receive and apply `tenant_id`.
- Never allow cross-tenant data access.

**Middleware Pattern:**
```typescript
// api-gateway/middleware/tenant.middleware.ts
export const tenantMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    req.tenantId = payload.tenantId;
    req.userId   = payload.userId;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};
```

### Step 3 — Apply Auth Rules

**JWT Strategy:**
- Access token: short-lived (15 min), stored in memory.
- Refresh token: long-lived (7 days), stored in HTTP-only cookie.
- On refresh: issue new access + rotate refresh token.
- On logout: invalidate refresh token in DB.

**Password Rules:**
- Minimum 8 characters.
- Bcrypt with cost factor ≥ 12.
- Never store plaintext passwords.
- Provide password reset via time-limited token (1 hour expiry).

### Step 4 — Apply Subscription Rules

**Subscription Status Flow:**
`trial` → `active` → `past_due` → `cancelled` | `paused`

**Plan Enforcement:**
- Every feature must check subscription plan limits before proceeding.
- Exceeded limits return `402 Payment Required` with a clear message.
- Downgrade must be graceful — data retained, features locked.

### Step 5 — Generate Module
Delegate to `fullstack-module-generator` with:
- `tenant_id` field added to all tenant-scoped entities.
- Auth middleware applied to all protected routes.
- Subscription guard applied to plan-limited routes.

---

## API Response Conventions

```typescript
// Success
{ data: T, meta?: { page, limit, total } }

// Error
{ error: string, code: string, details?: any }

// Common codes
// AUTH_REQUIRED     — missing or expired token
// FORBIDDEN         — insufficient role/permission
// PLAN_LIMIT        — subscription plan limit reached
// TENANT_NOT_FOUND  — tenant does not exist
// RESOURCE_NOT_FOUND — entity not found
```

---

## Rules

1. **Tenant ID on every query** — No tenant-scoped query without `WHERE tenant_id = ?`.
2. **Auth middleware on every protected route** — Never expose protected data without token verification.
3. **Refresh token rotation** — Invalidate old refresh token on every rotation.
4. **Plan enforcement** — Every premium feature must check subscription status.
5. **Audit all state changes** — Append to AuditLog for any critical action.
6. **Never return another tenant's data** — Treat cross-tenant access as a critical security failure.

---

## Anti-Patterns

- ❌ Storing JWT access token in localStorage (XSS risk).
- ❌ Querying without `tenant_id` filter on tenant-scoped tables.
- ❌ Allowing plan-limited features without subscription check.
- ❌ Returning stale refresh token (no rotation).
- ❌ Storing plaintext passwords.
- ❌ Skipping audit logs for destructive operations (delete, deactivate).
