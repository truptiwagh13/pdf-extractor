import { FIELD_MAP } from './field-map';
import { normalize } from './normalize';
import { FINAL_FIELDS } from './final-fields';

export function mapUnstructuredData(elements: any[]) {
  const result: any = {};

  // initialize all fields with null
  for (const field of FINAL_FIELDS) {
    result[field] = null;
  }

  for (const el of elements) {

    // 1️⃣ KEY-VALUE MAPPING
    if (el.type === 'KeyValue') {
      const key = normalize(el.key || '');
      const mappedField = FIELD_MAP[key];

      if (mappedField) {
        result[mappedField] = el.value;
      }
    }

    // 2️⃣ TABLE MAPPING (store raw, refine later)
    if (el.type === 'Table') {
      if (!result.exposure_NFB_Table) {
        result.exposure_NFB_Table = el.rows;
      }
    }

    // 3️⃣ PARAGRAPH EXTRACTION (regex based)
    if (el.type === 'Paragraph') {
      const text = el.text || '';

      const panMatch = text.match(/[A-Z]{5}[0-9]{4}[A-Z]/);
      if (panMatch) {
        result.panNumber = panMatch[0];
      }
    }
  }

  return result;
}
