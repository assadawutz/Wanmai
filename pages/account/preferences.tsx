import { usePersistentState } from '../../hooks/usePersistentState';
import { AccountLayout } from '../../components/AccountLayout';

export default function AccountPreferencesPage(): JSX.Element {
  const [density, setDensity] = usePersistentState<'comfortable' | 'compact'>('wanmai.account.density', 'comfortable');
  const [reduceMotion, setReduceMotion] = usePersistentState('wanmai.account.reduceMotion', false);

  return (
    <AccountLayout title="Preferences" description="Tune visual density and motion behavior for daily usage comfort.">
      <div className="space-y-3 text-sm">
        <label className="block">Density
          <select className="input mt-1" value={density} onChange={(event) => setDensity(event.target.value as 'comfortable' | 'compact')}>
            <option value="comfortable">Comfortable</option>
            <option value="compact">Compact</option>
          </select>
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={reduceMotion} onChange={(event) => setReduceMotion(event.target.checked)} />
          Reduce animation and transition motion.
        </label>
      </div>
    </AccountLayout>
  );
}
