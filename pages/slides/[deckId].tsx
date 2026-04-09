import { useRouter } from 'next/router';
import { DailyCorePage } from '../../components/daily-core/DailyCorePage';

export default function SlideDeckPage(): JSX.Element {
  const router = useRouter();
  const id = typeof router.query.deckId === 'string' ? router.query.deckId : undefined;
  return <DailyCorePage route="slide-detail" id={id} />;
}
