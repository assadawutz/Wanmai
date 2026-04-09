import { AppShell } from '../components/AppShell';
import { WorkspaceModules } from '../components/WorkspaceModules';
import { useWorkspace } from '../lib/workspace-context';

export default function HomePage(): JSX.Element {
  const { state, dispatch } = useWorkspace();

  return (
    <AppShell
      left={
        <div>
          <h2 className="font-semibold">Wanmai Workspace Studio</h2>
          <p className="text-sm">Visual-first intelligent work operating system</p>
          <ul className="mt-2 space-y-1 text-xs">
            <li>• รับไฟล์ → เข้าใจ → วิเคราะห์ → สร้างงาน → พรีวิว → ส่งออก</li>
            <li>• Mobile-first / tap-first / preview-first</li>
            <li>• Degraded-safe runtime with fallback</li>
          </ul>
        </div>
      }
      top={
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-xl font-semibold">{state.workspaceMeta.name}</h1>
          <select
            className="input max-w-52"
            value={state.customization.theme}
            onChange={(e) => dispatch({ type: 'UPDATE_THEME', payload: { ...state.customization, theme: e.target.value } })}
          >
            <option>Lady Premium</option>
            <option>Rose Executive</option>
            <option>Soft Ivory Pro</option>
            <option>Blossom Studio</option>
            <option>Daisy Garden</option>
            <option>Lavender Mist</option>
            <option>Midnight Elegant</option>
            <option>Neutral Corporate</option>
          </select>
        </div>
      }
      main={<WorkspaceModules />}
      right={
        <div className="space-y-2 text-sm">
          <p className="font-semibold">Inspector</p>
          <p>Theme: {state.customization.theme}</p>
          <p>Density: {state.customization.density}</p>
          <p>Motion: {state.customization.motion}</p>
          <p>Runtime provider: {state.runtime.provider}</p>
          <p>Runtime state: {state.runtime.state}</p>
          <p>{state.runtime.degradedNotice}</p>
        </div>
      }
      bottom={
        <div className="flex flex-wrap gap-3 text-xs">
          <span>Status: active</span>
          <span>Snapshots: {state.history.length}</span>
          <span>Validation: {state.validation.length}</span>
          <span>Source files: {state.sourceFiles.length}</span>
          <span>Action Center: {state.actionCenter.length}</span>
        </div>
      }
    />
  );
}
