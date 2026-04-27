import { Language } from './config';

/** Clarify hamburger “account” block (signed-in / plan / sign out). */
export interface ClarifyWorkspaceMenu {
  accountHeader: string;
  signIn: string;
  signOut: string;
  free: string;
  pro: string;
  proPlus: string;
}

export interface TranslationDictionary {
  // Header/Navigation
  header: {
    about: string;
    faq: string;
    account: string;
    plan: string;
    privacy: string;
    terms: string;
    contact: string;
    signIn: string;
    signOut: string;
  };
  
  // Homepage Hero
  hero: {
    badge: string;
    title: string[];
    subtitle: string;
    homeTagline: string;
    tryCta: string;
    enterVirekaSpace: string;
    clarifyButton: string;
    aiButton: string;
    developedBy: string;
    basedOn: string;
  };
  
  // Footer
  footer: {
    privacy: string;
    terms: string;
    contact: string;
    copyright: string;
  };

  // App-wide navigation labels
  navigation: {
    backToHome: string;
  };

  // Sign-in page (UI shell; auth wiring comes later)
  signIn: {
    intro: string;
    continueWithEmail: string;
    continueWithGoogle: string;
    googleLoading: string;
    paidPlanNote: string;
    emailPlaceholder: string;
    sending: string;
    success: string;
    successLine2: string;
    resendLink: string;
    /** Use `"{seconds}"` placeholder for countdown (seconds remaining). */
    resendAvailableIn: string;
    useAnotherEmail: string;
    errorGeneric: string;
    couldNotSendLink: string;
  };
  
  // Settings Page
  settings: {
    backToHome: string;
    badge: string;
    title: string;
    subtitle: string;
    access: string;
    legal: string;
    account: string;
    plan: string;
    contact: string;
    privacy: string;
    terms: string;
  };
  
  // Onboarding Modal
  onboarding: {
    defaultTitle: string;
    defaultBody: {
      description: string;
      usefulWhenTitle: string;
      usefulWhenList: string[];
      beginWith: string;
      systemNote: string;
    };
    begin: string;
    notNow: string;
  };
  
  // Clarify Page
  clarify: {
    pageTitle: string;
    heroTitle: string;
    descriptionParagraph: string;
    workingPageSubtitle: string;
    inputLabel: string;
    inputPlaceholder: string;
    helperText: string;
    pageLabel: string;
    backLink: string;
    loadingText: string;
    doneButton: string;
    followupLabel: string;
    simpleAction: string;
    followupPlaceholder: string;
    followupHelper: string;
    badge: string;
    initialReflection: string;
    refinement: string;
    initialSituation: string;
    yourInput: string;
    whatAppearsToBeHappening: string;
    whatMayBeAssumed: string;
    whatMayRemainUnclear: string;
    whatMayBeInfluencingTheSituation: string;
    integratedView: string;
    howTheSituationReadsAsAWhole: string;
    currentClarity: string;
    integratedViewListen: string;
    integratedViewStopAudio: string;
    ttsCouldNotPlay: string;
    clarifyingQuestion: string;
    optional: string;
    clearEnoughForNow: string;
    clarityMarked: string;
    youMarkedThisAsClearEnough: string;
    markedClarity: string;
    theUserMarkedTheFollowing: string;
    clarificationPath: string;
    clarificationPathDescription: string;
    response: string;
    listening: string;
    transcribing: string;
    mic: string;
    copyResult: string;
    copied: string;
    couldNotCopy: string;
    pleaseEnterASituationOrResponse: string;
    speechRecognitionNotSupported: string;
    microphoneError: string;
    microphoneUnavailableTitle: string;
    usageLimitNoticeTitle: string;
    usageLimitBody: string;
    genericNoticeTitle: string;
    anUnexpectedErrorOccurred: string;
    workspaceMenu: ClarifyWorkspaceMenu;
  };

  // History (sidebar / review actions)
  history: {
    useThisClarification: string;
    startNewSituation: string;
    recents: string;
    /** Quiet label for history delete (e.g. “Delete”) */
    deleteFromHistory: string;
    deleteSituationConfirmTitle: string;
    deleteSituationConfirmDetail: string;
  };
  
  // AI Interaction Page
  aiInteraction: {
    pageTitle: string;
    heroTitle: string;
    descriptionParagraph: string;
    inputLabel: string;
    inputPlaceholder: string;
    helperText: string;
    pageLabel: string;
    backLink: string;
    loadingText: string;
    doneButton: string;
    followupLabel: string;
    simpleAction: string;
    followupHelperText: string;
    followupPlaceholder: string;
    followupHelper: string;
    badge: string;
    initialReflection: string;
    refinement: string;
    initialAIIssue: string;
    yourInput: string;
    whatAppearsToBeHappening: string;
    whatMayBeAssumed: string;
    whatMayRemainUnclear: string;
    whatMayBeInfluencingTheAIInteraction: string;
    integratedView: string;
    howTheSituationReadsAsAWhole: string;
    currentClarity: string;
    integratedViewListen: string;
    integratedViewStopAudio: string;
    ttsCouldNotPlay: string;
    clarifyingQuestion: string;
    optional: string;
    clearEnoughForNow: string;
    clarityMarked: string;
    youMarkedThisAsClearEnough: string;
    markedClarity: string;
    theUserMarkedTheFollowing: string;
    clarificationPath: string;
    clarificationPathDescription: string;
    response: string;
    listening: string;
    transcribing: string;
    mic: string;
    copyResult: string;
    copied: string;
    couldNotCopy: string;
    pleaseEnterASituationOrResponse: string;
    speechRecognitionNotSupported: string;
    microphoneError: string;
    microphoneUnavailableTitle: string;
    usageLimitNoticeTitle: string;
    usageLimitBody: string;
    genericNoticeTitle: string;
    anUnexpectedErrorOccurred: string;
  };
  
  // Account Page
  account: {
    pageTitle: string;
    pageIntro: string;
    freeUsageNoSignIn: string;
    accountRequiredForSubscription: string;
    signInAllowsSubscription: string;
    authenticationMethods: string;
    functionalityMayExpand: string;
  };
  
  // Plan Page
  plan: {
    pageTitle: string;
    pageIntro: string;
    freeAccessIncludes: string;
    dailyLimitReached: string;
    extendedAccessSubscription: string;
    subscriptionEnablesAdditional: string;
    planStructureMayEvolve: string;
    fullHistoryAvailableWithSubscription: string;
    /** Shown on the Free tier card when the user’s access is a higher plan (e.g. Pro). */
    notCurrentFreeTier: string;
    statusSection: {
      yourAccess: string;
      currentAccess: string;
      subscription: string;
      /** Shown when subscription is active and no next renewal / period end is shown. */
      renewsAutomatically: string;
      /** Quiet link to Stripe Customer Portal; active / trialing subscribers. */
      manageBilling: string;
      billingPortalError: string;
      dailyInteractions: string;
      history: string;
      perDay: string;
      historyLimited: string;
      historyFull: string;
      loading: string;
      noActiveSubscription: string;
    };
    tiers: {
      free: {
        name: string;
        features: string[];
        action: string;
      };
      pro: {
        name: string;
        features: string[];
        action: string;
      };
      proPlus: {
        name: string;
        features: string[];
        action: string;
      };
    };
  };
  
  // Contact Page
  contact: {
    pageTitle: string;
    pageIntro: string;
    feedbackHelpsImprove: string;
    messagesReviewed: string;
  };
  
  // Static Page Shell
  staticPage: {
    backToHome: string;
  };
  
  // Done State
  doneState: {
    clarityEstablished: string;
    structureSupportsClarity: string;
    copyResult: string;
    prepareForAI: string;
    aiReadyContext: string;
    aiReadyDescription: string;
    copyAIReadyContext: string;
    copied: string;
    startNewSituation: string;
    returnHome: string;
  };

  // About Page
  about: {
    pageLabel: string;
    heroTitle: string;
    subtitle: string;
    sections: {
      function: {
        title: string;
        content: string[];
      };
      effect: {
        title: string;
        content: string[];
      };
      structuralImplication: {
        title: string;
        content: string[];
      };
      orientation: {
        title: string;
        content: string[];
      };
      origin: {
        title: string;
        content: string[];
      };
    };
  };
  // FAQ Page
  faq: {
    pageLabel: string;
    heroTitle: string;
    subtitle: string;
    title: string;
    questions: {
      whatIsVirekaSpace: {
        question: string;
        answer: string[];
      };
      whatDoesItDo: {
        question: string;
        answer: string[];
      };
      providesAnswers: {
        question: string;
        answer: string[];
      };
      inputPrivacy: {
        question: string;
        answer: string[];
      };
      isAITool: {
        question: string;
        answer: string[];
      };
      worksWithAI?: {
        question: string;
        answer: string[];
      };
      whyNotUseAIDirectly: {
        question: string;
        answer: string[];
      };
      prepareForAI: {
        question: string;
        answer: string[];
      };
      whatShouldIEnter: {
        question: string;
        answer: string[];
      };
      whenShouldIUseIt: {
        question: string;
        answer: string[];
      };
      benefitOfUsingIt: {
        question: string;
        answer: string[];
      };
    };
  };

  // Privacy Page
  privacy: {
    pageLabel: string;
    heroTitle: string;
    subtitle: string;
    title: string;
    introduction: string;
    sections: {
      introduction: {
        title: string;
        content: string[];
      };
      informationProvided: {
        title: string;
        content: string[];
      };
      technicalInformation: {
        title: string;
        content: string[];
      };
      dataUsage: {
        title: string;
        content: string[];
      };
      aiProcessing: {
        title: string;
        content: string[];
      };
      thirdPartyServices: {
        title: string;
        content: string[];
      };
      userControlUpdates: {
        title: string;
        content: string[];
      };
    };
  };

  // Terms Page
  terms: {
    pageLabel: string;
    heroTitle: string;
    subtitle: string;
    title: string;
    introduction: string;
    sections: {
      introduction: {
        title: string;
        content: string[];
      };
      useOfService: {
        title: string;
        content: string[];
      };
      natureOfService: {
        title: string;
        content: string[];
      };
      userResponsibility: {
        title: string;
        content: string[];
      };
      availabilityChanges: {
        title: string;
        content: string[];
      };
      limitationOfLiability: {
        title: string;
        content: string[];
      };
      updatesToTerms: {
        title: string;
        content: string[];
      };
    };
  };
}

export interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: TranslationDictionary;
}
