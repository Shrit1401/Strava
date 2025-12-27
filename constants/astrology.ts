export const ZODIAC_SIGNS = [
  "Aries",
  "Taurus",
  "Gemini",
  "Cancer",
  "Leo",
  "Virgo",
  "Libra",
  "Scorpio",
  "Sagittarius",
  "Capricorn",
  "Aquarius",
  "Pisces",
] as const;

export const DEGREES_PER_SIGN = 30;
export const TOTAL_DEGREES = 360;
export const NUM_HOUSES = 12;

export const PLANET_MEANINGS: Record<string, string> = {
  sun: "identity, confidence, purpose",
  moon: "emotions, habits, mind",
  mercury: "communication, thinking, learning",
  venus: "love, beauty, values",
  mars: "action, conflict, drive",
  jupiter: "expansion, growth, wisdom",
  saturn: "structure, limits, discipline",
  uranus: "innovation, freedom, change",
  neptune: "dreams, intuition, illusion",
  pluto: "transformation, power, depth",
};

export const SIGN_MEANINGS: Record<string, string> = {
  Aries: "bold, fast, direct",
  Taurus: "stable, sensual, persistent",
  Gemini: "curious, adaptable, communicative",
  Cancer: "emotional, protective, nurturing",
  Leo: "creative, proud, expressive",
  Virgo: "analytical, practical, service-oriented",
  Libra: "harmonious, diplomatic, balanced",
  Scorpio: "intense, transformative, secretive",
  Sagittarius: "adventurous, philosophical, expansive",
  Capricorn: "ambitious, disciplined, traditional",
  Aquarius: "independent, innovative, humanitarian",
  Pisces: "intuitive, compassionate, dreamy",
};

export const HOUSE_MEANINGS: Record<number, string> = {
  1: "self, body, personality",
  2: "resources, values, possessions",
  3: "communication, learning, siblings",
  4: "home, family, roots",
  5: "creativity, romance, children",
  6: "work, health, service",
  7: "partnerships, relationships, others",
  8: "transformation, shared resources, depth",
  9: "philosophy, travel, higher learning",
  10: "career, reputation, public image",
  11: "friends, groups, aspirations",
  12: "subconscious, secrets, spirituality",
};

export const HOUSE_RULERS: Record<string, string> = {
  Aries: "mars",
  Taurus: "venus",
  Gemini: "mercury",
  Cancer: "moon",
  Leo: "sun",
  Virgo: "mercury",
  Libra: "venus",
  Scorpio: "mars",
  Sagittarius: "jupiter",
  Capricorn: "saturn",
  Aquarius: "uranus",
  Pisces: "neptune",
};

export const ASPECT_MODIFIERS: Record<string, string> = {
  Conjunction: "amplifies and intensifies",
  Sextile: "flows smoothly and harmoniously",
  Square: "creates tension and challenges",
  Trine: "flows easily and naturally",
  Quincunx: "requires adjustment and adaptation",
  Opposition: "creates push-pull dynamics",
};

export const HOUSE_IMPORTANCE_ORDER = [1, 10, 7, 4, 5, 9, 11, 3, 6, 2, 8, 12];
export const PERSONAL_PLANETS = ["sun", "moon", "mercury", "venus", "mars"];

