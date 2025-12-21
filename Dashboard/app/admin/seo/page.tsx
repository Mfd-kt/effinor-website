"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PageHeader } from "@/components/admin/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Search } from "lucide-react";
import { BlogPageContent } from "./blog-tab";
import { ContentPageContent } from "./contenu-tab";

export default function SeoPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState('blog');

  useEffect(() => {
    const tab = searchParams.get('tab') || 'blog';
    setActiveTab(tab);
  }, [searchParams]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Mettre à jour l'URL sans recharger la page
    const newUrl = value === 'blog' ? '/admin/seo' : `/admin/seo?tab=${value}`;
    router.replace(newUrl, { scroll: false });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="SEO"
        description="Gérez le contenu SEO de votre site : articles de blog et pages statiques"
        actions={
          <div className="flex items-center gap-2">
            <Search className="h-5 w-5 text-effinor-gray-text" />
          </div>
        }
      />

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="blog" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Blog
          </TabsTrigger>
          <TabsTrigger value="contenu" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Contenu
          </TabsTrigger>
        </TabsList>

        <TabsContent value="blog" className="mt-6">
          <BlogPageContent />
        </TabsContent>

        <TabsContent value="contenu" className="mt-6">
          <ContentPageContent />
        </TabsContent>
      </Tabs>
    </div>
  );
}

