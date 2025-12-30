import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]">
      <Card className="text-center" padding="lg">
        <h1 className="text-4xl md:text-5xl font-extrabold text-[#111827] mb-4">404</h1>
        <p className="text-xl text-[#4B5563] mb-8">Page non trouvée</p>
        <Link href="/fr">
          <Button variant="default">
            Retour à l'accueil
          </Button>
        </Link>
      </Card>
    </div>
  );
}
