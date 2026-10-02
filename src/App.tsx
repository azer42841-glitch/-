/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { SphereKpiDashboard } from './components/SphereKpiDashboard';
import { FamilyRegistry } from './components/FamilyRegistry';
import { SectoralAnalysisView } from './components/SectoralAnalysisView';
import { DistributionManager } from './components/DistributionManager';
import { ComplaintsAAPManager } from './components/ComplaintsAAPManager';
import { ActionPlanAndPriorities } from './components/ActionPlanAndPriorities';
import { GovernanceAndRisks } from './components/GovernanceAndRisks';
import { DonorReportView } from './components/DonorReportView';
import { DataCleaningModal } from './components/DataCleaningModal';
import { AiAdvisorModal } from './components/AiAdvisorModal';
import { NewRegistrationPage } from './components/NewRegistrationPage';

import { 
  INITIAL_HOUSEHOLDS, 
  INITIAL_COMPLAINTS, 
  INITIAL_DISTRIBUTIONS, 
  INITIAL_ACTION_PLAN, 
  INITIAL_RISKS 
} from './data/initialData';
import { Household, Complaint, DistributionRound, ActionPlanItem, CampRisk } from './types/cccm';
import { computeCampAggregateMetrics, generateSectorAnalyses } from './utils/sphereStandards';
import { inspectDatasetAnomalies } from './utils/dataCleaning';
import { Bot, Sparkles } from 'lucide-react';

export default function App() {
  // State with localStorage persistence
  const [households, setHouseholds] = useState<Household[]>(() => {
    const saved = localStorage.getItem('cccm_gaza_households');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return INITIAL_HOUSEHOLDS;
  });

  const [complaints, setComplaints] = useState<Complaint[]>(() => {
    const saved = localStorage.getItem('cccm_gaza_complaints');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return INITIAL_COMPLAINTS;
  });

  const [distributions, setDistributions] = useState<DistributionRound[]>(() => {
    const saved = localStorage.getItem('cccm_gaza_distributions');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return INITIAL_DISTRIBUTIONS;
  });

  const [actionPlan, setActionPlan] = useState<ActionPlanItem[]>(() => {
    const saved = localStorage.getItem('cccm_gaza_action_plan');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return INITIAL_ACTION_PLAN;
  });

  const [risks] = useState<CampRisk[]>(INITIAL_RISKS);

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedVulnerabilityFilter, setSelectedVulnerabilityFilter] = useState<string>('all');

  // Modals state
  const [isDataCleaningOpen, setIsDataCleaningOpen] = useState(false);
  const [isAiAdvisorOpen, setIsAiAdvisorOpen] = useState(false);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('cccm_gaza_households', JSON.stringify(households));
  }, [households]);

  useEffect(() => {
    localStorage.setItem('cccm_gaza_complaints', JSON.stringify(complaints));
  }, [complaints]);

  useEffect(() => {
    localStorage.setItem('cccm_gaza_distributions', JSON.stringify(distributions));
  }, [distributions]);

  useEffect(() => {
    localStorage.setItem('cccm_gaza_action_plan', JSON.stringify(actionPlan));
  }, [actionPlan]);

  // Real-time aggregate metrics
  const metrics = useMemo(() => computeCampAggregateMetrics(households), [households]);
  const sectors = useMemo(() => generateSectorAnalyses(metrics), [metrics]);
  const anomalies = useMemo(() => inspectDatasetAnomalies(households), [households]);

  // Handlers for households
  const handleAddHousehold = (newH: Household) => {
    setHouseholds([newH, ...households]);
  };

  const handleUpdateHousehold = (updated: Household) => {
    setHouseholds(households.map(h => h.id === updated.id ? updated : h));
  };

  const handleDeleteHousehold = (id: string) => {
    setHouseholds(households.filter(h => h.id !== id));
  };

  // Handlers for distributions
  const handleAddDistribution = (newD: DistributionRound) => {
    setDistributions([newD, ...distributions]);
  };

  const handleToggleServeFamily = (distId: string, familyId: string) => {
    setDistributions(distributions.map(dist => {
      if (dist.id === distId) {
        const isServed = dist.servedFamilyIds.includes(familyId);
        const newServed = isServed 
          ? dist.servedFamilyIds.filter(id => id !== familyId)
          : [...dist.servedFamilyIds, familyId];
        return { ...dist, servedFamilyIds: newServed };
      }
      return dist;
    }));
  };

  // Handlers for complaints
  const handleAddComplaint = (newC: Complaint) => {
    setComplaints([newC, ...complaints]);
  };

  const handleUpdateComplaintStatus = (id: string, status: Complaint['status'], responseNotes?: string) => {
    setComplaints(complaints.map(c => {
      if (c.id === id) {
        return {
          ...c,
          status,
          responseNotes: responseNotes || c.responseNotes,
          resolvedDate: status === 'تم الحل' ? new Date().toISOString().slice(0, 10) : c.resolvedDate
        };
      }
      return c;
    }));
  };

  // Handlers for action plan progress
  const handleUpdatePlanProgress = (id: string, progress: number) => {
    setActionPlan(actionPlan.map(item => item.id === id ? { ...item, progressPercent: progress } : item));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-cairo">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        metrics={metrics}
        onOpenAddModal={() => {
          setActiveTab('new_registration');
        }}
        onOpenDataCleaning={() => setIsDataCleaningOpen(true)}
        anomaliesCount={anomalies.length}
      />

      {/* Main Content View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-6">
        {activeTab === 'dashboard' && (
          <SphereKpiDashboard
            metrics={metrics}
            onNavigateToTab={setActiveTab}
            onFilterVulnerability={(tier) => {
              setSelectedVulnerabilityFilter(tier);
              setActiveTab('families');
            }}
          />
        )}

        {activeTab === 'new_registration' && (
          <NewRegistrationPage
            existingHouseholdsCount={households.length}
            onSaveHousehold={(newH) => {
              handleAddHousehold(newH);
            }}
            onCancel={() => setActiveTab('families')}
            onViewFamily={(_family) => {
              setActiveTab('families');
            }}
          />
        )}

        {activeTab === 'families' && (
          <FamilyRegistry
            households={households}
            onAddHousehold={handleAddHousehold}
            onUpdateHousehold={handleUpdateHousehold}
            onDeleteHousehold={handleDeleteHousehold}
            initialVulnerabilityFilter={selectedVulnerabilityFilter}
            onOpenNewRegistrationPage={() => setActiveTab('new_registration')}
          />
        )}

        {activeTab === 'sectors' && (
          <SectoralAnalysisView
            sectors={sectors}
            onNavigateToActionPlan={() => setActiveTab('priorities')}
          />
        )}

        {activeTab === 'distributions' && (
          <DistributionManager
            distributions={distributions}
            households={households}
            onAddDistribution={handleAddDistribution}
            onToggleServeFamily={handleToggleServeFamily}
          />
        )}

        {activeTab === 'complaints' && (
          <ComplaintsAAPManager
            complaints={complaints}
            households={households}
            onAddComplaint={handleAddComplaint}
            onUpdateComplaintStatus={handleUpdateComplaintStatus}
          />
        )}

        {activeTab === 'priorities' && (
          <ActionPlanAndPriorities
            actionPlan={actionPlan}
            onUpdateProgress={handleUpdatePlanProgress}
          />
        )}

        {activeTab === 'governance' && (
          <GovernanceAndRisks risks={risks} />
        )}

        {activeTab === 'donor_report' && (
          <DonorReportView
            metrics={metrics}
            actionPlan={actionPlan}
            risks={risks}
            households={households}
          />
        )}
      </main>

      {/* Floating AI CCCM Advisor Button */}
      <div className="fixed bottom-6 left-6 z-40 no-print">
        <button
          onClick={() => setIsAiAdvisorOpen(true)}
          className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs sm:text-sm shadow-2xl shadow-cyan-900/60 transition cursor-pointer border border-cyan-400/40 hover:scale-105 active:scale-95 group"
        >
          <div className="p-1 rounded-full bg-white/20">
            <Sparkles className="w-4 h-4 text-cyan-200 animate-spin" style={{ animationDuration: '8s' }} />
          </div>
          <span className="font-extrabold">استشارة خبير CCCM</span>
        </button>
      </div>

      {/* Data Cleaning & Quality Modal */}
      <DataCleaningModal
        isOpen={isDataCleaningOpen}
        onClose={() => setIsDataCleaningOpen(false)}
        households={households}
      />

      {/* AI Humanitarian Advisor Modal */}
      <AiAdvisorModal
        isOpen={isAiAdvisorOpen}
        onClose={() => setIsAiAdvisorOpen(false)}
        metrics={metrics}
      />

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800/80 py-6 px-4 text-center text-xs text-slate-400 no-print">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">منظومة إدارة وتنسيق مخيم أطياف العودة</span>
            <span>•</span>
            <span>قطاع غزة</span>
          </div>
          <div className="text-slate-400 text-[11px]">
            التزام تام بمعايير اسفير (Sphere Project)، مبادئ العمل الإنساني، وميثاق الحماية والمساءلة (AAP & PSEA)
          </div>
        </div>
      </footer>
    </div>
  );
}
