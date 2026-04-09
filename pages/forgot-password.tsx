import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { AuthShell } from '../components/AuthShell';

const resetSchema = z.object({ email: z.string().email('Enter a valid email.') });

type ResetInput = z.infer<typeof resetSchema>;

export default function ForgotPasswordPage(): JSX.Element {
  const [sent, setSent] = useState(false);
  const { register, handleSubmit, formState, setError } = useForm<ResetInput>({ defaultValues: { email: '' } });

  const onSubmit = handleSubmit((values) => {
    const parsed = resetSchema.safeParse(values);
    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      setError('email', { message: issue.message });
      return;
    }
    setSent(true);
  });

  return (
    <AuthShell title="Forgot password" subtitle="Generate a password reset link. If auth is offline, you can still use local workspace mode.">
      <form className="space-y-3" onSubmit={onSubmit}>
        <input className="input" placeholder="Email" type="email" {...register('email')} />
        {formState.errors.email ? <p className="text-xs text-red-700">{formState.errors.email.message}</p> : null}
        <button className="btn btn-primary w-full" type="submit">Send reset link</button>
      </form>
      {sent ? <p className="mt-3 rounded-xl bg-emerald-50 p-2 text-xs text-emerald-800">Reset instructions queued. Check your inbox.</p> : null}
    </AuthShell>
  );
}
