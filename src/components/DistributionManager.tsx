import React, { useState } from 'react';
import { DistributionRound, Household } from '../types/cccm';
import { 
  Gift, 
  CheckCircle2, 
  Clock, 
  Search, 
  Plus, 
  Printer, 
  ShieldCheck, 
  Users, 
  AlertCircle,
  X
} from 'lucide-react';
import { calculateHouseholdVulnerability } from '../utils/vulnerabilityCalculator';

interface DistributionManagerProps {
  distributions: DistributionRound[];
  households: Household[];
  onAddDistribution: (distribution: DistributionRound) => void;
  onToggleServeFamily: (distributionId: string, familyId: string) => void;
}

export const DistributionManager: React.FC<DistributionManagerProps> = ({
  distributions,
  households,
  onAddDistribution,
  onToggleServeFamily
}) => {
  const [selectedDistId, setSelectedDistId] = useState<string>(distributions[0]?.id || '');
  const [searchTerm, setSearchTerm] = useState('');
  const [tierFilter, setTierFilter] = useState('all');
  const [isNewDistModalOpen, setIsNewDistModalOpen] = useState(false);

  const selectedDist = distributions.find(d => d.id === selectedDistId) || distributions[0];

  // Map households with vulnerability info
  const enrichedHouseholds = households.map(h => {
    const analysis = calculateHouseholdVulnerability(h);
    return {
      ...h,
      vulnerabilityScore: analysis.score,
      vulnerabilityTier: analysis.tier,
      tierLabelAr: analysis.tierLabelAr
    };
  });

  // Eligible families based on distribution targetTier
  const eligibleHouseholds = enrichedHouseholds.filter(h => {
    if (!selectedDist) return true;
    if (selectedDist.targetTier === 'critical_only' && h.vulnerabilityTier !== 'critical') return false;
    if (selectedDist.targetTier === 'critical_and_high' && (h.vulnerabilityTier !== 'critical' && h.vulnerabilityTier !== 'high')) return false;
    if (selectedDist.targetTier === 'female_headed' && h.headGender !== 'female') return false;
    return true;
  });

  // Filtered by local search
  const displayedHouseholds = eligibleHouseholds.filter(h => {
    if (tierFilter !== 'all' && h.vulnerabilityTier !== tierFilter) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        h.anonymizedCode.toLowerCase().includes(q) ||
        h.tentNumber.toLowerCase().includes(q) ||
        h.campZone.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const servedCount = selectedDist ? selectedDist.servedFamilyIds.length : 0;
  const totalEligible = eligibleHouseholds.length;
  const progressPercent = totalEligible > 0 ? Math.round((servedCount / totalEligible) * 100) : 0;

  const handlePrintRoster = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
              آلية التوزيع العادل ومنع الازدواجية
            </span>
            <span className="text-xs text-slate-400">قوائم مشفرة بالرموز (AAP / Sphere Standard)</span>
          </div>
          <h2 className="text-xl font-bold text-white">إدارة دورات التوزيع والمساعدات الإنسانية</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            توزيع مبني على معايير الهشاشة المعلنة، وتوثيق استلام فوري يمنع التكرار ويضمن عدم إقصاء أي أسرة مستحقة
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrintRoster}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition cursor-pointer flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4 text-cyan-400" />
            <span>طباعة كشف التوزيع الميداني</span>
          </button>

          <button
            onClick={() => setIsNewDistModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-lg shadow-cyan-900/40"
          >
            <Plus className="w-4 h-4" />
            <span>جدولة دورة توزيع جديدة</span>
          </button>
        </div>
      </div>

      {/* Distribution selector tabs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {distributions.map(dist => {
          const isSelected = dist.id === selectedDistId;
          const served = dist.servedFamilyIds.length;
          const planned = dist.plannedFamiliesCount;
          const pct = Math.round((served / Math.max(1, planned)) * 100);

          return (
            <div
              key={dist.id}
              onClick={() => setSelectedDistId(dist.id)}
              className={`p-4 rounded-2xl border transition cursor-pointer ${
                isSelected
                  ? 'bg-cyan-950/40 border-cyan-500 text-white shadow-lg shadow-cyan-950/30'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-cyan-300">{dist.sector}</span>
                <span className="text-[11px] text-slate-400">{dist.scheduledDate}</span>
              </div>
              <h4 className="text-sm font-bold text-white leading-snug">{dist.title}</h4>
              <p className="text-xs text-slate-400 mt-1">{dist.itemType}</p>

              <div className="mt-3 pt-3 border-t border-slate-800/80 text-xs">
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>تم التسليم:</span>
                  <span className="font-bold text-white">{served} من أصل {planned} أسرة</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-cyan-500 h-full rounded-full" style={{ width: `${Math.min(100, pct)}%` }}></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Distribution Details & Checklist */}
      {selectedDist && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">{selectedDist.title}</h3>
                <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700">
                  الجهة الشريكة: {selectedDist.donorOrPartner}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                محتوى الحصة للأسرة: <strong className="text-cyan-300">{selectedDist.quantityPerFamily}</strong> | الفئة المستهدفة: <strong className="text-amber-300">
                  {selectedDist.targetTier === 'critical_only' ? 'أسر الفئة الحرجة فقط' :
                   selectedDist.targetTier === 'critical_and_high' ? 'أسر الفئتين الحرجة والعالية' :
                   selectedDist.targetTier === 'female_headed' ? 'الأسر التي تعيلها نساء' : 'جميع الأسر المسجلة'}
                </strong>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-xs text-slate-400 block">نسبة الإنجاز:</span>
                <span className="text-xl font-black text-cyan-400">{progressPercent}%</span>
              </div>
              <div className="w-12 h-12 rounded-full border-4 border-slate-800 border-t-cyan-500 flex items-center justify-center font-bold text-xs text-white">
                {servedCount}
              </div>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
              <input
                type="text"
                placeholder="بحث برمز الأسرة، الخيمة..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pr-9 pl-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-slate-400">تصفية درجة الهشاشة:</span>
              <select
                value={tierFilter}
                onChange={e => setTierFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 cursor-pointer"
              >
                <option value="all">الكل ({eligibleHouseholds.length})</option>
                <option value="critical">حرجة</option>
                <option value="high">عالية</option>
                <option value="medium">متوسطة</option>
                <option value="low">منخفضة</option>
              </select>
            </div>
          </div>

          {/* Recipient Families Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-800">
            <table className="w-full text-right border-collapse text-xs">
              <thead>
                <tr className="bg-slate-950 text-slate-400 font-bold border-b border-slate-800">
                  <th className="p-3">رمز الأسرة (مشفر)</th>
                  <th className="p-3">الخيمة والقطاع</th>
                  <th className="p-3">أفراد الأسرة</th>
                  <th className="p-3">مؤشر الهشاشة</th>
                  <th className="p-3">حالة الاستلام</th>
                  <th className="p-3 text-center">إجراء التسليم الفوري</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 bg-slate-900/60">
                {displayedHouseholds.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-slate-400">
                      لا توجد أسر مطابقة لشروط هذه الدورة أو معايير البحث.
                    </td>
                  </tr>
                ) : (
                  displayedHouseholds.map(family => {
                    const isServed = selectedDist.servedFamilyIds.includes(family.id);

                    return (
                      <tr 
                        key={family.id}
                        className={`transition ${isServed ? 'bg-emerald-950/15' : 'hover:bg-slate-800/30'}`}
                      >
                        <td className="p-3">
                          <span className="font-mono font-bold text-cyan-300 text-sm">
                            {family.anonymizedCode}
                          </span>
                          <span className="block text-[11px] text-slate-400">
                            {family.headNameOrPseudonym}
                            {family.headGender === 'female' && ' (معيلة)'}
                          </span>
                        </td>

                        <td className="p-3">
                          <span className="font-semibold text-white">{family.tentNumber}</span>
                          <span className="block text-[11px] text-slate-400">{family.campZone}</span>
                        </td>

                        <td className="p-3 text-slate-300">
                          {family.familySize} أفراد
                          {family.childrenUnder5 > 0 && <span className="text-amber-300 text-[11px] block">{family.childrenUnder5} رضع</span>}
                        </td>

                        <td className="p-3">
                          <span className={`font-bold ${
                            family.vulnerabilityTier === 'critical' ? 'text-rose-400' :
                            family.vulnerabilityTier === 'high' ? 'text-amber-400' : 'text-sky-400'
                          }`}>
                            {family.vulnerabilityScore} نقطة
                          </span>
                        </td>

                        <td className="p-3">
                          {isServed ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>تم التسليم بنجاح</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-800 text-slate-400 border border-slate-700">
                              <Clock className="w-3.5 h-3.5" />
                              <span>في الانتظار</span>
                            </span>
                          )}
                        </td>

                        <td className="p-3 text-center">
                          <button
                            onClick={() => onToggleServeFamily(selectedDist.id, family.id)}
                            className={`px-3 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer ${
                              isServed
                                ? 'bg-slate-800 hover:bg-rose-950 hover:text-rose-300 text-slate-400 border border-slate-700'
                                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-900/30'
                            }`}
                          >
                            {isServed ? 'إلغاء التسليم' : 'تسليم وتوثيق'}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* New Distribution Modal */}
      {isNewDistModalOpen && (
        <CreateDistributionModal
          isOpen={isNewDistModalOpen}
          onClose={() => setIsNewDistModalOpen(false)}
          onAdd={(newDist) => {
            onAddDistribution(newDist);
            setIsNewDistModalOpen(false);
          }}
          householdsCount={households.length}
        />
      )}
    </div>
  );
};

interface CreateDistributionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (dist: DistributionRound) => void;
  householdsCount: number;
}

const CreateDistributionModal: React.FC<CreateDistributionModalProps> = ({
  onClose,
  onAdd,
  householdsCount
}) => {
  const [formData, setFormData] = useState<Partial<DistributionRound>>({
    id: `DIST-${Date.now().toString().slice(-4)}`,
    title: '',
    sector: 'الأمن الغذائي والتغذية',
    itemType: '',
    targetTier: 'critical_and_high',
    quantityPerFamily: '',
    plannedFamiliesCount: householdsCount,
    servedFamilyIds: [],
    status: 'active',
    scheduledDate: new Date().toISOString().slice(0, 10),
    donorOrPartner: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.itemType) return;
    onAdd(formData as DistributionRound);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl my-auto">
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-base">جدولة دورة توزيع جديدة</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div>
            <label className="text-slate-400 font-bold block mb-1">عنوان الدورة</label>
            <input
              type="text"
              required
              placeholder="مثال: توزيع سلات خضروات طازجة ودقيق"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 font-bold block mb-1">القطاع</label>
              <select
                value={formData.sector}
                onChange={e => setFormData({ ...formData, sector: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
              >
                <option value="الأمن الغذائي والتغذية">الأمن الغذائي والتغذية</option>
                <option value="المأوى والمواد غير الغذائية">المأوى والمواد غير الغذائية</option>
                <option value="المياه والصرف الصحي">المياه والصرف الصحي</option>
                <option value="الصحة ومستلزمات العناية">الصحة ومستلزمات العناية</option>
                <option value="الحماية والإنارة">الحماية والإنارة</option>
              </select>
            </div>

            <div>
              <label className="text-slate-400 font-bold block mb-1">الفئة المستهدفة</label>
              <select
                value={formData.targetTier}
                onChange={e => setFormData({ ...formData, targetTier: e.target.value as any })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
              >
                <option value="critical_only">الفئة الحرجة فقط (أولوية 72h)</option>
                <option value="critical_and_high">الفئة الحرجة والعالية</option>
                <option value="female_headed">أسر تعيلها نساء فقط</option>
                <option value="all">جميع أسر المخيم المسجلة</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-slate-400 font-bold block mb-1">نوع المادة الموزعة</label>
            <input
              type="text"
              required
              placeholder="مثال: شوادر نايلون 200 ميكرون سمك 4×6 متر"
              value={formData.itemType}
              onChange={e => setFormData({ ...formData, itemType: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 font-bold block mb-1">حصة كل أسرة</label>
              <input
                type="text"
                required
                placeholder="مثال: شادران + 4 بطانيات صوف"
                value={formData.quantityPerFamily}
                onChange={e => setFormData({ ...formData, quantityPerFamily: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
              />
            </div>

            <div>
              <label className="text-slate-400 font-bold block mb-1">الجهة المانحة / الشريك</label>
              <input
                type="text"
                placeholder="مثال: OCHA / WFP / اليونيسف"
                value={formData.donorOrPartner}
                onChange={e => setFormData({ ...formData, donorOrPartner: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold cursor-pointer shadow-lg shadow-cyan-900/30"
            >
              حفظ واعتماد الدورة
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
