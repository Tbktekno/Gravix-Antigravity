# SKILL: Mobile Domain

## Purpose
Provides architecture guidance, UI patterns, and API-integration rules for
mobile applications built with React Native (or similar screen-based frameworks).
Ensures screen-based navigation, offline resilience, and API-driven UIs are correctly implemented.

---

## When To Use
- When `global-system-core` detects a mobile system type.
- When a new screen or navigation stack is being added.
- When API-driven UI components are being generated for mobile.

---

## Domain Modules

| Domain | Core Screens | Key Concerns |
| :--- | :--- | :--- |
| **Auth** | LoginScreen, RegisterScreen, ForgotPasswordScreen | Biometric / token storage |
| **Dashboard** | DashboardScreen | Summary cards, quick actions |
| **Profile** | ProfileScreen, EditProfileScreen | User data, avatar upload |
| **Notifications** | NotificationsScreen | Push notification integration |
| **Settings** | SettingsScreen | App config, logout |

---

## Architecture Requirements

### Navigation
- **Stack Navigator**: For linear flows (Login → OTP → Dashboard).
- **Bottom Tab Navigator**: For main app sections (Home, Search, Notifications, Profile).
- **Drawer Navigator**: For side menus with many sections.
- Navigators must be nested correctly — Tab inside Stack for auth-gated flows.

### State Management
- **Auth State**: JWT token stored in `SecureStore` (Expo) or `Keychain` (RN).
- **Server State**: Use React Query (`@tanstack/react-query`) for API data.
- **UI State**: Use `useState` / `useReducer` for local screen state.
- **Global App State**: Use Context API for theme, user, and auth.

### API Layer
- All API calls go through a centralized `apiClient` (Axios instance).
- Base URL configurable via environment variable.
- Auth token attached via Axios request interceptor.
- Token refresh handled via Axios response interceptor (401 → refresh → retry).

---

## Execution Steps

### Step 1 — Identify Screen Type
Determine what kind of screen is being built:
- Auth flow screen
- Tab-level main screen
- Detail / drill-down screen
- Form / edit screen
- Modal / bottom sheet

### Step 2 — Apply Screen Pattern

**Standard Screen Structure:**
```tsx
// screens/[Domain]/[Name]Screen.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { use[Domain] } from '../../hooks/use[Domain]';

const [Name]Screen: React.FC = () => {
  const { data, loading, error } = use[Domain]();

  if (loading) return <LoadingScreen />;
  if (error)   return <ErrorScreen message={error} />;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>[Name]</Text>
        {/* screen content */}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F1117' },
  content:   { padding: 16 },
  title:     { fontSize: 24, fontWeight: '700', color: '#F1F5F9', marginBottom: 16 },
});

export default [Name]Screen;
```

### Step 3 — Apply API Client Pattern

**Centralized API Client:**
```typescript
// services/apiClient.ts
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Handle token refresh logic here
      // On failure: clear storage and redirect to Login
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

### Step 4 — Apply React Query Hook Pattern

```typescript
// hooks/use[Domain].ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { [domain]Api } from '../services/[domain].api';

export const use[Domain] = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['[domain]'],
    queryFn: [domain]Api.getAll,
  });

  const createMutation = useMutation({
    mutationFn: [domain]Api.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['[domain]'] }),
  });

  return {
    data:    data ?? [],
    loading: isLoading,
    error:   error?.message ?? null,
    create:  createMutation.mutate,
  };
};
```

### Step 5 — Apply Navigation Registration

Register new screens in the appropriate navigator:
```tsx
// navigation/AppNavigator.tsx
<Tab.Navigator>
  <Tab.Screen name="Dashboard"  component={DashboardScreen} />
  <Tab.Screen name="Profile"    component={ProfileScreen} />
  <Tab.Screen name="Settings"   component={SettingsScreen} />
</Tab.Navigator>
```

### Step 6 — Update Memory
Trigger `frontend-memory-generator` to update `frontend-context.md` with:
- New screen path and name.
- Hook and service file references.
- Navigation stack registration.

---

## Rules

1. **Always use SafeAreaView** — Required on every root screen for notch/island safety.
2. **Secrets in SecureStore** — Never use AsyncStorage for tokens or sensitive data.
3. **React Query for all API state** — No manual `useState + useEffect` for data fetching.
4. **Centralized apiClient** — All API calls through the shared Axios instance.
5. **StyleSheet.create** — Never use inline style objects inside JSX returns.
6. **Screen-based, not tab-panel** — Mobile uses screen navigation, not tab panels inside a page.

---

## Anti-Patterns

- ❌ Storing access tokens in AsyncStorage (insecure).
- ❌ Making direct `fetch()` calls in screens (bypass apiClient).
- ❌ Using inline style objects (performance hit, not cacheable).
- ❌ Rendering large lists without `FlatList` or `FlashList`.
- ❌ Missing `SafeAreaView` on root screen components.
- ❌ Blocking the main thread with synchronous SecureStore reads (use `await`).
