import { AccountLayout } from '../../components/AccountLayout';

const rows = [
  { metric: 'Plan', value: 'Workspace Pro (local-ready)' },
  { metric: 'Seats', value: '5 active / 10 available' },
  { metric: 'Renewal', value: 'May 1, 2026' }
];

export default function AccountBillingPage(): JSX.Element {
  return (
    <AccountLayout title="Billing" description="Plan and payment architecture with local-first continuity.">
      <div className="overflow-x-auto rounded-2xl border border-[var(--border-soft)]">
        <table className="w-full text-sm">
          <tbody>
            {rows.map((row) => (
              <tr key={row.metric} className="border-b last:border-b-0 border-[var(--border-soft)]">
                <td className="p-3 font-medium">{row.metric}</td>
                <td className="p-3">{row.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AccountLayout>
  );
}
