"use client";
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { HttpTypes } from "@medusajs/types";
import { getCurrentCustomer, loginCustomer, logoutCustomer, registerCustomer } from "@/lib/medusa/customer";

interface CustomerContextType {
  customer: HttpTypes.StoreCustomer | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const CustomerContext = createContext<CustomerContextType | undefined>(undefined);

export function CustomerProvider({ children }: { children: React.ReactNode }) {
  const [customer, setCustomer] = useState<HttpTypes.StoreCustomer | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const current = await getCurrentCustomer();
    setCustomer(current);
  }, []);

  useEffect(() => {
    getCurrentCustomer()
      .then(setCustomer)
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      await loginCustomer(email, password);
      await refresh();
    },
    [refresh]
  );

  const register = useCallback(
    async (email: string, password: string, firstName: string, lastName: string) => {
      await registerCustomer(email, password, firstName, lastName);
      await refresh();
    },
    [refresh]
  );

  const logout = useCallback(async () => {
    await logoutCustomer();
    setCustomer(null);
  }, []);

  return (
    <CustomerContext.Provider value={{ customer, loading, login, register, logout, refresh }}>
      {children}
    </CustomerContext.Provider>
  );
}

export function useCustomer() {
  const context = useContext(CustomerContext);
  if (!context) {
    throw new Error("useCustomer must be used within a CustomerProvider");
  }
  return context;
}
