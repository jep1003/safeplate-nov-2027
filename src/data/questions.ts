/** Questions to ask staff, tailored by cuisine. */
export const baseQuestions = [
  'My child has a severe peanut and tree nut allergy. Can you confirm with the kitchen, not just from the menu?',
  'Do you use nuts or nut oils anywhere in the kitchen, even for other dishes?',
  'Do you share fryers, pans, grills or utensils between dishes?',
]

export const questionSets: Record<string, string[]> = {
  portuguese: [
    'Do any sauces, stews or desserts contain almond, hazelnut or peanut?',
    'Are bar snacks (such as mixed nuts) brought to the table by default? Can they be left off?',
    'Can the fish be cooked in a clean pan?',
  ],
  japanese: [
    'Do any dressings, dipping sauces or toppings contain peanut, walnut or ground sesame blends?',
    'What oil is used for frying, and is it shared?',
    'Is there an allergen list in English, or can someone read the ingredient list for this dish?',
  ],
  mexican: [
    'Is this sauce a mole, pipián or salsa made with peanuts, almonds or seeds?',
    'Is peanut oil used for frying or on the grill?',
    'Are the tortillas and salsas prepared on a surface shared with nut-based items?',
  ],
  thai: [
    'Does this dish include crushed peanuts, peanut sauce or peanut oil? Can it be made without?',
    'Can you cook it in a freshly cleaned wok with fresh oil?',
    'Are the curry pastes or sauces made in-house, and what is in them?',
  ],
  italian: [
    'Does the pesto, sauce or dessert contain pine nuts, pistachio, hazelnut or almond?',
    'Is the pasta cooked in water or pans shared with pesto or nut sauces?',
    'Can the chef read the ingredient labels for any bought-in sauces or desserts?',
  ],
  bakery: [
    'Which items contain nuts, and are they baked or displayed together with the others?',
    'Are trays, tongs, ovens and slicers shared between nut and non-nut items?',
    'Can I see the ingredient list for this item, including any "may contain" warnings?',
  ],
}
