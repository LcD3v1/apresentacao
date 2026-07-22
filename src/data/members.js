/**
 * Dados dos oito integrantes.
 *
 * Campos de texto aceitam string simples OU um objeto { pt, en, ar }.
 * O helper `localize()` (LanguageContext) resolve os dois formatos, entao
 * voce pode comecar com strings e traduzir depois, campo a campo.
 *
 * Imagens: arquivos gerados em /public/images (npm run assets).
 * Videos: troque `videoUrl` pelo endereco definitivo (YouTube, Vimeo ou MP4).
 */

// Placeholder de demonstracao. Troque pelo link do post de cada integrante.
const PLACEHOLDER_EMBED = 'https://x.com/danikefpsss/status/1966507991743529347';

export const members = [
  {
    id: 1,
    number: '01',
    name: 'Faisal Al-Rashid',
    arabicName: 'فيصل الراشد',
    role: {
      pt: 'Líder e Estrategista',
      en: 'Leader and Strategist',
      ar: 'القائد وصانع الاستراتيجية',
    },
    location: {
      pt: 'Riade, Arábia Saudita',
      en: 'Riyadh, Saudi Arabia',
      ar: 'الرياض، المملكة العربية السعودية',
    },
    portrait: '/images/ai/portrait-01.webp',
    backgroundImage: '/images/ai/backdrop-01.webp',
    shortDescription: {
      pt: 'Reconhecido pela leitura de cenário e pela calma sob pressão. Conduz o conselho desde a primeira reunião em Riade.',
      en: 'Known for reading the field and staying calm under pressure. He has led the council since the first meeting in Riyadh.',
      ar: 'يُعرف بقراءته للميدان وهدوئه تحت الضغط. يقود المجلس منذ أول لقاء في الرياض.',
    },
    biography: {
      pt: 'Faisal começou como analista em um pequeno escritório no bairro de Al-Malaz, onde aprendeu que decisão sem contexto é apenas ruído. Em oito anos passou de observador a arquiteto de estratégias adotadas por equipes em três continentes. Sua abordagem une o rigor matemático herdado da engenharia à paciência das negociações tradicionais do Golfo. Dentro do conselho, é quem transforma ambição em plano executável.',
      en: 'Faisal began as an analyst in a small office in Al-Malaz, where he learned that a decision without context is just noise. In eight years he moved from observer to the architect of strategies adopted by teams across three continents. His approach joins the mathematical rigour of his engineering training with the patience of traditional Gulf negotiation. Within the council, he is the one who turns ambition into an executable plan.',
      ar: 'بدأ فيصل محللًا في مكتب صغير بحي الملز، حيث تعلّم أن القرار بلا سياق مجرد ضجيج. خلال ثماني سنوات انتقل من مراقب إلى مهندس استراتيجيات تعتمدها فرق في ثلاث قارات. يجمع أسلوبه بين صرامة الهندسة وصبر التفاوض الخليجي التقليدي. وفي المجلس، هو من يحوّل الطموح إلى خطة قابلة للتنفيذ.',
    },
    previousPlaces: ['Al-Nassr Analytics', 'Riyadh Elite', 'Saudi Champions League', 'Vision Lab 2030'],
    timeline: [
      {
        year: '2017',
        title: { pt: 'Primeiro escritório', en: 'First office', ar: 'المكتب الأول' },
        description: {
          pt: 'Entra como analista júnior em Riade e cria o primeiro modelo de leitura de desempenho.',
          en: 'Joins as a junior analyst in Riyadh and builds the first performance-reading model.',
          ar: 'انضم محللًا مبتدئًا في الرياض وبنى أول نموذج لقراءة الأداء.',
        },
      },
      {
        year: '2019',
        title: { pt: 'Convocação nacional', en: 'National call-up', ar: 'الاستدعاء الوطني' },
        description: {
          pt: 'Assume a coordenação estratégica de um projeto nacional com equipe de 40 pessoas.',
          en: 'Takes over strategic coordination of a national project with a 40-person team.',
          ar: 'تولّى التنسيق الاستراتيجي لمشروع وطني بفريق من أربعين شخصًا.',
        },
      },
      {
        year: '2022',
        title: { pt: 'Fundação do conselho', en: 'Founding the council', ar: 'تأسيس المجلس' },
        description: {
          pt: 'Reúne os nomes restantes e formaliza a estrutura do ARABIA GANG.',
          en: 'Gathers the remaining names and formalises the ARABIA GANG structure.',
          ar: 'جمع الأسماء المتبقية وأسّس بنية عصابة أرابيا.',
        },
      },
      {
        year: '2025',
        title: { pt: 'Expansão internacional', en: 'International expansion', ar: 'التوسع الدولي' },
        description: {
          pt: 'Leva o método do conselho a parceiros na Europa e no Sudeste Asiático.',
          en: 'Brings the council method to partners in Europe and Southeast Asia.',
          ar: 'نقل منهج المجلس إلى شركاء في أوروبا وجنوب شرق آسيا.',
        },
      },
    ],
    achievements: {
      pt: [
        'Estrategista do ano no circuito nacional (2023)',
        'Responsável por três títulos consecutivos em competições regionais',
        'Autor do manual de decisão adotado por doze equipes',
      ],
      en: [
        'Strategist of the year in the national circuit (2023)',
        'Behind three consecutive titles in regional competitions',
        'Author of the decision manual adopted by twelve teams',
      ],
      ar: [
        'استراتيجي العام في الدوري الوطني (2023)',
        'وراء ثلاثة ألقاب متتالية في المسابقات الإقليمية',
        'مؤلف دليل القرار الذي اعتمدته اثنتا عشرة فرقة',
      ],
    },
    videoType: 'x',
    videoUrl: PLACEHOLDER_EMBED,
    videoThumbnail: '/images/member-01-video.svg',
    videoTitle: {
      pt: 'O peso da primeira decisão',
      en: 'The weight of the first decision',
      ar: 'ثقل القرار الأول',
    },
    videoDescription: {
      pt: 'Um retrato de quarenta minutos condensado em cinco: como se constrói autoridade sem levantar a voz.',
      en: 'A forty-minute portrait condensed into five: how authority is built without raising your voice.',
      ar: 'بورتريه من أربعين دقيقة اختُصر في خمس: كيف تُبنى السلطة دون رفع الصوت.',
    },
    gallery: [
      '/images/member-01-gallery-01.svg',
      '/images/member-01-gallery-02.svg',
      '/images/member-01-gallery-03.svg',
    ],
    socialLinks: {
      instagram: 'https://www.instagram.com/',
      youtube: 'https://www.youtube.com/',
      linkedin: 'https://www.linkedin.com/',
      x: 'https://x.com/',
    },
  },

  {
    id: 2,
    number: '02',
    name: 'Nour Al-Zahrani',
    arabicName: 'نور الزهراني',
    role: {
      pt: 'Direção Criativa e Identidade',
      en: 'Creative Direction and Identity',
      ar: 'الإدارة الإبداعية والهوية',
    },
    location: { pt: 'Jeddah, Arábia Saudita', en: 'Jeddah, Saudi Arabia', ar: 'جدة، السعودية' },
    portrait: '/images/ai/portrait-02.webp',
    backgroundImage: '/images/ai/backdrop-02.webp',
    shortDescription: {
      pt: 'Traduz herança visual árabe em linguagem contemporânea. Cada projeto do conselho passa pelo olhar dela.',
      en: 'Translates Arabian visual heritage into contemporary language. Every council project passes through her eye.',
      ar: 'تترجم الإرث البصري العربي إلى لغة معاصرة. كل مشروع في المجلس يمرّ على عينها.',
    },
    biography: {
      pt: 'Nour cresceu entre as fachadas de coral da Al-Balad, em Jeddah, e passou a adolescência desenhando as gelosias de madeira que hoje reaparecem em seus projetos digitais. Formada em design e restauração, recusa a nostalgia: para ela, tradição só sobrevive quando é reinterpretada. Comanda a identidade do conselho, do tipo de ouro usado nos títulos ao ritmo de cada filme.',
      en: 'Nour grew up among the coral façades of Al-Balad in Jeddah, and spent her teenage years drawing the wooden latticework that now reappears in her digital work. Trained in design and restoration, she refuses nostalgia: for her, tradition only survives when it is reinterpreted. She leads the council identity, from the shade of gold used in titles to the rhythm of each film.',
      ar: 'نشأت نور بين واجهات المرجان في البلد بجدة، وقضت مراهقتها ترسم الروشان الخشبي الذي يظهر اليوم في أعمالها الرقمية. درست التصميم والترميم، وترفض الحنين: فالتقليد عندها لا يبقى إلا حين يُعاد تفسيره. تقود هوية المجلس، من درجة الذهب في العناوين إلى إيقاع كل فيلم.',
    },
    previousPlaces: ['Jeddah Design House', 'Red Sea Studios', 'Diriyah Heritage Lab'],
    timeline: [
      {
        year: '2016',
        title: { pt: 'Al-Balad', en: 'Al-Balad', ar: 'البلد' },
        description: {
          pt: 'Trabalha na documentação visual do centro histórico de Jeddah.',
          en: 'Works on the visual documentation of the historic centre of Jeddah.',
          ar: 'عملت على التوثيق البصري لوسط جدة التاريخي.',
        },
      },
      {
        year: '2020',
        title: { pt: 'Primeira direção', en: 'First direction', ar: 'أول إدارة فنية' },
        description: {
          pt: 'Assume a direção de arte de uma campanha vista por seis milhões de pessoas.',
          en: 'Takes art direction of a campaign seen by six million people.',
          ar: 'تولّت الإدارة الفنية لحملة شاهدها ستة ملايين شخص.',
        },
      },
      {
        year: '2022',
        title: { pt: 'Entrada no conselho', en: 'Joins the council', ar: 'الانضمام إلى المجلس' },
        description: {
          pt: 'Define o sistema visual completo do ARABIA GANG em onze semanas.',
          en: 'Defines the complete ARABIA GANG visual system in eleven weeks.',
          ar: 'وضعت النظام البصري الكامل للمجلس في أحد عشر أسبوعًا.',
        },
      },
      {
        year: '2024',
        title: { pt: 'Exposição em Diriyah', en: 'Exhibition in Diriyah', ar: 'معرض الدرعية' },
        description: {
          pt: 'Mostra individual sobre geometria islâmica aplicada a interfaces.',
          en: 'Solo show on Islamic geometry applied to interfaces.',
          ar: 'معرض فردي عن الهندسة الإسلامية في الواجهات الرقمية.',
        },
      },
    ],
    achievements: {
      pt: [
        'Prêmio regional de direção de arte (2023)',
        'Sistema visual licenciado para quatro instituições culturais',
        'Curadora convidada da Bienal de Design de Riade',
      ],
      en: [
        'Regional art direction award (2023)',
        'Visual system licensed to four cultural institutions',
        'Guest curator at the Riyadh Design Biennale',
      ],
      ar: [
        'جائزة الإدارة الفنية الإقليمية (2023)',
        'نظام بصري مرخّص لأربع مؤسسات ثقافية',
        'قيّمة ضيفة في بينالي الرياض للتصميم',
      ],
    },
    videoType: 'x',
    videoUrl: PLACEHOLDER_EMBED,
    videoThumbnail: '/images/member-02-video.svg',
    videoTitle: {
      pt: 'A geometria que não envelhece',
      en: 'The geometry that never ages',
      ar: 'الهندسة التي لا تشيخ',
    },
    videoDescription: {
      pt: 'De uma gelosia de madeira a uma interface: o caminho de um padrão de oito pontas.',
      en: 'From a wooden lattice to an interface: the journey of an eight-point pattern.',
      ar: 'من روشان خشبي إلى واجهة رقمية: رحلة نجمة ثمانية.',
    },
    gallery: [
      '/images/member-02-gallery-01.svg',
      '/images/member-02-gallery-02.svg',
      '/images/member-02-gallery-03.svg',
    ],
    socialLinks: {
      instagram: 'https://www.instagram.com/',
      youtube: '',
      linkedin: 'https://www.linkedin.com/',
      x: 'https://x.com/',
    },
  },

  {
    id: 3,
    number: '03',
    name: 'Khalid Bin Omar',
    arabicName: 'خالد بن عمر',
    role: {
      pt: 'Análise e Inteligência de Dados',
      en: 'Analysis and Data Intelligence',
      ar: 'التحليل وذكاء البيانات',
    },
    location: { pt: 'Dammam, Arábia Saudita', en: 'Dammam, Saudi Arabia', ar: 'الدمام، السعودية' },
    portrait: '/images/ai/portrait-03.webp',
    backgroundImage: '/images/ai/backdrop-01.webp',
    shortDescription: {
      pt: 'O silêncio do conselho. Fala pouco, mas nenhuma decisão importante é tomada sem os números dele.',
      en: 'The quiet one. He speaks little, yet no major decision is taken without his numbers.',
      ar: 'صوت المجلس الهادئ. يتكلم قليلًا، لكن لا قرار كبير يُتخذ دون أرقامه.',
    },
    biography: {
      pt: 'Khalid vem de Dammam, onde a indústria ensina cedo que uma variável ignorada custa caro. Estudou estatística e passou seis anos construindo modelos de previsão antes de aceitar qualquer cargo público. Tem obsessão por dados honestos e desconfia de qualquer gráfico bonito demais. É ele quem interrompe a reunião quando a narrativa começa a se afastar da evidência.',
      en: 'Khalid comes from Dammam, where industry teaches early that one ignored variable is expensive. He studied statistics and spent six years building forecasting models before accepting any public role. He is obsessed with honest data and distrusts any chart that looks too beautiful. He is the one who stops a meeting when the narrative starts drifting from the evidence.',
      ar: 'جاء خالد من الدمام، حيث تعلّم مبكرًا أن متغيّرًا واحدًا مهملًا يكلّف كثيرًا. درس الإحصاء وأمضى ست سنوات في بناء نماذج التنبؤ قبل أن يقبل أي منصب. مهووس بالبيانات الصادقة، ويرتاب في أي رسم بياني جميل أكثر من اللازم. هو من يوقف الاجتماع حين تبتعد الرواية عن الدليل.',
    },
    previousPlaces: ['Eastern Province Data Center', 'Gulf Performance Group', 'Saudi Champions'],
    timeline: [
      {
        year: '2018',
        title: { pt: 'Modelos preditivos', en: 'Predictive models', ar: 'النماذج التنبؤية' },
        description: {
          pt: 'Publica o primeiro modelo aberto de previsão de desempenho do Golfo.',
          en: 'Publishes the first open performance-forecasting model in the Gulf.',
          ar: 'نشر أول نموذج مفتوح للتنبؤ بالأداء في الخليج.',
        },
      },
      {
        year: '2021',
        title: { pt: 'Sala de comando', en: 'Command room', ar: 'غرفة القيادة' },
        description: {
          pt: 'Monta a central de dados que hoje sustenta as decisões do conselho.',
          en: 'Builds the data centre that now underpins the council decisions.',
          ar: 'أنشأ مركز البيانات الذي يسند قرارات المجلس اليوم.',
        },
      },
      {
        year: '2023',
        title: { pt: 'Reconhecimento', en: 'Recognition', ar: 'التقدير' },
        description: {
          pt: 'Método citado em duas publicações científicas internacionais.',
          en: 'Method cited in two international scientific publications.',
          ar: 'مُنهجه مُستشهد به في بحثين علميين دوليين.',
        },
      },
      {
        year: '2026',
        title: { pt: 'Modelo aberto', en: 'Open model', ar: 'نموذج مفتوح' },
        description: {
          pt: 'Libera a base analítica do conselho para universidades da região.',
          en: 'Opens the council analytics base to universities across the region.',
          ar: 'أتاح القاعدة التحليلية للمجلس لجامعات المنطقة.',
        },
      },
    ],
    achievements: {
      pt: [
        'Modelo preditivo com 91% de acerto em três temporadas',
        'Duas citações científicas internacionais',
        'Mentor de dezenove analistas em formação',
      ],
      en: [
        'Predictive model with 91% accuracy over three seasons',
        'Two international scientific citations',
        'Mentor to nineteen analysts in training',
      ],
      ar: [
        'نموذج تنبؤي بدقة 91% عبر ثلاثة مواسم',
        'استشهادان علميان دوليان',
        'مرشد لتسعة عشر محللًا قيد التدريب',
      ],
    },
    videoType: 'x',
    videoUrl: PLACEHOLDER_EMBED,
    videoThumbnail: '/images/member-03-video.svg',
    videoTitle: {
      pt: 'Tudo o que os números não dizem',
      en: 'Everything numbers do not say',
      ar: 'كل ما لا تقوله الأرقام',
    },
    videoDescription: {
      pt: 'Um analista explica por que confia mais na dúvida do que na certeza.',
      en: 'An analyst explains why he trusts doubt more than certainty.',
      ar: 'محلل يشرح لماذا يثق بالشك أكثر من اليقين.',
    },
    gallery: [
      '/images/member-03-gallery-01.svg',
      '/images/member-03-gallery-02.svg',
      '/images/member-03-gallery-03.svg',
    ],
    socialLinks: {
      instagram: '',
      youtube: 'https://www.youtube.com/',
      linkedin: 'https://www.linkedin.com/',
      x: 'https://x.com/',
    },
  },

  {
    id: 4,
    number: '04',
    name: 'Layla Al-Mansour',
    arabicName: 'ليلى المنصور',
    role: {
      pt: 'Engenharia e Tecnologia',
      en: 'Engineering and Technology',
      ar: 'الهندسة والتقنية',
    },
    location: { pt: 'NEOM, Arábia Saudita', en: 'NEOM, Saudi Arabia', ar: 'نيوم، السعودية' },
    portrait: '/images/ai/portrait-04.webp',
    backgroundImage: '/images/ai/backdrop-02.webp',
    shortDescription: {
      pt: 'Constrói a infraestrutura que sustenta tudo. Se algo do conselho funciona sozinho, foi ela quem projetou.',
      en: 'She builds the infrastructure behind everything. If something in the council runs on its own, she designed it.',
      ar: 'تبني البنية التي تحمل كل شيء. إن عمل شيء في المجلس وحده، فهي من صمّمه.',
    },
    biography: {
      pt: 'Layla entrou na engenharia por teimosia e ficou por vocação. Trabalhou em sistemas de energia no norte do país antes de se mudar para NEOM, onde lidera a arquitetura técnica do conselho. Defende que tecnologia sem manutenção é apenas promessa, e por isso documenta cada decisão com o mesmo cuidado que aplica ao código. Fora do trabalho, restaura instrumentos de navegação antigos.',
      en: 'Layla entered engineering out of stubbornness and stayed out of vocation. She worked on energy systems in the north of the country before moving to NEOM, where she leads the council technical architecture. She argues that technology without maintenance is only a promise, so she documents every decision with the same care she applies to code. Outside work, she restores antique navigation instruments.',
      ar: 'دخلت ليلى الهندسة عنادًا وبقيت فيها شغفًا. عملت في أنظمة الطاقة شمال البلاد قبل انتقالها إلى نيوم، حيث تقود البنية التقنية للمجلس. ترى أن التقنية بلا صيانة مجرد وعد، لذا توثّق كل قرار بالعناية نفسها التي تكتب بها الكود. وخارج العمل، ترمّم أدوات ملاحة قديمة.',
    },
    previousPlaces: ['NEOM Tech', 'Tabuk Energy Systems', 'KAUST Robotics Lab', 'Vision Lab 2030'],
    timeline: [
      {
        year: '2017',
        title: { pt: 'Laboratório', en: 'Laboratory', ar: 'المختبر' },
        description: {
          pt: 'Pesquisa em robótica aplicada durante a graduação em Thuwal.',
          en: 'Applied robotics research during her degree in Thuwal.',
          ar: 'أبحاث في الروبوتات التطبيقية أثناء دراستها في ثول.',
        },
      },
      {
        year: '2020',
        title: { pt: 'Energia no norte', en: 'Energy in the north', ar: 'الطاقة في الشمال' },
        description: {
          pt: 'Coordena a operação de uma rede solar que atende sete mil pessoas.',
          en: 'Coordinates a solar grid serving seven thousand people.',
          ar: 'نسّقت شبكة شمسية تخدم سبعة آلاف شخص.',
        },
      },
      {
        year: '2023',
        title: { pt: 'Arquitetura do conselho', en: 'Council architecture', ar: 'بنية المجلس' },
        description: {
          pt: 'Projeta a plataforma interna usada pelos seis integrantes.',
          en: 'Designs the internal platform used by all six members.',
          ar: 'صمّمت المنصة الداخلية التي يستخدمها الأعضاء الستة.',
        },
      },
      {
        year: '2025',
        title: { pt: 'Patente registrada', en: 'Patent filed', ar: 'براءة اختراع' },
        description: {
          pt: 'Registra um sistema de refrigeração passiva para climas áridos.',
          en: 'Files a passive cooling system for arid climates.',
          ar: 'سجّلت نظام تبريد سلبي للمناخات الجافة.',
        },
      },
    ],
    achievements: {
      pt: [
        'Patente de refrigeração passiva para clima desértico',
        'Plataforma interna com 99,9% de disponibilidade',
        'Menção de excelência técnica em conferência internacional',
      ],
      en: [
        'Passive cooling patent for desert climate',
        'Internal platform with 99.9% availability',
        'Technical excellence mention at an international conference',
      ],
      ar: [
        'براءة اختراع لتبريد سلبي في مناخ الصحراء',
        'منصة داخلية بجاهزية 99.9%',
        'تنويه بالتميّز التقني في مؤتمر دولي',
      ],
    },
    videoType: 'x',
    videoUrl: PLACEHOLDER_EMBED,
    videoThumbnail: '/images/member-04-video.svg',
    videoTitle: {
      pt: 'Engenharia para durar cem anos',
      en: 'Engineering built to last a century',
      ar: 'هندسة تدوم مئة عام',
    },
    videoDescription: {
      pt: 'Entre painéis solares e areia, a rotina de quem projeta pensando em quem virá depois.',
      en: 'Between solar panels and sand, the routine of someone designing for whoever comes next.',
      ar: 'بين الألواح الشمسية والرمل، يوميات من تصمّم لمن يأتي بعدها.',
    },
    gallery: [
      '/images/member-04-gallery-01.svg',
      '/images/member-04-gallery-02.svg',
      '/images/member-04-gallery-03.svg',
    ],
    socialLinks: {
      instagram: 'https://www.instagram.com/',
      youtube: 'https://www.youtube.com/',
      linkedin: 'https://www.linkedin.com/',
      x: '',
    },
  },

  {
    id: 5,
    number: '05',
    name: 'Tariq Al-Harbi',
    arabicName: 'طارق الحربي',
    role: { pt: 'Operações e Logística', en: 'Operations and Logistics', ar: 'العمليات واللوجستيات' },
    location: { pt: 'AlUla, Arábia Saudita', en: 'AlUla, Saudi Arabia', ar: 'العلا، السعودية' },
    portrait: '/images/ai/portrait-05.webp',
    backgroundImage: '/images/ai/backdrop-01.webp',
    shortDescription: {
      pt: 'O guardião da execução. Nenhuma promessa do conselho vira realidade sem passar pelas mãos dele.',
      en: 'The guardian of execution. No council promise becomes real without passing through his hands.',
      ar: 'حارس التنفيذ. لا وعد من المجلس يتحقق دون أن يمرّ بين يديه.',
    },
    biography: {
      pt: 'Tariq nasceu em AlUla, entre rochas de arenito e caravanas que atravessam o vale há séculos. Aprendeu logística observando o pai organizar expedições no deserto: água, tempo e confiança, nessa ordem. Hoje coordena operações complexas com a mesma lógica. É conhecido por chegar duas horas antes de todos e por nunca ter perdido um prazo.',
      en: 'Tariq was born in AlUla, among sandstone cliffs and caravans that have crossed the valley for centuries. He learned logistics watching his father organise desert expeditions: water, time and trust, in that order. Today he coordinates complex operations with the same logic. He is known for arriving two hours before everyone else and for never having missed a deadline.',
      ar: 'وُلد طارق في العلا، بين صخور الحجر الرملي وقوافل عبرت الوادي منذ قرون. تعلّم اللوجستيات وهو يراقب والده ينظّم رحلات الصحراء: الماء ثم الوقت ثم الثقة. واليوم ينسّق عمليات معقدة بالمنطق نفسه. يُعرف بوصوله قبل الجميع بساعتين، وبأنه لم يفوّت موعدًا قط.',
    },
    previousPlaces: ['AlUla Expeditions', 'Royal Commission Logistics', 'Red Sea Global'],
    timeline: [
      {
        year: '2015',
        title: { pt: 'Caravanas', en: 'Caravans', ar: 'القوافل' },
        description: {
          pt: 'Organiza expedições no vale de AlUla ao lado do pai.',
          en: 'Organises expeditions in the AlUla valley alongside his father.',
          ar: 'نظّم رحلات في وادي العلا إلى جانب والده.',
        },
      },
      {
        year: '2019',
        title: { pt: 'Grandes eventos', en: 'Large events', ar: 'الفعاليات الكبرى' },
        description: {
          pt: 'Assume a logística de eventos com público de até vinte mil pessoas.',
          en: 'Takes on logistics for events with audiences of up to twenty thousand.',
          ar: 'تولّى لوجستيات فعاليات بجمهور يصل إلى عشرين ألفًا.',
        },
      },
      {
        year: '2022',
        title: { pt: 'Conselho', en: 'Council', ar: 'المجلس' },
        description: {
          pt: 'Estrutura o método operacional que o ARABIA GANG usa até hoje.',
          en: 'Structures the operational method ARABIA GANG still uses today.',
          ar: 'وضع المنهج التشغيلي الذي ما زال المجلس يستخدمه.',
        },
      },
      {
        year: '2024',
        title: { pt: 'Operação internacional', en: 'International operation', ar: 'عملية دولية' },
        description: {
          pt: 'Coordena a primeira operação do conselho fora da Península.',
          en: 'Coordinates the first council operation outside the Peninsula.',
          ar: 'نسّق أول عملية للمجلس خارج شبه الجزيرة.',
        },
      },
    ],
    achievements: {
      pt: [
        'Nenhum prazo perdido em nove anos de operação',
        'Protocolo de segurança adotado por três organizações',
        'Coordenação de evento com vinte mil participantes',
      ],
      en: [
        'No missed deadline in nine years of operation',
        'Safety protocol adopted by three organisations',
        'Coordination of an event with twenty thousand attendees',
      ],
      ar: [
        'لم يفوّت موعدًا خلال تسع سنوات من العمل',
        'بروتوكول سلامة اعتمدته ثلاث منظمات',
        'تنسيق فعالية بعشرين ألف مشارك',
      ],
    },
    videoType: 'x',
    videoUrl: PLACEHOLDER_EMBED,
    videoThumbnail: '/images/member-05-video.svg',
    videoTitle: {
      pt: 'Água, tempo e confiança',
      en: 'Water, time and trust',
      ar: 'الماء والوقت والثقة',
    },
    videoDescription: {
      pt: 'A lição de caravana que virou método de operação em três países.',
      en: 'The caravan lesson that became an operating method in three countries.',
      ar: 'درس القافلة الذي صار منهج عمل في ثلاث دول.',
    },
    gallery: [
      '/images/member-05-gallery-01.svg',
      '/images/member-05-gallery-02.svg',
      '/images/member-05-gallery-03.svg',
    ],
    socialLinks: {
      instagram: 'https://www.instagram.com/',
      youtube: '',
      linkedin: 'https://www.linkedin.com/',
      x: '',
    },
  },

  {
    id: 6,
    number: '06',
    name: 'Salma Al-Qahtani',
    arabicName: 'سلمى القحطاني',
    role: {
      pt: 'Relações Globais e Diplomacia',
      en: 'Global Relations and Diplomacy',
      ar: 'العلاقات الدولية والدبلوماسية',
    },
    location: { pt: 'Riade · Dubai', en: 'Riyadh · Dubai', ar: 'الرياض · دبي' },
    portrait: '/images/ai/portrait-06.webp',
    backgroundImage: '/images/ai/backdrop-02.webp',
    shortDescription: {
      pt: 'A voz do conselho fora da Península. Abre portas que não estavam no mapa.',
      en: 'The voice of the council beyond the Peninsula. She opens doors that were never on the map.',
      ar: 'صوت المجلس خارج شبه الجزيرة. تفتح أبوابًا لم تكن على الخريطة.',
    },
    biography: {
      pt: 'Salma fala quatro idiomas e ouve em todos eles. Passou seis anos entre Riade e Dubai negociando acordos culturais antes de se juntar ao conselho, e trouxe consigo uma rede que atravessa oito fusos horários. Acredita que diplomacia é sobretudo memória: lembrar o nome, o contexto e a promessa feita há dois anos. É quem transforma uma reunião de cortesia em parceria de década.',
      en: 'Salma speaks four languages and listens in all of them. She spent six years between Riyadh and Dubai negotiating cultural agreements before joining the council, bringing with her a network spanning eight time zones. She believes diplomacy is above all memory: remembering the name, the context and the promise made two years ago. She is the one who turns a courtesy meeting into a decade-long partnership.',
      ar: 'تتحدث سلمى أربع لغات وتصغي بها جميعًا. أمضت ست سنوات بين الرياض ودبي تتفاوض على اتفاقيات ثقافية قبل انضمامها للمجلس، وجلبت معها شبكة تمتد عبر ثماني مناطق زمنية. ترى أن الدبلوماسية ذاكرة قبل كل شيء: تذكّر الاسم والسياق والوعد الذي قُطع قبل عامين. هي من تحوّل لقاء مجاملة إلى شراكة لعقد كامل.',
    },
    previousPlaces: ['Gulf Cultural Bureau', 'Dubai Expo Delegation', 'Riyadh Season Partnerships'],
    timeline: [
      {
        year: '2018',
        title: { pt: 'Primeira delegação', en: 'First delegation', ar: 'أول وفد' },
        description: {
          pt: 'Integra a delegação cultural saudita em três países europeus.',
          en: 'Joins the Saudi cultural delegation across three European countries.',
          ar: 'انضمت إلى الوفد الثقافي السعودي في ثلاث دول أوروبية.',
        },
      },
      {
        year: '2021',
        title: { pt: 'Acordos culturais', en: 'Cultural agreements', ar: 'اتفاقيات ثقافية' },
        description: {
          pt: 'Negocia sete acordos de intercâmbio entre instituições do Golfo e da Ásia.',
          en: 'Negotiates seven exchange agreements between Gulf and Asian institutions.',
          ar: 'تفاوضت على سبع اتفاقيات تبادل بين مؤسسات خليجية وآسيوية.',
        },
      },
      {
        year: '2023',
        title: { pt: 'Entrada no conselho', en: 'Joins the council', ar: 'الانضمام إلى المجلس' },
        description: {
          pt: 'Abre a frente internacional do ARABIA GANG em quatro mercados.',
          en: 'Opens the ARABIA GANG international front across four markets.',
          ar: 'فتحت الجبهة الدولية للمجلس في أربعة أسواق.',
        },
      },
      {
        year: '2026',
        title: { pt: 'Aliança global', en: 'Global alliance', ar: 'تحالف عالمي' },
        description: {
          pt: 'Fecha a maior parceria da história do conselho, em três continentes.',
          en: 'Closes the largest partnership in the council history, across three continents.',
          ar: 'أبرمت أكبر شراكة في تاريخ المجلس عبر ثلاث قارات.',
        },
      },
    ],
    achievements: {
      pt: [
        'Sete acordos internacionais negociados',
        'Parcerias ativas em três continentes',
        'Reconhecimento diplomático por cooperação cultural (2024)',
      ],
      en: [
        'Seven international agreements negotiated',
        'Active partnerships across three continents',
        'Diplomatic recognition for cultural cooperation (2024)',
      ],
      ar: [
        'سبع اتفاقيات دولية تم التفاوض عليها',
        'شراكات فاعلة في ثلاث قارات',
        'تكريم دبلوماسي للتعاون الثقافي (2024)',
      ],
    },
    videoType: 'x',
    videoUrl: PLACEHOLDER_EMBED,
    videoThumbnail: '/images/member-06-video.svg',
    videoTitle: {
      pt: 'A arte de lembrar nomes',
      en: 'The art of remembering names',
      ar: 'فنّ تذكّر الأسماء',
    },
    videoDescription: {
      pt: 'Quatro idiomas, oito fusos e uma regra: nunca prometa o que não pode sustentar.',
      en: 'Four languages, eight time zones and one rule: never promise what you cannot sustain.',
      ar: 'أربع لغات وثماني مناطق زمنية وقاعدة واحدة: لا تعِد بما لا تستطيع حمله.',
    },
    gallery: [
      '/images/member-06-gallery-01.svg',
      '/images/member-06-gallery-02.svg',
      '/images/member-06-gallery-03.svg',
    ],
    socialLinks: {
      instagram: 'https://www.instagram.com/',
      youtube: 'https://www.youtube.com/',
      linkedin: 'https://www.linkedin.com/',
      x: 'https://x.com/',
    },
  },

  {
    id: 7,
    number: '07',
    name: 'Yousef Al-Otaibi',
    arabicName: 'يوسف العتيبي',
    role: { pt: 'Academia e Formação', en: 'Academy and Development', ar: 'الأكاديمية والتطوير' },
    location: { pt: 'Riade, Arábia Saudita', en: 'Riyadh, Saudi Arabia', ar: 'الرياض، السعودية' },
    portrait: '/images/ai/portrait-07.webp',
    backgroundImage: '/images/ai/backdrop-01.webp',
    shortDescription: {
      pt: 'O mais jovem do conselho e o responsável por quem vem depois. Formou mais gente do que qualquer outro integrante.',
      en: 'The youngest of the council and the one responsible for whoever comes next. He has trained more people than any other member.',
      ar: 'أصغر أعضاء المجلس، والمسؤول عمّن يأتي بعده. درّب من الناس أكثر من أي عضو آخر.',
    },
    biography: {
      pt: 'Yousef foi aluno antes de ser conselheiro: entrou no primeiro programa de formação aos dezenove anos e não saiu mais. Estudou pedagogia e passou quatro anos em quadras, laboratórios e salas emprestadas, testando como se ensina alguém a decidir sob pressão. Defende que talento sem estrutura se perde em dois anos, e por isso mede tudo o que faz. É a memória viva do método do conselho.',
      en: 'Yousef was a student before he was a councillor: he joined the first training programme at nineteen and never left. He studied education and spent four years in courts, laboratories and borrowed rooms, testing how you teach someone to decide under pressure. He argues that talent without structure is lost within two years, so he measures everything he does. He is the living memory of the council method.',
      ar: 'كان يوسف طالبًا قبل أن يصبح عضوًا في المجلس: التحق بأول برنامج تدريبي في التاسعة عشرة ولم يغادر. درس التربية وأمضى أربع سنوات في الملاعب والمختبرات وقاعات مُستعارة يختبر كيف يُعلَّم المرء أن يقرر تحت الضغط. يرى أن الموهبة بلا بنية تضيع خلال عامين، لذا يقيس كل ما يفعله. وهو الذاكرة الحيّة لمنهج المجلس.',
    },
    previousPlaces: ['Riyadh Youth Academy', 'Vision Lab 2030', 'Saudi Champions League'],
    timeline: [
      {
        year: '2019',
        title: { pt: 'Do outro lado da sala', en: 'The other side of the room', ar: 'الجهة الأخرى من القاعة' },
        description: {
          pt: 'Entra como aluno no primeiro programa de formação do conselho.',
          en: 'Joins the first council training programme as a student.',
          ar: 'التحق طالبًا في أول برنامج تدريبي للمجلس.',
        },
      },
      {
        year: '2022',
        title: { pt: 'Primeira turma', en: 'First cohort', ar: 'الدفعة الأولى' },
        description: {
          pt: 'Assume a coordenação da academia e forma trinta e dois alunos.',
          en: 'Takes over the academy and trains thirty-two students.',
          ar: 'تولّى الأكاديمية ودرّب اثنين وثلاثين طالبًا.',
        },
      },
      {
        year: '2024',
        title: { pt: 'Método publicado', en: 'Published method', ar: 'منهج منشور' },
        description: {
          pt: 'Publica o currículo de formação usado hoje por escolas parceiras.',
          en: 'Publishes the training curriculum now used by partner schools.',
          ar: 'نشر منهج التدريب الذي تستخدمه اليوم مدارس شريكة.',
        },
      },
      {
        year: '2026',
        title: { pt: 'Cadeira no conselho', en: 'A seat at the council', ar: 'مقعد في المجلس' },
        description: {
          pt: 'Torna-se o oitavo integrante, sete anos depois de entrar como aluno.',
          en: 'Becomes the eighth member, seven years after arriving as a student.',
          ar: 'أصبح العضو الثامن بعد سبع سنوات من دخوله طالبًا.',
        },
      },
    ],
    achievements: {
      pt: [
        'Cento e quatro alunos formados em quatro turmas',
        'Currículo adotado por seis escolas parceiras',
        'Taxa de permanência de 88% no programa de formação',
      ],
      en: [
        'One hundred and four students trained across four cohorts',
        'Curriculum adopted by six partner schools',
        'An 88% retention rate in the training programme',
      ],
      ar: [
        'مئة وأربعة طلاب تخرّجوا في أربع دفعات',
        'منهج اعتمدته ست مدارس شريكة',
        'نسبة استمرار 88% في برنامج التدريب',
      ],
    },
    videoType: 'x',
    videoUrl: PLACEHOLDER_EMBED,
    videoThumbnail: '/images/member-07-video.svg',
    videoTitle: {
      pt: 'Ensinar é devolver',
      en: 'To teach is to give back',
      ar: 'أن تُعلّم هو أن تردّ الجميل',
    },
    videoDescription: {
      pt: 'O aluno que virou conselheiro volta à sala onde tudo começou.',
      en: 'The student who became a councillor returns to the room where it all began.',
      ar: 'الطالب الذي صار عضوًا يعود إلى القاعة التي بدأ منها كل شيء.',
    },
    gallery: [
      '/images/member-07-gallery-01.svg',
      '/images/member-07-gallery-02.svg',
      '/images/member-07-gallery-03.svg',
    ],
    socialLinks: {
      instagram: 'https://www.instagram.com/',
      youtube: 'https://www.youtube.com/',
      linkedin: 'https://www.linkedin.com/',
      x: '',
    },
  },

  {
    id: 8,
    number: '08',
    name: 'Hessa Al-Dosari',
    arabicName: 'حصة الدوسري',
    role: { pt: 'Narrativa e Comunicação', en: 'Narrative and Communication', ar: 'السرد والتواصل' },
    location: { pt: 'Jeddah, Arábia Saudita', en: 'Jeddah, Saudi Arabia', ar: 'جدة، السعودية' },
    portrait: '/images/ai/portrait-08.webp',
    backgroundImage: '/images/ai/backdrop-02.webp',
    shortDescription: {
      pt: 'Guarda as histórias do conselho e decide como cada uma é contada. Nada sai daqui sem passar por ela.',
      en: 'She keeps the council stories and decides how each one is told. Nothing leaves here without passing through her.',
      ar: 'تحفظ حكايات المجلس وتقرر كيف تُروى كل واحدة. لا شيء يخرج من هنا دون أن يمرّ بها.',
    },
    biography: {
      pt: 'Hessa começou como repórter de bairro em Jeddah, cobrindo o que ninguém queria cobrir, e aprendeu que toda história tem uma versão mais honesta escondida sob a primeira. Trabalhou em redações e documentários antes de assumir a narrativa do conselho. Escreve rápido, corta sem dó e recusa qualquer frase que soe maior do que o fato. É quem garante que o conselho seja lembrado pelo que fez, não pelo que anunciou.',
      en: 'Hessa started as a neighbourhood reporter in Jeddah, covering what nobody else wanted, and learned that every story hides a more honest version beneath the first. She worked in newsrooms and documentaries before taking charge of the council narrative. She writes fast, cuts without mercy and refuses any sentence that sounds larger than the fact. She is the one who makes sure the council is remembered for what it did, not for what it announced.',
      ar: 'بدأت حصة مراسلة أحياء في جدة، تغطي ما لا يريد أحد تغطيته، وتعلّمت أن لكل حكاية نسخة أصدق تختبئ تحت الأولى. عملت في غرف الأخبار والأفلام الوثائقية قبل أن تتولى سرد المجلس. تكتب بسرعة، وتحذف بلا رحمة، وترفض أي جملة تبدو أكبر من الواقعة. هي من تضمن أن يُذكر المجلس بما فعل، لا بما أعلن.',
    },
    previousPlaces: ['Jeddah Daily', 'Red Sea Studios', 'Gulf Documentary Unit'],
    timeline: [
      {
        year: '2016',
        title: { pt: 'Repórter de bairro', en: 'Neighbourhood reporter', ar: 'مراسلة الأحياء' },
        description: {
          pt: 'Cobre o cotidiano de Jeddah para um jornal local.',
          en: 'Covers everyday life in Jeddah for a local paper.',
          ar: 'غطّت الحياة اليومية في جدة لصحيفة محلية.',
        },
      },
      {
        year: '2020',
        title: { pt: 'Primeiro documentário', en: 'First documentary', ar: 'أول فيلم وثائقي' },
        description: {
          pt: 'Dirige um curta sobre pescadores do Mar Vermelho, premiado no Golfo.',
          en: 'Directs a short about Red Sea fishermen, awarded across the Gulf.',
          ar: 'أخرجت فيلمًا قصيرًا عن صيادي البحر الأحمر، نال جوائز خليجية.',
        },
      },
      {
        year: '2023',
        title: { pt: 'A voz do conselho', en: 'The council voice', ar: 'صوت المجلس' },
        description: {
          pt: 'Assume a narrativa e reescreve toda a comunicação do grupo.',
          en: 'Takes over the narrative and rewrites all of the group communication.',
          ar: 'تولّت السرد وأعادت كتابة تواصل المجموعة بالكامل.',
        },
      },
      {
        year: '2026',
        title: { pt: 'Arquivo vivo', en: 'A living archive', ar: 'أرشيف حيّ' },
        description: {
          pt: 'Abre o arquivo audiovisual do conselho ao público pela primeira vez.',
          en: 'Opens the council film archive to the public for the first time.',
          ar: 'فتحت أرشيف المجلس المرئي للجمهور لأول مرة.',
        },
      },
    ],
    achievements: {
      pt: [
        'Curta-metragem premiado em dois festivais do Golfo',
        'Arquivo de mais de duzentas horas de material documentado',
        'Responsável pela identidade narrativa dos oito perfis',
      ],
      en: [
        'Short film awarded at two Gulf festivals',
        'An archive of over two hundred hours of documented material',
        'Behind the narrative identity of all eight profiles',
      ],
      ar: [
        'فيلم قصير حائز على جوائز في مهرجانين خليجيين',
        'أرشيف يتجاوز مئتي ساعة من المواد الموثقة',
        'وراء الهوية السردية للملفات الثمانية',
      ],
    },
    videoType: 'x',
    videoUrl: PLACEHOLDER_EMBED,
    videoThumbnail: '/images/member-08-video.svg',
    videoTitle: {
      pt: 'A versão honesta',
      en: 'The honest version',
      ar: 'النسخة الصادقة',
    },
    videoDescription: {
      pt: 'Como se conta a história de oito pessoas sem inventar nenhuma delas.',
      en: 'How you tell the story of eight people without inventing any of them.',
      ar: 'كيف تروي حكاية ثمانية أشخاص دون أن تخترع أيًا منهم.',
    },
    gallery: [
      '/images/member-08-gallery-01.svg',
      '/images/member-08-gallery-02.svg',
      '/images/member-08-gallery-03.svg',
    ],
    socialLinks: {
      instagram: 'https://www.instagram.com/',
      youtube: '',
      linkedin: 'https://www.linkedin.com/',
      x: 'https://x.com/',
    },
  },
];

export default members;
