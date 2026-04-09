import Link from 'next/link';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { AuthShell } from '../components/AuthShell';

const signInSchema = z.object({
  email: z.string().email('Enter a valid email.'),
  password: z.string().min(8, 'Password must be at least 8 characters.')
});

type SignInInput = z.infer<typeof signInSchema>;

export default function SignInPage(): JSX.Element {
  const router = useRouter();
  const { register, handleSubmit, formState, setError } = useForm<SignInInput>({ defaultValues: { email: '', password: '' } });

  const onSubmit = handleSubmit((values) => {
    const parsed = signInSchema.safeParse(values);
    if (!parsed.success) {
      parsed.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof SignInInput;
        setError(field, { message: issue.message });
      });
      return;
    }
    router.push('/onboarding');
  });

  return (
    <AuthShell
      title="Sign in"
      subtitle="Access your workspaces and continue in production-safe local mode if cloud auth is unavailable."
      footer={<p>Forgot password? <Link className="underline" href="/forgot-password">Reset here</Link>.</p>}
    >
      <form className="space-y-3" onSubmit={onSubmit}>
        <input className="input" placeholder="Email" type="email" autoComplete="email" {...register('email')} />
        {formState.errors.email ? <p className="text-xs text-red-700">{formState.errors.email.message}</p> : null}
        <input className="input" placeholder="Password" type="password" autoComplete="current-password" {...register('password')} />
        {formState.errors.password ? <p className="text-xs text-red-700">{formState.errors.password.message}</p> : null}
        <button className="btn btn-primary w-full" type="submit">Sign in</button>
      </form>
    </AuthShell>
  );
}
