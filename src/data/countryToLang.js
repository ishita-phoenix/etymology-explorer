/**
 * Map country names (from Natural Earth / world-atlas TopoJSON) to language codes
 * used in the app (LANGUAGE_COORDINATES, LANG_FAMILIES). Used for globe country hover
 * to show "equivalent word" in that country's primary Indo-European language.
 */
export const COUNTRY_TO_LANG = {
  // Germanic
  'United States of America': 'en',
  'United Kingdom': 'en',
  'Canada': 'en',
  'Australia': 'en',
  'Ireland': 'ga',
  'Germany': 'de',
  'Austria': 'de',
  'Switzerland': 'de',
  'Netherlands': 'nl',
  'Belgium': 'nl',
  'Sweden': 'sv',
  'Norway': 'no',
  'Denmark': 'da',
  'Iceland': 'non',
  // Italic / Romance
  'France': 'fr',
  'Spain': 'es',
  'Italy': 'it',
  'Portugal': 'pt',
  'Brazil': 'pt',
  'Romania': 'ro',
  'Moldova': 'ro',
  // Hellenic
  'Greece': 'el',
  'Cyprus': 'el',
  // Indo-Iranian
  'India': 'hi',
  'Pakistan': 'ur',
  'Iran': 'fa',
  'Afghanistan': 'fa',
  'Bangladesh': 'hi',
  'Nepal': 'hi',
  'Sri Lanka': 'hi',
  // Slavic
  'Russia': 'ru',
  'Ukraine': 'ru',
  'Belarus': 'ru',
  'Poland': 'pl',
  'Czech Republic': 'cs',
  'Slovakia': 'cs',
  'Bulgaria': 'bg',
  'Serbia': 'bg',
  'Croatia': 'bg',
  'Bosnia and Herz.': 'bg',
  'Bosnia and Herzegovina': 'bg',
  'Slovenia': 'bg',
  'North Macedonia': 'bg',
  'Macedonia': 'bg',
  'Montenegro': 'bg',
  'Kosovo': 'bg',
  // Baltic
  'Lithuania': 'lt',
  'Latvia': 'lv',
  'Estonia': 'lv',
  // Armenian
  'Armenia': 'hy',
  // Albanian
  'Albania': 'sq',
  // Alternate names (world-atlas / Natural Earth variants)
  'Czechia': 'cs',
  'Türkiye': 'el', // Turkey - often shown with Greek for ancient IE
  'Turkey': 'el',
};

/**
 * Get language code for a country feature from TopoJSON.
 * @param {object} feature - GeoJSON feature (after topojson.feature) with .id and/or .properties
 * @returns {string|null} - Lang code (e.g. 'de', 'fr') or null
 */
export function getLangForCountry(feature) {
  if (!feature) return null;
  const name = feature.properties?.name ?? feature.properties?.NAME ?? feature.properties?.admin ?? null;
  if (name && COUNTRY_TO_LANG[name]) return COUNTRY_TO_LANG[name];
  // Fallback: try by numeric id (ISO 3166-1 numeric) for a few key countries
  const idMap = {
    '840': 'en', // USA
    '826': 'en', // UK
    '276': 'de', // Germany
    '250': 'fr', // France
    '724': 'es', // Spain
    '380': 'it', // Italy
    '643': 'ru', // Russia
    '356': 'hi', // India
    '124': 'en', // Canada
    '398': 'ru', // Kazakhstan - Russian widely used
    '804': 'ru', // Ukraine
    '112': 'ru', // Belarus
  };
  const id = feature.id != null ? String(feature.id) : null;
  if (id && idMap[id]) return idMap[id];
  return null;
}
