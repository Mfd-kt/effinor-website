import { getActiveSeoScripts } from '@/lib/services/seo-scripts';
import Script from 'next/script';

/**
 * Composant pour injecter les scripts SEO actifs dans le site
 * Récupère les scripts depuis Supabase et les injecte dans le head ou body selon leur position
 */
export default async function SeoScripts() {
  const scripts = await getActiveSeoScripts();

  // Séparer les scripts par position
  const headScripts = scripts.filter(s => s.scriptPosition === 'head');
  const bodyScripts = scripts.filter(s => s.scriptPosition === 'body');

  return (
    <>
      {/* Scripts pour le head - utilisent beforeInteractive pour être injectés dans le head */}
      {headScripts.map((script) => (
        <Script
          key={script.id}
          id={`seo-script-${script.name}`}
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: script.scriptCode }}
        />
      ))}

      {/* Scripts pour le body - utilisent afterInteractive */}
      {bodyScripts.map((script) => (
        <Script
          key={script.id}
          id={`seo-script-${script.name}`}
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: script.scriptCode }}
        />
      ))}
    </>
  );
}

