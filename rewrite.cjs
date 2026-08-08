const fs = require('fs');

const fileContent = `export type Language = 'en' | 'fr' | 'ar';

export const translations = {
  en: {
    nav: {
      home: 'Home',
      websites: 'Websites',
      apps: 'Apps',
      services: 'Services',
      contact: 'Contact',
    },
    hero: {
      headline: 'I Build Websites & Apps That Help Businesses Grow.',
      subtitle: 'Modern websites, custom business apps, and digital systems that save time, attract customers, and increase revenue.',
      primaryBtn: 'View My Work',
      secondaryBtn: 'Contact Me',
    },
    sections: {
      websites: 'Websites',
      apps: 'Apps',
      services: 'Services',
      whyMe: 'Why Work With Me',
      contact: "Let's Build Something Great",
    },
    buttons: {
      visitWebsite: 'Visit Website',
      googleMaps: 'Google Maps',
      source: 'Source Code',
      liveDemo: 'Live Demo',
      clientLocation: 'Client Location',
      whatsapp: 'WhatsApp',
      email: 'Email',
      instagram: 'Instagram',
    },
    pricing: {
      oneTime: "One-time price",
      recurring: "Recurring price",
      setupAndMonthly: "Setup + Monthly",
      from: "from",
      month: "month"
    },
    services: [
      {
        title: "Normal Websites",
        price: "1,000 DH",
        priceType: "one-time",
        features: [
          "Professional, responsive websites for businesses and individuals.",
          "One-time price: 1,000 DH"
        ]
      },
      {
        title: "E-commerce Websites",
        price: "500 DH",
        priceType: "monthly",
        features: [
          "Online stores with product listings, shopping cart, ordering, and e-commerce functionality.",
          "Recurring price: 500 DH per month"
        ]
      },
      {
        title: "Web Apps",
        price: "from 3,000 DH",
        priceType: "starting-monthly",
        setupPrice: "3,000 DH",
        monthlyPrice: "1,000 DH",
        features: [
          "Custom web applications and business management systems.",
          "Development/setup starts at 3,000 DH",
          "Maintenance, hosting, updates, bug fixes, and ongoing support: 1,000 DH/month"
        ]
      },
      {
        title: "Google Maps Setup",
        price: "200 DH",
        priceType: "one-time",
        features: [
          "Google Maps / Google Business location setup and integration.",
          "One-time price: 200 DH"
        ]
      }
    ],
    whyMe: [
      {
        title: 'Custom Solutions',
        description: 'Every business gets a system designed for its own needs.',
      },
      {
        title: 'Fast Performance',
        description: 'Fast loading websites and applications.',
      },
      {
        title: 'Modern Design',
        description: 'Professional designs that build customer trust.',
      },
      {
        title: 'Always Improving',
        description: 'New features and updates whenever your business grows.',
      },
    ],
    demo: {
      title: 'Request a Free Demo',
      subtitle: 'For business owners who want to see a custom demo before becoming clients.',
      businessName: 'Business Name',
      businessNamePlaceholder: 'e.g. Acme Corp',
      ownerName: 'Owner Name',
      ownerNamePlaceholder: 'e.g. John Doe',
      googleMaps: 'Google Maps Link (Required)',
      googleMapsPlaceholder: 'https://maps.google.com/...',
      message: 'Optional Message',
      messagePlaceholder: 'Tell me a bit about your needs...',
      button: 'Request My Free Demo',
    },
    footer: {
      name: 'Sammy Arafati',
      tagline: 'Building Digital Solutions for Businesses',
      location: 'Morocco',
    },
  },
  fr: {
    nav: {
      home: 'Accueil',
      websites: 'Sites Web',
      apps: 'Applications',
      services: 'Services',
      contact: 'Contact',
    },
    hero: {
      headline: 'Je Crée des Applications & Sites Web qui Aident les Commerces à Croître.',
      subtitle: 'Des sites web modernes, des applications métiers sur mesure et des systèmes digitaux qui font gagner du temps, attirent des clients et augmentent les revenus.',
      primaryBtn: 'Voir Mon Travail',
      secondaryBtn: 'Me Contacter',
    },
    sections: {
      websites: 'Sites Web',
      apps: 'Applications',
      services: 'Services',
      whyMe: 'Pourquoi Travailler Avec Moi',
      contact: "Construisons Quelque Chose d'Exceptionnel",
    },
    buttons: {
      visitWebsite: 'Visiter le Site',
      googleMaps: 'Google Maps',
      source: 'Code Source',
      liveDemo: 'Démo en Direct',
      clientLocation: 'Localisation Client',
      whatsapp: 'WhatsApp',
      email: 'Email',
      instagram: 'Instagram',
    },
    pricing: {
      oneTime: "Prix unique",
      recurring: "Prix récurrent",
      setupAndMonthly: "Création + Mensuel",
      from: "à partir de",
      month: "mois"
    },
    services: [
      {
        title: "Sites Web Normaux",
        price: "1 000 DH",
        priceType: "one-time",
        features: [
          "Sites web professionnels et responsives pour entreprises et particuliers.",
          "Prix unique : 1 000 DH"
        ]
      },
      {
        title: "Sites E-commerce",
        price: "500 DH",
        priceType: "monthly",
        features: [
          "Boutiques en ligne avec liste de produits, panier, commande et fonctionnalités e-commerce.",
          "Prix récurrent : 500 DH par mois"
        ]
      },
      {
        title: "Applications Web",
        price: "dès 3 000 DH",
        priceType: "starting-monthly",
        setupPrice: "3 000 DH",
        monthlyPrice: "1 000 DH",
        features: [
          "Applications web sur mesure et systèmes de gestion d'entreprise.",
          "Développement/création à partir de 3 000 DH",
          "Maintenance, hébergement, mises à jour, corrections de bugs et support continu : 1 000 DH/mois"
        ]
      },
      {
        title: "Configuration Google Maps",
        price: "200 DH",
        priceType: "one-time",
        features: [
          "Configuration et intégration de Google Maps / Google Business.",
          "Prix unique : 200 DH"
        ]
      }
    ],
    whyMe: [
      {
        title: 'Solutions Sur Mesure',
        description: 'Chaque entreprise obtient un système conçu pour ses propres besoins.',
      },
      {
        title: 'Performance Rapide',
        description: 'Des sites web et des applications qui se chargent rapidement.',
      },
      {
        title: 'Design Moderne',
        description: 'Des designs professionnels qui renforcent la confiance des clients.',
      },
      {
        title: 'Toujours en Amélioration',
        description: "De nouvelles fonctionnalités et mises à jour dès que votre entreprise se développe.",
      },
    ],
    demo: {
      title: 'Demander une Démo Gratuite',
      subtitle: 'Pour les propriétaires d\'entreprise qui souhaitent voir une démo personnalisée avant de devenir clients.',
      businessName: 'Nom de l\'Entreprise',
      businessNamePlaceholder: 'ex. Acme Corp',
      ownerName: 'Nom du Propriétaire',
      ownerNamePlaceholder: 'ex. Jean Dupont',
      googleMaps: 'Lien Google Maps (Requis)',
      googleMapsPlaceholder: 'https://maps.google.com/...',
      message: 'Message Optionnel',
      messagePlaceholder: 'Parlez-moi un peu de vos besoins...',
      button: 'Demander Ma Démo Gratuite',
    },
    footer: {
      name: 'Sammy Arafati',
      tagline: 'Création de Solutions Digitales pour les Entreprises',
      location: 'Maroc',
    },
  },
  ar: {
    nav: {
      home: 'الرئيسية',
      websites: 'مواقع الويب',
      apps: 'التطبيقات',
      services: 'خدماتنا',
      contact: 'اتصل بي',
    },
    hero: {
      headline: 'أقوم ببناء تطبيقات ومواقع تساعد الأعمال على النمو.',
      subtitle: 'مواقع حديثة، وتطبيقات مخصصة وأنظمة رقمية توفر الوقت، تجذب العملاء وتزيد الإيرادات.',
      primaryBtn: 'شاهد أعمالي',
      secondaryBtn: 'تواصل معي',
    },
    sections: {
      websites: 'مواقع الويب',      apps: 'التطبيقات',      services: 'خدماتنا',      whyMe: 'لماذا العمل معي',      contact: "لنصنع شيئاً عظيماً معاً",
    },
    buttons: {
      visitWebsite: 'زيارة الموقع',
      googleMaps: 'خرائط جوجل',
      source: 'المصدر',
      liveDemo: 'عرض حي',
      clientLocation: 'موقع العميل',
      whatsapp: 'واتساب',
      email: 'البريد الإلكتروني',
      instagram: 'إنستغرام',
    },
    pricing: {
      oneTime: "دفعة واحدة",
      recurring: "سعر متكرر",
      setupAndMonthly: "إنشاء + شهري",
      from: "ابتداءً من",
      month: "شهر"
    },
    services: [
      {
        title: "مواقع الويب العادية",
        price: "1,000 درهم",
        priceType: "one-time",
        features: [
          "مواقع إلكترونية احترافية ومتجاوبة للشركات والأفراد.",
          "سعر الدفعة الواحدة: 1,000 درهم"
        ]
      },
      {
        title: "مواقع التجارة الإلكترونية",
        price: "500 درهم",
        priceType: "monthly",
        features: [
          "متاجر إلكترونية مع قوائم المنتجات، سلة المشتريات، الطلبات، وميزات التجارة الإلكترونية.",
          "سعر متكرر: 500 درهم شهرياً"
        ]
      },
      {
        title: "تطبيقات الويب",
        price: "ابتداءً من 3,000 درهم",
        priceType: "starting-monthly",
        setupPrice: "3,000 درهم",
        monthlyPrice: "1,000 درهم",
        features: [
          "تطبيقات ويب مخصصة وأنظمة إدارة الأعمال.",
          "التطوير/الإنشاء يبدأ من 3,000 درهم",
          "الصيانة، الاستضافة، التحديثات، إصلاح الأخطاء، والدعم المستمر: 1,000 درهم/شهرياً"
        ]
      },
      {
        title: "إعداد خرائط جوجل",
        price: "200 درهم",
        priceType: "one-time",
        features: [
          "إعداد ودمج خرائط جوجل / نشاطي التجاري على جوجل.",
          "سعر الدفعة الواحدة: 200 درهم"
        ]
      }
    ],
    whyMe: [
      {
        title: 'حلول مخصصة',
        description: 'كل شركة تحصل على نظام مصمم لاحتياجاتها الخاصة.',
      },
      {
        title: 'أداء سريع',
        description: 'مواقع وتطبيقات سريعة التحميل.',
      },
      {
        title: 'تصميم حديث',
        description: 'تصاميم احترافية تبني ثقة العملاء.',
      },
      {
        title: 'تطوير دائم',
        description: 'ميزات وتحديثات جديدة كلما نما عملك.',
      },
    ],
    demo: {
      title: 'اطلب عرضاً تجريبياً مجانياً',
      subtitle: 'لأصحاب الأعمال الذين يرغبون في رؤية عرض مخصص قبل أن يصبحوا عملاء.',
      businessName: 'اسم العمل',
      businessNamePlaceholder: 'مثال: شركة الأمل',
      ownerName: 'اسم المالك',
      ownerNamePlaceholder: 'مثال: أحمد محمد',
      googleMaps: 'رابط خرائط جوجل (مطلوب)',
      googleMapsPlaceholder: 'https://maps.google.com/...',
      message: 'رسالة اختيارية',      messagePlaceholder: 'أخبرني قليلاً عن احتياجاتك...',      button: 'اطلب عرضي المجاني',
    },
    footer: {
      name: 'Sammy Arafati',
      tagline: 'بناء الحلول الرقمية للشركات',
      location: 'المغرب',
    },
  },
};
`;

fs.writeFileSync('src/data/translations.ts', fileContent);
