import { usePersistentState } from '../../hooks/usePersistentState';
import { AccountLayout } from '../../components/AccountLayout';

export default function AccountProfilePage(): JSX.Element {
  const [name, setName] = usePersistentState('wanmai.account.name', 'Wanmai User');
  const [title, setTitle] = usePersistentState('wanmai.account.title', 'Project Lead');

  return (
    <AccountLayout title="Profile" description="Manage your personal profile and identity for team collaboration.">
      <div className="grid gap-3 md:grid-cols-2">
        <label className="text-sm">Display name
          <input className="input mt-1" value={name} onChange={(event) => setName(event.target.value)} />
        </label>
        <label className="text-sm">Title
          <input className="input mt-1" value={title} onChange={(event) => setTitle(event.target.value)} />
        </label>
      </div>
    </AccountLayout>
  );
}
