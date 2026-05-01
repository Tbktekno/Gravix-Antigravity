# Frontend Module Template

Use this template when generating a new frontend module via the fullstack-module-generator skill.
Replace `[Module]` with the PascalCase module name (e.g., `Inventory`, `Payroll`).
Replace `[module]` with the kebab-case module name (e.g., `inventory`, `payroll`).

---

## File: `src/pages/[Module]/[Module]Page.tsx`
```tsx
import React, { useState } from 'react';
import { [Module]Table } from '../../components/[Module]/[Module]Table';
import { [Module]Modal } from '../../components/[Module]/[Module]Modal';
import { use[Module] } from '../../hooks/use[Module]';

const [Module]Page: React.FC = () => {
  const { items, loading, error, create, update, remove } = use[Module]();
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpenCreate = () => { setSelectedItem(null); setModalOpen(true); };
  const handleOpenEdit   = (item: any) => { setSelectedItem(item); setModalOpen(true); };
  const handleClose      = () => { setModalOpen(false); setSelectedItem(null); };

  const handleSubmit = async (data: any) => {
    if (selectedItem) { await update({ id: selectedItem.id, ...data }); }
    else { await create(data); }
    handleClose();
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">[Module] Management</h1>
        <button className="btn btn-primary" onClick={handleOpenCreate}>
          + New [Module]
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <[Module]Table
        items={items}
        loading={loading}
        onEdit={handleOpenEdit}
        onDelete={remove}
      />

      {modalOpen && (
        <[Module]Modal
          item={selectedItem}
          onSubmit={handleSubmit}
          onClose={handleClose}
        />
      )}
    </div>
  );
};

export default [Module]Page;
```

---

## File: `src/components/[Module]/[Module]Table.tsx`
```tsx
import React from 'react';

interface Props {
  items: any[];
  loading: boolean;
  onEdit: (item: any) => void;
  onDelete: (id: number) => void;
}

export const [Module]Table: React.FC<Props> = ({ items, loading, onEdit, onDelete }) => {
  if (loading) return <div className="loading-spinner">Loading...</div>;

  return (
    <div className="table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Status</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr><td colSpan={5} className="empty-state">No records found</td></tr>
          ) : (
            items.map((item, idx) => (
              <tr key={item.id}>
                <td>{idx + 1}</td>
                <td>{item.name}</td>
                <td><span className={`status-badge status-${item.status}`}>{item.status}</span></td>
                <td>{new Date(item.created_at).toLocaleDateString()}</td>
                <td className="action-cell">
                  <button className="btn btn-sm btn-secondary" onClick={() => onEdit(item)}>Edit</button>
                  <button className="btn btn-sm btn-danger"    onClick={() => onDelete(item.id)}>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
```

---

## File: `src/components/[Module]/[Module]Modal.tsx`
```tsx
import React, { useState, useEffect } from 'react';

interface Props {
  item?: any;
  onSubmit: (data: any) => void;
  onClose: () => void;
}

export const [Module]Modal: React.FC<Props> = ({ item, onSubmit, onClose }) => {
  const [name, setName] = useState('');

  useEffect(() => {
    setName(item?.name ?? '');
  }, [item]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{item ? 'Edit [Module]' : 'Create [Module]'}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="module-name">Name</label>
            <input
              id="module-name"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="form-input"
              placeholder="Enter name..."
              required
            />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">
              {item ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
```

---

## File: `src/hooks/use[Module].ts`
```typescript
import { useState, useEffect, useCallback } from 'react';
import { [module]Service } from '../services/[module].service';

export const use[Module] = () => {
  const [items, setItems]   = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await [module]Service.getAll();
      setItems(Array.isArray(data) ? data : data.items ?? []);
    } catch (err: any) {
      setError(err.message || 'Failed to load [module]s');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const create = async (payload: any) => {
    await [module]Service.create(payload);
    await fetchAll();
  };

  const update = async (payload: any) => {
    await [module]Service.update(payload.id, payload);
    await fetchAll();
  };

  const remove = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    await [module]Service.delete(id);
    await fetchAll();
  };

  return { items, loading, error, create, update, remove, refetch: fetchAll };
};
```

---

## File: `src/services/[module].service.ts`
```typescript
const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';
const ENDPOINT = `${BASE_URL}/api/[module]s`;

const headers = { 'Content-Type': 'application/json' };

const handleResponse = async (res: Response) => {
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || 'Request failed');
  }
  return res.json();
};

export const [module]Service = {
  getAll:   ()              => fetch(ENDPOINT, { headers }).then(handleResponse),
  getById:  (id: number)    => fetch(`${ENDPOINT}/${id}`, { headers }).then(handleResponse),
  create:   (body: any)     => fetch(ENDPOINT, { method: 'POST',   headers, body: JSON.stringify(body) }).then(handleResponse),
  update:   (id: number, body: any) => fetch(`${ENDPOINT}/${id}`, { method: 'PUT', headers, body: JSON.stringify(body) }).then(handleResponse),
  delete:   (id: number)    => fetch(`${ENDPOINT}/${id}`, { method: 'DELETE', headers }).then(handleResponse),
};
```
