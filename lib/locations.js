// lib/locations.js

export const LOCATIONS = [
  {
    value: "Choba (Back Gate)",
    label: "Choba (Back Gate)",
    hint: "Behind UST — most popular student area",
    mapQuery: "Choba, Port Harcourt, Nigeria",
  },
  {
    value: "Obirikwe (Main Gate)",
    label: "Obirikwe (Main Gate)",
    hint: "Front of UST campus",
    mapQuery: "Obirikwe, Port Harcourt, Nigeria",
  },
  {
    value: "Alakahia",
    label: "Alakahia",
    hint: "Close to Back Gate",
    mapQuery: "Alakahia, Choba, Port Harcourt, Nigeria",
  },
  {
    value: "Ozuoba",
    label: "Ozuoba",
    hint: "Along Back Gate road",
    mapQuery: "Ozuoba, Port Harcourt, Nigeria",
  },
  {
    value: "Mgbuoba",
    label: "Mgbuoba",
    hint: "Off Back Gate axis",
    mapQuery: "Mgbuoba, Port Harcourt, Nigeria",
  },
  {
    value: "Rumuola",
    label: "Rumuola",
    hint: "Trans-Amadi area",
    mapQuery: "Rumuola, Port Harcourt, Nigeria",
  },
  {
    value: "Rumuokoro",
    label: "Rumuokoro",
    hint: "Rumuokoro junction axis",
    mapQuery: "Rumuokoro, Port Harcourt, Nigeria",
  },
  {
    value: "Rumuigbo",
    label: "Rumuigbo",
    hint: "Off Aba Road",
    mapQuery: "Rumuigbo, Port Harcourt, Nigeria",
  },
  {
    value: "Woji",
    label: "Woji",
    hint: "Woji Road axis",
    mapQuery: "Woji, Port Harcourt, Nigeria",
  },
  {
    value: "GRA",
    label: "GRA",
    hint: "Government Reserved Area",
    mapQuery: "GRA, Port Harcourt, Nigeria",
  },
  {
    value: "Peter Odili",
    label: "Peter Odili",
    hint: "Peter Odili Road",
    mapQuery: "Peter Odili Road, Port Harcourt, Nigeria",
  },
  {
    value: "Eliozu",
    label: "Eliozu",
    hint: "Eliozu axis",
    mapQuery: "Eliozu, Port Harcourt, Nigeria",
  },
  {
    value: "Rumuepirikom",
    label: "Rumuepirikom",
    hint: "Off Aba Road",
    mapQuery: "Rumuepirikom, Port Harcourt, Nigeria",
  },
  {
    value: "Other",
    label: "Other",
    hint: "Anywhere else in Port Harcourt",
    mapQuery: "Port Harcourt, Nigeria",
  },
];

export const LOCATION_FILTER_OPTIONS = [
  { value: "All", label: "All Areas" },
  ...LOCATIONS,
];

export const UST_GATE_AREAS = [
  "Choba (Back Gate)",
  "Obirikwe (Main Gate)",
  "Alakahia",
  "Ozuoba",
  "Mgbuoba",
];

export const OTHER_PH_AREAS = [
  "Rumuola",
  "Rumuokoro",
  "Rumuigbo",
  "Woji",
  "GRA",
  "Peter Odili",
  "Eliozu",
  "Rumuepirikom",
  "Other",
];

// Universities in Port Harcourt
export const UNIVERSITIES = [
  { value: "All", label: "Any School" },
  { value: "UST", label: "Rivers State University (RSU/UST)" },
  { value: "UniPort", label: "University of Port Harcourt (UniPort)" },
  { value: "IAUE", label: "Ignatius Ajuru University (IAUE)" },
  { value: "KenSaro", label: "Ken Saro-Wiwa Polytechnic" },
  { value: "RSFCOLLEGE", label: "Rivers State College of Arts & Science" },
  { value: "Other", label: "Other School" },
];

// Maps university to the areas students from that school typically live
// Used as fallback when listing has no nearSchool field
export const UNIVERSITY_AREA_MAP = {
  UST: ["Choba (Back Gate)", "Obirikwe (Main Gate)", "Alakahia", "Ozuoba", "Mgbuoba"],
  UniPort: ["Choba (Back Gate)", "Alakahia", "Ozuoba", "Rumuola", "Rumuokoro"],
  IAUE: ["Rumuola", "Rumuokoro", "Eliozu", "Rumuigbo"],
  KenSaro: ["Bori", "Rumuola", "Other"],
  RSFCOLLEGE: ["Rumuola", "Peter Odili", "GRA"],
  Other: [],
};