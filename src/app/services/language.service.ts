import { Injectable, signal, computed } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export interface SupportedLanguage {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private readonly STORAGE_KEY = 'preferred-language';
  private _currentLanguage = signal<string>('en');

  // Supported languages configuration
  readonly supportedLanguages: SupportedLanguage[] = [
    {
      code: 'en',
      name: 'English',
      nativeName: 'English',
      flag: 'GB'
    },
    {
      code: 'hi',
      name: 'Hindi',
      nativeName: 'हिंदी',
      flag: 'IN'
    }
  ];

  // Computed values
  currentLanguage = this._currentLanguage.asReadonly();
  currentLanguageInfo = computed(() => 
    this.supportedLanguages.find(lang => lang.code === this._currentLanguage()) || this.supportedLanguages[0]
  );

  constructor(private translateService: TranslateService) {
    this.initializeLanguage();
  }

  /**
   * Initialize language from localStorage or browser preference
   */
  private initializeLanguage(): void {
    // Check if we're in browser environment
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      this.setLanguage('en');
      return;
    }

    // Check localStorage first
    const savedLanguage = localStorage.getItem(this.STORAGE_KEY);
    if (savedLanguage && this.isLanguageSupported(savedLanguage)) {
      this.setLanguage(savedLanguage);
      return;
    }

    // Check browser language
    const browserLang = this.translateService.getBrowserLang();
    if (browserLang && this.isLanguageSupported(browserLang)) {
      this.setLanguage(browserLang);
      return;
    }

    // Default to English
    this.setLanguage('en');
  }

  /**
   * Set the current language
   */
  setLanguage(languageCode: string): void {
    if (!this.isLanguageSupported(languageCode)) {
      console.warn(`Language ${languageCode} is not supported. Using English as fallback.`);
      languageCode = 'en';
    }

    this._currentLanguage.set(languageCode);
    this.translateService.use(languageCode);
    
    // Only use localStorage in browser environment
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.setItem(this.STORAGE_KEY, languageCode);
    }
  }

  /**
   * Get translation for a key
   */
  getTranslation(key: string, params?: any): string {
    return this.translateService.instant(key, params);
  }

  /**
   * Get translation observable for a key
   */
  getTranslationStream(key: string, params?: any) {
    return this.translateService.get(key, params);
  }

  /**
   * Check if language is supported
   */
  isLanguageSupported(languageCode: string): boolean {
    return this.supportedLanguages.some(lang => lang.code === languageCode);
  }

  /**
   * Toggle between available languages
   */
  toggleLanguage(): void {
    const currentIndex = this.supportedLanguages.findIndex(
      lang => lang.code === this._currentLanguage()
    );
    const nextIndex = (currentIndex + 1) % this.supportedLanguages.length;
    this.setLanguage(this.supportedLanguages[nextIndex].code);
  }

  /**
   * Get language info by code
   */
  getLanguageInfo(code: string): SupportedLanguage | undefined {
    return this.supportedLanguages.find(lang => lang.code === code);
  }

  /**
   * Format text for current language direction (useful for RTL languages)
   */
  getTextDirection(): 'ltr' | 'rtl' {
    // Hindi and English are both LTR
    return 'ltr';
  }
}