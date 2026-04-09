import Link from 'next/link';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { AuthShell } from '../components/AuthShell';

const signUpSchema = z.object({
  fullName: z.string().min(2, 'Add your full name.'),
  email: z.string().email('Enter a valid email.'),
  password: z.string().min(10, 'Password must be at least 10 characters.'),
  acceptTerms: z.literal(true, { errorMap: () => ({ message: 'You need to accept terms.' }) })
});

type SignUpInput = z.infer<typeof signUpSchema>;

export default function SignUpPage(): JSX.Element {
  const router = useRouter();
  const { register, handleSubmit, formState, setError } = useForm<SignUpInput>({
    defaultValues: { fullName: '', email: '', password: '', acceptTerms: false }
  });

  const onSubmit = handleSubmit((values) => {
    const parsed = signUpSchema.safeParse(values);
    if (!parsed.success) {
      parsed.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof SignUpInput;
        setError(field, { message: issue.message });
      });
      return;
    }
    router.push('/onboarding');
  });

  return (
    <AuthShell
      title="Create account"
      subtitle="Set up your Wanmai account. Workspace and invite membership can be configured during onboarding."
      footer={<p>Already a member? <Link className="underline" href="/signin">Sign in</Link>.</p>}
    >
      <form className="space-y-3" onSubmit={onSubmit}>
        <input className="input" placeholder="Full name" autoComplete="name" {...register('fullName')} />
        {formState.errors.fullName ? <p className="text-xs text-red-700">{formState.errors.fullName.message}</p> : null}
        <input className="input" placeholder="Email" type="email" autoComplete="email" {...register('email')} />
        {formState.errors.email ? <p className="text-xs text-red-700">{formState.errors.email.message}</p> : null}
        <input className="input" placeholder="Password" type="password" autoComplete="new-password" {...register('password')} />
        {formState.errors.password ? <p className="text-xs text-red-700">{formState.errors.password.message}</p> : null}
        <label className="flex items-center gap-2 text-xs">
          <input type="checkbox" {...register('acceptTerms')} />
          I accept terms and privacy policy.
        </label>
        {formState.errors.acceptTerms ? <p className="text-xs text-red-700">{formState.errors.acceptTerms.message}</p> : null}
        <button className="btn btn-primary w-full" type="submit">Create account</button>
      </form>
    </AuthShell>
  );
}
