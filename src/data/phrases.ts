export interface Phrase { intro: string; noNuts: string; check: string; hospital: string; reaction: string }
export interface Lang { id: string; name: string; native: string; phrases: Phrase }

/**
 * PLACEHOLDER TRANSLATIONS, written from a parent's point of view ("my child").
 * These have NOT been verified by a native speaker. Verify each language with a
 * fluent speaker before relying on it. Where a language marks a child's gender
 * (Spanish, Italian) the card uses a neutral "hijo/a" style form for the same reason.
 */
export const languages: Lang[] = [
  { id: 'en', name: 'English', native: 'English', phrases: {
    intro: 'My child has a severe allergy to peanuts and tree nuts. Even traces can cause a life-threatening reaction.',
    noNuts: "Please do not use peanuts, tree nuts, or oils or pastes made from them in my child's food.",
    check: 'Please check the ingredients and the risk of cross-contact in the kitchen.',
    hospital: 'My child needs a hospital. Please call an ambulance.',
    reaction: 'My child is having an allergic reaction. We need epinephrine (adrenaline).',
  } },
  { id: 'pt', name: 'Portuguese', native: 'Português', phrases: {
    intro: 'A minha criança tem uma alergia grave a amendoim e a frutos secos de casca rija. Mesmo vestígios podem causar uma reação que põe a vida em risco.',
    noNuts: 'Por favor, não use amendoim, frutos secos nem óleos ou pastas feitos deles na comida da minha criança.',
    check: 'Por favor, confirme os ingredientes e o risco de contaminação cruzada na cozinha.',
    hospital: 'A minha criança precisa de um hospital. Chame uma ambulância.',
    reaction: 'A minha criança está a ter uma reação alérgica. Precisamos de adrenalina.',
  } },
  { id: 'ja', name: 'Japanese', native: '日本語', phrases: {
    intro: 'うちの子はピーナッツとナッツ類に重度のアレルギーがあります。微量でも命に関わる反応が起こることがあります。',
    noNuts: '子どもの食事に、ピーナッツ、ナッツ類、およびそれらの油やペーストを使わないでください。',
    check: '原材料と、調理場での混入の可能性を確認してください。',
    hospital: '子どもを病院に連れて行きたいです。救急車を呼んでください。',
    reaction: '子どもがアレルギー反応を起こしています。エピネフリン（アドレナリン）が必要です。',
  } },
  { id: 'es', name: 'Spanish', native: 'Español', phrases: {
    intro: 'Mi hijo/a tiene una alergia grave al cacahuate (maní) y a los frutos secos. Incluso las trazas pueden causar una reacción que pone en peligro su vida.',
    noNuts: 'Por favor, no use cacahuate, frutos secos ni aceites o pastas hechos con ellos en la comida de mi hijo/a.',
    check: 'Por favor, revise los ingredientes y el riesgo de contaminación cruzada en la cocina.',
    hospital: 'Mi hijo/a necesita un hospital. Por favor, llame a una ambulancia.',
    reaction: 'Mi hijo/a está teniendo una reacción alérgica. Necesitamos adrenalina.',
  } },
  { id: 'th', name: 'Thai', native: 'ไทย', phrases: {
    intro: 'ลูกของฉันแพ้ถั่วลิสงและถั่วเปลือกแข็งอย่างรุนแรง แม้เพียงปริมาณเล็กน้อยก็อาจทำให้เกิดอาการที่เป็นอันตรายถึงชีวิตได้',
    noNuts: 'กรุณาอย่าใช้ถั่วลิสง ถั่วเปลือกแข็ง หรือน้ำมันและซอสที่ทำจากถั่วในอาหารของลูกฉัน',
    check: 'กรุณาตรวจสอบส่วนผสมและความเสี่ยงการปนเปื้อนข้ามในครัว',
    hospital: 'ลูกของฉันต้องการไปโรงพยาบาล กรุณาเรียกรถพยาบาล',
    reaction: 'ลูกของฉันมีอาการแพ้ เราต้องการยาอะดรีนาลีน (อีพิเนฟริน)',
  } },
  { id: 'it', name: 'Italian', native: 'Italiano', phrases: {
    intro: 'Mio figlio/a ha una grave allergia alle arachidi e alla frutta a guscio. Anche tracce possono causare una reazione pericolosa per la vita.',
    noNuts: 'Per favore non usi arachidi, frutta a guscio né oli o creme che ne derivano nel piatto di mio figlio/a.',
    check: 'Per favore controlli gli ingredienti e il rischio di contaminazione crociata in cucina.',
    hospital: "Mio figlio/a ha bisogno di un ospedale. Chiami un'ambulanza.",
    reaction: 'Mio figlio/a sta avendo una reazione allergica. Abbiamo bisogno di adrenalina.',
  } },
]
