import React, { useState, useMemo } from 'react';
import { Household } from '../types/cccm';
import { calculateHouseholdVulnerability } from '../utils/vulnerabilityCalculator';
import { 
  UserPlus, 
  ArrowRight, 
  CheckCircle2, 
  ShieldAlert, 
  Tent, 
  Droplets, 
  HeartHandshake, 
  Activity, 
  AlertTriangle, 
  Save, 
  RotateCcw,
  Sparkles,
  Info,
  Users,
  Eye
} from 'lucide-react';

interface NewRegistrationPageProps {
  existingHouseholdsCount: number;
  onSaveHousehold: (newHousehold: Household) => void;
  onCancel: () => void;
  onViewFamily: (household: Household) => void;
}

export const NewRegistrationPage: React.FC<NewRegistrationPageProps> = ({
  existingHouseholdsCount,
  onSaveHousehold,
  onCancel,
  onViewFamily
}) => {
  const nextNumber = existingHouseholdsCount + 1;
  const initialId = `FAM-${String(nextNumber).padStart(3, '0')}`;
  const initialCode = `GZ-AAW-${1000 + nextNumber}`;

  const defaultFormState: Household = {
    id: initialId,
    anonymizedCode: initialCode,
    headNameOrPseudonym: '',
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
    originLocation: 'شمال غزة - جباليا',
    campZone: 'القطاع أ - مربع الشهداء',
    tentNumber: `T-${String(nextNumber + 10).padStart(3, '0')}`,
    
    // Shelter & NFI
    shelterType: 'خيمة قماشية',
    shelterAreaM2: 14,
    shelterCondition: 'poor',
    winterized: false,
    blanketsAvailable: 3,
    mattressesAvailable: 2,
    tarpaulinNeeded: true,

    // WASH
    dailyWaterLiters: 45,
    drinkingWaterSourceSafe: false,
    distanceToWaterMeters: 180,
    waterQueueMinutes: 30,
    sharedLatrineUsersCount: 30,
    latrineGenderSeparated: true,
    latrineLightedAndSafe: false,
    hygieneKitReceivedLast30Days: false,
    menstrualHygieneAvailable: false,

    // Food & Nutrition
    foodAssistanceLast14Days: false,
    dailyMealsCount: 1,
    infantNutritionRisk: false,

    // Health
    activeInfections: [],
    urgentReferralNeeded: false,
    unmetMedicationNeeds: false,

    // Socioeconomic
    economicTier: 'ultra_destitute',
    livelihoodSource: 'معدم كلياً - بلا أي مصدر دخل',

    // Education & Protection
    outOfSchoolChildren: 2,
    unaccompaniedMinors: false,
    nightLightingSafe: false,

    surveyDate: new Date().toISOString().slice(0, 10),
    notes: ''
  };

  const [formData, setFormData] = useState<Household>(defaultFormState);
  const [successSavedHousehold, setSuccessSavedHousehold] = useState<Household | null>(null);

  // Live vulnerability calculation
  const liveAnalysis = useMemo(() => {
    return calculateHouseholdVulnerability(formData);
  }, [formData]);

  const familySize = Math.max(1, formData.familySize);
  const areaPerPerson = (formData.shelterAreaM2 / familySize).toFixed(1);
  const waterPerPerson = (formData.dailyWaterLiters / familySize).toFixed(1);

  const handleInfectionToggle = (infection: 'إسهال حاد' | 'جرب وأمراض جلدية' | 'التهابات تنفسية' | 'التهاب كبد وبائي أ') => {
    const current = formData.activeInfections || [];
    if (current.includes(infection)) {
      setFormData({ ...formData, activeInfections: current.filter(i => i !== infection) });
    } else {
      setFormData({ ...formData, activeInfections: [...current, infection] });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalHousehold: Household = {
      ...formData,
      vulnerabilityScore: liveAnalysis.score,
      vulnerabilityTier: liveAnalysis.tier
    };
    onSaveHousehold(finalHousehold);
    setSuccessSavedHousehold(finalHousehold);
  };

  const handleReset = () => {
    setFormData(defaultFormState);
    setSuccessSavedHousehold(null);
  };

  if (successSavedHousehold) {
    return (
      <div className="max-w-2xl mx-auto my-12 bg-slate-900 border border-emerald-500/40 rounded-3xl p-8 shadow-2xl text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-lg shadow-emerald-950/50">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-black text-white">تم تسجيل وحفظ الأسرة بنجاح في السجل الميداني!</h2>
          <p className="text-slate-300 text-sm">
            تم تشفير بيانات الأسرة وتوليد مؤشر الهشاشة آلياً وفق معايير اسفير.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-2 text-right">
          <div className="flex justify-between border-b border-slate-800 pb-2">
            <span className="text-slate-400">الرمز المشفر (AAP):</span>
            <span className="font-mono font-bold text-cyan-400">{successSavedHousehold.anonymizedCode}</span>
          </div>
          <div className="flex justify-between border-b border-slate-800 pb-2">
            <span className="text-slate-400">رقم الخيمة والقطاع:</span>
            <span className="font-bold text-white">{successSavedHousehold.tentNumber} ({successSavedHousehold.campZone})</span>
          </div>
          <div className="flex justify-between border-b border-slate-800 pb-2">
            <span className="text-slate-400">درجة مؤشر الهشاشة:</span>
            <span className={`font-black text-sm ${
              liveAnalysis.tier === 'critical' ? 'text-rose-400' :
              liveAnalysis.tier === 'high' ? 'text-amber-400' : 'text-sky-400'
            }`}>
              {liveAnalysis.score} نقطة ({liveAnalysis.tierLabelAr})
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">الأفراد:</span>
            <span className="font-bold text-white">{successSavedHousehold.familySize} أفراد</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => onViewFamily(successSavedHousehold)}
            className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition cursor-pointer flex items-center gap-2 shadow-lg shadow-cyan-900/40"
          >
            <Eye className="w-4 h-4" />
            <span>عرض الملف الإنساني للأسرة</span>
          </button>

          <button
            onClick={handleReset}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition cursor-pointer flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4 text-emerald-400" />
            <span>تسجيل أسرة أخرى جديدة</span>
          </button>

          <button
            onClick={onCancel}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition cursor-pointer flex items-center gap-2"
          >
            <ArrowRight className="w-4 h-4" />
            <span>العودة إلى سجل الأسر</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Bar with Back and Title */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer border border-slate-700"
            title="رجوع لسجل الأسر"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                استمارة الحصر الميداني الشاملة
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {formData.anonymizedCode}
              </span>
            </div>
            <h1 className="text-lg sm:text-2xl font-black text-white mt-0.5">
              صفحة تسجيل ومسح أسرة نازحة جديدة
            </h1>
            <p className="text-xs text-slate-400">
              تعبئة البيانات الميدانية والقطاعية وحساب مؤشر الهشاشة الفوري وفق معايير اسفير
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={handleReset}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs border border-slate-700 transition cursor-pointer flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>إعادة تعيين</span>
          </button>
        </div>
      </div>

      {/* Main 2-Column Layout: Form on Right, Live Indicator Sidebar on Left */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Form Column (2 spans) */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
          
          {/* Section 1: Demographics & Protection */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3">
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">1. بيانات الأسرة والتركيبة الديموغرافية والحماية</h2>
                <p className="text-xs text-slate-400">حماية الخصوصية ومنع كشف الهويات (معايير AAP)</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="text-slate-300 font-bold block mb-1">الرمز المشفر الفريد (AAP Code)</label>
                <input
                  type="text"
                  readOnly
                  value={formData.anonymizedCode}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-cyan-400 font-mono font-bold"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">يُستخدم في قوائم التوزيع دون أسماء</span>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">
                  الاسم التقديري / الاسم المستعار <span className="text-slate-500">(سري)</span>
                </label>
                <input
                  type="text"
                  placeholder="مثال: أم إبراهيم، أبو خليل..."
                  value={formData.headNameOrPseudonym}
                  onChange={e => setFormData({ ...formData, headNameOrPseudonym: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">
                  جنس وحالة معيل الأسرة <span className="text-rose-400">*</span>
                </label>
                <select
                  value={formData.headGender}
                  onChange={e => setFormData({ ...formData, headGender: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-cyan-500 cursor-pointer"
                >
                  <option value="female">امرأة معيلة (FHH) - أرملة / مفقود زوجها</option>
                  <option value="male">رجل</option>
                  <option value="child">قاصر / طفل معيل (أيتام دون رعاية)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="text-slate-300 font-bold block mb-1">
                  رقم الخيمة <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.tentNumber}
                  onChange={e => setFormData({ ...formData, tentNumber: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">
                  قطاع المخيم والمربع <span className="text-rose-400">*</span>
                </label>
                <select
                  value={formData.campZone}
                  onChange={e => setFormData({ ...formData, campZone: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white cursor-pointer"
                >
                  <option value="القطاع أ - مربع الشهداء">القطاع أ - مربع الشهداء</option>
                  <option value="القطاع أ - مربع الأمل">القطاع أ - مربع الأمل</option>
                  <option value="القطاع ب - مربع النخيل">القطاع ب - مربع النخيل</option>
                  <option value="القطاع ب - مربع الهدى">القطاع ب - مربع الهدى</option>
                  <option value="القطاع ج - مربع الصمود">القطاع ج - مربع الصمود</option>
                  <option value="القطاع ج - مربع الزيتون">القطاع ج - مربع الزيتون</option>
                  <option value="القطاع د - مربع السلام">القطاع د - مربع السلام</option>
                  <option value="القطاع د - مربع النور">القطاع د - مربع النور</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">مكان السكن الأصلي قبل النزوح</label>
                <input
                  type="text"
                  placeholder="مثال: شمال غزة - بيت لاهيا، حي الشجاعية..."
                  value={formData.originLocation}
                  onChange={e => setFormData({ ...formData, originLocation: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                />
              </div>
            </div>

            {/* Demographics Counts */}
            <div className="pt-2 border-t border-slate-800">
              <span className="text-xs font-bold text-cyan-300 block mb-2">أفراد الأسرة والفئات المستضعفة:</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1 font-bold">إجمالي الأفراد</label>
                  <input
                    type="number"
                    min="1"
                    max="25"
                    required
                    value={formData.familySize}
                    onChange={e => setFormData({ ...formData, familySize: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-bold"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">أطفال دون 5 سنوات</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.childrenUnder5}
                    onChange={e => setFormData({ ...formData, childrenUnder5: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">أطفال سن مدرسة (6-17)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.childrenSchoolAge}
                    onChange={e => setFormData({ ...formData, childrenSchoolAge: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">كبار سن (60+)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.elderly60Plus}
                    onChange={e => setFormData({ ...formData, elderly60Plus: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">نساء حوامل أو مرضعات</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.pregnantLactatingWomen}
                    onChange={e => setFormData({ ...formData, pregnantLactatingWomen: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">أشخاص من ذوي الإعاقة</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.personsWithDisability}
                    onChange={e => setFormData({ ...formData, personsWithDisability: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">جرحى ومصابي حرب</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.warInjuredCount}
                    onChange={e => setFormData({ ...formData, warInjuredCount: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">أيتام في رعاية الأسرة</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.orphansCount}
                    onChange={e => setFormData({ ...formData, orphansCount: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                <div>
                  <label className="text-slate-400 block mb-1">عدد مرات النزوح السابقة</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.displacementCount}
                    onChange={e => setFormData({ ...formData, displacementCount: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  />
                </div>

                <div className="flex items-center gap-2 pt-5">
                  <input
                    type="checkbox"
                    id="unaccompanied"
                    checked={formData.unaccompaniedMinors}
                    onChange={e => setFormData({ ...formData, unaccompaniedMinors: e.target.checked })}
                    className="w-4 h-4 rounded text-rose-500 cursor-pointer"
                  />
                  <label htmlFor="unaccompanied" className="text-rose-300 font-bold cursor-pointer">
                    يوجد أطفال غير مصحوبين بذويهم (حالة حماية طارئة)
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Shelter & NFIs */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/20">
                <Tent className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">2. المأوى والمواد غير الغذائية (معايير اسفير: 3.5 م²/فرد)</h2>
                <p className="text-xs text-slate-400">تقييم الاكتظاظ ومقاومة الرياح والمنخفضات الجوية الشتوية</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="text-slate-300 font-bold block mb-1">نوع المأوى الحالي</label>
                <select
                  value={formData.shelterType}
                  onChange={e => setFormData({ ...formData, shelterType: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white cursor-pointer"
                >
                  <option value="خيمة قماشية">خيمة قماشية عادية</option>
                  <option value="شادر بلاستيكي">شادر بلاستيكي مؤقت</option>
                  <option value="بقايا زنكو وشوادر">بقايا زنكو وشوادر متهالكة</option>
                  <option value="خيمة محسنة ومعزولة">خيمة محسنة ومعزولة</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">
                  مساحة المأوى الإجمالية (م²) <span className="text-rose-400">*</span>
                </label>
                <input
                  type="number"
                  min="4"
                  max="80"
                  required
                  value={formData.shelterAreaM2}
                  onChange={e => setFormData({ ...formData, shelterAreaM2: parseFloat(e.target.value) || 12 })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-bold"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  المساحة الحالية للشخص: <strong className={Number(areaPerPerson) < 3.5 ? 'text-rose-400' : 'text-emerald-400'}>{areaPerPerson} م²</strong> (معيار اسفير: 3.5 م²)
                </span>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">حالة المأوى والسلامة</label>
                <select
                  value={formData.shelterCondition}
                  onChange={e => setFormData({ ...formData, shelterCondition: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white cursor-pointer"
                >
                  <option value="critical">🔴 حرجة (تمزق كامل وخطر سقوط)</option>
                  <option value="poor">🟠 رديئة (تسرب مياه وتلف جزئي)</option>
                  <option value="fair">🟡 متوسطة ومقبولة</option>
                  <option value="good">🟢 جيدة وصامدة</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-2">
              <div>
                <label className="text-slate-400 block mb-1">البطانيات المتوفرة</label>
                <input
                  type="number"
                  min="0"
                  value={formData.blanketsAvailable}
                  onChange={e => setFormData({ ...formData, blanketsAvailable: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">الفرشات المتوفرة</label>
                <input
                  type="number"
                  min="0"
                  value={formData.mattressesAvailable}
                  onChange={e => setFormData({ ...formData, mattressesAvailable: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div className="flex items-center gap-2 pt-5">
                <input
                  type="checkbox"
                  id="winterized"
                  checked={formData.winterized}
                  onChange={e => setFormData({ ...formData, winterized: e.target.checked })}
                  className="w-4 h-4 rounded text-cyan-500 cursor-pointer"
                />
                <label htmlFor="winterized" className="text-slate-300 font-semibold cursor-pointer">
                  مأوى معزول ضد المطر
                </label>
              </div>

              <div className="flex items-center gap-2 pt-5">
                <input
                  type="checkbox"
                  id="tarpaulinNeeded"
                  checked={formData.tarpaulinNeeded}
                  onChange={e => setFormData({ ...formData, tarpaulinNeeded: e.target.checked })}
                  className="w-4 h-4 rounded text-amber-500 cursor-pointer"
                />
                <label htmlFor="tarpaulinNeeded" className="text-amber-300 font-bold cursor-pointer">
                  بحاجة ماسة لشادر نايلون
                </label>
              </div>
            </div>
          </div>

          {/* Section 3: WASH */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3">
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-300 border border-blue-500/20">
                <Droplets className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">3. المياه والإصحاح البيئي والنظافة (معايير اسفير: 15 لتر/فرد - مرحاض:20)</h2>
                <p className="text-xs text-slate-400">كميات المياه الصالحة، المسافة، وزمن الانتظار، وأمان المراحيض</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="text-slate-300 font-bold block mb-1">
                  كمية المياه اليومية المستلمة للأسرة (لتر) <span className="text-rose-400">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  max="350"
                  required
                  value={formData.dailyWaterLiters}
                  onChange={e => setFormData({ ...formData, dailyWaterLiters: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-bold"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  الحصة الحالية للفرد: <strong className={Number(waterPerPerson) < 15 ? 'text-rose-400' : 'text-emerald-400'}>{waterPerPerson} لتر/فرد</strong> (المعيار: 15L)
                </span>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">المسافة لأقرب نقطة مياه (متر)</label>
                <input
                  type="number"
                  min="5"
                  max="1500"
                  value={formData.distanceToWaterMeters}
                  onChange={e => setFormData({ ...formData, distanceToWaterMeters: parseInt(e.target.value) || 100 })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">معيار اسفير: أقل من 500 متر</span>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">وقت الانتظار على طابور المياه (دقيقة)</label>
                <input
                  type="number"
                  min="0"
                  max="180"
                  value={formData.waterQueueMinutes}
                  onChange={e => setFormData({ ...formData, waterQueueMinutes: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">معيار اسفير: لا يزيد عن 30 دقيقة</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-2">
              <div>
                <label className="text-slate-300 font-bold block mb-1">كم شخصاً يتشاركون نفس المرحاض؟</label>
                <input
                  type="number"
                  min="5"
                  max="80"
                  value={formData.sharedLatrineUsersCount}
                  onChange={e => setFormData({ ...formData, sharedLatrineUsersCount: parseInt(e.target.value) || 20 })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">معيار اسفير: مرحاض لكل 20 شخصاً كحد أقصى</span>
              </div>

              <div className="flex items-center gap-2 pt-6">
                <input
                  type="checkbox"
                  id="latrineGenderSeparated"
                  checked={formData.latrineGenderSeparated}
                  onChange={e => setFormData({ ...formData, latrineGenderSeparated: e.target.checked })}
                  className="w-4 h-4 rounded text-cyan-500 cursor-pointer"
                />
                <label htmlFor="latrineGenderSeparated" className="text-slate-300 font-semibold cursor-pointer">
                  مراحيض مفصولة للنساء والرجال
                </label>
              </div>

              <div className="flex items-center gap-2 pt-6">
                <input
                  type="checkbox"
                  id="latrineLightedAndSafe"
                  checked={formData.latrineLightedAndSafe}
                  onChange={e => setFormData({ ...formData, latrineLightedAndSafe: e.target.checked })}
                  className="w-4 h-4 rounded text-cyan-500 cursor-pointer"
                />
                <label htmlFor="latrineLightedAndSafe" className="text-slate-300 font-semibold cursor-pointer">
                  المراحيض والممرات مضاءة وآمنة ليلاً
                </label>
              </div>
            </div>
          </div>

          {/* Section 4: Food & Health */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">4. الأمن الغذائي والصحة والأوبئة</h2>
                <p className="text-xs text-slate-400">تكرار الوجبات، سوء التغذية، انقطاع الأدوية، والأمراض المعدية النشطة</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="text-slate-300 font-bold block mb-1">عدد الوجبات اليومية للأسرة</label>
                <select
                  value={formData.dailyMealsCount}
                  onChange={e => setFormData({ ...formData, dailyMealsCount: parseInt(e.target.value) || 1 })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white cursor-pointer"
                >
                  <option value={1}>وجبة واحدة فقط يومياً (حرج)</option>
                  <option value={2}>وجبتان يومياً</option>
                  <option value={3}>3 وجبات يومياً</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">استلام مساعدة غذائية خلال 14 يوماً</label>
                <select
                  value={formData.foodAssistanceLast14Days ? 'yes' : 'no'}
                  onChange={e => setFormData({ ...formData, foodAssistanceLast14Days: e.target.value === 'yes' })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white cursor-pointer"
                >
                  <option value="no">لم تستلم أي طرد أو وجبة تكية (0 استلام)</option>
                  <option value="yes">استلمت طرداً غذائياً أو تكية</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">مرضى الأمراض المزمنة (ضغط/سكري/كلى)</label>
                <input
                  type="number"
                  min="0"
                  value={formData.chronicIllnessesCount}
                  onChange={e => setFormData({ ...formData, chronicIllnessesCount: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                />
              </div>
            </div>

            {/* Health Toggles */}
            <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
              <span className="text-slate-300 font-bold block">الأمراض المعدية النشطة حالياً في الخيمة:</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['إسهال حاد', 'جرب وأمراض جلدية', 'التهابات تنفسية', 'التهاب كبد وبائي أ'] as const).map(inf => {
                  const isChecked = formData.activeInfections?.includes(inf);
                  return (
                    <button
                      type="button"
                      key={inf}
                      onClick={() => handleInfectionToggle(inf)}
                      className={`p-2.5 rounded-xl border text-right transition cursor-pointer flex items-center justify-between ${
                        isChecked
                          ? 'bg-rose-950/60 border-rose-500 text-rose-200'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <span>{inf}</span>
                      <span className={`w-3.5 h-3.5 rounded-full border ${isChecked ? 'bg-rose-500 border-rose-400' : 'border-slate-600'}`}></span>
                    </button>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="unmetMeds"
                    checked={formData.unmetMedicationNeeds}
                    onChange={e => setFormData({ ...formData, unmetMedicationNeeds: e.target.checked })}
                    className="w-4 h-4 rounded text-rose-500 cursor-pointer"
                  />
                  <label htmlFor="unmetMeds" className="text-rose-300 font-bold cursor-pointer">
                    انقطاع تام لأدوية الأمراض المزمنة
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="urgentReferral"
                    checked={formData.urgentReferralNeeded}
                    onChange={e => setFormData({ ...formData, urgentReferralNeeded: e.target.checked })}
                    className="w-4 h-4 rounded text-rose-500 cursor-pointer"
                  />
                  <label htmlFor="urgentReferral" className="text-rose-300 font-bold cursor-pointer">
                    حاجة لتحويل طبي أو جراحي عاجل
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="nutritionRisk"
                    checked={formData.infantNutritionRisk}
                    onChange={e => setFormData({ ...formData, infantNutritionRisk: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-500 cursor-pointer"
                  />
                  <label htmlFor="nutritionRisk" className="text-amber-300 font-bold cursor-pointer">
                    خطر سوء تغذية لأطفال الأسرة
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Section 5: Socioeconomic Tier & Notes */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3">
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-300 border border-purple-500/20">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">5. الشريحة المعيشية ومصدر الدخل وملاحظات الميدان</h2>
                <p className="text-xs text-slate-400">تحديد نوع التدخل التمايزي المناسب لعدم وصم الأسرة</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-slate-300 font-bold block mb-1">
                  الشريحة المعيشية المصنفة <span className="text-rose-400">*</span>
                </label>
                <select
                  value={formData.economicTier}
                  onChange={e => setFormData({ ...formData, economicTier: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white cursor-pointer"
                >
                  <option value="ultra_destitute">معدمة كلياً (انعدام أي مدخرات أو دخل)</option>
                  <option value="poor">فقيرة (دخل متقطع وشديد الشح)</option>
                  <option value="limited_income">محدودة الدخل (حرفي، مدخرات محدودة)</option>
                  <option value="relative_capacity">قدرة نسبية (موظف براتب جزئي، تجارة بسيطة)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">مصدر الدخل أو المهنة السابقة</label>
                <input
                  type="text"
                  placeholder="مثال: عامل بناء متوقف، خياط، سباك، موظف تعليم..."
                  value={formData.livelihoodSource}
                  onChange={e => setFormData({ ...formData, livelihoodSource: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-300 font-bold block mb-1">ملاحظات وشهادات الباحث الميداني</label>
              <textarea
                rows={3}
                placeholder="اكتب أي تفاصيل إضافية: غرق الخيمة، حاجة أجهزة مساعدة للمشي، أيتام بلا كفيل..."
                value={formData.notes}
                onChange={e => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs"
              />
            </div>

            {/* Submit Action Bar */}
            <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={onCancel}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition cursor-pointer"
              >
                إلغاء والرجوع
              </button>

              <button
                type="submit"
                className="px-7 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-extrabold text-sm shadow-xl shadow-cyan-950/60 transition cursor-pointer flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>حفظ واعتماد الأسرة وتوليد مؤشر الهشاشة</span>
              </button>
            </div>
          </div>
        </form>

        {/* Live Indicator Sticky Sidebar (1 span) */}
        <div className="lg:sticky lg:top-28 space-y-4">
          <div className="bg-slate-900 border border-cyan-500/40 rounded-3xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-sm text-white">مؤشر الهشاشة التقديري المباشر</h3>
              </div>
              <span className="text-[10px] text-slate-400">حساب آلي لحظي</span>
            </div>

            {/* Score Big Display */}
            <div className="text-center p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <span className={`text-4xl font-black ${
                liveAnalysis.tier === 'critical' ? 'text-rose-400' :
                liveAnalysis.tier === 'high' ? 'text-amber-400' :
                liveAnalysis.tier === 'medium' ? 'text-sky-400' : 'text-emerald-400'
              }`}>
                {liveAnalysis.score}
              </span>
              <span className="text-slate-500 text-xs block">من 100</span>

              <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold ${
                liveAnalysis.tier === 'critical' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' :
                liveAnalysis.tier === 'high' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                liveAnalysis.tier === 'medium' ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40' :
                'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              }`}>
                {liveAnalysis.tierLabelAr}
              </span>
            </div>

            {/* Sphere Instant Checks */}
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">المساحة المغطاة:</span>
                <span className={`font-bold ${Number(areaPerPerson) < 3.5 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {areaPerPerson} م²/شخص {Number(areaPerPerson) < 3.5 && '(عجز اسفير)'}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">المياه اليومية:</span>
                <span className={`font-bold ${Number(waterPerPerson) < 15 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {waterPerPerson} لتر/فرد {Number(waterPerPerson) < 15 && '(دون 15L)'}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">حالة المأوى:</span>
                <span className="font-bold text-slate-200">{formData.shelterCondition}</span>
              </div>
            </div>

            {/* Factors list preview */}
            <div className="border-t border-slate-800 pt-3">
              <span className="text-[11px] font-bold text-slate-400 block mb-2">العوامل المساهمة في النقاط:</span>
              <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1 text-[11px]">
                {liveAnalysis.breakdown.map((b, i) => (
                  <div key={i} className="flex justify-between items-center bg-slate-950 p-2 rounded-lg border border-slate-800/80">
                    <span className="text-slate-300 truncate max-w-[170px]" title={b.factor}>
                      {b.factor}
                    </span>
                    <span className="font-bold text-cyan-400 shrink-0">+{b.points}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
