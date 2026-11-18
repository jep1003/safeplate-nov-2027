import type { Report, ReportKind, Venue } from '../lib/types'
import { toISODate } from '../lib/recency'

/** SAMPLE DATA: every venue name below is invented. Any resemblance to a real place is coincidence. */

const DAY = 86_400_000
export function daysAgo(n: number): string {
  return toISODate(Date.now() - n * DAY)
}

type V = Omit<Venue, 'staffConfirmedOn'> & { staffDaysAgo: number | null }

const raw: V[] = [
  // Lisbon
  { id: 'lis-1', destinationId: 'lisbon', name: 'Taberna da Lua Pequena', type: 'restaurant', cuisine: 'Portuguese', neighborhood: 'Old Town (sample)', blurb: 'Small tavern with grilled fish and rice dishes.', dedicatedNutFree: false, staffDaysAgo: 120, staffConfirmationNote: 'Owner said sauces are nut-free and offered to cook fish separately.', menuRiskFlags: ['Almond dessert on menu', 'Bar snacks served by default'], x: 30, y: 40, questionSet: 'portuguese' },
  { id: 'lis-2', destinationId: 'lisbon', name: 'Forno do Cais Claro', type: 'bakery', cuisine: 'Pastelaria', neighborhood: 'Riverside (sample)', blurb: 'Bakery that says it keeps nuts out of the building.', dedicatedNutFree: true, staffDaysAgo: 90, staffConfirmationNote: 'Staff showed ingredient binder and described supplier checks.', menuRiskFlags: ['Supplier changes can introduce traces'], x: 62, y: 66, questionSet: 'bakery' },
  { id: 'lis-3', destinationId: 'lisbon', name: 'Café Azulejo Quieto', type: 'cafe', cuisine: 'Cafe', neighborhood: 'Hill District (sample)', blurb: 'Tiled cafe with sandwiches and coffee.', dedicatedNutFree: false, staffDaysAgo: null, menuRiskFlags: ['Shared pastry display', 'Nut milks on offer'], x: 48, y: 22, questionSet: 'bakery' },
  { id: 'lis-4', destinationId: 'lisbon', name: 'Marisqueira Maré Alta', type: 'restaurant', cuisine: 'Seafood', neighborhood: 'Riverside (sample)', blurb: 'Seafood hall, busy and loud.', dedicatedNutFree: false, staffDaysAgo: null, menuRiskFlags: ['Shared fryers', 'Sauces made off-site'], x: 75, y: 50, questionSet: 'portuguese' },
  // Kyoto
  { id: 'kyo-1', destinationId: 'kyoto', name: 'Izakaya Tsuki no Ma', type: 'restaurant', cuisine: 'Japanese', neighborhood: 'Lantern Lane (sample)', blurb: 'Small-plates izakaya with an English allergen sheet.', dedicatedNutFree: false, staffDaysAgo: 60, staffConfirmationNote: 'Printed allergen sheet reviewed with staff; sesame and walnut dishes marked.', menuRiskFlags: ['Sesame and walnut dressings', 'Tempura oil may be shared'], x: 40, y: 45, questionSet: 'japanese' },
  { id: 'kyo-2', destinationId: 'kyoto', name: 'Tea Room Hoshi Yado', type: 'cafe', cuisine: 'Tea and sweets', neighborhood: 'Garden Quarter (sample)', blurb: 'Matcha and seasonal sweets in a quiet room.', dedicatedNutFree: false, staffDaysAgo: null, menuRiskFlags: ['Wagashi fillings vary by season'], x: 66, y: 30, questionSet: 'japanese' },
  { id: 'kyo-3', destinationId: 'kyoto', name: 'Kōbō Nanten Bakery', type: 'bakery', cuisine: 'Bakery', neighborhood: 'Station Side (sample)', blurb: 'Bread and rolls baked in a nut-free workshop.', dedicatedNutFree: true, staffDaysAgo: 30, staffConfirmationNote: 'Staff described a nut-free ingredient policy.', menuRiskFlags: ['Seasonal items may differ'], x: 22, y: 68, questionSet: 'bakery' },
  { id: 'kyo-4', destinationId: 'kyoto', name: 'Ramen-ya Kumo Chaya', type: 'restaurant', cuisine: 'Ramen', neighborhood: 'Station Side (sample)', blurb: 'Counter ramen shop.', dedicatedNutFree: false, staffDaysAgo: null, menuRiskFlags: ['Sesame and nut-based toppings', 'No English menu'], x: 55, y: 74, questionSet: 'japanese' },
  // Mexico City
  { id: 'mex-1', destinationId: 'mexico-city', name: 'Fonda Luna Verde', type: 'restaurant', cuisine: 'Mexican', neighborhood: 'Plaza Norte (sample)', blurb: 'Home-style fonda with a rotating menu of moles.', dedicatedNutFree: false, staffDaysAgo: null, menuRiskFlags: ['Mole and pipián on menu', 'Peanut oil may be used for frying'], x: 35, y: 35, questionSet: 'mexican' },
  { id: 'mex-2', destinationId: 'mexico-city', name: 'Panadería La Concha Dorada', type: 'bakery', cuisine: 'Panadería', neighborhood: 'Barrio Viejo (sample)', blurb: 'Neighborhood bakery with sweet breads.', dedicatedNutFree: false, staffDaysAgo: 150, staffConfirmationNote: 'Baker identified nut-topped items and keeps them on a separate shelf.', menuRiskFlags: ['Nut-topped items share the counter'], x: 60, y: 58, questionSet: 'bakery' },
  { id: 'mex-3', destinationId: 'mexico-city', name: 'Cafetería Patio Jacaranda', type: 'cafe', cuisine: 'Cafe', neighborhood: 'Plaza Norte (sample)', blurb: 'Courtyard cafe with breakfast plates.', dedicatedNutFree: false, staffDaysAgo: null, menuRiskFlags: ['Sauces prepared in bulk'], x: 70, y: 28, questionSet: 'mexican' },
  { id: 'mex-4', destinationId: 'mexico-city', name: 'Cocina Raíz Quieta', type: 'restaurant', cuisine: 'Mexican', neighborhood: 'Barrio Viejo (sample)', blurb: 'Grill-focused kitchen with a small menu.', dedicatedNutFree: true, staffDaysAgo: 45, staffConfirmationNote: 'Chef confirmed no nuts or seeds on premises and walked through the menu.', menuRiskFlags: ['Small kitchen; confirm daily specials'], x: 28, y: 70, questionSet: 'mexican' },
  // Bangkok
  { id: 'bkk-1', destinationId: 'bangkok', name: 'Baan Khao Mai Kitchen', type: 'restaurant', cuisine: 'Thai', neighborhood: 'Canal Side (sample)', blurb: 'Family kitchen with noodle dishes and curries.', dedicatedNutFree: false, staffDaysAgo: null, menuRiskFlags: ['Crushed peanut garnish', 'Shared woks'], x: 38, y: 44, questionSet: 'thai' },
  { id: 'bkk-2', destinationId: 'bangkok', name: 'Rim Klong Noodle House', type: 'restaurant', cuisine: 'Thai', neighborhood: 'Canal Side (sample)', blurb: 'Noodle soups; owner speaks some English.', dedicatedNutFree: false, staffDaysAgo: 75, staffConfirmationNote: 'Owner agreed to skip garnish and use a clean pot.', menuRiskFlags: ['Peanut garnish on the counter'], x: 60, y: 32, questionSet: 'thai' },
  { id: 'bkk-3', destinationId: 'bangkok', name: 'Cafe Nam Chai', type: 'cafe', cuisine: 'Cafe', neighborhood: 'Skytrain Row (sample)', blurb: 'Light meals and iced drinks.', dedicatedNutFree: false, staffDaysAgo: null, menuRiskFlags: ['Nut milks and toppings'], x: 72, y: 62, questionSet: 'thai' },
  { id: 'bkk-4', destinationId: 'bangkok', name: 'Khrua Dok Ruak', type: 'restaurant', cuisine: 'Thai', neighborhood: 'Skytrain Row (sample)', blurb: 'Busy grill with satay.', dedicatedNutFree: false, staffDaysAgo: null, menuRiskFlags: ['Satay sauce', 'Shared grill'], x: 26, y: 70, questionSet: 'thai' },
  // Florence
  { id: 'flo-1', destinationId: 'florence', name: 'Trattoria Il Fico Lento', type: 'restaurant', cuisine: 'Italian', neighborhood: 'Piazza Vecchia (sample)', blurb: 'Tuscan-style trattoria with a short menu.', dedicatedNutFree: false, staffDaysAgo: 100, staffConfirmationNote: 'Waiter checked with chef and marked pesto and two desserts as off limits.', menuRiskFlags: ['Pesto and pistachio sauces', 'Shared pasta water'], x: 45, y: 40, questionSet: 'italian' },
  { id: 'flo-2', destinationId: 'florence', name: 'Forno Alba Tonda', type: 'bakery', cuisine: 'Panificio', neighborhood: 'Mercato Row (sample)', blurb: 'Bakery with a printed ingredient binder.', dedicatedNutFree: true, staffDaysAgo: 50, staffConfirmationNote: 'Staff showed supplier statements.', menuRiskFlags: ['Check any seasonal specials'], x: 70, y: 55, questionSet: 'bakery' },
  { id: 'flo-3', destinationId: 'florence', name: 'Caffè Pergola Chiara', type: 'cafe', cuisine: 'Cafe', neighborhood: 'Piazza Vecchia (sample)', blurb: 'Espresso bar with pastries.', dedicatedNutFree: false, staffDaysAgo: null, menuRiskFlags: ['Almond pastries on shared display'], x: 25, y: 28, questionSet: 'bakery' },
  { id: 'flo-4', destinationId: 'florence', name: 'Osteria del Gatto Grigio', type: 'restaurant', cuisine: 'Italian', neighborhood: 'Mercato Row (sample)', blurb: 'Osteria with grilled meats and seasonal vegetables.', dedicatedNutFree: false, staffDaysAgo: 200, staffConfirmationNote: 'Staff described allergen binder.', menuRiskFlags: ['Hazelnut desserts'], x: 58, y: 74, questionSet: 'italian' },
]

export const venues: Venue[] = raw.map(({ staffDaysAgo, ...v }) => ({
  ...v,
  staffConfirmedOn: staffDaysAgo === null ? null : daysAgo(staffDaysAgo),
}))

let n = 0
const r = (venueId: string, kind: ReportKind, days: number, note?: string): Report => ({
  id: `sample-${++n}`, venueId, kind, date: daysAgo(days), note, source: 'sample',
})

export const sampleReports: Report[] = [
  r('lis-1', 'ok', 40, 'Asked about almond; waiter checked. Fish and rice were fine.'),
  r('lis-1', 'ok', 200),
  r('lis-2', 'ok', 30, 'Staff recognised the card straight away.'),
  r('lis-2', 'ok', 60), r('lis-2', 'ok', 150),
  r('lis-3', 'ok', 500), r('lis-3', 'ok', 700, 'Old report: counter staff were helpful.'),
  r('lis-4', 'reaction', 300, 'Mild reaction after a sauce; not clear which ingredient.'),
  r('kyo-1', 'ok', 20, 'Showed the translated card; they pointed to the allergen sheet.'),
  r('kyo-1', 'ok', 80),
  r('kyo-2', 'ok', 400),
  r('kyo-3', 'ok', 25), r('kyo-3', 'ok', 70), r('kyo-3', 'ok', 140),
  r('kyo-4', 'misunderstood', 55, 'Staff did not understand the card; no English.'),
  r('mex-1', 'misunderstood', 90, 'Said "no nuts" but sauce ingredients unknown.'),
  r('mex-2', 'ok', 35), r('mex-2', 'ok', 110, 'Baker pointed out which items had nuts.'),
  r('mex-3', 'ok', 60),
  r('mex-3', 'misunderstood', 45, 'Waiter unsure what was in the sauce.'),
  r('mex-3', 'misunderstood', 150),
  r('mex-4', 'ok', 20, 'Chef came out to talk through the menu.'),
  r('mex-4', 'ok', 66), r('mex-4', 'ok', 130),
  r('bkk-2', 'ok', 30, 'Owner skipped the peanut garnish and used a clean pot.'),
  r('bkk-2', 'ok', 95),
  r('bkk-3', 'ok', 18), r('bkk-3', 'ok', 77),
  r('bkk-4', 'reaction', 120, 'Reaction after satay marinade; likely cross-contact.'),
  r('flo-1', 'ok', 45), r('flo-1', 'ok', 160, 'They offered to leave off the pine nuts.'),
  r('flo-2', 'ok', 22), r('flo-2', 'ok', 66), r('flo-2', 'ok', 180),
  r('flo-3', 'ok', 410),
  r('flo-4', 'ok', 38), r('flo-4', 'ok', 100),
]
