"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import Link from "next/link";

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
          {row.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-[#F9FAFB] text-[#111827] text-xs rounded-md"
            >
              {tag}
            </span>
          ))}
          {row.tags.length > 3 && (
            <span className="text-[#4B5563] text-xs">+{row.tags.length - 3}</span>
          )}
        </div>
      );
    },
  },
  {
    header: "Statut",
    accessor: (row) => {
      const statusMap: Record<string, { label: string; color: string }> = {
        published: { label: "Publié", color: "#10b981" },
        draft: { label: "Brouillon", color: "#f59e0b" },
        archived: { label: "Archivé", color: "#6b7280" },
      };
      const status = statusMap[row.status] || statusMap.draft;
      return <StatBadge label={status.label} color={status.color} />;
    },
  },
  {
    header: "Date",
    accessor: (row) => format(new Date(row.publishedAt || row.createdAt), "dd MMM yyyy"),
    sortable: true,
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

export function BlogPageContent() {
  const router = useRouter();
  const { addToast } = useToast();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    async function loadPosts() {
      try {
        setLoading(true);
        const postsData = await getPosts();
        setPosts(postsData);
      } catch (error) {
        console.error("Error loading posts:", error);
        addToast({
          title: "Erreur",
          description: "Impossible de charger les articles",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
    loadPosts();
  }, [addToast]);

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === "all" || post.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleNewPost = () => {
    router.push("/admin/blog/new");
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={handleNewPost} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Nouvel article
        </Button>
      </div>

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



