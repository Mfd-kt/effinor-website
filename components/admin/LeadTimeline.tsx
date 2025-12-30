"use client";

import { useEffect, useState } from "react";
import { format, formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { 
  UserPlus, Edit, Mail, Phone, FileText, 
  CheckCircle, XCircle, Merge, Tag as TagIcon, Trash2
} from "lucide-react";
import { getLeadHistory, LeadHistoryEntry } from "@/lib/services/leadHistory";
import { Skeleton } from "@/components/ui/skeleton";

interface LeadTimelineProps {
  leadId: string;
}

export function LeadTimeline({ leadId }: LeadTimelineProps) {
  const [events, setEvents] = useState<LeadHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, [leadId]);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const history = await getLeadHistory(leadId);
      setEvents(history);
    } catch (error) {
      console.error('Error loading timeline:', error);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (type: LeadHistoryEntry['action']) => {
    const iconClass = "w-4 h-4";
    switch (type) {
      case 'created': return <UserPlus className={iconClass} />;
      case 'updated': return <Edit className={iconClass} />;
      case 'deleted': return <Trash2 className={iconClass} />;
      case 'email_sent': return <Mail className={iconClass} />;
      case 'call_made': return <Phone className={iconClass} />;
      case 'note_added': return <FileText className={iconClass} />;
      case 'status_changed': return <CheckCircle className={iconClass} />;
      case 'merged': return <Merge className={iconClass} />;
      default: return <TagIcon className={iconClass} />;
    }
  };

  const getIconColor = (type: LeadHistoryEntry['action']) => {
    switch (type) {
      case 'created': return 'bg-green-100 text-green-600';
      case 'updated': return 'bg-blue-100 text-blue-600';
      case 'deleted': return 'bg-red-100 text-red-600';
      case 'email_sent': return 'bg-purple-100 text-purple-600';
      case 'call_made': return 'bg-orange-100 text-orange-600';
      case 'note_added': return 'bg-gray-100 text-gray-600';
      case 'status_changed': return 'bg-effinor-emerald/10 text-effinor-emerald';
      case 'merged': return 'bg-yellow-100 text-yellow-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="flex gap-3">
            <Skeleton className="w-8 h-8 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
        <p>Aucun historique disponible</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <div key={event.id} className="flex gap-3">
          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${getIconColor(event.action)}`}>
            {getIcon(event.action)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-medium text-gray-900">{event.description}</p>
              <span className="text-xs text-gray-500 whitespace-nowrap">
                {formatDistanceToNow(event.timestamp, { addSuffix: true, locale: fr })}
              </span>
            </div>
            {event.field && (event.oldValue || event.newValue) && (
              <div className="mt-1 text-xs text-gray-500">
                {event.oldValue && (
                  <span className="line-through text-red-500 mr-2">{event.oldValue}</span>
                )}
                {event.newValue && (
                  <span className="text-green-600">{event.newValue}</span>
                )}
              </div>
            )}
            <p className="text-xs text-gray-400 mt-1">
              {format(event.timestamp, 'dd MMM yyyy à HH:mm', { locale: fr })}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}



