import type { Product } from "@/models/product";
import type { CustomerDetails, CustomerOrder, OrderStatus } from "@/models/order";
import { products as defaultProducts } from "@/models/products";

export type Account = {
  id: string;
  name: string;
  phone: string;
  email: string;
  password: string;
  createdAt: string;
};

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
  return readJson<Account[]>(accountsKey, []);
}

export function saveAccount(account: Omit<Account, "id" | "createdAt">) {
  const accounts = loadAccounts();
  const nextAccount: Account = {
    ...account,
    id: `AC-${Date.now()}`,
    createdAt: new Date().toISOString()
  };

  writeJson(accountsKey, [nextAccount, ...accounts]);
  saveCurrentCustomer(nextAccount);
  return nextAccount;
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
