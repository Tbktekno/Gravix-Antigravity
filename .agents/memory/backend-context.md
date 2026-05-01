# Backend Context

## Architecture Details
- **Pattern**: Clean Architecture (Recommended)
- **Layers**:
  - `Controller`: Entry points (gRPC/REST)
  - `Service`: Business logic
  - `Repository`: Data access
  - `DTO/Model`: Data contracts and entities

## Infrastructure
- **Communication Protocol**: [PENDING] <!-- gRPC | HTTP/JSON -->
- **Authentication**: [PENDING] <!-- JWT | Session | OAuth -->
- **Database Engine**: [PENDING] <!-- SQLite | PostgreSQL -->

## Domain Modules
<!-- Automatically populated by auto-memory-generator -->
| Module Name | Status | Dependencies |
| :--- | :--- | :--- |
| Core | Active | None |

## API Contracts (Protos/Specs)
- [Pending scan of /protos or /docs]
