import React, { useState } from 'react';
import { CampRisk } from '../types/cccm';
import { 
  ShieldCheck, 
  Users, 
  Heart, 
  Sparkles, 
  Layers, 
  AlertTriangle, 
  Compass, 
  FileText,
  LifeBuoy
} from 'lucide-react';

interface GovernanceAndRisksProps {
  risks: CampRisk[];
}

export const GovernanceAndRisks: React.FC<GovernanceAndRisksProps> = ({ risks }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredRisks = risks.filter(r => {
    if (selectedCategory !== 'all' && r.category !== selectedCategory) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
            CCCM Governance & Multi-Hazard Contingency
          </span>
          <span className="text-xs text-slate-400">إشراك المجتمع المتأثر والتخطيط للطوارئ</span>
        </div>
        <h2 className="text-xl font-bold text-white">هيكل إدارة المخيم وسجل المخاطر وخطة الإخلاء</h2>
        <p className="text-xs text-slate-400 mt-0.5">
          لجان تمثيلية شاملة تضم النساء والشباب وذوي الإعاقة، وإدارة استباقية لمخاطر السيول، الأوبئة، والنزوح المتكرر
        </p>
      </div>

      {/* Camp Governance Structure Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xl space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">
              هيكل إدارة المخيم واللجان الشعبية التشاركية المقترحة
            </h3>
            <p className="text-xs text-slate-400">
              بناء حوكمة محلية ديمقراطية تضمن عدم الإقصاء والشفافية التامة أمام النازحين والمنظمات
            </p>
          </div>
        </div>

        {/* Governance Diagram / Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Main Steering Committee */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-cyan-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                القيادة العليا
              </span>
              <span className="text-[11px] text-slate-400 font-bold">11 عضواً منتخباً</span>
            </div>
            <h4 className="text-sm font-bold text-white">اللجنة الإدارية العليا للمخيم</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              تضم ممثلين عن أحياء المخيم الأربعة (أ، ب، ج، د)، مع كوتة إلزامية بنسبة 35% لتمثيل النساء، وممثلين عن فئة الشباب وذوي الإعاقة. مسؤولة عن التنسيق مع الأونروا وOCHA والمؤسسات الدولية.
            </p>
          </div>

          {/* Women & Protection Committee */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-purple-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-purple-950 text-purple-300 border border-purple-800">
                حماية ومساءلة PSEA
              </span>
              <span className="text-[11px] text-slate-400 font-bold">8 عضوات ناشطات</span>
            </div>
            <h4 className="text-sm font-bold text-white">لجنة المرأة والحماية والمساءلة</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              متابعة احتياجات النساء المعيلات والفتيات، أمان المراحيض والممرات ليلاً، الإشراف على سرية صندوق الشكاوى، وضمان كرامة الأمهات والأطفال في جميع التدخلات.
            </p>
          </div>

          {/* Youth & Community Action Committee */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                طوارئ وميدان
              </span>
              <span className="text-[11px] text-slate-400 font-bold">16 شاباً وفتاة</span>
            </div>
            <h4 className="text-sm font-bold text-white">فريق الاستجابة المجتمعية والشباب</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              تنظيم طوابير المياه، حفر مصارف مياه الأمطار حول الخيام، صيانة الشوادر، المساعدة في نقل كبار السن والجرحى، وتسيير الأنشطة الترفيهية للأطفال.
            </p>
          </div>
        </div>

        {/* Specialized Sector Sub-Committees */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
            اللجان التخصصية الميدانية (Focal Sector Units):
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
              <span className="font-bold text-cyan-300 block mb-0.5">لجنة WASH</span>
              <span className="text-[11px] text-slate-400">متابعة الصهاريج والمراحيض</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
              <span className="font-bold text-amber-300 block mb-0.5">لجنة التوزيع</span>
              <span className="text-[11px] text-slate-400">تدقيق القوائم بالرموز</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
              <span className="font-bold text-rose-300 block mb-0.5">اللجنة الطبية</span>
              <span className="text-[11px] text-slate-400">أدوية المزمن والغيارات</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
              <span className="font-bold text-purple-300 block mb-0.5">لجنة التعليم</span>
              <span className="text-[11px] text-slate-400">خيام التعليم والتفريغ</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
              <span className="font-bold text-emerald-300 block mb-0.5">لجنة الشكاوى</span>
              <span className="text-[11px] text-slate-400">فرز الصندوق والتحقيق</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
              <span className="font-bold text-blue-300 block mb-0.5">لجنة الإخلاء</span>
              <span className="text-[11px] text-slate-400">تجهيز طوارئ النزوح</span>
            </div>
          </div>
        </div>
      </div>

      {/* Multi-hazard Risk Register & Contingency Plan */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                سجل المخاطر المتعددة وخطة الطوارئ والإخلاء المفاجئ
              </h3>
              <p className="text-xs text-slate-400">
                تقييم الاحتمالية والأثر، وإجراءات التخفيف الاستباقية وخطة الطوارئ البديلة (Plan B)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">تصفية نوع الخطر:</span>
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 cursor-pointer"
            >
              <option value="all">جميع المخاطر</option>
              <option value="مناخي">مخاطر مناخية وسيول</option>
              <option value="صحي">مخاطر صحية وأوبئة</option>
              <option value="أمني/نزوح">مخاطر أمنية ونزوح متكرر</option>
              <option value="اجتماعي">مخاطر اجتماعية ونزاعات</option>
            </select>
          </div>
        </div>

        {/* Risks list */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRisks.map(risk => (
            <div 
              key={risk.id}
              className="bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 sm:p-5 space-y-3 transition"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-400 px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-800">
                  خطر {risk.category}
                </span>

                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-slate-400">الاحتمالية:</span>
                  <span className="font-bold text-rose-400">{risk.likelihood}</span>
                  <span className="text-slate-600">|</span>
                  <span className="text-slate-400">الأثر:</span>
                  <span className="font-bold text-rose-300">{risk.impact}</span>
                </div>
              </div>

              <h4 className="text-sm font-bold text-white">{risk.title}</h4>

              {/* Mitigation Plan */}
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-amber-300">
                  <LifeBuoy className="w-3.5 h-3.5" />
                  <span>خطة التخفيف الوقائية (Mitigation):</span>
                </div>
                <p className="text-slate-300 leading-relaxed">{risk.mitigationPlan}</p>
              </div>

              {/* Contingency Plan */}
              <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-900/40 text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-rose-300">
                  <Compass className="w-3.5 h-3.5" />
                  <span>خطة الطوارئ والتدخل البديل (Contingency Plan):</span>
                </div>
                <p className="text-rose-200/90 leading-relaxed">{risk.contingencyPlan}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
