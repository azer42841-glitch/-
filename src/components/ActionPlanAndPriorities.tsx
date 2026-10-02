import React, { useState } from 'react';
import { ActionPlanItem } from '../types/cccm';
import { 
  ClipboardList, 
  AlertTriangle, 
  Clock, 
  DollarSign, 
  CheckCircle2, 
  TrendingUp, 
  Zap, 
  Target,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';

interface ActionPlanAndPrioritiesProps {
  actionPlan: ActionPlanItem[];
  onUpdateProgress: (id: string, progress: number) => void;
}

export const ActionPlanAndPriorities: React.FC<ActionPlanAndPrioritiesProps> = ({
  actionPlan,
  onUpdateProgress
}) => {
  const [activeTimeframe, setActiveTimeframe] = useState<'all' | '72 ساعة (فوري)' | 'أسبوعين' | 'شهر'>('all');

  const filteredPlan = actionPlan.filter(item => {
    if (activeTimeframe !== 'all' && item.timeframe !== activeTimeframe) return false;
    return true;
  });

  const totalBudgetUSD = actionPlan.reduce((acc, curr) => acc + curr.estimatedCostUSD, 0);
  const immediateBudgetUSD = actionPlan
    .filter(i => i.timeframe === '72 ساعة (فوري)')
    .reduce((acc, curr) => acc + curr.estimatedCostUSD, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-rose-950 text-rose-300 border border-rose-800 animate-pulse">
              مصفوفة إنقاذ الحياة والطوارئ
            </span>
            <span className="text-xs text-slate-400">معيار (الخطورة × عدد المتأثرين ÷ سهولة التدخل)</span>
          </div>
          <h2 className="text-xl font-bold text-white">تحديد الأولويات وخطة العمل التنفيذية</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            برنامج عمل مرحلي: فجوات الـ 72 ساعة المنقذة للحياة، أولويات الأسبوعين، وأولويات استقرار الشهر
          </p>
        </div>

        {/* Budget overview badge */}
        <div className="flex items-center gap-3 bg-slate-950 p-3 rounded-2xl border border-slate-800">
          <div>
            <span className="text-[11px] text-slate-400 block">إجمالي موازنة خطة الطوارئ:</span>
            <span className="text-lg font-black text-emerald-400">${totalBudgetUSD.toLocaleString()} USD</span>
          </div>
          <div className="border-r border-slate-800 pr-3">
            <span className="text-[11px] text-rose-400 block font-bold">موازنة الـ 72 ساعة:</span>
            <span className="text-sm font-black text-rose-300">${immediateBudgetUSD.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* 3 Tier Cards for Quick Priority Scan */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 72h Life saving */}
        <div 
          onClick={() => setActiveTimeframe('72 ساعة (فوري)')}
          className={`p-4 rounded-2xl border transition cursor-pointer ${
            activeTimeframe === '72 ساعة (فوري)'
              ? 'bg-rose-950/40 border-rose-500 text-white shadow-xl shadow-rose-950/30 ring-1 ring-rose-500'
              : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-rose-600/30 text-rose-300 border border-rose-500/40">
              🔴 خلال 72 ساعة (فوري)
            </span>
            <span className="text-xs font-bold text-rose-400">إنقاذ حياة عاجل</span>
          </div>
          <h3 className="text-base font-bold text-white">أهم التدخلات المهددة للحياة</h3>
          <p className="text-xs text-slate-400 mt-1">
            صيانة الخيام الممزقة والغارقة، زيادة صهاريج مياه الشرب لمنع الأوبئة، وتأمين حماية قصوى للأيتام والنساء.
          </p>
          <div className="mt-3 text-xs font-bold text-slate-400 flex justify-between">
            <span>أنشطة معتمدة: {actionPlan.filter(i => i.timeframe === '72 ساعة (فوري)').length}</span>
            <span className="text-rose-300">${immediateBudgetUSD} USD</span>
          </div>
        </div>

        {/* 2-Week priorities */}
        <div 
          onClick={() => setActiveTimeframe('أسبوعين')}
          className={`p-4 rounded-2xl border transition cursor-pointer ${
            activeTimeframe === 'أسبوعين'
              ? 'bg-amber-950/40 border-amber-500 text-white shadow-xl shadow-amber-950/30 ring-1 ring-amber-500'
              : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-600/30 text-amber-300 border border-amber-500/40">
              🟠 خلال أسبوعين
            </span>
            <span className="text-xs font-bold text-amber-400">احتواء وتثبيت</span>
          </div>
          <h3 className="text-base font-bold text-white">أولويات الأسبوعين القادمين</h3>
          <p className="text-xs text-slate-400 mt-1">
            إنارة الممرات بالطاقة الشمسية، تأمين أدوية الأمراض المزمنة، وتجهيز وحدات مراحيض إضافية مفصولة وآمنة.
          </p>
          <div className="mt-3 text-xs font-bold text-slate-400 flex justify-between">
            <span>أنشطة معتمدة: {actionPlan.filter(i => i.timeframe === 'أسبوعين').length}</span>
            <span className="text-amber-300">
              ${actionPlan.filter(i => i.timeframe === 'أسبوعين').reduce((s, c) => s + c.estimatedCostUSD, 0)} USD
            </span>
          </div>
        </div>

        {/* 1-Month priorities */}
        <div 
          onClick={() => setActiveTimeframe('شهر')}
          className={`p-4 rounded-2xl border transition cursor-pointer ${
            activeTimeframe === 'شهر'
              ? 'bg-cyan-950/40 border-cyan-500 text-white shadow-xl shadow-cyan-950/30 ring-1 ring-cyan-500'
              : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-cyan-600/30 text-cyan-300 border border-cyan-500/40">
              🟡 خلال شهر
            </span>
            <span className="text-xs font-bold text-cyan-400">استقرار وصمود</span>
          </div>
          <h3 className="text-base font-bold text-white">أولويات الشهر القادم</h3>
          <p className="text-xs text-slate-400 mt-1">
            برنامج نقد مقابل العمل (CfW)، خيام التعليم والدعم النفسي للأطفال، وتعزيز مشاريع الخياطة المجهرية.
          </p>
          <div className="mt-3 text-xs font-bold text-slate-400 flex justify-between">
            <span>أنشطة معتمدة: {actionPlan.filter(i => i.timeframe === 'شهر').length}</span>
            <span className="text-cyan-300">
              ${actionPlan.filter(i => i.timeframe === 'شهر').reduce((s, c) => s + c.estimatedCostUSD, 0)} USD
            </span>
          </div>
        </div>
      </div>

      {/* Action Plan Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-white text-base">جدول خطة العمل التنفيذية (Operational Plan)</h3>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">عرض الجدول:</span>
            <button
              onClick={() => setActiveTimeframe('all')}
              className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                activeTimeframe === 'all' ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              الكل ({actionPlan.length})
            </button>
            <button
              onClick={() => setActiveTimeframe('72 ساعة (فوري)')}
              className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                activeTimeframe === '72 ساعة (فوري)' ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              72 ساعة
            </button>
            <button
              onClick={() => setActiveTimeframe('أسبوعين')}
              className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                activeTimeframe === 'أسبوعين' ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              أسبوعين
            </button>
            <button
              onClick={() => setActiveTimeframe('شهر')}
              className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                activeTimeframe === 'شهر' ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              شهر
            </button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-800">
          <table className="w-full text-right border-collapse text-xs">
            <thead>
              <tr className="bg-slate-950 text-slate-400 font-bold border-b border-slate-800">
                <th className="p-3.5">النشاط والقطاع</th>
                <th className="p-3.5">الفئة والعدد المستهدف</th>
                <th className="p-3.5">المسؤول والموارد المطلوبة</th>
                <th className="p-3.5">التكلفة التقديرية</th>
                <th className="p-3.5">المدة ومؤشر النجاح</th>
                <th className="p-3.5 text-center">نسبة الإنجاز</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-slate-900/60">
              {filteredPlan.map(item => {
                return (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition">
                    <td className="p-3.5">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-[10px] text-cyan-400 bg-slate-950 px-1.5 py-0.2 rounded border border-slate-800">
                          {item.id}
                        </span>
                        <span className="text-[11px] font-bold text-cyan-300">{item.sector}</span>
                        <span className={`px-2 py-0.2 rounded text-[10px] font-bold ${
                          item.timeframe === '72 ساعة (فوري)' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                          item.timeframe === 'أسبوعين' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                          'bg-sky-950 text-sky-300 border border-sky-800'
                        }`}>
                          {item.timeframe}
                        </span>
                      </div>
                      <p className="text-white font-semibold leading-relaxed max-w-sm">
                        {item.activity}
                      </p>
                    </td>

                    <td className="p-3.5">
                      <span className="text-slate-200 font-bold block">{item.targetGroup}</span>
                      <span className="text-slate-400 text-[11px] mt-0.5 block">
                        العدد: <strong className="text-white">{item.targetCount} مستفيد</strong>
                      </span>
                    </td>

                    <td className="p-3.5">
                      <span className="text-slate-200 font-semibold block">{item.focalPoint}</span>
                      <span className="text-slate-400 text-[11px] mt-0.5 block leading-relaxed max-w-xs">
                        {item.requiredResources}
                      </span>
                    </td>

                    <td className="p-3.5">
                      <span className="text-base font-black text-emerald-400">
                        ${item.estimatedCostUSD.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-slate-500 block">USD</span>
                    </td>

                    <td className="p-3.5">
                      <div className="text-slate-300 leading-relaxed max-w-xs text-[11px]">
                        <span className="text-cyan-400 font-bold block mb-0.5">مؤشر التحقق:</span>
                        {item.successIndicator}
                      </div>
                    </td>

                    <td className="p-3.5 text-center">
                      <div className="inline-flex flex-col items-center">
                        <span className="font-bold text-white text-xs mb-1">{item.progressPercent}%</span>
                        <div className="w-16 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className="bg-cyan-500 h-full rounded-full transition-all"
                            style={{ width: `${item.progressPercent}%` }}
                          ></div>
                        </div>
                        <div className="flex gap-1 mt-1.5">
                          <button
                            onClick={() => onUpdateProgress(item.id, Math.min(100, item.progressPercent + 20))}
                            className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold cursor-pointer"
                            title="زيادة نسبة الإنجاز"
                          >
                            +20%
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
