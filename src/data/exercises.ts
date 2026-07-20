import { Exercise, Routine } from '../types';

export const EXERCISES_IT: Exercise[] = [
  {
    id: 'cat-camel',
    title: 'Gatto-Cammello',
    category: 'mobilita',
    difficulty: 'Principiante',
    targetRegion: 'tutta',
    durationSeconds: 60,
    description: 'Un esercizio fondamental per mobilizzare l\'intera colonna vertebrale, coordinando il respiro con il movimento.',
    steps: [
      'Mettiti a quattro zampe (in quadrupedia), con le mani sotto le spalle e le ginocchia sotto i fianchi.',
      'Espira, spingi con le mani e curva la schiena verso l\'alto come un gatto arrabbiato, portando il mento al petto.',
      'Inspira lentamente, inarca la schiena portando l\'addome verso il basso e solleva delicatamente lo sguardo verso l\'alto.'
    ],
    tips: [
      'Muoviti in modo fluido, senza scatti.',
      'Concentrati sulla mobilità di ogni singola vertebra.',
      'Se avverti dolore cervicale, non sollevare troppo la testa durante l\'inspiro.'
    ],
    mistakes: [
      'Piegare le braccia durante l\'esecuzione.',
      'Forzare l\'estensione del collo o muoversi troppo velocemente.'
    ],
    visualType: 'cat-camel'
  },
  {
    id: 'childs-pose',
    title: 'Posizione del Bambino',
    category: 'allungamento',
    difficulty: 'Principiante',
    targetRegion: 'lombare',
    durationSeconds: 45,
    description: 'Un allungamento passivo e rilassante per la colonna lombare, che aiuta a decomprimere i dischi intervertebrali.',
    steps: [
      'Ginocchia a terra, siediti sui talloni e unisci gli alluci, allontanando leggermente le ginocchia.',
      'Espira e piega il busto in avanti, allungando le braccia sul pavimento davanti a te.',
      'Appoggia la fronte sul tappetino o su un cuscino e respira profondamente nell\'addome.'
    ],
    tips: [
      'Se i glutei non toccano i talloni, posiziona un cuscino sotto il sedere per stare comodo.',
      'Cammina leggermente con i polpastrelli in avanti per aumentare l\'allungamento della parte superiore.'
    ],
    mistakes: [
      'Mantenere le spalle contratte vicino alle orecchie.',
      'Trattenere il respiro invece di respirare in modo calmo e profondo.'
    ],
    visualType: 'childs-pose'
  },
  {
    id: 'cobra',
    title: 'Allungamento Cobra',
    category: 'allungamento',
    difficulty: 'Intermedio',
    targetRegion: 'lombare',
    durationSeconds: 30,
    description: 'Estensione della colonna utile per contrastare la costante flessione in avanti tipica di chi lavora seduto.',
    steps: [
      'Sdraiati a pancia in giù (prono) con le gambe tese e le mani appoggiate a terra all\'altezza del petto.',
      'Tieni i gomiti vicini al corpo ed espirando spingi delicatamente sulle mani per sollevare il petto da terra.',
      'Mantieni le spalle abbassate, lontane dalle orecchie e il bacino ben aderente al pavimento.'
    ],
    tips: [
      'Se senti troppa tensione lombare, appoggia i gomiti a terra (posizione della Sfinge) invece delle mani.',
      'Mantieni i glutei rilassati o contratti leggermente per proteggere la zona sacrale.'
    ],
    mistakes: [
      'Inarcare eccessivamente il collo all\'indietro.',
      'Sollevare il bacino da terra o incassare il collo nelle spalle.'
    ],
    visualType: 'cobra'
  },
  {
    id: 'bird-dog',
    title: 'Cane-Uccello (Bird-Dog)',
    category: 'rinforzo',
    difficulty: 'Intermedio',
    targetRegion: 'tutta',
    durationSeconds: 45,
    description: 'Sviluppa stabilità e rinforza i muscoli erettori della colonna e del core profondo senza sovraccaricare la schiena.',
    steps: [
      'Parti in quadrupedia, con la colonna in posizione neutra e l\'addome attivo.',
      'Estendi lentamente il braccio destro in avanti e contemporaneamente la gamba sinistra all\'indietro.',
      'Mantieni la linea retta tra mano, schiena e piede per 2-3 secondi, poi torna alla posizione iniziale e inverti i lati.'
    ],
    tips: [
      'Immagina di allungarti in due direzioni opposte, piuttosto che sollevare troppo in alto gli arti.',
      'Mantieni i fianchi paralleli al terreno, evitando di ruotare il bacino.'
    ],
    mistakes: [
      'Inarcare la zona lombare quando si solleva la gamba.',
      'Far crollare la testa verso il basso o sollevare la spalla vicino all\'orecchio.'
    ],
    visualType: 'bird-dog'
  },
  {
    id: 'bridge',
    title: 'Ponte per Glutei',
    category: 'rinforzo',
    difficulty: 'Principiante',
    targetRegion: 'lombare',
    durationSeconds: 45,
    description: 'Rinforza i glutei e gli ischiocrurali, offrendo un supporto cruciale per una colonna lombare stabile e sana.',
    steps: [
      'Sdraiati sulla schiena (supino) con le ginocchia piegate e i piedi piatti sul pavimento, alla larghezza dei fianchi.',
      'Espira, premi sui talloni e solleva i fianchi stringendo i glutei, finché il corpo non forma una linea retta dalle spalle alle ginocchia.',
      'Mantieni la posizione per un secondo, poi riscendi lentamente srotolando la colonna vertebra dopo vertebra.'
    ],
    tips: [
      'Concentrati sulla spinta dei talloni, non delle dita dei piedi.',
      'Mantieni le costole abbassate e l\'addome compatto all\'apice del movimento per non iperestendere la lombare.'
    ],
    mistakes: [
      'Spingere i fianchi troppo in alto inarcando la schiena in modo anomalo.',
      'Lasciare che le ginocchia si allarghino o si chiudano.'
    ],
    visualType: 'bridge'
  },
  {
    id: 'plank',
    title: 'Plank Frontale',
    category: 'rinforzo',
    difficulty: 'Intermedio',
    targetRegion: 'tutta',
    durationSeconds: 30,
    description: 'Il re della stabilità isometrica. Attiva il corsetto addominale profondo che protegge la colonna da carichi nocivi.',
    steps: [
      'Posiziona i gomiti a terra direttamente sotto le spalle, con gli avambracci paralleli.',
      'Distendi le gambe all\'indietro appoggiandoti sulle punte dei piedi, sollevando il corpo.',
      'Crea una linea retta perfetta dalla testa ai talloni, attivando addominali, glutei e quadricipiti.'
    ],
    tips: [
      'Spingi attivamente i gomiti contro il pavimento per non sprofondare tra le scapole.',
      'Respira in modo regolare e controllato, senza mai andare in apnea.'
    ],
    mistakes: [
      'Lasciare che il bacino crolli verso il basso (forte rischio di dolore lombare).',
      'Sollevare eccessivamente il sedere formando una "V".'
    ],
    visualType: 'plank'
  },
  {
    id: 'spinal-twist',
    title: 'Torsione Spinale Supina',
    category: 'allungamento',
    difficulty: 'Principiante',
    targetRegion: 'dorsale',
    durationSeconds: 60,
    description: 'Rilascia le tensioni rotazionali della schiena, migliorando la flessibilità dorsale e rilassando i fianchi.',
    steps: [
      'Sdraiati sulla schiena, porta le ginocchia al petto, poi distendi le braccia a croce con i palmi rivolti a terra.',
      'Lascia cadere lentamente le ginocchia unite verso il lato destro, mantenendo entrambe le spalle ben salde a terra.',
      'Se comodo, gira delicatamente la testa verso sinistra e mantieni la posizione, poi ripeti dall\'altro lato.'
    ],
    tips: [
      'Se le ginocchia non toccano terra comodamente, posiziona un blocco o un cuscino sotto di esse.',
      'Concentrati sull\'esalazione profonda per facilitare il rilassamento muscolare.'
    ],
    mistakes: [
      'Sollevare la spalla opposta da terra per far toccare le ginocchia al pavimento.',
      'Forzare la torsione se si sente un dolore acuto.'
    ],
    visualType: 'spinal-twist'
  },
  {
    id: 'chest-opener',
    title: 'Apertura Petto e Spalle',
    category: 'allungamento',
    difficulty: 'Principiante',
    targetRegion: 'cervicale',
    durationSeconds: 45,
    description: 'Ideale per chi sta molto al computer: apre la parte superiore del petto e corregge la tendenza alle spalle curve.',
    steps: [
      'In piedi di fronte a un muro, posiziona gli avambracci sul muro all\'altezza delle spalle o leggermente più in alto.',
      'Fai un passo indietro con i piedi e lascia scendere delicatamente il petto e la testa verso il pavimento.',
      'Mantieni le orecchie in linea con le braccia e respira, sentendo allungare il petto e le spalle.'
    ],
    tips: [
      'Puoi farlo anche appoggiando le mani sullo schienale di una sedia robusta.',
      'Non lasciare che la zona lombare si inarchi troppo; tieni l\'addome leggermente attivo.'
    ],
    mistakes: [
      'Lasciare cadere la testa a penzoloni forzando la cervicale.',
      'Tenere le gambe completamente tese se si avverte tensione eccessiva dietro le ginocchia.'
    ],
    visualType: 'chest-opener'
  }
];

export const EXERCISES_EN: Exercise[] = [
  {
    id: 'cat-camel',
    title: 'Cat-Camel',
    category: 'mobilita',
    difficulty: 'Beginner',
    targetRegion: 'tutta',
    durationSeconds: 60,
    description: 'A fundamental exercise to mobilize the entire spine, coordinating breath with movement.',
    steps: [
      'Get on all fours (quadruped pose) with hands under shoulders and knees under hips.',
      'Exhale, press with your hands and round your back upward like an angry cat, pulling chin to chest.',
      'Inhale slowly, arching your back and lowering your abdomen while gently looking up.'
    ],
    tips: [
      'Move smoothly and fluidly, without jerking.',
      'Focus on the mobility of each individual vertebra.',
      'If you feel neck discomfort, avoid lifting your head too high during inhalation.'
    ],
    mistakes: [
      'Bending your arms during execution.',
      'Forcing neck extension or moving too quickly.'
    ],
    visualType: 'cat-camel'
  },
  {
    id: 'childs-pose',
    title: "Child's Pose",
    category: 'allungamento',
    difficulty: 'Beginner',
    targetRegion: 'lombare',
    durationSeconds: 45,
    description: 'A passive, relaxing stretch for the lumbar spine that helps decompress intervertebral discs.',
    steps: [
      'Kneel on the floor, sit on your heels, touch big toes together, and separate your knees slightly.',
      'Exhale and fold your torso forward, reaching your arms long on the floor in front of you.',
      'Rest your forehead on the mat or a cushion and breathe deeply into your abdomen.'
    ],
    tips: [
      'If your hips do not reach your heels, place a cushion under your glutes for comfort.',
      'Gently crawl your fingertips forward to increase the stretch in your upper back.'
    ],
    mistakes: [
      'Keeping shoulders tense or shrugged near the ears.',
      'Holding your breath instead of breathing calmly and deeply.'
    ],
    visualType: 'childs-pose'
  },
  {
    id: 'cobra',
    title: 'Cobra Stretch',
    category: 'allungamento',
    difficulty: 'Intermediate',
    targetRegion: 'lombare',
    durationSeconds: 30,
    description: 'Spinal extension useful for counteracting the constant forward slouching typical of desk jobs.',
    steps: [
      'Lie face down (prone) with legs straight and hands on the floor at chest level.',
      'Keep your elbows close to your body, exhale, and gently press through hands to lift your chest.',
      'Keep your pelvis fully flat on the ground and shoulders low, away from your ears.'
    ],
    tips: [
      'If you feel lower back tension, rest on your elbows (Sphinx pose) instead of hands.',
      'Keep glutes relaxed or contract them slightly to protect your lower back.'
    ],
    mistakes: [
      'Arching your neck excessively backward.',
      'Lifting your pelvis off the ground or shrugging shoulders.'
    ],
    visualType: 'cobra'
  },
  {
    id: 'bird-dog',
    title: 'Bird-Dog',
    category: 'rinforzo',
    difficulty: 'Intermediate',
    targetRegion: 'tutta',
    durationSeconds: 45,
    description: 'Develops stability and strengthens the erector spinae and deep core muscles without overloading the back.',
    steps: [
      'Start on all fours, with a neutral spine and active core.',
      'Slowly extend your right arm forward and your left leg backward at the same time.',
      'Maintain a straight line from hand to foot for 2-3 seconds, then return to start and switch sides.'
    ],
    tips: [
      'Imagine stretching in opposite directions rather than lifting limbs too high.',
      'Keep hips parallel to the floor, avoiding hip rotation.'
    ],
    mistakes: [
      'Arching the lower back when lifting the leg.',
      'Dropping your head downward or shrugging shoulders.'
    ],
    visualType: 'bird-dog'
  },
  {
    id: 'bridge',
    title: 'Glute Bridge',
    category: 'rinforzo',
    difficulty: 'Beginner',
    targetRegion: 'lombare',
    durationSeconds: 45,
    description: 'Strengthens glutes and hamstrings, offering crucial support for a stable and healthy lumbar spine.',
    steps: [
      'Lie on your back (supine) with knees bent and feet flat on the floor, hip-width apart.',
      'Exhale, press through heels and lift hips by squeezing glutes until your body forms a straight line.',
      'Hold for a second, then slowly lower your spine rolling down vertebra by vertebra.'
    ],
    tips: [
      'Focus on pushing through your heels, not your toes.',
      'Keep ribs down and core engaged at the top to avoid hyperextending your lower back.'
    ],
    mistakes: [
      'Pushing hips too high and over-arching the back.',
      'Letting knees flare out or cave in.'
    ],
    visualType: 'bridge'
  },
  {
    id: 'plank',
    title: 'Forearm Plank',
    category: 'rinforzo',
    difficulty: 'Intermediate',
    targetRegion: 'tutta',
    durationSeconds: 30,
    description: 'The king of isometric stability. Activates the deep abdominal corset protecting the spine.',
    steps: [
      'Place elbows on the floor directly under shoulders, forearms parallel.',
      'Extend legs backward, supporting weight on toes, lifting your body.',
      'Create a perfect straight line from head to heels, engaging abs, glutes, and quads.'
    ],
    tips: [
      'Actively press elbows into the floor to avoid sinking between shoulder blades.',
      'Breathe regularly and in a controlled manner, never holding your breath.'
    ],
    mistakes: [
      'Letting hips sag toward the ground (high risk of lower back strain).',
      'Lifting hips too high forming a "V" shape.'
    ],
    visualType: 'plank'
  },
  {
    id: 'spinal-twist',
    title: 'Supine Spinal Twist',
    category: 'allungamento',
    difficulty: 'Beginner',
    targetRegion: 'dorsale',
    durationSeconds: 60,
    description: 'Releases rotational tension in the back, improving thoracic flexibility and relaxing hips.',
    steps: [
      'Lie on your back, hug knees to chest, then extend arms out wide with palms facing down.',
      'Slowly lower both knees together to the right side, keeping both shoulders anchored.',
      'If comfortable, gently turn head to the left and hold, then repeat on the opposite side.'
    ],
    tips: [
      'If knees do not reach the ground easily, place a block or cushion under them.',
      'Focus on deep exhales to help muscles relax.'
    ],
    mistakes: [
      'Lifting the opposite shoulder off the floor to make knees touch the ground.',
      'Forcing the twist if you feel sharp pain.'
    ],
    visualType: 'spinal-twist'
  },
  {
    id: 'chest-opener',
    title: 'Chest & Shoulder Opener',
    category: 'allungamento',
    difficulty: 'Beginner',
    targetRegion: 'cervicale',
    durationSeconds: 45,
    description: 'Ideal for those spending hours on a computer: opens the upper chest and corrects rounded shoulders.',
    steps: [
      'Stand facing a wall, place forearms on the wall at or slightly above shoulder level.',
      'Take a step back and gently let your chest and head sink toward the floor.',
      'Keep ears aligned with arms and breathe, feeling a stretch in your chest and shoulders.'
    ],
    tips: [
      'You can also do this by placing hands on the back of a sturdy chair.',
      'Do not let your lower back over-arch; keep your core slightly active.'
    ],
    mistakes: [
      'Letting head dangle loosely, straining the neck.',
      'Keeping legs fully locked if you feel tight hamstrings.'
    ],
    visualType: 'chest-opener'
  }
];

// Fallback exports
export const EXERCISES = EXERCISES_IT;

export const ROUTINES_IT: Routine[] = [
  {
    id: 'pain-relief',
    name: 'Sollievo Rapido (Dolore)',
    description: 'Ideale per rilassare la schiena tesa, ridurre la rigidità lombare e ritrovare comfort immediato.',
    emoji: '🌸',
    exerciseIds: ['childs-pose', 'cat-camel', 'spinal-twist'],
    estimatedMinutes: 3
  },
  {
    id: 'smart-working',
    name: 'Pausa Smart Working',
    description: 'Esercizi rapidi per contrastare la rigidità da postura seduta prolungata. Non richiede tappetino.',
    emoji: '💻',
    exerciseIds: ['chest-opener', 'cat-camel', 'cobra'],
    estimatedMinutes: 2
  },
  {
    id: 'strength-prevent',
    name: 'Rinforzo e Prevenzione',
    description: 'Attiva e rafforza la muscolatura profonda del core e della schiena per prevenire futuri fastidi.',
    emoji: '🛡️',
    exerciseIds: ['bird-dog', 'bridge', 'plank'],
    estimatedMinutes: 3
  }
];

export const ROUTINES_EN: Routine[] = [
  {
    id: 'pain-relief',
    name: 'Quick Pain Relief',
    description: 'Ideal for relaxing a tight back, reducing lumbar stiffness, and finding instant comfort.',
    emoji: '🌸',
    exerciseIds: ['childs-pose', 'cat-camel', 'spinal-twist'],
    estimatedMinutes: 3
  },
  {
    id: 'smart-working',
    name: 'Desk Break (Smart Working)',
    description: 'Quick exercises to counteract stiffness from prolonged sitting. No mat required.',
    emoji: '💻',
    exerciseIds: ['chest-opener', 'cat-camel', 'cobra'],
    estimatedMinutes: 2
  },
  {
    id: 'strength-prevent',
    name: 'Strength & Prevention',
    description: 'Activates and strengthens deep core and back muscles to prevent future discomfort.',
    emoji: '🛡️',
    exerciseIds: ['bird-dog', 'bridge', 'plank'],
    estimatedMinutes: 3
  }
];

export const ROUTINES = ROUTINES_IT;

export const DEFAULT_HABITS_IT = [
  { id: 'h1', text: 'Stretching mattutino o serale (anche solo 5 min)', category: 'movimento', completed: false },
  { id: 'h2', text: 'Pausa attiva in piedi ogni 50-60 minuti', category: 'movimento', completed: false },
  { id: 'h3', text: 'Mantieni lo schermo all\'altezza degli occhi', category: 'postura', completed: false },
  { id: 'h4', text: 'Bevi almeno 2 litri d\'acqua (idratazione dischi)', category: 'benessere', completed: false },
  { id: 'h5', text: 'Esegui almeno 1 esercizio per la schiena oggi', category: 'movimento', completed: false },
  { id: 'h6', text: 'Evita di accavallare le gambe quando sei seduto', category: 'postura', completed: false }
];

export const DEFAULT_HABITS_EN = [
  { id: 'h1', text: 'Morning or evening stretching (even just 5 min)', category: 'movimento', completed: false },
  { id: 'h2', text: 'Active standing break every 50-60 minutes', category: 'movimento', completed: false },
  { id: 'h3', text: 'Keep your screen at eye level', category: 'postura', completed: false },
  { id: 'h4', text: 'Drink at least 2 liters of water (spine hydration)', category: 'benessere', completed: false },
  { id: 'h5', text: 'Perform at least 1 back exercise today', category: 'movimento', completed: false },
  { id: 'h6', text: 'Avoid crossing your legs while sitting', category: 'postura', completed: false }
];

export const DEFAULT_HABITS = DEFAULT_HABITS_IT;

