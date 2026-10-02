import React, { useState } from 'react';
import { Household, DataAnomaly } from '../types/cccm';
import { inspectDatasetAnomalies, EXCEL_SURVEY_COLUMNS, generateEmptySurveyTemplateCSV } from '../utils/dataCleaning';
import { 
  CheckCheck, 
  AlertTriangle, 
  Download, 
  Upload, 
  Table, 
  X, 
  Info, 
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface DataCleaningModalProps {
  isOpen: boolean;
  onClose: () => void;
  households: Household[];
  onUploadCsv?: (data: string) => void;
}

export const DataCleaningModal: React.FC<DataCleaningModalProps> = ({
  isOpen,
  onClose,
  households,
  onUploadCsv
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'anomalies' | 'columns'>('anomalies');
  const anomalies = inspectDatasetAnomalies(households);

  if (!isOpen) return null;

  const handleDownloadTemplate = () => {
    const csvContent = generateEmptySurveyTemplateCSV();
    const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'استمارة_مسح_الأسر_النموذجية_اسفير.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl my-auto text-xs sm:text-sm">
        {/* Modal Header */}
        <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-600/20 text-cyan-300 border border-cyan-500/30">
              <CheckCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg">
                مركز تنظيف البيانات وفحص الجودة الإحصائية
              </h3>
              <p className="text-xs text-slate-400">
                كشف القيم الشاذة، البيانات المكررة أو المفقودة، وجدول الاستمارة الميدانية المعتمدة
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub-tabs & Download */}
        <div className="p-4 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveSubTab('anomalies')}
              className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeSubTab === 'anomalies'
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-900/40'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <AlertTriangle className="w-4 h-4 text-amber-300" />
              <span>فحص التناقضات والتنبيهات ({anomalies.length})</span>
            </button>

            <button
              onClick={() => setActiveSubTab('columns')}
              className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeSubTab === 'columns'
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-900/40'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Table className="w-4 h-4 text-cyan-400" />
              <span>أعمدة استمارة المسح (Excel Schema)</span>
            </button>
          </div>

          <button
            onClick={handleDownloadTemplate}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1.5 shadow"
          >
            <Download className="w-4 h-4" />
            <span>تحميل ملف Excel/CSV النموذجي</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 max-h-[65vh] overflow-y-auto space-y-4">
          {activeSubTab === 'anomalies' && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-300">
                  إجمالي الأسر الخاضعة للفحص الآلي: <strong className="text-cyan-300">{households.length} أسرة</strong>
                </span>
                <span className={`font-bold ${anomalies.length > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {anomalies.length > 0 ? `تم اكتشاف ${anomalies.length} تنبيه يتطلب التحقق` : 'البيانات سليمة ومتسقة بنسبة 100%'}
                </span>
              </div>

              {anomalies.length === 0 ? (
                <div className="p-8 text-center bg-slate-950 rounded-2xl border border-emerald-900/40 space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                  <h4 className="font-bold text-white text-base">لا توجد أخطاء إحصائية أو تناقضات</h4>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    جميع سجلات الأسر مكتملة، ولا توجد قيم غير منطقية كأعمار مستحيلة أو مساحات مأوى مفقودة أو تكرار في الرموز المشفرة.
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {anomalies.map((anom, idx) => (
                    <div 
                      key={idx}
                      className="p-3.5 rounded-2xl bg-slate-950 border border-amber-900/40 flex items-start gap-3"
                    >
                      <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 shrink-0 mt-0.5">
                        <AlertCircle className="w-4 h-4" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-cyan-300 font-bold">{anom.familyId}</span>
                          <span className="px-2 py-0.2 rounded text-[10px] font-bold bg-slate-800 text-slate-300">
                            الحقل: {anom.field}
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-slate-200">{anom.description}</p>
                        <p className="text-[11px] text-emerald-400">
                          <strong>الإجراء المقترح:</strong> {anom.suggestedFix}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeSubTab === 'columns' && (
            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-cyan-950/30 border border-cyan-800/40 text-xs text-slate-300 leading-relaxed">
                <Info className="w-4 h-4 text-cyan-400 inline ml-1.5" />
                هذا هو جدول الأعمدة المعياري المطلوب لمسح الأسر النازحة في غزة وفق معايير اسفير والـ CCCM. يمكنك تعبئته في Excel أو Google Sheets ورفعه للنظام مباشرة.
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-800">
                <table className="w-full text-right border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-950 text-slate-400 font-bold border-b border-slate-800">
                      <th className="p-3">اسم العمود بالعربية</th>
                      <th className="p-3">المعرف البرمجي (Key)</th>
                      <th className="p-3">مثال على القيمة</th>
                      <th className="p-3 text-center">إلزامي؟</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 bg-slate-950/60">
                    {EXCEL_SURVEY_COLUMNS.map((col, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/30">
                        <td className="p-3 font-semibold text-white">{col.labelAr}</td>
                        <td className="p-3 font-mono text-cyan-400">{col.key}</td>
                        <td className="p-3 font-mono text-slate-300">{col.example}</td>
                        <td className="p-3 text-center">
                          {col.required ? (
                            <span className="text-rose-400 font-bold">إلزامي</span>
                          ) : (
                            <span className="text-slate-500">اختياري</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
