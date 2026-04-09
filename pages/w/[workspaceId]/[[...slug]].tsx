import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { SaasWorkspaceEntry } from '../../../components/SaasWorkspaceEntry';
import { WanmaiWorkbench } from '../../../components/WanmaiWorkbench';

const WorkspaceRoutePage: NextPage = () => {
  const router = useRouter();
  const workspaceId = String(router.query.workspaceId ?? 'workspace-1');
  const slug = (router.query.slug as string[] | undefined) ?? [];

  if (slug.length === 0) {
    return <SaasWorkspaceEntry workspaceId={workspaceId} />;
  }

  const [entry, ...rest] = slug;

  if (entry === 'wanmai') {
    return <WanmaiWorkbench workspaceId={workspaceId} slug={rest.length > 0 ? rest : ['home']} />;
  }

  return <SaasWorkspaceEntry workspaceId={workspaceId} />;
};

export default WorkspaceRoutePage;
