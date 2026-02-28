import { Injectable } from '@angular/core';
import { TranslateLoader } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';

// English translations
const enTranslations = {
  "ONBOARDING": {
    "STORE_NAME": {
      "TITLE": "Store Information",
      "SUBTITLE": "What would you like to call your store?",
      "PLACEHOLDER": "e.g., VU's Brew House, The Coffee Corner...",
      "HINT": "Choose a memorable name for your store (2-50 characters)"
    },
    "STORE_DESCRIPTION": {
      "TITLE": "Store Description",
      "SUBTITLE": "Tell customers what makes your store special"
    },
    "CATEGORY_SELECTION": {
      "TITLE": "What do you sell?",
      "SUBTITLE": "Select all product categories that apply to your store"
    },
    "LANGUAGE_PREFERENCE": {
      "TITLE": "Preferred language",
      "SUBTITLE": "Select languages for your store (you can choose both)",
      "SELECTED": "Selected",
      "COMPLETE_SETUP": "Complete Setup"
    },
    "NAVIGATION": {
      "PREVIOUS": "Previous",
      "CONTINUE": "Continue",
      "NEXT": "Next"
    }
  },
  "LANGUAGES": {
    "HI": "हिंदी",
    "EN": "English",
    "HI_SUPPORT": "Hindi language support",
    "EN_SUPPORT": "English language support"
  }
};

// Hindi translations
const hiTranslations = {
  "ONBOARDING": {
    "STORE_NAME": {
      "TITLE": "स्टोर की जानकारी",
      "SUBTITLE": "आप अपने स्टोर को क्या नाम देना चाहेंगे?",
      "PLACEHOLDER": "उदा., वीयू का कैफे, द कॉफी कॉर्नर...",
      "HINT": "अपने स्टोर के लिए एक यादगार नाम चुनें (2-50 अक्षर)"
    },
    "STORE_DESCRIPTION": {
      "TITLE": "स्टोर का विवरण",
      "SUBTITLE": "ग्राहकों को बताएं कि आपका स्टोर क्या खास है"
    },
    "CATEGORY_SELECTION": {
      "TITLE": "आप क्या बेचते हैं?",
      "SUBTITLE": "अपने स्टोर के लिए उपयुक्त सभी उत्पाद श्रेणियों का चयन करें"
    },
    "LANGUAGE_PREFERENCE": {
      "TITLE": "पसंदीदा भाषा",
      "SUBTITLE": "अपने स्टोर के लिए भाषाएं चुनें (आप दोनों चुन सकते हैं)",
      "SELECTED": "चयनित",
      "COMPLETE_SETUP": "सेटअप पूरा करें"
    },
    "NAVIGATION": {
      "PREVIOUS": "पिछला",
      "CONTINUE": "जारी रखें",
      "NEXT": "अगला"
    }
  },
  "LANGUAGES": {
    "HI": "हिंदी",
    "EN": "English",
    "HI_SUPPORT": "हिंदी भाषा समर्थन",
    "EN_SUPPORT": "अंग्रेजी भाषा समर्थन"
  }
};

@Injectable()
export class CustomTranslationLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<any> {
    const translations = lang === 'hi' ? hiTranslations : enTranslations;
    return of(translations);
  }
}
