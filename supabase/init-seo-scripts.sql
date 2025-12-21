-- Script pour initialiser les scripts de tracking et publicité par défaut

-- Meta Ads (Facebook Pixel)
INSERT INTO public.seo_scripts (name, label, description, script_code, script_position, active, priority)
VALUES (
  'meta-ads',
  'Meta Ads (Facebook Pixel)',
  'Script de tracking Meta/Facebook pour les publicités et conversions',
  '<!-- Meta Pixel Code -->
<script>
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version=''2.0'';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,''script'',
  ''https://connect.facebook.net/en_US/fbevents.js'');
  fbq(''init'', ''VOTRE_PIXEL_ID'');
  fbq(''track'', ''PageView'');
</script>
<noscript><img height="1" width="1" style="display:none"
  src="https://www.facebook.com/tr?id=VOTRE_PIXEL_ID&ev=PageView&noscript=1"
/></noscript>
<!-- End Meta Pixel Code -->',
  'head',
  false,
  10
)
ON CONFLICT (name) DO NOTHING;

-- Google Ads (Conversion Tracking)
INSERT INTO public.seo_scripts (name, label, description, script_code, script_position, active, priority)
VALUES (
  'google-ads',
  'Google Ads (Conversion Tracking)',
  'Script de conversion Google Ads pour suivre les conversions publicitaires',
  '<!-- Google Ads Conversion Tracking -->
<script async src="https://www.googletagmanager.com/gtag/js?id=AW-VOTRE_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag(''js'', new Date());
  gtag(''config'', ''AW-VOTRE_ID'');
</script>
<!-- End Google Ads Conversion Tracking -->',
  'head',
  false,
  20
)
ON CONFLICT (name) DO NOTHING;

-- Google Analytics 4
INSERT INTO public.seo_scripts (name, label, description, script_code, script_position, active, priority)
VALUES (
  'google-analytics',
  'Google Analytics 4',
  'Script de tracking Google Analytics 4 pour l''analyse du trafic',
  '<!-- Google Analytics 4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-VOTRE_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag(''js'', new Date());
  gtag(''config'', ''G-VOTRE_ID'');
</script>
<!-- End Google Analytics 4 -->',
  'head',
  false,
  30
)
ON CONFLICT (name) DO NOTHING;

-- Google Tag Manager
INSERT INTO public.seo_scripts (name, label, description, script_code, script_position, active, priority)
VALUES (
  'google-tag-manager',
  'Google Tag Manager',
  'Script Google Tag Manager pour gérer tous vos tags de tracking',
  '<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({''gtm.start'':
new Date().getTime(),event:''gtm.js''});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!=''dataLayer''?''&l=''+l:'''';j.async=true;j.src=
''https://www.googletagmanager.com/gtm.js?id=''+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,''script'',''dataLayer'',''GTM-VOTRE_ID'');</script>
<!-- End Google Tag Manager -->',
  'head',
  false,
  5
)
ON CONFLICT (name) DO NOTHING;

-- Google Tag Manager (noscript - body)
INSERT INTO public.seo_scripts (name, label, description, script_code, script_position, active, priority)
VALUES (
  'google-tag-manager-noscript',
  'Google Tag Manager (noscript)',
  'Version noscript de Google Tag Manager à placer dans le body',
  '<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-VOTRE_ID"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->',
  'body',
  false,
  5
)
ON CONFLICT (name) DO NOTHING;

-- Microsoft Advertising (Bing Ads)
INSERT INTO public.seo_scripts (name, label, description, script_code, script_position, active, priority)
VALUES (
  'microsoft-advertising',
  'Microsoft Advertising (Bing Ads)',
  'Script de tracking Microsoft Advertising pour les campagnes Bing',
  '<!-- Microsoft Advertising UET Tag -->
<script>(function(w,d,t,r,u){var f,n,i;w[u]=w[u]||[],f=function(){var o={ti:"VOTRE_TAG_ID"};o.q=w[u],w[u]=new UET(o),w[u].push("pageLoad")},n=d.createElement(t),n.src=r,n.async=1,n.onload=n.onreadystatechange=function(){var s=this.readyState;s&&s!=="loaded"&&s!=="complete"||(f(),n.onload=n.onreadystatechange=null)},i=d.getElementsByTagName(t)[0],i.parentNode.insertBefore(n,i)})(window,document,"script","//bat.bing.com/bat.js","uetq");</script>
<noscript><img src="//bat.bing.com/action/0?ti=VOTRE_TAG_ID" width="0" height="0" style="display:none; visibility:hidden;" /></noscript>
<!-- End Microsoft Advertising UET Tag -->',
  'head',
  false,
  40
)
ON CONFLICT (name) DO NOTHING;

-- LinkedIn Insight Tag
INSERT INTO public.seo_scripts (name, label, description, script_code, script_position, active, priority)
VALUES (
  'linkedin-insight',
  'LinkedIn Insight Tag',
  'Script de tracking LinkedIn pour les campagnes publicitaires LinkedIn',
  '<!-- LinkedIn Insight Tag -->
<script type="text/javascript">
_linkedin_partner_id = "VOTRE_PARTNER_ID";
window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
window._linkedin_data_partner_ids.push(_linkedin_partner_id);
</script><script type="text/javascript">
(function(l) {
if (!l){window.lintrk = function(a,b){window.lintrk.q.push([a,b])};
window.lintrk.q=[]}
var s = document.getElementsByTagName("script")[0];
var b = document.createElement("script");
b.type = "text/javascript";b.async = true;
b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
s.parentNode.insertBefore(b, s);})(window.lintrk);
</script>
<noscript>
<img height="1" width="1" style="display:none;" alt="" src="https://px.ads.linkedin.com/collect/?pid=VOTRE_PARTNER_ID&fmt=gif" />
</noscript>
<!-- End LinkedIn Insight Tag -->',
  'head',
  false,
  50
)
ON CONFLICT (name) DO NOTHING;

-- TikTok Pixel
INSERT INTO public.seo_scripts (name, label, description, script_code, script_position, active, priority)
VALUES (
  'tiktok-pixel',
  'TikTok Pixel',
  'Script de tracking TikTok pour les campagnes publicitaires TikTok',
  '<!-- TikTok Pixel Code -->
<script>
!function (w, d, t) {
  w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};

  ttq.load(''VOTRE_PIXEL_ID'');
  ttq.page();
}(window, document, ''ttq'');
</script>
<!-- End TikTok Pixel Code -->',
  'head',
  false,
  60
)
ON CONFLICT (name) DO NOTHING;

-- Pinterest Tag
INSERT INTO public.seo_scripts (name, label, description, script_code, script_position, active, priority)
VALUES (
  'pinterest-tag',
  'Pinterest Tag',
  'Script de tracking Pinterest pour les campagnes publicitaires Pinterest',
  '<!-- Pinterest Tag -->
<script>
!function(e){if(!window.pintrk){window.pintrk = function () {
window.pintrk.queue.push(Array.prototype.slice.call(arguments))};var
  n=window.pintrk;n.queue=[],n.version="3.0";var
  t=document.createElement("script");t.async=!0,t.src=e;var
  r=document.getElementsByTagName("script")[0];
  r.parentNode.insertBefore(t,r)}}("https://s.pinimg.com/ct/core.js");
pintrk(''load'', ''VOTRE_TAG_ID'', {em: ''''});
pintrk(''page'');
</script>
<noscript>
<img height="1" width="1" style="display:none;" alt="" src="https://ct.pinterest.com/v3/?tid=VOTRE_TAG_ID&event=init&noscript=1" />
</noscript>
<!-- End Pinterest Tag -->',
  'head',
  false,
  70
)
ON CONFLICT (name) DO NOTHING;

-- Commentaire pour documentation
COMMENT ON TABLE public.seo_scripts IS 'Table initialisée avec les scripts de tracking et publicité par défaut';