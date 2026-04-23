import { TranslationDictionary } from './types';
import { Language } from './config';

const dictionaries: Record<Language, TranslationDictionary> = {
  en: {
    header: {
      about: 'About',
      faq: 'FAQ',
      account: 'Account',
      plan: 'Plan',
      privacy: 'Privacy',
      terms: 'Terms',
      contact: 'Contact',
    },
    hero: {
      badge: 'VIREKA SPACE',
      title: [
        'CLARITY BEFORE DECISION',
        'CLARITY BEFORE USING AI',
      ],
      subtitle: 'VIREKA Space helps distinguish what is happening from what may be assumed, so responses begin from clearer understanding.',
      clarifyButton: 'Clarify a situation',
      aiButton: 'AI interaction',
      developedBy: 'Developed by Anthony Escobedo',
      basedOn: 'Based on <em>Beyond Thought: Awareness as Design Intelligence</em>',
    },
    footer: {
      privacy: 'Privacy',
      terms: 'Terms',
      contact: 'Contact',
      copyright: '© VIREKA Space',
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
      pageTitle: 'Clarify a situation',
      heroTitle: 'Clarify a situation',
      descriptionParagraph: 'Vireka distinguishes what appears to be happening, what may be assumed, and what may remain unclear so response can begin from clearer structure.',
      inputLabel: 'Situation',
      inputPlaceholder: 'Describe the situation as it currently appears',
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
      clarifyingQuestion: 'Clarifying question',
      optional: 'Optional',
      suggestedQuestions: 'Suggested questions',
      clarificationPath: 'Clarification path',
      clarificationPathDescription: 'Earlier reflections can be expanded when needed, while the latest response remains visible.',
      response: 'Response',
      listening: 'Listening...',
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
        'Free usage includes 20 interactions per day. Access resumes tomorrow or with subscription.',
      genericNoticeTitle: 'Notice',
      anUnexpectedErrorOccurred: 'An unexpected error occurred.',
      loadingText: 'Clarifying...',
      doneButton: 'Done',
      followupLabel: 'Follow-up',
      followupPlaceholder: 'Add any details',
      followupHelper: 'Additional detail may help separate observation from interpretation.',
      badge: 'CLARIFY',
      simpleAction: 'Clarify',
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
      clarifyingQuestion: 'Clarifying question',
      optional: 'Optional',
      suggestedQuestions: 'Suggested questions',
      clarificationPath: 'Clarification path',
      clarificationPathDescription: 'Earlier reflections can be expanded when needed, while the latest response remains visible.',
      response: 'Response',
      listening: 'Listening...',
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
        'Free usage includes 20 interactions per day. Access resumes tomorrow or with subscription.',
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
      pageTitle: 'Usage structure',
      pageIntro: 'VIREKA Space is designed to remain accessible while allowing expanded usage when needed.',
      freeAccessIncludes: 'Free access includes up to 20 interactions per day.',
      dailyLimitReached: 'When the daily limit is reached, usage becomes available again the following day.',
      extendedAccessSubscription: 'Users who require extended access may choose to subscribe.',
      subscriptionEnablesAdditional: 'Subscription enables additional usage beyond the daily free limit.',
      planStructureMayEvolve: 'Plan structure may evolve as the service develops.',
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
            'VIREKA Space was created to support clarity at a point that often goes unnoticed. Before a decision is made or an AI prompt is written, a situation is already being interpreted. That interpretation quietly shapes what feels reasonable, what seems necessary, what appears to make sense, and what it feels appropriate to ask.',
            'Sometimes a situation feels difficult not because it is complex, but because several interpretations seem possible at the same time, each suggesting a slightly different direction. Certain elements feel clear, others feel uncertain, and some assumptions may already be forming without being fully seen. When interpretation is unclear, decisions can feel pressured, and prompts can feel harder to form.',
            'VIREKA Space provides a simple structure that helps make these conditions more visible. Instead of suggesting what should be done, the system helps bring attention to how the situation is being understood. As the structure of interpretation becomes clearer, it often becomes easier to sense whether enough clarity exists for a decision or for forming a prompt.',
          ],
        },
        effect: {
          title: 'Effect',
          content: [
            'Clarity often changes the experience of a situation without altering the situation itself.',
            'When the structure of interpretation becomes more visible, decisions tend to feel less forced. What once appeared complex may separate into distinct elements, some already clear, others still uncertain.',
            'This does not provide answers or recommendations. It reduces the friction that comes from unclear framing, making it easier to recognize whether a decision is ready to be made or whether further clarification is needed.',
          ],
        },
        structuralImplication: {
          title: "Structural Implication",
          content: [
            'Interpretation does not only influence individual decisions. It shapes how situations are framed before they are translated into actions, instructions, or systems.',
            'In many cases, what appears as a technical or operational issue originates earlier, at the level of how a situation is understood. Once that understanding is translated into a prompt, workflow, or system design, its structure is carried forward and often amplified.',
            'VIREKA Space operates at this earlier point. By making interpretation more visible before it becomes fixed, it allows the initial conditions shaping outcomes to be seen more clearly.',
            'As clarity emerges, it can be carried forward into interaction with AI. Rather than beginning with an unstructured prompt, AI use can begin from a clearer understanding of what is actually being asked. In this way, VIREKA Space functions as a structural layer that precedes execution, allowing AI systems to be used from a more grounded starting point.'
          ]
        },
        orientation: {
          title: "Orientation",
          content: [],
        },
        origin: {
          title: 'Origin',
          content: [
            'VIREKA Space is informed by the perspective developed in Beyond Thought: Awareness as Design Intelligence.',
            'It reflects an interest in how clarity emerges when the structure of a situation is made visible before being translated into decisions, prompts, or systems.',
          ],
        },
      },
    },
    faq: {
      pageLabel: 'FAQ',
      heroTitle: 'Frequently Asked Questions',
      subtitle: 'Common questions about VIREKA Space',
      title: 'Questions & Answers',
      questions: {
        whatIsVirekaSpace: {
          question: 'What is VIREKA Space?',
          answer: [
            'VIREKA Space is a structured environment for clarifying how a situation is being understood before a decision is made or an AI prompt is written.',
            'It helps make visible what appears to be happening, what is being interpreted, and what remains uncertain, so that the structure of a situation can be seen more clearly before action is taken.',
          ],
        },
        providesAnswers: {
          question: 'Does VIREKA Space provide answers or recommendations?',
          answer: [
            'VIREKA Space does not provide answers, advice, or recommendations.',
            'It helps make the structure of interpretation more visible so that it becomes clearer whether a decision can be made or how a prompt might be formed.',
          ],
        },
        isAITool: {
          question: 'Is this an AI tool?',
          answer: [
            'VIREKA Space does not function as a typical AI tool that generates answers or outputs.',
            'It operates earlier, supporting clarity about how a situation is being understood before it is translated into a prompt or instruction.',
            'It can be used alongside AI, but it does not replace it.',
          ],
        },
        worksWithAI: {
          question: 'How does it work with AI?',
          answer: [
            'VIREKA Space can be used before or alongside interaction with AI systems.',
            'It helps clarify what is being asked, what may be assumed, and what remains unclear, so that AI interaction can begin from a more structured starting point rather than from an unformed or ambiguous prompt.',
          ],
        },
        clarifyVsAIInteraction: {
          question:
            'What is the difference between “Clarify a Situation” and “AI Interaction”?',
          answer: [
            'Clarify a Situation focuses on the situation itself. It helps make visible what appears to be happening, how it is being interpreted, and what remains uncertain.',
            'AI Interaction focuses on how a situation is translated into a prompt or interaction with AI. It helps clarify what the prompt is attempting to do, what may be missing, and how the interaction is being structured.',
          ],
        },
        whyNotUseAIDirectly: {
          question: 'Why not just use ChatGPT or another AI directly?',
          answer: [
            'AI systems respond to how a situation is described. When that description is unclear or incomplete, the response reflects that structure, even if the system itself is functioning correctly.',
            'VIREKA Space operates before that step, helping make the structure of the situation more visible so that interaction with AI can begin from a clearer starting point.',
          ],
        },
        whenShouldIUseIt: {
          question: 'When should I use VIREKA Space?',
          answer: [
            'VIREKA Space can be used when a situation feels unclear, when multiple interpretations seem possible, or when it is difficult to determine what to ask or how to proceed.',
            'It can also be used before interacting with AI, especially when a prompt feels incomplete, imprecise, or difficult to formulate.',
          ],
        },
        benefitOfUsingIt: {
          question: 'What is the benefit of using it?',
          answer: [
            'When the structure of a situation becomes more visible, decisions often feel less forced and interaction with AI becomes more coherent.',
            'When that structure is unclear, interaction with AI can involve repeated prompting, revision, and adjustment as the intended direction is gradually clarified. Over time, this can lead to unnecessary use of time, attention, and, in some cases, cost.',
            'VIREKA Space reduces this by helping establish a clearer starting point before interaction begins.',
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
            'This policy explains how we collect, use, and protect your information.',
            'We are committed to transparency and user privacy.',
          ],
        },
        informationProvided: {
          title: 'Information You Provide',
          content: [
            'We collect information you input for clarification purposes.',
            'This data is used to provide the service and improve functionality.',
          ],
        },
        technicalInformation: {
          title: 'Technical Information',
          content: [
            'We may collect technical data for service improvement.',
            'This includes usage patterns and system performance data.',
          ],
        },
        dataUsage: {
          title: 'How We Use Data',
          content: [
            'Data is used to provide and improve the service.',
            'We do not sell personal information to third parties.',
          ],
        },
        aiProcessing: {
          title: 'AI Processing',
          content: [
            'Your inputs may be processed by AI systems.',
            'We take measures to protect privacy during AI processing.',
          ],
        },
        thirdPartyServices: {
          title: 'Third-Party Services',
          content: [
            'We may use trusted third-party services for functionality.',
            'These services are selected with privacy in mind.',
          ],
        },
        userControlUpdates: {
          title: 'User Control and Updates',
          content: [
            'You have control over your data and account.',
            'We will notify users of significant policy changes.',
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
            'Please read them carefully before using the service.',
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
            'VIREKA Space provides structure for understanding.',
            'It does not provide professional advice or diagnoses.',
          ],
        },
        userResponsibility: {
          title: 'User Responsibility',
          content: [
            'You are responsible for how you use the insights gained.',
            'The service is a tool for clarity, not a substitute for judgment.',
          ],
        },
        availabilityChanges: {
          title: 'Availability and Changes',
          content: [
            'Service availability may vary.',
            'We reserve the right to modify or discontinue the service.',
          ],
        },
        limitationOfLiability: {
          title: 'Limitation of Liability',
          content: [
            'VIREKA Space is provided "as is" without warranties.',
            'We are not liable for decisions made based on service use.',
          ],
        },
        updatesToTerms: {
          title: 'Updates to Terms',
          content: [
            'Terms may be updated periodically.',
            'Continued use constitutes acceptance of updated terms.',
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
      plan: 'Plan',
      privacy: 'Privacidad',
      terms: 'Términos',
      contact: 'Contacto',
    },
    hero: {
      badge: 'VIREKA SPACE',
      title: [
        'CLARIDAD ANTES DE DECIDIR',
        'CLARIDAD ANTES DE USAR IA',
      ],
      subtitle: 'VIREKA Space ayuda a distinguir lo que sucede de lo que se asume, para que las respuestas partan de una comprensión más clara.',
      clarifyButton: 'Aclarar una situación',
      aiButton: 'Interacción con IA',
      developedBy: 'Desarrollado por Anthony Escobedo',
      basedOn: 'Basado en <em>Beyond Thought: Awareness as Design Intelligence</em>',
    },
    footer: {
      privacy: 'Privacidad',
      terms: 'Términos',
      contact: 'Contacto',
      copyright: '© VIREKA Space',
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
      pageTitle: 'Aclarar una situación',
      heroTitle: 'Aclarar una situación',
      descriptionParagraph: 'Vireka distingue lo que parece estar sucediendo, lo que puede suponerse y lo que puede permanecer incierto para que la respuesta pueda comenzar desde una estructura más clara.',
      inputLabel: 'Situación',
      inputPlaceholder: 'Describe la situación tal como se presenta actualmente',
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
      clarifyingQuestion: 'Pregunta aclaratoria',
      optional: 'Opcional',
      suggestedQuestions: 'Preguntas sugeridas',
      clarificationPath: 'Ruta de aclaración',
      clarificationPathDescription: 'Las reflexiones anteriores pueden expandirse cuando sea necesario, mientras la respuesta más reciente permanece visible.',
      response: 'Respuesta',
      listening: 'Escuchando...',
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
        'El uso gratuito incluye 20 interacciones por día. El acceso se reanuda mañana o con una suscripción.',
      genericNoticeTitle: 'Aviso',
      anUnexpectedErrorOccurred: 'Ocurrió un error inesperado.',
      loadingText: 'Aclarando...',
      doneButton: 'Hecho',
      followupLabel: 'Seguimiento',
      followupPlaceholder: 'Añade cualquier detalle',
      followupHelper: 'Un detalle adicional puede ayudar a distinguir la observación de la interpretación.',
      simpleAction: 'Aclarar',
      badge: 'ACLARAR',
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
      clarifyingQuestion: 'Pregunta aclaratoria',
      optional: 'Opcional',
      suggestedQuestions: 'Preguntas sugeridas',
      clarificationPath: 'Proceso de clarificación de la interacción',
      clarificationPathDescription: 'Cada refinamiento ayuda a distinguir lo que hace la IA de lo que podría asumirse sobre su razonamiento.',
      response: 'Respuesta',
      listening: 'Escuchando...',
      mic: 'Micrófono',
      copyResult: 'Copiar resultado',
      copied: 'Copiado',
      couldNotCopy: 'No se pudo copiar',
      loadingText: 'Aclarando...',
      doneButton: 'Hecho',
      followupLabel: 'Seguimiento',
      followupPlaceholder: 'Añade cualquier detalle',
      followupHelperText: 'Opcional: Haz una pregunta de seguimiento para continuar el análisis.',
      followupHelper: 'Un detalle adicional puede ayudar a clarificar cómo se está interpretando el resultado de la IA.',
      badge: 'INTERACCIÓN CON IA',
      pleaseEnterASituationOrResponse: 'Por favor ingresa una situación o respuesta.',
      speechRecognitionNotSupported: 'El reconocimiento de voz no es compatible con este navegador. Prueba Chrome, Edge o Safari.',
      microphoneError: 'Error de micrófono: ',
      microphoneUnavailableTitle: 'Micrófono no disponible',
      usageLimitNoticeTitle: 'Límite de uso alcanzado',
      usageLimitBody:
        'El uso gratuito incluye 20 interacciones por día. El acceso se reanuda mañana o con una suscripción.',
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
      pageTitle: 'Estructura de uso',
      pageIntro: 'VIREKA Space está diseñado para permanecer accesible mientras permite un uso expandido cuando sea necesario.',
      freeAccessIncludes: 'El acceso gratuito incluye hasta 20 interacciones por día.',
      dailyLimitReached: 'Cuando se alcanza el límite diario, el uso vuelve a estar disponible el día siguiente.',
      extendedAccessSubscription: 'Los usuarios que requieran acceso extendido pueden elegir suscribirse.',
      subscriptionEnablesAdditional: 'La suscripción habilita uso adicional más allá del límite gratuito diario.',
      planStructureMayEvolve: 'La estructura del plan puede evolucionar a medida que el servicio se desarrolla.',
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
      startNewSituation: 'Comenzar nueva situación',
      returnHome: 'Volver al inicio',
    },
    about: {
      pageLabel: 'ACERCA DE',
      heroTitle: 'Acerca de VIREKA Space',
      subtitle: 'Donde la interpretación se aclara',
      sections: {
        function: {
          title: 'Función',
          content: [
            'VIREKA Space se creó para apoyar la claridad en un punto que a menudo pasa desapercibido. Antes de que se tome una decisión o se escriba un prompt de IA, una situación ya se está interpretando. Esa interpretación moldea en silencio lo que parece razonable, lo que parece necesario, lo que parece tener sentido y lo que parece apropiado preguntar.',
            'A veces una situación se siente difícil no porque sea compleja, sino porque varias interpretaciones parecen posibles al mismo tiempo, cada una sugiriendo una dirección ligeramente distinta. Algunos elementos se sienten claros, otros inciertos, y pueden estar formándose suposiciones sin verse del todo. Cuando la interpretación no está clara, las decisiones pueden sentirse presionadas y los prompts más difíciles de formular.',
            'VIREKA Space ofrece una estructura sencilla que ayuda a hacer más visibles estas condiciones. En lugar de sugerir qué debería hacerse, el sistema orienta la atención hacia cómo se está comprendiendo la situación. A medida que la estructura de la interpretación se vuelve más clara, suele ser más fácil percibir si hay claridad suficiente para decidir o para formular un prompt.',
          ],
        },
        effect: {
          title: 'Efecto',
          content: [
            'Cuando la interpretación se vuelve más clara, a menudo cambia lo que parece necesario, lo que parece posible y lo que parece apropiado hacer. Algunas opciones pueden dejar de sentirse urgentes, mientras que otras se vuelven más visibles.',
            'Una estructura más clara no proporciona respuestas ni instrucciones. Permite ver con mayor precisión qué parece estar ocurriendo, qué puede estar influyendo en la situación y qué puede permanecer incierto. A partir de ahí, las decisiones y los prompts suelen formarse con menos fricción.',
          ],
        },
        structuralImplication: {
          title: 'Implicación estructural',
          content: [
            'Los sistemas técnicos dependen de cómo se formulan los objetivos, las preguntas y las condiciones iniciales. Cuando la interpretación no está clara, incluso sistemas bien diseñados pueden producir resultados que parecen desalineados o inesperados. VIREKA Space opera antes de la instrucción, apoyando la claridad en la interpretación que da forma a lo que posteriormente se traduce en decisiones, acciones o prompts, contribuyendo a una relación más coherente entre intención, estructura y resultado.',
          ],
        },
        orientation: {
          title: 'Orientación',
          content: [],
        },
        origin: {
          title: 'Origen',
          content: [
            'VIREKA Space está influenciado por la perspectiva desarrollada en Beyond Thought: Awareness as Design Intelligence.',
            'Refleja un interés en cómo la claridad emerge cuando la estructura de una situación se hace visible antes de ser traducida en decisiones, prompts o sistemas.',
          ],
        },
      },
    },
    faq: {
      pageLabel: 'PREGUNTAS FRECUENTES',
      heroTitle: 'Preguntas Frecuentes',
      subtitle: 'Preguntas comunes sobre VIREKA Space',
      title: 'Preguntas y Respuestas',
      questions: {
        whatIsVirekaSpace: {
          question: '¿Qué es VIREKA Space?',
          answer: [
            'VIREKA Space es un entorno estructurado para aclarar cómo se está comprendiendo una situación antes de tomar una decisión o escribir un prompt de IA.',
            'Ayuda a hacer visible lo que parece estar ocurriendo, lo que se está interpretando y lo que permanece incierto, de modo que la estructura de una situación pueda verse con mayor claridad antes de actuar.',
          ],
        },
        providesAnswers: {
          question: '¿VIREKA Space proporciona respuestas o recomendaciones?',
          answer: [
            'VIREKA Space no proporciona respuestas, consejos ni recomendaciones.',
            'Ayuda a hacer más visible la estructura de la interpretación para que resulte más claro si puede tomarse una decisión o cómo podría formularse un prompt.',
          ],
        },
        isAITool: {
          question: '¿Es una herramienta de IA?',
          answer: [
            'VIREKA Space no funciona como una herramienta de IA típica que genera respuestas o resultados.',
            'Opera en una etapa anterior, aportando claridad sobre cómo se está comprendiendo una situación antes de traducirla en un prompt o instrucción.',
            'Puede utilizarse junto con la IA, pero no la sustituye.',
          ],
        },
        worksWithAI: {
          question: '¿Cómo funciona con la IA?',
          answer: [
            'VIREKA Space puede utilizarse antes o junto con la interacción con sistemas de IA.',
            'Ayuda a aclarar qué se está preguntando, qué puede estar siendo asumido y qué permanece incierto, de modo que la interacción con la IA pueda comenzar desde un punto de partida más estructurado en lugar de un prompt ambiguo o poco formado.',
          ],
        },
        clarifyVsAIInteraction: {
          question:
            '¿Cuál es la diferencia entre “Aclarar una situación” e “Interacción con IA”?',
          answer: [
            'Aclarar una situación se centra en la situación misma. Ayuda a hacer visible lo que parece estar ocurriendo, cómo se está interpretando y qué permanece incierto.',
            'Interacción con IA se centra en cómo una situación se traduce en un prompt o interacción con la IA. Ayuda a aclarar qué intenta hacer el prompt, qué puede faltar y cómo se está estructurando la interacción.',
          ],
        },
        whyNotUseAIDirectly: {
          question: '¿Por qué no usar directamente ChatGPT u otra IA?',
          answer: [
            'Los sistemas de IA responden a cómo se describe una situación. Cuando esa descripción es poco clara o incompleta, la respuesta refleja esa estructura, incluso si el sistema mismo está funcionando correctamente.',
            'VIREKA Space opera antes de ese paso, ayudando a hacer más visible la estructura de la situación para que la interacción con la IA pueda comenzar desde un punto de partida más claro.',
          ],
        },
        whenShouldIUseIt: {
          question: '¿Cuándo debería usar VIREKA Space?',
          answer: [
            'VIREKA Space puede utilizarse cuando una situación se siente poco clara, cuando varias interpretaciones parecen posibles o cuando resulta difícil determinar qué preguntar o cómo proceder.',
            'También puede utilizarse antes de interactuar con la IA, especialmente cuando un prompt se siente incompleto, impreciso o difícil de formular.',
          ],
        },
        benefitOfUsingIt: {
          question: '¿Cuál es el beneficio de usarlo?',
          answer: [
            'Cuando la estructura de una situación se vuelve más visible, las decisiones suelen sentirse menos forzadas y la interacción con la IA se vuelve más coherente.',
            'Cuando esa estructura no está clara, la interacción con la IA puede implicar repetición de prompts, revisiones y ajustes a medida que la dirección pretendida se va aclarando gradualmente. Con el tiempo, esto puede implicar un uso innecesario de tiempo, atención y, en algunos casos, coste.',
            'VIREKA Space reduce esto al ayudar a establecer un punto de partida más claro antes de que la interacción comience.',
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
            'Esta política explica cómo recopilamos, usamos y protegemos tu información.',
            'Estamos comprometidos con la transparencia y la privacidad del usuario.',
          ],
        },
        informationProvided: {
          title: 'Información que Proporcionas',
          content: [
            'Recopilamos información que ingresas para fines de aclaración.',
            'Estos datos se usan para proporcionar el servicio y mejorar la funcionalidad.',
          ],
        },
        technicalInformation: {
          title: 'Información Técnica',
          content: [
            'Podemos recopilar datos técnicos para la mejora del servicio.',
            'Esto incluye patrones de uso y datos de rendimiento del sistema.',
          ],
        },
        dataUsage: {
          title: 'Cómo Usamos los Datos',
          content: [
            'Los datos se usan para proporcionar y mejorar el servicio.',
            'No vendemos información personal a terceros.',
          ],
        },
        aiProcessing: {
          title: 'Procesamiento de IA',
          content: [
            'Tus entradas pueden ser procesadas por sistemas de IA.',
            'Tomamos medidas para proteger la privacidad durante el procesamiento de IA.',
          ],
        },
        thirdPartyServices: {
          title: 'Servicios de Terceros',
          content: [
            'Podemos usar servicios de terceros confiables para la funcionalidad.',
            'Estos servicios son seleccionados teniendo en cuenta la privacidad.',
          ],
        },
        userControlUpdates: {
          title: 'Control de Usuario y Actualizaciones',
          content: [
            'Tienes control sobre tus datos y cuenta.',
            'Notificaremos a los usuarios cambios significativos en la política.',
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
            'Por favor léelos cuidadosamente antes de usar el servicio.',
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
            'VIREKA Space proporciona estructura para la comprensión.',
            'No proporciona consejos profesionales o diagnósticos.',
          ],
        },
        userResponsibility: {
          title: 'Responsabilidad del Usuario',
          content: [
            'Eres responsable de cómo usas las ideas obtenidas.',
            'El servicio es una herramienta para la claridad, no un sustituto del juicio.',
          ],
        },
        availabilityChanges: {
          title: 'Disponibilidad y Cambios',
          content: [
            'La disponibilidad del servicio puede variar.',
            'Nos reservamos el derecho de modificar o discontinuar el servicio.',
          ],
        },
        limitationOfLiability: {
          title: 'Limitación de Responsabilidad',
          content: [
            'VIREKA Space se proporciona "tal como está" sin garantías.',
            'No somos responsables de las decisiones tomadas basadas en el uso del servicio.',
          ],
        },
        updatesToTerms: {
          title: 'Actualizaciones de los Términos',
          content: [
            'Los términos pueden actualizarse periódicamente.',
            'El uso continuado constituye la aceptación de los términos actualizados.',
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
      plan: 'Plano',
      privacy: 'Privacidade',
      terms: 'Termos',
      contact: 'Contato',
    },
    hero: {
      badge: 'VIREKA SPACE',
      title: [
        'CLAREZA ANTES DE DECIDIR',
        'CLAREZA ANTES DE USAR IA',
      ],
      subtitle: 'VIREKA Space ajuda a distinguir o que acontece do que se assume, para que as respostas partam de uma compreensão mais clara.',
      clarifyButton: 'Clarificar uma situação',
      aiButton: 'Interação com IA',
      developedBy: 'Desenvolvido por Anthony Escobedo',
      basedOn: 'Baseado em <em>Beyond Thought: Awareness as Design Intelligence</em>',
    },
    footer: {
      privacy: 'Privacidade',
      terms: 'Termos',
      contact: 'Contato',
      copyright: '© VIREKA Space',
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
      pageTitle: 'Clarificar uma situação',
      heroTitle: 'Clarificar uma situação',
      descriptionParagraph: 'Vireka distingue o que parece estar acontecendo, o que pode ser suposto e o que pode permanecer incerto para que a resposta possa começar de uma estrutura mais clara.',
      inputLabel: 'Situação',
      inputPlaceholder: 'Descreva a situação como se apresenta atualmente',
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
      clarifyingQuestion: 'Pergunta esclarecedora',
      optional: 'Opcional',
      suggestedQuestions: 'Perguntas sugeridas',
      clarificationPath: 'Caminho de clarificação',
      clarificationPathDescription: 'Reflexões anteriores podem ser expandidas quando necessário, enquanto a resposta mais recente permanece visível.',
      response: 'Resposta',
      listening: 'Ouvindo...',
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
        'O uso gratuito inclui 20 interações por dia. O acesso é retomado amanhã ou com uma assinatura.',
      genericNoticeTitle: 'Aviso',
      anUnexpectedErrorOccurred: 'Ocorreu um erro inesperado.',
      loadingText: 'Esclarecendo...',
      doneButton: 'Concluído',
      followupLabel: 'Acompanhamento',
      followupPlaceholder: 'Adicione qualquer detalhe',
      followupHelper: 'Um detalhe adicional pode ajudar a distinguir observação de interpretação.',
      badge: 'CLARIFICAR',
      simpleAction: 'Clarificar',
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
      clarifyingQuestion: 'Pergunta esclarecedora',
      optional: 'Opcional',
      suggestedQuestions: 'Perguntas sugeridas',
      clarificationPath: 'Processo de clarificação da interação',
      clarificationPathDescription: 'Cada refinamento ajuda a distinguir o que a IA está fazendo do que pode estar sendo assumido sobre seu raciocínio.',
      response: 'Resposta',
      listening: 'Ouvindo...',
      mic: 'Microfone',
      copyResult: 'Copiar resultado',
      copied: 'Copiado',
      couldNotCopy: 'Não foi possível copiar',
      loadingText: 'Esclarecendo...',
      doneButton: 'Concluído',
      followupLabel: 'Acompanhamento',
      followupPlaceholder: 'Adicione qualquer detalhe',
      followupHelperText: 'Opcional: Faça uma pergunta de acompanhamento para continuar a análise.',
      followupHelper: 'Um detalhe adicional pode ajudar a esclarecer como o resultado da IA está sendo interpretado.',
      badge: 'INTERAÇÃO COM IA',
      pleaseEnterASituationOrResponse: 'Por favor, insira uma situação ou resposta.',
      speechRecognitionNotSupported: 'Reconhecimento de fala não é suportado neste navegador. Tente Chrome, Edge ou Safari.',
      microphoneError: 'Erro no microfone: ',
      microphoneUnavailableTitle: 'Microfone indisponível',
      usageLimitNoticeTitle: 'Limite de uso atingido',
      usageLimitBody:
        'O uso gratuito inclui 20 interações por dia. O acesso é retomado amanhã ou com uma assinatura.',
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
      pageTitle: 'Estrutura de uso',
      pageIntro: 'VIREKA Space é projetado para permanecer acessível enquanto permite uso expandido quando necessário.',
      freeAccessIncludes: 'O acesso gratuito inclui até 20 interações por dia.',
      dailyLimitReached: 'Quando o limite diário é alcançado, o uso fica disponível novamente no dia seguinte.',
      extendedAccessSubscription: 'Usuários que requerem acesso estendido podem escolher assinar.',
      subscriptionEnablesAdditional: 'A assinatura habilita uso adicional além do limite gratuito diário.',
      planStructureMayEvolve: 'A estrutura do plano pode evoluir conforme o serviço se desenvolve.',
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
            'A VIREKA Space foi criada para apoiar a clareza em um ponto que muitas vezes passa despercebido. Antes que uma decisão seja tomada ou que um prompt de IA seja escrito, uma situação já está sendo interpretada. Essa interpretação molda silenciosamente o que parece razoável, o que parece necessário, o que parece fazer sentido e o que parece apropriado perguntar.',
            'Às vezes, uma situação parece difícil não porque seja complexa, mas porque várias interpretações parecem possíveis ao mesmo tempo, cada uma sugerindo uma direção ligeiramente diferente. Alguns elementos parecem claros, outros incertos, e certas suposições podem estar se formando sem serem totalmente percebidas. Quando a interpretação não está clara, as decisões podem parecer pressionadas e os prompts mais difíceis de formular.',
            'A VIREKA Space oferece uma estrutura simples que ajuda a tornar essas condições mais visíveis. Em vez de sugerir o que deve ser feito, o sistema orienta a atenção para como a situação está sendo compreendida. À medida que a estrutura da interpretação se torna mais clara, costuma ficar mais fácil perceber se já existe clareza suficiente para decidir ou para formular um prompt.',
          ],
        },
        effect: {
          title: 'Efeito',
          content: [
            'Quando a interpretação se torna mais clara, frequentemente muda o que parece necessário, o que parece possível e o que parece apropriado fazer. Algumas opções podem deixar de parecer urgentes, enquanto outras se tornam mais visíveis.',
            'Uma estrutura mais clara não fornece respostas nem instruções. Ela permite perceber com maior precisão o que parece estar acontecendo, o que pode estar influenciando a situação e o que pode permanecer incerto. A partir disso, decisões e prompts tendem a se formar com menos fricção.',
          ],
        },
        structuralImplication: {
          title: 'Implicação estrutural',
          content: [
            'Sistemas técnicos dependem de como objetivos, perguntas e condições iniciais são formulados. Quando a interpretação não está clara, mesmo sistemas bem projetados podem produzir resultados que parecem desalinhados ou inesperados. A VIREKA Space opera antes da instrução, apoiando a clareza na interpretação que molda aquilo que posteriormente é traduzido em decisões, ações ou prompts, contribuindo para uma relação mais coerente entre intenção, estrutura e resultado.',
          ],
        },
        orientation: {
          title: 'Orientação',
          content: [],
        },
        origin: {
          title: 'Origem',
          content: [
            'O VIREKA Space é influenciado pela perspectiva desenvolvida em Beyond Thought: Awareness as Design Intelligence.',
            'Reflete um interesse em como a clareza emerge quando a estrutura de uma situação se torna visível antes de ser traduzida em decisões, prompts ou sistemas.',
          ],
        },
      },
    },
    faq: {
      pageLabel: 'PERGUNTAS FREQUENTES',
      heroTitle: 'Perguntas Frequentes',
      subtitle: 'Perguntas comuns sobre VIREKA Space',
      title: 'Perguntas e Respostas',
      questions: {
        whatIsVirekaSpace: {
          question: 'O que é o VIREKA Space?',
          answer: [
            'O VIREKA Space é um ambiente estruturado para esclarecer como uma situação está sendo compreendida antes que uma decisão seja tomada ou um prompt de IA seja escrito.',
            'Ele ajuda a tornar visível o que parece estar acontecendo, o que está sendo interpretado e o que permanece incerto, para que a estrutura de uma situação possa ser vista com mais clareza antes da ação.',
          ],
        },
        providesAnswers: {
          question: 'O VIREKA Space fornece respostas ou recomendações?',
          answer: [
            'O VIREKA Space não fornece respostas, conselhos ou recomendações.',
            'Ele ajuda a tornar mais visível a estrutura da interpretação para que fique mais claro se uma decisão pode ser tomada ou como um prompt pode ser formulado.',
          ],
        },
        isAITool: {
          question: 'Isso é uma ferramenta de IA?',
          answer: [
            'O VIREKA Space não funciona como uma ferramenta de IA típica que gera respostas ou resultados.',
            'Ele atua antes, oferecendo clareza sobre como uma situação está sendo compreendida antes de ser traduzida em um prompt ou instrução.',
            'Pode ser usado junto com IA, mas não a substitui.',
          ],
        },
        worksWithAI: {
          question: 'Como funciona com IA?',
          answer: [
            'O VIREKA Space pode ser usado antes ou junto com a interação com sistemas de IA.',
            'Ele ajuda a esclarecer o que está sendo perguntado, o que pode estar sendo assumido e o que permanece incerto, para que a interação com a IA comece a partir de um ponto de partida mais estruturado, em vez de um prompt ambíguo ou pouco formado.',
          ],
        },
        clarifyVsAIInteraction: {
          question:
            'Qual é a diferença entre “Clarificar uma situação” e “Interação com IA”?',
          answer: [
            'Clarificar uma situação foca na própria situação. Ajuda a tornar visível o que parece estar acontecendo, como está sendo interpretado e o que permanece incerto.',
            'Interação com IA foca em como uma situação é traduzida em um prompt ou interação com IA. Ajuda a esclarecer o que o prompt está tentando fazer, o que pode estar faltando e como a interação está sendo estruturada.',
          ],
        },
        whyNotUseAIDirectly: {
          question: 'Por que não usar diretamente o ChatGPT ou outra IA?',
          answer: [
            'Sistemas de IA respondem com base em como uma situação é descrita. Quando essa descrição é pouco clara ou incompleta, a resposta reflete essa estrutura, mesmo que o próprio sistema esteja funcionando corretamente.',
            'O VIREKA Space atua antes desse ponto, ajudando a tornar mais visível a estrutura da situação para que a interação com IA possa começar a partir de um ponto de partida mais claro.',
          ],
        },
        whenShouldIUseIt: {
          question: 'Quando devo usar o VIREKA Space?',
          answer: [
            'O VIREKA Space pode ser usado quando uma situação parece pouco clara, quando múltiplas interpretações parecem possíveis ou quando é difícil determinar o que perguntar ou como proceder.',
            'Ele também pode ser usado antes de interagir com IA, especialmente quando um prompt parece incompleto, impreciso ou difícil de formular.',
          ],
        },
        benefitOfUsingIt: {
          question: 'Qual é o benefício de usar isso?',
          answer: [
            'Quando a estrutura de uma situação se torna mais visível, as decisões tendem a parecer menos forçadas e a interação com IA se torna mais coerente.',
            'Quando essa estrutura não está clara, a interação com IA pode envolver repetição de prompts, revisão e ajustes à medida que a direção pretendida vai sendo esclarecida gradualmente. Com o tempo, isso pode resultar em uso desnecessário de tempo, atenção e, em alguns casos, custo.',
            'O VIREKA Space reduz isso ao ajudar a estabelecer um ponto de partida mais claro antes de a interação começar.',
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
            'Esta política explica como coletamos, usamos e protegemos suas informações.',
            'Estamos comprometidos com transparência e privacidade do usuário.',
          ],
        },
        informationProvided: {
          title: 'Informações que Você Fornece',
          content: [
            'Coletamos informações que você insere para fins de esclarecimento.',
            'Estes dados são usados para fornecer o serviço e melhorar funcionalidade.',
          ],
        },
        technicalInformation: {
          title: 'Informações Técnicas',
          content: [
            'Podemos coletar dados técnicos para melhoria do serviço.',
            'Isso inclui padrões de uso e dados de desempenho do sistema.',
          ],
        },
        dataUsage: {
          title: 'Como Usamos Dados',
          content: [
            'Dados são usados para fornecer e melhorar o serviço.',
            'Não vendemos informações pessoais a terceiros.',
          ],
        },
        aiProcessing: {
          title: 'Processamento de IA',
          content: [
            'Suas entradas podem ser processadas por sistemas de IA.',
            'Tomamos medidas para proteger privacidade durante processamento de IA.',
          ],
        },
        thirdPartyServices: {
          title: 'Serviços de Terceiros',
          content: [
            'Podemos usar serviços de terceiros confiáveis para funcionalidade.',
            'Estes serviços são selecionados com privacidade em mente.',
          ],
        },
        userControlUpdates: {
          title: 'Controle do Usuário e Atualizações',
          content: [
            'Você tem controle sobre seus dados e conta.',
            'Notificaremos usuários sobre mudanças significativas na política.',
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
            'Ao usar VIREKA Space, você concorda com estes termos.',
            'Por favor leia-os cuidadosamente antes de usar o serviço.',
          ],
        },
        useOfService: {
          title: 'Uso do Serviço',
          content: [
            'Você pode usar VIREKA Space para fins de esclarecimento pessoal.',
            'Uso comercial requer permissão explícita.',
          ],
        },
        natureOfService: {
          title: 'Natureza do Serviço',
          content: [
            'VIREKA Space fornece estrutura para compreensão.',
            'Não fornece conselhos profissionais ou diagnósticos.',
          ],
        },
        userResponsibility: {
          title: 'Responsabilidade do Usuário',
          content: [
            'Você é responsável por como usa as ideias obtidas.',
            'O serviço é uma ferramenta para clareza, não substituto de julgamento.',
          ],
        },
        availabilityChanges: {
          title: 'Disponibilidade e Mudanças',
          content: [
            'Disponibilidade do serviço pode variar.',
            'Reservamos o direito de modificar ou descontinuar o serviço.',
          ],
        },
        limitationOfLiability: {
          title: 'Limitação de Responsabilidade',
          content: [
            'VIREKA Space é fornecido "como está" sem garantias.',
            'Não somos responsáveis por decisões tomadas baseadas no uso do serviço.',
          ],
        },
        updatesToTerms: {
          title: 'Atualizações dos Termos',
          content: [
            'Termos podem ser atualizados periodicamente.',
            'Uso continuado constitui aceitação dos termos atualizados.',
          ],
        },
      },
    },
  },
};

export const getDictionary = (language: Language): TranslationDictionary => {
  return dictionaries[language] || dictionaries.en;
};
