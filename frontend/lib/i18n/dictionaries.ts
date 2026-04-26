import { TranslationDictionary } from './types';
import { Language } from './config';

const dictionaries: Record<Language, TranslationDictionary> = {
  en: {
    header: {
      about: 'About',
      faq: 'FAQ',
      account: 'Account',
      plan: 'Plans',
      privacy: 'Privacy',
      terms: 'Terms',
      contact: 'Contact',
      signIn: 'Sign in',
      signOut: 'Sign out',
    },
    hero: {
      badge: 'VIREKA SPACE',
      title: [
        'CLARITY BEFORE DECISION',
        'CLARITY BEFORE AI',
      ],
      subtitle: 'VIREKA Space helps distinguish what is happening from what may be assumed, so responses begin from clearer understanding.',
      homeTagline: 'What is clear carries forward',
      tryCta: 'Try VIREKA Space',
      enterVirekaSpace: 'Enter VIREKA Space',
      clarifyButton: 'Clarify a situation',
      aiButton: 'AI interaction',
      developedBy: 'Developed by Anthony Escobedo',
      basedOn: 'Based on <em>Beyond Thought: Awareness as Design Intelligence</em>',
    },
    footer: {
      privacy: 'Privacy',
      terms: 'Terms',
      contact: 'Contact',
      copyright: '© 2026 VIREKA Space',
    },
    navigation: {
      backToHome: 'Back to home',
    },
    signIn: {
      intro: 'Sign in to continue with your plan.',
      continueWithEmail: 'Continue with email',
      paidPlanNote: 'Sign-in is only required for paid access.',
      emailPlaceholder: 'Email address',
      sending: 'Sending…',
      success: 'Check your email for a sign-in link.',
      successLine2: 'Open the link to continue with VIREKA Space.',
      resendLink: 'Resend link',
      resendAvailableIn: 'Resend available in {seconds} seconds',
      useAnotherEmail: 'Use another email',
      errorGeneric:
        "We couldn’t send the sign-in link. Please try again.",
      couldNotSendLink:
        "We couldn’t send the sign-in link. Please try again.",
    },
    settings: {
      backToHome: 'Back',
      badge: 'SETTINGS',
      title: 'Settings and support',
      subtitle: 'Account access, usage information, legal pages, and contact details.',
      access: 'Access',
      legal: 'Legal',
      account: 'Account',
      plan: 'Plan',
      contact: 'Contact',
      privacy: 'Privacy',
      terms: 'Terms',
    },
    onboarding: {
      defaultTitle: 'Understanding begins with structure',
      defaultBody: {
        description: 'VIREKA Space clarifies how situations are being interpreted before conclusions guide the response.',
        usefulWhenTitle: 'Useful when:',
        usefulWhenList: [
          'meaning feels uncertain',
          'multiple interpretations seem possible',
          'a response is being considered',
          'assumptions may be shaping the situation',
          'a prompt requires a clearer starting point',
        ],
        beginWith: 'Before using AI, the structure of the situation can be seen more clearly. Start with a simple description.',
        systemNote: 'The system does not search for answers. It helps clarify how situations are being understood before they are translated into decisions or prompts.',
      },
      begin: 'Begin',
      notNow: 'Not now',
    },
    clarify: {
      pageTitle: 'Clarity',
      heroTitle: 'Clarity',
      descriptionParagraph: 'See how it’s being understood',
      workingPageSubtitle: "How it's being understood",
      inputLabel: 'Situation',
      inputPlaceholder: 'Describe what you have so far',
      helperText: 'Include anything that may help clarify the situation or where interpretation feels uncertain.',
      pageLabel: 'CLARIFY',
      backLink: 'Back',
      initialReflection: 'Initial reflection',
      refinement: 'Refinement',
      initialSituation: 'Initial situation',
      yourInput: 'Your input',
      whatAppearsToBeHappening: 'What appears to be happening',
      whatMayBeAssumed: 'What may be assumed',
      whatMayRemainUnclear: 'What may remain unclear',
      whatMayBeInfluencingTheSituation: 'What may be influencing the situation',
      integratedView: 'Integrated View',
      howTheSituationReadsAsAWhole: 'How the situation reads as a whole',
      integratedViewListen: 'Listen to integrated view',
      integratedViewStopAudio: 'Stop audio',
      ttsCouldNotPlay: "Couldn't play audio",
      clarifyingQuestion: 'Clarifying question',
      optional: 'Optional',
      suggestedQuestions: 'Suggested questions',
      clarificationPath: 'Clarification path',
      clarificationPathDescription: 'Earlier reflections can be expanded when needed, while the latest response remains visible.',
      response: 'Response',
      listening: 'Listening...',
      transcribing: 'Transcribing...',
      mic: 'Mic',
      copyResult: 'Copy result',
      copied: 'Copied',
      couldNotCopy: 'Could not copy',
      pleaseEnterASituationOrResponse: 'Please enter a situation or response.',
      speechRecognitionNotSupported: 'Speech recognition is not supported in this browser. Try Chrome, Edge, or Safari.',
      microphoneError: 'Microphone error: ',
      microphoneUnavailableTitle: 'Microphone unavailable',
      usageLimitNoticeTitle: 'Usage limit reached',
      usageLimitBody:
        'You’ve reached your limit for today. You may continue tomorrow or upgrade for extended access.',
      genericNoticeTitle: 'Notice',
      anUnexpectedErrorOccurred: 'An unexpected error occurred.',
      workspaceMenu: {
        accountHeader: 'Account',
        signIn: 'Sign in',
        signOut: 'Sign out',
        free: 'Free',
        pro: 'Pro access',
        proPlus: 'Pro+ access',
      },
      loadingText: 'Clarifying...',
      doneButton: 'Done',
      followupLabel: 'Follow-up',
      followupPlaceholder: 'Add any details',
      followupHelper: 'Additional detail may help separate observation from interpretation.',
      badge: 'CLARIFY',
      simpleAction: 'Clarify',
    },
    history: {
      useThisClarification: 'Use this clarification',
      startNewSituation: 'Start a new situation',
      recents: 'Recents',
    },
    aiInteraction: {
      pageTitle: 'AI interaction',
      heroTitle: 'See clearly before deciding what to ask AI to do',
      descriptionParagraph: 'VIREKA Space helps distinguish what appears to be happening from what may be assumed, improving clarity of interaction with AI.',
      inputLabel: 'What is happening in the AI interaction?',
      inputPlaceholder: 'Describe the prompt, the output, or what feels unclear',
      helperText: 'Include the prompt, the objective, the output, or anything that may help clarify where the interaction feels unclear.',
      pageLabel: 'AI INTERACTION',
      backLink: 'Back',
      simpleAction: 'Clarify',
      initialReflection: 'Initial reflection',
      refinement: 'Refinement',
      initialAIIssue: 'Initial AI issue',
      yourInput: 'Your input',
      whatAppearsToBeHappening: 'What appears to be happening',
      whatMayBeAssumed: 'What may be assumed',
      whatMayRemainUnclear: 'What may remain unclear',
      whatMayBeInfluencingTheAIInteraction: 'What may be influencing the AI interaction',
      integratedView: 'Integrated View',
      howTheSituationReadsAsAWhole: 'How the situation reads as a whole',
      integratedViewListen: 'Listen to integrated view',
      integratedViewStopAudio: 'Stop audio',
      ttsCouldNotPlay: "Couldn't play audio",
      clarifyingQuestion: 'Clarifying question',
      optional: 'Optional',
      suggestedQuestions: 'Suggested questions',
      clarificationPath: 'Clarification path',
      clarificationPathDescription: 'Earlier reflections can be expanded when needed, while the latest response remains visible.',
      response: 'Response',
      listening: 'Listening...',
      transcribing: 'Transcribing...',
      mic: 'Mic',
      copyResult: 'Copy result',
      copied: 'Copied',
      couldNotCopy: 'Could not copy',
      loadingText: 'Clarifying...',
      doneButton: 'Done',
      followupLabel: 'Follow-up',
      followupPlaceholder: 'Add any details',
      followupHelperText: 'Optional: Ask a follow-up question to continue the analysis.',
      followupHelper: 'Additional detail may help clarify how the AI output is being interpreted.',
      badge: 'AI INTERACTION',
      pleaseEnterASituationOrResponse: 'Please enter a situation or response.',
      speechRecognitionNotSupported: 'Speech recognition is not supported in this browser. Try Chrome, Edge, or Safari.',
      microphoneError: 'Microphone error: ',
      microphoneUnavailableTitle: 'Microphone unavailable',
      usageLimitNoticeTitle: 'Usage limit reached',
      usageLimitBody:
        'You’ve reached your limit for today. You may continue tomorrow or upgrade for extended access.',
      genericNoticeTitle: 'Notice',
      anUnexpectedErrorOccurred: 'An unexpected error occurred.',
    },
    account: {
      pageTitle: 'Account access in VIREKA Space',
      pageIntro: 'Account access becomes relevant when subscription or ongoing plan management is required.',
      freeUsageNoSignIn: 'Free usage does not currently require sign-in.',
      accountRequiredForSubscription: 'An account is only required when subscribing to extended access.',
      signInAllowsSubscription: 'Sign-in allows subscription status, usage allowances, and access continuity to be associated with the same user.',
      authenticationMethods: 'Authentication may be completed using a supported sign-in provider or email verification.',
      functionalityMayExpand: '',
    },
    plan: {
      pageTitle: 'Plans',
      pageIntro: 'Choose the level of access that fits how you use VIREKA Space.',
      freeAccessIncludes: 'Free access includes up to 10 interactions per day.',
      dailyLimitReached: 'When the daily limit is reached, usage becomes available again the following day.',
      extendedAccessSubscription: 'Users who require extended access may choose to subscribe.',
      subscriptionEnablesAdditional: 'Subscription enables additional usage beyond the daily free limit.',
      planStructureMayEvolve: 'Plan structure may evolve as the service develops.',
      fullHistoryAvailableWithSubscription: 'Full history available with subscription',
      notCurrentFreeTier: 'Not your current plan',
      statusSection: {
        yourAccess: 'Your access',
        currentAccess: 'Current access',
        subscription: 'Subscription',
        renewsAutomatically: 'Renews automatically',
        dailyInteractions: 'Daily interactions',
        history: 'History',
        perDay: 'per day',
        historyLimited: 'Limited',
        historyFull: 'Full',
        loading: 'Loading…',
        noActiveSubscription: 'No active subscription',
      },
      tiers: {
        free: {
          name: 'Free',
          features: [
            '10 interactions per day',
            'Access to 5 recent history items',
            'No sign-in required',
          ],
          action: 'Current access',
        },
        pro: {
          name: 'Pro',
          features: [
            '50 interactions per day',
            'Full history access',
            'Copy from history',
          ],
          action: 'Upgrade to Pro',
        },
        proPlus: {
          name: 'Pro+',
          features: [
            '100 interactions per day',
            'Full history access',
            'Copy from history',
            'Similar patterns across past situations',
          ],
          action: 'Coming soon',
        },
      },
    },
    contact: {
      pageTitle: 'Contact and feedback',
      pageIntro: 'Questions, feedback, and technical issues may be directed using the contact information below.',
      feedbackHelpsImprove: 'Feedback helps improve clarity, reliability, and usability over time.',
      messagesReviewed:
        'Messages are reviewed thoughtfully and contribute to ongoing refinement.',
    },
    staticPage: {
      backToHome: 'Back',
    },
    doneState: {
      clarityEstablished: 'Clarity established',
      structureSupportsClarity: 'Structure supports clearer understanding.',
      copyResult: 'Copy result',
      prepareForAI: 'Send to AI',
      aiReadyContext: 'AI-ready context',
      aiReadyDescription: 'This prepares the clarification for use in another AI system.',
      copyAIReadyContext: 'Copy AI-ready context',
      copied: 'Copied',
      startNewSituation: 'Start new situation',
      returnHome: 'Return home',
    },
    about: {
      pageLabel: 'ABOUT',
      heroTitle: 'About VIREKA Space',
      subtitle: 'Where interpretation becomes clear',
      sections: {
        function: {
          title: 'Function',
          content: [
            'VIREKA Space was developed for a point that often goes unnoticed. Before a decision is made or a prompt is written, a situation is already being interpreted. This interpretation quietly shapes what seems reasonable, what feels necessary, and what appears worth asking. While most systems move toward answers, VIREKA Space separates what the answer is based on by operating before any decision or response, making visible how the situation is being understood.',
            'Sometimes a situation feels difficult not because it is complex, but because more than one interpretation seems possible at the same time. Some parts appear clear, others uncertain, and certain assumptions may already be forming without being fully noticed. When this structure is not visible, decisions can feel forced and prompts harder to formulate.',
            'VIREKA Space offers a simple way to make this visible. It does not suggest what should be done. It makes visible how the situation is being understood. As this becomes clear, it becomes easier to see whether a decision can be made or how a prompt may begin to form.',
          ],
        },
        effect: {
          title: 'Effect',
          content: [
            'Clarity often changes the experience of a situation without changing the situation itself.',
            'As the structure of interpretation becomes visible, what once felt complex may begin to separate into distinct parts. Some elements are already clear. Others remain uncertain, but no longer feel mixed together.',
            'This does not provide answers or recommendations. It reduces the friction caused by unclear understanding, making it easier to recognize when a decision can arise or when more clarity is still needed.',
          ],
        },
        structuralImplication: {
          title: "Structural Implication",
          content: [
            'Interpretation does not only affect individual decisions. It also shapes how situations are structured before they are translated into actions, prompts, or systems.',
            'What later appears to be a technical or operational problem often begins earlier, in how the situation was understood. When that understanding is translated into a prompt or workflow, its structure is carried forward and can be amplified.',
            'VIREKA Space operates at that earlier point. By making interpretation visible before it solidifies, it becomes possible to see more clearly the initial conditions that influence outcomes.',
            'It does not direct what should be done, but makes visible the conditions that go on to guide any response, decision, or system that follows.',
            'As clarity emerges, it can be carried into AI interaction. Instead of beginning with an unclear or incomplete prompt, interaction can begin from a more stable understanding of what is actually being asked.'
          ]
        },
        orientation: {
          title: "Orientation",
          content: [],
        },
        origin: {
          title: 'Origin',
          content: [
            'VIREKA Space is inspired by the perspective developed in Beyond Thought: Awareness as Design Intelligence.',
            'It reflects an interest in how clarity emerges when the structure of a situation becomes visible before being translated into decisions, prompts, or systems.',
          ],
        },
      },
    },
    faq: {
      pageLabel: 'FAQ',
      heroTitle: 'Frequently Asked Questions',
      subtitle: 'Common questions about VIREKA Space',
      title: 'Frequently Asked Questions',
      questions: {
        whatIsVirekaSpace: {
          question: 'What is VIREKA Space?',
          answer: [
            'VIREKA Space is a structured environment for seeing how a situation is being understood. It makes visible what appears to be happening, what may be assumed, and what is still unclear, so the structure of interpretation can be seen before any action is taken.',
          ],
        },
        whatDoesItDo: {
          question: 'What does it do exactly?',
          answer: [
            'It separates what is observable, what may be interpretive, and what remains uncertain. Instead of resolving the situation, it makes visible how it is currently being understood and where clarity may still be missing.',
          ],
        },
        providesAnswers: {
          question: 'Does VIREKA Space give answers or tell me what to do?',
          answer: [
            'No. It does not provide answers, advice, or recommendations, and it does not determine outcomes. It makes visible the structure of interpretation, so it becomes clearer whether a decision can arise or how to move forward.',
          ],
        },
        isAITool: {
          question: 'Is this an AI tool?',
          answer: [
            'Not in the sense of producing responses or results. VIREKA Space does not generate solutions. It operates before any response or prompt is formed, making visible how a situation is being understood.',
          ],
        },
        worksWithAI: {
          question: 'Where does VIREKA Space fit in relation to AI?',
          answer: [
            'Most AI systems respond based on how a situation is described. VIREKA Space operates before that, making visible how the situation is being understood. Rather than producing answers, it separates the structure that goes on to guide any answer that follows.',
          ],
        },
        whyNotUseAIDirectly: {
          question: 'What’s the difference between using this and using AI directly?',
          answer: [
            'AI systems respond based on how a situation is described. If that description is unclear or incomplete, the response will reflect that, even if the system is functioning correctly. VIREKA Space makes the structure of the situation visible first, so interaction with AI can begin from a clearer and more stable starting point.',
          ],
        },
        prepareForAI: {
          question: 'What is “Send to AI”?',
          answer: [
            'It is a way to use the clarity developed in VIREKA Space within another AI system.',
            'From a clarified situation, a structured context is generated that can be copied and used as the basis for an AI interaction. This context preserves the distinction between what appears to be happening, what may be assumed, and what remains unclear.',
            'It does not add external instructions or alter the content. It allows the interaction with AI to begin from a clearer understanding of the situation.',
          ],
        },
        whatShouldIEnter: {
          question: 'What should I input?',
          answer: [
            'You can describe a situation, an idea, something you’re trying to understand, or even a prompt you’re working on. It doesn’t need to be well-formed. The system works with how it appears, not how it should be written.',
          ],
        },
        whenShouldIUseIt: {
          question: 'When should I use it?',
          answer: [
            'You can use it when something feels unclear, when multiple interpretations seem possible, or when it’s not obvious how to proceed. It is also useful before interacting with AI, especially when a prompt feels incomplete or difficult to formulate.',
          ],
        },
        benefitOfUsingIt: {
          question: 'What is the benefit of using it?',
          answer: [
            'When the structure of a situation becomes visible, decisions tend to feel less forced and interactions with AI become more coherent. Instead of repeatedly adjusting prompts or responses, clarity is present from the beginning.',
          ],
        },
        inputPrivacy: {
          question: 'Are my inputs private?',
          answer: [
            'Inputs are processed to generate responses within the system, but they are not stored as personal histories or associated with individual identities, and they are not actively monitored as user data. You can refer to the Privacy Policy for more details.',
          ],
        },
      },
    },
    privacy: {
      pageLabel: 'PRIVACY',
      heroTitle: 'Privacy Policy',
      subtitle: 'How we handle your information',
      title: 'Privacy Policy',
      introduction: 'VIREKA Space respects your privacy and handles data responsibly.',
      sections: {
        introduction: {
          title: 'Introduction',
          content: [
            'This policy explains how information is handled within VIREKA Space.',
            'The system is designed to support clarity and structured understanding while minimizing unnecessary data collection.',
          ],
        },
        informationProvided: {
          title: 'Information You Provide',
          content: [
            'Inputs are processed to generate responses within the system.',
            'They are not stored as user histories or associated with personal identities.',
          ],
        },
        technicalInformation: {
          title: 'Technical Information',
          content: [
            'Limited technical data may be collected to understand how the service is used and to improve performance.',
            'This may include page interactions, usage patterns, and system-level data.',
          ],
        },
        dataUsage: {
          title: 'How We Use Data',
          content: [
            'Data is used only to provide and improve the service.',
            'We do not sell personal information to third parties.',
          ],
        },
        aiProcessing: {
          title: 'AI Processing',
          content: [
            'Inputs may be processed by external AI systems to generate responses.',
            'These systems do not receive identifying information about users.',
          ],
        },
        thirdPartyServices: {
          title: 'Third-Party Services',
          content: [
            'Trusted third-party services may be used to support functionality.',
            'These are selected with attention to privacy and reliability.',
          ],
        },
        userControlUpdates: {
          title: 'User Control and Updates',
          content: [
            'As the system evolves, users may have more control over their data.',
            'Significant updates to this policy will be communicated.',
          ],
        },
      },
    },
    terms: {
      pageLabel: 'TERMS',
      heroTitle: 'Terms of Service',
      subtitle: 'Terms and conditions for using VIREKA Space',
      title: 'Terms of Service',
      introduction: 'These terms govern your use of VIREKA Space.',
      sections: {
        introduction: {
          title: 'Introduction',
          content: [
            'By using VIREKA Space, you agree to these terms.',
          ],
        },
        useOfService: {
          title: 'Use of Service',
          content: [
            'You may use VIREKA Space for personal clarification purposes.',
            'Commercial use requires explicit permission.',
          ],
        },
        natureOfService: {
          title: 'Nature of Service',
          content: [
            'VIREKA Space provides structure for understanding how situations are being interpreted.',
            'It does not provide professional advice, diagnoses, or definitive answers.',
          ],
        },
        userResponsibility: {
          title: 'User Responsibility',
          content: [
            'You are responsible for how you interpret and apply any output.',
            'The system supports clarity, but it does not replace judgment or decision-making.',
          ],
        },
        availabilityChanges: {
          title: 'Availability and Changes',
          content: [
            'Availability may vary.',
            'We may modify, suspend, or discontinue the service at any time.',
          ],
        },
        limitationOfLiability: {
          title: 'Limitation of Liability',
          content: [
            'VIREKA Space is provided as is without warranties.',
            'We are not responsible for decisions, actions, or outcomes resulting from use of the service.',
          ],
        },
        updatesToTerms: {
          title: 'Updates to Terms',
          content: [
            'These terms may be updated over time.',
            'Continued use of the service constitutes acceptance of any updates.',
          ],
        },
      },
    },
  },
  
  es: {
    header: {
      about: 'Acerca de',
      faq: 'Preguntas',
      account: 'Cuenta',
      plan: 'Planes',
      privacy: 'Privacidad',
      terms: 'Términos',
      contact: 'Contacto',
      signIn: 'Iniciar sesión',
      signOut: 'Cerrar sesión',
    },
    hero: {
      badge: 'VIREKA SPACE',
      title: [
        'CLARIDAD ANTES DE DECIDIR',
        'CLARIDAD ANTES DE USAR IA',
      ],
      subtitle: 'VIREKA Space ayuda a distinguir lo que sucede de lo que se asume, para que las respuestas partan de una comprensión más clara.',
      homeTagline: 'Lo que se aclara se puede llevar adelante',
      tryCta: 'Probar VIREKA Space',
      enterVirekaSpace: 'Entrar a VIREKA Space',
      clarifyButton: 'Aclarar una situación',
      aiButton: 'Interacción con IA',
      developedBy: 'Desarrollado por Anthony Escobedo',
      basedOn: 'Basado en <em>Beyond Thought: Awareness as Design Intelligence</em>',
    },
    footer: {
      privacy: 'Privacidad',
      terms: 'Términos',
      contact: 'Contacto',
      copyright: '© 2026 VIREKA Space',
    },
    navigation: {
      backToHome: 'Volver al inicio',
    },
    signIn: {
      intro: 'Inicia sesión para continuar con tu plan.',
      continueWithEmail: 'Continuar con el correo',
      paidPlanNote: 'El inicio de sesión solo es necesario para el acceso de pago.',
      emailPlaceholder: 'Correo electrónico',
      sending: 'Enviando…',
      success: 'Revisa tu correo para encontrar el enlace de inicio de sesión.',
      successLine2: 'Abre el enlace para continuar en VIREKA Space.',
      resendLink: 'Reenviar enlace',
      resendAvailableIn: 'Podrás reenviar el enlace en {seconds} s',
      useAnotherEmail: 'Usar otro correo',
      errorGeneric:
        'No pudimos enviar el enlace. Inténtalo de nuevo.',
      couldNotSendLink:
        'No pudimos enviar el enlace de acceso. Inténtalo de nuevo.',
    },
    settings: {
      backToHome: 'Volver',
      badge: 'CONFIGURACIÓN',
      title: 'Configuración y soporte',
      subtitle: 'Acceso a la cuenta, información de uso, páginas legales y detalles de contacto.',
      access: 'Acceso',
      legal: 'Legal',
      account: 'Cuenta',
      plan: 'Plan',
      contact: 'Contacto',
      privacy: 'Privacidad',
      terms: 'Términos',
    },
    onboarding: {
      defaultTitle: 'La comprensión comienza con la estructura',
      defaultBody: {
        description: 'VIREKA Space aclara cómo se están interpretando las situaciones antes de que las conclusiones guíen la respuesta.',
        usefulWhenTitle: 'Útil cuando:',
        usefulWhenList: [
          'el significado parece incierto',
          'múltiples interpretaciones parecen posibles',
          'se está considerando una respuesta',
          'las suposiciones pueden estar influyendo en la interpretación',
          'un prompt requiere un punto de partida más claro',
        ],
        beginWith: 'Antes de usar IA, la estructura de la situación puede verse con mayor claridad. Comienza con una descripción simple.',
        systemNote: 'El sistema no busca respuestas. Ayuda a aclarar cómo se están comprendiendo las situaciones antes de ser traducidas en decisiones o prompts.',
      },
      begin: 'Comenzar',
      notNow: 'Ahora no',
    },
    clarify: {
      pageTitle: 'Claridad',
      heroTitle: 'Claridad',
      descriptionParagraph: 'Observa cómo se está entendiendo',
      workingPageSubtitle: 'Cómo se está comprendiendo',
      inputLabel: 'Situación',
      inputPlaceholder: 'Describe lo que tienes hasta ahora',
      helperText: 'Incluye cualquier cosa que pueda ayudar a aclarar la situación o donde la interpretación se siente incierta.',
      pageLabel: 'ACLARAR SITUACIÓN',
      backLink: 'Volver',
      initialReflection: 'Reflexión inicial',
      refinement: 'Refinamiento',
      initialSituation: 'Situación inicial',
      yourInput: 'Tu entrada',
      whatAppearsToBeHappening: 'Lo que parece estar sucediendo',
      whatMayBeAssumed: 'Lo que puede suponerse',
      whatMayRemainUnclear: 'Lo que puede permanecer incierto',
      whatMayBeInfluencingTheSituation: 'Lo que puede estar influyendo en la situación',
      integratedView: 'Vista integrada',
      howTheSituationReadsAsAWhole: 'Cómo se lee la situación en su conjunto',
      integratedViewListen: 'Escuchar vista integrada',
      integratedViewStopAudio: 'Detener audio',
      ttsCouldNotPlay: 'No se pudo reproducir el audio',
      clarifyingQuestion: 'Pregunta aclaratoria',
      optional: 'Opcional',
      suggestedQuestions: 'Preguntas sugeridas',
      clarificationPath: 'Ruta de aclaración',
      clarificationPathDescription: 'Las reflexiones anteriores pueden expandirse cuando sea necesario, mientras la respuesta más reciente permanece visible.',
      response: 'Respuesta',
      listening: 'Escuchando...',
      transcribing: 'Transcribiendo...',
      mic: 'Micrófono',
      copyResult: 'Copiar resultado',
      copied: 'Copiado',
      couldNotCopy: 'No se pudo copiar',
      pleaseEnterASituationOrResponse: 'Por favor ingresa una situación o respuesta.',
      speechRecognitionNotSupported: 'El reconocimiento de voz no es compatible con este navegador. Prueba Chrome, Edge o Safari.',
      microphoneError: 'Error de micrófono: ',
      microphoneUnavailableTitle: 'Micrófono no disponible',
      usageLimitNoticeTitle: 'Límite de uso alcanzado',
      usageLimitBody:
        'Has alcanzado tu límite por hoy. Puedes continuar mañana o actualizar para mayor acceso.',
      genericNoticeTitle: 'Aviso',
      anUnexpectedErrorOccurred: 'Ocurrió un error inesperado.',
      workspaceMenu: {
        accountHeader: 'Cuenta',
        signIn: 'Iniciar sesión',
        signOut: 'Cerrar sesión',
        free: 'Free',
        pro: 'Acceso Pro',
        proPlus: 'Acceso Pro+',
      },
      loadingText: 'Aclarando...',
      doneButton: 'Hecho',
      followupLabel: 'Seguimiento',
      followupPlaceholder: 'Agrega más detalles',
      followupHelper: 'Un detalle adicional puede ayudar a distinguir la observación de la interpretación.',
      simpleAction: 'Aclarar',
      badge: 'ACLARAR',
    },
    history: {
      useThisClarification: 'Usar esta aclaración',
      startNewSituation: 'Iniciar nueva situación',
      recents: 'Recientes',
    },
    aiInteraction: {
      pageTitle: 'Interacción con IA',
      heroTitle: 'Ver claramente antes de decidir qué pedirle a la IA que haga',
      descriptionParagraph: 'VIREKA Space ayuda a distinguir lo que parece estar sucediendo de lo que puede suponerse, mejorando la claridad de la interacción con la IA.',
      inputLabel: '¿Qué está sucediendo en la interacción con la IA?',
      inputPlaceholder: 'Describe el prompt, la respuesta o lo que resulte poco claro',
      helperText: 'Incluye el prompt, el objetivo, la salida o cualquier cosa que pueda ayudar a aclarar dónde la interacción se siente poco clara.',
      pageLabel: 'INTERACCIÓN CON IA',
      backLink: 'Volver',
      simpleAction: 'Aclarar',
      initialReflection: 'Reflexión inicial',
      refinement: 'Refinamiento',
      initialAIIssue: 'Problema de IA inicial',
      yourInput: 'Tu entrada',
      whatAppearsToBeHappening: 'Lo que parece estar sucediendo',
      whatMayBeAssumed: 'Lo que puede suponerse',
      whatMayRemainUnclear: 'Lo que puede permanecer incierto',
      whatMayBeInfluencingTheAIInteraction: 'Lo que puede estar influyendo en la interacción con IA',
      integratedView: 'Vista integrada',
      howTheSituationReadsAsAWhole: 'Cómo se lee la situación en su conjunto',
      integratedViewListen: 'Escuchar vista integrada',
      integratedViewStopAudio: 'Detener audio',
      ttsCouldNotPlay: 'No se pudo reproducir el audio',
      clarifyingQuestion: 'Pregunta aclaratoria',
      optional: 'Opcional',
      suggestedQuestions: 'Preguntas sugeridas',
      clarificationPath: 'Proceso de clarificación de la interacción',
      clarificationPathDescription: 'Cada refinamiento ayuda a distinguir lo que hace la IA de lo que podría asumirse sobre su razonamiento.',
      response: 'Respuesta',
      listening: 'Escuchando...',
      transcribing: 'Transcribiendo...',
      mic: 'Micrófono',
      copyResult: 'Copiar resultado',
      copied: 'Copiado',
      couldNotCopy: 'No se pudo copiar',
      loadingText: 'Aclarando...',
      doneButton: 'Hecho',
      followupLabel: 'Seguimiento',
      followupPlaceholder: 'Agrega más detalles',
      followupHelperText: 'Opcional: Haz una pregunta de seguimiento para continuar el análisis.',
      followupHelper: 'Un detalle adicional puede ayudar a clarificar cómo se está interpretando el resultado de la IA.',
      badge: 'INTERACCIÓN CON IA',
      pleaseEnterASituationOrResponse: 'Por favor ingresa una situación o respuesta.',
      speechRecognitionNotSupported: 'El reconocimiento de voz no es compatible con este navegador. Prueba Chrome, Edge o Safari.',
      microphoneError: 'Error de micrófono: ',
      microphoneUnavailableTitle: 'Micrófono no disponible',
      usageLimitNoticeTitle: 'Límite de uso alcanzado',
      usageLimitBody:
        'Has alcanzado tu límite por hoy. Puedes continuar mañana o actualizar para mayor acceso.',
      genericNoticeTitle: 'Aviso',
      anUnexpectedErrorOccurred: 'Ocurrió un error inesperado.',
    },
    account: {
      pageTitle: 'Acceso a la cuenta en VIREKA Space',
      pageIntro: 'El acceso a la cuenta se vuelve relevante cuando se requiere suscripción o gestión continua del plan.',
      freeUsageNoSignIn: 'El uso gratuito actualmente no requiere inicio de sesión.',
      accountRequiredForSubscription: 'Una cuenta solo se requiere al suscribirse al acceso extendido.',
      signInAllowsSubscription: 'El inicio de sesión permite que el estado de suscripción, los límites de uso y la continuidad de acceso se asocien con el mismo usuario.',
      authenticationMethods: 'La autenticación puede completarse usando un proveedor de inicio de sesión compatible o verificación por correo electrónico.',
      functionalityMayExpand: '',
    },
    plan: {
      pageTitle: 'Planes',
      pageIntro: 'Elige el nivel de acceso que se ajuste a cómo usas VIREKA Space.',
      freeAccessIncludes: 'El acceso gratuito incluye hasta 10 interacciones por día.',
      dailyLimitReached: 'Cuando se alcanza el límite diario, el uso vuelve a estar disponible el día siguiente.',
      extendedAccessSubscription: 'Los usuarios que requieran acceso extendido pueden elegir suscribirse.',
      subscriptionEnablesAdditional: 'La suscripción habilita uso adicional más allá del límite gratuito diario.',
      planStructureMayEvolve: 'La estructura del plan puede evolucionar a medida que el servicio se desarrolla.',
      fullHistoryAvailableWithSubscription: 'Historial completo disponible con suscripción',
      notCurrentFreeTier: 'No es su plan actual',
      statusSection: {
        yourAccess: 'Tu acceso',
        currentAccess: 'Acceso actual',
        subscription: 'Suscripción',
        renewsAutomatically: 'Se renueva automáticamente',
        dailyInteractions: 'Interacciones diarias',
        history: 'Historial',
        perDay: 'por día',
        historyLimited: 'Limitado',
        historyFull: 'Completo',
        loading: 'Cargando…',
        noActiveSubscription: 'Sin suscripción activa',
      },
      tiers: {
        free: {
          name: 'Free',
          features: [
            '10 interacciones por día',
            'Acceso a los 5 elementos recientes del historial',
            'No se requiere iniciar sesión',
          ],
          action: 'Acceso actual',
        },
        pro: {
          name: 'Pro',
          features: [
            '50 interacciones por día',
            'Acceso completo al historial',
            'Copiar desde el historial',
          ],
          action: 'Actualizar a Pro',
        },
        proPlus: {
          name: 'Pro+',
          features: [
            '100 interacciones por día',
            'Acceso completo al historial',
            'Copiar desde el historial',
            'Patrones similares en situaciones anteriores',
          ],
          action: 'Próximamente',
        },
      },
    },
    contact: {
      pageTitle: 'Contacto y retroalimentación',
      pageIntro: 'Preguntas, retroalimentación y problemas técnicos pueden dirigirse usando la información de contacto a continuación.',
      feedbackHelpsImprove:
        'La retroalimentación ayuda a mejorar la claridad, la fiabilidad y la usabilidad con el tiempo.',
      messagesReviewed:
        'Los mensajes se revisan con atención y contribuyen al perfeccionamiento continuo del sistema.',
    },
    staticPage: {
      backToHome: 'Volver',
    },
    doneState: {
      clarityEstablished: 'Claridad establecida',
      structureSupportsClarity: 'La estructura apoya una comprensión más clara.',
      copyResult: 'Copiar resultado',
      prepareForAI: 'Enviar a la IA',
      aiReadyContext: 'Contexto listo para IA',
      aiReadyDescription: 'Esto prepara la aclaración para su uso en otro sistema de IA.',
      copyAIReadyContext: 'Copiar contexto para IA',
      copied: 'Copiado',
      startNewSituation: 'Comenzar nueva situación',
      returnHome: 'Volver al inicio',
    },
    about: {
      pageLabel: 'ACERCA DE',
      heroTitle: 'Sobre VIREKA Space',
      subtitle: 'Donde la interpretación se aclara',
      sections: {
        function: {
          title: 'Función',
          content: [
            'VIREKA Space fue desarrollado para un punto que suele pasar desapercibido. Antes de que se tome una decisión o se escriba un prompt, una situación ya está siendo interpretada. Esta interpretación influye silenciosamente en lo que parece razonable, lo que se siente necesario y lo que parece tener sentido preguntar. Mientras la mayoría de los sistemas avanzan hacia respuestas, VIREKA Space separa aquello en lo que se basa la respuesta al actuar antes de cualquier decisión o respuesta, haciendo visible cómo se está comprendiendo la situación.',
            'A veces una situación parece difícil no porque sea compleja, sino porque más de una interpretación parece posible al mismo tiempo. Algunas partes se ven claras, otras inciertas, y ciertas suposiciones pueden estar formándose sin ser completamente percibidas. Cuando esta estructura no es visible, las decisiones pueden sentirse forzadas y los prompts más difíciles de formular.',
            'VIREKA Space ofrece una forma simple de hacer esto visible. No sugiere qué se debe hacer. Hace visible cómo se está comprendiendo la situación. A medida que esto se aclara, resulta más fácil ver si una decisión puede surgir o cómo un prompt puede comenzar a formarse.',
          ],
        },
        effect: {
          title: 'Efecto',
          content: [
            'La claridad muchas veces cambia la experiencia de una situación sin cambiar la situación en sí.',
            'A medida que la estructura de la interpretación se vuelve visible, lo que antes parecía complejo puede empezar a separarse en partes distintas. Algunos elementos ya están claros. Otros permanecen inciertos, pero ya no se perciben mezclados.',
            'Esto no proporciona respuestas ni recomendaciones. Reduce la fricción causada por una comprensión poco clara, facilitando reconocer cuándo una decisión puede surgir o cuándo aún se necesita más claridad.',
          ],
        },
        structuralImplication: {
          title: 'Implicación estructural',
          content: [
            'La interpretación no solo afecta decisiones individuales. También moldea cómo se estructuran las situaciones antes de traducirse en acciones, prompts o sistemas.',
            'Lo que después parece un problema técnico u operativo muchas veces comienza antes, en cómo se comprendió la situación. Cuando esa comprensión se traduce en un prompt o flujo de trabajo, su estructura se mantiene y puede amplificarse.',
            'VIREKA Space opera en ese punto anterior. Al hacer visible la interpretación antes de que se fije, permite ver con mayor claridad las condiciones iniciales que influyen en los resultados.',
            'No orienta lo que debe hacerse, sino que hace visibles las condiciones que pasan a guiar cualquier respuesta, decisión o sistema posterior.',
            'A medida que surge la claridad, puede llevarse a la interacción con IA. En lugar de comenzar con un prompt poco claro o incompleto, la interacción puede partir de una comprensión más estable de lo que realmente se está preguntando.',
          ],
        },
        orientation: {
          title: 'Orientación',
          content: [],
        },
        origin: {
          title: 'Origen',
          content: [
            'VIREKA Space está inspirado en la perspectiva desarrollada en Beyond Thought: Awareness as Design Intelligence.',
            'Refleja un interés en cómo surge la claridad cuando la estructura de una situación se hace visible antes de traducirse en decisiones, prompts o sistemas.',
          ],
        },
      },
    },
    faq: {
      pageLabel: 'PREGUNTAS FRECUENTES',
      heroTitle: 'Preguntas Frecuentes',
      subtitle: 'Preguntas comunes sobre VIREKA Space',
      title: 'Preguntas Frecuentes',
      questions: {
        whatIsVirekaSpace: {
          question: '¿Qué es VIREKA Space?',
          answer: [
            'VIREKA Space es un entorno estructurado para ver cómo se está comprendiendo una situación. Hace visible lo que parece estar ocurriendo, lo que puede estar siendo asumido y lo que aún no está claro, permitiendo que la estructura de la interpretación se vea antes de cualquier acción.',
          ],
        },
        whatDoesItDo: {
          question: '¿Qué hace exactamente?',
          answer: [
            'Separa lo que es observable, lo que puede ser interpretativo y lo que permanece incierto. En lugar de resolver la situación, hace visible cómo se está comprendiendo en este momento y dónde aún puede faltar claridad.',
          ],
        },
        providesAnswers: {
          question: '¿VIREKA Space da respuestas o dice qué hacer?',
          answer: [
            'No. No proporciona respuestas, consejos ni recomendaciones, ni determina resultados. Hace visible la estructura de la interpretación, para que resulte más claro si una decisión puede surgir o cómo avanzar.',
          ],
        },
        isAITool: {
          question: '¿Es una herramienta de IA?',
          answer: [
            'No en el sentido de producir respuestas o resultados. VIREKA Space no genera soluciones. Actúa antes de que se forme cualquier respuesta o prompt, haciendo visible cómo se está comprendiendo una situación.',
          ],
        },
        worksWithAI: {
          question: '¿Dónde se posiciona VIREKA Space en relación con la IA?',
          answer: [
            'La mayoría de los sistemas de IA responden según cómo se describe una situación. VIREKA Space actúa antes de eso, haciendo visible cómo se está comprendiendo la situación. En lugar de producir respuestas, separa la estructura que pasa a guiar cualquier respuesta posterior.',
          ],
        },
        whyNotUseAIDirectly: {
          question: '¿Cuál es la diferencia entre usar esto y usar IA directamente?',
          answer: [
            'Los sistemas de IA responden en función de cómo se describe una situación. Si esa descripción no está clara o está incompleta, la respuesta reflejará eso, incluso si el sistema funciona correctamente. VIREKA Space hace visible primero la estructura de la situación, para que la interacción con la IA comience desde un punto más claro y estable.',
          ],
        },
        prepareForAI: {
          question: '¿Qué es “Enviar a la IA”?',
          answer: [
            'Es una forma de utilizar la claridad obtenida en VIREKA Space dentro de otro sistema de IA.',
            'A partir de una situación ya clarificada, se genera un contexto estructurado que puede copiarse y usarse como base para una interacción con IA. Este contexto mantiene la distinción entre lo que aparece, lo que puede estar siendo asumido y lo que permanece incierto.',
            'No añade instrucciones externas ni cambia el contenido. Simplemente permite que la interacción con IA comience desde una comprensión más clara de la situación.',
          ],
        },
        whatShouldIEnter: {
          question: '¿Qué debo ingresar?',
          answer: [
            'Puedes describir una situación, una idea, algo que estés tratando de entender o incluso un prompt en el que estés trabajando. No necesita estar bien formulado. El sistema trabaja con cómo aparece, no con cómo debería escribirse.',
          ],
        },
        whenShouldIUseIt: {
          question: '¿Cuándo debería usarlo?',
          answer: [
            'Puedes usarlo cuando algo no está claro, cuando hay múltiples interpretaciones posibles o cuando no es evidente cómo avanzar. También es útil antes de interactuar con IA, especialmente cuando un prompt parece incompleto o difícil de formular.',
          ],
        },
        benefitOfUsingIt: {
          question: '¿Cuál es el beneficio de usarlo?',
          answer: [
            'Cuando la estructura de una situación se vuelve visible, las decisiones dejan de sentirse forzadas y la interacción con la IA se vuelve más coherente. En lugar de ajustar repetidamente respuestas o prompts, la claridad está presente desde el inicio.',
          ],
        },
        inputPrivacy: {
          question: '¿Mis entradas son privadas?',
          answer: [
            'Las entradas se procesan para generar respuestas dentro del sistema, pero no se almacenan como historiales personales ni se asocian a identidades individuales, ni se supervisan activamente como datos de usuario. Puedes consultar más detalles en la Política de Privacidad.',
          ],
        },
      },
    },
    privacy: {
      pageLabel: 'PRIVACIDAD',
      heroTitle: 'Política de Privacidad',
      subtitle: 'Cómo manejamos tu información',
      title: 'Política de Privacidad',
      introduction: 'VIREKA Space respeta tu privacidad y maneja los datos de manera responsable.',
      sections: {
        introduction: {
          title: 'Introducción',
          content: [
            'Esta política explica cómo se maneja la información dentro de VIREKA Space.',
            'El sistema está diseñado para apoyar la claridad y la comprensión estructurada, minimizando la recolección innecesaria de datos.',
          ],
        },
        informationProvided: {
          title: 'Información que Proporcionas',
          content: [
            'Los datos que introduces se procesan para generar respuestas dentro del sistema.',
            'No se almacenan como historiales de usuario ni se asocian con identidades personales.',
          ],
        },
        technicalInformation: {
          title: 'Información Técnica',
          content: [
            'Se pueden recopilar datos técnicos limitados para entender cómo se utiliza el servicio y mejorar su funcionamiento.',
            'Esto puede incluir interacciones, patrones de uso y datos del sistema.',
          ],
        },
        dataUsage: {
          title: 'Cómo Usamos los Datos',
          content: [
            'Los datos se utilizan únicamente para proporcionar y mejorar el servicio.',
            'No vendemos información personal a terceros.',
          ],
        },
        aiProcessing: {
          title: 'Procesamiento de IA',
          content: [
            'Los datos pueden ser procesados por sistemas externos de IA para generar respuestas.',
            'Estos sistemas no reciben información que identifique a los usuarios.',
          ],
        },
        thirdPartyServices: {
          title: 'Servicios de Terceros',
          content: [
            'Podemos utilizar servicios de terceros confiables para el funcionamiento del sistema.',
            'Estos se seleccionan considerando la privacidad y la fiabilidad.',
          ],
        },
        userControlUpdates: {
          title: 'Control de Usuario y Actualizaciones',
          content: [
            'A medida que el sistema evolucione, los usuarios podrán tener mayor control sobre sus datos.',
            'Se informará sobre cambios relevantes en esta política.',
          ],
        },
      },
    },
    terms: {
      pageLabel: 'TÉRMINOS',
      heroTitle: 'Términos de Servicio',
      subtitle: 'Términos y condiciones para usar VIREKA Space',
      title: 'Términos de Servicio',
      introduction: 'Estos términos rigen tu uso de VIREKA Space.',
      sections: {
        introduction: {
          title: 'Introducción',
          content: [
            'Al usar VIREKA Space, aceptas estos términos.',
          ],
        },
        useOfService: {
          title: 'Uso del Servicio',
          content: [
            'Puedes usar VIREKA Space para fines de aclaración personal.',
            'El uso comercial requiere permiso explícito.',
          ],
        },
        natureOfService: {
          title: 'Naturaleza del Servicio',
          content: [
            'VIREKA Space ofrece estructura para entender cómo se interpretan las situaciones.',
            'No ofrece asesoramiento profesional, diagnósticos ni respuestas definitivas.',
          ],
        },
        userResponsibility: {
          title: 'Responsabilidad del Usuario',
          content: [
            'Eres responsable de cómo interpretas y aplicas cualquier resultado.',
            'El sistema apoya la claridad, pero no sustituye el criterio ni la toma de decisiones.',
          ],
        },
        availabilityChanges: {
          title: 'Disponibilidad y Cambios',
          content: [
            'La disponibilidad puede variar.',
            'Podemos modificar, suspender o interrumpir el servicio en cualquier momento.',
          ],
        },
        limitationOfLiability: {
          title: 'Limitación de Responsabilidad',
          content: [
            'VIREKA Space se ofrece tal cual, sin garantías.',
            'No somos responsables de decisiones, acciones o resultados derivados del uso del servicio.',
          ],
        },
        updatesToTerms: {
          title: 'Actualizaciones de los Términos',
          content: [
            'Estos términos pueden actualizarse con el tiempo.',
            'El uso continuado del servicio implica la aceptación de las actualizaciones.',
          ],
        },
      },
    },
  },
  
  pt: {
    header: {
      about: 'Sobre',
      faq: 'Perguntas',
      account: 'Conta',
      plan: 'Planos',
      privacy: 'Privacidade',
      terms: 'Termos',
      contact: 'Contato',
      signIn: 'Entrar',
      signOut: 'Encerrar sessão',
    },
    hero: {
      badge: 'VIREKA SPACE',
      title: [
        'CLAREZA ANTES DE DECIDIR',
        'CLAREZA ANTES DE USAR IA',
      ],
      subtitle: 'VIREKA Space ajuda a distinguir o que acontece do que se assume, para que as respostas partam de uma compreensão mais clara.',
      homeTagline: 'O que se esclarece pode seguir adiante',
      tryCta: 'Experimentar VIREKA Space',
      enterVirekaSpace: 'Entrar no VIREKA Space',
      clarifyButton: 'Clarificar uma situação',
      aiButton: 'Interação com IA',
      developedBy: 'Desenvolvido por Anthony Escobedo',
      basedOn: 'Baseado em <em>Beyond Thought: Awareness as Design Intelligence</em>',
    },
    footer: {
      privacy: 'Privacidade',
      terms: 'Termos',
      contact: 'Contato',
      copyright: '© 2026 VIREKA Space',
    },
    navigation: {
      backToHome: 'Voltar ao início',
    },
    signIn: {
      intro: 'Entre para continuar com o seu plano.',
      continueWithEmail: 'Continuar com o e-mail',
      paidPlanNote: 'O login só é necessário para acesso pago.',
      emailPlaceholder: 'E-mail',
      sending: 'Enviando…',
      success: 'Verifique seu e-mail para encontrar o link de login.',
      successLine2: 'Abra o link para continuar no VIREKA Space.',
      resendLink: 'Reenviar link',
      resendAvailableIn: 'Você poderá reenviar o link em {seconds} s',
      useAnotherEmail: 'Usar outro e-mail',
      errorGeneric:
        'Não foi possível enviar o link. Tente novamente.',
      couldNotSendLink:
        'Não foi possível enviar o link de acesso. Tente novamente.',
    },
    settings: {
      backToHome: 'Voltar',
      badge: 'CONFIGURAÇÕES',
      title: 'Configurações e suporte',
      subtitle: 'Acesso à conta, informações de uso, páginas legais e detalhes de contato.',
      access: 'Acesso',
      legal: 'Legal',
      account: 'Conta',
      plan: 'Plano',
      contact: 'Contato',
      privacy: 'Privacidade',
      terms: 'Termos',
    },
    onboarding: {
      defaultTitle: 'A compreensão começa com estrutura',
      defaultBody: {
        description: 'VIREKA Space esclarece como as situações são interpretadas antes que as conclusões orientem a resposta.',
        usefulWhenTitle: 'Útil quando:',
        usefulWhenList: [
          'o significado parece incerto',
          'múltiplas interpretações parecem possíveis',
          'uma resposta está sendo considerada',
          'suposições podem estar influenciando a interpretação',
          'um prompt de IA precisa de uma base mais clara antes de ser formulado',
        ],
        beginWith: 'Antes de usar IA, a estrutura da situação pode ser vista com mais clareza. Comece com uma descrição simples.',
        systemNote: 'O sistema não busca respostas. Ajuda a esclarecer como as situações estão sendo compreendidas antes de serem traduzidas em decisões ou prompts.',
      },
      begin: 'Começar',
      notNow: 'Agora não',
    },
    clarify: {
      pageTitle: 'Clareza',
      heroTitle: 'Clareza',
      descriptionParagraph: 'Veja como está sendo compreendido',
      workingPageSubtitle: 'Como está sendo compreendido',
      inputLabel: 'Situação',
      inputPlaceholder: 'Descreva o que você tem até agora',
      helperText: 'Inclua qualquer coisa que possa ajudar a esclarecer a situação ou onde a interpretação se sente incerta.',
      pageLabel: 'CLARIFICAR SITUAÇÃO',
      backLink: 'Voltar',
      initialReflection: 'Reflexão inicial',
      refinement: 'Refinamento',
      initialSituation: 'Situação inicial',
      yourInput: 'Sua entrada',
      whatAppearsToBeHappening: 'O que parece estar acontecendo',
      whatMayBeAssumed: 'O que pode ser suposto',
      whatMayRemainUnclear: 'O que pode permanecer incerto',
      whatMayBeInfluencingTheSituation: 'O que pode estar influenciando a situação',
      integratedView: 'Visão integrada',
      howTheSituationReadsAsAWhole: 'Como a situação é lida como um todo',
      integratedViewListen: 'Ouvir visão integrada',
      integratedViewStopAudio: 'Parar áudio',
      ttsCouldNotPlay: 'Não foi possível reproduzir o áudio',
      clarifyingQuestion: 'Pergunta esclarecedora',
      optional: 'Opcional',
      suggestedQuestions: 'Perguntas sugeridas',
      clarificationPath: 'Caminho de clarificação',
      clarificationPathDescription: 'Reflexões anteriores podem ser expandidas quando necessário, enquanto a resposta mais recente permanece visível.',
      response: 'Resposta',
      listening: 'Ouvindo...',
      transcribing: 'Transcrevendo...',
      mic: 'Microfone',
      copyResult: 'Copiar resultado',
      copied: 'Copiado',
      couldNotCopy: 'Não foi possível copiar',
      pleaseEnterASituationOrResponse: 'Por favor, insira uma situação ou resposta.',
      speechRecognitionNotSupported: 'Reconhecimento de fala não é suportado neste navegador. Tente Chrome, Edge ou Safari.',
      microphoneError: 'Erro no microfone: ',
      microphoneUnavailableTitle: 'Microfone indisponível',
      usageLimitNoticeTitle: 'Limite de uso atingido',
      usageLimitBody:
        'Você atingiu seu limite de hoje. Você pode continuar amanhã ou atualizar para acesso estendido.',
      genericNoticeTitle: 'Aviso',
      anUnexpectedErrorOccurred: 'Ocorreu um erro inesperado.',
      workspaceMenu: {
        accountHeader: 'Conta',
        signIn: 'Entrar',
        signOut: 'Encerrar sessão',
        free: 'Free',
        pro: 'Acesso Pro',
        proPlus: 'Acesso Pro+',
      },
      loadingText: 'Esclarecendo...',
      doneButton: 'Concluído',
      followupLabel: 'Acompanhamento',
      followupPlaceholder: 'Adicione mais detalhes',
      followupHelper: 'Um detalhe adicional pode ajudar a distinguir observação de interpretação.',
      badge: 'CLARIFICAR',
      simpleAction: 'Clarificar',
    },
    history: {
      useThisClarification: 'Usar esta clareza',
      startNewSituation: 'Começar nova situação',
      recents: 'Recentes',
    },
    aiInteraction: {
      pageTitle: 'Interação com IA',
      heroTitle: 'Ver claramente antes de decidir o que pedir à IA para fazer',
      descriptionParagraph: 'VIREKA Space ajuda a distinguir o que parece estar acontecendo do que pode ser suposto, melhorando a clareza da interação com a IA.',
      inputLabel: 'O que está acontecendo na interação com a IA?',
      inputPlaceholder: 'Descreva o prompt, a resposta ou o que parece pouco claro',
      helperText: 'Inclua o prompt, o objetivo, a saída ou qualquer coisa que possa ajudar a esclarecer onde a interação parece pouco clara.',
      pageLabel: 'INTERAÇÃO COM IA',
      backLink: 'Voltar',
      simpleAction: 'Clarificar',
      initialReflection: 'Reflexão inicial',
      refinement: 'Refinamento',
      initialAIIssue: 'Problema de IA inicial',
      yourInput: 'Sua entrada',
      whatAppearsToBeHappening: 'O que parece estar acontecendo',
      whatMayBeAssumed: 'O que pode ser suposto',
      whatMayRemainUnclear: 'O que pode permanecer incerto',
      whatMayBeInfluencingTheAIInteraction: 'O que pode estar influenciando a interação com IA',
      integratedView: 'Visão integrada',
      howTheSituationReadsAsAWhole: 'Como a situação é lida como um todo',
      integratedViewListen: 'Ouvir visão integrada',
      integratedViewStopAudio: 'Parar áudio',
      ttsCouldNotPlay: 'Não foi possível reproduzir o áudio',
      clarifyingQuestion: 'Pergunta esclarecedora',
      optional: 'Opcional',
      suggestedQuestions: 'Perguntas sugeridas',
      clarificationPath: 'Processo de clarificação da interação',
      clarificationPathDescription: 'Cada refinamento ajuda a distinguir o que a IA está fazendo do que pode estar sendo assumido sobre seu raciocínio.',
      response: 'Resposta',
      listening: 'Ouvindo...',
      transcribing: 'Transcrevendo...',
      mic: 'Microfone',
      copyResult: 'Copiar resultado',
      copied: 'Copiado',
      couldNotCopy: 'Não foi possível copiar',
      loadingText: 'Esclarecendo...',
      doneButton: 'Concluído',
      followupLabel: 'Acompanhamento',
      followupPlaceholder: 'Adicione mais detalhes',
      followupHelperText: 'Opcional: Faça uma pergunta de acompanhamento para continuar a análise.',
      followupHelper: 'Um detalhe adicional pode ajudar a esclarecer como o resultado da IA está sendo interpretado.',
      badge: 'INTERAÇÃO COM IA',
      pleaseEnterASituationOrResponse: 'Por favor, insira uma situação ou resposta.',
      speechRecognitionNotSupported: 'Reconhecimento de fala não é suportado neste navegador. Tente Chrome, Edge ou Safari.',
      microphoneError: 'Erro no microfone: ',
      microphoneUnavailableTitle: 'Microfone indisponível',
      usageLimitNoticeTitle: 'Limite de uso atingido',
      usageLimitBody:
        'Você atingiu seu limite de hoje. Você pode continuar amanhã ou atualizar para acesso estendido.',
      genericNoticeTitle: 'Aviso',
      anUnexpectedErrorOccurred: 'Ocorreu um erro inesperado.',
    },
    account: {
      pageTitle: 'Acesso à conta no VIREKA Space',
      pageIntro: 'O acesso à conta se torna relevante quando assinatura ou gerenciamento contínuo do plano é necessário.',
      freeUsageNoSignIn: 'O uso gratuito atualmente não requer login.',
      accountRequiredForSubscription: 'Uma conta é necessária apenas ao assinar o acesso estendido.',
      signInAllowsSubscription: 'O login permite que status de assinatura, limites de uso e continuidade de acesso sejam associados ao mesmo usuário.',
      authenticationMethods: 'A autenticação pode ser concluída usando um provedor de login suportado ou verificação por e-mail.',
      functionalityMayExpand: '',
    },
    plan: {
      pageTitle: 'Planos',
      pageIntro: 'Escolha o nível de acesso que se ajusta à forma como você usa o VIREKA Space.',
      freeAccessIncludes: 'O acesso gratuito inclui até 10 interações por dia.',
      dailyLimitReached: 'Quando o limite diário é alcançado, o uso fica disponível novamente no dia seguinte.',
      extendedAccessSubscription: 'Usuários que requerem acesso estendido podem escolher assinar.',
      subscriptionEnablesAdditional: 'A assinatura habilita uso adicional além do limite gratuito diário.',
      planStructureMayEvolve: 'A estrutura do plano pode evoluir conforme o serviço se desenvolve.',
      fullHistoryAvailableWithSubscription: 'Histórico completo disponível com assinatura',
      notCurrentFreeTier: 'Não é o seu plano atual',
      statusSection: {
        yourAccess: 'Seu acesso',
        currentAccess: 'Acesso atual',
        subscription: 'Assinatura',
        renewsAutomatically: 'Renova automaticamente',
        dailyInteractions: 'Interações diárias',
        history: 'Histórico',
        perDay: 'por dia',
        historyLimited: 'Limitado',
        historyFull: 'Completo',
        loading: 'Carregando…',
        noActiveSubscription: 'Sem assinatura ativa',
      },
      tiers: {
        free: {
          name: 'Free',
          features: [
            '10 interações por dia',
            'Acesso aos 5 itens recentes do histórico',
            'Não é necessário entrar',
          ],
          action: 'Acesso atual',
        },
        pro: {
          name: 'Pro',
          features: [
            '50 interações por dia',
            'Acesso completo ao histórico',
            'Copiar do histórico',
          ],
          action: 'Atualizar para Pro',
        },
        proPlus: {
          name: 'Pro+',
          features: [
            '100 interações por dia',
            'Acesso completo ao histórico',
            'Copiar do histórico',
            'Padrões semelhantes em situações anteriores',
          ],
          action: 'Em breve',
        },
      },
    },
    contact: {
      pageTitle: 'Contato e feedback',
      pageIntro: 'Perguntas, feedback e problemas técnicos podem ser direcionados usando as informações de contato abaixo.',
      feedbackHelpsImprove:
        'O feedback ajuda a melhorar a clareza, a confiabilidade e a usabilidade ao longo do tempo.',
      messagesReviewed:
        'As mensagens são analisadas com atenção e contribuem para o aprimoramento contínuo do sistema.',
    },
    staticPage: {
      backToHome: 'Voltar',
    },
    doneState: {
      clarityEstablished: 'Clareza estabelecida',
      structureSupportsClarity: 'Estrutura suporta uma compreensão mais clara.',
      copyResult: 'Copiar resultado',
      prepareForAI: 'Enviar para a IA',
      aiReadyContext: 'Contexto pronto para IA',
      aiReadyDescription: 'Isso prepara a clarificação para uso em outro sistema de IA.',
      copyAIReadyContext: 'Copiar contexto para IA',
      copied: 'Copiado',
      startNewSituation: 'Começar nova situação',
      returnHome: 'Voltar ao início',
    },
    about: {
      pageLabel: 'SOBRE',
      heroTitle: 'Sobre VIREKA Space',
      subtitle: 'Onde a interpretação se esclarece',
      sections: {
        function: {
          title: 'Função',
          content: [
            'O VIREKA Space foi desenvolvido para um ponto que geralmente passa despercebido. Antes de uma decisão ser tomada ou de um prompt ser escrito, uma situação já está sendo interpretada. Essa interpretação influencia silenciosamente o que parece razoável, o que se sente necessário e o que faz sentido perguntar. Enquanto a maioria dos sistemas avança em direção a respostas, o VIREKA Space separa aquilo em que a resposta se baseia ao atuar antes de qualquer decisão ou resposta, tornando visível como a situação está sendo compreendida.',
            'Às vezes, uma situação parece difícil não porque seja complexa, mas porque mais de uma interpretação parece possível ao mesmo tempo. Algumas partes parecem claras, outras incertas, e certas suposições podem já estar se formando sem serem totalmente percebidas. Quando essa estrutura não está clara, decisões podem parecer forçadas e prompts mais difíceis de formular.',
            'O VIREKA Space oferece uma forma simples de tornar isso visível. Ele não sugere o que deve ser feito. Ele torna visível como a situação está sendo compreendida. À medida que isso se torna claro, fica mais fácil perceber quando uma decisão pode surgir ou como um prompt pode começar a se formar.',
          ],
        },
        effect: {
          title: 'Efeito',
          content: [
            'A clareza muitas vezes muda a experiência de uma situação sem alterar a situação em si.',
            'À medida que a estrutura da interpretação se torna visível, o que antes parecia complexo pode começar a se separar em partes distintas. Alguns elementos já estão claros. Outros permanecem incertos, mas já não estão misturados.',
            'Isso não fornece respostas ou recomendações. Reduz a fricção causada por uma compreensão pouco clara, facilitando reconhecer quando uma decisão pode surgir ou quando ainda é necessária mais clareza.',
          ],
        },
        structuralImplication: {
          title: 'Implicação estrutural',
          content: [
            'A interpretação não afeta apenas decisões individuais. Ela também molda como as situações são estruturadas antes de serem traduzidas em ações, prompts ou sistemas.',
            'O que mais tarde parece um problema técnico ou operacional muitas vezes começa antes, na forma como a situação foi compreendida. Quando essa compreensão é traduzida em um prompt ou fluxo de trabalho, sua estrutura é mantida e pode ser ampliada.',
            'O VIREKA Space atua nesse ponto anterior. Ao tornar a interpretação mais visível antes que ela se fixe, permite ver com mais clareza as condições iniciais que influenciam os resultados.',
            'Ele não orienta o que deve ser feito, mas torna visíveis as condições que passam a orientar qualquer resposta, decisão ou sistema que venha depois.',
            'À medida que a clareza surge, ela pode ser levada para a interação com IA. Em vez de começar com um prompt pouco claro ou incompleto, a interação pode começar a partir de uma compreensão mais estável do que realmente está sendo perguntado.',
          ],
        },
        orientation: {
          title: 'Orientação',
          content: [],
        },
        origin: {
          title: 'Origem',
          content: [
            'O VIREKA Space é inspirado na perspectiva desenvolvida em Beyond Thought: Awareness as Design Intelligence.',
            'Ele reflete um interesse em como a clareza surge quando a estrutura de uma situação se torna visível antes de ser traduzida em decisões, prompts ou sistemas.',
          ],
        },
      },
    },
    faq: {
      pageLabel: 'PERGUNTAS FREQUENTES',
      heroTitle: 'Perguntas Frequentes',
      subtitle: 'Perguntas comuns sobre VIREKA Space',
      title: 'Perguntas Frequentes',
      questions: {
        whatIsVirekaSpace: {
          question: 'O que é o VIREKA Space?',
          answer: [
            'O VIREKA Space é um ambiente estruturado para ver como uma situação está sendo compreendida. Ele torna visível o que parece estar acontecendo, o que pode estar sendo assumido e o que ainda não está claro, permitindo que a estrutura da interpretação seja vista antes de qualquer ação.',
          ],
        },
        whatDoesItDo: {
          question: 'O que ele faz exatamente?',
          answer: [
            'Ele separa o que é observável, o que pode ser interpretativo e o que permanece incerto. Em vez de resolver a situação, torna visível como ela está sendo compreendida no momento e onde ainda pode faltar clareza.',
          ],
        },
        providesAnswers: {
          question: 'O VIREKA Space dá respostas ou diz o que fazer?',
          answer: [
            'Não. Ele não fornece respostas, conselhos ou recomendações, nem determina resultados. Ele torna visível a estrutura da interpretação, para que fique mais claro se uma decisão pode surgir ou como seguir adiante.',
          ],
        },
        isAITool: {
          question: 'Isso é uma ferramenta de IA?',
          answer: [
            'Não no sentido de produzir respostas ou resultados. O VIREKA Space não gera soluções. Ele atua antes que qualquer resposta ou prompt seja formado, tornando visível como uma situação está sendo compreendida.',
          ],
        },
        worksWithAI: {
          question: 'Onde o VIREKA Space se posiciona em relação à IA?',
          answer: [
            'A maioria dos sistemas de IA responde com base em como uma situação é descrita. O VIREKA Space atua antes disso, tornando visível como a situação está sendo compreendida. Em vez de produzir respostas, ele separa a estrutura que passa a orientar qualquer resposta que venha depois.',
          ],
        },
        whyNotUseAIDirectly: {
          question: 'Qual é a diferença entre usar isso e usar IA diretamente?',
          answer: [
            'Os sistemas de IA respondem com base em como uma situação é descrita. Se essa descrição não estiver clara ou estiver incompleta, a resposta refletirá isso, mesmo que o sistema esteja funcionando corretamente. O VIREKA Space torna visível primeiro a estrutura da situação, para que a interação com a IA comece a partir de um ponto mais claro e estável.',
          ],
        },
        prepareForAI: {
          question: 'O que é “Enviar para a IA”?',
          answer: [
            'É uma forma de utilizar a clareza desenvolvida no VIREKA Space em outro sistema de IA.',
            'A partir de uma situação já clarificada, é gerado um contexto estruturado que pode ser copiado e utilizado como base para uma interação com IA. Esse contexto mantém a distinção entre o que aparece, o que pode estar sendo assumido e o que permanece incerto.',
            'Não adiciona instruções externas nem altera o conteúdo. Apenas permite que a interação com IA comece a partir de uma compreensão mais clara da situação.',
          ],
        },
        whatShouldIEnter: {
          question: 'O que devo inserir?',
          answer: [
            'Você pode descrever uma situação, uma ideia, algo que esteja tentando entender ou até mesmo um prompt em que esteja trabalhando. Não precisa estar bem formulado. O sistema trabalha com como isso aparece, não com como deveria ser escrito.',
          ],
        },
        whenShouldIUseIt: {
          question: 'Quando devo usar?',
          answer: [
            'Você pode usar quando algo parece pouco claro, quando há várias interpretações possíveis ou quando não está claro como avançar. Também é útil antes de interagir com IA, especialmente quando um prompt parece incompleto ou difícil de formular.',
          ],
        },
        benefitOfUsingIt: {
          question: 'Qual é o benefício de usar?',
          answer: [
            'Quando a estrutura de uma situação se torna mais clara, as decisões deixam de parecer forçadas e a interação com a IA se torna mais coerente. Em vez de ajustar repetidamente respostas ou prompts, a clareza passa a estar presente desde o início.',
          ],
        },
        inputPrivacy: {
          question: 'Minhas entradas são privadas?',
          answer: [
            'As entradas são processadas para gerar respostas dentro do sistema, mas não são armazenadas como históricos pessoais nem associadas a identidades individuais, nem são monitoradas ativamente como dados de usuário. Você pode consultar mais detalhes na Política de Privacidade.',
          ],
        },
      },
    },
    privacy: {
      pageLabel: 'PRIVACIDADE',
      heroTitle: 'Política de Privacidade',
      subtitle: 'Como lidamos com suas informações',
      title: 'Política de Privacidade',
      introduction: 'VIREKA Space respeita sua privacidade e lida com dados de forma responsável.',
      sections: {
        introduction: {
          title: 'Introdução',
          content: [
            'Esta política explica como as informações são tratadas no VIREKA Space.',
            'O sistema foi projetado para apoiar a clareza e a compreensão estrutural, minimizando a coleta desnecessária de dados.',
          ],
        },
        informationProvided: {
          title: 'Informações que Você Fornece',
          content: [
            'Os dados inseridos são processados para gerar respostas dentro do sistema.',
            'Eles não são armazenados como históricos de usuário nem associados a identidades pessoais.',
          ],
        },
        technicalInformation: {
          title: 'Informações Técnicas',
          content: [
            'Dados técnicos limitados podem ser coletados para entender como o serviço é utilizado e melhorar seu funcionamento.',
            'Isso pode incluir interações, padrões de uso e dados do sistema.',
          ],
        },
        dataUsage: {
          title: 'Como Usamos Dados',
          content: [
            'Os dados são utilizados apenas para fornecer e melhorar o serviço.',
            'Não vendemos informações pessoais a terceiros.',
          ],
        },
        aiProcessing: {
          title: 'Processamento de IA',
          content: [
            'Os dados podem ser processados por sistemas externos de IA para gerar respostas.',
            'Esses sistemas não recebem informações que identifiquem os usuários.',
          ],
        },
        thirdPartyServices: {
          title: 'Serviços de Terceiros',
          content: [
            'Podemos utilizar serviços de terceiros confiáveis para suporte ao funcionamento do sistema.',
            'Eles são selecionados com foco em privacidade e confiabilidade.',
          ],
        },
        userControlUpdates: {
          title: 'Controle do Usuário e Atualizações',
          content: [
            'À medida que o sistema evoluir, os usuários poderão ter maior controle sobre seus dados.',
            'Mudanças relevantes nesta política serão comunicadas.',
          ],
        },
      },
    },
    terms: {
      pageLabel: 'TERMOS',
      heroTitle: 'Termos de Serviço',
      subtitle: 'Termos e condições para usar VIREKA Space',
      title: 'Termos de Serviço',
      introduction: 'Estes termos regem seu uso de VIREKA Space.',
      sections: {
        introduction: {
          title: 'Introdução',
          content: [
            'Ao usar o VIREKA Space, você concorda com estes termos.',
          ],
        },
        useOfService: {
          title: 'Uso do Serviço',
          content: [
            'Você pode usar o VIREKA Space para fins de esclarecimento pessoal.',
            'O uso comercial requer permissão explícita.',
          ],
        },
        natureOfService: {
          title: 'Natureza do Serviço',
          content: [
            'O VIREKA Space oferece estrutura para entender como as situações estão sendo interpretadas.',
            'Não oferece aconselhamento profissional, diagnósticos ou respostas definitivas.',
          ],
        },
        userResponsibility: {
          title: 'Responsabilidade do Usuário',
          content: [
            'Você é responsável por como interpreta e aplica qualquer resultado.',
            'O sistema apoia a clareza, mas não substitui julgamento ou tomada de decisão.',
          ],
        },
        availabilityChanges: {
          title: 'Disponibilidade e Mudanças',
          content: [
            'A disponibilidade pode variar.',
            'Podemos modificar, suspender ou descontinuar o serviço a qualquer momento.',
          ],
        },
        limitationOfLiability: {
          title: 'Limitação de Responsabilidade',
          content: [
            'O VIREKA Space é fornecido no estado em que se encontra, sem garantias.',
            'Não nos responsabilizamos por decisões, ações ou resultados decorrentes do uso do serviço.',
          ],
        },
        updatesToTerms: {
          title: 'Atualizações dos Termos',
          content: [
            'Estes termos podem ser atualizados ao longo do tempo.',
            'O uso contínuo do serviço constitui aceitação de quaisquer atualizações.',
          ],
        },
      },
    },
  },
};

export const getDictionary = (language: Language): TranslationDictionary => {
  return dictionaries[language] || dictionaries.en;
};
