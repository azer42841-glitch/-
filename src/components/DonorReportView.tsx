import React, { useState } from 'react';
import { CampAggregateMetrics, generateSectorAnalyses } from '../utils/sphereStandards';
import { ActionPlanItem, CampRisk, Household } from '../types/cccm';
import { 
  Printer, 
  Copy, 
  Check, 
  FileText, 
  ShieldCheck, 
  DollarSign, 
  Download, 
  Layers, 
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { EXCEL_SURVEY_COLUMNS } from '../utils/dataCleaning';

interface DonorReportViewProps {
  metrics: CampAggregateMetrics;
  actionPlan: ActionPlanItem[];
  risks: CampRisk[];
  households: Household[];
}

export const DonorReportView: React.FC<DonorReportViewProps> = ({
  metrics,
  actionPlan,
  risks,
  households
}) => {
  const [copied, setCopied] = useState(false);
  const sectors = generateSectorAnalyses(metrics);

  const totalBudget = actionPlan.reduce((sum, item) => sum + item.estimatedCostUSD, 0);

  const handlePrint = () => {
    window.print();
  };

  const generateReportText = () => {
    return `تقرير الوضع الإنساني الميداني الشامل | مخيم نازحي «أطياف العودة» - قطاع غزة
تاريخ الإصدار: ${new Date().toLocaleDateString('ar-EG', { dateStyle: 'full' })}
المرجعيات: معايير اسفير الدنيا (Sphere Project) | المبادئ الإنسانية وحماية البيانات (AAP / PSEA)

1. الملخص التنفيذي:
يقيم في مخيم «أطياف العودة» ${metrics.totalPopulation} نازحاً (${metrics.totalHouseholds} أسرة)، حيث تعيل النساء ${metrics.femaleHeadedHouseholds} أسرة. يعاني المخيم من عجز مائي حاد يبلغ ${metrics.waterGapLiters} لتر/فرد/يوم دون معيار اسفير، واكتظاظ شديد بمعدل ${metrics.avgCoveredAreaPerPerson} م²/شخص.
أهم 3 توصيات عاجلة:
1) مضاعفة توريد صهاريج المياه الصالحة للاستخدام يومياً لوقف تفشي الأمراض الجلدية والمعوية.
2) توريد شوادر نايلون مقواة وعوازل أرضية لـ ${metrics.damagedShelterCount} خيمة متهالكة قبل الأمطار.
3) إنارة الممرات وحول المراحيض بالطاقة الشمسية لحماية النساء والأطفال.

2. لوحة المؤشرات الرئيسية (Sphere KPIs):
- حصة المياه اليومية: ${metrics.avgWaterLitersPerPerson} لتر/فرد (المعيار: 15 لتر) - فجوة ${metrics.waterGapLiters} لتر [حرج]
- نسبة المراحيض للسكان: 1:${metrics.avgPersonsPerLatrine} (المعيار: 1:20) - عجز ${metrics.latrineDeficitCount} وحدة [حرج]
- مساحة المأوى المغطاة: ${metrics.avgCoveredAreaPerPerson} م²/فرد (المعيار: 3.5 م²) [عالٍ]
- الأمن الغذائي: ${metrics.dailyMealDeficitRate}% يعتمدون على وجبة واحدة شحيحة [عالٍ]

الميزانية التقديرية المطلوبة للتدخلات: $${totalBudget.toLocaleString()} دولار أمريكي.`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateReportText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
              وثيقة التمويل والنداء الإنساني الرسمي
            </span>
            <span className="text-xs text-slate-400">UN OCHA / Clusters / International Donors Format</span>
          </div>
          <h2 className="text-xl font-bold text-white">التقرير الإنساني الشامل لمخيم «أطياف العودة»</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            تقرير احترافي متكامل جاهز للمشاركة والطباعة بصيغة المانحين والمؤسسات الدولية
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition cursor-pointer flex items-center gap-1.5"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-cyan-400" />}
            <span>{copied ? 'تم نسخ التقرير!' : 'نسخ النص كاملاً'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-lg shadow-cyan-900/40"
          >
            <Printer className="w-4 h-4" />
            <span>طباعة / حفظ كـ PDF رسمي</span>
          </button>
        </div>
      </div>

      {/* The Printable Humanitarian Report Paper */}
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-10 shadow-2xl text-slate-100 space-y-8 font-cairo print:bg-white print:text-black print:border-none print:shadow-none print:p-0">
        
        {/* Document Header */}
        <div className="border-b-2 border-slate-800 pb-6 flex flex-col sm:flex-row justify-between items-start gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold text-xs uppercase tracking-wider print:bg-slate-100 print:text-slate-800 print:border-slate-300">
                مخيم أطياف العودة - قطاع غزة | CCCM GAZA
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white print:text-black tracking-tight">
              تقرير تقييم الاحتياجات الإنسانية والنداء العاجل
            </h1>
            <p className="text-sm text-slate-400 print:text-slate-600 mt-1">
              إشراف خبير إدارة وتنسيق المخيمات (CCCM) ومحلل البيانات الإنسانية | وفق معايير اسفير الدولية
            </p>
          </div>

          <div className="text-left text-xs text-slate-400 print:text-slate-600 space-y-1">
            <div><strong>تاريخ المسح:</strong> {new Date().toLocaleDateString('ar-EG', { dateStyle: 'long' })}</div>
            <div><strong>رمز الموقع:</strong> CCCM-GZ-AAW-2026</div>
            <div><strong>حالة الحماية:</strong> مشفر وخالٍ من الهويات الشخصية (AAP)</div>
          </div>
        </div>

        {/* 1. الملخص التنفيذي */}
        <section className="space-y-3">
          <h2 className="text-lg font-black text-cyan-300 print:text-blue-900 border-r-4 border-cyan-500 pr-3">
            1. الملخص التنفيذي (Executive Summary)
          </h2>
          <div className="bg-slate-950/60 print:bg-slate-50 p-4 rounded-2xl border border-slate-800 print:border-slate-300 leading-relaxed text-xs sm:text-sm text-slate-200 print:text-slate-800 space-y-3">
            <p>
              يستضيف مخيم نازحي «أطياف العودة» في قطاع غزة حالياً <strong>{metrics.totalPopulation} نازحاً</strong> ينتمون إلى <strong>{metrics.totalHouseholds} أسرة</strong> من خلفيات معيشية متفاوتة (أسر معدمة فقدت معيلها ومأواها، عمال يومية ومزارعون متعطلون، وموظفون بلا رواتب). تعيل النساء <strong>{metrics.femaleHeadedHouseholds} أسرة</strong>، ويضم المخيم <strong>{metrics.childrenUnder5Total} أطفال دون سن الخامسة</strong> و <strong>{metrics.disabledTotal + metrics.warInjuredTotal} من ذوي الإعاقة وجرحى الحرب</strong>، في ظل انهيار شبه تام للبنية التحتية الأساسية.
            </p>
            <p>
              أظهر التحليل الميداني عجزاً مائياً حرجاً ({metrics.avgWaterLitersPerPerson} لتر/فرد/يوم مقابل 15 لتراً كمعيار اسفير)، واكتظاظاً شديداً بالمراحيض بمعدل مرحاض لكل {metrics.avgPersonsPerLatrine} شخصاً، مما أدى لتسجيل {metrics.activeEpidemicCount} إصابة بأمراض جلدية وإسهالات وبائية، إضافة إلى {metrics.damagedShelterCount} خيمة متهالكة تتطلب تدخلاً شتوياً عاجلاً قبل المنخفضات الجوية.
            </p>
            <div className="border-t border-slate-800 print:border-slate-300 pt-3">
              <strong className="text-white print:text-black block mb-1">أهم 3 توصيات فورية لإنقاذ الحياة:</strong>
              <ol className="list-decimal list-inside space-y-1 text-slate-300 print:text-slate-700">
                <li><strong>تأمين صهاريج مياه معقمة يومياً</strong> لرفع الحصة إلى 15 لتر/فرد وتركيب 12 وحدة مراحيض مفصولة.</li>
                <li><strong>توريد 150 شادراً بلاستيكياً سميكاً (200 ميكرون) وألواح خشبية</strong> لعزل الخيام عن السيول.</li>
                <li><strong>تأمين حزمة أدوية الأمراض المزمنة</strong> وتنسيق إحالات جراحية عاجلة لـ {metrics.urgentReferralsCount} حالات حرجة.</li>
              </ol>
            </div>
          </div>
        </section>

        {/* 2. لوحة مؤشرات اسفير الرئيسية */}
        <section className="space-y-3">
          <h2 className="text-lg font-black text-cyan-300 print:text-blue-900 border-r-4 border-cyan-500 pr-3">
            2. لوحة المؤشرات الرئيسية (CCCM & Sphere KPIs)
          </h2>
          <div className="overflow-x-auto rounded-2xl border border-slate-800 print:border-slate-300">
            <table className="w-full text-right text-xs print:text-[11px] border-collapse">
              <thead>
                <tr className="bg-slate-950 print:bg-slate-100 text-slate-300 print:text-black font-bold border-b border-slate-800">
                  <th className="p-3">المؤشر الإنساني</th>
                  <th className="p-3">القيمة الميدانية الحالية</th>
                  <th className="p-3">معيار اسفير الأدنى</th>
                  <th className="p-3">الفجوة المحسوبة</th>
                  <th className="p-3 text-center">الحالة الإنسانية</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 print:divide-slate-200">
                <tr>
                  <td className="p-3 font-bold text-white print:text-black">حصة المياه اليومية للفرد</td>
                  <td className="p-3 text-amber-300 font-bold">{metrics.avgWaterLitersPerPerson} لتر/فرد/يوم</td>
                  <td className="p-3">15 لتراً للشخص يومياً</td>
                  <td className="p-3 text-rose-400 font-bold">عجز {metrics.waterGapLiters} لتر ({100 - metrics.waterCoveragePercentage}%)</td>
                  <td className="p-3 text-center">
                    <span className="px-2 py-0.5 rounded font-bold bg-rose-950 text-rose-300 border border-rose-800">🔴 حرج</span>
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-white print:text-black">نسبة السكان إلى المراحيض</td>
                  <td className="p-3 text-amber-300 font-bold">مرحاض لكل {metrics.avgPersonsPerLatrine} شخصاً</td>
                  <td className="p-3">مرحاض لكل 20 شخصاً كحد أقصى</td>
                  <td className="p-3 text-amber-400 font-bold">عجز {metrics.latrineDeficitCount} وحدة مرحاض</td>
                  <td className="p-3 text-center">
                    <span className="px-2 py-0.5 rounded font-bold bg-rose-950 text-rose-300 border border-rose-800">🔴 حرج</span>
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-white print:text-black">مساحة المأوى المغطاة للفرد</td>
                  <td className="p-3 text-amber-300 font-bold">{metrics.avgCoveredAreaPerPerson} م²/شخص</td>
                  <td className="p-3">3.5 م² مغطاة للشخص</td>
                  <td className="p-3 text-amber-400 font-bold">عجز {metrics.shelterAreaGapM2} م²/شخص</td>
                  <td className="p-3 text-center">
                    <span className="px-2 py-0.5 rounded font-bold bg-amber-950 text-amber-300 border border-amber-800">🟠 عالٍ</span>
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-white print:text-black">الأمن الغذائي والسعرات</td>
                  <td className="p-3">{metrics.dailyMealDeficitRate}% يعيشون على وجبة واحدة</td>
                  <td className="p-3">2,100 سعرة حرارية/يوم</td>
                  <td className="p-3 text-rose-400 font-bold">{metrics.nutritionRiskCount} طفلاً في خطر سوء تغذية</td>
                  <td className="p-3 text-center">
                    <span className="px-2 py-0.5 rounded font-bold bg-amber-950 text-amber-300 border border-amber-800">🟠 عالٍ</span>
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-white print:text-black">إنارة الممرات ليلاً والسلامة</td>
                  <td className="p-3">{metrics.nightLightingDeficitPercent}% من الممرات مظلمة</td>
                  <td className="p-3">ممرات ومرافق مضاءة وآمنة تماماً</td>
                  <td className="p-3 text-amber-400 font-bold">مخاطر حماية ليلية للنساء والأطفال</td>
                  <td className="p-3 text-center">
                    <span className="px-2 py-0.5 rounded font-bold bg-amber-950 text-amber-300 border border-amber-800">🟠 عالٍ</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 3. التحليل القطاعي */}
        <section className="space-y-3">
          <h2 className="text-lg font-black text-cyan-300 print:text-blue-900 border-r-4 border-cyan-500 pr-3">
            3. التحليل القطاعي الميداني (Sectoral Deep Dive)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {sectors.map(sector => (
              <div key={sector.id} className="p-4 rounded-2xl bg-slate-950/70 print:bg-slate-50 border border-slate-800 print:border-slate-300 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white print:text-black">{sector.nameAr}</h3>
                  <span className="text-[11px] text-cyan-300 font-bold">{sector.affectedPopulation} متأثر</span>
                </div>
                <div className="text-slate-400 print:text-slate-600">
                  <strong>الفجوة الحالية:</strong> {sector.currentValue} ({sector.gapPercentage}% عجز)
                </div>
                <ul className="space-y-1 text-slate-300 print:text-slate-700">
                  {sector.keyFindings.slice(0, 2).map((kf, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-cyan-400">•</span>
                      <span>{kf}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* 4. تحليل التفاوت والشرائح */}
        <section className="space-y-3">
          <h2 className="text-lg font-black text-cyan-300 print:text-blue-900 border-r-4 border-cyan-500 pr-3">
            4. تحليل التفاوت المعيشي وتصنيف الأسر والتدخلات التمايزية
          </h2>
          <div className="bg-slate-950/60 print:bg-slate-50 p-4 rounded-2xl border border-slate-800 print:border-slate-300 text-xs leading-relaxed space-y-2.5">
            <p>
              لتفادي وصم الأسر ومنع التوترات الاجتماعية أو الاتكالية، تم تصنيف أسر المخيم إلى 4 شرائح معيشية متمايزة:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3 rounded-xl bg-slate-900 print:bg-white border border-slate-800 print:border-slate-200">
                <strong className="text-rose-400 block mb-1">الشريحة المعدمة كلياً ({metrics.ultraDestituteCount} أسرة):</strong>
                <span>تتلقى مساعدة إغاثية كاملة 100% غير مشروطة (غذائية، نقدية، مياه واصلة للخيمة، أغطية).</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 print:bg-white border border-slate-800 print:border-slate-200">
                <strong className="text-amber-400 block mb-1">الشريحة الفقيرة ({metrics.poorCount} أسرة):</strong>
                <span>دعم تمويني ومواد نظافة دورية، صيانة دورية للمأوى، وتسهيل الحصول على الدواء المزمن.</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 print:bg-white border border-slate-800 print:border-slate-200">
                <strong className="text-cyan-400 block mb-1">الشريحة محدودة الدخل ({metrics.limitedIncomeCount} أسرة):</strong>
                <span>شمول أربابها في برامج النقد مقابل العمل (CfW) في صيانة مرافق المخيم وتوزيع المياه.</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 print:bg-white border border-slate-800 print:border-slate-200">
                <strong className="text-emerald-400 block mb-1">الشريحة ذات القدرة النسبية ({metrics.relativeCapacityCount} أسر):</strong>
                <span>تمكين مجتمعي وتكليفهم بلجان الإدارة والتنسيق دون شمولهم بالطرود العامة.</span>
              </div>
            </div>
          </div>
        </section>

        {/* 5. مؤشر الهشاشة وتوزيع الأسر */}
        <section className="space-y-3">
          <h2 className="text-lg font-black text-cyan-300 print:text-blue-900 border-r-4 border-cyan-500 pr-3">
            5. مؤشر الهشاشة المرجعي (Vulnerability Index 0 - 100)
          </h2>
          <div className="p-4 rounded-2xl bg-slate-950 print:bg-slate-50 border border-slate-800 print:border-slate-300 text-xs">
            <p className="text-slate-300 print:text-slate-700 mb-3">
              تم احتساب المؤشر وفق خوارزمية علمية ترتكز على: إعالة المرأة/الطفل (+15)، الإعاقة وجرحى الحرب (+15)، انقطاع دواء الأمراض المزمنة (+10)، الأطفال دون 5 والحوامل (+10)، الاكتظاظ دون معيار اسفير (+12)، انعدام الدخل (+14)، وتكرار النزوح (+8).
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/60">
                <span className="text-xl font-black text-rose-400">{metrics.criticalCount}</span>
                <span className="text-[11px] text-slate-300 block font-bold mt-1">حرجة (75-100)</span>
              </div>
              <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-800/60">
                <span className="text-xl font-black text-amber-400">{metrics.highCount}</span>
                <span className="text-[11px] text-slate-300 block font-bold mt-1">عالية (55-74)</span>
              </div>
              <div className="p-3 rounded-xl bg-sky-950/40 border border-sky-800/60">
                <span className="text-xl font-black text-sky-400">{metrics.mediumCount}</span>
                <span className="text-[11px] text-slate-300 block font-bold mt-1">متوسطة (35-54)</span>
              </div>
              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/60">
                <span className="text-xl font-black text-emerald-400">{metrics.lowCount}</span>
                <span className="text-[11px] text-slate-300 block font-bold mt-1">منخفضة (&lt;35)</span>
              </div>
            </div>
          </div>
        </section>

        {/* 6. الأولويات والمصفوفة */}
        <section className="space-y-3">
          <h2 className="text-lg font-black text-cyan-300 print:text-blue-900 border-r-4 border-cyan-500 pr-3">
            6. مصفوفة الأولويات الفورية (Severity × Impact Matrix)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-4 rounded-2xl bg-slate-950 border border-rose-800/60 space-y-1.5">
              <span className="text-rose-400 font-bold">🔴 خلال 72 ساعة (إنقاذ حياة فوري):</span>
              <p className="text-slate-300">عزل الخيام الغارقة بشوادر سميكة، ضخ صهاريج مياه معقمة عاجلة، وتضميد جروح البتر وتأمين أنسولين للأسر الحرجة.</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-amber-800/60 space-y-1.5">
              <span className="text-amber-400 font-bold">🟠 خلال أسبوعين (تثبيت واحتواء):</span>
              <p className="text-slate-300">تركيب 25 وحدة إنارة شمسية في الممرات ومراحيض النساء، عيادة جلدية لعلاج الجرب، وحملة رش مبيدات وتعقيم.</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-cyan-800/60 space-y-1.5">
              <span className="text-cyan-400 font-bold">🟡 خلال شهر (استقرار وتمكين):</span>
              <p className="text-slate-300">افتتاح خيمة تعليمية للأطفال منقطعي المدارس، وإطلاق برنامج النقد مقابل العمل (CfW) لـ 20 شاباً وحرفياً.</p>
            </div>
          </div>
        </section>

        {/* 7. خطة العمل والميزانية التقديرية */}
        <section className="space-y-3">
          <h2 className="text-lg font-black text-cyan-300 print:text-blue-900 border-r-4 border-cyan-500 pr-3">
            7. الميزانية التقديرية المطلوبة للمانحين (Estimated Donor Budget)
          </h2>
          <div className="overflow-x-auto rounded-2xl border border-slate-800 print:border-slate-300">
            <table className="w-full text-right text-xs print:text-[11px] border-collapse">
              <thead>
                <tr className="bg-slate-950 print:bg-slate-100 text-slate-300 print:text-black font-bold border-b border-slate-800">
                  <th className="p-3">بند التدخل الإنساني</th>
                  <th className="p-3">القطاع</th>
                  <th className="p-3">العدد المستهدف</th>
                  <th className="p-3">المدة</th>
                  <th className="p-3 text-left">التكلفة التقديرية (USD)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 print:divide-slate-200">
                {actionPlan.map(item => (
                  <tr key={item.id}>
                    <td className="p-3 font-semibold text-white print:text-black">{item.activity}</td>
                    <td className="p-3 text-slate-400">{item.sector}</td>
                    <td className="p-3 text-slate-300">{item.targetCount} مستفيد</td>
                    <td className="p-3">{item.timeframe}</td>
                    <td className="p-3 text-left font-mono font-bold text-emerald-400 print:text-emerald-700">
                      ${item.estimatedCostUSD.toLocaleString()}
                    </td>
                  </tr>
                ))}
                <tr className="bg-slate-950/80 print:bg-slate-100 font-black text-white print:text-black border-t-2 border-slate-700">
                  <td colSpan={4} className="p-3 text-base">إجمالي التمويل المطلوب لكافة الأنشطة:</td>
                  <td className="p-3 text-left text-base text-emerald-400 print:text-emerald-700">
                    ${totalBudget.toLocaleString()} USD
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 8. المخاطر وخطة الطوارئ */}
        <section className="space-y-3">
          <h2 className="text-lg font-black text-cyan-300 print:text-blue-900 border-r-4 border-cyan-500 pr-3">
            8. سجل المخاطر وخطة طوارئ الإخلاء (Risk & Contingency)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {risks.map(risk => (
              <div key={risk.id} className="p-3.5 rounded-2xl bg-slate-950 print:bg-slate-50 border border-slate-800 print:border-slate-300 space-y-1.5">
                <div className="flex justify-between font-bold">
                  <span className="text-white print:text-black">{risk.title}</span>
                  <span className="text-rose-400">{risk.likelihood} / {risk.impact}</span>
                </div>
                <p className="text-slate-400 print:text-slate-600"><strong>إجراء التخفيف:</strong> {risk.mitigationPlan}</p>
                <p className="text-rose-300/90 print:text-rose-800"><strong>خطة الطوارئ:</strong> {risk.contingencyPlan}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 9. البيانات الناقصة ونموذج الاستمارة المقترح */}
        <section className="space-y-3">
          <h2 className="text-lg font-black text-cyan-300 print:text-blue-900 border-r-4 border-cyan-500 pr-3">
            9. فجوات البيانات ونموذج استمارة مسح الأسر المقترح (CCCM Standard Form)
          </h2>
          <div className="p-4 rounded-2xl bg-slate-950 print:bg-slate-50 border border-slate-800 print:border-slate-300 text-xs space-y-3">
            <p className="text-slate-300 print:text-slate-700">
              لتحقيق الدقة الإحصائية وتجنب أي تقديرات غير موثقة، تم اعتماد استمارة المسح الميدانية الشاملة التي تتضمن الحقول المعيارية التالية:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {EXCEL_SURVEY_COLUMNS.map((col, idx) => (
                <span key={idx} className="px-2 py-1 rounded bg-slate-900 print:bg-white text-slate-300 print:text-slate-800 border border-slate-800 print:border-slate-300 text-[11px]">
                  {col.labelAr}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* 10. أسئلة إضافية لتحسين دقة التحليل القادم */}
        <section className="space-y-3 border-t border-slate-800 print:border-slate-300 pt-5">
          <h2 className="text-lg font-black text-amber-400 print:text-amber-800 flex items-center gap-2">
            <HelpCircle className="w-5 h-5" />
            <span>10. أسئلة وبيانات إضافية موصى بجمعها لرفع دقة التقييم القادم:</span>
          </h2>
          <div className="bg-amber-950/20 print:bg-amber-50 p-4 rounded-2xl border border-amber-800/40 print:border-amber-300 text-xs text-amber-200/90 print:text-amber-900 space-y-2">
            <p><strong>1. مسح فحص التغذية الميداني (MUAC Screening):</strong> قياس محيط منتصف الذراع لجميع الأطفال من عمر 6 أشهر إلى 59 شهراً والنساء الحوامل لتحديد النسب الدقيقة لسوء التغذية الحاد الوخيم والمتوسط.</p>
            <p><strong>2. قياس ملوحة ومكلورة المياه (Free Residual Chlorine):</strong> فحص كيميائي بيولوجي أسبوعي لصهاريج المياه ونقاط التوزيع لضمان خلوها من بكتيريا الإشريكية القولونية E. Coli ومطابقتها لمواصفات WHO.</p>
            <p><strong>3. حصر تفصيلي للديون واستراتيجيات التكيف السلبية:</strong> مسح مؤشر استراتيجيات التكيف مع سبل العيش (rCSI) لمعرفة حجم بيع مقتنيات الإغاثة أو تقليص وجبات البالغين لصالح الأطفال.</p>
          </div>
        </section>

      </div>
    </div>
  );
};
