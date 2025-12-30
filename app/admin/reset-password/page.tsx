import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm';
import { Logo } from '@/components/ui/Logo';

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB] px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center">
          <Logo size={48} />
          <h1 className="mt-4 text-3xl font-bold text-[#111827]">
            Réinitialisation
          </h1>
        </div>
        <ResetPasswordForm />
      </div>
    </div>
  );
}

