import React, { useState, useMemo } from 'react';
import { 
  Household 
} from '../types/cccm';
import { calculateHouseholdVulnerability, VulnerabilityAnalysisResult } from '../utils/vulnerabilityCalculator';
import { 
  Search, 
  Filter, 
  Eye, 
  Plus, 
  Download, 
  Upload, 
  Shield, 
  AlertTriangle, 
  Tent, 
  Droplets, 
  HeartHandshake, 
  X,
  CheckCircle2,
  Calendar,
  MapPin,
  Home,
  UserCheck
} from 'lucide-react';
import { exportHouseholdsToCSV, generateEmptySurveyTemplateCSV } from '../utils/dataCleaning';

interface FamilyRegistryProps {
  households: Household[];
  onAddHousehold: (household: Household) => void;
  onUpdateHousehold: (household: Household) => void;
  onDeleteHousehold: (id: string) => void;
  initialVulnerabilityFilter?: string;
  onOpenNewRegistrationPage?: () => void;
}

export const FamilyRegistry: React.FC<FamilyRegistryProps> = ({
  households,
  onAddHousehold,
  onUpdateHousehold,
  onDeleteHousehold,
  initialVulnerabilityFilter,
  onOpenNewRegistrationPage
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [tierFilter, setTierFilter] = useState(initialVulnerabilityFilter || 'all');
  const [genderFilter, setGenderFilter] = useState('all');
  const [zoneFilter, setZoneFilter] = useState('all');
  const [selectedFamily, setSelectedFamily] = useState<Household | null>(null);
  const [selectedAnalysis, setSelectedAnalysis] = useState<VulnerabilityAnalysisResult | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [showPseudonyms, setShowPseudonyms] = useState(true);

  // Compute vulnerability for each household for fast filtering and display
  const householdsWithVulnerability = useMemo(() => {
    return households.map(h => {
      const analysis = calculateHouseholdVulnerability(h);
      return {
        ...h,
        vulnerabilityScore: analysis.score,
        vulnerabilityTier: analysis.tier,
        analysis
      };
    });
  }, [households]);

  // Filtered list
  const filteredHouseholds = useMemo(() => {
    return householdsWithVulnerability.filter(h => {
      if (tierFilter !== 'all' && h.vulnerabilityTier !== tierFilter) return false;
      if (genderFilter !== 'all' && h.headGender !== genderFilter) return false;
      if (zoneFilter !== 'all' && !h.campZone.includes(zoneFilter)) return false;

      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesCode = h.anonymizedCode.toLowerCase().includes(query);
        const matchesTent = h.tentNumber.toLowerCase().includes(query);
        const matchesOrigin = h.originLocation.toLowerCase().includes(query);
        const matchesName = h.headNameOrPseudonym.toLowerCase().includes(query);
        const matchesZone = h.campZone.toLowerCase().includes(query);
        if (!matchesCode && !matchesTent && !matchesOrigin && !matchesName && !matchesZone) {
          return false;
        }
      }
      return true;
    });
  }, [householdsWithVulnerability, tierFilter, genderFilter, zoneFilter, searchTerm]);

  const handleOpenDossier = (household: Household) => {
    const analysis = calculateHouseholdVulnerability(household);
    setSelectedFamily(household);
    setSelectedAnalysis(analysis);
  };

  const handleDownloadCSV = () => {
    const csvContent = exportHouseholdsToCSV(households);
    const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `كشف_أسر_مخيم_أطياف_العودة_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadTemplate = () => {
    const templateContent = generateEmptySurveyTemplateCSV();
    const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), templateContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'استمارة_مسح_الأسر_النموذجية_اسفير.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                سجل الحصر والمسح الميداني
              </span>
              <span className="text-xs text-slate-400">حماية البيانات المشفرة (AAP & Data Protection)</span>
            </div>
            <h2 className="text-xl font-bold text-white">سجل العائلات النازحة ومؤشرات الهشاشة</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              إجمالي الأسر المسجلة: <strong className="text-cyan-300">{households.length} أسرة</strong> | تعرض النتائج المصفاة: <strong className="text-white">{filteredHouseholds.length}</strong>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowPseudonyms(!showPseudonyms)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 transition cursor-pointer flex items-center gap-1.5"
            >
              <Shield className="w-3.5 h-3.5 text-cyan-400" />
              <span>{showPseudonyms ? 'إخفاء الأسماء التقديرية' : 'إظهار الرموز فقط'}</span>
            </button>

            <button
              onClick={handleDownloadTemplate}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 transition cursor-pointer flex items-center gap-1.5"
              title="تحميل استمارة إكسل فارغة لمسح الأسر في الميدان"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>نموذج المسح (Excel/CSV)</span>
            </button>

            <button
              onClick={handleDownloadCSV}
              className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shadow"
            >
              <Download className="w-3.5 h-3.5" />
              <span>تصدير البيانات</span>
            </button>

            <button
              onClick={() => {
                if (onOpenNewRegistrationPage) {
                  onOpenNewRegistrationPage();
                } else {
                  setIsAddModalOpen(true);
                }
              }}
              className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shadow-lg shadow-cyan-900/30"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>إضافة أسرة (صفحة المسح)</span>
            </button>
          </div>
        </div>

        {/* Search & Filters Row */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
            <input
              type="text"
              placeholder="بحث بالرمز، رقم الخيمة، المنطقة..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-9 pl-3 py-2 rounded-xl bg-slate-950 border border-slate-700/80 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <select
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700/80 text-slate-200 text-xs focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              <option value="all">كل درجات الهشاشة</option>
              <option value="critical">🔴 فئة حرجة (75 - 100)</option>
              <option value="high">🟠 فئة عالية (55 - 74)</option>
              <option value="medium">🟡 فئة متوسطة (35 - 54)</option>
              <option value="low">🟢 فئة منخفضة (أقل من 35)</option>
            </select>
          </div>

          <div>
            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700/80 text-slate-200 text-xs focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              <option value="all">جميع فئات المعيل</option>
              <option value="female">أسر تعيلها نساء (FHH)</option>
              <option value="male">أسر يعيلها رجال</option>
              <option value="child">أسر يعيلها قاصر/طفل</option>
            </select>
          </div>

          <div>
            <select
              value={zoneFilter}
              onChange={(e) => setZoneFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700/80 text-slate-200 text-xs focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              <option value="all">جميع قطاعات المخيم</option>
              <option value="القطاع أ">القطاع أ (مربع الشهداء والأمل)</option>
              <option value="القطاع ب">القطاع ب (مربع النخيل والهدى)</option>
              <option value="القطاع ج">القطاع ج (مربع الصمود والزيتون)</option>
              <option value="القطاع د">القطاع د (مربع السلام والنور)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Families Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse text-xs">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-bold">
                <th className="p-3.5">رمز الأسرة / المعيل</th>
                <th className="p-3.5">الخيمة والقطاع</th>
                <th className="p-3.5">الأفراد والتركيبة</th>
                <th className="p-3.5">حالة المأوى</th>
                <th className="p-3.5">المياه (لتر/فرد)</th>
                <th className="p-3.5">الأمن الغذائي</th>
                <th className="p-3.5">مؤشر الهشاشة</th>
                <th className="p-3.5 text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredHouseholds.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    لا توجد أسر مطابقة لمعايير البحث الحالية.
                  </td>
                </tr>
              ) : (
                filteredHouseholds.map(household => {
                  const score = household.vulnerabilityScore || 0;
                  const tier = household.vulnerabilityTier || 'medium';
                  const areaPerPerson = (household.shelterAreaM2 / Math.max(1, household.familySize)).toFixed(1);
                  const waterPerPerson = (household.dailyWaterLiters / Math.max(1, household.familySize)).toFixed(1);

                  return (
                    <tr 
                      key={household.id} 
                      className="hover:bg-slate-800/40 transition cursor-pointer group"
                      onClick={() => handleOpenDossier(household)}
                    >
                      {/* ID / Head */}
                      <td className="p-3.5">
                        <div className="flex items-center gap-2">
                          <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                            tier === 'critical' ? 'bg-rose-500 ring-2 ring-rose-500/30' :
                            tier === 'high' ? 'bg-amber-500' :
                            tier === 'medium' ? 'bg-sky-500' : 'bg-emerald-500'
                          }`}></div>
                          <div>
                            <span className="font-mono font-bold text-cyan-300 block">
                              {household.anonymizedCode}
                            </span>
                            <span className="text-[11px] text-slate-300">
                              {showPseudonyms ? household.headNameOrPseudonym : 'مشفر'}
                              {household.headGender === 'female' && (
                                <span className="mr-1.5 px-1.5 py-0.2 rounded text-[10px] bg-purple-950 text-purple-300 border border-purple-800">
                                  معيلة
                                </span>
                              )}
                              {household.headGender === 'child' && (
                                <span className="mr-1.5 px-1.5 py-0.2 rounded text-[10px] bg-rose-950 text-rose-300 border border-rose-800">
                                  قاصر
                                </span>
                              )}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Tent & Zone */}
                      <td className="p-3.5 text-slate-300">
                        <div className="font-semibold text-white">{household.tentNumber}</div>
                        <div className="text-[11px] text-slate-400">{household.campZone}</div>
                      </td>

                      {/* Demographics */}
                      <td className="p-3.5">
                        <div className="text-slate-200 font-bold">
                          {household.familySize} أفراد
                        </div>
                        <div className="text-[11px] text-slate-400 flex flex-wrap gap-1 mt-0.5">
                          {household.childrenUnder5 > 0 && <span className="text-amber-300">{household.childrenUnder5} رضيع</span>}
                          {household.elderly60Plus > 0 && <span className="text-slate-300">| {household.elderly60Plus} مسن</span>}
                          {household.personsWithDisability > 0 && <span className="text-purple-300">| إعاقة</span>}
                          {household.warInjuredCount > 0 && <span className="text-rose-300">| جريح</span>}
                        </div>
                      </td>

                      {/* Shelter */}
                      <td className="p-3.5">
                        <div className="flex items-center gap-1.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            household.shelterCondition === 'critical' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                            household.shelterCondition === 'poor' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                            'bg-slate-800 text-slate-300'
                          }`}>
                            {household.shelterType}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-1">
                          {areaPerPerson} م²/فرد {Number(areaPerPerson) < 3.5 && <span className="text-rose-400">(اكتظاظ)</span>}
                        </div>
                      </td>

                      {/* Water */}
                      <td className="p-3.5">
                        <span className={`font-bold ${
                          Number(waterPerPerson) < 7.5 ? 'text-rose-400' :
                          Number(waterPerPerson) < 15 ? 'text-amber-400' : 'text-emerald-400'
                        }`}>
                          {waterPerPerson} لتر/فرد
                        </span>
                        <div className="text-[11px] text-slate-400">
                          {household.distanceToWaterMeters}م ({household.waterQueueMinutes} د طابور)
                        </div>
                      </td>

                      {/* Food & Nutrition */}
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          household.dailyMealsCount === 1 ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-slate-800 text-slate-300'
                        }`}>
                          {household.dailyMealsCount} وجبة/يوم
                        </span>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {household.foodAssistanceLast14Days ? 'استلم طرداً' : 'لم يستلم'}
                        </div>
                      </td>

                      {/* Vulnerability Score */}
                      <td className="p-3.5">
                        <div className="flex items-center gap-2">
                          <span className={`text-base font-black ${
                            tier === 'critical' ? 'text-rose-400' :
                            tier === 'high' ? 'text-amber-400' :
                            tier === 'medium' ? 'text-sky-400' : 'text-emerald-400'
                          }`}>
                            {score}
                          </span>
                          <span className="text-slate-500 text-[10px]">/ 100</span>
                        </div>
                        <span className={`text-[10px] font-bold block ${
                          tier === 'critical' ? 'text-rose-300' :
                          tier === 'high' ? 'text-amber-300' :
                          tier === 'medium' ? 'text-sky-300' : 'text-emerald-300'
                        }`}>
                          {tier === 'critical' ? 'حرجة (72h)' :
                           tier === 'high' ? 'عالية' :
                           tier === 'medium' ? 'متوسطة' : 'منخفضة'}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="p-3.5 text-center">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleOpenDossier(household); }}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-cyan-600 hover:text-white text-slate-300 transition"
                          title="عرض الملف الإنساني الكامل وتفاصيل التقييم"
                        >
                          <Eye className="w-4 h-4" />
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

      {/* Family Detailed Dossier Modal */}
      {selectedFamily && selectedAnalysis && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl my-auto">
            {/* Modal Header */}
            <div className={`p-5 text-white flex items-center justify-between border-b ${
              selectedAnalysis.tier === 'critical' ? 'bg-gradient-to-r from-rose-950 to-slate-900 border-rose-800/60' :
              selectedAnalysis.tier === 'high' ? 'bg-gradient-to-r from-amber-950 to-slate-900 border-amber-800/60' :
              'bg-gradient-to-r from-slate-900 to-slate-950 border-slate-800'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-2xl ${
                  selectedAnalysis.tier === 'critical' ? 'bg-rose-600/30 text-rose-300 border border-rose-500/40' :
                  selectedAnalysis.tier === 'high' ? 'bg-amber-600/30 text-amber-300 border border-amber-500/40' :
                  'bg-cyan-600/30 text-cyan-300 border border-cyan-500/40'
                }`}>
                  <Tent className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-cyan-300">{selectedFamily.anonymizedCode}</span>
                    <span className="text-xs px-2 py-0.5 rounded font-bold bg-slate-800 text-slate-300">
                      خيمة: {selectedFamily.tentNumber}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mt-0.5">
                    الملف الإنساني لأسرة {selectedFamily.headNameOrPseudonym}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setSelectedFamily(null)}
                className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-5 max-h-[75vh] overflow-y-auto text-xs sm:text-sm">
              {/* Score Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <span className="text-3xl font-black text-white">{selectedAnalysis.score}</span>
                    <span className="text-[10px] text-slate-500 block">من 100</span>
                  </div>
                  <div>
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      selectedAnalysis.tier === 'critical' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' :
                      selectedAnalysis.tier === 'high' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                      selectedAnalysis.tier === 'medium' ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40' :
                      'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    }`}>
                      {selectedAnalysis.tierLabelAr}
                    </span>
                    <p className="text-xs text-slate-400 mt-1">
                      الموقع الأصلي: {selectedFamily.originLocation} | نزوح متكرر ({selectedFamily.displacementCount} مرات)
                    </p>
                  </div>
                </div>

                <div className="text-left">
                  <span className="text-xs text-slate-400 block">الشريحة المعيشية:</span>
                  <span className="text-xs font-bold text-cyan-300">
                    {selectedFamily.economicTier === 'ultra_destitute' ? 'معدمة كلياً' :
                     selectedFamily.economicTier === 'poor' ? 'فقيرة' :
                     selectedFamily.economicTier === 'limited_income' ? 'محدودة الدخل' : 'قدرة نسبية'}
                  </span>
                </div>
              </div>

              {/* Sphere Metrics Summary */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 text-xs block">مساحة الفرد:</span>
                  <span className="text-sm font-bold text-white">{selectedAnalysis.areaPerPerson} م²</span>
                  <span className={`text-[10px] block mt-0.5 ${selectedAnalysis.areaPerPerson < 3.5 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {selectedAnalysis.areaPerPerson < 3.5 ? 'عجز عن المعيار (3.5)' : 'مطابق'}
                  </span>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 text-xs block">حصة المياه:</span>
                  <span className="text-sm font-bold text-white">{selectedAnalysis.waterPerPersonLiters} لتر/فرد</span>
                  <span className={`text-[10px] block mt-0.5 ${selectedAnalysis.waterPerPersonLiters < 15 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {selectedAnalysis.waterPerPersonLiters < 15 ? 'دون المعيار (15L)' : 'مطابق'}
                  </span>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 text-xs block">المرحاض المشترك:</span>
                  <span className="text-sm font-bold text-white">{selectedFamily.sharedLatrineUsersCount} شخص</span>
                  <span className={`text-[10px] block mt-0.5 ${selectedFamily.sharedLatrineUsersCount > 20 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {selectedFamily.latrineGenderSeparated ? 'مفصول' : 'غير مفصول'}
                  </span>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 text-xs block">تغذية الأطفال:</span>
                  <span className="text-sm font-bold text-white">{selectedFamily.dailyMealsCount} وجبات</span>
                  <span className={`text-[10px] block mt-0.5 ${selectedFamily.infantNutritionRisk ? 'text-rose-400' : 'text-slate-400'}`}>
                    {selectedFamily.infantNutritionRisk ? 'خطر سوء تغذية' : 'مستقر'}
                  </span>
                </div>
              </div>

              {/* Transparent Vulnerability Breakdown Table */}
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-cyan-400" />
                  <span>تفكيك وتبرير درجات مؤشر الهشاشة (معايير معلنة وشفافة):</span>
                </h4>
                <div className="space-y-2">
                  {selectedAnalysis.breakdown.map((item, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-200">{item.factor}</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                            {item.category}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">{item.description}</p>
                      </div>
                      <div className="text-left shrink-0">
                        <span className="text-sm font-bold text-cyan-400">+{item.points}</span>
                        <span className="text-[10px] text-slate-500 block">من {item.maxPoints}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Priority Interventions recommended for this family */}
              {selectedAnalysis.priorityInterventions.length > 0 && (
                <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-800/40">
                  <h4 className="text-xs font-bold text-cyan-300 flex items-center gap-1.5 mb-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                    <span>التدخلات ذات الأولوية المقترحة لهذه الأسرة:</span>
                  </h4>
                  <ul className="space-y-1.5">
                    {selectedAnalysis.priorityInterventions.map((intervention, i) => (
                      <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                        <span className="text-cyan-400 font-bold">•</span>
                        <span>{intervention}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Notes */}
              {selectedFamily.notes && (
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400">
                  <strong className="text-slate-300 block mb-0.5">ملاحظات المسح الميداني:</strong>
                  {selectedFamily.notes}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedFamily(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition cursor-pointer"
              >
                إغلاق الملف
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Household Modal */}
      {isAddModalOpen && (
        <AddHouseholdModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAdd={(newFamily) => {
            onAddHousehold(newFamily);
            setIsAddModalOpen(false);
          }}
          existingCount={households.length}
        />
      )}
    </div>
  );
};

interface AddHouseholdModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (household: Household) => void;
  existingCount: number;
}

const AddHouseholdModal: React.FC<AddHouseholdModalProps> = ({
  onClose,
  onAdd,
  existingCount
}) => {
  const nextNum = existingCount + 1;
  const generatedId = `FAM-${String(nextNum).padStart(3, '0')}`;
  const generatedCode = `GZ-AAW-${1000 + nextNum}`;

  const [formData, setFormData] = useState<Partial<Household>>({
    id: generatedId,
    anonymizedCode: generatedCode,
    headNameOrPseudonym: 'أسرة جديدة (مشفر)',
    headGender: 'female',
    familySize: 6,
    childrenUnder5: 1,
    childrenSchoolAge: 3,
    elderly60Plus: 0,
    pregnantLactatingWomen: 0,
    personsWithDisability: 0,
    chronicIllnessesCount: 0,
    warInjuredCount: 0,
    orphansCount: 0,
    displacementCount: 3,
    originLocation: 'شمال غزة',
    campZone: 'القطاع أ - مربع الشهداء',
    tentNumber: `T-${nextNum + 10}`,
    shelterType: 'خيمة قماشية',
    shelterAreaM2: 14,
    shelterCondition: 'poor',
    winterized: false,
    blanketsAvailable: 3,
    mattressesAvailable: 2,
    tarpaulinNeeded: true,
    dailyWaterLiters: 45,
    drinkingWaterSourceSafe: true,
    distanceToWaterMeters: 180,
    waterQueueMinutes: 30,
    sharedLatrineUsersCount: 30,
    latrineGenderSeparated: true,
    latrineLightedAndSafe: false,
    hygieneKitReceivedLast30Days: false,
    menstrualHygieneAvailable: false,
    foodAssistanceLast14Days: false,
    dailyMealsCount: 1,
    infantNutritionRisk: false,
    activeInfections: [],
    urgentReferralNeeded: false,
    unmetMedicationNeeds: false,
    economicTier: 'ultra_destitute',
    livelihoodSource: 'معدم كلياً',
    outOfSchoolChildren: 2,
    unaccompaniedMinors: false,
    nightLightingSafe: false,
    surveyDate: new Date().toISOString().slice(0, 10),
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData as Household);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl my-auto">
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-base">تسجيل ومسح أسرة نازحة جديدة</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-slate-400 font-bold block mb-1">الرمز المشفر (AAP)</label>
              <input
                type="text"
                readOnly
                value={formData.anonymizedCode}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-cyan-300 font-mono"
              />
            </div>
            <div>
              <label className="text-slate-400 font-bold block mb-1">رقم الخيمة</label>
              <input
                type="text"
                required
                value={formData.tentNumber}
                onChange={e => setFormData({ ...formData, tentNumber: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
              />
            </div>
            <div>
              <label className="text-slate-400 font-bold block mb-1">قطاع المخيم</label>
              <select
                value={formData.campZone}
                onChange={e => setFormData({ ...formData, campZone: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
              >
                <option value="القطاع أ - مربع الشهداء">القطاع أ - مربع الشهداء</option>
                <option value="القطاع ب - مربع النخيل">القطاع ب - مربع النخيل</option>
                <option value="القطاع ج - مربع الصمود">القطاع ج - مربع الصمود</option>
                <option value="القطاع د - مربع السلام">القطاع د - مربع السلام</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-slate-400 font-bold block mb-1">معيل الأسرة</label>
              <select
                value={formData.headGender}
                onChange={e => setFormData({ ...formData, headGender: e.target.value as any })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
              >
                <option value="female">امرأة (أسر تعيلها نساء)</option>
                <option value="male">رجل</option>
                <option value="child">قاصر / طفل معيل</option>
              </select>
            </div>

            <div>
              <label className="text-slate-400 font-bold block mb-1">عدد أفراد الأسرة</label>
              <input
                type="number"
                min="1"
                max="25"
                required
                value={formData.familySize}
                onChange={e => setFormData({ ...formData, familySize: parseInt(e.target.value) || 1 })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
              />
            </div>

            <div>
              <label className="text-slate-400 font-bold block mb-1">أطفال دون سن 5</label>
              <input
                type="number"
                min="0"
                value={formData.childrenUnder5}
                onChange={e => setFormData({ ...formData, childrenUnder5: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="text-slate-400 font-bold block mb-1">ذوو إعاقة</label>
              <input
                type="number"
                min="0"
                value={formData.personsWithDisability}
                onChange={e => setFormData({ ...formData, personsWithDisability: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
              />
            </div>
            <div>
              <label className="text-slate-400 font-bold block mb-1">جرحى حرب</label>
              <input
                type="number"
                min="0"
                value={formData.warInjuredCount}
                onChange={e => setFormData({ ...formData, warInjuredCount: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
              />
            </div>
            <div>
              <label className="text-slate-400 font-bold block mb-1">كبار سن (60+)</label>
              <input
                type="number"
                min="0"
                value={formData.elderly60Plus}
                onChange={e => setFormData({ ...formData, elderly60Plus: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
              />
            </div>
            <div>
              <label className="text-slate-400 font-bold block mb-1">أيتام</label>
              <input
                type="number"
                min="0"
                value={formData.orphansCount}
                onChange={e => setFormData({ ...formData, orphansCount: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
              />
            </div>
          </div>

          <div className="border-t border-slate-800 pt-3">
            <h4 className="text-cyan-400 font-bold mb-2">بيانات المأوى والمياه (معايير اسفير)</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-slate-400 font-bold block mb-1">مساحة المأوى (م²)</label>
                <input
                  type="number"
                  min="4"
                  max="60"
                  required
                  value={formData.shelterAreaM2}
                  onChange={e => setFormData({ ...formData, shelterAreaM2: parseFloat(e.target.value) || 12 })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 font-bold block mb-1">المياه اليومية للأسرة (لتر)</label>
                <input
                  type="number"
                  min="5"
                  max="300"
                  required
                  value={formData.dailyWaterLiters}
                  onChange={e => setFormData({ ...formData, dailyWaterLiters: parseFloat(e.target.value) || 30 })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 font-bold block mb-1">الشريحة المعيشية</label>
                <select
                  value={formData.economicTier}
                  onChange={e => setFormData({ ...formData, economicTier: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                >
                  <option value="ultra_destitute">معدمة كلياً (انعدام أي دخل)</option>
                  <option value="poor">فقيرة</option>
                  <option value="limited_income">محدودة الدخل</option>
                  <option value="relative_capacity">قدرة نسبية</option>
                </select>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-3">
            <label className="text-slate-400 font-bold block mb-1">ملاحظات وظروف طارئة</label>
            <textarea
              rows={2}
              value={formData.notes}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
              placeholder="مثال: الخيمة تغرق بالمياه، حاجة لغيار جروح يومي، طفل مريض..."
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
            />
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
              حفظ وتوليد مؤشر الهشاشة
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
