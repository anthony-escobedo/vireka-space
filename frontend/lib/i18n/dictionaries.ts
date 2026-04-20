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
      backToHome: 'Back to home',
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
        description: 'Vireka Space clarifies how situations are interpreted before conclusions guide response.',
        usefulWhenTitle: 'Useful when:',
        usefulWhenList: [
          'meaning feels uncertain',
          'multiple interpretations seem possible',
          'a response is being considered',
          'assumptions may be influencing interpretation',
          'an AI prompt needs clearer structure',
        ],
        beginWith: 'Begin with a simple description.',
        systemNote: 'The system does not search for answers. It helps clarify how situations are being understood.',
      },
      begin: 'Begin',
      notNow: 'Not now',
    },
    clarify: {
      pageTitle: 'Clarify a situation',
      heroTitle: 'Clarify a situation',
      introText: 'Describe the situation as it currently appears.',
      descriptionParagraph: 'Vireka distinguishes what appears to be happening, what may be assumed, and what may remain unclear so response can begin from clearer structure.',
      inputLabel: 'Situation',
      inputPlaceholder: 'Example: The situation appears to call for action, but it is not yet clear which factors are influencing the outcome.',
      helperText: 'Include anything that may help clarify the situation or where interpretation feels uncertain.',
      pageLabel: 'CLARIFY',
      backLink: 'Back to home',
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
      anUnexpectedErrorOccurred: 'An unexpected error occurred.',
      loadingText: 'Clarifying...',
      doneButton: 'Done',
      followupLabel: 'Follow-up',
      followupPlaceholder: 'Add detail that may help distinguish what is happening from what may be assumed.',
      followupHelper: 'Additional detail may help separate observation from interpretation.',
      badge: 'CLARIFY',
      simpleAction: 'Clarify',
    },
    aiInteraction: {
      pageTitle: 'AI interaction',
      heroTitle: 'See clearly before deciding what to ask AI to do',
      introText: 'Describe the prompt, output issue, or AI-related situation as it currently appears.',
      descriptionParagraph: 'VIREKA Space helps distinguish what appears to be happening from what may be assumed, improving clarity of interaction with AI.',
      inputLabel: 'What is happening in the AI interaction?',
      inputPlaceholder: 'Example: The output seems reasonable, but something about the reasoning feels off.',
      helperText: 'Include the prompt, the objective, the output, or anything that may help clarify where the interaction feels unclear.',
      pageLabel: 'AI INTERACTION',
      backLink: 'Back to home',
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
      loadingText: 'Analyzing...',
      doneButton: 'Done',
      followupLabel: 'Follow-up',
      followupPlaceholder: 'Add detail that may help distinguish the AI output from assumptions about it.',
      followupHelperText: 'Optional: Ask a follow-up question to continue the analysis.',
      followupHelper: 'Additional detail may help clarify how the AI output is being interpreted.',
      badge: 'AI INTERACTION',
      pleaseEnterASituationOrResponse: 'Please enter a situation or response.',
      speechRecognitionNotSupported: 'Speech recognition is not supported in this browser. Try Chrome, Edge, or Safari.',
      microphoneError: 'Microphone error: ',
      anUnexpectedErrorOccurred: 'An unexpected error occurred.',
    },
    account: {
      pageTitle: 'Account access in VIREKA Space',
      pageIntro: 'Account access becomes relevant when subscription or ongoing plan management is required.',
      freeUsageNoSignIn: 'Free usage does not currently require sign-in.',
      accountRequiredForSubscription: 'An account is only required when subscribing to extended access.',
      signInAllowsSubscription: 'Sign-in allows subscription status, usage allowances, and access continuity to be associated with the same user.',
      authenticationMethods: 'Authentication may be completed using a supported sign-in provider or email verification.',
      functionalityMayExpand: 'Account functionality may expand as the service develops.',
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
      messagesReviewed: 'Messages are reviewed as availability allows.',
    },
    staticPage: {
      backToHome: 'Back to home',
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
            'VIREKA Space provides a simple structure that helps make these conditions more visible. Instead of suggesting what should be done, the system helps bring attention to how the situation is being understood. As the structure of interpretation becomes clearer, it often becomes easier to sense whether enough clarity exists for a decision or for forming a prompt. In many cases, this also clarifies the intention guiding the question itself.',
            'This can support a quieter kind of confidence. Not certainty in the outcome, but greater ease in how the situation itself is being seen.',
            'AI systems respond to how situations are described. Even small differences in wording can influence what the system emphasizes, how it reasons, and what kinds of responses appear plausible. When interpretation becomes clearer, interaction with AI often becomes more coherent as well.',
            'Interpretation does not only influence individual decisions. It also influences how systems are designed. The way a situation is understood shapes the direction of thought, the questions that arise, and the structures that are created in response. In this sense, design begins before implementation. It begins in how something is seen.',
          ],
        },
        structuralImplication: {
          title: "Structural Implication",
          content: [
            'Interpretation does not only influence individual decisions. It also influences how systems are designed. The way a situation is understood shapes the direction of thought, the questions that arise, and the structures that are created in response. In this sense, design begins before implementation. It begins in how something is seen.'
          ]
        },
        orientation: {
          title: "Orientation",
          content: [
            'The ideas underlying VIREKA Space are explored in Beyond Thought: Awareness as Design Intelligence, which considers how awareness influences interpretation, reasoning, and design. VIREKA Space brings these ideas into a practical environment where interpretation can become more visible before action is taken.'
          ]
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
            'VIREKA Space helps clarify how a situation is being interpreted before a decision is made or an AI prompt is written. It distinguishes what appears to be happening from what may be assumed, what remains uncertain, and what may be influencing the situation. The aim is not to provide answers, but to support clearer understanding of how meaning is forming.',
          ],
        },
        whyClarify: {
          question: 'Why clarify a situation before using AI?',
          answer: [
            'AI systems respond to how situations are framed. Even small differences in wording can influence what the system emphasizes and how it reasons. Clarifying what is known, what may be assumed, and what remains unclear helps ensure the system is working on the right problem, and that what is being asked reflects what is actually meant.',
          ],
        },
        promptEngineering: {
          question: 'How is VIREKA Space different from prompt engineering?',
          answer: [
            'Prompt engineering focuses on improving how instructions are written once the intended task is already defined. VIREKA Space focuses earlier, on clarifying how the situation itself is being interpreted before instructions are written. In many situations, clearer interpretation also brings greater clarity to intention, allowing prompts to reflect what is actually meant rather than what is initially assumed.',
          ],
        },
        providesAnswers: {
          question: 'Does VIREKA Space provide answers?',
          answer: [
            'VIREKA Space does not attempt to provide solutions or recommendations. Instead, it helps clarify how the situation is being understood so that decisions and prompts can form with greater visibility into what is known, what may be assumed, and what remains uncertain.',
          ],
        },
        decisionTool: {
          question: 'Is VIREKA Space a decision-making tool?',
          answer: [
            'VIREKA Space does not make decisions. It helps clarify interpretation so decisions can form with greater visibility into the structure of the situation. This can help reduce the influence of unnoticed assumptions and support more stable reasoning.',
          ],
        },
        alignment: {
          question: 'How does VIREKA Space relate to AI alignment?',
          answer: [
            'Technical alignment research focuses on ensuring that AI systems behave according to specified objectives. VIREKA Space operates earlier, supporting clarity about how situations and objectives are interpreted before they are translated into instructions. Clearer interpretation can help ensure that what is specified reflects what is actually intended, both in individual prompting and in the design of systems that scale.',
          ],
        },
        aiAgents: {
          question: 'Where does VIREKA Space fit in workflows that include AI agents or automated systems?',
          answer: [
            'In workflows involving AI, early interpretation often shapes downstream outputs. When interpretation is unclear, assumptions can propagate through multiple steps of reasoning or automation. Clarifying interpretation earlier can help maintain coherence across the workflow.',
          ],
        },
        aiImprovement: {
          question: 'If AI keeps improving, won\'t it figure out what we mean anyway?',
          answer: [
            'More capable systems can often infer context, but they still respond to how situations are framed. Increased capability does not eliminate the influence of interpretation. Clearer framing often produces more coherent results, even when systems are highly advanced.',
          ],
        },
        isCoaching: {
          question: 'Is VIREKA Space a form of coaching or therapy?',
          answer: [
            'No. VIREKA Space does not provide psychological guidance or personal advice. It focuses only on clarifying how situations are being interpreted so that reasoning and prompting can begin from clearer conditions.',
          ],
        },
        whoIsFor: {
          question: 'Who is VIREKA Space for?',
          answer: [
            'VIREKA Space can be useful for anyone working through situations where interpretation may influence decisions, communication, or interaction with AI. It is especially relevant where meaning may be forming quickly or where multiple interpretations appear possible.',
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
      backToHome: 'Volver al inicio',
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
        description: 'Vireka Space aclara cómo se interpretan las situaciones antes de que las conclusiones guíen la respuesta.',
        usefulWhenTitle: 'Útil cuando:',
        usefulWhenList: [
          'el significado parece incierto',
          'múltiples interpretaciones parecen posibles',
          'se está considerando una respuesta',
          'las suposiciones pueden estar influyendo en la interpretación',
          'un prompt de IA necesita una estructura más clara',
        ],
        beginWith: 'Comienza con una descripción simple.',
        systemNote: 'El sistema no busca respuestas. Ayuda a aclarar cómo se están comprendiendo las situaciones.',
      },
      begin: 'Comenzar',
      notNow: 'Ahora no',
    },
    clarify: {
      pageTitle: 'Aclarar una situación',
      heroTitle: 'Aclarar una situación',
      introText: 'Describe la situación tal como aparece actualmente.',
      descriptionParagraph: 'Vireka distingue lo que parece estar sucediendo, lo que puede suponerse y lo que puede permanecer incierto para que la respuesta pueda comenzar desde una estructura más clara.',
      inputLabel: 'Situación',
      inputPlaceholder: 'Ejemplo: La situación parece requerir acción, pero aún no está claro qué factores están influyendo en el resultado.',
      helperText: 'Incluye cualquier cosa que pueda ayudar a aclarar la situación o donde la interpretación se siente incierta.',
      pageLabel: 'ACLARAR SITUACIÓN',
      backLink: 'Volver al inicio',
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
      anUnexpectedErrorOccurred: 'Ocurrió un error inesperado.',
      loadingText: 'Aclarando...',
      doneButton: 'Hecho',
      followupLabel: 'Seguimiento',
      followupPlaceholder: 'Agrega un detalle que pueda ayudar a distinguir lo que está ocurriendo de lo que podría estarse asumiendo.',
      followupHelper: 'Un detalle adicional puede ayudar a distinguir la observación de la interpretación.',
      simpleAction: 'Aclarar',
      badge: 'ACLARAR',
    },
    aiInteraction: {
      pageTitle: 'Interacción con IA',
      heroTitle: 'Ver claramente antes de decidir qué pedirle a la IA que haga',
      introText: 'Describe el prompt, el problema de salida o la situación relacionada con la IA como aparece actualmente.',
      descriptionParagraph: 'VIREKA Space ayuda a distinguir lo que parece estar sucediendo de lo que puede suponerse, mejorando la claridad de la interacción con la IA.',
      inputLabel: '¿Qué está sucediendo en la interacción con la IA?',
      inputPlaceholder: 'Ejemplo: La salida parece razonable, pero algo sobre el razonamiento se siente incorrecto.',
      helperText: 'Incluye el prompt, el objetivo, la salida o cualquier cosa que pueda ayudar a aclarar dónde la interacción se siente poco clara.',
      pageLabel: 'INTERACCIÓN CON IA',
      backLink: 'Volver al inicio',
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
      loadingText: 'Analizando...',
      doneButton: 'Hecho',
      followupLabel: 'Seguimiento',
      followupPlaceholder: 'Agrega un detalle que pueda ayudar a distinguir el resultado de la IA de las suposiciones sobre él.',
      followupHelperText: 'Opcional: Haz una pregunta de seguimiento para continuar el análisis.',
      followupHelper: 'Un detalle adicional puede ayudar a clarificar cómo se está interpretando el resultado de la IA.',
      badge: 'INTERACCIÓN CON IA',
      pleaseEnterASituationOrResponse: 'Por favor ingresa una situación o respuesta.',
      speechRecognitionNotSupported: 'El reconocimiento de voz no es compatible con este navegador. Prueba Chrome, Edge o Safari.',
      microphoneError: 'Error de micrófono: ',
      anUnexpectedErrorOccurred: 'Ocurrió un error inesperado.',
    },
    account: {
      pageTitle: 'Acceso a la cuenta en VIREKA Space',
      pageIntro: 'El acceso a la cuenta se vuelve relevante cuando se requiere suscripción o gestión continua del plan.',
      freeUsageNoSignIn: 'El uso gratuito actualmente no requiere inicio de sesión.',
      accountRequiredForSubscription: 'Una cuenta solo se requiere al suscribirse al acceso extendido.',
      signInAllowsSubscription: 'El inicio de sesión permite que el estado de suscripción, los límites de uso y la continuidad de acceso se asocien con el mismo usuario.',
      authenticationMethods: 'La autenticación puede completarse usando un proveedor de inicio de sesión compatible o verificación por correo electrónico.',
      functionalityMayExpand: 'La funcionalidad de la cuenta puede expandirse a medida que el servicio se desarrolla.',
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
      feedbackHelpsImprove: 'La retroalimentación ayuda a mejorar la claridad, confiabilidad y usabilidad con el tiempo.',
      messagesReviewed: 'Los mensajes se revisan según la disponibilidad.',
    },
    staticPage: {
      backToHome: 'Volver al inicio',
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
      subtitle: 'La comprensión comienza con la estructura',
      sections: {
        function: {
          title: 'Función',
          content: [
            'VIREKA Space es un entorno estructurado para aclarar cómo se están comprendiendo las situaciones antes de que se tomen decisiones o se escriban prompts de IA.',
            'La mayoría de los enfoques se centran en mejorar las respuestas después de que las conclusiones ya han comenzado a formarse. VIREKA Space se centra antes, en las condiciones que influyen en la interpretación en primer lugar.',
            'Cuando la interpretación se vuelve más clara, la claridad de las decisiones a menudo mejora, y las respuestas requieren menos ajustes.',
            'VIREKA Space ayuda a distinguir:',
            '• lo que se puede observar directamente',
            '• lo que puede suponerse o interpretarse',
            '• lo que permanece incierto',
            'Al distinguir observación, suposición e incertidumbre, la interpretación se vuelve más clara, permitiendo tanto el razonamiento humano como la interacción con IA proceder desde condiciones más estables.',
            'El sistema no proporciona consejos ni prescribe conclusiones. En su lugar, estructura la interpretación para que las decisiones y los prompts puedan formarse con mayor claridad.',
          ],
        },
        orientation: {
          title: 'Orientación',
          content: [
            'VIREKA Space está diseñado para momentos en que el significado parece incierto.',
            'Apoya la toma de decisiones proporcionando una estructura más clara.',
          ],
        },
        origin: {
          title: 'Origen',
          content: [
            'Basado en "Beyond Thought: Awareness as Design Intelligence".',
            'Desarrollado por Anthony Escobedo.',
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
            'VIREKA Space ayuda a clarificar cómo se está interpretando una situación antes de tomar una decisión o escribir un prompt de IA. Distingue lo que parece estar sucediendo de lo que puede suponerse, lo que permanece incierto y lo que puede estar influyendo en la situación. El objetivo no es proporcionar respuestas, sino apoyar una comprensión más clara de cómo se está formando el significado.',
          ],
        },
        whyClarify: {
          question: '¿Por qué aclarar una situación antes de usar IA?',
          answer: [
            'Los sistemas de IA responden a cómo se enmarcan las situaciones. Incluso pequeñas diferencias en la redacción pueden influir en lo que el sistema enfatiza y cómo razona. Clarificar lo que se conoce, lo que puede suponerse y lo que permanece incierto ayuda a asegurar que el sistema esté trabajando en el problema correcto, y que lo que se está preguntando refleje lo que realmente se quiere decir.',
          ],
        },
        promptEngineering: {
          question: '¿Cómo es diferente VIREKA Space de la ingeniería de prompts?',
          answer: [
            'La ingeniería de prompts se enfoca en mejorar cómo se escriben las instrucciones una vez que la tarea pretendida ya está definida. VIREKA Space se enfoca antes, en clarificar cómo se está interpretando la situación misma antes de escribir las instrucciones. En muchas situaciones, una interpretación más clara también trae mayor claridad a la intención, permitiendo que los prompts reflejen lo que realmente se quiere decir en lugar de lo que se asume inicialmente.',
          ],
        },
        providesAnswers: {
          question: '¿Proporciona VIREKA Space respuestas?',
          answer: [
            'VIREKA Space no intenta proporcionar soluciones o recomendaciones. En su lugar, ayuda a clarificar cómo se está comprendiendo la situación para que las decisiones y los prompts puedan formarse con mayor visibilidad sobre lo que se conoce, lo que puede suponerse y lo que permanece incierto.',
          ],
        },
        decisionTool: {
          question: '¿Es VIREKA Space una herramienta de toma de decisiones?',
          answer: [
            'VIREKA Space no toma decisiones. Ayuda a clarificar la interpretación para que las decisiones puedan formarse con mayor visibilidad sobre la estructura de la situación. Esto puede ayudar a reducir la influencia de suposiciones no notadas y apoyar un razonamiento más estable.',
          ],
        },
        alignment: {
          question: '¿Cómo se relaciona VIREKA Space con la alineación de IA?',
          answer: [
            'La investigación de alineación técnica se enfoca en asegurar que los sistemas de IA se comporten según objetivos especificados. VIREKA Space opera antes, apoyando la claridad sobre cómo se interpretan las situaciones y los objetivos antes de que se traduzcan en instrucciones. Una interpretación más clara puede ayudar a asegurar que lo especificado refleje lo que realmente se pretende, tanto en el prompting individual como en el diseño de sistemas que escalan.',
          ],
        },
        aiAgents: {
          question: '¿Dónde encaja VIREKA Space en flujos de trabajo que incluyen agentes de IA o sistemas automatizados?',
          answer: [
            'En flujos de trabajo que involucran IA, la interpretación temprana a menudo moldea las salidas posteriores. Cuando la interpretación no es clara, las suposiciones pueden propagarse a través de múltiples pasos de razonamiento o automatización. Clarificar la interpretación antes puede ayudar a mantener la coherencia en todo el flujo de trabajo.',
          ],
        },
        aiImprovement: {
          question: 'Si la IA sigue mejorando, ¿no averiguará lo que queremos decir de todos modos?',
          answer: [
            'Sistemas más capaces a menudo pueden inferir contexto, pero todavía responden a cómo se enmarcan las situaciones. Mayor capacidad no elimina la influencia de la interpretación. Un enmarcado más claro a menudo produce resultados más coherentes, incluso cuando los sistemas son muy avanzados.',
          ],
        },
        isCoaching: {
          question: '¿Es VIREKA Space una forma de coaching o terapia?',
          answer: [
            'No. VIREKA Space no proporciona orientación psicológica o consejo personal. Se enfoca solo en clarificar cómo se están interpretando las situaciones para que el razonamiento y el prompting puedan comenzar desde condiciones más claras.',
          ],
        },
        whoIsFor: {
          question: '¿Para quién es VIREKA Space?',
          answer: [
            'VIREKA Space puede ser útil para cualquiera que trabaje a través de situaciones donde la interpretación puede influir en decisiones, comunicación o interacción con IA. Es especialmente relevante donde el significado puede estar formándose rápidamente o donde múltiples interpretaciones parecen posibles.',
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
      backToHome: 'Voltar ao início',
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
        description: 'Vireka Space esclarece como as situações são interpretadas antes que as conclusões guiem a resposta.',
        usefulWhenTitle: 'Útil quando:',
        usefulWhenList: [
          'o significado parece incerto',
          'múltiplas interpretações parecem possíveis',
          'uma resposta está sendo considerada',
          'suposições podem estar influenciando a interpretação',
          'um prompt de IA precisa de estrutura mais clara',
        ],
        beginWith: 'Comece com uma descrição simples.',
        systemNote: 'O sistema não busca respostas. Ajuda a esclarecer como as situações estão sendo compreendidas.',
      },
      begin: 'Começar',
      notNow: 'Agora não',
    },
    clarify: {
      pageTitle: 'Clarificar uma situação',
      heroTitle: 'Clarificar uma situação',
      introText: 'Descreva a situação como ela aparece atualmente.',
      descriptionParagraph: 'Vireka distingue o que parece estar acontecendo, o que pode ser suposto e o que pode permanecer incerto para que a resposta possa começar de uma estrutura mais clara.',
      inputLabel: 'Situação',
      inputPlaceholder: 'Exemplo: A situação parece exigir ação, mas ainda não está claro quais fatores estão influenciando o resultado.',
      helperText: 'Inclua qualquer coisa que possa ajudar a esclarecer a situação ou onde a interpretação se sente incerta.',
      pageLabel: 'CLARIFICAR SITUAÇÃO',
      backLink: 'Voltar ao início',
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
      anUnexpectedErrorOccurred: 'Ocorreu um erro inesperado.',
      loadingText: 'Esclarecendo...',
      doneButton: 'Concluído',
      followupLabel: 'Acompanhamento',
      followupPlaceholder: 'Adicione um detalhe que possa ajudar a distinguir o que está acontecendo do que pode estar sendo assumido.',
      followupHelper: 'Um detalhe adicional pode ajudar a distinguir observação de interpretação.',
      badge: 'CLARIFICAR',
      simpleAction: 'Clarificar',
    },
    aiInteraction: {
      pageTitle: 'Interação com IA',
      heroTitle: 'Ver claramente antes de decidir o que pedir à IA para fazer',
      introText: 'Descreva o prompt, o problema de saída ou a situação relacionada à IA como ela aparece atualmente.',
      descriptionParagraph: 'VIREKA Space ajuda a distinguir o que parece estar acontecendo do que pode ser suposto, melhorando a clareza da interação com a IA.',
      inputLabel: 'O que está acontecendo na interação com a IA?',
      inputPlaceholder: 'Exemplo: A saída parece razoável, mas algo sobre o raciocínio parece errado.',
      helperText: 'Inclua o prompt, o objetivo, a saída ou qualquer coisa que possa ajudar a esclarecer onde a interação parece pouco clara.',
      pageLabel: 'INTERAÇÃO COM IA',
      backLink: 'Voltar ao início',
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
      loadingText: 'Analisando...',
      doneButton: 'Concluído',
      followupLabel: 'Acompanhamento',
      followupPlaceholder: 'Adicione um detalhe que possa ajudar a distinguir o resultado da IA das suposições sobre ele.',
      followupHelperText: 'Opcional: Faça uma pergunta de acompanhamento para continuar a análise.',
      followupHelper: 'Um detalhe adicional pode ajudar a esclarecer como o resultado da IA está sendo interpretado.',
      badge: 'INTERAÇÃO COM IA',
      pleaseEnterASituationOrResponse: 'Por favor, insira uma situação ou resposta.',
      speechRecognitionNotSupported: 'Reconhecimento de fala não é suportado neste navegador. Tente Chrome, Edge ou Safari.',
      microphoneError: 'Erro no microfone: ',
      anUnexpectedErrorOccurred: 'Ocorreu um erro inesperado.',
    },
    account: {
      pageTitle: 'Acesso à conta no VIREKA Space',
      pageIntro: 'O acesso à conta se torna relevante quando assinatura ou gerenciamento contínuo do plano é necessário.',
      freeUsageNoSignIn: 'O uso gratuito atualmente não requer login.',
      accountRequiredForSubscription: 'Uma conta é necessária apenas ao assinar o acesso estendido.',
      signInAllowsSubscription: 'O login permite que status de assinatura, limites de uso e continuidade de acesso sejam associados ao mesmo usuário.',
      authenticationMethods: 'A autenticação pode ser concluída usando um provedor de login suportado ou verificação por e-mail.',
      functionalityMayExpand: 'A funcionalidade da conta pode expandir conforme o serviço se desenvolve.',
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
      feedbackHelpsImprove: 'Feedback ajuda a melhorar clareza, confiabilidade e usabilidade ao longo do tempo.',
      messagesReviewed: 'Mensagens são revisadas conforme a disponibilidade.',
    },
    staticPage: {
      backToHome: 'Voltar ao início',
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
      subtitle: 'A compreensão começa com estrutura',
      sections: {
        function: {
          title: 'Função',
          content: [
            'VIREKA Space é um ambiente estruturado para esclarecer como situações estão sendo compreendidas antes de decisões serem tomadas ou prompts de IA serem escritos.',
            'A maioria das abordagens foca em melhorar respostas depois que conclusões já começaram a se formar. VIREKA Space foca antes, nas condições que influenciam a interpretação em primeiro lugar.',
            'Quando a interpretação se torna mais clara, a clareza das decisões muitas vezes melhora, e as respostas exigem menos ajustes.',
            'VIREKA Space ajuda a distinguir:',
            '• o que pode ser diretamente observado',
            '• o que pode ser assumido ou interpretado',
            '• o que permanece incerto',
            'Ao distinguir observação, suposição e incerteza, a interpretação se torna mais clara, permitindo tanto raciocínio humano quanto interação com IA prosseguir a partir de condições mais estáveis.',
            'O sistema não fornece conselhos nem prescreve conclusões. Em vez disso, estrutura a interpretação para que decisões e prompts possam ser formados com maior clareza.',
          ],
        },
        orientation: {
          title: 'Orientação',
          content: [
            'VIREKA Space é projetado para momentos em que o significado parece incerto.',
            'Apoia a tomada de decisão fornecendo estrutura mais clara.',
          ],
        },
        origin: {
          title: 'Origem',
          content: [
            'Baseado em "Beyond Thought: Awareness as Design Intelligence".',
            'Desenvolvido por Anthony Escobedo.',
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
          question: 'O que é VIREKA Space?',
          answer: [
            'VIREKA Space ajuda a esclarecer como uma situação está sendo interpretada antes de uma decisão ser tomada ou um prompt de IA ser escrito. Distingue o que parece estar acontecendo do que pode ser assumido, o que permanece incerto e o que pode estar influenciando a situação. O objetivo não é fornecer respostas, mas apoiar uma compreensão mais clara de como o significado está se formando.',
          ],
        },
        whyClarify: {
          question: 'Por que esclarecer uma situação antes de usar IA?',
          answer: [
            'Sistemas de IA respondem a como as situações são enquadradas. Mesmo pequenas diferenças na redação podem influenciar o que o sistema enfatiza e como ele raciocina. Esclarecer o que é conhecido, o que pode ser assumido e o que permanece incerto ajuda a garantir que o sistema esteja trabalhando no problema certo, e que o que está sendo perguntado reflete o que realmente se quer dizer.',
          ],
        },
        promptEngineering: {
          question: 'Como VIREKA Space é diferente da engenharia de prompts?',
          answer: [
            'Engenharia de prompts foca em melhorar como as instruções são escritas uma vez que a tarefa pretendida já está definida. VIREKA Space foca antes, em esclarecer como a situação mesma está sendo interpretada antes das instruções serem escritas. Em muitas situações, interpretação mais clara também traz maior clareza à intenção, permitindo que os prompts reflitam o que realmente se quer dizer em vez do que é inicialmente assumido.',
          ],
        },
        providesAnswers: {
          question: 'VIREKA Space fornece respostas?',
          answer: [
            'VIREKA Space não tenta fornecer soluções ou recomendações. Em vez disso, ajuda a esclarecer como a situação está sendo compreendida para que decisões e prompts possam se formar com maior visibilidade sobre o que é conhecido, o que pode ser assumido e o que permanece incerto.',
          ],
        },
        decisionTool: {
          question: 'VIREKA Space é uma ferramenta de tomada de decisão?',
          answer: [
            'VIREKA Space não toma decisões. Ajuda a esclarecer a interpretação para que decisões possam se formar com maior visibilidade sobre a estrutura da situação. Isso pode ajudar a reduzir a influência de suposições não percebidas e apoiar raciocínio mais estável.',
          ],
        },
        alignment: {
          question: 'Como VIREKA Space se relaciona com alinhamento de IA?',
          answer: [
            'Pesquisa de alinhamento técnico foca em garantir que sistemas de IA se comportem de acordo com objetivos especificados. VIREKA Space opera antes, apoiando clareza sobre como situações e objetivos são interpretados antes de serem traduzidos em instruções. Interpretação mais clara pode ajudar a garantir que o especificado reflita o que realmente se pretende, tanto no prompting individual quanto no design de sistemas que escalam.',
          ],
        },
        aiAgents: {
          question: 'Onde VIREKA Space se encaixa em fluxos de trabalho que incluem agentes de IA ou sistemas automatizados?',
          answer: [
            'Em fluxos de trabalho envolvendo IA, interpretação precoce muitas vezes molda saídas posteriores. Quando a interpretação não é clara, suposições podem se propagar através de múltiplos passos de raciocínio ou automação. Esclarecer a interpretação antes pode ajudar a manter coerência em todo o fluxo de trabalho.',
          ],
        },
        aiImprovement: {
          question: 'Se a IA continua melhorando, não vai descobrir o que queremos dizer de qualquer maneira?',
          answer: [
            'Sistemas mais capazes muitas vezes podem inferir contexto, mas ainda respondem a como as situações são enquadradas. Capacidade aumentada não elimina a influência da interpretação. Enquadramento mais claro muitas vezes produz resultados mais coerentes, mesmo quando os sistemas são altamente avançados.',
          ],
        },
        isCoaching: {
          question: 'VIREKA Space é uma forma de coaching ou terapia?',
          answer: [
            'Não. VIREKA Space não fornece orientação psicológica ou conselho pessoal. Foca apenas em esclarecer como situações estão sendo interpretadas para que raciocínio e prompting possam começar a partir de condições mais claras.',
          ],
        },
        whoIsFor: {
          question: 'Para quem é VIREKA Space?',
          answer: [
            'VIREKA Space pode ser útil para qualquer pessoa trabalhando através de situações onde interpretação pode influenciar decisões, comunicação ou interação com IA. É especialmente relevante onde significado pode estar se formando rapidamente ou onde múltiplas interpretações parecem possíveis.',
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
};

export const getDictionary = (language: Language): TranslationDictionary => {
  return dictionaries[language] || dictionaries.en;
};
