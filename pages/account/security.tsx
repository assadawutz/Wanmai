import { useState } from 'react';
import { AccountLayout } from '../../components/AccountLayout';

export default function AccountSecurityPage(): JSX.Element {
  const [enabled, setEnabled] = useState(false);

  return (
    <AccountLayout title="Security" description="Configure session security and sign-in safeguards.">
      <div className="space-y-3 text-sm">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={enabled} onChange={(event) => setEnabled(event.target.checked)} />
          Enable two-step verification in next auth sync.
        </label>
        <p className="rounded-xl bg-rose-50 p-3 text-xs">If cloud auth is unavailable, local mode continues and security changes are queued until sync.</p>
      </div>
    </AccountLayout>
  );
}
