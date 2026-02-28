import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigationComponent } from './components/navigation/navigation.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavigationComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private translateService = inject(TranslateService);

  ngOnInit() {
    // Initialize translation service
    this.translateService.addLangs(['en', 'hi']);
    this.translateService.setFallbackLang('en');
    
    // Try to use browser language or default to English
    const browserLang = this.translateService.getBrowserLang();
    const langToUse = browserLang && ['en', 'hi'].includes(browserLang) ? browserLang : 'en';
    this.translateService.use(langToUse);
  }
}
