/**
 * Extrait les informations de contact depuis le contenu HTML
 */
export interface ContactInfo {
  email?: string;
  phone?: string;
  address?: string;
  hours?: string;
}

export function extractContactInfo(htmlContent: string): ContactInfo {
  const info: ContactInfo = {};

  // Extraire l'email - plusieurs patterns possibles
  const emailPatterns = [
    /<strong[^>]*>Email[^<]*:?<\/strong>[^<]*([^<]+)/i,
    /Email[^<]*:?[^<]*>([^<]+)</i,
    /Email[^<]*:?\s*([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i,
  ];
  for (const pattern of emailPatterns) {
    const match = htmlContent.match(pattern);
    if (match) {
      info.email = match[1].trim();
      break;
    }
  }

  // Extraire le téléphone - plusieurs patterns possibles
  const phonePatterns = [
    /<strong[^>]*>Téléphone[^<]*:?<\/strong>[^<]*([^<]+)/i,
    /<strong[^>]*>Phone[^<]*:?<\/strong>[^<]*([^<]+)/i,
    /<strong[^>]*>الهاتف[^<]*:?<\/strong>[^<]*([^<]+)/i,
    /Téléphone[^<]*:?[^<]*>([^<]+)</i,
    /Phone[^<]*:?[^<]*>([^<]+)</i,
    /الهاتف[^<]*:?[^<]*>([^<]+)</i,
  ];
  for (const pattern of phonePatterns) {
    const match = htmlContent.match(pattern);
    if (match) {
      info.phone = match[1].trim();
      break;
    }
  }

  // Extraire l'adresse - plusieurs patterns possibles
  const addressPatterns = [
    /<strong[^>]*>Adresse[^<]*:?<\/strong>[^<]*([^<]+)/i,
    /<strong[^>]*>Address[^<]*:?<\/strong>[^<]*([^<]+)/i,
    /<strong[^>]*>العنوان[^<]*:?<\/strong>[^<]*([^<]+)/i,
    /Adresse[^<]*:?[^<]*>([^<]+)</i,
    /Address[^<]*:?[^<]*>([^<]+)</i,
    /العنوان[^<]*:?[^<]*>([^<]+)</i,
  ];
  for (const pattern of addressPatterns) {
    const match = htmlContent.match(pattern);
    if (match) {
      info.address = match[1].trim();
      break;
    }
  }

  // Extraire les horaires - plusieurs patterns possibles
  const hoursPatterns = [
    /<strong[^>]*>Horaires[^<]*:?<\/strong>[^<]*([^<]+)/i,
    /<strong[^>]*>Hours[^<]*:?<\/strong>[^<]*([^<]+)/i,
    /<strong[^>]*>ساعات العمل[^<]*:?<\/strong>[^<]*([^<]+)/i,
    /Horaires[^<]*:?[^<]*>([^<]+)</i,
    /Hours[^<]*:?[^<]*>([^<]+)</i,
    /ساعات العمل[^<]*:?[^<]*>([^<]+)</i,
  ];
  for (const pattern of hoursPatterns) {
    const match = htmlContent.match(pattern);
    if (match) {
      info.hours = match[1].trim();
      break;
    }
  }

  return info;
}


