/**
 * Legal page content model (JOB-AGT-WEB-20260726-M4.4). Types only — the
 * actual bilingual copy lives in i18n JSON under `legal.privacy`,
 * `legal.terms`, and `legal.cookies`, shaped as `LegalPageContent`, the
 * same way `about.*` embeds structured content directly rather than via
 * a data registry (these are static one-off pages, not a growing
 * collection like blog posts).
 */

export type LegalSection = {
  id: string;
  title: string;
  paragraphs: string[];
  list?: string[];
};

export type LegalPageContent = {
  title: string;
  lastUpdated: string;
  intro: string;
  sections: LegalSection[];
};
