'use client';

import { Dictionary } from '@/types';
import { DetailedFormData } from '@/types/detailed-form';
import { CheckCircle } from 'lucide-react';

interface Step6SummaryProps {
  dict: Dictionary;
  data: DetailedFormData;
}

export default function Step6SummaryComponent({ dict, data }: Step6SummaryProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-[#10B981] rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-[#111827] mb-2">
          {dict.detailedForm.step6.title}
        </h2>
        <p className="text-[#6B7280]">
          {dict.detailedForm.step6.subtitle}
        </p>
      </div>

      <div className="space-y-6">
        {/* Informations entreprise */}
        <div className="border border-gray-200 rounded-xl p-6">
          <h3 className="font-semibold text-[#111827] mb-4">
            {dict.detailedForm.step6.companyInfo}
          </h3>
          <div className="space-y-2 text-sm text-[#6B7280]">
            <p><strong className="text-[#111827]">Nom:</strong> {data.step1.companyName}</p>
            <p><strong className="text-[#111827]">SIRET:</strong> {data.step1.siret}</p>
            <p><strong className="text-[#111827]">Adresse:</strong> {data.step1.address}</p>
            <p><strong className="text-[#111827]">Code postal:</strong> {data.step1.postalCode}</p>
            <p><strong className="text-[#111827]">Ville:</strong> {data.step1.city}</p>
          </div>
        </div>

        {/* Contact principal */}
        <div className="border border-gray-200 rounded-xl p-6">
          <h3 className="font-semibold text-[#111827] mb-4">
            {dict.detailedForm.step6.mainContact}
          </h3>
          <div className="space-y-2 text-sm text-[#6B7280]">
            <p><strong className="text-[#111827]">Civilité:</strong> {data.step2.title}</p>
            <p><strong className="text-[#111827]">Nom:</strong> {data.step2.lastName}</p>
            <p><strong className="text-[#111827]">Prénom:</strong> {data.step2.firstName}</p>
            <p><strong className="text-[#111827]">Fonction:</strong> {data.step2.function}</p>
            <p><strong className="text-[#111827]">Téléphone:</strong> {data.step2.phone}</p>
            <p><strong className="text-[#111827]">Email:</strong> {data.step2.email}</p>
          </div>
        </div>

        {/* Dépenses énergétiques */}
        <div className="border border-gray-200 rounded-xl p-6">
          <h3 className="font-semibold text-[#111827] mb-4">
            {dict.detailedForm.step6.energyExpenses}
          </h3>
          <p className="text-sm text-[#6B7280]">
            {dict.detailedForm.step3.ranges[data.step3.annualExpenseRange]}
          </p>
        </div>

        {/* Configuration des bâtiments */}
        <div className="border border-gray-200 rounded-xl p-6">
          <h3 className="font-semibold text-[#111827] mb-4">
            {dict.detailedForm.step6.buildingConfig}
          </h3>
          <p className="text-sm text-[#6B7280]">
            {data.step4.buildingCount} {data.step4.buildingCount === 1 ? dict.detailedForm.step4.building : dict.detailedForm.step4.buildings}
          </p>
        </div>

        {/* Détails des bâtiments */}
        <div className="border border-gray-200 rounded-xl p-6">
          <h3 className="font-semibold text-[#111827] mb-4">
            {dict.detailedForm.step6.buildingDetails}
          </h3>
          <div className="space-y-6">
            {data.step5.buildings.map((building, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-[#111827] mb-3">
                  {dict.detailedForm.step5.buildingNumber
                    .replace('{number}', String(index + 1))
                    .replace('{total}', String(data.step5.buildings.length))}
                </h4>
                <div className="space-y-3 text-sm text-[#6B7280]">
                  <p><strong className="text-[#111827]">Type:</strong> {dict.detailedForm.step5.general.types[building.general.type]}</p>
                  <p><strong className="text-[#111827]">Surface:</strong> {building.general.surface} m²</p>
                  {building.general.height && (
                    <p><strong className="text-[#111827]">Hauteur:</strong> {building.general.height} m</p>
                  )}
                  <p><strong className="text-[#111827]">Chauffé:</strong> {building.heating.isHeated ? 'Oui' : 'Non'}</p>
                  {building.heating.isHeated && (
                    <>
                      {building.heating.mode && (
                        <p><strong className="text-[#111827]">Mode:</strong> {building.heating.mode}</p>
                      )}
                      {building.heating.power && (
                        <p><strong className="text-[#111827]">Puissance:</strong> {building.heating.power} kW</p>
                      )}
                      {building.heating.setpoint && (
                        <p><strong className="text-[#111827]">Consigne:</strong> {building.heating.setpoint} °C</p>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}



