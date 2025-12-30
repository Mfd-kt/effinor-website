'use client';

import { useState } from 'react';
import { Building, Thermometer, Lightbulb, Edit2, Trash2, Plus, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Select } from '@/components/ui/select';

interface BuildingData {
  general: {
    type?: string;
    surface?: number;
    height?: number;
  };
  heating?: {
    isHeated?: boolean;
    mode?: string;
    power?: number;
    setpoint?: number;
  };
  lighting?: {
    neon?: { enabled?: boolean; count?: number; power?: number };
    doubleNeon?: { enabled?: boolean; count?: number; power?: number };
    halogen?: { enabled?: boolean; count?: number; power?: number };
  };
}

interface BuildingEditorProps {
  buildings: BuildingData[];
  onSave: (buildings: BuildingData[]) => Promise<void>;
}

const BUILDING_TYPES = [
  { value: 'entrepot', label: 'Entrepôt' },
  { value: 'bureau', label: 'Bureau' },
  { value: 'usine', label: 'Usine' },
  { value: 'commerce', label: 'Commerce' },
  { value: 'autre', label: 'Autre' },
];

const HEATING_MODES = [
  { value: 'gas', label: 'Gaz' },
  { value: 'electric', label: 'Électrique' },
  { value: 'oil', label: 'Fioul' },
  { value: 'heat_pump', label: 'Pompe à chaleur' },
  { value: 'other', label: 'Autre' },
];

export default function BuildingEditor({ buildings: initialBuildings, onSave }: BuildingEditorProps) {
  const [buildings, setBuildings] = useState<BuildingData[]>(initialBuildings || []);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [saving, setSaving] = useState(false);

  const defaultBuilding: BuildingData = {
    general: { type: 'entrepot', surface: 0, height: 0 },
    heating: { isHeated: false, mode: '', power: 0, setpoint: 0 },
    lighting: {
      neon: { enabled: false, count: 0, power: 0 },
      doubleNeon: { enabled: false, count: 0, power: 0 },
      halogen: { enabled: false, count: 0, power: 0 },
    },
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setIsAdding(false);
  };

  const handleAdd = () => {
    setBuildings([...buildings, { ...defaultBuilding }]);
    setEditingIndex(buildings.length);
    setIsAdding(true);
  };

  const handleDelete = (index: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce bâtiment ?')) {
      const newBuildings = buildings.filter((_, i) => i !== index);
      setBuildings(newBuildings);
      if (editingIndex === index) {
        setEditingIndex(null);
      } else if (editingIndex !== null && editingIndex > index) {
        setEditingIndex(editingIndex - 1);
      }
      handleSave(newBuildings);
    }
  };

  const handleCancel = () => {
    setEditingIndex(null);
    setIsAdding(false);
    setBuildings(initialBuildings || []);
  };

  const handleBuildingChange = (
    index: number,
    section: 'general' | 'heating' | 'lighting',
    field: string,
    value: any
  ) => {
    const newBuildings = [...buildings];
    const building = { ...newBuildings[index] };

    if (section === 'general') {
      building.general = { ...building.general, [field]: value };
    } else if (section === 'heating') {
      building.heating = { ...building.heating, [field]: value };
    } else if (section === 'lighting') {
      const lightingType = field.split('.')[0]; // 'neon', 'doubleNeon', 'halogen'
      const lightingField = field.split('.')[1]; // 'enabled', 'count', 'power'
      building.lighting = {
        ...building.lighting,
        [lightingType]: {
          ...building.lighting?.[lightingType as keyof typeof building.lighting],
          [lightingField]: value,
        },
      };
    }

    newBuildings[index] = building;
    setBuildings(newBuildings);
  };

  const handleSave = async (buildingsToSave?: BuildingData[]) => {
    const buildingsToUpdate = buildingsToSave || buildings;
    setSaving(true);
    try {
      await onSave(buildingsToUpdate);
      setEditingIndex(null);
      setIsAdding(false);
    } catch (error) {
      console.error('Error saving buildings:', error);
      alert('Erreur lors de la sauvegarde des bâtiments');
    } finally {
      setSaving(false);
    }
  };

  const renderBuildingForm = (building: BuildingData, index: number) => {
    return (
      <div className="space-y-6">
        {/* Informations générales */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold flex items-center gap-2">
            <Building className="w-4 h-4" />
            Informations générales
          </h4>
          <div className="grid grid-cols-2 gap-4 pl-6">
            <div>
              <Label>Type de bâtiment</Label>
              <Select
                value={building.general?.type || 'entrepot'}
                onChange={(e) =>
                  handleBuildingChange(index, 'general', 'type', e.target.value)
                }
              >
                {BUILDING_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label>Surface (m²)</Label>
              <Input
                type="number"
                value={building.general?.surface || ''}
                onChange={(e) =>
                  handleBuildingChange(
                    index,
                    'general',
                    'surface',
                    parseFloat(e.target.value) || 0
                  )
                }
              />
            </div>
            <div>
              <Label>Hauteur (m)</Label>
              <Input
                type="number"
                step="0.1"
                value={building.general?.height || ''}
                onChange={(e) =>
                  handleBuildingChange(
                    index,
                    'general',
                    'height',
                    parseFloat(e.target.value) || 0
                  )
                }
              />
            </div>
          </div>
        </div>

        {/* Chauffage */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold flex items-center gap-2">
            <Thermometer className="w-4 h-4" />
            Chauffage
          </h4>
          <div className="pl-6 space-y-4">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={building.heating?.isHeated || false}
                onChange={(e) =>
                  handleBuildingChange(index, 'heating', 'isHeated', e.target.checked)
                }
              />
              <Label>Ce bâtiment est chauffé</Label>
            </div>
            {building.heating?.isHeated && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Mode de chauffage</Label>
                  <Select
                    value={building.heating?.mode || ''}
                    onChange={(e) =>
                      handleBuildingChange(index, 'heating', 'mode', e.target.value)
                    }
                  >
                    <option value="">Sélectionner</option>
                    {HEATING_MODES.map((mode) => (
                      <option key={mode.value} value={mode.value}>
                        {mode.label}
                      </option>
                    ))}
                  </Select>
                </div>
                <div>
                  <Label>Puissance (kW)</Label>
                  <Input
                    type="number"
                    value={building.heating?.power || ''}
                    onChange={(e) =>
                      handleBuildingChange(
                        index,
                        'heating',
                        'power',
                        parseFloat(e.target.value) || 0
                      )
                    }
                  />
                </div>
                <div>
                  <Label>Consigne (°C)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={building.heating?.setpoint || ''}
                    onChange={(e) =>
                      handleBuildingChange(
                        index,
                        'heating',
                        'setpoint',
                        parseFloat(e.target.value) || 0
                      )
                    }
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Éclairage intérieur */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            Éclairage intérieur
          </h4>
          <div className="pl-6 space-y-4">
            {/* Néon */}
            <div className="border border-gray-200 rounded-md p-4">
              <div className="flex items-center gap-2 mb-3">
                <Checkbox
                  checked={building.lighting?.neon?.enabled || false}
                  onChange={(e) =>
                    handleBuildingChange(index, 'lighting', 'neon.enabled', e.target.checked)
                  }
                />
                <Label className="font-medium">Néon</Label>
              </div>
              {building.lighting?.neon?.enabled && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Nombre</Label>
                    <Input
                      type="number"
                      value={building.lighting?.neon?.count || ''}
                      onChange={(e) =>
                        handleBuildingChange(
                          index,
                          'lighting',
                          'neon.count',
                          parseInt(e.target.value) || 0
                        )
                      }
                    />
                  </div>
                  <div>
                    <Label>Puissance (W)</Label>
                    <Input
                      type="number"
                      value={building.lighting?.neon?.power || ''}
                      onChange={(e) =>
                        handleBuildingChange(
                          index,
                          'lighting',
                          'neon.power',
                          parseFloat(e.target.value) || 0
                        )
                      }
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Double néon */}
            <div className="border border-gray-200 rounded-md p-4">
              <div className="flex items-center gap-2 mb-3">
                <Checkbox
                  checked={building.lighting?.doubleNeon?.enabled || false}
                  onChange={(e) =>
                    handleBuildingChange(
                      index,
                      'lighting',
                      'doubleNeon.enabled',
                      e.target.checked
                    )
                  }
                />
                <Label className="font-medium">Double néon</Label>
              </div>
              {building.lighting?.doubleNeon?.enabled && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Nombre</Label>
                    <Input
                      type="number"
                      value={building.lighting?.doubleNeon?.count || ''}
                      onChange={(e) =>
                        handleBuildingChange(
                          index,
                          'lighting',
                          'doubleNeon.count',
                          parseInt(e.target.value) || 0
                        )
                      }
                    />
                  </div>
                  <div>
                    <Label>Puissance (W)</Label>
                    <Input
                      type="number"
                      value={building.lighting?.doubleNeon?.power || ''}
                      onChange={(e) =>
                        handleBuildingChange(
                          index,
                          'lighting',
                          'doubleNeon.power',
                          parseFloat(e.target.value) || 0
                        )
                      }
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Halogène */}
            <div className="border border-gray-200 rounded-md p-4">
              <div className="flex items-center gap-2 mb-3">
                <Checkbox
                  checked={building.lighting?.halogen?.enabled || false}
                  onChange={(e) =>
                    handleBuildingChange(index, 'lighting', 'halogen.enabled', e.target.checked)
                  }
                />
                <Label className="font-medium">Halogène</Label>
              </div>
              {building.lighting?.halogen?.enabled && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Nombre</Label>
                    <Input
                      type="number"
                      value={building.lighting?.halogen?.count || ''}
                      onChange={(e) =>
                        handleBuildingChange(
                          index,
                          'lighting',
                          'halogen.count',
                          parseInt(e.target.value) || 0
                        )
                      }
                    />
                  </div>
                  <div>
                    <Label>Puissance (W)</Label>
                    <Input
                      type="number"
                      value={building.lighting?.halogen?.power || ''}
                      onChange={(e) =>
                        handleBuildingChange(
                          index,
                          'lighting',
                          'halogen.power',
                          parseFloat(e.target.value) || 0
                        )
                      }
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderBuildingView = (building: BuildingData, index: number) => {
    return (
      <div className="space-y-4">
        {/* Informations générales */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold flex items-center gap-2">
            <Building className="w-4 h-4" />
            Informations générales
          </h4>
          <div className="grid grid-cols-2 gap-4 pl-6">
            <div>
              <Label className="text-xs text-gray-500">Type de bâtiment</Label>
              <p className="text-sm mt-1">
                {BUILDING_TYPES.find((t) => t.value === building.general?.type)?.label || '-'}
              </p>
            </div>
            <div>
              <Label className="text-xs text-gray-500">Surface (m²)</Label>
              <p className="text-sm mt-1">{building.general?.surface || '-'} m²</p>
            </div>
            {building.general?.height && (
              <div>
                <Label className="text-xs text-gray-500">Hauteur (m)</Label>
                <p className="text-sm mt-1">{building.general.height} m</p>
              </div>
            )}
          </div>
        </div>

        {/* Chauffage */}
        {building.heating && (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold flex items-center gap-2">
              <Thermometer className="w-4 h-4" />
              Chauffage
            </h4>
            <div className="pl-6 space-y-2">
              <p className="text-sm">
                Ce bâtiment est chauffé :{' '}
                <span className="font-semibold">
                  {building.heating.isHeated ? 'Oui' : 'Non'}
                </span>
              </p>
              {building.heating.isHeated && (
                <div className="grid grid-cols-2 gap-4 mt-3">
                  {building.heating.mode && (
                    <div>
                      <Label className="text-xs text-gray-500">Mode de chauffage</Label>
                      <p className="text-sm mt-1">
                        {HEATING_MODES.find((m) => m.value === building.heating?.mode)?.label ||
                          building.heating.mode}
                      </p>
                    </div>
                  )}
                  {building.heating.power && (
                    <div>
                      <Label className="text-xs text-gray-500">Puissance (kW)</Label>
                      <p className="text-sm mt-1">{building.heating.power} kW</p>
                    </div>
                  )}
                  {building.heating.setpoint && (
                    <div>
                      <Label className="text-xs text-gray-500">Consigne (°C)</Label>
                      <p className="text-sm mt-1">{building.heating.setpoint} °C</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Éclairage intérieur */}
        {building.lighting && (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              Éclairage intérieur
            </h4>
            <div className="pl-6 space-y-3">
              {building.lighting.neon?.enabled && (
                <div className="border border-gray-200 rounded-md p-3">
                  <p className="text-sm font-medium mb-2">Néon</p>
                  <div className="grid grid-cols-2 gap-4">
                    {building.lighting.neon.count && (
                      <div>
                        <Label className="text-xs text-gray-500">Nombre</Label>
                        <p className="text-sm mt-1">{building.lighting.neon.count}</p>
                      </div>
                    )}
                    {building.lighting.neon.power && (
                      <div>
                        <Label className="text-xs text-gray-500">Puissance (W)</Label>
                        <p className="text-sm mt-1">{building.lighting.neon.power} W</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {building.lighting.doubleNeon?.enabled && (
                <div className="border border-gray-200 rounded-md p-3">
                  <p className="text-sm font-medium mb-2">Double néon</p>
                  <div className="grid grid-cols-2 gap-4">
                    {building.lighting.doubleNeon.count && (
                      <div>
                        <Label className="text-xs text-gray-500">Nombre</Label>
                        <p className="text-sm mt-1">{building.lighting.doubleNeon.count}</p>
                      </div>
                    )}
                    {building.lighting.doubleNeon.power && (
                      <div>
                        <Label className="text-xs text-gray-500">Puissance (W)</Label>
                        <p className="text-sm mt-1">{building.lighting.doubleNeon.power} W</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {building.lighting.halogen?.enabled && (
                <div className="border border-gray-200 rounded-md p-3">
                  <p className="text-sm font-medium mb-2">Halogène</p>
                  <div className="grid grid-cols-2 gap-4">
                    {building.lighting.halogen.count && (
                      <div>
                        <Label className="text-xs text-gray-500">Nombre</Label>
                        <p className="text-sm mt-1">{building.lighting.halogen.count}</p>
                      </div>
                    )}
                    {building.lighting.halogen.power && (
                      <div>
                        <Label className="text-xs text-gray-500">Puissance (W)</Label>
                        <p className="text-sm mt-1">{building.lighting.halogen.power} W</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Détails des bâtiments</CardTitle>
            <CardDescription>
              Informations détaillées sur les bâtiments à analyser
            </CardDescription>
          </div>
          {editingIndex === null && (
            <Button onClick={handleAdd} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Ajouter un bâtiment
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {buildings.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Building className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Aucun bâtiment enregistré</p>
            <Button onClick={handleAdd} className="mt-4" variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Ajouter le premier bâtiment
            </Button>
          </div>
        ) : (
          buildings.map((building, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-5 space-y-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Building className="w-5 h-5 text-[#10B981]" />
                  <h3 className="font-semibold">
                    Bâtiment {index + 1} sur {buildings.length}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  {editingIndex === index ? (
                    <>
                      <Button
                        onClick={() => handleSave()}
                        size="sm"
                        disabled={saving}
                        variant="default"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        {saving ? 'Enregistrement...' : 'Enregistrer'}
                      </Button>
                      <Button onClick={handleCancel} size="sm" variant="outline">
                        <X className="w-4 h-4 mr-2" />
                        Annuler
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        onClick={() => handleEdit(index)}
                        size="sm"
                        variant="outline"
                      >
                        <Edit2 className="w-4 h-4 mr-2" />
                        Modifier
                      </Button>
                      <Button
                        onClick={() => handleDelete(index)}
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Supprimer
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {editingIndex === index
                ? renderBuildingForm(building, index)
                : renderBuildingView(building, index)}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

