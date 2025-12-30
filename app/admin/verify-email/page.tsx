'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { verifyEmail } from '@/app/actions/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/Logo';
import { useToast } from '@/components/ui/toast';

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToast } = useToast();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const token = searchParams.get('token');
    const type = searchParams.get('type');

    if (!token) {
      setStatus('error');
      setErrorMessage('Token de vérification manquant');
      return;
    }

    const verify = async () => {
      try {
        const result = await verifyEmail(token);

        if (result.success) {
          setStatus('success');
          addToast({
            title: 'Email vérifié',
            description: 'Votre adresse email a été vérifiée avec succès',
            variant: 'default',
          });
        } else {
          setStatus('error');
          setErrorMessage(result.error?.message || 'Erreur lors de la vérification');
          addToast({
            title: 'Erreur de vérification',
            description: result.error?.message || 'Erreur lors de la vérification',
            variant: 'destructive',
          });
        }
      } catch (err) {
        setStatus('error');
        const errorMsg = 'Une erreur inattendue est survenue';
        setErrorMessage(errorMsg);
        addToast({
          title: 'Erreur',
          description: errorMsg,
          variant: 'destructive',
        });
      }
    };

    verify();
  }, [searchParams, addToast]);

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Vérification de l'email</CardTitle>
        <CardDescription>
          {status === 'loading' && 'Vérification en cours...'}
          {status === 'success' && 'Votre email a été vérifié avec succès'}
          {status === 'error' && 'Erreur lors de la vérification'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {status === 'loading' && (
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-effinor-emerald"></div>
            </div>
            <p className="text-center text-sm text-effinor-gray-text">
              Vérification de votre adresse email...
            </p>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-4">
            <div className="p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-md">
              Votre adresse email a été vérifiée avec succès. Vous pouvez maintenant vous connecter.
            </div>
            <Button
              onClick={() => router.push('/login')}
              className="w-full"
            >
              Se connecter
            </Button>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-4">
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              {errorMessage || 'Le lien de vérification est invalide ou a expiré'}
            </div>
            <div className="space-y-2">
              <Button
                onClick={() => router.push('/login')}
                variant="outline"
                className="w-full"
              >
                Retour à la connexion
              </Button>
              <Button
                onClick={() => router.push('/reset-password')}
                variant="secondary"
                className="w-full"
              >
                Demander un nouveau lien
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB] px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center">
          <Logo size={48} />
          <h1 className="mt-4 text-3xl font-bold text-effinor-gray-dark">
            Vérification
          </h1>
        </div>
        <Suspense fallback={
          <Card className="w-full max-w-md">
            <CardContent className="p-6">
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-effinor-emerald"></div>
              </div>
            </CardContent>
          </Card>
        }>
          <VerifyEmailContent />
        </Suspense>
      </div>
    </div>
  );
}

