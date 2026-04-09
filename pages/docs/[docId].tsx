import { useRouter } from 'next/router';
import { DailyCorePage } from '../../components/daily-core/DailyCorePage';

export default function DocDetailPage(): JSX.Element {
  const router = useRouter();
  const id = typeof router.query.docId === 'string' ? router.query.docId : undefined;
  return <DailyCorePage route="doc-detail" id={id} />;
}
