import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import type { Account } from "@/services/localStore";

type SuperAdminCustomersPageProps = {
  accounts: Account[];
};

export function SuperAdminCustomersPage({ accounts }: SuperAdminCustomersPageProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Customers</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3">
        {accounts.length === 0 ? (
          <p>No customer accounts created yet.</p>
        ) : (
          accounts.map((account) => (
            <div className="grid gap-3 rounded-component border border-surface-border p-4 md:grid-cols-[1fr_1fr_1fr_160px]" key={account.id}>
              <strong>{account.name}</strong>
              <span>{account.phone}</span>
              <span>{account.email}</span>
              <span>{new Date(account.createdAt).toLocaleDateString()}</span>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
