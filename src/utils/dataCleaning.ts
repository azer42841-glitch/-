import { Household, DataAnomaly } from '../types/cccm';

export function inspectDatasetAnomalies(households: Household[]): DataAnomaly[] {
  const anomalies: DataAnomaly[] = [];
  const seenCodes = new Set<string>();
  const seenTents = new Set<string>();

  households.forEach(h => {
    // 1. Duplicate check
    if (seenCodes.has(h.anonymizedCode)) {
      anomalies.push({
        familyId: h.id,
        field: 'anonymizedCode',
        anomalyType: 'conflict_data',
        description: `تكرار في رمز الأسرة المشفر (${h.anonymizedCode}) لأكثر من أسرة واحدة.`,
        suggestedFix: 'إعادة توليد رمز مشفر فريد لمنع ازدواجية الصرف.'
      });
    } else {
      seenCodes.add(h.anonymizedCode);
    }

    if (h.tentNumber && seenTents.has(h.tentNumber)) {
      anomalies.push({
        familyId: h.id,
        field: 'tentNumber',
        anomalyType: 'conflict_data',
        description: `الخيمة رقم (${h.tentNumber}) مسجلة لأكثر من أسرة. تحقق إن كان مأوى مشتركاً أم خطأ إدخال.`,
        suggestedFix: 'تأكيد ما إذا كانت أسرتا الخيمة مشتركتين أو تعديل رقم الخيمة.'
      });
    } else if (h.tentNumber) {
      seenTents.add(h.tentNumber);
    }

    // 2. Unrealistic family size
    if (h.familySize <= 0) {
      anomalies.push({
        familyId: h.id,
        field: 'familySize',
        anomalyType: 'unrealistic_value',
        description: `عدد أفراد الأسرة (${h.familySize}) غير منطقي (يجب أن يكون 1 على الأقل).`,
        suggestedFix: 'تعديل عدد الأفراد إلى القيمة الفعلية بناءً على بطاقة الهوية أو المسح.'
      });
    } else if (h.familySize > 18) {
      anomalies.push({
        familyId: h.id,
        field: 'familySize',
        anomalyType: 'unrealistic_value',
        description: `عدد أفراد الأسرة كبير جداً وغير معتاد (${h.familySize} فرد). قد تكون أسرة ممتدة دُمجت دون فرز.`,
        suggestedFix: 'التحقق مما إذا كانت أسرة ممتدة يجب تقسيمها إلى أسر نواتية متعددة لتوزيع المساعدات بعدالة.'
      });
    }

    // 3. Demographic sum conflicts
    const subTotals = (h.childrenUnder5 || 0) + (h.childrenSchoolAge || 0) + (h.elderly60Plus || 0);
    if (subTotals > h.familySize) {
      anomalies.push({
        familyId: h.id,
        field: 'demographics',
        anomalyType: 'conflict_data',
        description: `مجموع (الأطفال دون 5 + الأطفال سن المدرسة + كبار السن = ${subTotals}) يتجاوز إجمالي أفراد الأسرة (${h.familySize}).`,
        suggestedFix: 'مراجعة أعمار أفراد الأسرة وتصحيح الفئات العمرية.'
      });
    }

    // 4. Shelter area sanity
    if (!h.shelterAreaM2 || h.shelterAreaM2 <= 0) {
      anomalies.push({
        familyId: h.id,
        field: 'shelterAreaM2',
        anomalyType: 'missing_data',
        description: 'مساحة المأوى مفقودة أو مسجلة كـ صفر.',
        suggestedFix: 'إجراء قياس ميداني للمأوى بالمتر المربع (طول × عرض الخيمة).'
      });
    } else if (h.shelterAreaM2 > 80) {
      anomalies.push({
        familyId: h.id,
        field: 'shelterAreaM2',
        anomalyType: 'unrealistic_value',
        description: `مساحة الخيمة المدخلة (${h.shelterAreaM2} م²) تفوق المعتاد لخيام النزوح.`,
        suggestedFix: 'التأكد من وحدة القياس (هل هي أقدام أم أمتار؟).'
      });
    }

    // 5. Water data
    if (h.dailyWaterLiters === undefined || h.dailyWaterLiters === null) {
      anomalies.push({
        familyId: h.id,
        field: 'dailyWaterLiters',
        anomalyType: 'missing_data',
        description: 'كمية المياه اليومية غير مسجلة.',
        suggestedFix: 'سؤال الأسرة عن عدد الجالونات المستلمة يومياً وحساب الحجم باللتر.'
      });
    } else if (h.dailyWaterLiters > 400) {
      anomalies.push({
        familyId: h.id,
        field: 'dailyWaterLiters',
        anomalyType: 'unrealistic_value',
        description: `كمية المياه المسجلة للأسرة (${h.dailyWaterLiters} لتر/يوم) مرتفعة بشكل استثنائي في ظل الحصار المائي.`,
        suggestedFix: 'التحقق هل الرقم يمثل الحصة الأسبوعية أم اليومية.'
      });
    }

    // 6. Latrine sharing
    if (h.sharedLatrineUsersCount === undefined || h.sharedLatrineUsersCount <= 0) {
      anomalies.push({
        familyId: h.id,
        field: 'sharedLatrineUsersCount',
        anomalyType: 'missing_data',
        description: 'بيانات نسبة التشارك في المراحيض غير محددة.',
        suggestedFix: 'حصر عدد الخيام المجاورة المستخدمة لنفس كتلة المراحيض.'
      });
    }
  });

  return anomalies;
}

export const EXCEL_SURVEY_COLUMNS = [
  { key: 'anonymizedCode', labelAr: 'رمز الأسرة (مشفر)', example: 'GZ-AAW-0101', required: true },
  { key: 'headGender', labelAr: 'جنس معيل الأسرة (male/female/child)', example: 'female', required: true },
  { key: 'familySize', labelAr: 'إجمالي أفراد الأسرة', example: '6', required: true },
  { key: 'childrenUnder5', labelAr: 'أطفال دون 5 سنوات', example: '2', required: true },
  { key: 'childrenSchoolAge', labelAr: 'أطفال سن مدرسة (6-17)', example: '3', required: true },
  { key: 'elderly60Plus', labelAr: 'كبار سن (60 سنة فأكثر)', example: '1', required: true },
  { key: 'pregnantLactatingWomen', labelAr: 'نساء حوامل أو مرضعات', example: '1', required: false },
  { key: 'personsWithDisability', labelAr: 'أشخاص من ذوي الإعاقة', example: '0', required: false },
  { key: 'chronicIllnessesCount', labelAr: 'مرضى أمراض مزمنة', example: '1', required: false },
  { key: 'warInjuredCount', labelAr: 'مصابو حرب وجرحى', example: '1', required: false },
  { key: 'orphansCount', labelAr: 'أيتام في كفالة الأسرة', example: '0', required: false },
  { key: 'displacementCount', labelAr: 'عدد مرات النزوح', example: '4', required: true },
  { key: 'originLocation', labelAr: 'مكان السكن الأصلي', example: 'شمال غزة - جباليا', required: true },
  { key: 'campZone', labelAr: 'القطاع داخل المخيم', example: 'القطاع أ', required: true },
  { key: 'tentNumber', labelAr: 'رقم الخيمة', example: 'T-108', required: true },
  { key: 'shelterType', labelAr: 'نوع المأوى (خيمة قماشية/شادر/بقايا زنكو)', example: 'خيمة قماشية', required: true },
  { key: 'shelterAreaM2', labelAr: 'مساحة المأوى بالمتر المربع', example: '16', required: true },
  { key: 'shelterCondition', labelAr: 'حالة الخيمة (critical/poor/fair/good)', example: 'poor', required: true },
  { key: 'winterized', labelAr: 'عزل ومقاومة المطر (true/false)', example: 'false', required: true },
  { key: 'dailyWaterLiters', labelAr: 'مياه مستلمة لتر/أسرة/يوم', example: '40', required: true },
  { key: 'distanceToWaterMeters', labelAr: 'المسافة لأقرب نقطة مياه (متر)', example: '120', required: false },
  { key: 'sharedLatrineUsersCount', labelAr: 'عدد الأشخاص المشتركين بالمرحاض', example: '28', required: true },
  { key: 'economicTier', labelAr: 'الشريحة المعيشية (ultra_destitute/poor/limited_income/relative_capacity)', example: 'ultra_destitute', required: true },
  { key: 'livelihoodSource', labelAr: 'مصدر الدخل أو المهنة السابقة', example: 'عامل بناء متوقف', required: false },
  { key: 'foodAssistanceLast14Days', labelAr: 'استلام طرد خلال 14 يوماً (true/false)', example: 'false', required: true },
  { key: 'dailyMealsCount', labelAr: 'عدد الوجبات اليومية للأسرة', example: '1', required: true },
  { key: 'activeInfections', labelAr: 'أمراض معدية مسجلة (إسهال، جرب، كبد)', example: 'جرب وأمراض جلدية', required: false },
  { key: 'urgentReferralNeeded', labelAr: 'حاجة لتحويل طبي عاجل (true/false)', example: 'false', required: true }
];

export function exportHouseholdsToCSV(households: Household[]): string {
  const headers = EXCEL_SURVEY_COLUMNS.map(c => `"${c.labelAr}"`).join(',');
  const rows = households.map(h => {
    return [
      `"${h.anonymizedCode}"`,
      `"${h.headGender}"`,
      h.familySize,
      h.childrenUnder5,
      h.childrenSchoolAge,
      h.elderly60Plus,
      h.pregnantLactatingWomen,
      h.personsWithDisability,
      h.chronicIllnessesCount,
      h.warInjuredCount,
      h.orphansCount,
      h.displacementCount,
      `"${h.originLocation}"`,
      `"${h.campZone}"`,
      `"${h.tentNumber}"`,
      `"${h.shelterType}"`,
      h.shelterAreaM2,
      `"${h.shelterCondition}"`,
      h.winterized ? 'نعم' : 'لا',
      h.dailyWaterLiters,
      h.distanceToWaterMeters,
      h.sharedLatrineUsersCount,
      `"${h.economicTier}"`,
      `"${h.livelihoodSource}"`,
      h.foodAssistanceLast14Days ? 'نعم' : 'لا',
      h.dailyMealsCount,
      `"${(h.activeInfections || []).join(';')}"`,
      h.urgentReferralNeeded ? 'نعم' : 'لا'
    ].join(',');
  });

  return [headers, ...rows].join('\n');
}

export function generateEmptySurveyTemplateCSV(): string {
  const headers = EXCEL_SURVEY_COLUMNS.map(c => `"${c.labelAr} [${c.key}]"`).join(',');
  const sampleRow = EXCEL_SURVEY_COLUMNS.map(c => `"${c.example}"`).join(',');
  return `${headers}\n${sampleRow}`;
}
