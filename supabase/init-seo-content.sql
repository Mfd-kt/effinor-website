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

-- Page Contact (EN)
INSERT INTO public.seo_content (slug, lang, title, content, meta_title, meta_description, meta_keywords)
VALUES (
  'contact',
  'en',
  'Contact',
  '<div class="contact-page">
  <section class="contact-info">
    <h2>Contact Us</h2>
    <div class="contact-details">
      <div class="contact-item">
        <strong>Email:</strong> contact@effinor.fr
      </div>
      <div class="contact-item">
        <strong>Phone:</strong> +33 9 78 45 50 63
      </div>
      <div class="contact-item">
        <strong>Address:</strong> Europa Tower, Av. de l''Europe, 94320 Thiais, France
      </div>
      <div class="contact-item">
        <strong>Hours:</strong> Mon-Fri: 8am-6pm
      </div>
    </div>
  </section>
</div>',
  'Contact - Effinor',
  'Contact Effinor for all your questions. Email: contact@effinor.fr | Phone: +33 9 78 45 50 63',
  'contact, effinor, email, phone, address'
)
ON CONFLICT (slug, lang) DO NOTHING;

-- Page Contact (AR)
INSERT INTO public.seo_content (slug, lang, title, content, meta_title, meta_description, meta_keywords)
VALUES (
  'contact',
  'ar',
  'اتصل بنا',
  '<div class="contact-page" dir="rtl">
  <section class="contact-info">
    <h2>اتصل بنا</h2>
    <div class="contact-details">
      <div class="contact-item">
        <strong>البريد الإلكتروني:</strong> contact@effinor.fr
      </div>
      <div class="contact-item">
        <strong>الهاتف:</strong> +33 9 78 45 50 63
      </div>
      <div class="contact-item">
        <strong>العنوان:</strong> برج أوروبا، شارع أوروبا، 94320 تييه، فرنسا
      </div>
      <div class="contact-item">
        <strong>ساعات العمل:</strong> الإثنين-الجمعة: 8 صباحًا - 6 مساءً
      </div>
    </div>
  </section>
</div>',
  'اتصل بنا - Effinor',
  'اتصل بـ Effinor لجميع أسئلتك. البريد الإلكتروني: contact@effinor.fr | الهاتف: +33 9 78 45 50 63',
  'اتصل بنا، effinor، بريد إلكتروني، هاتف، عنوان'
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
    <section class="intro">
      <p class="text-xl mb-8">
        Effinor est un acteur majeur de l''efficacité énergétique et des solutions techniques pour bâtiments professionnels, industriels et tertiaires. Depuis plus de 10 ans, nous accompagnons nos clients dans leurs projets d''optimisation énergétique.
      </p>
    </section>

    <section class="why-effinor">
      <h2>Pourquoi Effinor ?</h2>
      <div class="features-grid">
        <div class="feature-item">
          <h3>Expertise reconnue</h3>
          <p>Plus de 10 ans d''expérience dans l''efficacité énergétique et les solutions techniques pour bâtiments professionnels, industriels et tertiaires.</p>
        </div>
        <div class="feature-item">
          <h3>Accompagnement CEE</h3>
          <p>Valorisation des Certificats d''Économies d''Énergie pour financer vos projets d''optimisation énergétique.</p>
        </div>
        <div class="feature-item">
          <h3>Solutions clé en main</h3>
          <p>De l''audit à l''installation, nous gérons l''intégralité de votre projet d''efficacité énergétique.</p>
        </div>
        <div class="feature-item">
          <h3>Suivi et maintenance</h3>
          <p>Accompagnement continu pour garantir la performance et la durabilité de vos installations.</p>
        </div>
      </div>
    </section>

    <section class="mission">
      <h2>Notre mission</h2>
      <p>
        Chez Effinor, nous croyons que l''efficacité énergétique est la clé d''un avenir durable. Notre mission est d''accompagner les entreprises dans leur transition énergétique en proposant des solutions innovantes, performantes et économiquement viables.
      </p>
    </section>

    <section class="values">
      <h2>Nos valeurs</h2>
      <ul>
        <li><strong>Innovation :</strong> Nous restons à la pointe de la technologie pour offrir les meilleures solutions.</li>
        <li><strong>Qualité :</strong> Nous garantissons l''excellence dans tous nos projets.</li>
        <li><strong>Durabilité :</strong> Nous nous engageons pour un avenir plus respectueux de l''environnement.</li>
        <li><strong>Proximité :</strong> Nous sommes à l''écoute de nos clients pour répondre à leurs besoins spécifiques.</li>
      </ul>
    </section>
  </div>',
  'À propos - Effinor | Solutions d''efficacité énergétique',
  'Découvrez Effinor, expert en efficacité énergétique depuis plus de 10 ans. Solutions techniques pour bâtiments professionnels, industriels et tertiaires.',
  'effinor, efficacité énergétique, solutions techniques, bâtiments professionnels, CEE, certificats économies énergie'
)
ON CONFLICT (slug, lang) DO UPDATE
SET
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  meta_title = EXCLUDED.meta_title,
  meta_description = EXCLUDED.meta_description,
  meta_keywords = EXCLUDED.meta_keywords,
  updated_at = NOW();

-- Page À propos (EN)
INSERT INTO public.seo_content (slug, lang, title, content, meta_title, meta_description, meta_keywords)
VALUES (
  'a-propos',
  'en',
  'About Us',
  '<div class="a-propos-page">
    <section class="intro">
      <p class="text-xl mb-8">
        Effinor is a major player in energy efficiency and technical solutions for professional, industrial and tertiary buildings. For over 10 years, we have been supporting our clients in their energy optimization projects.
      </p>
    </section>

    <section class="why-effinor">
      <h2>Why Effinor?</h2>
      <div class="features-grid">
        <div class="feature-item">
          <h3>Recognized expertise</h3>
          <p>More than 10 years of experience in energy efficiency and technical solutions for professional, industrial and tertiary buildings.</p>
        </div>
        <div class="feature-item">
          <h3>CEE support</h3>
          <p>Valorization of Energy Savings Certificates to finance your energy optimization projects.</p>
        </div>
        <div class="feature-item">
          <h3>Turnkey solutions</h3>
          <p>From audit to installation, we manage the entirety of your energy efficiency project.</p>
        </div>
        <div class="feature-item">
          <h3>Monitoring and maintenance</h3>
          <p>Continuous support to guarantee the performance and durability of your installations.</p>
        </div>
      </div>
    </section>

    <section class="mission">
      <h2>Our mission</h2>
      <p>
        At Effinor, we believe that energy efficiency is the key to a sustainable future. Our mission is to support companies in their energy transition by offering innovative, high-performance and economically viable solutions.
      </p>
    </section>

    <section class="values">
      <h2>Our values</h2>
      <ul>
        <li><strong>Innovation:</strong> We stay at the forefront of technology to offer the best solutions.</li>
        <li><strong>Quality:</strong> We guarantee excellence in all our projects.</li>
        <li><strong>Sustainability:</strong> We are committed to a more environmentally friendly future.</li>
        <li><strong>Proximity:</strong> We listen to our clients to meet their specific needs.</li>
      </ul>
    </section>
  </div>',
  'About Us - Effinor | Energy Efficiency Solutions',
  'Discover Effinor, an energy efficiency expert for over 10 years. Technical solutions for professional, industrial and tertiary buildings.',
  'effinor, energy efficiency, technical solutions, professional buildings, CEE, energy savings certificates'
)
ON CONFLICT (slug, lang) DO UPDATE
SET
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  meta_title = EXCLUDED.meta_title,
  meta_description = EXCLUDED.meta_description,
  meta_keywords = EXCLUDED.meta_keywords,
  updated_at = NOW();

-- Page À propos (AR)
INSERT INTO public.seo_content (slug, lang, title, content, meta_title, meta_description, meta_keywords)
VALUES (
  'a-propos',
  'ar',
  'من نحن',
  '<div class="a-propos-page" dir="rtl">
    <section class="intro">
      <p class="text-xl mb-8">
        إيفينور هو لاعب رئيسي في كفاءة الطاقة والحلول التقنية للمباني المهنية والصناعية والتجارية. لأكثر من 10 سنوات، ندعم عملائنا في مشاريع تحسين الطاقة.
      </p>
    </section>

    <section class="why-effinor">
      <h2>لماذا إيفينور؟</h2>
      <div class="features-grid">
        <div class="feature-item">
          <h3>الخبرة المعترف بها</h3>
          <p>أكثر من 10 سنوات من الخبرة في كفاءة الطاقة والحلول التقنية للمباني المهنية والصناعية والتجارية.</p>
        </div>
        <div class="feature-item">
          <h3>دعم شهادات توفير الطاقة</h3>
          <p>تثمين شهادات توفير الطاقة لتمويل مشاريع تحسين الطاقة الخاصة بك.</p>
        </div>
        <div class="feature-item">
          <h3>حلول جاهزة</h3>
          <p>من التدقيق إلى التثبيت، ندير مشروع كفاءة الطاقة الخاص بك بالكامل.</p>
        </div>
        <div class="feature-item">
          <h3>المتابعة والصيانة</h3>
          <p>الدعم المستمر لضمان أداء ومتانة منشآتك.</p>
        </div>
      </div>
    </section>

    <section class="mission">
      <h2>مهمتنا</h2>
      <p>
        في إيفينور، نؤمن أن كفاءة الطاقة هي مفتاح مستقبل مستدام. مهمتنا هي دعم الشركات في انتقالها الطاقي من خلال تقديم حلول مبتكرة وعالية الأداء وقابلة للتطبيق اقتصاديًا.
      </p>
    </section>

    <section class="values">
      <h2>قيمنا</h2>
      <ul>
        <li><strong>الابتكار:</strong> نبقى في طليعة التكنولوجيا لتقديم أفضل الحلول.</li>
        <li><strong>الجودة:</strong> نضمن التميز في جميع مشاريعنا.</li>
        <li><strong>الاستدامة:</strong> نحن ملتزمون بمستقبل أكثر احترامًا للبيئة.</li>
        <li><strong>القرب:</strong> نستمع لعملائنا لتلبية احتياجاتهم المحددة.</li>
      </ul>
    </section>
  </div>',
  'من نحن - إيفينور | حلول كفاءة الطاقة',
  'اكتشف إيفينور، خبير في كفاءة الطاقة لأكثر من 10 سنوات. حلول تقنية للمباني المهنية والصناعية والتجارية.',
  'إيفينور، كفاءة الطاقة، حلول تقنية، مباني مهنية، شهادات توفير الطاقة'
)
ON CONFLICT (slug, lang) DO UPDATE
SET
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  meta_title = EXCLUDED.meta_title,
  meta_description = EXCLUDED.meta_description,
  meta_keywords = EXCLUDED.meta_keywords,
  updated_at = NOW();

-- Page FAQ (FR)
INSERT INTO public.seo_content (slug, lang, title, content, meta_title, meta_description, meta_keywords)
VALUES (
  'faq',
  'fr',
  'Questions Fréquentes',
  '<div class="faq-page">
    <section class="intro">
      <p class="text-xl mb-8">
        Retrouvez les réponses aux questions les plus fréquentes concernant nos solutions d''efficacité énergétique, nos services et nos processus.
      </p>
    </section>

    <section class="faq-list">
      <div class="faq-item">
        <h2>Qu''est-ce qu''Effinor ?</h2>
        <p>
          Effinor est un spécialiste de l''efficacité énergétique et des solutions techniques pour bâtiments professionnels, industriels et tertiaires. Nous accompagnons nos clients depuis plus de 10 ans dans leurs projets d''optimisation énergétique.
        </p>
      </div>

      <div class="faq-item">
        <h2>Quels types de solutions proposez-vous ?</h2>
        <p>
          Nous proposons une gamme complète de solutions d''efficacité énergétique :
        </p>
        <ul>
          <li><strong>Éclairage LED :</strong> Solutions d''éclairage performantes pour tous types de bâtiments</li>
          <li><strong>Ventilation et destratification :</strong> Optimisation de la qualité de l''air et du confort thermique</li>
          <li><strong>Bornes de recharge électrique (IRVE) :</strong> Installation et maintenance de bornes de recharge</li>
          <li><strong>Ingénierie et CEE :</strong> Accompagnement dans la valorisation des Certificats d''Économies d''Énergie</li>
        </ul>
      </div>

      <div class="faq-item">
        <h2>Comment fonctionnent les Certificats d''Économies d''Énergie (CEE) ?</h2>
        <p>
          Les CEE sont des dispositifs qui permettent de financer vos projets d''efficacité énergétique. Nous vous accompagnons dans la valorisation de ces certificats pour réduire significativement le coût de vos investissements énergétiques.
        </p>
      </div>

      <div class="faq-item">
        <h2>Quel est votre processus d''intervention ?</h2>
        <p>
          Notre processus se décompose en plusieurs étapes :
        </p>
        <ol>
          <li><strong>Diagnostic :</strong> Analyse approfondie de vos besoins et de votre consommation énergétique actuelle</li>
          <li><strong>Étude :</strong> Conception de solutions personnalisées adaptées à vos contraintes et objectifs</li>
          <li><strong>Installation :</strong> Mise en œuvre professionnelle de nos solutions</li>
          <li><strong>Suivi et maintenance :</strong> Accompagnement continu pour optimiser les performances</li>
        </ol>
      </div>

      <div class="faq-item">
        <h2>Combien de temps prend un projet d''efficacité énergétique ?</h2>
        <p>
          La durée d''un projet varie selon sa complexité et son envergure. Un projet d''éclairage LED peut être réalisé en quelques semaines, tandis qu''un projet plus complexe incluant plusieurs solutions peut prendre plusieurs mois. Nous vous fournissons un planning détaillé lors de l''étude de votre projet.
        </p>
      </div>

      <div class="faq-item">
        <h2>Proposez-vous des solutions clé en main ?</h2>
        <p>
          Oui, nous proposons des solutions clé en main. De l''audit énergétique à l''installation, en passant par le financement via les CEE, nous gérons l''intégralité de votre projet d''efficacité énergétique.
        </p>
      </div>

      <div class="faq-item">
        <h2>Quels sont les délais de retour sur investissement ?</h2>
        <p>
          Les délais de retour sur investissement varient selon les solutions mises en place. Grâce au financement via les CEE, certains projets peuvent être rentabilisés en moins de 2 ans. Nous vous fournissons une estimation précise lors de l''étude de votre projet.
        </p>
      </div>

      <div class="faq-item">
        <h2>Intervenez-vous sur tout le territoire français ?</h2>
        <p>
          Oui, nous intervenons sur tout le territoire français. Nos équipes sont présentes dans toutes les régions pour vous accompagner dans vos projets d''efficacité énergétique.
        </p>
      </div>

      <div class="faq-item">
        <h2>Comment puis-je obtenir un devis ?</h2>
        <p>
          Vous pouvez demander un devis gratuit en remplissant notre formulaire de contact en ligne ou en nous contactant directement par téléphone au <strong>09 78 45 50 63</strong> ou par email à <strong>contact@effinor.fr</strong>. Un expert Effinor vous contactera sous 24h.
        </p>
      </div>

      <div class="faq-item">
        <h2>Proposez-vous un service de maintenance ?</h2>
        <p>
          Oui, nous proposons un service de suivi et de maintenance pour garantir la performance et la durabilité de vos installations. Notre équipe est disponible pour intervenir rapidement en cas de besoin.
        </p>
      </div>
    </section>

    <section class="contact-cta">
      <h2>Vous avez d''autres questions ?</h2>
      <p>
        N''hésitez pas à nous contacter. Notre équipe d''experts est à votre disposition pour répondre à toutes vos questions et vous accompagner dans votre projet d''efficacité énergétique.
      </p>
      <p>
        <strong>Email :</strong> contact@effinor.fr<br/>
        <strong>Téléphone :</strong> 09 78 45 50 63<br/>
        <strong>Horaires :</strong> Lun-Ven: 8h-18h
      </p>
    </section>
  </div>',
  'FAQ - Questions Fréquentes - Effinor | Efficacité Énergétique',
  'Consultez les questions fréquentes sur Effinor : solutions d''efficacité énergétique, CEE, processus, délais et tarifs. Trouvez rapidement les réponses à vos questions.',
  'faq, questions fréquentes, efficacité énergétique, CEE, certificats économies énergie, éclairage LED, ventilation, IRVE, aide, support'
)
ON CONFLICT (slug, lang) DO UPDATE
SET
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  meta_title = EXCLUDED.meta_title,
  meta_description = EXCLUDED.meta_description,
  meta_keywords = EXCLUDED.meta_keywords,
  updated_at = NOW();

-- Page FAQ (EN)
INSERT INTO public.seo_content (slug, lang, title, content, meta_title, meta_description, meta_keywords)
VALUES (
  'faq',
  'en',
  'Frequently Asked Questions',
  '<div class="faq-page">
    <section class="intro">
      <p class="text-xl mb-8">
        Find answers to the most frequently asked questions about our energy efficiency solutions, services and processes.
      </p>
    </section>

    <section class="faq-list">
      <div class="faq-item">
        <h2>What is Effinor?</h2>
        <p>
          Effinor is a specialist in energy efficiency and technical solutions for professional, industrial and tertiary buildings. We have been supporting our clients for over 10 years in their energy optimization projects.
        </p>
      </div>

      <div class="faq-item">
        <h2>What types of solutions do you offer?</h2>
        <p>
          We offer a complete range of energy efficiency solutions:
        </p>
        <ul>
          <li><strong>LED Lighting:</strong> High-performance lighting solutions for all types of buildings</li>
          <li><strong>Ventilation and destratification:</strong> Optimization of air quality and thermal comfort</li>
          <li><strong>Electric vehicle charging stations (EVCS):</strong> Installation and maintenance of charging stations</li>
          <li><strong>Engineering and EEC:</strong> Support in the valorization of Energy Savings Certificates</li>
        </ul>
      </div>

      <div class="faq-item">
        <h2>How do Energy Savings Certificates (EEC) work?</h2>
        <p>
          EECs are mechanisms that allow you to finance your energy efficiency projects. We support you in the valorization of these certificates to significantly reduce the cost of your energy investments.
        </p>
      </div>

      <div class="faq-item">
        <h2>What is your intervention process?</h2>
        <p>
          Our process is broken down into several steps:
        </p>
        <ol>
          <li><strong>Diagnosis:</strong> In-depth analysis of your needs and current energy consumption</li>
          <li><strong>Study:</strong> Design of customized solutions adapted to your constraints and objectives</li>
          <li><strong>Installation:</strong> Professional implementation of our solutions</li>
          <li><strong>Monitoring and maintenance:</strong> Continuous support to optimize performance</li>
        </ol>
      </div>

      <div class="faq-item">
        <h2>How long does an energy efficiency project take?</h2>
        <p>
          The duration of a project varies according to its complexity and scope. An LED lighting project can be completed in a few weeks, while a more complex project including several solutions can take several months. We provide you with a detailed schedule during the study of your project.
        </p>
      </div>

      <div class="faq-item">
        <h2>Do you offer turnkey solutions?</h2>
        <p>
          Yes, we offer turnkey solutions. From energy audit to installation, including financing via EECs, we manage the entirety of your energy efficiency project.
        </p>
      </div>

      <div class="faq-item">
        <h2>What are the return on investment periods?</h2>
        <p>
          Return on investment periods vary according to the solutions implemented. Thanks to financing via EECs, some projects can be profitable in less than 2 years. We provide you with a precise estimate during the study of your project.
        </p>
      </div>

      <div class="faq-item">
        <h2>Do you operate throughout France?</h2>
        <p>
          Yes, we operate throughout France. Our teams are present in all regions to support you in your energy efficiency projects.
        </p>
      </div>

      <div class="faq-item">
        <h2>How can I get a quote?</h2>
        <p>
          You can request a free quote by filling out our online contact form or by contacting us directly by phone at <strong>+33 9 78 45 50 63</strong> or by email at <strong>contact@effinor.fr</strong>. An Effinor expert will contact you within 24 hours.
        </p>
      </div>

      <div class="faq-item">
        <h2>Do you offer a maintenance service?</h2>
        <p>
          Yes, we offer a monitoring and maintenance service to guarantee the performance and durability of your installations. Our team is available to intervene quickly if needed.
        </p>
      </div>
    </section>

    <section class="contact-cta">
      <h2>Do you have other questions?</h2>
      <p>
        Do not hesitate to contact us. Our team of experts is at your disposal to answer all your questions and support you in your energy efficiency project.
      </p>
      <p>
        <strong>Email:</strong> contact@effinor.fr<br/>
        <strong>Phone:</strong> +33 9 78 45 50 63<br/>
        <strong>Hours:</strong> Mon-Fri: 8am-6pm
      </p>
    </section>
  </div>',
  'FAQ - Frequently Asked Questions - Effinor | Energy Efficiency',
  'Check out frequently asked questions about Effinor: energy efficiency solutions, EEC, processes, deadlines and prices. Find quick answers to your questions.',
  'faq, frequently asked questions, energy efficiency, EEC, energy savings certificates, LED lighting, ventilation, EVCS, help, support'
)
ON CONFLICT (slug, lang) DO UPDATE
SET
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  meta_title = EXCLUDED.meta_title,
  meta_description = EXCLUDED.meta_description,
  meta_keywords = EXCLUDED.meta_keywords,
  updated_at = NOW();

-- Page FAQ (AR)
INSERT INTO public.seo_content (slug, lang, title, content, meta_title, meta_description, meta_keywords)
VALUES (
  'faq',
  'ar',
  'الأسئلة الشائعة',
  '<div class="faq-page" dir="rtl">
    <section class="intro">
      <p class="text-xl mb-8">
        ابحث عن إجابات للأسئلة الأكثر شيوعًا حول حلول كفاءة الطاقة وخدماتنا وعملياتنا.
      </p>
    </section>

    <section class="faq-list">
      <div class="faq-item">
        <h2>ما هو إيفينور؟</h2>
        <p>
          إيفينور هو متخصص في كفاءة الطاقة والحلول التقنية للمباني المهنية والصناعية والتجارية. ندعم عملائنا لأكثر من 10 سنوات في مشاريع تحسين الطاقة.
        </p>
      </div>

      <div class="faq-item">
        <h2>ما أنواع الحلول التي تقدمونها؟</h2>
        <p>
          نقدم مجموعة كاملة من حلول كفاءة الطاقة:
        </p>
        <ul>
          <li><strong>الإضاءة LED:</strong> حلول إضاءة عالية الأداء لجميع أنواع المباني</li>
          <li><strong>التهوية وإزالة الطبقات:</strong> تحسين جودة الهواء والراحة الحرارية</li>
          <li><strong>محطات شحن المركبات الكهربائية:</strong> التثبيت والصيانة لمحطات الشحن</li>
          <li><strong>الهندسة وشهادات توفير الطاقة:</strong> الدعم في تثمين شهادات توفير الطاقة</li>
        </ul>
      </div>

      <div class="faq-item">
        <h2>كيف تعمل شهادات توفير الطاقة؟</h2>
        <p>
          شهادات توفير الطاقة هي آليات تسمح بتمويل مشاريع كفاءة الطاقة الخاصة بك. ندعمك في تثمين هذه الشهادات لتقليل تكلفة استثماراتك الطاقية بشكل كبير.
        </p>
      </div>

      <div class="faq-item">
        <h2>ما هي عملية التدخل الخاصة بكم؟</h2>
        <p>
          تنقسم عملية التدخل لدينا إلى عدة خطوات:
        </p>
        <ol>
          <li><strong>التشخيص:</strong> تحليل متعمق لاحتياجاتك واستهلاكك الطاقي الحالي</li>
          <li><strong>الدراسة:</strong> تصميم حلول مخصصة متكيفة مع قيودك وأهدافك</li>
          <li><strong>التثبيت:</strong> التنفيذ المهني لحلولنا</li>
          <li><strong>المتابعة والصيانة:</strong> الدعم المستمر لتحسين الأداء</li>
        </ol>
      </div>

      <div class="faq-item">
        <h2>كم من الوقت يستغرق مشروع كفاءة الطاقة؟</h2>
        <p>
          تختلف مدة المشروع حسب تعقيده ونطاقه. يمكن إكمال مشروع إضاءة LED في بضعة أسابيع، بينما قد يستغرق مشروع أكثر تعقيدًا يتضمن عدة حلول عدة أشهر. نقدم لك جدولًا زمنيًا مفصلاً أثناء دراسة مشروعك.
        </p>
      </div>

      <div class="faq-item">
        <h2>هل تقدمون حلول جاهزة؟</h2>
        <p>
          نعم، نقدم حلول جاهزة. من التدقيق الطاقي إلى التثبيت، بما في ذلك التمويل عبر شهادات توفير الطاقة، ندير مشروع كفاءة الطاقة الخاص بك بالكامل.
        </p>
      </div>

      <div class="faq-item">
        <h2>ما هي فترات عائد الاستثمار؟</h2>
        <p>
          تختلف فترات عائد الاستثمار حسب الحلول المطبقة. بفضل التمويل عبر شهادات توفير الطاقة، يمكن لبعض المشاريع أن تكون مربحة في أقل من عامين. نقدم لك تقديرًا دقيقًا أثناء دراسة مشروعك.
        </p>
      </div>

      <div class="faq-item">
        <h2>هل تتدخلون في جميع أنحاء فرنسا؟</h2>
        <p>
          نعم، نتدخل في جميع أنحاء فرنسا. فرقنا موجودة في جميع المناطق لدعمك في مشاريع كفاءة الطاقة الخاصة بك.
        </p>
      </div>

      <div class="faq-item">
        <h2>كيف يمكنني الحصول على عرض سعر؟</h2>
        <p>
          يمكنك طلب عرض سعر مجاني عن طريق ملء نموذج الاتصال الخاص بنا عبر الإنترنت أو الاتصال بنا مباشرة عبر الهاتف على <strong>+33 9 78 45 50 63</strong> أو عبر البريد الإلكتروني على <strong>contact@effinor.fr</strong>. سيتصل بك خبير إيفينور في غضون 24 ساعة.
        </p>
      </div>

      <div class="faq-item">
        <h2>هل تقدمون خدمة صيانة؟</h2>
        <p>
          نعم، نقدم خدمة المتابعة والصيانة لضمان أداء ومتانة منشآتك. فريقنا متاح للتدخل بسرعة عند الحاجة.
        </p>
      </div>
    </section>

    <section class="contact-cta">
      <h2>هل لديك أسئلة أخرى؟</h2>
      <p>
        لا تتردد في الاتصال بنا. فريق الخبراء لدينا في خدمتك للإجابة على جميع أسئلتك ودعمك في مشروع كفاءة الطاقة الخاص بك.
      </p>
      <p>
        <strong>البريد الإلكتروني:</strong> contact@effinor.fr<br/>
        <strong>الهاتف:</strong> +33 9 78 45 50 63<br/>
        <strong>ساعات العمل:</strong> الإثنين-الجمعة: 8ص-6م
      </p>
    </section>
  </div>',
  'الأسئلة الشائعة - إيفينور | كفاءة الطاقة',
  'اطلع على الأسئلة الشائعة حول إيفينور: حلول كفاءة الطاقة، شهادات توفير الطاقة، العمليات، المواعيد والأسعار. ابحث بسرعة عن إجابات لأسئلتك.',
  'الأسئلة الشائعة، كفاءة الطاقة، شهادات توفير الطاقة، إضاءة LED، التهوية، محطات الشحن، المساعدة، الدعم'
)
ON CONFLICT (slug, lang) DO UPDATE
SET
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  meta_title = EXCLUDED.meta_title,
  meta_description = EXCLUDED.meta_description,
  meta_keywords = EXCLUDED.meta_keywords,
  updated_at = NOW();

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