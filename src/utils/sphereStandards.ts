import { Household, SectorAnalysis } from '../types/cccm';
import { calculateHouseholdVulnerability } from './vulnerabilityCalculator';

export interface CampAggregateMetrics {
  totalHouseholds: number;
  totalPopulation: number;
  femaleHeadedHouseholds: number;
  childrenUnder5Total: number;
  schoolAgeChildrenTotal: number;
  elderlyTotal: number;
  disabledTotal: number;
  warInjuredTotal: number;
  orphansTotal: number;
  pregnantLactatingTotal: number;
  chronicallyIllTotal: number;

  // Vulnerability Distribution
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;

  // Economic tiers
  ultraDestituteCount: number;
  poorCount: number;
  limitedIncomeCount: number;
  relativeCapacityCount: number;

  // Sphere Metrics
  avgWaterLitersPerPerson: number;
  waterCoveragePercentage: number;
  waterGapLiters: number;
  waterStatus: 'critical' | 'high' | 'medium' | 'acceptable';

  avgCoveredAreaPerPerson: number;
  shelterAreaGapM2: number;
  shelterStatus: 'critical' | 'high' | 'medium' | 'acceptable';
  damagedShelterCount: number;

  avgPersonsPerLatrine: number;
  latrineDeficitCount: number;
  latrineStatus: 'critical' | 'high' | 'medium' | 'acceptable';
  latrineUnseparatedCount: number;

  dailyMealDeficitRate: number; // % having only 1 meal
  foodUnreachedCount: number;
  nutritionRiskCount: number;

  activeEpidemicCount: number;
  urgentReferralsCount: number;
  unmetMedsCount: number;

  outOfSchoolTotal: number;
  nightLightingDeficitPercent: number;
}

export function computeCampAggregateMetrics(households: Household[]): CampAggregateMetrics {
  const totalHouseholds = households.length;
  if (totalHouseholds === 0) {
    return {
      totalHouseholds: 0,
      totalPopulation: 0,
      femaleHeadedHouseholds: 0,
      childrenUnder5Total: 0,
      schoolAgeChildrenTotal: 0,
      elderlyTotal: 0,
      disabledTotal: 0,
      warInjuredTotal: 0,
      orphansTotal: 0,
      pregnantLactatingTotal: 0,
      chronicallyIllTotal: 0,
      criticalCount: 0,
      highCount: 0,
      mediumCount: 0,
      lowCount: 0,
      ultraDestituteCount: 0,
      poorCount: 0,
      limitedIncomeCount: 0,
      relativeCapacityCount: 0,
      avgWaterLitersPerPerson: 0,
      waterCoveragePercentage: 0,
      waterGapLiters: 15,
      waterStatus: 'critical',
      avgCoveredAreaPerPerson: 0,
      shelterAreaGapM2: 3.5,
      shelterStatus: 'critical',
      damagedShelterCount: 0,
      avgPersonsPerLatrine: 0,
      latrineDeficitCount: 0,
      latrineStatus: 'critical',
      latrineUnseparatedCount: 0,
      dailyMealDeficitRate: 0,
      foodUnreachedCount: 0,
      nutritionRiskCount: 0,
      activeEpidemicCount: 0,
      urgentReferralsCount: 0,
      unmetMedsCount: 0,
      outOfSchoolTotal: 0,
      nightLightingDeficitPercent: 0
    };
  }

  let totalPop = 0;
  let femaleHeaded = 0;
  let under5 = 0;
  let schoolAge = 0;
  let elderly = 0;
  let disabled = 0;
  let injured = 0;
  let orphans = 0;
  let plw = 0;
  let chronic = 0;

  let critical = 0;
  let high = 0;
  let medium = 0;
  let low = 0;

  let ultraDestitute = 0;
  let poor = 0;
  let limited = 0;
  let relativeCap = 0;

  let totalWaterLiters = 0;
  let totalShelterArea = 0;
  let damagedShelters = 0;
  let sumPersonsPerLatrine = 0;
  let unseparatedLatrines = 0;
  let unreachedFood = 0;
  let oneMealOnly = 0;
  let nutritionRisk = 0;
  let activeInfections = 0;
  let urgentReferrals = 0;
  let unmetMeds = 0;
  let outOfSchool = 0;
  let noNightLight = 0;

  households.forEach(h => {
    const pop = h.familySize || 1;
    totalPop += pop;
    if (h.headGender === 'female') femaleHeaded++;
    under5 += h.childrenUnder5 || 0;
    schoolAge += h.childrenSchoolAge || 0;
    elderly += h.elderly60Plus || 0;
    disabled += h.personsWithDisability || 0;
    injured += h.warInjuredCount || 0;
    orphans += h.orphansCount || 0;
    plw += h.pregnantLactatingWomen || 0;
    chronic += h.chronicIllnessesCount || 0;

    const analysis = calculateHouseholdVulnerability(h);
    if (analysis.tier === 'critical') critical++;
    else if (analysis.tier === 'high') high++;
    else if (analysis.tier === 'medium') medium++;
    else low++;

    if (h.economicTier === 'ultra_destitute') ultraDestitute++;
    else if (h.economicTier === 'poor') poor++;
    else if (h.economicTier === 'limited_income') limited++;
    else relativeCap++;

    totalWaterLiters += h.dailyWaterLiters || 0;
    totalShelterArea += h.shelterAreaM2 || 0;
    if (h.shelterCondition === 'critical' || h.shelterCondition === 'poor') damagedShelters++;
    sumPersonsPerLatrine += h.sharedLatrineUsersCount || 0;
    if (!h.latrineGenderSeparated) unseparatedLatrines++;
    if (!h.foodAssistanceLast14Days) unreachedFood++;
    if (h.dailyMealsCount <= 1) oneMealOnly++;
    if (h.infantNutritionRisk) nutritionRisk++;
    if (h.activeInfections && h.activeInfections.length > 0) activeInfections += h.activeInfections.length;
    if (h.urgentReferralNeeded) urgentReferrals++;
    if (h.unmetMedicationNeeds) unmetMeds++;
    outOfSchool += h.outOfSchoolChildren || 0;
    if (!h.nightLightingSafe) noNightLight++;
  });

  const avgWaterLitersPerPerson = Number((totalWaterLiters / totalPop).toFixed(1));
  const waterCoveragePercentage = Math.min(100, Math.round((avgWaterLitersPerPerson / 15) * 100));
  const waterGapLiters = Number(Math.max(0, 15 - avgWaterLitersPerPerson).toFixed(1));
  let waterStatus: 'critical' | 'high' | 'medium' | 'acceptable' = 'acceptable';
  if (avgWaterLitersPerPerson < 7.5) waterStatus = 'critical';
  else if (avgWaterLitersPerPerson < 12) waterStatus = 'high';
  else if (avgWaterLitersPerPerson < 15) waterStatus = 'medium';

  const avgCoveredAreaPerPerson = Number((totalShelterArea / totalPop).toFixed(1));
  const shelterAreaGapM2 = Number(Math.max(0, 3.5 - avgCoveredAreaPerPerson).toFixed(1));
  let shelterStatus: 'critical' | 'high' | 'medium' | 'acceptable' = 'acceptable';
  if (avgCoveredAreaPerPerson < 2.2) shelterStatus = 'critical';
  else if (avgCoveredAreaPerPerson < 3.0) shelterStatus = 'high';
  else if (avgCoveredAreaPerPerson < 3.5) shelterStatus = 'medium';

  const avgPersonsPerLatrine = Math.round(sumPersonsPerLatrine / totalHouseholds);
  const totalFunctionalLatrines = Math.max(1, Math.round(totalPop / Math.max(1, avgPersonsPerLatrine)));
  const requiredLatrinesAtSphere = Math.ceil(totalPop / 20);
  const latrineDeficitCount = Math.max(0, requiredLatrinesAtSphere - totalFunctionalLatrines);
  let latrineStatus: 'critical' | 'high' | 'medium' | 'acceptable' = 'acceptable';
  if (avgPersonsPerLatrine > 45) latrineStatus = 'critical';
  else if (avgPersonsPerLatrine > 30) latrineStatus = 'high';
  else if (avgPersonsPerLatrine > 20) latrineStatus = 'medium';

  return {
    totalHouseholds,
    totalPopulation: totalPop,
    femaleHeadedHouseholds: femaleHeaded,
    childrenUnder5Total: under5,
    schoolAgeChildrenTotal: schoolAge,
    elderlyTotal: elderly,
    disabledTotal: disabled,
    warInjuredTotal: injured,
    orphansTotal: orphans,
    pregnantLactatingTotal: plw,
    chronicallyIllTotal: chronic,
    criticalCount: critical,
    highCount: high,
    mediumCount: medium,
    lowCount: low,
    ultraDestituteCount: ultraDestitute,
    poorCount: poor,
    limitedIncomeCount: limited,
    relativeCapacityCount: relativeCap,
    avgWaterLitersPerPerson,
    waterCoveragePercentage,
    waterGapLiters,
    waterStatus,
    avgCoveredAreaPerPerson,
    shelterAreaGapM2,
    shelterStatus,
    damagedShelterCount: damagedShelters,
    avgPersonsPerLatrine,
    latrineDeficitCount,
    latrineStatus,
    latrineUnseparatedCount: unseparatedLatrines,
    dailyMealDeficitRate: Math.round((oneMealOnly / totalHouseholds) * 100),
    foodUnreachedCount: unreachedFood,
    nutritionRiskCount: nutritionRisk,
    activeEpidemicCount: activeInfections,
    urgentReferralsCount: urgentReferrals,
    unmetMedsCount: unmetMeds,
    outOfSchoolTotal: outOfSchool,
    nightLightingDeficitPercent: Math.round((noNightLight / totalHouseholds) * 100)
  };
}

export function generateSectorAnalyses(metrics: CampAggregateMetrics): SectorAnalysis[] {
  const pop = metrics.totalPopulation || 1;
  const hCount = metrics.totalHouseholds || 1;

  return [
    {
      id: 'shelter_nfi',
      nameAr: 'المأوى والمواد غير الغذائية (Shelter & NFI)',
      iconName: 'Tent',
      sphereStandard: '3.5 م² مغطاة للشخص كحد أدنى، مأوى عازل ومقاوم للرياح والأمطار',
      sphereMetric: `${metrics.avgCoveredAreaPerPerson} م² / فرد (المعيار: 3.5 م²)`,
      currentValue: `${metrics.avgCoveredAreaPerPerson} م²/فرد`,
      gapPercentage: Math.round(Math.max(0, (1 - metrics.avgCoveredAreaPerPerson / 3.5) * 100)),
      affectedPopulation: Math.round(pop * 0.72),
      status: metrics.shelterStatus,
      keyFindings: [
        `${metrics.damagedShelterCount} خيمة من أصل ${hCount} بحاجة لصيانة عاجلة أو تبديل شوادر مهترئة.`,
        `متوسط المساحة المغطاة (${metrics.avgCoveredAreaPerPerson} م²/شخص) يمثل فجوة عجز تبلغ ${metrics.shelterAreaGapM2} م²/شخص عن معيار اسفير.`,
        `نقص حاد في الفرشات الشتوية والأغطية العازلة للرطوبة مع اقتراب المنخفضات الجوية.`
      ],
      immediateInterventions: [
        'توزيع شوادر نايلون بلاستيكية معالجة ضد الأشعة والمطر سمك 200 ميكرون.',
        'توفير ألواح خشبية لرفع أرضيات الخيام 15 سم عن منسوب تجمع السيول.',
        'تأمين بطانيات حرارية وفرشات عازلة للأسر ذات التصنيف الحرج.'
      ]
    },
    {
      id: 'food_nutrition',
      nameAr: 'الأمن الغذائي والتغذية (Food Security & Nutrition)',
      iconName: 'Utensils',
      sphereStandard: '2,100 سعرة حرارية/يوم للشخص، وجبتان متوازنتان على الأقل، تغذية علاجية للأطفال والحوامل',
      sphereMetric: `${metrics.dailyMealDeficitRate}% من الأسر تعتمد على وجبة واحدة شحيحة يومياً`,
      currentValue: `${metrics.foodUnreachedCount} أسرة لم تستلم أي طرد خلال 14 يوماً`,
      gapPercentage: Math.max(30, metrics.dailyMealDeficitRate),
      affectedPopulation: Math.round(pop * 0.8),
      status: metrics.dailyMealDeficitRate > 40 ? 'critical' : 'high',
      keyFindings: [
        `${metrics.nutritionRiskCount} طفلاً ورضيعاً تظهر عليهم مؤشرات سوء التغذية الحاد أو المعتدل (MAM/SAM).`,
        `اعتماد مكثف على النشويات والمعلبات وغياب كامل للخضروات والبروتينات الطازجة بسبب الغلاء وانقطاع السلاسل.`,
        `شح غاز الطهي واستخدام البلاستيك والأخشاب للطهي مما يسبب أمراضاً تنفسية للأطفال.`
      ],
      immediateInterventions: [
        'توريد حصص دقيق وبقوليات طازجة للتكيات الميدانية لضمان وجبة ساخنة يومية.',
        'توزيع مكملات Plumpy\'Nut وبسكويت عالي الطاقة وفيتامينات للأطفال والحوامل.',
        'تفعيل برنامج قسائم نقدية مخصصة لشراء خضروات طازجة للأسر الأشد هشاشة.'
      ]
    },
    {
      id: 'wash',
      nameAr: 'المياه والإصحاح البيئي والنظافة (WASH)',
      iconName: 'Droplets',
      sphereStandard: '15 لتر مياه صالحة/فرد/يوم، مرحاض لكل 20 شخصاً، مسافة <500م، انتظار <30 دقيقة',
      sphereMetric: `${metrics.avgWaterLitersPerPerson} لتر/فرد/يوم | ${metrics.avgPersonsPerLatrine} شخص لكل مرحاض`,
      currentValue: `${metrics.avgWaterLitersPerPerson} لتر/فرد/يوم`,
      gapPercentage: Math.round(Math.max(0, (1 - metrics.avgWaterLitersPerPerson / 15) * 100)),
      affectedPopulation: pop,
      status: metrics.waterStatus,
      keyFindings: [
        `عجز يومي في مياه الشرب والاستخدام قدره ${metrics.waterGapLiters} لتر لكل فرد دون المعيار الأدنى لـ اسفير.`,
        `اكتظاظ المراحيض بمعدل ${metrics.avgPersonsPerLatrine} شخصاً لكل مرحاض (المعيار: 20 شخصاً كحد أقصى)، مع نقص ${metrics.latrineDeficitCount} وحدة مرحاض.`,
        `${metrics.latrineUnseparatedCount} أسرة تشتكي من غياب الفصل الآمن بين الرجال والنساء أو انعدام الإنارة الليلية.`
      ],
      immediateInterventions: [
        'زيادة رحلات صهاريج المياه المعقمة والمكلورة بمقدار 25 متر مكعب يومياً.',
        'تركيب 12 وحدة مراحيض مسبقة الصنع مفصولة ومزودة بأقفال داخلية وإنارة شمسية مستقلة.',
        'حملة رش مبيدات وتوزيع حقائب نظافة عائلية تتضمن صابون ومطهرات وفوط صحية نسائية.'
      ]
    },
    {
      id: 'health',
      nameAr: 'الصحة والرعاية الأولية (Health & Epidemics)',
      iconName: 'Activity',
      sphereStandard: 'عيادة ميدانية لكل 10,000 نسمة، أدوية الأمراض المزمنة متوفرة، صفر وفيات يمكن تفاديها',
      sphereMetric: `${metrics.activeEpidemicCount} إصابة مسجلة بأمراض جلدية ومعدية`,
      currentValue: `${metrics.urgentReferralsCount} حالة بحاجة ماسة لتحويل جراحي أو تخصصي`,
      gapPercentage: 68,
      affectedPopulation: Math.round(pop * 0.45),
      status: metrics.urgentReferralsCount > 5 ? 'critical' : 'high',
      keyFindings: [
        `انتشار أمراض الجرب والتهابات الجلد البكتيرية والتهاب الكبد الوبائي أ بسبب شح مياه النظافة والتلاصق.`,
        `${metrics.unmetMedsCount} مريضاً بالأمراض المزمنة (سكري، ضغط، كلى) بلا أدوية منتظمة منذ أكثر من شهر.`,
        `${metrics.warInjuredTotal} جريح حرب يعانون من مضاعفات التئام الجروح وتلوثها ونقص الغيارات المعقمة.`
      ],
      immediateInterventions: [
        'تشغيل يومي للنقطة الطبية الميدانية مع طبيب عام وممرض وتوفير غيارات معقمة.',
        'تأمين شحنة أدوية أمراض مزمنة حرجة (أنسولين، خافضات ضغط، مسكنات).',
        'تنسيق إحالات طارئة مع المستشفيات الميدانية (الصليب الأحمر، أطباء بلا حدود) للحالات المعقدة.'
      ]
    },
    {
      id: 'protection_aap',
      nameAr: 'الحماية والمساءلة (Protection & AAP / PSEA)',
      iconName: 'ShieldAlert',
      sphereStandard: 'بيئة آمنة وكريمة، حماية الفئات المستضعفة، منع الاستغلال PSEA، آلية شكاوى سرية وفعالة',
      sphereMetric: `${metrics.femaleHeadedHouseholds} أسرة تعيلها نساء | ${metrics.disabledTotal} من ذوي الإعاقة`,
      currentValue: `${metrics.nightLightingDeficitPercent}% من ممرات المخيم بلا إنارة ليلية آمنة`,
      gapPercentage: 55,
      affectedPopulation: Math.round(pop * 0.5),
      status: 'high',
      keyFindings: [
        `مخاوف سلامة ليلية للنساء والأطفال أثناء الوصول للمراحيض بسبب انعدام الإضاءة في الممرات.`,
        `عزلة وصعوبة حركة ذوي الإعاقة (${metrics.disabledTotal}) وجرحى الحرب (${metrics.warInjuredTotal}) بين الخيام الرملية.`,
        `حاجة لتعزيز آلية الشكاوى والمقترحات الموثوقة لمنع أي شبهة محسوبية أو استغلال.`
      ],
      immediateInterventions: [
        'تركيب 20 عمود إنارة بالطاقة الشمسية على الممرات الرئيسية وحول مرافق المياه والصرف الصحي.',
        'تمهيد ممرات خشبية / حصوية لتسهيل حركة الكراسي المتحركة لذوي الإعاقة والجرحى.',
        'تفعيل صندوق شكاوى مغلق وبرقم وتساب سري وتدريب لجان التوزيع على مدونة السلوك وPSEA.'
      ]
    },
    {
      id: 'education',
      nameAr: 'التعليم ومساحات الأطفال (Education in Emergencies)',
      iconName: 'GraduationCap',
      sphereStandard: 'مساحة تعليمية وترفيهية آمنة، نشاط تعليمي مستمر، دعم نفسي اجتماعي للأطفال',
      sphereMetric: `${metrics.outOfSchoolTotal} طفل في سن التعليم منقطعين عن الدراسة الرسمية`,
      currentValue: `${metrics.schoolAgeChildrenTotal} طفلاً في سن المدرسة بالمخيم`,
      gapPercentage: 75,
      affectedPopulation: metrics.schoolAgeChildrenTotal,
      status: 'medium',
      keyFindings: [
        `انقطاع مستمر عن التعليم المدرسي للعام الثاني على التوالي مع فقدان الكتب والأدوات.`,
        `أعراض صدمة نفسية وخوف وكوابيس وتبول لا إرادي تظهر على أكثر من 60% من أطفال المخيم.`,
        `توفر معلمين متطوعين من بين النازحين لديهم الاستعداد الكامل للتدريس في خيام تعليمية.`
      ],
      immediateInterventions: [
        'إنشاء خيمتين كبيرتين كمساحات صديقة للطفل (Child-Friendly Spaces) وفصول تعليم استدراكي.',
        'توفير قرطاسية وألعاب تعليمية وأدوات رسم وتفريغ نفسي للأطفال.',
        'تقديم مكافآت رمزية (حوافز نقدية) للمعلمين والمنشطين المتطوعين من أبناء المخيم.'
      ]
    },
    {
      id: 'livelihoods',
      nameAr: 'سبل العيش والتفاوت الاجتماعي (Livelihoods & Social Equity)',
      iconName: 'Briefcase',
      sphereStandard: 'برامج نقد مقابل العمل (CfW)، صيانة مهارات الحرفيين، تدخلات تمايزية بدون وصم',
      sphereMetric: `${metrics.ultraDestituteCount} أسرة معدمة كلياً | ${metrics.relativeCapacityCount} أسر ذات قدرة نسبية`,
      currentValue: `${Math.round(((metrics.ultraDestituteCount + metrics.poorCount) / hCount) * 100)}% فقر مدقع وشديد`,
      gapPercentage: 82,
      affectedPopulation: pop,
      status: 'high',
      keyFindings: [
        `تفاوت معيشي حساس: موظفون بلا رواتب وأصحاب مهن فقدوا ورشهم إلى جانب أسر معدمة تماماً.`,
        `خطر الاحتكاك الاجتماعي في حال غياب الشفافية في التوزيع أو وصم الأسر المستفيدة.`,
        `وجود مهارات حرفية مهمة داخل المخيم (سباكون، كهربائيون، خياطون، معلمون، ممرضون).`
      ],
      immediateInterventions: [
        'تشغيل 25 شاباً وحرفياً في أعمال نظافة المخيم وصيانة الخيام وشبكات المياه مقابل حوافز يومية (CfW).',
        'دعم 10 نساء معيلات بماكينات خياطة يدوية لإصلاح الملابس والشوادر داخل المخيم.',
        'تطبيق نظام المساعدة التمايزية: دعم كامل للمعدمين، ونقد مقابل عمل للأسر القادرة على العطاء.'
      ]
    },
    {
      id: 'energy_telecom',
      nameAr: 'الطاقة والاتصالات (Energy & Connectivity)',
      iconName: 'Zap',
      sphereStandard: 'نقاط شحن هواتف آمنة، إنارة ليلية للخيم والمرافق، وسيلة اتصال وتواصل بالطوارئ',
      sphereMetric: 'انقطاع تام لشبكة الكهرباء العامة وشح الديزل لتشغيل المولدات',
      currentValue: 'محطة طاقة شمسية واحدة بقدرة 3 كيلوواط مشتركة للمخيم بأكمله',
      gapPercentage: 65,
      affectedPopulation: pop,
      status: 'medium',
      keyFindings: [
        `طوابير طويلة لشحن الهواتف وبطاريات الإضاءة ومصابيح الطوارئ، مع توترات بين السكان.`,
        `صعوبة الاتصال بالإسعاف أو الدفاع المدني في حالات الطوارئ بسبب ضعف التغطية وفراغ الشحن.`,
        `استخدام بطاريات تالفة ومواد سريعة الاشتعال للشحن داخل الخيام يشكل خطراً حريقاً مرتفعاً.`
      ],
      immediateInterventions: [
        'تركيب مصفوفة ألواح طاقة شمسية إضافية (5 كيلوواط) مع بطاريات ليثيوم لتغذية نقاط الشحن المشتركة.',
        'توزيع 150 مصباحاً شمسياً منزلياً مستقلاً للأسر ذات التصنيف الحرج (خاصة الأسر التي تعيلها نساء).',
        'توفير راوتر إنترنت فضائي أو مقوي شبكة خلوية في نقطة إدارة المخيم للطوارئ والتنسيق الإنساني.'
      ]
    }
  ];
}
