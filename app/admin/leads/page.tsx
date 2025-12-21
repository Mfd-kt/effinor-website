import { createSupabaseClient } from '@/lib/supabaseClient';

interface LeadWithCategory {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string;
  lang: string;
  status: string;
  categories: {
    id: string;
    slug: string;
    name_fr: string;
    name_en: string;
    name_ar: string;
  } | null;
}

export default async function AdminLeadsPage() {
  const supabase = createSupabaseClient();

  // Récupérer les leads avec leurs catégories
  const { data: leads, error } = await supabase
    .from('leads')
    .select(`
      id,
      created_at,
      name,
      email,
      phone,
      lang,
      status,
      categories:category_id (
        id,
        slug,
        name_fr,
        name_en,
        name_ar
      )
    `)
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) {
    console.error('Error fetching leads:', error);
    return (
      <div className="min-h-screen bg-[#F9FAFB] p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-[#111827] mb-4">Erreur</h1>
          <p className="text-red-600">Impossible de charger les leads: {error.message}</p>
        </div>
      </div>
    );
  }

  // Type assertion pour les leads avec leurs catégories
  const leadsWithCategories = (leads || []).map((lead: any) => ({
    ...lead,
    categories: Array.isArray(lead.categories) ? lead.categories[0] || null : lead.categories || null,
  })) as LeadWithCategory[];

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-[#111827] mb-8">Gestion des Leads</h1>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nom
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Téléphone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Catégorie
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Langue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {leadsWithCategories.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                      Aucun lead trouvé
                    </td>
                  </tr>
                ) : (
                  leadsWithCategories.map((lead) => {
                    const categoryName = lead.categories
                      ? lead.categories.name_fr
                      : 'Non spécifiée';
                    
                    const createdAt = new Date(lead.created_at).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                    });

                    const statusColors: Record<string, string> = {
                      new: 'bg-blue-100 text-blue-800',
                      contacted: 'bg-yellow-100 text-yellow-800',
                      qualified: 'bg-purple-100 text-purple-800',
                      converted: 'bg-green-100 text-green-800',
                      archived: 'bg-gray-100 text-gray-800',
                    };

                    return (
                      <tr key={lead.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {createdAt}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {lead.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {lead.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {lead.phone}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {categoryName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 uppercase">
                          {lead.lang}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              statusColors[lead.status] || statusColors.new
                            }`}
                          >
                            {lead.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-500">
          Total: {leadsWithCategories.length} lead(s)
        </div>
      </div>
    </div>
  );
}

