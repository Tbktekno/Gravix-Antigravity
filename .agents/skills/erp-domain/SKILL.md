# SKILL: ERP Domain

## Purpose
Provides specialized architecture guidance, module patterns, and domain knowledge
for Enterprise Resource Planning (ERP) systems. Handles HR, Payroll, Inventory,
Finance, Procurement, and Sales domains with strong relational data modeling.

---

## When To Use
- When `global-system-core` detects an ERP system type.
- When the user requests an ERP-specific module.
- When validating ERP business rules in generated code.

---

## Domain Modules

| Domain | Core Entities | Key Business Rules |
| :--- | :--- | :--- |
| **HR** | Employee, Department, Position, Contract | Employee must belong to a Department |
| **Payroll** | PayrollRun, PaySlip, Allowance, Deduction | PaySlip requires a completed PayrollRun |
| **Inventory** | Item, Warehouse, Stock, StockMovement | Stock cannot go negative |
| **Finance** | ChartOfAccount, JournalEntry, Transaction | Double-entry bookkeeping required |
| **Procurement** | Supplier, PurchaseRequest, PurchaseOrder, GoodsReceipt | PO requires an approved PR |
| **Sales** | Customer, SalesOrder, Invoice, Shipment | Invoice requires a confirmed SalesOrder |

---

## Architecture Requirements

### Backend
- **Architecture**: Clean Architecture — mandatory.
- **Protocol**: gRPC for inter-service + Express API Gateway.
- **Database**: Relational (SQLite for dev, PostgreSQL for production).
- **Relationships**: Use foreign keys in SQL; validate in service layer.

### Frontend
- **Navigation**: Tab-based UI within each domain (not full-page navigate).
- **Layout**: Main sidebar with domain icons; content area shows tab panels.
- **State**: Module-level state via custom hooks; no cross-module state bleeding.

---

## Execution Steps

### Step 1 — Identify Domain
Determine which ERP domain the request falls under (HR, Payroll, Inventory, etc.).

### Step 2 — Load Domain Rules
Apply the correct domain rules:

**HR Rules:**
- Every employee must have: name, employee_id, department_id, position, hire_date, status.
- Status values: `active`, `inactive`, `on_leave`, `terminated`.
- Department is a required foreign key — validate before create.

**Payroll Rules:**
- Payroll run must be `locked` before generating pay slips.
- Net pay = Base + Allowances - Deductions.
- Prevent duplicate payroll run for same period.

**Inventory Rules:**
- Stock quantity MUST be validated before stock-out movements.
- Every movement (in/out) must record: item_id, warehouse_id, quantity, type, reference, date.
- Types: `purchase`, `sale`, `transfer`, `adjustment`.

**Finance Rules:**
- Every transaction must have balanced debit/credit entries.
- Account types: `asset`, `liability`, `equity`, `revenue`, `expense`.
- Never delete posted journal entries — allow reversal only.

**Procurement Rules:**
- PR status flow: `draft` → `pending_approval` → `approved` → `converted_to_po`.
- PO status flow: `draft` → `confirmed` → `partially_received` → `fully_received` → `closed`.

**Sales Rules:**
- SO status flow: `draft` → `confirmed` → `partially_delivered` → `fully_delivered` → `closed`.
- Invoice status: `unpaid` → `partially_paid` → `paid` → `overdue`.

### Step 3 — Generate Module
Delegate to `fullstack-module-generator` with domain-specific entity fields and validation rules.

### Step 4 — Validate Relational Integrity
Before finalizing backend:
- Confirm all foreign key references exist in related tables.
- Confirm status transition logic is in the service layer.
- Confirm business rule validation is NOT in the controller.

### Step 5 — Validate UI
- Confirm module has tab-based navigation within its domain page.
- Confirm create/edit modals handle required relational fields (e.g., department dropdown).

---

## Tab-Based UI Pattern

For each ERP domain, the UI must follow this pattern:

```tsx
// Example: Sales domain with tabs
const SalesDashboard = () => {
  const [activeTab, setActiveTab] = useState('orders');
  return (
    <div className="module-dashboard">
      <div className="tab-bar">
        <button data-tab="orders"    className={activeTab==='orders'    ? 'tab active' : 'tab'} onClick={() => setActiveTab('orders')}>Sales Orders</button>
        <button data-tab="invoices"  className={activeTab==='invoices'  ? 'tab active' : 'tab'} onClick={() => setActiveTab('invoices')}>Invoices</button>
        <button data-tab="shipments" className={activeTab==='shipments' ? 'tab active' : 'tab'} onClick={() => setActiveTab('shipments')}>Shipments</button>
      </div>
      <div className="tab-content">
        {activeTab === 'orders'    && <SalesOrdersTab />}
        {activeTab === 'invoices'  && <InvoicesTab />}
        {activeTab === 'shipments' && <ShipmentsTab />}
      </div>
    </div>
  );
};
```

---

## Rules

1. **Domain rules are non-negotiable** — Business logic (status flow, relational integrity) must be enforced.
2. **Tab-based UI is mandatory** — Do not use separate pages for sub-entities of a domain.
3. **Service layer owns validation** — Controllers only route; services validate.
4. **Double-entry for Finance** — Every financial transaction must be balanced.
5. **Stock cannot go negative** — Validate at repository level before committing.

---

## Anti-Patterns

- ❌ Putting payroll calculation logic in the controller.
- ❌ Allowing stock to go negative without throwing an error.
- ❌ Skipping status transition validation (e.g., going directly from `draft` to `closed`).
- ❌ Using separate page navigation for sub-entities instead of tab panels.
- ❌ Allowing unbalanced journal entries to be posted.
