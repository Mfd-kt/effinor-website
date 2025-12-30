"use client";

import { useState, useEffect } from "react";
import { Calendar, Clock, Bell, Plus, Check, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { format, formatDistanceToNow, isPast, isToday } from "date-fns";
import { fr } from "date-fns/locale";
import { 
  getLeadReminders, 
  createLeadReminder, 
  completeReminder, 
  deleteReminder,
  LeadReminder 
} from "@/lib/services/leadReminders";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";

interface LeadRemindersProps {
  leadId: string;
}

export function LeadReminders({ leadId }: LeadRemindersProps) {
  const { addToast } = useToast();
  const [reminders, setReminders] = useState<LeadReminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newReminder, setNewReminder] = useState({ 
    title: '', 
    description: '', 
    dueDate: '',
    dueTime: ''
  });

  useEffect(() => {
    loadReminders();
  }, [leadId]);

  const loadReminders = async () => {
    try {
      setLoading(true);
      const data = await getLeadReminders(leadId);
      setReminders(data);
    } catch (error) {
      console.error('Error loading reminders:', error);
      addToast({
        title: "Erreur",
        description: "Impossible de charger les rappels",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddReminder = async () => {
    if (!newReminder.title.trim() || !newReminder.dueDate) {
      addToast({
        title: "Erreur",
        description: "Veuillez remplir le titre et la date",
        variant: "destructive",
      });
      return;
    }

    try {
      const dateTime = newReminder.dueTime 
        ? `${newReminder.dueDate}T${newReminder.dueTime}`
        : `${newReminder.dueDate}T09:00`;
      
      await createLeadReminder(
        leadId,
        newReminder.title,
        new Date(dateTime),
        newReminder.description || undefined
      );
      
      await loadReminders();
      setNewReminder({ title: '', description: '', dueDate: '', dueTime: '' });
      setShowForm(false);
      addToast({
        title: "Succès",
        description: "Rappel créé avec succès",
        variant: "success",
      });
    } catch (error) {
      addToast({
        title: "Erreur",
        description: "Impossible de créer le rappel",
        variant: "destructive",
      });
    }
  };

  const handleComplete = async (reminderId: string) => {
    try {
      await completeReminder(reminderId);
      await loadReminders();
    } catch (error) {
      addToast({
        title: "Erreur",
        description: "Impossible de marquer le rappel comme terminé",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (reminderId: string) => {
    try {
      await deleteReminder(reminderId);
      await loadReminders();
    } catch (error) {
      addToast({
        title: "Erreur",
        description: "Impossible de supprimer le rappel",
        variant: "destructive",
      });
    }
  };

  const getReminderStatus = (reminder: LeadReminder) => {
    if (reminder.completed) return 'completed';
    if (isPast(reminder.dueDate) && !isToday(reminder.dueDate)) return 'overdue';
    if (isToday(reminder.dueDate)) return 'today';
    return 'upcoming';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-gray-100 border-gray-200';
      case 'overdue': return 'bg-red-50 border-red-200';
      case 'today': return 'bg-yellow-50 border-yellow-200';
      default: return 'bg-blue-50 border-blue-200';
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2].map(i => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    );
  }

  const activeReminders = reminders.filter(r => !r.completed);
  const completedReminders = reminders.filter(r => r.completed);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-effinor-emerald" />
          <h3 className="font-semibold">Rappels</h3>
          {activeReminders.length > 0 && (
            <span className="text-xs bg-effinor-emerald text-white px-2 py-0.5 rounded-full">
              {activeReminders.length}
            </span>
          )}
        </div>
        <Button
          size="sm"
          onClick={() => setShowForm(!showForm)}
          className="bg-effinor-emerald hover:bg-effinor-emerald/90"
        >
          <Plus className="w-4 h-4 mr-1" />
          Ajouter
        </Button>
      </div>

      {showForm && (
        <div className="p-4 bg-gray-50 rounded-lg space-y-3">
          <Input
            placeholder="Titre du rappel"
            value={newReminder.title}
            onChange={(e) => setNewReminder({...newReminder, title: e.target.value})}
          />
          <Input
            placeholder="Description (optionnel)"
            value={newReminder.description}
            onChange={(e) => setNewReminder({...newReminder, description: e.target.value})}
          />
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="date"
              value={newReminder.dueDate}
              onChange={(e) => setNewReminder({...newReminder, dueDate: e.target.value})}
            />
            <Input
              type="time"
              value={newReminder.dueTime}
              onChange={(e) => setNewReminder({...newReminder, dueTime: e.target.value})}
            />
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleAddReminder}
              className="flex-1 bg-effinor-emerald hover:bg-effinor-emerald/90"
            >
              Créer
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setShowForm(false);
                setNewReminder({ title: '', description: '', dueDate: '', dueTime: '' });
              }}
            >
              Annuler
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {activeReminders.map(reminder => {
          const status = getReminderStatus(reminder);
          return (
            <div
              key={reminder.id}
              className={`p-3 rounded-lg border ${getStatusColor(status)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">{reminder.title}</h4>
                    {status === 'overdue' && (
                      <span className="text-xs bg-red-600 text-white px-2 py-0.5 rounded">
                        En retard
                      </span>
                    )}
                    {status === 'today' && (
                      <span className="text-xs bg-yellow-600 text-white px-2 py-0.5 rounded">
                        Aujourd'hui
                      </span>
                    )}
                  </div>
                  {reminder.description && (
                    <p className="text-sm text-gray-600 mb-1">{reminder.description}</p>
                  )}
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>
                      {format(reminder.dueDate, 'dd MMM yyyy à HH:mm', { locale: fr })}
                    </span>
                    <span className="text-gray-400">•</span>
                    <span>
                      {formatDistanceToNow(reminder.dueDate, { addSuffix: true, locale: fr })}
                    </span>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleComplete(reminder.id)}
                    className="h-8 w-8 p-0"
                  >
                    <Check className="w-4 h-4 text-green-600" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(reminder.id)}
                    className="h-8 w-8 p-0"
                  >
                    <X className="w-4 h-4 text-red-600" />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}

        {activeReminders.length === 0 && !showForm && (
          <div className="text-center py-4 text-gray-400">
            <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Aucun rappel actif</p>
          </div>
        )}
      </div>

      {completedReminders.length > 0 && (
        <details className="mt-4">
          <summary className="text-sm text-gray-500 cursor-pointer">
            {completedReminders.length} rappel{completedReminders.length > 1 ? 's' : ''} terminé{completedReminders.length > 1 ? 's' : ''}
          </summary>
          <div className="mt-2 space-y-2">
            {completedReminders.map(reminder => (
              <div
                key={reminder.id}
                className="p-3 rounded-lg border bg-gray-50 border-gray-200 opacity-60"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium line-through">{reminder.title}</h4>
                    <p className="text-xs text-gray-500">
                      Terminé le {reminder.completedAt && format(reminder.completedAt, 'dd MMM yyyy', { locale: fr })}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(reminder.id)}
                    className="h-8 w-8 p-0"
                  >
                    <X className="w-4 h-4 text-red-600" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </details>
      )}
    </div>
  );
}



