import { AccountLayout } from '../../components/AccountLayout';

const usage = [
  { label: 'Documents generated', value: 42 },
  { label: 'Exports this month', value: 17 },
  { label: 'Snapshot restores', value: 6 },
  { label: 'Runtime degraded recoveries', value: 3 }
];

export default function AccountUsagePage(): JSX.Element {
  return (
    <AccountLayout title="Usage" description="Track feature utilization, recoveries, and operational health.">
      <div className="grid gap-3 sm:grid-cols-2">
        {usage.map((item) => (
          <div key={item.label} className="rounded-2xl border border-[var(--border-soft)] bg-white p-3">
            <p className="text-xs uppercase tracking-wide text-rose-700">{item.label}</p>
            <p className="mt-1 text-2xl font-semibold text-[var(--text-heading)]">{item.value}</p>
          </div>
        ))}
      </div>
    </AccountLayout>
  );
}
