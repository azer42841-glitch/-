export interface Household {
  id: string; // e.g. "FAM-001"
  anonymizedCode: string; // e.g. "GZ-AAW-8492"
  headNameOrPseudonym: string; // "رب الأسرة (مُشفر)"
  headGender: 'female' | 'male' | 'child';
  familySize: number;
  childrenUnder5: number;
  childrenSchoolAge: number; // 6-17
  elderly60Plus: number;
  pregnantLactatingWomen: number;
  personsWithDisability: number;
  chronicIllnessesCount: number;
  warInjuredCount: number;
  orphansCount: number;
  displacementCount: number; // number of times displaced
  originLocation: string; // e.g. "شمال غزة - بيت حانون"
  campZone: string; // "القطاع أ", "القطاع ب", etc.
  tentNumber: string; // "T-104"
  
  // Shelter & NFI
  shelterType: 'خيمة قماشية' | 'شادر بلاستيكي' | 'بقايا زنكو وشوادر' | 'خيمة محسنة ومعزولة';
  shelterAreaM2: number; // total covered area in m²
  shelterCondition: 'critical' | 'poor' | 'fair' | 'good';
  winterized: boolean; // insulated against rain/flooding
  blanketsAvailable: number; // number of blankets
  mattressesAvailable: number; // number of mattresses
  tarpaulinNeeded: boolean;

  // WASH
  dailyWaterLiters: number; // total liters per family per day
  drinkingWaterSourceSafe: boolean;
  distanceToWaterMeters: number;
  waterQueueMinutes: number;
  sharedLatrineUsersCount: number; // persons per latrine
  latrineGenderSeparated: boolean;
  latrineLightedAndSafe: boolean;
  hygieneKitReceivedLast30Days: boolean;
  menstrualHygieneAvailable: boolean;

  // Food & Nutrition
  foodAssistanceLast14Days: boolean;
  dailyMealsCount: number; // 1, 2, 3
  infantNutritionRisk: boolean; // malnutrition warning

  // Health
  activeInfections: ('إسهال حاد' | 'جرب وأمراض جلدية' | 'التهابات تنفسية' | 'التهاب كبد وبائي أ')[];
  urgentReferralNeeded: boolean;
  unmetMedicationNeeds: boolean; // chronic medicine cut off

  // Socioeconomic & Livelihood
  economicTier: 'ultra_destitute' | 'poor' | 'limited_income' | 'relative_capacity';
  livelihoodSource: string; // e.g. "معدم كلياً", "عامل باليومية متوقف", "موظف بلا راتب", "حرفي/خياط"
  
  // Education & Protection
  outOfSchoolChildren: number;
  unaccompaniedMinors: boolean;
  nightLightingSafe: boolean;
  
  // Meta
  surveyDate: string;
  notes?: string;
  
  // Computed
  vulnerabilityScore?: number; // 0 - 100
  vulnerabilityTier?: 'critical' | 'high' | 'medium' | 'low';
}

export interface SectorAnalysis {
  id: string;
  nameAr: string;
  iconName: string;
  sphereStandard: string;
  sphereMetric: string;
  currentValue: string;
  gapPercentage: number;
  affectedPopulation: number;
  status: 'critical' | 'high' | 'medium' | 'acceptable';
  keyFindings: string[];
  immediateInterventions: string[];
}

export interface Complaint {
  id: string;
  ticketNumber: string;
  familyId: string;
  isAnonymous: boolean;
  sector: 'توزيع ومساعدات' | 'مياه وصرف صحي' | 'مأوى وخيام' | 'صحة وإحالات' | 'حماية ومساءلة AAP' | 'نزاعات وأمان';
  severity: 'عاجل جداً (حرج)' | 'متوسط' | 'اعتيادي';
  description: string;
  submissionDate: string;
  status: 'جديد' | 'قيد المتابعة' | 'تم الحل' | 'تم التصعيد';
  responseNotes?: string;
  resolvedDate?: string;
}

export interface DistributionRound {
  id: string;
  title: string;
  sector: string;
  itemType: string;
  targetTier: 'all' | 'critical_only' | 'critical_and_high' | 'female_headed';
  quantityPerFamily: string;
  plannedFamiliesCount: number;
  servedFamilyIds: string[];
  status: 'draft' | 'active' | 'completed';
  scheduledDate: string;
  donorOrPartner: string;
}

export interface ActionPlanItem {
  id: string;
  sector: string;
  activity: string;
  targetGroup: string;
  targetCount: number;
  focalPoint: string;
  requiredResources: string;
  estimatedCostUSD: number;
  timeframe: '72 ساعة (فوري)' | 'أسبوعين' | 'شهر';
  successIndicator: string;
  progressPercent: number;
  priorityScore: number; // Severity * Affected / Ease
}

export interface CampRisk {
  id: string;
  category: 'صحي' | 'مناخي' | 'أمني/نزوح' | 'اجتماعي';
  title: string;
  likelihood: 'عالية جداً' | 'عالية' | 'متوسطة';
  impact: 'كارثي' | 'شديد' | 'متوسط';
  mitigationPlan: string;
  contingencyPlan: string;
}

export interface DataAnomaly {
  familyId: string;
  field: string;
  anomalyType: 'unrealistic_value' | 'missing_data' | 'conflict_data';
  description: string;
  suggestedFix: string;
}
