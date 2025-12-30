import { LoginForm } from '@/components/auth/LoginForm';
import { Logo } from '@/components/ui/Logo';

/**
 * Page de connexion
 * 
 * TEMPORAIREMENT SIMPLIFIÉE - L'authentification sera réimplémentée proprement
 */
export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB] px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center">
          <Logo size={48} />
          <h1 className="mt-4 text-3xl font-bold text-effinor-gray-dark">
            Dashboard Effinor
          </h1>
          <p className="mt-2 text-sm text-effinor-gray-text">
            Accès administrateur
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}

