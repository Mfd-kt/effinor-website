/**
 * Types pour le système multilingue et les données
 */

export type Lang = 'fr' | 'en' | 'ar';

export interface Dictionary {
  nav: {
    home: string;
    solutions: string;
    solutions_lighting: string;
    solutions_ventilation: string;
    solutions_irve: string;
    solutions_study: string;
    about: string;
    blog: string;
    faq: string;
    contact: string;
  };
  hero: {
    badge?: string;
    title: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  solutions: {
    title: string;
    subtitle: string;
    lighting: {
      title: string;
      description: string;
      learnMore: string;
    };
    air: {
      title: string;
      description: string;
      learnMore: string;
    };
    energy: {
      title: string;
      description: string;
      learnMore: string;
    };
    charge: {
      title: string;
      description: string;
      learnMore: string;
    };
    lightingDetail: {
      heroTitle: string;
      heroSubtitle: string;
      buildingsTitle: string;
      buildingsIndustrial: {
        title: string;
        items: string[];
      };
      buildingsTertiary: {
        title: string;
        items: string[];
      };
      buildingsAgricultural: {
        title: string;
        items: string[];
      };
      benefitsTitle: string;
      benefits: string[];
      processTitle: string;
      processSteps: {
        step1: { title: string; description: string };
        step2: { title: string; description: string };
        step3: { title: string; description: string };
        step4: { title: string; description: string };
      };
      productsTitle: string;
      productsSeeMore: string;
      ctaTitle: string;
      ctaSubtitle: string;
      ctaButton: string;
    };
  };
  why: {
    title: string;
    expertise: {
      title: string;
      description: string;
    };
    cee: {
      title: string;
      description: string;
    };
    turnkey: {
      title: string;
      description: string;
    };
    support: {
      title: string;
      description: string;
    };
  };
  process: {
    title: string;
    step1: {
      title: string;
      description: string;
    };
    step2: {
      title: string;
      description: string;
    };
    step3: {
      title: string;
      description: string;
    };
  };
  contact: {
    title: string;
    subtitle: string;
    form: {
      formTitle: string;
      estimateTitle?: string;
      estimateSubtitle?: string;
      name: string;
      company: string;
      email: string;
      phone: string;
      solution: string;
      solutionPlaceholder: string;
      needTypeLabel: string;
      needTypePlaceholder: string;
      buildingTypeLabel?: string;
      surfaceLabel?: string;
      solutionOptions: {
        none: string;
        lighting: string;
        air: string;
        energie: string;
        charge: string;
      };
      message: string;
      submit: string;
      submitting: string;
      success: string;
      error: string;
    };
  };
  footer: {
    legal: string;
    privacy: string;
    cgv: string;
    contact: string;
  };
  product: {
    addToCart: string;
    requestQuote: string;
    quoteOnly: string;
    priceHtLabel: string;
    specsTitle: string;
    featuresTitle: string;
    documentsTitle: string;
    relatedTitle: string;
    downloadDatasheet: string;
    warranty: string;
    descriptionTitle: string;
  };
  breadcrumb: {
    home: string;
    products: string;
  };
  cart: {
    title: string;
    empty: string;
    emptySubtitle?: string;
    browseProducts?: string;
    addToCart: string;
    requestQuote: string;
    remove: string;
    quantity: string;
    total: string;
    mixedCurrencies: string;
    mixedCurrenciesWarning?: string;
    mixedCurrenciesMessage?: string;
    hasQuoteOnlyMessage?: string;
    submit: string;
    submitting: string;
    success: string;
    error: string;
    formName: string;
    formEmail: string;
    formPhone: string;
    formCompany: string;
    formComment: string;
    commentLabel?: string;
    commentPlaceholder?: string;
    continueButton?: string;
  };
  checkout: {
    title: string;
    subtitle: string;
    customerTitle: string;
    deliveryTitle: string;
    address: string;
    address2: string;
    postcode: string;
    city: string;
    country: string;
    notes: string;
    notesPlaceholder: string;
    submitQuote: string;
    submitPaid: string;
    submitting: string;
    error: string;
    backToCart: string;
    deliveryRequired: string;
  };
  detailedForm: {
    title: string;
    subtitle: string;
    progress: string;
    next: string;
    previous: string;
    submit: string;
    submitting: string;
    success: string;
    error: string;
    step1: {
      title: string;
      subtitle: string;
      companyName: string;
      companyNamePlaceholder: string;
      siret: string;
      siretPlaceholder: string;
      address: string;
      addressPlaceholder: string;
      postalCode: string;
      postalCodePlaceholder: string;
      city: string;
      cityPlaceholder: string;
    };
    step2: {
      title: string;
      subtitle: string;
      titleLabel: string;
      lastName: string;
      lastNamePlaceholder: string;
      firstName: string;
      firstNamePlaceholder: string;
      function: string;
      functionPlaceholder: string;
      phone: string;
      phonePlaceholder: string;
      email: string;
      emailPlaceholder: string;
    };
    step3: {
      title: string;
      subtitle: string;
      whyInfo: string;
      whyInfoText: string;
      annualExpenseRange: string;
      selectRange: string;
      ranges: {
        'less-than-10000': string;
        '10000-50000': string;
        '50000-100000': string;
        '100000-500000': string;
        'more-than-500000': string;
      };
    };
    step4: {
      title: string;
      subtitle: string;
      infoTitle: string;
      infoText: string;
      buildingCount: string;
      selectCount: string;
      building: string;
      buildings: string;
    };
    step5: {
      title: string;
      subtitle: string;
      buildingNumber: string;
      general: {
        title: string;
        type: string;
        selectType: string;
        types: {
          entrepot: string;
          bureau: string;
          usine: string;
          commerce: string;
          autre: string;
        };
        surface: string;
        surfacePlaceholder: string;
        height: string;
        heightPlaceholder: string;
      };
      heating: {
        title: string;
        isHeated: string;
        mode: string;
        selectMode: string;
        power: string;
        powerPlaceholder: string;
        setpoint: string;
        setpointPlaceholder: string;
      };
      lighting: {
        title: string;
        neon: {
          label: string;
          count: string;
          countPlaceholder: string;
          power: string;
          powerPlaceholder: string;
        };
        doubleNeon: {
          label: string;
          count: string;
          countPlaceholder: string;
          power: string;
          powerPlaceholder: string;
        };
        halogen: {
          label: string;
          count: string;
          countPlaceholder: string;
          power: string;
          powerPlaceholder: string;
        };
      };
    };
    step6: {
      title: string;
      subtitle: string;
      companyInfo: string;
      mainContact: string;
      energyExpenses: string;
      buildingConfig: string;
      buildingDetails: string;
      confirm: string;
      submitButton: string;
    };
  };
}

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'converted' | 'archived';

export interface Lead {
  id?: string;
  created_at?: string;
  lang: Lang;
  name: string;
  email: string;
  phone: string;
  company?: string;
  message?: string;
  solution?: string;
  page?: string;
  origin?: string;
  status?: LeadStatus;
  // Champs UTM et tracking
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  gclid?: string;
  fbclid?: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
}

// Types pour les commandes
export type OrderType = 'paid' | 'quote';
export type PaymentStatus = 'pending' | 'paid' | 'quote' | 'failed' | 'refunded';
export type FulfillmentStatus = 'to_confirm' | 'to_ship' | 'shipped' | 'cancelled';
export type PaymentMethod = 'card' | 'transfer';

export interface DeliveryAddress {
  address: string;
  address2?: string;
  postcode: string;
  city: string;
  country: string;
}

export interface OrderInput {
  lang: Lang;
  customer: {
    name: string;
    email: string;
    phone: string;
    company?: string;
  };
  deliveryAddress: DeliveryAddress;
  cartItems: Array<{
    productId: string;
    sku: string | null;
    name: string;
    slug?: string;
    priceHt: number | null;
    priceCurrency: 'EUR' | 'USD';
    isQuoteOnly: boolean;
    quantity: number;
    imageUrl?: string | null;
  }>;
  notes?: string;
  paymentResult?: {
    method: PaymentMethod;
    paidAt: string;
  };
}
