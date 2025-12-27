export const formatDegrees = (degrees: number): string => {
  const deg = Math.floor(degrees);
  const minutesDecimal = (degrees - deg) * 60;
  const min = Math.floor(minutesDecimal);
  const sec = Math.round((minutesDecimal - min) * 60);
  return `${deg}°${min}'${sec}"`;
};

export const getHouseName = (houseNumber: number): string => {
  const houseNames: Record<number, string> = {
    1: "FIRST HOUSE",
    2: "SECOND HOUSE",
    3: "THIRD HOUSE",
    4: "FOURTH HOUSE",
    5: "FIFTH HOUSE",
    6: "SIXTH HOUSE",
    7: "SEVENTH HOUSE",
    8: "EIGHTH HOUSE",
    9: "NINTH HOUSE",
    10: "TENTH HOUSE",
    11: "ELEVENTH HOUSE",
    12: "TWELFTH HOUSE",
  };
  return houseNames[houseNumber] || "";
};

const PLANET_IN_SIGN_MEANINGS: Record<string, Record<string, string>> = {
  sun: {
    Aries: "Your sun determines your ego, identity, and role in life. Your Sun is in Aries, meaning you are fundamentally independent, energetic, and direct. You move quickly and assert yourself boldly, though sometimes you can be hasty or impulsive.",
    Taurus: "Your sun determines your ego, identity, and role in life. Your Sun is in Taurus, meaning you are fundamentally stable, sensual, and persistent. You value security and comfort, though sometimes you can be stubborn or resistant to change.",
    Gemini: "Your sun determines your ego, identity, and role in life. Your Sun is in Gemini, meaning you are fundamentally curious, adaptable, and communicative. You love to learn and share ideas, though sometimes you can be scattered or superficial.",
    Cancer: "Your sun determines your ego, identity, and role in life. Your Sun is in Cancer, meaning you are fundamentally emotional, protective, and nurturing. You value home and family deeply, though sometimes you can be moody or overly sensitive.",
    Leo: "Your sun determines your ego, identity, and role in life. Your Sun is in Leo, meaning you are fundamentally creative, proud, and expressive. You love to shine and be recognized, though sometimes you can be arrogant or attention-seeking.",
    Virgo: "Your sun determines your ego, identity, and role in life. Your Sun is in Virgo, meaning you are fundamentally analytical, practical, and service-oriented. You strive for perfection and efficiency, though sometimes you can be overly critical or worrisome.",
    Libra: "Your sun determines your ego, identity, and role in life. Your Sun is in Libra, meaning you are fundamentally harmonious, diplomatic, and balanced. You value relationships and beauty, though sometimes you can be indecisive or people-pleasing.",
    Scorpio: "Your sun determines your ego, identity, and role in life. Your Sun is in Scorpio, meaning you are fundamentally intense, transformative, and secretive. You seek depth and truth, though sometimes you can be controlling or suspicious.",
    Sagittarius: "Your sun determines your ego, identity, and role in life. Your Sun is in Sagittarius, meaning you are fundamentally adventurous, philosophical, and expansive. You seek truth and meaning, though sometimes you can be tactless or restless.",
    Capricorn: "Your sun determines your ego, identity, and role in life. Your Sun is in Capricorn, meaning you are fundamentally responsible, serious, efficient, rational, and prone to power-hungry ambitiousness or supporting others' dreams. You may be emotionally reserved and need to express inner feelings and have fun.",
    Aquarius: "Your sun determines your ego, identity, and role in life. Your Sun is in Aquarius, meaning you are fundamentally independent, innovative, and humanitarian. You value freedom and progress, though sometimes you can be detached or rebellious.",
    Pisces: "Your sun determines your ego, identity, and role in life. Your Sun is in Pisces, meaning you are fundamentally intuitive, compassionate, and dreamy. You are deeply empathetic and creative, though sometimes you can be escapist or overly idealistic.",
  },
  ascendant: {
    Aries: "The ascendant is the 'mask' you present to people. It influences your personal style and the first impression you make. Its relevance may decrease with age. It changes every two hours, so reconfirm your birth time if this reading doesn't resonate. Your Ascendant is in Aries, meaning you appear independent, energetic, and direct. You move quickly, sometimes appearing hasty or impulsive, and occasionally coming off as conceited or rude.",
    Taurus: "The ascendant is the 'mask' you present to people. It influences your personal style and the first impression you make. Its relevance may decrease with age. It changes every two hours, so reconfirm your birth time if this reading doesn't resonate. Your Ascendant is in Taurus, meaning you appear stable, grounded, and sensual. You move slowly and deliberately, sometimes appearing stubborn or resistant to change.",
    Gemini: "The ascendant is the 'mask' you present to people. It influences your personal style and the first impression you make. Its relevance may decrease with age. It changes every two hours, so reconfirm your birth time if this reading doesn't resonate. Your Ascendant is in Gemini, meaning you appear curious, talkative, and adaptable. You communicate easily and seem youthful, though sometimes scattered.",
    Cancer: "The ascendant is the 'mask' you present to people. It influences your personal style and the first impression you make. Its relevance may decrease with age. It changes every two hours, so reconfirm your birth time if this reading doesn't resonate. Your Ascendant is in Cancer, meaning you appear emotional, nurturing, and protective. You seem sensitive and caring, though sometimes moody.",
    Leo: "The ascendant is the 'mask' you present to people. It influences your personal style and the first impression you make. Its relevance may decrease with age. It changes every two hours, so reconfirm your birth time if this reading doesn't resonate. Your Ascendant is in Leo, meaning you appear confident, creative, and expressive. You seem proud and charismatic, though sometimes attention-seeking.",
    Virgo: "The ascendant is the 'mask' you present to people. It influences your personal style and the first impression you make. Its relevance may decrease with age. It changes every two hours, so reconfirm your birth time if this reading doesn't resonate. Your Ascendant is in Virgo, meaning you appear analytical, practical, and service-oriented. You seem organized and detail-oriented, though sometimes critical.",
    Libra: "The ascendant is the 'mask' you present to people. It influences your personal style and the first impression you make. Its relevance may decrease with age. It changes every two hours, so reconfirm your birth time if this reading doesn't resonate. Your Ascendant is in Libra, meaning you appear harmonious, diplomatic, and balanced. You seem charming and cooperative, though sometimes indecisive.",
    Scorpio: "The ascendant is the 'mask' you present to people. It influences your personal style and the first impression you make. Its relevance may decrease with age. It changes every two hours, so reconfirm your birth time if this reading doesn't resonate. Your Ascendant is in Scorpio, meaning you appear intense, mysterious, and transformative. You seem powerful and magnetic, though sometimes intimidating.",
    Sagittarius: "The ascendant is the 'mask' you present to people. It influences your personal style and the first impression you make. Its relevance may decrease with age. It changes every two hours, so reconfirm your birth time if this reading doesn't resonate. Your Ascendant is in Sagittarius, meaning you appear adventurous, philosophical, and optimistic. You seem enthusiastic and free-spirited, though sometimes tactless.",
    Capricorn: "The ascendant is the 'mask' you present to people. It influences your personal style and the first impression you make. Its relevance may decrease with age. It changes every two hours, so reconfirm your birth time if this reading doesn't resonate. Your Ascendant is in Capricorn, meaning you appear responsible, serious, and ambitious. You seem mature and disciplined, though sometimes cold or reserved.",
    Aquarius: "The ascendant is the 'mask' you present to people. It influences your personal style and the first impression you make. Its relevance may decrease with age. It changes every two hours, so reconfirm your birth time if this reading doesn't resonate. Your Ascendant is in Aquarius, meaning you appear independent, innovative, and unconventional. You seem unique and forward-thinking, though sometimes detached.",
    Pisces: "The ascendant is the 'mask' you present to people. It influences your personal style and the first impression you make. Its relevance may decrease with age. It changes every two hours, so reconfirm your birth time if this reading doesn't resonate. Your Ascendant is in Pisces, meaning you appear intuitive, compassionate, and dreamy. You seem gentle and artistic, though sometimes vague or escapist.",
  },
  moon: {
    Aries: "The moon rules your emotions, moods, and feelings. This is likely the sign you most think of yourself as, since it reflects your personality when you're alone or deeply comfortable. Your Moon is in Aries, meaning your emotional self is independent, energetic, and enthusiastic. You have a tendency to feel inadequate and overcompensate just because failure is a possibility.",
    Taurus: "The moon rules your emotions, moods, and feelings. This is likely the sign you most think of yourself as, since it reflects your personality when you're alone or deeply comfortable. Your Moon is in Taurus, meaning your emotional self is stable, sensual, and persistent. You find security through comfort and routine.",
    Gemini: "The moon rules your emotions, moods, and feelings. This is likely the sign you most think of yourself as, since it reflects your personality when you're alone or deeply comfortable. Your Moon is in Gemini, meaning your emotional self is curious, adaptable, and communicative. You process feelings through talking and learning.",
    Cancer: "The moon rules your emotions, moods, and feelings. This is likely the sign you most think of yourself as, since it reflects your personality when you're alone or deeply comfortable. Your Moon is in Cancer, meaning your emotional self is deeply emotional, protective, and nurturing. You are highly sensitive and need security.",
    Leo: "The moon rules your emotions, moods, and feelings. This is likely the sign you most think of yourself as, since it reflects your personality when you're alone or deeply comfortable. Your Moon is in Leo, meaning your emotional self is creative, proud, and expressive. You need recognition and appreciation.",
    Virgo: "The moon rules your emotions, moods, and feelings. This is likely the sign you most think of yourself as, since it reflects your personality when you're alone or deeply comfortable. Your Moon is in Virgo, meaning your emotional self is analytical, practical, and service-oriented. You worry and need to feel useful.",
    Libra: "The moon rules your emotions, moods, and feelings. This is likely the sign you most think of yourself as, since it reflects your personality when you're alone or deeply comfortable. Your Moon is in Libra, meaning your emotional self is harmonious, diplomatic, and balanced. You need peace and partnership.",
    Scorpio: "The moon rules your emotions, moods, and feelings. This is likely the sign you most think of yourself as, since it reflects your personality when you're alone or deeply comfortable. Your Moon is in Scorpio, meaning your emotional self is intense, transformative, and secretive. You feel deeply and need emotional depth.",
    Sagittarius: "The moon rules your emotions, moods, and feelings. This is likely the sign you most think of yourself as, since it reflects your personality when you're alone or deeply comfortable. Your Moon is in Sagittarius, meaning your emotional self is adventurous, philosophical, and optimistic. You need freedom and meaning.",
    Capricorn: "The moon rules your emotions, moods, and feelings. This is likely the sign you most think of yourself as, since it reflects your personality when you're alone or deeply comfortable. Your Moon is in Capricorn, meaning your emotional self is responsible, serious, and disciplined. You suppress emotions and need structure.",
    Aquarius: "The moon rules your emotions, moods, and feelings. This is likely the sign you most think of yourself as, since it reflects your personality when you're alone or deeply comfortable. Your Moon is in Aquarius, meaning your emotional self is independent, innovative, and detached. You process feelings intellectually.",
    Pisces: "The moon rules your emotions, moods, and feelings. This is likely the sign you most think of yourself as, since it reflects your personality when you're alone or deeply comfortable. Your Moon is in Pisces, meaning your emotional self is intuitive, compassionate, and dreamy. You absorb others' emotions and need escape.",
  },
  mercury: {
    Aries: "Mercury determines how you communicate, talk, think, and process information. It also indicates how you learn. It is the mind's planet. Your Mercury is in Aries, meaning your intellect is quick, direct, and assertive. You think fast and speak your mind, though sometimes without considering consequences.",
    Taurus: "Mercury determines how you communicate, talk, think, and process information. It also indicates how you learn. It is the mind's planet. Your Mercury is in Taurus, meaning your intellect is practical, methodical, and persistent. You think slowly and thoroughly, valuing concrete facts.",
    Gemini: "Mercury determines how you communicate, talk, think, and process information. It also indicates how you learn. It is the mind's planet. Your Mercury is in Gemini, meaning your intellect is curious, adaptable, and communicative. You love to learn and share ideas, though sometimes scattered.",
    Cancer: "Mercury determines how you communicate, talk, think, and process information. It also indicates how you learn. It is the mind's planet. Your Mercury is in Cancer, meaning your intellect is emotional, intuitive, and memory-focused. You think with your heart and remember everything.",
    Leo: "Mercury determines how you communicate, talk, think, and process information. It also indicates how you learn. It is the mind's planet. Your Mercury is in Leo, meaning your intellect is creative, expressive, and dramatic. You think big and communicate with flair.",
    Virgo: "Mercury determines how you communicate, talk, think, and process information. It also indicates how you learn. It is the mind's planet. Your Mercury is in Virgo, meaning your intellect is analytical, detail-oriented, and practical. You think precisely and notice everything.",
    Libra: "Mercury determines how you communicate, talk, think, and process information. It also indicates how you learn. It is the mind's planet. Your Mercury is in Libra, meaning your intellect is balanced, diplomatic, and harmonious. You think about relationships and fairness.",
    Scorpio: "Mercury determines how you communicate, talk, think, and process information. It also indicates how you learn. It is the mind's planet. Your Mercury is in Scorpio, meaning your intellect is intense, penetrating, and secretive. You think deeply and see hidden truths.",
    Sagittarius: "Mercury determines how you communicate, talk, think, and process information. It also indicates how you learn. It is the mind's planet. Your Mercury is in Sagittarius, meaning your intellect is philosophical, expansive, and optimistic. You think big picture and love learning.",
    Capricorn: "Mercury determines how you communicate, talk, think, and process information. It also indicates how you learn. It is the mind's planet. Your Mercury is in Capricorn, meaning your intellect is practical, structured, and ambitious. You think strategically and value efficiency.",
    Aquarius: "Mercury determines how you communicate, talk, think, and process information. It also indicates how you learn. It is the mind's planet. Your Mercury is in Aquarius, meaning your intellect is insightful, unconventional, and super meta. You have a rich imagination that allows you to think in a way that is abstracted from daily life. You enjoy intellectual banter, though you sometimes push your ideas on others.",
    Pisces: "Mercury determines how you communicate, talk, think, and process information. It also indicates how you learn. It is the mind's planet. Your Mercury is in Pisces, meaning your intellect is intuitive, imaginative, and dreamy. You think with images and feelings, though sometimes unclear.",
  },
  venus: {
    Aries: "Venus determines how and what you love. It indicates how you express affection and the qualities you're attracted to. Your Venus is in Aries, meaning your romantic side is bold, direct, and passionate. You fall in love quickly and need excitement.",
    Taurus: "Venus determines how and what you love. It indicates how you express affection and the qualities you're attracted to. Your Venus is in Taurus, meaning your romantic side is sensual, stable, and loyal. You value comfort and physical connection.",
    Gemini: "Venus determines how and what you love. It indicates how you express affection and the qualities you're attracted to. Your Venus is in Gemini, meaning your romantic side is curious, playful, and communicative. You need mental stimulation and variety.",
    Cancer: "Venus determines how and what you love. It indicates how you express affection and the qualities you're attracted to. Your Venus is in Cancer, meaning your romantic side is emotional, protective, and nurturing. You need security and emotional connection.",
    Leo: "Venus determines how and what you love. It indicates how you express affection and the qualities you're attracted to. Your Venus is in Leo, meaning your romantic side is generous, dramatic, and proud. You love to spoil and be spoiled.",
    Virgo: "Venus determines how and what you love. It indicates how you express affection and the qualities you're attracted to. Your Venus is in Virgo, meaning your romantic side is practical, service-oriented, and analytical. You show love through acts of service.",
    Libra: "Venus determines how and what you love. It indicates how you express affection and the qualities you're attracted to. Your Venus is in Libra, meaning your romantic side is harmonious, diplomatic, and balanced. You need partnership and beauty.",
    Scorpio: "Venus determines how and what you love. It indicates how you express affection and the qualities you're attracted to. Your Venus is in Scorpio, meaning your romantic side is intense, passionate, and transformative. You need deep emotional connection.",
    Sagittarius: "Venus determines how and what you love. It indicates how you express affection and the qualities you're attracted to. Your Venus is in Sagittarius, meaning your romantic side is curious and easily bored. You enjoy your independence and aren't willing to compromise that freedom for a relationship that doesn't expand the boundaries of your world.",
    Capricorn: "Venus determines how and what you love. It indicates how you express affection and the qualities you're attracted to. Your Venus is in Capricorn, meaning your romantic side is serious, practical, and committed. You value stability and long-term partnership.",
    Aquarius: "Venus determines how and what you love. It indicates how you express affection and the qualities you're attracted to. Your Venus is in Aquarius, meaning your romantic side is independent, unconventional, and friendly. You need freedom and intellectual connection.",
    Pisces: "Venus determines how and what you love. It indicates how you express affection and the qualities you're attracted to. Your Venus is in Pisces, meaning your romantic side is dreamy, compassionate, and idealistic. You love deeply and need emotional connection.",
  },
  mars: {
    Aries: "Mars is the planet of aggression. It determines how you assert yourself, take action, and use your energy, particularly in your sex life, ambitiousness, and anger. Your Mars is in Aries, meaning you assert yourself boldly and directly. You act quickly and impulsively.",
    Taurus: "Mars is the planet of aggression. It determines how you assert yourself, take action, and use your energy, particularly in your sex life, ambitiousness, and anger. Your Mars is in Taurus, meaning you assert yourself slowly and persistently. You are steady and determined.",
    Gemini: "Mars is the planet of aggression. It determines how you assert yourself, take action, and use your energy, particularly in your sex life, ambitiousness, and anger. Your Mars is in Gemini, meaning you assert yourself in a way that is quick and heady, and you push things forward with lots of energy, though sometimes without focus.",
    Cancer: "Mars is the planet of aggression. It determines how you assert yourself, take action, and use your energy, particularly in your sex life, ambitiousness, and anger. Your Mars is in Cancer, meaning you assert yourself emotionally and protectively. You act based on feelings.",
    Leo: "Mars is the planet of aggression. It determines how you assert yourself, take action, and use your energy, particularly in your sex life, ambitiousness, and anger. Your Mars is in Leo, meaning you assert yourself dramatically and proudly. You act with confidence and flair.",
    Virgo: "Mars is the planet of aggression. It determines how you assert yourself, take action, and use your energy, particularly in your sex life, ambitiousness, and anger. Your Mars is in Virgo, meaning you assert yourself practically and efficiently. You act with precision and service.",
    Libra: "Mars is the planet of aggression. It determines how you assert yourself, take action, and use your energy, particularly in your sex life, ambitiousness, and anger. Your Mars is in Libra, meaning you assert yourself diplomatically and harmoniously. You avoid conflict and seek balance.",
    Scorpio: "Mars is the planet of aggression. It determines how you assert yourself, take action, and use your energy, particularly in your sex life, ambitiousness, and anger. Your Mars is in Scorpio, meaning you assert yourself intensely and secretly. You act with determination and depth.",
    Sagittarius: "Mars is the planet of aggression. It determines how you assert yourself, take action, and use your energy, particularly in your sex life, ambitiousness, and anger. Your Mars is in Sagittarius, meaning you assert yourself enthusiastically and optimistically. You act with adventure and freedom.",
    Capricorn: "Mars is the planet of aggression. It determines how you assert yourself, take action, and use your energy, particularly in your sex life, ambitiousness, and anger. Your Mars is in Capricorn, meaning you assert yourself strategically and ambitiously. You act with discipline and purpose.",
    Aquarius: "Mars is the planet of aggression. It determines how you assert yourself, take action, and use your energy, particularly in your sex life, ambitiousness, and anger. Your Mars is in Aquarius, meaning you assert yourself independently and innovatively. You act with originality and detachment.",
    Pisces: "Mars is the planet of aggression. It determines how you assert yourself, take action, and use your energy, particularly in your sex life, ambitiousness, and anger. Your Mars is in Pisces, meaning you assert yourself passively and intuitively. You act based on feelings and dreams.",
  },
  jupiter: {
    Aries: "Jupiter is one of the two social planets. It rules idealism, optimism, and expansion. It is very philosophical. Your Jupiter is in Aries, meaning you grow and find understanding through independence, action, and boldness. You expand through taking initiative.",
    Taurus: "Jupiter is one of the two social planets. It rules idealism, optimism, and expansion. It is very philosophical. Your Jupiter is in Taurus, meaning you grow and find understanding through stability, sensuality, and material security. You expand through building resources.",
    Gemini: "Jupiter is one of the two social planets. It rules idealism, optimism, and expansion. It is very philosophical. Your Jupiter is in Gemini, meaning you grow and find understanding through communication, learning, and curiosity. You expand through knowledge.",
    Cancer: "Jupiter is one of the two social planets. It rules idealism, optimism, and expansion. It is very philosophical. Your Jupiter is in Cancer, meaning you grow and find understanding through emotions, family, and security. You expand through nurturing.",
    Leo: "Jupiter is one of the two social planets. It rules idealism, optimism, and expansion. It is very philosophical. Your Jupiter is in Leo, meaning you grow and find understanding through creativity, self-expression, and recognition. You expand through shining.",
    Virgo: "Jupiter is one of the two social planets. It rules idealism, optimism, and expansion. It is very philosophical. Your Jupiter is in Virgo, meaning you grow and find understanding through service, analysis, and improvement. You expand through helping others.",
    Libra: "Jupiter is one of the two social planets. It rules idealism, optimism, and expansion. It is very philosophical. Your Jupiter is in Libra, meaning you grow and find understanding through relationships, harmony, and beauty. You expand through partnership.",
    Scorpio: "Jupiter is one of the two social planets. It rules idealism, optimism, and expansion. It is very philosophical. Your Jupiter is in Scorpio, meaning you grow and find understanding through transformation, depth, and intensity. You expand through facing truth.",
    Sagittarius: "Jupiter is one of the two social planets. It rules idealism, optimism, and expansion. It is very philosophical. Your Jupiter is in Sagittarius, meaning you grow and find understanding through adventure, philosophy, and expansion. You expand through exploration.",
    Capricorn: "Jupiter is one of the two social planets. It rules idealism, optimism, and expansion. It is very philosophical. Your Jupiter is in Capricorn, meaning you grow and find understanding through responsibility, practicality, ambition, seriousness, efficiency, rationality, and power.",
    Aquarius: "Jupiter is one of the two social planets. It rules idealism, optimism, and expansion. It is very philosophical. Your Jupiter is in Aquarius, meaning you grow and find understanding through innovation, independence, and humanitarianism. You expand through progress.",
    Pisces: "Jupiter is one of the two social planets. It rules idealism, optimism, and expansion. It is very philosophical. Your Jupiter is in Pisces, meaning you grow and find understanding through intuition, compassion, and spirituality. You expand through transcendence.",
  },
  saturn: {
    Aries: "Saturn is the other social planet. It rules responsibility, restrictions, limits, boundaries, fears, and self-discipline. Your Saturn is in Aries, meaning you struggle with impatience, impulsiveness, and asserting yourself. You learn discipline through action.",
    Taurus: "Saturn is the other social planet. It rules responsibility, restrictions, limits, boundaries, fears, and self-discipline. Your Saturn is in Taurus, meaning you struggle with material security, possessiveness, and change. You learn discipline through stability.",
    Gemini: "Saturn is the other social planet. It rules responsibility, restrictions, limits, boundaries, fears, and self-discipline. Your Saturn is in Gemini, meaning you struggle with communication, learning, and scattered thinking. You learn discipline through focus.",
    Cancer: "Saturn is the other social planet. It rules responsibility, restrictions, limits, boundaries, fears, and self-discipline. Your Saturn is in Cancer, meaning you struggle with emotions, family, and security. You learn discipline through emotional maturity.",
    Leo: "Saturn is the other social planet. It rules responsibility, restrictions, limits, boundaries, fears, and self-discipline. Your Saturn is in Leo, meaning you struggle with creativity, self-expression, and pride. You learn discipline through humility.",
    Virgo: "Saturn is the other social planet. It rules responsibility, restrictions, limits, boundaries, fears, and self-discipline. Your Saturn is in Virgo, meaning you struggle with perfectionism, a critical eye, workaholic tendencies, and your need to be pure.",
    Libra: "Saturn is the other social planet. It rules responsibility, restrictions, limits, boundaries, fears, and self-discipline. Your Saturn is in Libra, meaning you struggle with relationships, balance, and indecision. You learn discipline through partnership.",
    Scorpio: "Saturn is the other social planet. It rules responsibility, restrictions, limits, boundaries, fears, and self-discipline. Your Saturn is in Scorpio, meaning you struggle with intensity, control, and transformation. You learn discipline through letting go.",
    Sagittarius: "Saturn is the other social planet. It rules responsibility, restrictions, limits, boundaries, fears, and self-discipline. Your Saturn is in Sagittarius, meaning you struggle with freedom, philosophy, and restlessness. You learn discipline through commitment.",
    Capricorn: "Saturn is the other social planet. It rules responsibility, restrictions, limits, boundaries, fears, and self-discipline. Your Saturn is in Capricorn, meaning you struggle with authority, structure, and ambition. You learn discipline through responsibility.",
    Aquarius: "Saturn is the other social planet. It rules responsibility, restrictions, limits, boundaries, fears, and self-discipline. Your Saturn is in Aquarius, meaning you struggle with independence, innovation, and detachment. You learn discipline through community.",
    Pisces: "Saturn is the other social planet. It rules responsibility, restrictions, limits, boundaries, fears, and self-discipline. Your Saturn is in Pisces, meaning you struggle with boundaries, illusions, and escapism. You learn discipline through reality.",
  },
  uranus: {
    Aries: "Uranus stays in each sign for seven years, meaning it rules a generation more than a person. It rules innovation, freedom, and sudden change. Your Uranus is in Aries, meaning your generation values independence, action, and breaking free from tradition.",
    Taurus: "Uranus stays in each sign for seven years, meaning it rules a generation more than a person. It rules innovation, freedom, and sudden change. Your Uranus is in Taurus, meaning your generation values stability, material security, and practical innovation.",
    Gemini: "Uranus stays in each sign for seven years, meaning it rules a generation more than a person. It rules innovation, freedom, and sudden change. Your Uranus is in Gemini, meaning your generation values communication, learning, and information revolution.",
    Cancer: "Uranus stays in each sign for seven years, meaning it rules a generation more than a person. It rules innovation, freedom, and sudden change. Your Uranus is in Cancer, meaning your generation values emotional security, family, and home innovation.",
    Leo: "Uranus stays in each sign for seven years, meaning it rules a generation more than a person. It rules innovation, freedom, and sudden change. Your Uranus is in Leo, meaning your generation values creativity, self-expression, and dramatic change.",
    Virgo: "Uranus stays in each sign for seven years, meaning it rules a generation more than a person. It rules innovation, freedom, and sudden change. Your Uranus is in Virgo, meaning your generation values service, health, and practical innovation.",
    Libra: "Uranus stays in each sign for seven years, meaning it rules a generation more than a person. It rules innovation, freedom, and sudden change. Your Uranus is in Libra, meaning your generation values relationships, harmony, and social innovation.",
    Scorpio: "Uranus stays in each sign for seven years, meaning it rules a generation more than a person. It rules innovation, freedom, and sudden change. Your Uranus is in Scorpio, meaning your generation values transformation, depth, and intense change.",
    Sagittarius: "Uranus stays in each sign for seven years, meaning it rules a generation more than a person. It rules innovation, freedom, and sudden change. Your Uranus is in Sagittarius, meaning your generation values adventure, philosophy, and expansive change.",
    Capricorn: "Uranus stays in each sign for seven years, meaning it rules a generation more than a person. It rules innovation, freedom, and sudden change. Your Uranus is in Capricorn, meaning your generation values structure, authority, and systematic change.",
    Aquarius: "Uranus stays in each sign for seven years, meaning it rules a generation more than a person. It rules innovation, freedom, and sudden change. Your Uranus is in Aquarius, meaning your generation values innovation, independence, and revolutionary change.",
    Pisces: "Uranus stays in each sign for seven years, meaning it rules a generation more than a person. It rules innovation, freedom, and sudden change. Your Uranus is in Pisces, meaning your generation values intuition, spirituality, and transcendent change.",
  },
  neptune: {
    Aries: "Neptune stays in each sign for about fourteen years, meaning it rules a generation more than a person. It rules dreams, intuition, illusion, and spirituality. Your Neptune is in Aries, meaning your generation dreams of independence, action, and pioneering new paths.",
    Taurus: "Neptune stays in each sign for about fourteen years, meaning it rules a generation more than a person. It rules dreams, intuition, illusion, and spirituality. Your Neptune is in Taurus, meaning your generation dreams of stability, beauty, and material transcendence.",
    Gemini: "Neptune stays in each sign for about fourteen years, meaning it rules a generation more than a person. It rules dreams, intuition, illusion, and spirituality. Your Neptune is in Gemini, meaning your generation dreams of communication, learning, and information transcendence.",
    Cancer: "Neptune stays in each sign for about fourteen years, meaning it rules a generation more than a person. It rules dreams, intuition, illusion, and spirituality. Your Neptune is in Cancer, meaning your generation dreams of emotional security, family, and nurturing transcendence.",
    Leo: "Neptune stays in each sign for about fourteen years, meaning it rules a generation more than a person. It rules dreams, intuition, illusion, and spirituality. Your Neptune is in Leo, meaning your generation dreams of creativity, self-expression, and artistic transcendence.",
    Virgo: "Neptune stays in each sign for about fourteen years, meaning it rules a generation more than a person. It rules dreams, intuition, illusion, and spirituality. Your Neptune is in Virgo, meaning your generation dreams of service, health, and practical transcendence.",
    Libra: "Neptune stays in each sign for about fourteen years, meaning it rules a generation more than a person. It rules dreams, intuition, illusion, and spirituality. Your Neptune is in Libra, meaning your generation dreams of relationships, harmony, and aesthetic transcendence.",
    Scorpio: "Neptune stays in each sign for about fourteen years, meaning it rules a generation more than a person. It rules dreams, intuition, illusion, and spirituality. Your Neptune is in Scorpio, meaning your generation dreams of transformation, depth, and mystical transcendence.",
    Sagittarius: "Neptune stays in each sign for about fourteen years, meaning it rules a generation more than a person. It rules dreams, intuition, illusion, and spirituality. Your Neptune is in Sagittarius, meaning your generation dreams of adventure, philosophy, and spiritual expansion.",
    Capricorn: "Neptune stays in each sign for about fourteen years, meaning it rules a generation more than a person. It rules dreams, intuition, illusion, and spirituality. Your Neptune is in Capricorn, meaning your generation dreams of structure, authority, and material transcendence.",
    Aquarius: "Neptune stays in each sign for about fourteen years, meaning it rules a generation more than a person. It rules dreams, intuition, illusion, and spirituality. Your Neptune is in Aquarius, meaning your generation dreams of innovation, independence, and collective transcendence.",
    Pisces: "Neptune stays in each sign for about fourteen years, meaning it rules a generation more than a person. It rules dreams, intuition, illusion, and spirituality. Your Neptune is in Pisces, meaning your generation dreams of intuition, compassion, and complete transcendence.",
  },
  pluto: {
    Aries: "Pluto stays in each sign for about 12-30 years, meaning it rules a generation more than a person. It rules transformation, power, depth, and regeneration. Your Pluto is in Aries, meaning your generation transforms through independence, action, and breaking free.",
    Taurus: "Pluto stays in each sign for about 12-30 years, meaning it rules a generation more than a person. It rules transformation, power, depth, and regeneration. Your Pluto is in Taurus, meaning your generation transforms through stability, resources, and material power.",
    Gemini: "Pluto stays in each sign for about 12-30 years, meaning it rules a generation more than a person. It rules transformation, power, depth, and regeneration. Your Pluto is in Gemini, meaning your generation transforms through communication, information, and mental power.",
    Cancer: "Pluto stays in each sign for about 12-30 years, meaning it rules a generation more than a person. It rules transformation, power, depth, and regeneration. Your Pluto is in Cancer, meaning your generation transforms through emotions, family, and emotional power.",
    Leo: "Pluto stays in each sign for about 12-30 years, meaning it rules a generation more than a person. It rules transformation, power, depth, and regeneration. Your Pluto is in Leo, meaning your generation transforms through creativity, self-expression, and creative power.",
    Virgo: "Pluto stays in each sign for about 12-30 years, meaning it rules a generation more than a person. It rules transformation, power, depth, and regeneration. Your Pluto is in Virgo, meaning your generation transforms through service, health, and practical power.",
    Libra: "Pluto stays in each sign for about 12-30 years, meaning it rules a generation more than a person. It rules transformation, power, depth, and regeneration. Your Pluto is in Libra, meaning your generation transforms through relationships, harmony, and social power.",
    Scorpio: "Pluto stays in each sign for about 12-30 years, meaning it rules a generation more than a person. It rules transformation, power, depth, and regeneration. Your Pluto is in Scorpio, meaning your generation transforms through intensity, depth, and transformative power.",
    Sagittarius: "Pluto stays in each sign for about 12-30 years, meaning it rules a generation more than a person. It rules transformation, power, depth, and regeneration. Your Pluto is in Sagittarius, meaning your generation transforms through adventure, philosophy, and expansive power.",
    Capricorn: "Pluto stays in each sign for about 12-30 years, meaning it rules a generation more than a person. It rules transformation, power, depth, and regeneration. Your Pluto is in Capricorn, meaning your generation transforms through structure, authority, and systemic power.",
    Aquarius: "Pluto stays in each sign for about 12-30 years, meaning it rules a generation more than a person. It rules transformation, power, depth, and regeneration. Your Pluto is in Aquarius, meaning your generation transforms through innovation, independence, and revolutionary power.",
    Pisces: "Pluto stays in each sign for about 12-30 years, meaning it rules a generation more than a person. It rules transformation, power, depth, and regeneration. Your Pluto is in Pisces, meaning your generation transforms through intuition, spirituality, and transcendent power.",
  },
};

const HOUSE_MEANINGS: Record<string, Record<number, string>> = {
  default: {
    1: "It's in your first house, meaning you express this energy through your self, body, and personality.",
    2: "It's in your second house, meaning you express this energy through your resources, values, and possessions.",
    3: "It's in your third house, meaning you put a lot of energy into the things you know and are familiar with.",
    4: "It's in your fourth house, meaning you express this energy through your home, family, and roots.",
    5: "It's in your fifth house, meaning you express this energy through creativity, romance, and children.",
    6: "It's in your sixth house, meaning you have had difficulties with your day-to-day routines, work, and bodily health.",
    7: "It's in your seventh house, meaning you express this energy through partnerships, relationships, and others.",
    8: "It's in your eighth house, meaning you express this energy through transformation, shared resources, and depth.",
    9: "It's in your ninth house, meaning you express this energy through philosophy, faith, education, and politics.",
    10: "It's in your tenth house, meaning you need to distinguish yourself through goals, success, and responsibility.",
    11: "It's in your eleventh house, meaning you are curious about and inclined to analyze your friends, how to make an impact on people, and your political life.",
    12: "It's in your twelfth house, meaning you find security and safety through privacy, secrets, and introspection.",
  },
  venus: {
    9: "It's in your ninth house, meaning that for you, love is often expressed in philosophy, faith, education, and politics.",
  },
  mars: {
    3: "It's in your third house, meaning you put a lot of energy into the things you know and are familiar with.",
  },
  jupiter: {
    10: "It's in your tenth house, meaning you find success through goals and responsibility.",
  },
  saturn: {
    6: "It's in your sixth house, meaning you have had difficulties with your day-to-day routines, work, and bodily health.",
  },
};

export const getPlanetInterpretation = (
  planet: string,
  sign: string,
  house: number
): string => {
  const signMeaning = PLANET_IN_SIGN_MEANINGS[planet]?.[sign] || "";
  const planetHouseMeanings = HOUSE_MEANINGS[planet] || HOUSE_MEANINGS.default;
  const houseMeaning = planetHouseMeanings[house] || HOUSE_MEANINGS.default[house] || "";
  
  if (planet === "sun" && house === 10) {
    return `${signMeaning} Being in the tenth house means a need to distinguish yourself through goals, success, and responsibility.`;
  }
  
  return `${signMeaning} ${houseMeaning}`;
};

