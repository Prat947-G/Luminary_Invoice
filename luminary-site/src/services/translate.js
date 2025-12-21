// src/services/translate.js

// 1. SAFETY DICTIONARY (Guarantees these specific words work INSTANTLY)
const dictionary = {
  // English Key
  "Luminary": { 
    hi: "ल्यूमिनरी", 
    mr: "ल्युमिनरी" 
  },
  "Interior & Lifestyle": { 
    hi: "आंतरिक और जीवन शैली", 
    mr: "इंटिरियर आणि लाइफस्टाइल" 
  },
  "Last Updated": { 
    hi: "नवीनतम अपडेट", 
    mr: "शेवटचे अपडेट" 
  },
  "Read Case Study": { 
    hi: "केस स्टडी पढ़ें", 
    mr: "केस स्टडी वाचा" 
  },
  "Hatsun Agro": {
    hi: "हटसुन एग्रो",
    mr: "हॅटसन ऍग्रो"
  },
  "Harmonious Park Layouts": {
    hi: "सामंजस्यपूर्ण पार्क लेआउट",
    mr: "हार्मोनियस पार्क लेआउट्स"
  },
  "JK Cake": {
    hi: "जेके केक",
    mr: "जेके केक"
  },
  "Community Square Patterns": {
    hi: "सामुदायिक स्क्वायर पैटर्न",
    mr: "कम्युनिटी स्क्वेअर पॅटर्न"
  },
  "JVS Cometsco": {
    hi: "जेवीएस कोमेट्स्को",
    mr: "जेव्हीएस कोमेट्स्को"
  },
  "Modern Lifestyle Main Branch": {
    hi: "आधुनिक जीवन शैली मुख्य शाखा",
    mr: "मॉडर्न लाइफस्टाइल मुख्य शाखा"
  }
};

export const translateText = async (text, targetLang) => {
  if (targetLang === 'en') return text;

  // 2. CHECK DICTIONARY FIRST (Instant Speed)
  if (dictionary[text] && dictionary[text][targetLang]) {
    console.log(`Using dictionary for: ${text}`);
    return dictionary[text][targetLang];
  }

  // 3. FALLBACK TO API (If word is not in dictionary)
  try {
    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLang}`
    );
    const data = await response.json();
    return data.responseData.translatedText;
  } catch (error) {
    console.error("API Failed, returning English", error);
    return text; 
  }
};