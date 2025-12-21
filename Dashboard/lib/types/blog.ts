export type BlogPostStatus = "draft" | "published" | "archived";

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  categoryId?: string;
  category?: string;
  status: BlogPostStatus;
  authorId: string;
  authorName: string;
  seoTitle?: string;
  seoDescription?: string;
  seoOgImageUrl?: string;
  coverImageUrl?: string;
  tags?: string[];
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

