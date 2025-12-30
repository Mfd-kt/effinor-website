"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable, Column } from "@/components/admin/DataTable";
import { FiltersBar } from "@/components/admin/FiltersBar";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Plus, Eye } from "lucide-react";
import { getPosts } from "@/lib/services/blog";
import { BlogPost } from "@/lib/types/blog";
import { StatBadge } from "@/components/admin/StatBadge";
import { useToast } from "@/components/ui/toast";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import Image from "next/image";

const columns: Column<BlogPost>[] = [
  {
    header: "Image",
    accessor: (row) => {
      if (!row.coverImageUrl) {
        return (
          <div className="w-16 h-16 bg-[#F3F4F6] rounded-md flex items-center justify-center text-[#4B5563] text-xs">
            Aucune
          </div>
        );
      }
      return (
        <div className="w-16 h-16 relative rounded-md overflow-hidden border border-gray-200 bg-white">
          <Image
            src={row.coverImageUrl}
            alt={row.title}
            fill
            className="object-cover"
            sizes="64px"
            unoptimized
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              if (target.parentElement) {
                target.parentElement.innerHTML = '<div class="w-full h-full bg-[#F3F4F6] flex items-center justify-center text-[#4B5563] text-xs">Erreur</div>';
              }
            }}
          />
        </div>
      );
    },
  },
  {
    header: "Titre",
    accessor: "title",
    sortable: true,
  },
  {
    header: "Tags",
    accessor: (row) => {
      if (!row.tags || row.tags.length === 0) {
        return <span className="text-[#4B5563] text-sm">Aucun tag</span>;
      }
      return (
        <div className="flex flex-wrap gap-1">
          {row.tags.slice(0, 3).map((tag, idx) => (
            <span
              key={idx}
              className="text-xs px-2 py-1 bg-[#F3F4F6] text-[#111827] rounded-full"
            >
              {tag}
            </span>
          ))}
          {row.tags.length > 3 && (
            <span className="text-xs text-[#4B5563]">+{row.tags.length - 3}</span>
          )}
        </div>
      );
    },
  },
  {
    header: "Statut",
    accessor: (row) => (
      <StatBadge
        label={
          row.status === "published"
            ? "Publié"
            : row.status === "draft"
            ? "Brouillon"
            : "Archivé"
        }
        variant={row.status === "published" ? "default" : "secondary"}
      />
    ),
  },
  {
    header: "Date",
    accessor: (row) =>
      row.publishedAt
        ? format(row.publishedAt, "dd MMM yyyy")
        : format(row.createdAt, "dd MMM yyyy"),
    sortable: true,
    sortKey: "publishedAt" as keyof BlogPost,
  },
  {
    header: "Auteur",
    accessor: "authorName",
  },
  {
    header: "Actions",
    accessor: (row) => (
      <Link href={`/admin/blog/${row.id}`}>
        <Button variant="ghost" size="sm">
          <Eye className="h-4 w-4" />
        </Button>
      </Link>
    ),
  },
];

export default function BlogPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        console.log('🔄 Début du chargement des articles de blog...');
        const postsData = await getPosts();
        console.log('✅ Articles chargés:', postsData.length, 'articles');
        setPosts(postsData);
      } catch (error) {
        console.error('❌ Error loading data:', error);
        addToast({
          title: "Erreur",
          description: `Impossible de charger les articles: ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [addToast]);

  // Filtrer les articles
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      // Filtre par recherche
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          post.title.toLowerCase().includes(query) ||
          post.excerpt?.toLowerCase().includes(query) ||
          post.content.toLowerCase().includes(query) ||
          post.tags?.some(tag => tag.toLowerCase().includes(query));
        if (!matchesSearch) return false;
      }

      // Filtre par statut
      if (statusFilter !== "all") {
        if (post.status !== statusFilter) return false;
      }

      return true;
    });
  }, [posts, searchQuery, statusFilter]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  const handleNewPost = () => {
    router.push("/admin/blog/new");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Blog"
        description="Gérez vos articles de blog"
        actions={
          <Button onClick={handleNewPost} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Nouvel article
          </Button>
        }
      />

      <FiltersBar
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Rechercher par titre, contenu ou tags..."
        filters={
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-[180px]"
          >
            <option value="all">Tous les statuts</option>
            <option value="published">Publié</option>
            <option value="draft">Brouillon</option>
            <option value="archived">Archivé</option>
          </Select>
        }
      />

      <DataTable data={filteredPosts} columns={columns} />
    </div>
  );
}

