import { suggestEditUrl, type FeedbackContext } from '../utils/feedback';

type Props = FeedbackContext & {
  className?: string;
  label?: string;
};

export function FeedbackLink({ className = 'feedback-link', label = 'Suggest an edit', ...ctx }: Props) {
  const href = suggestEditUrl(ctx);

  return (
    <a className={className} href={href} target="_blank" rel="noopener noreferrer">
      {label}
    </a>
  );
}
