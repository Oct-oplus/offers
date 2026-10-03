/**
 * ميني آب العروض - طبقة البيانات المشتركة والتخزين المحلي
 * يدعم التخزين والمزامنة الفورية بين جميع صفحات البروتوتايب
 */
(function(window){
  var KEY = 'MINIAPP_DATA_V2';
  var USER_KEY = 'MINIAPP_CURRENT_USER_V1';

  var DEFAULT_CATS = {
    coach: { n: 'كوتشينغ', i: '🎯', desc: 'جلسات فردية، جماعية وباقات' },
    course: { n: 'كورسات تطويرية', i: '📚', desc: 'كورسات مقاعد مفتوحة مرتبطة بقروبات' },
    session: { n: 'جلسات نفسية', i: '🫶', desc: 'جلسات خاصة وسرية لا ترتبط بقروبات' },
    test: { n: 'اختبارات تقييم', i: '🧭', desc: 'اختبارات فردية بنتائج وتوصيات خاصة' }
  };

  var DEFAULT_OFFERS = [
    {
      id: 'c1', cat: 'coach', subType: 'فردي', hasGroup: false, seats: 'مقعد فردي خاص (كرسي واحد)',
      t: 'كوتشينغ التواصل الفعال', d: 'تتعلم تعبّر عن نفسك وتسمع غيرك بوضوح وثقة عبر جلسات فردية خاصة.',
      m: '6 جلسات · 60 دقيقة', p: '95$', vis: true, feat: true,
      pts: ['تحديد أنماط التواصل عندك', 'تمارين تطبيقية بين الجلسات', 'خطة متابعة خاصة بعد الانتهاء']
    },
    {
      id: 'c2', cat: 'coach', subType: 'فردي', hasGroup: false, seats: 'مقعد فردي خاص (كرسي واحد)',
      t: 'كوتشينغ البزنس والمشاريع', d: 'وضوح في الأهداف وقرارات أسرع لمشروعك أو عملك (فردي مباشر بدون قروب).',
      m: '8 جلسات · 60 دقيقة', p: '140$', vis: true, feat: false,
      pts: ['خارطة أهداف ربع سنوية', 'معالجة العوائق في القرار', 'متابعة أسبوعية فردية']
    },
    {
      id: 'c3', cat: 'coach', subType: 'جماعي', hasGroup: true, groupName: 'قروب كوتشينغ الحياة', botLinked: true,
      seats: 'كراسي محددة (15 مقعد فقط)', maxSeats: 15,
      t: 'كوتشينغ جماعي: الحياة والأهداف', d: 'ترتّب أولوياتك وتبني عادات تمشي معك مع مجموعة محددة وقروب تفاعلي.',
      m: '6 جلسات · 60 دقيقة', p: '80$', vis: true, feat: true,
      pts: ['عجلة الحياة وتحديد البوصلة', 'أهداف قابلة للقياس', 'عادات صغيرة مستمرة', 'مجموعة نقاش تفاعلية محدودة المقاعد']
    },
    {
      id: 'c5', cat: 'coach', subType: 'جماعي', hasGroup: true, groupName: 'مجتمع الطاقة الإيجابية', botLinked: true,
      seats: 'مقاعد مفتوحة وغير محدودة', maxSeats: 100,
      t: 'كوتشينغ جماعي: إدارة الضغوط وتجديد الطاقة', d: 'لقاءات أسبوعية جماعية بمقاعد مفتوحة مع قروب تيليجرام تفاعلي.',
      m: '8 لقاءات جماعية', p: '65$', vis: true, feat: false,
      pts: ['استراتيجيات تفريغ الشحن الذهني', 'تمارين جماعية دورية', 'مجتمع داعم ومقاعد غير محدودة']
    },
    {
      id: 'c4', cat: 'coach', subType: 'باكج', hasGroup: false, seats: 'باقة مجمعة شاملة',
      t: 'باكج كوتشينغ الانطلاق الشامل', d: 'باكج يجمع كوتشينغ التواصل الفردي + كوتشينغ البزنس بسعر مميز.',
      m: '14 جلسة شاملة', p: '199$', vis: true, feat: false,
      pts: ['مزيج بين المهارات الشخصية والعملية', 'متابعة مباشرة مع الكوتش', 'تقييم شامل في البداية والنهاية']
    },
    {
      id: 'c6', cat: 'coach', subType: 'باكج', hasGroup: true, groupName: 'قروب نخبة التميز', botLinked: true,
      seats: 'باقة مجمعة (جماعي + فردي)', maxSeats: 25,
      t: 'باكج التميز المهني والشخصي', d: 'باكج يجمع كوتشينغ الحياة الجماعي (مع القروب) + جلستي كوتشينغ استشارية خاصة.',
      m: '8 جلسات مدمجة', p: '160$', vis: true, feat: true,
      pts: ['الاستفادة من القروب التفاعلي', 'جلسات خاصة مع الكوتش 1 على 1', 'خطة تطوير متكاملة']
    },
    {
      id: 'k1', cat: 'course', type: 'كورس', hasGroup: true, groupName: 'مجتمع إدارة الوقت والتركيز', botLinked: true,
      seats: 'مقاعد غير محدودة · مرتبط بقروب', maxSeats: 100,
      t: 'إدارة الوقت والتركيز', d: 'كورس عملي يرجّع لك تحكمك بيومك مع مجتمع تفاعلي.',
      m: '10 دروس · 4 ساعات', p: '45$', vis: true, feat: true,
      pts: ['طرق التخطيط اليومي', 'التعامل مع المشتتات', 'ملف تمارين جاهز', 'قروب تيليجرام للنقاشات']
    },
    {
      id: 'k2', cat: 'course', type: 'كورس', hasGroup: true, groupName: 'مجتمع الثقة بالنفس', botLinked: true,
      seats: 'مقاعد غير محدودة · مرتبط بقروب', maxSeats: 100,
      t: 'بناء الثقة بالنفس والحضور', d: 'خطوات متدرجة لحوار داخلي أهدأ وأقوى.',
      m: '8 دروس · 3 ساعات', p: '40$', vis: true, feat: true,
      pts: ['فهم مصدر الشك بالنفس', 'تمارين يومية قصيرة', 'اختبار تقييم ذاتي', 'قروب للمشاركين']
    },
    {
      id: 'k3', cat: 'course', type: 'كورس', hasGroup: true, groupName: 'مجتمع مهارات القيادة', botLinked: false,
      seats: 'مقاعد غير محدودة · بانتظار ربط البوت', maxSeats: 100,
      t: 'مهارات القيادة والتأثير', d: 'لمن يبغى يقود فريق بثقة وتأثير عالي.',
      m: '12 درس · 5 ساعات', p: '55$', vis: true, feat: false,
      pts: ['أنماط القيادة الفعالة', 'إعطاء الملاحظات البناءة', 'إدارة الخلافات داخل الفريق']
    },
    {
      id: 's1', cat: 'session', type: 'جلسة', hasGroup: false, seats: 'جلسة خاصة سرية 1 على 1 · بدون قروب',
      t: 'جلسة تشخيص: القلق والضغوط', d: 'مساحة آمنة وخاصة لفهم مسببات القلق والتعامل معها.',
      m: 'جلسة 50 دقيقة', p: '95$', vis: true, feat: true,
      pts: ['فهم مسببات القلق', 'أدوات تهدئة عملية ومجربة', 'متابعة وملاحظات سرية بعد الجلسة']
    },
    {
      id: 's2', cat: 'session', type: 'جلسة', hasGroup: false, seats: 'جلسة خاصة سرية 1 على 1 · بدون قروب',
      t: 'جلسة العلاقات والحدود الشخصية', d: 'لفهم أنماطك في العلاقات وتحسين التواصل الصحي.',
      m: 'جلسة 50 دقيقة', p: '95$', vis: true, feat: false,
      pts: ['استكشاف الأنماط السلوكية', 'وضع الحدود الصحية', 'تمارين تفكيك التوتر في العلاقات']
    },
    {
      id: 's3', cat: 'session', type: 'جلسة', hasGroup: false, seats: 'جلسة خاصة سرية 1 على 1 · بدون قروب',
      t: 'جلسة التعافي من الاحتراق النفسي', d: 'ترجّع طاقتك وتوازنك الداخلي بعد فترات الإرهاق الشديد.',
      m: 'جلسة 50 دقيقة', p: '95$', vis: true, feat: false,
      pts: ['تحديد مصادر الاستنزاف النفسي', 'خطة راحة متدرجة', 'إعادة بناء الروتين اليومي الصحي']
    },
    {
      id: 't1', cat: 'test', type: 'اختبار', hasGroup: false, seats: 'اختبار فردي خاص · بدون قروب · نتيجة من المختص',
      t: 'اختبار الشخصية وأنماط السلوك', d: 'يعرّفك على نقاط قوتك وأسلوبك القيادي والتواصلي.',
      m: '25 دقيقة · النتيجة من المختص', p: '30$', vis: true, feat: true,
      pts: ['اختبار مفصّل معتمد', 'تفسير شخصي للنتيجة من المختص', 'توصيات واضحة للتطوير']
    },
    {
      id: 't2', cat: 'test', type: 'اختبار', hasGroup: false, seats: 'اختبار فردي خاص · بدون قروب · يُعاد كل شهرين',
      t: 'اختبار القلق والتوتر النفسي', d: 'يقيس مستوى التوتر الحالي لديك ويُعاد دورياً.',
      m: '15 دقيقة · النتيجة من المختص', p: '25$', vis: true, feat: false,
      pts: ['مقياس سريري معتمد', 'قراءة النتيجة من أخصائي', 'يُعاد كل شهرين لمتابعة التحسن']
    },
    {
      id: 't3', cat: 'test', type: 'اختبار', hasGroup: false, seats: 'اختبار فردي خاص · بدون قروب · متابعة بعد 3 أشهر',
      t: 'اختبار الاحتراق الوظيفي', d: 'تعرف إذا كان ضغط العمل بدأ يؤثر على صحتك النفسية.',
      m: '15 دقيقة · النتيجة من المختص', p: '25$', vis: true, feat: false,
      pts: ['مقياس معتمد للضغوط المهنية', 'خطة مقترحة من المختص', 'متابعة دورية']
    }
  ];

  // المستخدمون المسجلون في قاعدة بيانات البوت (قاموا بالضغط على Start في البوت)
  var DEFAULT_BOT_USERS = [
    '@noura', '@khaled', '@reem', '@salman', '@mona',
    '@abdullah_r', '@hind_k', '@fahad_a', '@lama_s',
    '@majed_s', '@nouf_b', '@turki_a', '@coord_sa', '@admin'
  ];

  var DEFAULT_COORD = [
    { c: 'السعودية', f: '🇸🇦', n: 'منسقة السعودية', u: 'sa_coord', h: '9 ص – 9 م بتوقيت الرياض', active: true },
    { c: 'الكويت', f: '🇰🇼', n: 'منسقة الكويت', u: 'kw_coord', h: '9 ص – 9 م بتوقيت الكويت', active: true },
    { c: 'الإمارات', f: '🇦🇪', n: 'منسقة الإمارات', u: 'ae_coord', h: '10 ص – 8 م بتوقيت دبي', active: true },
    { c: 'قطر', f: '🇶🇦', n: 'منسقة قطر', u: 'qa_coord', h: '9 ص – 9 م بتوقيت الدوحة', active: false },
    { c: 'دول أخرى', f: '🌍', n: 'منسقة عامة', u: 'global_coord', h: 'حسب التوفر', active: true }
  ];

  var DEFAULT_REVIEWS = {
    c1: [
      { id: 101, n: 'نورة ع.', u: '@noura', s: 5, t: 'غيّرت طريقة كلامي مع فريقي في العمل، ممتازة جداً!' },
      { id: 102, n: 'خالد م.', u: '@khaled', s: 4, t: 'تمارين تطبيقية مفيدة وواضحة وسهلة التنفيذ.' }
    ],
    k1: [
      { id: 103, n: 'ريم س.', u: '@reem', s: 5, t: 'مرتب وسهل وعملي، طبّقت الأدوات من أول يوم.' }
    ],
    s1: [
      { id: 104, n: 'محمد ع.', u: '@mohd', s: 5, t: 'حسّيت بأمان وراحة كبيرة والمختص كان مستمعاً رائعاً.' }
    ],
    t1: [
      { id: 105, n: 'سلمان ح.', u: '@salman', s: 4, t: 'التفسير والتقرير الصادر كان دقيقاً وساعدني على فهم نفسي.' }
    ]
  };

  // تقييمات بانتظار موافقة الأدمن
  var DEFAULT_PENDING_REVIEWS = [
    { id: 201, c: 'نورة ع.', u: '@noura', o: 'c3', s: 5, t: 'الكوتشينغ الجماعي كان تجربة ملهمة جداً والقروب متعاون.' },
    { id: 202, c: 'سلمان ح.', u: '@salman', o: 't2', s: 4, t: 'الاختبار أوضح لي نقاط الضغط بدقة.' },
    { id: 203, c: 'خالد م.', u: '@khaled', o: 'c2', s: 5, t: 'وضّح لي أهدافي التسويقية للمشروع ووفر علي وقتاً.' }
  ];

  // ملاحظات خاصة موجهة للمختص فقط
  var DEFAULT_PRIV = [
    { id: 301, c: 'ريم س.', u: '@reem', o: 's1', t: 'أتمنى إرسال التذكير بموعد الجلسة قبلها بساعتين وليس بيوم.', read: false },
    { id: 302, c: 'منى ق.', u: '@mona', o: 'c3', t: 'هل بالإمكان توفير تمارين تأمل أقصر؟', read: false }
  ];

  var DEFAULT_SUBS = [
    { id: 1, n: 'نورة ع.', u: '@noura', o: 'c1', d: 'مارس 2026', prog: 50, l: 'الجلسة 3 من 6', st: 'none' },
    { id: 2, n: 'نورة ع.', u: '@noura', o: 'k1', d: 'أمس', prog: 40, l: '4 من 10 دروس', st: 'joined' },
    { id: 3, n: 'نورة ع.', u: '@noura', o: 's1', d: 'قبل أسبوع', prog: 33, l: 'الجلسة 2 من 6', st: 'none' },
    { id: 4, n: 'عبدالله ر.', u: '@abdullah_r', o: 'k1', d: 'اليوم', prog: 10, l: 'الدرس 1 من 10', st: 'pending' },
    { id: 5, n: 'هند ك.', u: '@hind_k', o: 'c3', d: 'أمس', prog: 20, l: 'الجلسة 1 من 6', st: 'sent' },
    { id: 6, n: 'فهد ع.', u: '@fahad_a', o: 'k3', d: 'قبل 3 أيام', prog: 60, l: '7 من 12 درس', st: 'joined' },
    { id: 7, n: 'لمى ص.', u: '@lama_s', o: 's1', d: 'قبل 4 أيام', prog: 20, l: 'الجلسة 1 من 6', st: 'none' },
    { id: 8, n: 'ماجد س.', u: '@majed_s', o: 'k2', d: 'قبل أسبوع', prog: 50, l: '4 من 8 دروس', st: 'joined' },
    { id: 9, n: 'نوف ب.', u: '@nouf_b', o: 'k3', d: 'قبل يومين', prog: 15, l: 'الدرس 2 من 12', st: 'pending' },
    { id: 10, n: 'تركي ع.', u: '@turki_a', o: 'k1', d: 'قبل يومين', prog: 0, l: 'بانتظار البدء', st: 'failed' }
  ];

  var DEFAULT_NOTES = {
    '@noura': [
      { id: 1, t: 'لا تتخطي تمرين التنفس اليومي قبل النوم، حتى لو كان يومك مزدحماً.', ack: false, d: 'قبل 3 أيام' },
      { id: 2, t: 'جهّزي دفتر ملاحظاتك قبل الجلسة القادمة وسجّلي فيه المواقف التي أثارت قلقك.', ack: false, d: 'قبل 5 أيام' },
      { id: 3, t: 'تم الاتفاق على تقليل الكافيين بعد الساعة 4 عصراً.', ack: true, d: 'قبل أسبوع' }
    ]
  };

  var DEFAULT_TESTS = {
    '@noura': [
      { id: 't1', date: 'قبل أسبوعين', st: 'done', res: 'ملف شخصيتك يميل للتحليل والتنظيم بدقة. نقطة القوة: التخطيط المستقبلي. نقطة التطوير: التفويض وإعطاء الثقة لفريق العمل.', tips: 'جرّبي تفويض مهمة واحدة بسيطة أسبوعياً وملاحظة الأثر.' },
      { id: 't2', date: 'أمس', st: 'wait', res: '', tips: '', when: 'أنجزتِه أمس · بانتظار مراجعة المختص' }
    ]
  };

  var DEFAULT_PERM = {
    edit: true,
    del: false
  };

  var DEFAULT_BOT_LOG = [
    { id: 1, time: 'منذ 10 دقائق', msg: 'انضم @fahad_a إلى قروب مهارات القيادة والتأثير (المقاعد المتبقية: 82).' },
    { id: 2, time: 'منذ ساعة', msg: 'تم تسليم نتيجة اختبار الشخصية للعميلة @noura وإشعارها على تيليجرام.' },
    { id: 3, time: 'أمس', msg: 'تذكير دوري: اقترب موعد إعادة اختبار القلق والتوتر للعميل @salman.' }
  ];

  // وظائف إدارة التخزين
  function loadData() {
    try {
      var s = localStorage.getItem(KEY);
      if (s) {
        var d = JSON.parse(s);
        return d;
      }
    } catch(e) {}
    var init = {
      cats: DEFAULT_CATS,
      offers: DEFAULT_OFFERS,
      botUsers: DEFAULT_BOT_USERS,
      coord: DEFAULT_COORD,
      reviews: DEFAULT_REVIEWS,
      pendingReviews: DEFAULT_PENDING_REVIEWS,
      privNotes: DEFAULT_PRIV,
      subs: DEFAULT_SUBS,
      notes: DEFAULT_NOTES,
      tests: DEFAULT_TESTS,
      perm: DEFAULT_PERM,
      botLog: DEFAULT_BOT_LOG,
      templates: [
        ['تذكير الاختبار', 'اقترب موعد إعادة اختبارك. جاهز تبدأ؟'],
        ['ملاحظة جديدة', 'وصلتك ملاحظة جديدة من المختص، افتحها واقرأها.'],
        ['تأكيد الاشتراك', 'تم تأكيد اشتراكك، ويظهر الآن في صفحة اشتراكاتي.'],
        ['رابط القروب', 'أهلاً بك! هذا رابط الانضمام للقروب الخاص بعرضك: https://t.me/+example']
      ]
    };
    saveData(init);
    return init;
  }

  function saveData(d) {
    try {
      localStorage.setItem(KEY, JSON.stringify(d));
    } catch(e) {}
  }

  // الجلسة الحالية
  function getCurrentUser() {
    try {
      var u = localStorage.getItem(USER_KEY);
      if (u) return JSON.parse(u);
    } catch(e) {}
    return null; // زائر غير مسجل
  }

  function setCurrentUser(user) {
    try {
      if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
      else localStorage.removeItem(USER_KEY);
    } catch(e) {}
  }

  // فحص تسجيل المستخدم في البوت
  function isBotRegistered(username) {
    if (!username) return false;
    var norm = username.trim().toLowerCase();
    if (norm[0] !== '@') norm = '@' + norm;
    var data = loadData();
    return data.botUsers.some(function(u){ return u.toLowerCase() === norm; });
  }

  // بناء رابط تيليجرام مع رسالة استفسار مشروحة
  function buildCoordTelegramUrl(coordUsername, offerTitle, catName, price) {
    var text = 'مرحباً، أرغب بالاستفسار عن العرض التالي:\n' +
      (offerTitle || 'عرض') + ' — ' + (catName || 'الخدمات') + ' — ' + (price || '00$') + '\n' +
      'سؤالي: ';
    return 'https://t.me/' + String(coordUsername).replace('@','') + '?text=' + encodeURIComponent(text);
  }

  // ربط الكائن العالمي
  window.MiniAppDB = {
    load: loadData,
    save: saveData,
    getCurrentUser: getCurrentUser,
    setCurrentUser: setCurrentUser,
    isBotRegistered: isBotRegistered,
    buildCoordTelegramUrl: buildCoordTelegramUrl,
    DEFAULT_PASS: '1234'
  };

})(window);
