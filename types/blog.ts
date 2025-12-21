import { Lang } from './index';

export type BlogPostStatus = 'draft' | 'published' | 'archived';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  coverImageUrl?: string;
  status: BlogPostStatus;
  lang?: Lang;
  authorId: string;
  authorName?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoOgImageUrl?: string;
  tags?: string[];
  categoryId?: string;
  category?: string;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

