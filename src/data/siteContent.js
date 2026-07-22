/**
 * Conteúdo editável do site.
 *
 * Este arquivo é apenas a SEMENTE: na primeira execução o servidor copia tudo
 * para o banco (server/data/content.db) e, a partir daí, o painel de edição
 * passa a mandar. Para voltar a este estado, use "restaurar padrão" no painel.
 *
 * Campos de texto aceitam string simples ou { pt, en, ar }.
 */
export const siteContent = {
  brand: {
    name: 'ARABIA GANG',
    // Vazio usa o emblema geometrico embutido; o painel grava a imagem aqui.
    logo: '',
    // Altura da logo no cabecalho, em pixels — ajustavel pelo painel.
    logoHeight: 44,
    arabicName: 'أرابيا',
    tagline: {
      pt: 'O Conselho dos Oito',
      en: 'The Council of Eight',
      ar: 'عصابة أرابيا',
    },
  },

  access: {
    background: '/images/ai/access.webp',
    logoPrimary: '/images/logo-primary.svg',
    logoPrimaryAlt: {
      pt: 'Emblema do conselho ARABIA GANG',
      en: 'ARABIA GANG council emblem',
      ar: 'شعار عصابة أرابيا',
    },
    logoSecondary: '/images/logo-secondary.svg',
    // Logo que atravessa a cortina de areia. Vazio usa a logo principal.
    transitionLogo: '',
    // Trilha da tela de acesso (link do YouTube). Vazio desliga a música.
    music: 'https://www.youtube.com/watch?v=8uP1k_r_M60',
    logoSecondaryAlt: {
      pt: 'Selo da casa parceira',
      en: 'Partner house seal',
      ar: 'ختم الدار الشريكة',
    },
    arabic: 'عصابة أرابيا',
    headline: {
      pt: 'Oito nomes. Uma única visão.',
      en: 'Eight names. One single vision.',
      ar: 'ثمانية أسماء. رؤية واحدة.',
    },
    subline: {
      pt: 'Você está na porta do conselho. Atravesse.',
      en: 'You are at the gate of the council. Step through.',
      ar: 'أنت عند باب المجلس. تفضّل بالدخول.',
    },
    buttonLabel: {
      pt: 'Acessar',
      en: 'Enter',
      ar: 'دخول',
    },
  },

  hero: {
    background: '/images/ai/hero.webp',
    arabic: 'ثمانية أسماء . رؤية واحدة',
    badge: {
      pt: 'Riade · Jeddah · NEOM',
      en: 'Riyadh · Jeddah · NEOM',
      ar: 'الرياض · جدة · نيوم',
    },
    titleTop: {
      pt: 'Os Oito',
      en: 'The Eight',
      ar: 'الثمانية',
    },
    titleBottom: {
      pt: 'que atravessam o deserto',
      en: 'who cross the desert',
      ar: 'الذين يعبرون الصحراء',
    },
    subtitle: {
      pt: 'Oito trajetórias formadas entre a tradição do deserto e a engenharia do futuro. Uma só visão, construída com disciplina, honra e propósito.',
      en: 'Eight paths shaped between desert tradition and the engineering of the future. One vision, built on discipline, honour and purpose.',
      ar: 'ثمانية مسارات تشكّلت بين تقاليد الصحراء وهندسة المستقبل. رؤية واحدة بُنيت على الانضباط والشرف والهدف.',
    },
    primaryCta: {
      pt: 'Conheça os integrantes',
      en: 'Meet the members',
      ar: 'تعرّف على الأعضاء',
    },
    secondaryCta: {
      pt: 'Assistir ao vídeo',
      en: 'Watch the film',
      ar: 'شاهد الفيلم',
    },
    stats: [
      {
        id: 'members',
        value: '08',
        label: { pt: 'Integrantes', en: 'Members', ar: 'أعضاء' },
      },
    ],
  },

  membersSection: {
    eyebrow: {
      pt: 'O conselho',
      en: 'The council',
      ar: 'المجلس',
    },
    title: {
      pt: 'Os Oito',
      en: 'The Eight',
      ar: 'الثمانية',
    },
    arabic: 'الثمانية',
    subtitle: {
      pt: 'Cada integrante carrega uma herança, uma disciplina e um território conquistado. Juntos, formam a estrutura completa.',
      en: 'Each member carries a heritage, a discipline and a territory of their own. Together they form the complete structure.',
      ar: 'كل عضو يحمل إرثًا وانضباطًا وميدانًا خاصًا به. ومعًا يشكّلون البنية الكاملة.',
    },
  },

  footer: {
    description: {
      pt: 'ARABIA GANG é o conselho de oito integrantes que une herança árabe, disciplina e tecnologia em uma única trajetória.',
      en: 'ARABIA GANG is the council of eight members uniting Arabian heritage, discipline and technology into a single trajectory.',
      ar: 'عصابة أرابيا يجمع الإرث العربي والانضباط والتقنية في مسار واحد.',
    },
    socialLinks: {
      instagram: 'https://www.instagram.com/',
      youtube: 'https://www.youtube.com/',
      linkedin: 'https://www.linkedin.com/',
      x: 'https://x.com/',
    },
  },
};

export default siteContent;
