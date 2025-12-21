-- Script pour initialiser les pages de contenu SEO avec les slugs et titres par défaut

-- Insérer les pages de contenu avec leurs données par défaut
-- Utiliser ON CONFLICT DO NOTHING pour éviter les doublons

-- Page Contact avec les informations fournies (FR)
INSERT INTO public.seo_content (slug, lang, title, content, meta_title, meta_description, meta_keywords)
VALUES (
  'contact',
  'fr',
  'Contact',
  '<div class="contact-page">
  <section class="contact-info">
    <h2>Contactez-nous</h2>
    <div class="contact-details">
      <div class="contact-item">
        <strong>Email :</strong> contact@effinor.fr
      </div>
      <div class="contact-item">
        <strong>Téléphone :</strong> 09 78 45 50 63
      </div>
      <div class="contact-item">
        <strong>Adresse :</strong> Tour Europa, Av. de l''Europe, 94320 Thiais
      </div>
      <div class="contact-item">
        <strong>Horaires :</strong> Lun-Ven: 8h-18h
      </div>
    </div>
  </section>
</div>',
  'Contact - Effinor',
  'Contactez Effinor pour toutes vos questions. Email : contact@effinor.fr | Téléphone : 09 78 45 50 63',
  'contact, effinor, email, téléphone, adresse'
)
ON CONFLICT (slug, lang) DO NOTHING;

-- Page Espace Client (FR)
INSERT INTO public.seo_content (slug, lang, title, content, meta_title, meta_description, meta_keywords)
VALUES (
  'espace-client',
  'fr',
  'Espace Client',
  '<div class="espace-client-page">
    <h1>Espace Client</h1>
    <p>Accédez à votre espace client pour gérer vos commandes et suivre vos projets.</p>
  </div>',
  'Espace Client - Effinor',
  'Accédez à votre espace client Effinor pour gérer vos commandes et suivre vos projets.',
  'espace client, compte, connexion'
)
ON CONFLICT (slug, lang) DO NOTHING;

-- Page Mentions Légales (FR)
INSERT INTO public.seo_content (slug, lang, title, content, meta_title, meta_description, meta_keywords)
VALUES (
  'mentions-legales',
  'fr',
  'Mentions Légales',
  '<div class="mentions-legales-page">
    <h1>Mentions Légales</h1>
    <p class="text-sm text-gray-600 mb-6">Mise à jour : 21 décembre 2025</p>

    <section class="mb-8">
      <h2 class="text-2xl font-bold mb-4">Identification de la Personne Morale</h2>
      <div class="space-y-3">
        <div>
          <h3 class="font-semibold mb-2">Immatriculation au RCS</h3>
          <p><strong>Numéro:</strong> 907 547 665 R.C.S. Créteil</p>
        </div>
      </div>
    </section>

    <section class="mb-8">
      <h2 class="text-2xl font-bold mb-4">Informations Générales</h2>
      <div class="space-y-2">
        <p><strong>Dénomination sociale:</strong> ECPS</p>
        <p><strong>Nom commercial:</strong> EFFINOR Air-Energie-Lighting</p>
        <p><strong>Forme juridique:</strong> Société par actions simplifiée (SAS)</p>
        <p><strong>Capital social:</strong> 115 900,00 Euros</p>
        <p><strong>Numéro d''identification Européen (EUID):</strong> FR9401.907547665</p>
      </div>
    </section>

    <section class="mb-8">
      <h2 class="text-2xl font-bold mb-4">Adresse du Siège</h2>
      <p>1 Avenue de l''Europe<br>94320 Thiais<br>Tour europa</p>
    </section>

    <section class="mb-8">
      <h2 class="text-2xl font-bold mb-4">Activités Principales</h2>
      <div class="space-y-2">
        <p><strong>Code APE:</strong> 7112 B</p>
        <p><strong>Activité:</strong> Bureau d''étude, performance énergétique</p>
        <p><strong>Services:</strong> Audit thermique Chauffage, Climatisation, Plomberie et Électricité</p>
        <p><strong>Date de commencement d''activité:</strong> 29/11/2021</p>
      </div>
    </section>

    <section class="mb-8">
      <h2 class="text-2xl font-bold mb-4">Durée de la Personne Morale</h2>
      <div class="space-y-2">
        <p><strong>Durée:</strong> Jusqu''au 25/11/2120</p>
        <p><strong>Date de clôture de l''exercice social:</strong> 31 décembre</p>
      </div>
    </section>

    <section class="mb-8">
      <h2 class="text-2xl font-bold mb-4">Contact</h2>
      <div class="space-y-2">
        <p><strong>Adresse:</strong> 1 Avenue de l''Europe<br>94320 Thiais<br>Tour europa</p>
        <p><strong>Email:</strong> <a href="mailto:contact@effinor.fr" class="text-effinor-emerald hover:underline">contact@effinor.fr</a></p>
      </div>
    </section>

    <section class="mb-8">
      <h2 class="text-2xl font-bold mb-4">Hébergement</h2>
      <div class="space-y-2">
        <p><strong>Hébergeur:</strong> Hostinger International Ltd.</p>
        <p><strong>Adresse:</strong> 61 Lordou Vironos Street, 6023 Larnaca, Chypre</p>
      </div>
    </section>

    <section class="mb-8">
      <h2 class="text-2xl font-bold mb-4">Propriété Intellectuelle</h2>
      <p>Tous les contenus de ce site (textes, images, logos, etc.) sont la propriété exclusive de EFFINOR ou de ses partenaires. Toute reproduction, distribution ou utilisation sans autorisation est interdite.</p>
    </section>

    <section class="mb-8">
      <h2 class="text-2xl font-bold mb-4">Responsabilité</h2>
      <p>EFFINOR s''efforce de fournir des informations exactes et à jour. Cependant, nous ne pouvons pas garantir l''exactitude, l''exhaustivité ou l''actualité des informations fournies sur ce site.</p>
    </section>

    <section class="mb-8">
      <h2 class="text-2xl font-bold mb-4">Protection des Données Personnelles</h2>
      <p>Conformément à la loi « Informatique et Libertés » du 6 janvier 1978 modifiée et au Règlement Général sur la Protection des Données (RGPD), vous disposez d''un droit d''accès, de rectification et de suppression des données vous concernant. Pour exercer ces droits, vous pouvez nous contacter à l''adresse : <a href="mailto:contact@effinor.fr" class="text-effinor-emerald hover:underline">contact@effinor.fr</a></p>
    </section>
  </div>',
  'Mentions Légales - Effinor',
  'Consultez les mentions légales d''Effinor : informations sur l''entreprise ECPS, immatriculation RCS, adresse, activités et protection des données.',
  'mentions légales, informations légales, entreprise, ECPS, EFFINOR, RCS Créteil, RGPD'
)
ON CONFLICT (slug, lang) DO UPDATE SET
  content = EXCLUDED.content,
  meta_title = EXCLUDED.meta_title,
  meta_description = EXCLUDED.meta_description,
  meta_keywords = EXCLUDED.meta_keywords,
  updated_at = NOW();

-- Page CGV (FR)
INSERT INTO public.seo_content (slug, lang, title, content, meta_title, meta_description, meta_keywords)
VALUES (
  'cgv',
  'fr',
  'Conditions Générales de Vente',
  '<div class="cgv-page">
    <h1>Conditions Générales de Vente</h1>
    <p>Consultez nos conditions générales de vente.</p>
  </div>',
  'CGV - Conditions Générales de Vente - Effinor',
  'Consultez les conditions générales de vente d''Effinor pour tous nos produits et services.',
  'cgv, conditions générales de vente, conditions de vente'
)
ON CONFLICT (slug, lang) DO NOTHING;

-- Page Politique de Confidentialité (FR)
INSERT INTO public.seo_content (slug, lang, title, content, meta_title, meta_description, meta_keywords)
VALUES (
  'politique-confidentialite',
  'fr',
  'Politique de Confidentialité',
  '<div class="politique-confidentialite-page">
    <h1>Politique de Confidentialité</h1>
    <p>Découvrez comment Effinor protège vos données personnelles.</p>
  </div>',
  'Politique de Confidentialité - Effinor',
  'Découvrez la politique de confidentialité d''Effinor et comment nous protégeons vos données personnelles.',
  'politique de confidentialité, protection des données, RGPD'
)
ON CONFLICT (slug, lang) DO NOTHING;

-- Page À propos (FR)
INSERT INTO public.seo_content (slug, lang, title, content, meta_title, meta_description, meta_keywords)
VALUES (
  'a-propos',
  'fr',
  'À propos',
  '<div class="a-propos-page">
    <h1>À propos d''Effinor</h1>
    <p>Découvrez qui nous sommes et notre mission.</p>
  </div>',
  'À propos - Effinor',
  'Découvrez Effinor : notre histoire, notre mission et nos valeurs.',
  'à propos, entreprise, histoire, mission'
)
ON CONFLICT (slug, lang) DO NOTHING;

-- Page FAQ (FR)
INSERT INTO public.seo_content (slug, lang, title, content, meta_title, meta_description, meta_keywords)
VALUES (
  'faq',
  'fr',
  'FAQ',
  '<div class="faq-page">
    <h1>Questions Fréquentes</h1>
    <p>Retrouvez les réponses aux questions les plus fréquentes.</p>
  </div>',
  'FAQ - Questions Fréquentes - Effinor',
  'Consultez les questions fréquentes sur Effinor et trouvez rapidement les réponses à vos questions.',
  'faq, questions fréquentes, aide'
)
ON CONFLICT (slug, lang) DO NOTHING;

-- Page Plan du site (FR)
INSERT INTO public.seo_content (slug, lang, title, content, meta_title, meta_description, meta_keywords)
VALUES (
  'plan-du-site',
  'fr',
  'Plan du site',
  '<div class="plan-du-site-page">
    <h1>Plan du site</h1>
    <p>Retrouvez toutes les pages de notre site.</p>
  </div>',
  'Plan du site - Effinor',
  'Consultez le plan du site Effinor pour naviguer facilement entre toutes nos pages.',
  'plan du site, sitemap, navigation'
)
ON CONFLICT (slug, lang) DO NOTHING;

-- Page Conditions d'utilisation (FR)
INSERT INTO public.seo_content (slug, lang, title, content, meta_title, meta_description, meta_keywords)
VALUES (
  'conditions-utilisation',
  'fr',
  'Conditions d''utilisation',
  '<div class="conditions-utilisation-page">
    <h1>Conditions d''utilisation</h1>
    <p>Consultez les conditions d''utilisation de notre site.</p>
  </div>',
  'Conditions d''utilisation - Effinor',
  'Consultez les conditions d''utilisation du site Effinor.',
  'conditions d''utilisation, termes d''utilisation'
)
ON CONFLICT (slug, lang) DO NOTHING;

-- Page Cookies (FR)
INSERT INTO public.seo_content (slug, lang, title, content, meta_title, meta_description, meta_keywords)
VALUES (
  'cookies',
  'fr',
  'Politique des Cookies',
  '<div class="cookies-page">
    <h1>Politique des Cookies</h1>
    <p>Découvrez comment nous utilisons les cookies sur notre site.</p>
  </div>',
  'Politique des Cookies - Effinor',
  'Découvrez la politique des cookies d''Effinor et comment nous utilisons les cookies sur notre site.',
  'cookies, politique des cookies, traceurs'
)
ON CONFLICT (slug, lang) DO NOTHING;

-- Page Presse (FR)
INSERT INTO public.seo_content (slug, lang, title, content, meta_title, meta_description, meta_keywords)
VALUES (
  'presse',
  'fr',
  'Presse',
  '<div class="presse-page">
    <h1>Presse</h1>
    <p>Retrouvez nos communiqués de presse et ressources médias.</p>
  </div>',
  'Presse - Effinor',
  'Retrouvez les communiqués de presse et ressources médias d''Effinor.',
  'presse, communiqués, médias, actualités'
)
ON CONFLICT (slug, lang) DO NOTHING;

-- Page Carrières (FR)
INSERT INTO public.seo_content (slug, lang, title, content, meta_title, meta_description, meta_keywords)
VALUES (
  'carrieres',
  'fr',
  'Carrières',
  '<div class="carrieres-page">
    <h1>Carrières</h1>
    <p>Rejoignez l''équipe Effinor et découvrez nos offres d''emploi.</p>
  </div>',
  'Carrières - Offres d''emploi - Effinor',
  'Rejoignez l''équipe Effinor ! Découvrez nos offres d''emploi et opportunités de carrière.',
  'carrières, emploi, recrutement, offres d''emploi'
)
ON CONFLICT (slug, lang) DO NOTHING;

-- Commentaire pour documentation
COMMENT ON TABLE public.seo_content IS 'Table initialisée avec les pages de contenu SEO par défaut';