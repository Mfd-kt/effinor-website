import { marked } from 'marked';

/**
 * Convertit du Markdown en HTML
 */
export function markdownToHtml(markdown: string): string {
  if (!markdown) return '';
  
  try {
    // Configuration de marked pour la sécurité
    marked.setOptions({
      breaks: true, // Convertit les sauts de ligne en <br>
      gfm: true, // GitHub Flavored Markdown
    });
    
    return marked.parse(markdown) as string;
  } catch (error) {
    console.error('Error converting markdown to HTML:', error);
    // En cas d'erreur, retourner le texte brut avec les sauts de ligne convertis
    return markdown.replace(/\n/g, '<br />');
  }
}

