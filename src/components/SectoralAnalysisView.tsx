import React, { useState } from 'react';
import { SectorAnalysis } from '../types/cccm';
import { 
  Tent, 
  Utensils, 
  Droplets, 
  Activity, 
  ShieldAlert, 
  GraduationCap, 
  Briefcase, 
  Zap, 
  CheckCircle, 
  AlertOctagon, 
  ArrowRight,
  TrendingDown
} from 'lucide-react';

interface SectoralAnalysisViewProps {
  sectors: SectorAnalysis[];
  onNavigateToActionPlan: () => void;
}

export const SectoralAnalysisView: React.FC<SectoralAnalysisViewProps> = ({
  sectors,
  onNavigateToActionPlan
}) => {
  const [selectedSectorId, setSelectedSectorId] = useState<string>(sectors[0]?.id || 'shelter_nfi');

  const selectedSector = sectors.find(s => s.id === selectedSectorId) || sectors[0];

  const getIcon = (id: string) => {
    switch (id) {
      case 'shelter_nfi': return <Tent className="w-5 h-5" />;
      case 'food_nutrition': return <Utensils className="w-5 h-5" />;
      case 'wash': return <Droplets className="w-5 h-5" />;
      case 'health': return <Activity className="w-5 h-5" />;
      case 'protection_aap': return <ShieldAlert className="w-5 h-5" />;
      case 'education': return <GraduationCap className="w-5 h-5" />;
      case 'livelihoods': return <Briefcase className="w-5 h-5" />;
      case 'energy_telecom': return <Zap className="w-5 h-5" />;
      default: return <Tent className="w-5 h-5" />;
    }
  };

  const getStatusBadge = (status: 'critical' | 'high' | 'medium' | 'acceptable') => {
    switch (status) {
      case 'critical':
        return <span className="px-2.5 py-1 rounded-full text-xs font-black bg-rose-500/20 text-rose-300 border border-rose-500/40">🔴 فجوة حرجة قصوى</span>;
      case 'high':
        return <span className="px-2.5 py-1 rounded-full text-xs font-black bg-amber-500/20 text-amber-300 border border-amber-500/40">🟠 فجوة عالية</span>;
      case 'medium':
        return <span className="px-2.5 py-1 rounded-full text-xs font-black bg-sky-500/20 text-sky-300 border border-sky-500/40">🟡 فجوة متوسطة</span>;
      case 'acceptable':
        return <span className="px-2.5 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">🟢 متوافق مع اسفير</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
              CCCM Sectoral Assessment Matrix
            </span>
            <span className="text-xs text-slate-400">تقييم شامل لـ 8 قطاعات إنسانية حيوية</span>
          </div>
          <h2 className="text-xl font-bold text-white">التحليل القطاعي الميداني الشامل</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            الوضع الحالي، فجوة معيار اسفير، عدد السكان المتأثرين، وتدخلات الإنقاذ العاجلة لكل قطاع
          </p>
        </div>

        <button
          onClick={onNavigateToActionPlan}
          className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition cursor-pointer flex items-center gap-2 shadow-lg shadow-cyan-950/50 self-start sm:self-auto"
        >
          <span>الانتقال لمصفوفة التدخلات وخطة العمل</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Grid: Sector tabs on right (RTL), details on left */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sector selection sidebar */}
        <div className="space-y-2 lg:col-span-1">
          {sectors.map(sector => {
            const isSelected = sector.id === selectedSectorId;
            return (
              <button
                key={sector.id}
                onClick={() => setSelectedSectorId(sector.id)}
                className={`w-full p-3.5 rounded-2xl border text-right transition cursor-pointer flex items-center justify-between gap-3 ${
                  isSelected
                    ? 'bg-cyan-950/40 border-cyan-500 text-white shadow-lg shadow-cyan-950/30'
                    : 'bg-slate-900 border-slate-800/80 text-slate-300 hover:bg-slate-800/60 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${
                    isSelected ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {getIcon(sector.id)}
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold">{sector.nameAr}</h3>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      {sector.affectedPopulation} متأثر
                    </span>
                  </div>
                </div>

                <div>
                  {sector.status === 'critical' && <span className="w-2.5 h-2.5 rounded-full bg-rose-500 block animate-pulse"></span>}
                  {sector.status === 'high' && <span className="w-2.5 h-2.5 rounded-full bg-amber-500 block"></span>}
                  {sector.status === 'medium' && <span className="w-2.5 h-2.5 rounded-full bg-sky-500 block"></span>}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Sector Deep-Dive Card */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xl space-y-6">
          {/* Sector Card Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div className="flex items-center gap-3.5">
              <div className="p-3.5 rounded-2xl bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                {getIcon(selectedSector.id)}
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-black text-white">{selectedSector.nameAr}</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  السكان المتأثرون بالفجوة: <strong className="text-cyan-300 font-bold">{selectedSector.affectedPopulation} نسمة</strong>
                </p>
              </div>
            </div>

            <div>
              {getStatusBadge(selectedSector.status)}
            </div>
          </div>

          {/* Sphere Metric & Current Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400 block">معيار اسفير المرجعي:</span>
              <p className="text-xs sm:text-sm font-semibold text-slate-200 leading-relaxed">
                {selectedSector.sphereStandard}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400 block">الوضع الحالي والفجوة المحسوبة:</span>
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-black text-amber-300">{selectedSector.currentValue}</span>
                <span className="text-xs text-rose-400 font-bold">({selectedSector.gapPercentage}% فجوة عجز)</span>
              </div>
              <p className="text-xs text-slate-400">{selectedSector.sphereMetric}</p>
            </div>
          </div>

          {/* Key Findings List */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
              <AlertOctagon className="w-4 h-4 text-amber-400" />
              <span>أبرز معطيات ومؤشرات الواقع الميداني:</span>
            </h4>
            <div className="space-y-2.5">
              {selectedSector.keyFindings.map((finding, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {finding}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Immediate Interventions */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-cyan-950/30 to-slate-950 border border-cyan-800/40">
            <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider mb-3 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-cyan-400" />
              <span>التدخلات الإنسانية العاجلة الموصى بها لهذا القطاع:</span>
            </h4>
            <div className="space-y-2">
              {selectedSector.immediateInterventions.map((intervention, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200">
                  <span className="text-cyan-400 font-black mt-0.5">•</span>
                  <span className="leading-relaxed">{intervention}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
