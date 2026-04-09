import { usePersistentState } from '../../hooks/usePersistentState';
import { AccountLayout } from '../../components/AccountLayout';

export default function AccountNotificationsPage(): JSX.Element {
  const [emailAlerts, setEmailAlerts] = usePersistentState('wanmai.account.emailAlerts', true);
  const [digestFrequency, setDigestFrequency] = usePersistentState<'daily' | 'weekly'>('wanmai.account.digest', 'daily');

  return (
    <AccountLayout title="Notifications" description="Control alert delivery and digest cadence.">
      <div className="space-y-3 text-sm">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={emailAlerts} onChange={(event) => setEmailAlerts(event.target.checked)} />
          Receive critical readiness and approval alerts.
        </label>
        <label className="block">Digest frequency
          <select className="input mt-1" value={digestFrequency} onChange={(event) => setDigestFrequency(event.target.value as 'daily' | 'weekly')}>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
          </select>
        </label>
      </div>
    </AccountLayout>
  );
}
