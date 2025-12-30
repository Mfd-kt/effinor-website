'use client';

import { useState } from 'react';
import { Dictionary } from '@/types';
import { Step5BuildingDetails, BuildingDetails, BuildingType } from '@/types/detailed-form';
import { FileText, Thermometer, Lightbulb } from 'lucide-react';

interface Step5BuildingDetailsProps {
  dict: Dictionary;
  data: Step5BuildingDetails;
  onChange: (data: Step5BuildingDetails) => void;
  errors?: Record<string, string>;
}

const BUILDING_TYPES: BuildingType[] = ['entrepot', 'bureau', 'usine', 'commerce', 'autre'];

export default function Step5BuildingDetailsComponent({
  dict,
  data,
  onChange,
  errors,
}: Step5BuildingDetailsProps) {
  const [currentBuildingIndex, setCurrentBuildingIndex] = useState(0);

  const handleBuildingChange = (index: number, field: keyof BuildingDetails, value: any) => {
    const newBuildings = [...data.buildings];
    if (field === 'general' || field === 'heating' || field === 'lighting') {
      newBuildings[index] = {
        ...newBuildings[index],
        [field]: {
          ...newBuildings[index][field],
          ...value,
        },
      };
    } else {
      newBuildings[index] = {
        ...newBuildings[index],
        [field]: value,
      };
    }
    onChange({
      ...data,
      buildings: newBuildings,
    });
  };

  const currentBuilding = data.buildings[currentBuildingIndex] || {
    general: { type: 'entrepot' as BuildingType, surface: 0, height: null },
    heating: { isHeated: false, mode: null, power: null, setpoint: null },
    lighting: {
      neon: { enabled: false, count: null, power: null },
      doubleNeon: { enabled: false, count: null, power: null },
      halogen: { enabled: false, count: null, power: null },
    },
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-[#10B981] rounded-full flex items-center justify-center mx-auto mb-4">
          <FileText className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-[#111827] mb-2">
          {dict.detailedForm.step5.title}
        </h2>
        <p className="text-[#6B7280]">
          {dict.detailedForm.step5.buildingNumber
            .replace('{number}', String(currentBuildingIndex + 1))
            .replace('{total}', String(data.buildings.length))}
        </p>
      </div>

      {/* Navigation entre bâtiments */}
      {data.buildings.length > 1 && (
        <div className="mb-6">
          <div className="flex justify-center gap-2 mb-4">
            {data.buildings.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentBuildingIndex(index)}
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                  index === currentBuildingIndex
                    ? 'bg-[#10B981] text-white'
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
          {/* Boutons Précédent/Suivant pour naviguer entre bâtiments */}
          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={() => {
                if (currentBuildingIndex > 0) {
                  setCurrentBuildingIndex(currentBuildingIndex - 1);
                }
              }}
              disabled={currentBuildingIndex === 0}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentBuildingIndex === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              ← Précédent
            </button>
            <span className="text-sm text-gray-600">
              Bâtiment {currentBuildingIndex + 1} sur {data.buildings.length}
            </span>
            <button
              type="button"
              onClick={() => {
                if (currentBuildingIndex < data.buildings.length - 1) {
                  setCurrentBuildingIndex(currentBuildingIndex + 1);
                }
              }}
              disabled={currentBuildingIndex === data.buildings.length - 1}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentBuildingIndex === data.buildings.length - 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Suivant →
            </button>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* Informations générales */}
        <div className="border border-gray-200 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-[#10B981]" />
            <h3 className="font-semibold text-[#111827]">
              {dict.detailedForm.step5.general.title}
            </h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-[#111827] mb-1">
                {dict.detailedForm.step5.general.type}
              </label>
              <select
                value={currentBuilding.general.type}
                onChange={(e) =>
                  handleBuildingChange(currentBuildingIndex, 'general', {
                    type: e.target.value as BuildingType,
                  })
                }
                className="w-full rounded-xl border-2 border-gray-400 px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981]"
              >
                <option value="">{dict.detailedForm.step5.general.selectType}</option>
                {BUILDING_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {dict.detailedForm.step5.general.types[type]}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#111827] mb-1">
                  {dict.detailedForm.step5.general.surface}
                </label>
                <input
                  type="number"
                  value={currentBuilding.general.surface || ''}
                  onChange={(e) =>
                    handleBuildingChange(currentBuildingIndex, 'general', {
                      surface: Number(e.target.value),
                    })
                  }
                  placeholder={dict.detailedForm.step5.general.surfacePlaceholder}
                  className="w-full rounded-xl border-2 border-gray-400 px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#111827] mb-1">
                  {dict.detailedForm.step5.general.height}
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={currentBuilding.general.height || ''}
                  onChange={(e) =>
                    handleBuildingChange(currentBuildingIndex, 'general', {
                      height: e.target.value ? Number(e.target.value) : null,
                    })
                  }
                  placeholder={dict.detailedForm.step5.general.heightPlaceholder}
                  className="w-full rounded-xl border-2 border-gray-400 px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Chauffage */}
        <div className="border border-gray-200 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Thermometer className="w-5 h-5 text-[#10B981]" />
            <h3 className="font-semibold text-[#111827]">
              {dict.detailedForm.step5.heating.title}
            </h3>
          </div>

          <div className="space-y-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={currentBuilding.heating.isHeated}
                onChange={(e) =>
                  handleBuildingChange(currentBuildingIndex, 'heating', {
                    isHeated: e.target.checked,
                  })
                }
                className="w-5 h-5 text-[#10B981] rounded border-gray-300 focus:ring-[#10B981]"
              />
              <span className="text-sm font-medium text-[#111827]">
                {dict.detailedForm.step5.heating.isHeated}
              </span>
            </label>

            {currentBuilding.heating.isHeated && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-[#111827] mb-1">
                    {dict.detailedForm.step5.heating.mode}
                  </label>
                  <select
                    value={currentBuilding.heating.mode || ''}
                    onChange={(e) =>
                      handleBuildingChange(currentBuildingIndex, 'heating', {
                        mode: e.target.value || null,
                      })
                    }
                    className="w-full rounded-xl border-2 border-gray-400 px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981]"
                  >
                    <option value="">{dict.detailedForm.step5.heating.selectMode}</option>
                    <option value="electric">Électrique</option>
                    <option value="gas">Gaz</option>
                    <option value="heat-pump">Pompe à chaleur</option>
                    <option value="other">Autre</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#111827] mb-1">
                      {dict.detailedForm.step5.heating.power}
                    </label>
                    <input
                      type="number"
                      value={currentBuilding.heating.power || ''}
                      onChange={(e) =>
                        handleBuildingChange(currentBuildingIndex, 'heating', {
                          power: e.target.value ? Number(e.target.value) : null,
                        })
                      }
                      placeholder={dict.detailedForm.step5.heating.powerPlaceholder}
                      className="w-full rounded-xl border-2 border-gray-400 px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#111827] mb-1">
                      {dict.detailedForm.step5.heating.setpoint}
                    </label>
                    <input
                      type="number"
                      value={currentBuilding.heating.setpoint || ''}
                      onChange={(e) =>
                        handleBuildingChange(currentBuildingIndex, 'heating', {
                          setpoint: e.target.value ? Number(e.target.value) : null,
                        })
                      }
                      placeholder={dict.detailedForm.step5.heating.setpointPlaceholder}
                      className="w-full rounded-xl border-2 border-gray-400 px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981]"
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Éclairage intérieur */}
        <div className="border border-gray-200 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5 text-[#10B981]" />
            <h3 className="font-semibold text-[#111827]">
              {dict.detailedForm.step5.lighting.title}
            </h3>
          </div>

          <div className="space-y-4">
            {/* Néon */}
            <div className="border border-gray-200 rounded-lg p-4">
              <label className="flex items-center gap-2 cursor-pointer mb-3">
                <input
                  type="checkbox"
                  checked={currentBuilding.lighting.neon.enabled}
                  onChange={(e) =>
                    handleBuildingChange(currentBuildingIndex, 'lighting', {
                      neon: {
                        ...currentBuilding.lighting.neon,
                        enabled: e.target.checked,
                      },
                    })
                  }
                  className="w-5 h-5 text-[#10B981] rounded border-gray-300 focus:ring-[#10B981]"
                />
                <span className="text-sm font-medium text-[#111827]">
                  {dict.detailedForm.step5.lighting.neon.label}
                </span>
              </label>
              {currentBuilding.lighting.neon.enabled && (
                <div className="grid grid-cols-2 gap-4 mt-3">
                  <div>
                    <label className="block text-sm text-[#6B7280] mb-1">
                      {dict.detailedForm.step5.lighting.neon.count}
                    </label>
                    <input
                      type="number"
                      value={currentBuilding.lighting.neon.count || ''}
                      onChange={(e) =>
                        handleBuildingChange(currentBuildingIndex, 'lighting', {
                          neon: {
                            ...currentBuilding.lighting.neon,
                            count: e.target.value ? Number(e.target.value) : null,
                          },
                        })
                      }
                      placeholder={dict.detailedForm.step5.lighting.neon.countPlaceholder}
                      className="w-full rounded-lg border-2 border-gray-400 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-[#6B7280] mb-1">
                      {dict.detailedForm.step5.lighting.neon.power}
                    </label>
                    <input
                      type="number"
                      value={currentBuilding.lighting.neon.power || ''}
                      onChange={(e) =>
                        handleBuildingChange(currentBuildingIndex, 'lighting', {
                          neon: {
                            ...currentBuilding.lighting.neon,
                            power: e.target.value ? Number(e.target.value) : null,
                          },
                        })
                      }
                      placeholder={dict.detailedForm.step5.lighting.neon.powerPlaceholder}
                      className="w-full rounded-lg border-2 border-gray-400 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Double néon */}
            <div className="border border-gray-200 rounded-lg p-4">
              <label className="flex items-center gap-2 cursor-pointer mb-3">
                <input
                  type="checkbox"
                  checked={currentBuilding.lighting.doubleNeon.enabled}
                  onChange={(e) =>
                    handleBuildingChange(currentBuildingIndex, 'lighting', {
                      doubleNeon: {
                        ...currentBuilding.lighting.doubleNeon,
                        enabled: e.target.checked,
                      },
                    })
                  }
                  className="w-5 h-5 text-[#10B981] rounded border-gray-300 focus:ring-[#10B981]"
                />
                <span className="text-sm font-medium text-[#111827]">
                  {dict.detailedForm.step5.lighting.doubleNeon.label}
                </span>
              </label>
              {currentBuilding.lighting.doubleNeon.enabled && (
                <div className="grid grid-cols-2 gap-4 mt-3">
                  <div>
                    <label className="block text-sm text-[#6B7280] mb-1">
                      {dict.detailedForm.step5.lighting.doubleNeon.count}
                    </label>
                    <input
                      type="number"
                      value={currentBuilding.lighting.doubleNeon.count || ''}
                      onChange={(e) =>
                        handleBuildingChange(currentBuildingIndex, 'lighting', {
                          doubleNeon: {
                            ...currentBuilding.lighting.doubleNeon,
                            count: e.target.value ? Number(e.target.value) : null,
                          },
                        })
                      }
                      placeholder={dict.detailedForm.step5.lighting.doubleNeon.countPlaceholder}
                      className="w-full rounded-lg border-2 border-gray-400 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-[#6B7280] mb-1">
                      {dict.detailedForm.step5.lighting.doubleNeon.power}
                    </label>
                    <input
                      type="number"
                      value={currentBuilding.lighting.doubleNeon.power || ''}
                      onChange={(e) =>
                        handleBuildingChange(currentBuildingIndex, 'lighting', {
                          doubleNeon: {
                            ...currentBuilding.lighting.doubleNeon,
                            power: e.target.value ? Number(e.target.value) : null,
                          },
                        })
                      }
                      placeholder={dict.detailedForm.step5.lighting.doubleNeon.powerPlaceholder}
                      className="w-full rounded-lg border-2 border-gray-400 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Halogène */}
            <div className="border border-gray-200 rounded-lg p-4">
              <label className="flex items-center gap-2 cursor-pointer mb-3">
                <input
                  type="checkbox"
                  checked={currentBuilding.lighting.halogen.enabled}
                  onChange={(e) =>
                    handleBuildingChange(currentBuildingIndex, 'lighting', {
                      halogen: {
                        ...currentBuilding.lighting.halogen,
                        enabled: e.target.checked,
                      },
                    })
                  }
                  className="w-5 h-5 text-[#10B981] rounded border-gray-300 focus:ring-[#10B981]"
                />
                <span className="text-sm font-medium text-[#111827]">
                  {dict.detailedForm.step5.lighting.halogen.label}
                </span>
              </label>
              {currentBuilding.lighting.halogen.enabled && (
                <div className="grid grid-cols-2 gap-4 mt-3">
                  <div>
                    <label className="block text-sm text-[#6B7280] mb-1">
                      {dict.detailedForm.step5.lighting.halogen.count}
                    </label>
                    <input
                      type="number"
                      value={currentBuilding.lighting.halogen.count || ''}
                      onChange={(e) =>
                        handleBuildingChange(currentBuildingIndex, 'lighting', {
                          halogen: {
                            ...currentBuilding.lighting.halogen,
                            count: e.target.value ? Number(e.target.value) : null,
                          },
                        })
                      }
                      placeholder={dict.detailedForm.step5.lighting.halogen.countPlaceholder}
                      className="w-full rounded-lg border-2 border-gray-400 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-[#6B7280] mb-1">
                      {dict.detailedForm.step5.lighting.halogen.power}
                    </label>
                    <input
                      type="number"
                      value={currentBuilding.lighting.halogen.power || ''}
                      onChange={(e) =>
                        handleBuildingChange(currentBuildingIndex, 'lighting', {
                          halogen: {
                            ...currentBuilding.lighting.halogen,
                            power: e.target.value ? Number(e.target.value) : null,
                          },
                        })
                      }
                      placeholder={dict.detailedForm.step5.lighting.halogen.powerPlaceholder}
                      className="w-full rounded-lg border-2 border-gray-400 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

