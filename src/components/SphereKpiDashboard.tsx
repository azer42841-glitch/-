import React from 'react';
import { 
  Droplets, 
  Tent, 
  Users, 
  ShieldAlert, 
  HeartHandshake, 
  AlertTriangle, 
  ArrowUpRight,
  TrendingDown,
  Info,
  CheckCircle2,
  Clock,
  Sparkles
} from 'lucide-react';
import { CampAggregateMetrics } from '../utils/sphereStandards';

interface SphereKpiDashboardProps {
  metrics: CampAggregateMetrics;
  onNavigateToTab: (tab: string) => void;
  onFilterVulnerability: (tier: string) => void;
}

export const SphereKpiDashboard: React.FC<SphereKpiDashboardProps> = ({
  metrics,
  onNavigateToTab,
  onFilterVulnerability
}) => {
  const getStatusBadge = (status: 'critical' | 'high' | 'medium' | 'acceptable') => {
    switch (status) {
      case 'critical':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse">🔴 حرج جداً</span>;
      case 'high':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black bg-amber-500/20 text-amber-300 border border-amber-500/40">🟠 فجوة عالية</span>;
      case 'medium':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black bg-sky-500/20 text-sky-300 border border-sky-500/40">🟡 فجوة متوسطة</span>;
      case 'acceptable':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">🟢 متوافق مع اسفير</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Executive Summary Card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/40 border border-cyan-500/30 rounded-2xl p-5 sm:p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                تقييم الاحتياجات الميدانية الفوري
              </span>
              <span className="text-xs text-slate-400">تحديث مستمر وفق معايير اسفير الدولية</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              الملخص التنفيذي لمخيم «أطياف العودة» - قطاع غزة
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
              يقيم في المخيم حالياً <strong className="text-cyan-300 font-black">{metrics.totalPopulation} نازحاً</strong> موزعين على <strong className="text-cyan-300 font-black">{metrics.totalHouseholds} أسرة</strong>، وسط انهيار كامل للشبكات العامة واعتماد كلي على المساعدات الإنسانية اليومية. تعيل النساء <strong className="text-rose-300">{metrics.femaleHeadedHouseholds} أسرة</strong>، ويضم المخيم <strong className="text-amber-300">{metrics.childrenUnder5Total} أطفال دون سن الخامسة</strong> و <strong className="text-purple-300">{metrics.disabledTotal + metrics.warInjuredTotal} من ذوي الإعاقة وجرحى الحرب</strong>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onNavigateToTab('donor_report')}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-sm shadow-lg shadow-cyan-950/50 transition cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-cyan-200" />
              <span>عرض تقرير المانحين الكامل</span>
            </button>
            <button
              onClick={() => onNavigateToTab('priorities')}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm border border-slate-700 transition cursor-pointer flex items-center gap-1.5"
            >
              <span>خطة الـ 72 ساعة</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Top 3 Life-saving Recommendations */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-rose-950/40 border border-rose-800/50 rounded-xl p-3.5 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-rose-600/30 text-rose-300 shrink-0 mt-0.5">
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-rose-200">1. مضاعفة صهاريج المياه الصالحة</h4>
              <p className="text-xs text-rose-300/80 mt-1 leading-relaxed">
                عجز المياه يبلغ {metrics.waterGapLiters} لتر/فرد/يوم دون معيار اسفير، مما أدى لتسجيل {metrics.activeEpidemicCount} إصابة بأمراض جلدية وإسهال حاد.
              </p>
            </div>
          </div>

          <div className="bg-amber-950/40 border border-amber-800/50 rounded-xl p-3.5 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-amber-600/30 text-amber-300 shrink-0 mt-0.5">
              <Tent className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-amber-200">2. عزل الخيام الشتوي قبل المطر</h4>
              <p className="text-xs text-amber-300/80 mt-1 leading-relaxed">
                {metrics.damagedShelterCount} خيمة متهالكة وغير معزولة، ومساحة الفرد ({metrics.avgCoveredAreaPerPerson} م²) دون المعيار الأدنى (3.5 م²).
              </p>
            </div>
          </div>

          <div className="bg-purple-950/40 border border-purple-800/50 rounded-xl p-3.5 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-purple-600/30 text-purple-300 shrink-0 mt-0.5">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-purple-200">3. إنارة الممرات وحماية النساء والأطفال</h4>
              <p className="text-xs text-purple-300/80 mt-1 leading-relaxed">
                {metrics.nightLightingDeficitPercent}% من الممرات مظلمة تماماً ليلاً مع اكتظاظ المراحيض غير المفصولة، مما يرفع مخاطر السلامة والحماية.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Core Sphere KPI Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <span>مؤشرات معايير اسفير الدنيا (Sphere Project Minimum Standards)</span>
            <span className="text-xs font-normal text-slate-400">مقارنة الوضع الميداني الحالي بالمعيار الإنساني الدولي</span>
          </h3>
          <span className="text-xs text-slate-400">آخر مسح ميداني: أكتوبر 2026</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Water card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg hover:border-slate-700 transition">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Droplets className="w-5 h-5" />
              </div>
              {getStatusBadge(metrics.waterStatus)}
            </div>

            <p className="text-xs text-slate-400 font-medium">حصة المياه اليومية للفرد</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-white">{metrics.avgWaterLitersPerPerson}</span>
              <span className="text-xs text-slate-400">لتر / فرد / يوم</span>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-800/80 text-xs space-y-1.5">
              <div className="flex justify-between text-slate-400">
                <span>معيار اسفير الأدنى:</span>
                <span className="font-bold text-slate-200">15 لتر / فرد</span>
              </div>
              <div className="flex justify-between text-rose-400">
                <span>فجوة العجز:</span>
                <span className="font-bold">{metrics.waterGapLiters} لتر (-{100 - metrics.waterCoveragePercentage}%)</span>
              </div>
              {/* Progress bar */}
              <div className="w-full bg-slate-800 rounded-full h-2 mt-2 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    metrics.waterStatus === 'critical' ? 'bg-rose-500' : 'bg-amber-500'
                  }`}
                  style={{ width: `${metrics.waterCoveragePercentage}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Sanitation Latrines Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg hover:border-slate-700 transition">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Users className="w-5 h-5" />
              </div>
              {getStatusBadge(metrics.latrineStatus)}
            </div>

            <p className="text-xs text-slate-400 font-medium">نسبة السكان إلى المراحيض</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-white">1 : {metrics.avgPersonsPerLatrine}</span>
              <span className="text-xs text-slate-400">فرد / مرحاض</span>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-800/80 text-xs space-y-1.5">
              <div className="flex justify-between text-slate-400">
                <span>معيار اسفير الأقصى:</span>
                <span className="font-bold text-slate-200">مرحاض لكل 20 فرداً</span>
              </div>
              <div className="flex justify-between text-amber-400">
                <span>العجز في وحدات المراحيض:</span>
                <span className="font-bold">{metrics.latrineDeficitCount} وحدة مرحاض</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>غياب الفصل التام:</span>
                <span className="font-semibold text-rose-300">{metrics.latrineUnseparatedCount} أسرة</span>
              </div>
            </div>
          </div>

          {/* Shelter Space Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg hover:border-slate-700 transition">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Tent className="w-5 h-5" />
              </div>
              {getStatusBadge(metrics.shelterStatus)}
            </div>

            <p className="text-xs text-slate-400 font-medium">المساحة المغطاة للشخص</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-white">{metrics.avgCoveredAreaPerPerson}</span>
              <span className="text-xs text-slate-400">م² / فرد</span>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-800/80 text-xs space-y-1.5">
              <div className="flex justify-between text-slate-400">
                <span>معيار اسفير الأدنى:</span>
                <span className="font-bold text-slate-200">3.5 م² / فرد</span>
              </div>
              <div className="flex justify-between text-rose-400">
                <span>فجوة الاكتظاظ:</span>
                <span className="font-bold">عجز {metrics.shelterAreaGapM2} م²/فرد</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>خيام تالفة وبحاجة صيانة:</span>
                <span className="font-semibold text-amber-300">{metrics.damagedShelterCount} خيمة</span>
              </div>
            </div>
          </div>

          {/* Food and Nutrition Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg hover:border-slate-700 transition">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <HeartHandshake className="w-5 h-5" />
              </div>
              {getStatusBadge(metrics.dailyMealDeficitRate > 40 ? 'critical' : 'high')}
            </div>

            <p className="text-xs text-slate-400 font-medium">الأمن الغذائي والوجبات</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-white">{metrics.dailyMealDeficitRate}%</span>
              <span className="text-xs text-slate-400">يعيشون على وجبة واحدة</span>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-800/80 text-xs space-y-1.5">
              <div className="flex justify-between text-slate-400">
                <span>معيار السعرات اليومية:</span>
                <span className="font-bold text-slate-200">2,100 سعرة / فرد</span>
              </div>
              <div className="flex justify-between text-rose-400">
                <span>أطفال في خطر سوء تغذية:</span>
                <span className="font-bold">{metrics.nutritionRiskCount} طفل ورضيع</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>أسر لم تستلم طرداً منذ 14 يوماً:</span>
                <span className="font-semibold text-amber-300">{metrics.foodUnreachedCount} أسرة</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Two Columns: Vulnerability Index & Socioeconomic Segments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vulnerability Distribution Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>توزيع الأسر وفق مؤشر الهشاشة (0 - 100)</span>
                <span className="p-1 rounded-full bg-slate-800 text-slate-400" title="مبني على أوزان علمية معلنة">
                  <Info className="w-3.5 h-3.5" />
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                تصنيف معياري عادل يمنح الأولوية للمستضعفين دون وصم
              </p>
            </div>
            <button
              onClick={() => onNavigateToTab('families')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-bold transition flex items-center gap-1 cursor-pointer"
            >
              <span>عرض سجل الأسر</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {/* Critical */}
            <div 
              onClick={() => { onFilterVulnerability('critical'); onNavigateToTab('families'); }}
              className="p-3 rounded-xl bg-rose-950/30 border border-rose-800/40 hover:border-rose-600 transition cursor-pointer flex items-center justify-between gap-3 group"
            >
              <div className="flex items-center gap-3">
                <div className="w-3.5 h-3.5 rounded-full bg-rose-500 shrink-0"></div>
                <div>
                  <h4 className="text-sm font-bold text-rose-200 group-hover:text-rose-100">
                    حرجة (75 - 100 نقطة) - أولوية إنقاذ حياة
                  </h4>
                  <p className="text-xs text-rose-300/70">
                    أسر تعيلها نساء، إعاقات وجرحى، أيتام، مأوى تالف، انعدام دخل
                  </p>
                </div>
              </div>
              <div className="text-left">
                <span className="text-xl font-black text-rose-400">{metrics.criticalCount}</span>
                <span className="text-xs text-slate-400 block">
                  {Math.round((metrics.criticalCount / Math.max(1, metrics.totalHouseholds)) * 100)}%
                </span>
              </div>
            </div>

            {/* High */}
            <div 
              onClick={() => { onFilterVulnerability('high'); onNavigateToTab('families'); }}
              className="p-3 rounded-xl bg-amber-950/30 border border-amber-800/40 hover:border-amber-600 transition cursor-pointer flex items-center justify-between gap-3 group"
            >
              <div className="flex items-center gap-3">
                <div className="w-3.5 h-3.5 rounded-full bg-amber-500 shrink-0"></div>
                <div>
                  <h4 className="text-sm font-bold text-amber-200 group-hover:text-amber-100">
                    عالية (55 - 74 نقطة) - تدخل إنساني عاجل
                  </h4>
                  <p className="text-xs text-amber-300/70">
                    أسر مكتظة، أمراض مزمنة، أطفال صغار، شح مياه ومواد أساسية
                  </p>
                </div>
              </div>
              <div className="text-left">
                <span className="text-xl font-black text-amber-400">{metrics.highCount}</span>
                <span className="text-xs text-slate-400 block">
                  {Math.round((metrics.highCount / Math.max(1, metrics.totalHouseholds)) * 100)}%
                </span>
              </div>
            </div>

            {/* Medium */}
            <div 
              onClick={() => { onFilterVulnerability('medium'); onNavigateToTab('families'); }}
              className="p-3 rounded-xl bg-sky-950/30 border border-sky-800/40 hover:border-sky-600 transition cursor-pointer flex items-center justify-between gap-3 group"
            >
              <div className="flex items-center gap-3">
                <div className="w-3.5 h-3.5 rounded-full bg-sky-500 shrink-0"></div>
                <div>
                  <h4 className="text-sm font-bold text-sky-200 group-hover:text-sky-100">
                    متوسطة (35 - 54 نقطة) - دعم وتأهيل دوري
                  </h4>
                  <p className="text-xs text-sky-300/70">
                    مأوى مقبول نسبياً، مهارات مهنية، فرص نقد مقابل العمل
                  </p>
                </div>
              </div>
              <div className="text-left">
                <span className="text-xl font-black text-sky-400">{metrics.mediumCount}</span>
                <span className="text-xs text-slate-400 block">
                  {Math.round((metrics.mediumCount / Math.max(1, metrics.totalHouseholds)) * 100)}%
                </span>
              </div>
            </div>

            {/* Low */}
            <div 
              onClick={() => { onFilterVulnerability('low'); onNavigateToTab('families'); }}
              className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-800/40 hover:border-emerald-600 transition cursor-pointer flex items-center justify-between gap-3 group"
            >
              <div className="flex items-center gap-3">
                <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 shrink-0"></div>
                <div>
                  <h4 className="text-sm font-bold text-emerald-200 group-hover:text-emerald-100">
                    منخفضة (أقل من 35 نقطة) - قدرة نسبية واستقرار
                  </h4>
                  <p className="text-xs text-emerald-300/70">
                    أسر توفر جزءاً من احتياجاتها، مشاركة في اللجان المجتمعية
                  </p>
                </div>
              </div>
              <div className="text-left">
                <span className="text-xl font-black text-emerald-400">{metrics.lowCount}</span>
                <span className="text-xs text-slate-400 block">
                  {Math.round((metrics.lowCount / Math.max(1, metrics.totalHouseholds)) * 100)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Socioeconomic Segments & Differential Intervention */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white">
                شرائح التفاوت المعيشي والتدخلات التمايزية المقترحة
              </h3>
              <p className="text-xs text-slate-400">
                تدخلات متعددة المسارات تمنع الاتكالية وتصون الكرامة الإنسانية
              </p>
            </div>
            <button
              onClick={() => onNavigateToTab('sectors')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-bold transition flex items-center gap-1 cursor-pointer"
            >
              <span>تفاصيل سبل العيش</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-slate-800/70 border border-slate-700/60">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-300 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-800">
                  شريحة معدمة جداً ({metrics.ultraDestituteCount} أسرة)
                </span>
                <span className="text-xs font-bold text-white">نوع التدخل: مساعدة كاملة 100%</span>
              </div>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                طرود غذائية منتظمة، مياه مجانية إلى الخيمة، حفاضات وحليب أطفال، أغطية شتوية، وقسائم كاش غير مشروطة.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/70 border border-slate-700/60">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800">
                  شريحة فقيرة ({metrics.poorCount} أسرة)
                </span>
                <span className="text-xs font-bold text-white">نوع التدخل: دعم جزئي ومواد أساسية</span>
              </div>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                توزيع الطرود التموينية الأساسية شهرياً، صيانة المأوى بالشوادر، وتسهيل الوصول للأدوية المزمنة.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/70 border border-slate-700/60">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800">
                  شريحة محدودة الدخل ({metrics.limitedIncomeCount} أسرة)
                </span>
                <span className="text-xs font-bold text-white">نوع التدخل: النقد مقابل العمل (CfW)</span>
              </div>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                تشغيل أرباب الأسر في صيانة خيام المخيم، السباكة، النظافة، والتعليم، مقابل حوافز مالية مجزية.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/70 border border-slate-700/60">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                  شريحة قدرة نسبية ({metrics.relativeCapacityCount} أسرة)
                </span>
                <span className="text-xs font-bold text-white">نوع التدخل: تمكين ومساهمة مجتمعية</span>
              </div>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                مشاركة في لجان إدارة المخيم الشعبية، ودعم فني للمشاريع المجهرية دون شمولهم في طرود الإغاثة العادية.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
