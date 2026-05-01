# Backend Module Template

Use this template when generating a new backend module via the fullstack-module-generator skill.
Replace `[MODULE]` with the actual module name (e.g., `inventory`, `payroll`).

---

## File: `services/[module]/[module].controller.ts`
```typescript
import { sendUnaryData, ServerUnaryCall } from '@grpc/grpc-js';
import { [Module]Service } from './[module].service';
import { Create[Module]Dto, Update[Module]Dto } from './dto/[module].dto';

export class [Module]Controller {
  constructor(private readonly [module]Service: [Module]Service) {}

  async getAll(call: ServerUnaryCall<any, any>, callback: sendUnaryData<any>) {
    try {
      const result = await this.[module]Service.getAll();
      callback(null, { items: result });
    } catch (error) {
      callback(error as Error, null);
    }
  }

  async getById(call: ServerUnaryCall<any, any>, callback: sendUnaryData<any>) {
    try {
      const item = await this.[module]Service.getById(call.request.id);
      callback(null, item);
    } catch (error) {
      callback(error as Error, null);
    }
  }

  async create(call: ServerUnaryCall<any, any>, callback: sendUnaryData<any>) {
    try {
      const dto: Create[Module]Dto = call.request;
      const result = await this.[module]Service.create(dto);
      callback(null, result);
    } catch (error) {
      callback(error as Error, null);
    }
  }

  async update(call: ServerUnaryCall<any, any>, callback: sendUnaryData<any>) {
    try {
      const dto: Update[Module]Dto = call.request;
      const result = await this.[module]Service.update(dto);
      callback(null, result);
    } catch (error) {
      callback(error as Error, null);
    }
  }

  async delete(call: ServerUnaryCall<any, any>, callback: sendUnaryData<any>) {
    try {
      await this.[module]Service.delete(call.request.id);
      callback(null, { success: true });
    } catch (error) {
      callback(error as Error, null);
    }
  }
}
```

---

## File: `services/[module]/[module].service.ts`
```typescript
import { [Module]Repository } from './[module].repository';
import { Create[Module]Dto, Update[Module]Dto } from './dto/[module].dto';
import { [Module]Entity } from './[module].entity';

export class [Module]Service {
  constructor(private readonly [module]Repository: [Module]Repository) {}

  async getAll(): Promise<[Module]Entity[]> {
    return this.[module]Repository.findAll();
  }

  async getById(id: number): Promise<[Module]Entity> {
    const item = await this.[module]Repository.findById(id);
    if (!item) throw new Error(`[Module] with id ${id} not found`);
    return item;
  }

  async create(dto: Create[Module]Dto): Promise<[Module]Entity> {
    this.validate(dto);
    return this.[module]Repository.create(dto);
  }

  async update(dto: Update[Module]Dto): Promise<[Module]Entity> {
    await this.getById(dto.id);
    return this.[module]Repository.update(dto);
  }

  async delete(id: number): Promise<void> {
    await this.getById(id);
    return this.[module]Repository.delete(id);
  }

  private validate(dto: Create[Module]Dto): void {
    if (!dto.name) throw new Error('[Module] name is required');
  }
}
```

---

## File: `services/[module]/[module].repository.ts`
```typescript
import Database from 'better-sqlite3';
import { Create[Module]Dto, Update[Module]Dto } from './dto/[module].dto';
import { [Module]Entity } from './[module].entity';

export class [Module]Repository {
  constructor(private readonly db: Database.Database) {
    this.initialize();
  }

  private initialize(): void {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS [module]s (
        id        INTEGER PRIMARY KEY AUTOINCREMENT,
        name      TEXT NOT NULL,
        status    TEXT DEFAULT 'active',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }

  findAll(): [Module]Entity[] {
    return this.db.prepare('SELECT * FROM [module]s ORDER BY id DESC').all() as [Module]Entity[];
  }

  findById(id: number): [Module]Entity | null {
    return this.db.prepare('SELECT * FROM [module]s WHERE id = ?').get(id) as [Module]Entity | null;
  }

  create(dto: Create[Module]Dto): [Module]Entity {
    const stmt = this.db.prepare('INSERT INTO [module]s (name) VALUES (?) RETURNING *');
    return stmt.get(dto.name) as [Module]Entity;
  }

  update(dto: Update[Module]Dto): [Module]Entity {
    const stmt = this.db.prepare(
      'UPDATE [module]s SET name = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? RETURNING *'
    );
    return stmt.get(dto.name, dto.id) as [Module]Entity;
  }

  delete(id: number): void {
    this.db.prepare('DELETE FROM [module]s WHERE id = ?').run(id);
  }
}
```

---

## File: `services/[module]/[module].entity.ts`
```typescript
export interface [Module]Entity {
  id: number;
  name: string;
  status: string;
  created_at: string;
  updated_at: string;
}
```

---

## File: `services/[module]/dto/[module].dto.ts`
```typescript
export interface Create[Module]Dto {
  name: string;
}

export interface Update[Module]Dto {
  id: number;
  name: string;
}
```

---

## File: `protos/[module].proto`
```protobuf
syntax = "proto3";

package [module];

service [Module]Service {
  rpc GetAll    ([Module]ListRequest)  returns ([Module]ListResponse);
  rpc GetById   ([Module]IdRequest)    returns ([Module]Response);
  rpc Create    (Create[Module]Request) returns ([Module]Response);
  rpc Update    (Update[Module]Request) returns ([Module]Response);
  rpc Delete    ([Module]IdRequest)    returns (DeleteResponse);
}

message [Module]ListRequest {}
message [Module]IdRequest { int32 id = 1; }
message Create[Module]Request { string name = 1; }
message Update[Module]Request { int32 id = 1; string name = 2; }
message DeleteResponse { bool success = 1; }

message [Module]Response {
  int32  id         = 1;
  string name       = 2;
  string status     = 3;
  string created_at = 4;
  string updated_at = 5;
}

message [Module]ListResponse {
  repeated [Module]Response items = 1;
}
```

---

## API Gateway Route File: `api-gateway/routes/[module].routes.ts`
```typescript
import { Router, Request, Response } from 'express';
import { [module]Client } from '../clients/[module].client';

const router = Router();

router.get('/',           async (req: Request, res: Response) => {
  [module]Client.GetAll({}, (err, data) => err ? res.status(500).json({ error: err.message }) : res.json(data));
});

router.get('/:id',        async (req: Request, res: Response) => {
  [module]Client.GetById({ id: +req.params.id }, (err, data) => err ? res.status(404).json({ error: err.message }) : res.json(data));
});

router.post('/',          async (req: Request, res: Response) => {
  [module]Client.Create(req.body, (err, data) => err ? res.status(400).json({ error: err.message }) : res.status(201).json(data));
});

router.put('/:id',        async (req: Request, res: Response) => {
  [module]Client.Update({ id: +req.params.id, ...req.body }, (err, data) => err ? res.status(400).json({ error: err.message }) : res.json(data));
});

router.delete('/:id',     async (req: Request, res: Response) => {
  [module]Client.Delete({ id: +req.params.id }, (err, data) => err ? res.status(400).json({ error: err.message }) : res.json(data));
});

export default router;
```
