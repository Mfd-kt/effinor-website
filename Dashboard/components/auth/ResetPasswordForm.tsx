'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { resetPassword, updatePassword } from '@/app/actions/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/toast';

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToast } = useToast();
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isResetMode, setIsResetMode] = useState(true);

  // Vérifier si on est en mode "mise à jour" (avec token depuis l'email)
  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      setIsResetMode(false);
    }
  }, [searchParams]);

  const handleRequestReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await resetPassword(email);

      if (result.success) {
        setSuccess(true);
        addToast({
          title: 'Email envoyé',
          description: 'Un email de réinitialisation a été envoyé à votre adresse',
          variant: 'default',
        });
      } else {
        const errorMessage = result.error?.message || 'Erreur lors de la demande de réinitialisation';
        setError(errorMessage);
        addToast({
          title: 'Erreur',
          description: errorMessage,
          variant: 'destructive',
        });
      }
    } catch (err) {
      const errorMessage = 'Une erreur inattendue est survenue';
      setError(errorMessage);
      addToast({
        title: 'Erreur',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (newPassword.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    setLoading(true);

    try {
      const result = await updatePassword(newPassword);

      if (result.success) {
        addToast({
          title: 'Mot de passe mis à jour',
          description: 'Votre mot de passe a été mis à jour avec succès',
          variant: 'default',
        });
        router.push('/login');
      } else {
        const errorMessage = result.error?.message || 'Erreur lors de la mise à jour du mot de passe';
        setError(errorMessage);
        addToast({
          title: 'Erreur',
          description: errorMessage,
          variant: 'destructive',
        });
      }
    } catch (err) {
      const errorMessage = 'Une erreur inattendue est survenue';
      setError(errorMessage);
      addToast({
        title: 'Erreur',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (isResetMode) {
    // Formulaire de demande de réinitialisation
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Réinitialiser le mot de passe</CardTitle>
          <CardDescription>
            Entrez votre adresse email pour recevoir un lien de réinitialisation
          </CardDescription>
        </CardHeader>
        <CardContent>
          {success ? (
            <div className="space-y-4">
              <div className="p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-md">
                Un email de réinitialisation a été envoyé à {email}. Veuillez vérifier votre boîte de réception.
              </div>
              <Button
                onClick={() => router.push('/login')}
                variant="outline"
                className="w-full"
              >
                Retour à la connexion
              </Button>
            </div>
          ) : (
            <form onSubmit={handleRequestReset} className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@effinor.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  autoComplete="email"
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Envoi...' : 'Envoyer le lien de réinitialisation'}
              </Button>

              <div className="text-center">
                <a
                  href="/login"
                  className="text-sm text-effinor-emerald hover:underline"
                >
                  Retour à la connexion
                </a>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    );
  }

  // Formulaire de mise à jour du mot de passe (avec token)
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Nouveau mot de passe</CardTitle>
        <CardDescription>
          Entrez votre nouveau mot de passe
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleUpdatePassword} className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="newPassword">Nouveau mot de passe</Label>
            <Input
              id="newPassword"
              type="password"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              disabled={loading}
              autoComplete="new-password"
              minLength={6}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
              autoComplete="new-password"
              minLength={6}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Mise à jour...' : 'Mettre à jour le mot de passe'}
          </Button>

          <div className="text-center">
            <a
              href="/login"
              className="text-sm text-effinor-emerald hover:underline"
            >
              Retour à la connexion
            </a>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

