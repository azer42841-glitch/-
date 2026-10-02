import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Layers, 
  Gift, 
  MessageSquareWarning, 
  ClipboardList, 
  ShieldCheck, 
  FileText, 
  CheckCheck,
  PlusCircle,
  Download,
  AlertCircle,
  UserPlus
} from 'lucide-react';
import { CampAggregateMetrics } from '../utils/sphereStandards';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  metrics: CampAggregateMetrics;
  onOpenAddModal: () => void;
  onOpenDataCleaning: () => void;
  anomaliesCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  metrics,
  onOpenAddModal,
  onOpenDataCleaning,
  anomaliesCount
}) => {
  const navItems = [
    { id: 'dashboard', label: 'لوحة مؤشرات اسفير', icon: LayoutDashboard },
    { id: 'new_registration', label: 'تسجيل جديد (استمارة المسح)', icon: UserPlus, highlight: true },
    { id: 'families', label: 'سجل ومسح الأسر', icon: Users, badge: metrics.totalHouseholds },
    { id: 'sectors', label: 'التحليل القطاعي (8)', icon: Layers },
    { id: 'distributions', label: 'إدارة التوزيعات', icon: Gift },
    { id: 'complaints', label: 'المساءلة والشكاوى (AAP)', icon: MessageSquareWarning },
    { id: 'priorities', label: 'خطة العمل والأولويات', icon: ClipboardList },
    { id: 'governance', label: 'الحوكمة والمخاطر', icon: ShieldCheck },
    { id: 'donor_report', label: 'تقرير المانحين والأمم المتحدة', icon: FileText },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white shadow-xl">
      {/* Top emergency status bar */}
      <div className="bg-gradient-to-r from-red-950 via-slate-900 to-amber-950 px-4 py-1.5 border-b border-red-900/40 text-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full font-bold bg-red-600/80 text-white animate-pulse text-[11px]">
            🔴 حالة طوارئ إنسانية
          </span>
          <span className="text-slate-300 font-medium">
            مخيم نازحي «أطياف العودة» - قطاع غزة | معايير اسفير (Sphere Project) & CCCM
          </span>
        </div>

        <div className="flex items-center gap-4 text-slate-300">
          <div className="flex items-center gap-1">
            <span className="text-slate-400">إجمالي السكان:</span>
            <span className="font-bold text-white">{metrics.totalPopulation} نسمة</span>
            <span className="text-slate-400">({metrics.totalHouseholds} أسرة)</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5">
            <span className="text-slate-400">فئة حرجة:</span>
            <span className="font-bold text-rose-400">{metrics.criticalCount}</span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-400">عجز مياه:</span>
            <span className="font-bold text-amber-400">{metrics.waterGapLiters} لتر/فرد</span>
          </div>

          {anomaliesCount > 0 && (
            <button
              onClick={onOpenDataCleaning}
              className="flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 transition border border-amber-500/30 cursor-pointer"
              title="انقر لفحص وتنظيف البيانات"
            >
              <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>{anomaliesCount} تنبيه بيانات</span>
            </button>
          )}
        </div>
      </div>

      {/* Main navigation header */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-600 to-blue-700 flex items-center justify-center shadow-lg shadow-cyan-900/30 text-white font-black text-xl border border-cyan-400/30">
            ط
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-black text-white tracking-wide">
                منظومة إدارة وتنسيق مخيم أطياف العودة
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-950 text-cyan-400 border border-cyan-800">
                CCCM GAZA
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              نظام إدارة المخيمات والبيانات الإنسانية، حماية البيانات (AAP)، وحساب مؤشرات الهشاشة والفجوات
            </p>
          </div>
        </div>

        {/* Quick action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-900/30 transition cursor-pointer border border-emerald-400/30"
          >
            <PlusCircle className="w-4 h-4" />
            <span>تسجيل أسرة جديدة</span>
          </button>

          <button
            onClick={onOpenDataCleaning}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-semibold border border-slate-700 transition cursor-pointer"
            title="فحص جودة البيانات وتنظيفها وتنزيل استمارة المسح"
          >
            <CheckCheck className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">جودة البيانات</span>
          </button>
        </div>
      </div>

      {/* Tabs navigation row */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 overflow-x-auto scrollbar-none flex items-center gap-1 border-t border-slate-800/80">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-2 px-3.5 py-2.5 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition cursor-pointer ${
                isActive
                  ? 'border-cyan-400 text-cyan-300 bg-cyan-950/30'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              } ${item.highlight ? 'text-amber-300 font-extrabold' : ''}`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
              <span>{item.label}</span>
              {item.badge !== undefined && (
                <span className={`px-1.5 py-0.2 rounded-full text-[11px] font-bold ${
                  isActive ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-800 text-slate-400'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </header>
  );
};
