import type { Destination } from '../lib/types'

/** SAMPLE DATA: general cuisine-risk patterns only. Always verify current local rules and menus. */
export const destinations: Destination[] = [
  {
    id: 'lisbon', city: 'Lisbon', country: 'Portugal', feasibility: 'Moderate', language: 'pt',
    reason: 'Mostly nut-light savory food; almonds and pastries need care.',
    why: 'Traditional savory cooking leans on fish, olive oil and rice, which is a good sign. The risk sits in bakeries and desserts, where almonds, hazelnuts and marzipan turn up unlabeled.',
    riskPatterns: [
      { title: 'Almond sweets', detail: 'Almond cakes, marzipan figures and liqueur-filled chocolates are common in pastelarias.' },
      { title: 'Shared fryers and ovens', detail: 'Small kitchens often share equipment between pastry and savory work.' },
      { title: 'Packaged snacks', detail: 'Mixed nuts are served as bar snacks without being asked for.' },
    ],
    labeling: 'Packaged food generally lists allergens, but unpackaged pastries often have no label. Ask every time.',
    primers: [
      { cuisine: 'Portuguese', points: ['Ask about almond or hazelnut in desserts and sauces.', 'Bar snacks may arrive uninvited; send them back.', 'Fish stews are usually nut-free, but ask about thickeners.'] },
      { cuisine: 'Pastelaria', points: ['Almond is a default flavor in many tarts and cakes.', 'Ask which items share trays or ovens.'] },
    ],
    emergencyNumber: '112', grocery: 'Large supermarkets stock labeled bread, cheese, fruit and plain rice dishes. Look for "pode conter vestígios de frutos de casca rija" warnings.',
  },
  {
    id: 'kyoto', city: 'Kyoto', country: 'Japan', feasibility: 'Easier', language: 'ja',
    reason: 'Few nut-based savory dishes, but sweets, sauces and sesame blends need checking.',
    why: 'Everyday Japanese cooking uses little peanut or tree nut. Risks are concentrated in traditional sweets, some sauces and dressings, and nut oils used in a few kitchens. Language is the main barrier, so the allergy card matters.',
    riskPatterns: [
      { title: 'Traditional sweets (wagashi)', detail: 'Walnut, chestnut and peanut can appear in fillings and coatings.' },
      { title: 'Sauces and dressings', detail: 'Ground sesame and nut pastes are common in dressings; ask about additions.' },
      { title: 'Language gap', detail: 'Many small restaurants have no English menu or allergen chart.' },
    ],
    labeling: 'Packaged food usually carries an ingredient list in Japanese. Rules differ by nut, so do not assume a nut is listed.',
    primers: [
      { cuisine: 'Japanese', points: ['Show the card before ordering, not after.', 'Ask about peanut or walnut in sauces, fillings and tempura oil.', 'Set menus are harder to adjust than single dishes.'] },
      { cuisine: 'Tea and sweets', points: ['Wagashi fillings vary; ask for the ingredient list.', 'Matcha desserts may include nut toppings.'] },
    ],
    emergencyNumber: '119', grocery: 'Convenience stores stock rice balls and sandwiches with ingredient labels in Japanese. Bring a translated ingredient guide.',
  },
  {
    id: 'mexico-city', city: 'Mexico City', country: 'Mexico', feasibility: 'Challenging', language: 'es',
    reason: 'Nuts and seeds are built into sauces like mole and pipián.',
    why: 'Many classic dishes use ground peanuts, almonds or pumpkin seeds as a base. These are often invisible in the finished sauce, so the question has to be asked before ordering, not at the table.',
    riskPatterns: [
      { title: 'Moles and pipián', detail: 'Peanut, almond and other nuts or seeds may be ground into the sauce.' },
      { title: 'Street food', detail: 'Shared surfaces and salsas of unknown contents.' },
      { title: 'Sweets and drinks', detail: 'Horchata variants, alegrías and cajeta-based sweets may include nuts.' },
    ],
    labeling: 'Packaged-food labeling exists but is inconsistent for small producers. Restaurants rarely list allergens.',
    primers: [
      { cuisine: 'Mexican', points: ['Ask what is in every sauce, especially mole, pipián and salsa macha.', 'Tacos with plain grilled meat and fresh salsa are often simpler to verify.', 'Ask about peanut oil for frying.'] },
      { cuisine: 'Panadería', points: ['Many pan dulce use almond or other nuts in toppings.', 'Ask which trays share tongs.'] },
    ],
    emergencyNumber: '911', grocery: 'Supermarkets and chains sell packaged tortillas, fruit, beans and cheese. Read labels for "cacahuate" and "nueces".',
  },
  {
    id: 'bangkok', city: 'Bangkok', country: 'Thailand', feasibility: 'Challenging', language: 'th',
    reason: 'Peanuts in satay, curries and noodle dishes; heavy shared wok use.',
    why: 'Crushed peanuts finish many noodle dishes and salads, peanut sauces accompany grilled meats, and fast shared-wok cooking raises cross-contact risk. Thai cooking can often be adjusted, but it takes a clear conversation.',
    riskPatterns: [
      { title: 'Peanuts as garnish', detail: 'Crushed peanuts top noodles, salads and desserts by default.' },
      { title: 'Satay and curry sauces', detail: 'Peanut sauce is typical; some curries include ground nuts.' },
      { title: 'Shared woks and oil', detail: 'Street and small kitchens reuse woks and oil quickly between orders.' },
    ],
    labeling: 'Allergen labeling is limited outside packaged goods. Do not rely on menus.',
    primers: [
      { cuisine: 'Thai', points: ['Say "no peanuts, no nuts" before ordering and show the card.', 'Ask about peanut oil and shared woks.', 'Steamed rice, plain grilled fish and fruit are simpler to verify.'] },
      { cuisine: 'Cafe', points: ['Check baked goods and nut milks.'] },
    ],
    emergencyNumber: '1669', grocery: 'Convenience-store chains and supermarkets sell fruit, rice and labeled packaged items. Check labels for "peanut" and "nut" in English.',
  },
  {
    id: 'florence', city: 'Florence', country: 'Italy', feasibility: 'Moderate', language: 'it',
    reason: 'Familiar allergen labeling, but pesto, pine nuts and almond sweets recur.',
    why: 'Restaurants in Italy are generally used to allergen questions, which helps. Hidden sources include pesto with pine nuts, pistachio and hazelnut spreads, and almond-based sweets. Shared kitchens are the norm.',
    riskPatterns: [
      { title: 'Pesto and sauces', detail: 'Pine nuts and sometimes cashews or almonds appear in pesto and creamy sauces.' },
      { title: 'Almond and hazelnut sweets', detail: 'Biscotti, cantucci, gianduja and marzipan are staples.' },
      { title: 'Gelato', detail: 'Shared scoops and flavors with nut pastes; cross-contact is common.' },
    ],
    labeling: 'Restaurants are generally expected to provide allergen information on request. Confirm directly rather than assuming.',
    primers: [
      { cuisine: 'Italian', points: ['Ask about pesto, pine nuts and pistachio sauces.', 'Ask whether pasta water or pans are shared.', 'Simple tomato or olive-oil dishes are easier to verify.'] },
      { cuisine: 'Pasticceria', points: ['Almond flour is common in tarts and biscuits.', 'Ask about dedicated trays.'] },
    ],
    emergencyNumber: '112', grocery: 'Supermarkets stock labeled bread, cheese, cured meats and fruit. Look for "può contenere tracce di frutta a guscio".',
  },
]
