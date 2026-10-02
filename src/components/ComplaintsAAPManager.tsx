import React, { useState } from 'react';
import { Complaint, Household } from '../types/cccm';
import { 
  MessageSquareWarning, 
  ShieldAlert, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Plus, 
  X, 
  Lock, 
  Filter,
  Send
} from 'lucide-react';

interface ComplaintsAAPManagerProps {
  complaints: Complaint[];
  households: Household[];
  onAddComplaint: (complaint: Complaint) => void;
  onUpdateComplaintStatus: (id: string, status: Complaint['status'], responseNotes?: string) => void;
}

export const ComplaintsAAPManager: React.FC<ComplaintsAAPManagerProps> = ({
  complaints,
  households,
  onAddComplaint,
  onUpdateComplaintStatus
}) => {
  const [sectorFilter, setSectorFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Complaint | null>(null);
  const [resolutionText, setResolutionText] = useState('');

  const filteredComplaints = complaints.filter(c => {
    if (sectorFilter !== 'all' && c.sector !== sectorFilter) return false;
    if (statusFilter !== 'all' && c.status !== statusFilter) return false;
    return true;
  });

  const getSeverityBadge = (sev: Complaint['severity']) => {
    if (sev === 'عاجل جداً (حرج)') {
      return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-950 text-rose-300 border border-rose-800">حرج جداً</span>;
    }
    if (sev === 'متوسط') {
      return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-950 text-amber-300 border border-amber-800">متوسط</span>;
    }
    return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-800 text-slate-300">اعتيادي</span>;
  };

  const getStatusBadge = (status: Complaint['status']) => {
    switch (status) {
      case 'جديد':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40">جديد</span>;
      case 'قيد المتابعة':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">قيد المتابعة</span>;
      case 'تم الحل':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">تم الحل</span>;
      case 'تم التصعيد':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">تم التصعيد للجنة العليا</span>;
    }
  };

  const handleSaveResolution = (ticketId: string) => {
    if (!resolutionText.trim()) return;
    onUpdateComplaintStatus(ticketId, 'تم الحل', resolutionText);
    setSelectedTicket(null);
    setResolutionText('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
              المساءلة أمام المجتمع المتأثر (AAP)
            </span>
            <span className="text-xs text-slate-400">حماية من الاستغلال والانتهاك (PSEA)</span>
          </div>
          <h2 className="text-xl font-bold text-white">آلية الشكاوى والمقترحات السرية والآمنة</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            صندوق شكاوى مغلق، خط مباشر سري، وتوثيق استجابة شفافة لحماية حقوق وكرامة النازحين
          </p>
        </div>

        <button
          onClick={() => setIsSubmitModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-lg shadow-cyan-900/40 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>تقديم شكوى أو مقترح (سري / معلن)</span>
        </button>
      </div>

      {/* KPI stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-2xl">
          <span className="text-xs text-slate-400 block">إجمالي الشكاوى:</span>
          <span className="text-xl font-bold text-white mt-1 block">{complaints.length}</span>
        </div>
        <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-2xl">
          <span className="text-xs text-slate-400 block">جديد بحاجة متابعة:</span>
          <span className="text-xl font-bold text-blue-400 mt-1 block">
            {complaints.filter(c => c.status === 'جديد').length}
          </span>
        </div>
        <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-2xl">
          <span className="text-xs text-slate-400 block">قيد المعالجة الميدانية:</span>
          <span className="text-xl font-bold text-amber-400 mt-1 block">
            {complaints.filter(c => c.status === 'قيد المتابعة').length}
          </span>
        </div>
        <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-2xl">
          <span className="text-xs text-slate-400 block">تم الحل والإغلاق:</span>
          <span className="text-xl font-bold text-emerald-400 mt-1 block">
            {complaints.filter(c => c.status === 'تم الحل').length}
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 bg-slate-900 border border-slate-800 p-3.5 rounded-2xl">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs text-slate-300 font-bold">تصفية:</span>
        </div>

        <select
          value={sectorFilter}
          onChange={e => setSectorFilter(e.target.value)}
          className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 cursor-pointer"
        >
          <option value="all">جميع القطاعات</option>
          <option value="مأوى وخيام">مأوى وخيام</option>
          <option value="مياه وصرف صحي">مياه وصرف صحي</option>
          <option value="توزيع ومساعدات">توزيع ومساعدات</option>
          <option value="صحة وإحالات">صحة وإحالات</option>
          <option value="حماية ومساءلة AAP">حماية ومساءلة AAP</option>
          <option value="نزاعات وأمان">نزاعات وأمان</option>
        </select>

        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 cursor-pointer"
        >
          <option value="all">جميع الحالات</option>
          <option value="جديد">جديد</option>
          <option value="قيد المتابعة">قيد المتابعة</option>
          <option value="تم الحل">تم الحل</option>
          <option value="تم التصعيد">تم التصعيد</option>
        </select>
      </div>

      {/* Complaints List */}
      <div className="space-y-3">
        {filteredComplaints.length === 0 ? (
          <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-2xl text-slate-400 text-xs">
            لا توجد شكاوى أو مقترحات مسجلة مطابقة لمعايير التصفية.
          </div>
        ) : (
          filteredComplaints.map(complaint => {
            const family = households.find(h => h.id === complaint.familyId);

            return (
              <div 
                key={complaint.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 sm:p-5 transition space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-cyan-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                      {complaint.ticketNumber}
                    </span>
                    <span className="text-xs font-bold text-white">{complaint.sector}</span>
                    {getSeverityBadge(complaint.severity)}
                  </div>

                  <div className="flex items-center gap-2">
                    {getStatusBadge(complaint.status)}
                    <span className="text-[11px] text-slate-500">{complaint.submissionDate}</span>
                  </div>
                </div>

                <div className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  {complaint.description}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Lock className="w-3.5 h-3.5 text-cyan-400" />
                    <span>مقدم الشكوى:</span>
                    {complaint.isAnonymous ? (
                      <span className="font-bold text-slate-300">مجهول الهوية (شكوى سرية)</span>
                    ) : (
                      <span className="font-mono font-bold text-cyan-300">
                        {family ? `${family.anonymizedCode} (${family.tentNumber})` : 'مُشفر'}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {complaint.status !== 'تم الحل' && (
                      <button
                        onClick={() => setSelectedTicket(complaint)}
                        className="px-3 py-1 rounded-lg bg-emerald-600/30 text-emerald-300 hover:bg-emerald-600 hover:text-white border border-emerald-500/40 font-bold transition cursor-pointer"
                      >
                        تسجيل إجراء الحل
                      </button>
                    )}

                    {complaint.status === 'جديد' && (
                      <button
                        onClick={() => onUpdateComplaintStatus(complaint.id, 'قيد المتابعة')}
                        className="px-3 py-1 rounded-lg bg-amber-600/30 text-amber-300 hover:bg-amber-600 hover:text-white border border-amber-500/40 font-bold transition cursor-pointer"
                      >
                        بدء المعالجة
                      </button>
                    )}
                  </div>
                </div>

                {complaint.responseNotes && (
                  <div className="p-3 rounded-xl bg-slate-950 border border-emerald-900/40 text-xs text-slate-300">
                    <div className="flex items-center gap-1.5 font-bold text-emerald-400 mb-0.5">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>إجراء الاستجابة والحل المعتمد:</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed">{complaint.responseNotes}</p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Resolution Input Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-lg p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base">
                توثيق حل الشكوى ({selectedTicket.ticketNumber})
              </h3>
              <button onClick={() => setSelectedTicket(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
              <strong className="text-slate-400 block mb-1">نص الشكوى:</strong>
              {selectedTicket.description}
            </div>

            <div>
              <label className="text-slate-400 font-bold text-xs block mb-1">
                الإجراء المتخذ لمعالجة الشكوى وحلها
              </label>
              <textarea
                rows={3}
                required
                value={resolutionText}
                onChange={e => setResolutionText(e.target.value)}
                placeholder="اكتب بالتفصيل الإجراء المتخذ لإبلاغ المشتكي وإغلاق التذكرة..."
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setSelectedTicket(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold cursor-pointer"
              >
                إلغاء
              </button>
              <button
                onClick={() => handleSaveResolution(selectedTicket.id)}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer"
              >
                اعتماد الحل وإغلاق الشكوى
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Complaint Modal */}
      {isSubmitModalOpen && (
        <CreateComplaintModal
          isOpen={isSubmitModalOpen}
          onClose={() => setIsSubmitModalOpen(false)}
          onAdd={(newComp) => {
            onAddComplaint(newComp);
            setIsSubmitModalOpen(false);
          }}
          households={households}
          complaintsCount={complaints.length}
        />
      )}
    </div>
  );
};

interface CreateComplaintModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (complaint: Complaint) => void;
  households: Household[];
  complaintsCount: number;
}

const CreateComplaintModal: React.FC<CreateComplaintModalProps> = ({
  onClose,
  onAdd,
  households,
  complaintsCount
}) => {
  const [formData, setFormData] = useState<Partial<Complaint>>({
    id: `CMP-${Date.now().toString().slice(-4)}`,
    ticketNumber: `TK-2026-${String(complaintsCount + 1).padStart(2, '0')}`,
    familyId: households[0]?.id || 'FAM-001',
    isAnonymous: false,
    sector: 'مأوى وخيام',
    severity: 'متوسط',
    description: '',
    submissionDate: new Date().toISOString().slice(0, 10),
    status: 'جديد'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description) return;
    onAdd(formData as Complaint);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl my-auto">
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <MessageSquareWarning className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-base">تسجيل شكوى / مقترح جديد</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <span className="text-slate-300 font-bold">السرية وعدم الكشف عن الهوية:</span>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isAnonymous}
                onChange={e => setFormData({ ...formData, isAnonymous: e.target.checked })}
                className="w-4 h-4 rounded text-cyan-500"
              />
              <span className="text-cyan-400 font-bold">تقديم كشكوى سرية ومجهولة</span>
            </label>
          </div>

          {!formData.isAnonymous && (
            <div>
              <label className="text-slate-400 font-bold block mb-1">الأسرة صاحبة الشكوى</label>
              <select
                value={formData.familyId}
                onChange={e => setFormData({ ...formData, familyId: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
              >
                {households.map(h => (
                  <option key={h.id} value={h.id}>
                    {h.anonymizedCode} - خيمة {h.tentNumber} ({h.headNameOrPseudonym})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 font-bold block mb-1">القطاع المعني</label>
              <select
                value={formData.sector}
                onChange={e => setFormData({ ...formData, sector: e.target.value as any })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
              >
                <option value="مأوى وخيام">مأوى وخيام</option>
                <option value="مياه وصرف صحي">مياه وصرف صحي</option>
                <option value="توزيع ومساعدات">توزيع ومساعدات</option>
                <option value="صحة وإحالات">صحة وإحالات</option>
                <option value="حماية ومساءلة AAP">حماية ومساءلة AAP</option>
                <option value="نزاعات وأمان">نزاعات وأمان</option>
              </select>
            </div>

            <div>
              <label className="text-slate-400 font-bold block mb-1">درجة الأهمية</label>
              <select
                value={formData.severity}
                onChange={e => setFormData({ ...formData, severity: e.target.value as any })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
              >
                <option value="عاجل جداً (حرج)">عاجل جداً (حرج)</option>
                <option value="متوسط">متوسط</option>
                <option value="اعتيادي">اعتيادي</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-slate-400 font-bold block mb-1">تفاصيل الشكوى أو المقترح</label>
            <textarea
              rows={4}
              required
              placeholder="اكتب بالتفصيل ما حدث، والموقع داخل المخيم، والاحتياج المطلوب..."
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
            />
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold cursor-pointer shadow-lg shadow-cyan-900/30"
            >
              إيداع في الصندوق
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
