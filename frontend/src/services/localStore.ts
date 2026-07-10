import type { Product } from "@/models/product";
import type { CustomerDetails, CustomerOrder, OrderStatus } from "@/models/order";
import { products as defaultProducts } from "@/models/products";

export type Account = {
  id: string;
  userId: string;
  name: string;
  brand: string;
  status: UserStatus;
  phone: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: string;
  updatedAt?: string;
};

export type UserRole = "Admin" | "Super Stockist" | "Distributor" | "Wholesaler" | "Customer";
export type UserStatus = "Active" | "Inactive";

const accountsKey = "xllent-retailers-accounts";
const productsKey = "xllent-retailers-products";
const removedProductsKey = "xllent-retailers-removed-products";
const ordersKey = "xllent-retailers-orders";
const customerKey = "xllent-retailers-current-customer";

function readJson<T>(key: string, fallback: T): T {
  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  window.localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new Event(`${key}:updated`));
}

export function loadAccounts() {
  return readJson<Partial<Account>[]>(accountsKey, []).map((account) => ({
    id: account.id ?? `AC-${Date.now()}`,
    userId: account.userId ?? account.email ?? account.phone ?? "",
    name: account.name ?? "",
    brand: account.brand ?? "",
    status: account.status ?? "Active",
    phone: account.phone ?? "",
    email: account.email ?? "",
    password: account.password ?? "",
    role: account.role ?? "Customer",
    createdAt: account.createdAt ?? new Date().toISOString(),
    updatedAt: account.updatedAt
  }));
}

export function saveAccount(account: Omit<Account, "id" | "createdAt">) {
  const accounts = loadAccounts();
  const userId = account.userId.trim();
  const existingIndex = accounts.findIndex((item) => item.userId === userId);
  const nextAccount: Account = {
    ...account,
    userId,
    id: existingIndex >= 0 ? accounts[existingIndex].id : `AC-${Date.now()}`,
    createdAt: new Date().toISOString()
  };

  const nextAccounts =
    existingIndex >= 0
      ? accounts.map((item, index) =>
          index === existingIndex
            ? { ...nextAccount, createdAt: item.createdAt, updatedAt: new Date().toISOString() }
            : item
        )
      : [nextAccount, ...accounts];

  writeJson(accountsKey, nextAccounts);
  return nextAccount;
}

export function deleteAccount(accountId: string) {
  writeJson(
    accountsKey,
    loadAccounts().filter((account) => account.id !== accountId)
  );
}

export function findAccountByCredentials(userId: string, password: string) {
  const normalizedUserId = userId.trim();
  return loadAccounts().find(
    (account) => account.userId === normalizedUserId && account.password === password
  );
}

export function loadManagedProducts() {
  return readJson<Product[]>(productsKey, defaultProducts);
}

export function saveManagedProducts(products: Product[]) {
  writeJson(productsKey, products);
}

export function loadRemovedProducts() {
  return readJson<Product[]>(removedProductsKey, []);
}

export function saveRemovedProducts(products: Product[]) {
  writeJson(removedProductsKey, products);
}

export function productStoreEventName() {
  return `${productsKey}:updated`;
}

export function accountStoreEventName() {
  return `${accountsKey}:updated`;
}

export function removedProductStoreEventName() {
  return `${removedProductsKey}:updated`;
}

export function loadOrders() {
  return readJson<CustomerOrder[]>(ordersKey, []);
}

export function saveOrder(details: CustomerDetails, items: CustomerOrder["items"]) {
  const orders = loadOrders();
  const total = items.reduce((sum, item) => sum + item.total, 0);
  const order: CustomerOrder = {
    id: `ER-${Date.now().toString().slice(-6)}`,
    customer: details,
    items,
    total,
    status: "Pending",
    orderDate: new Date().toISOString()
  };

  writeJson(ordersKey, [order, ...orders]);
  return order;
}

export function updateOrderStatus(orderId: string, status: OrderStatus) {
  const orders = loadOrders().map((order) =>
    order.id === orderId ? { ...order, status } : order
  );
  writeJson(ordersKey, orders);
  return orders;
}

export function orderStoreEventName() {
  return `${ordersKey}:updated`;
}

export function saveCurrentCustomer(customer: Account | CustomerDetails) {
  writeJson(customerKey, customer);
}

export function loadCurrentCustomer() {
  return readJson<Partial<Account & CustomerDetails> | null>(customerKey, null);
}

export function currentCustomerEventName() {
  return `${customerKey}:updated`;
}

export function purgeLegacyRetailData() {
  const legacyPrefix = String.fromCharCode(103, 111, 108, 100, 101, 110, 45, 100, 114, 111, 112);
  Object.keys(window.localStorage)
    .filter((key) => key.toLowerCase().includes(legacyPrefix))
    .forEach((key) => window.localStorage.removeItem(key));
}
