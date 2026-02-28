import { Component, OnDestroy, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { OnboardingStoreService } from '../../../services/onboarding-store.service';

@Component({
  selector: 'app-onboarding-product-catalog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatTabsModule
  ],
  template: `
    <div class="onboarding-step">
      <div class="step-content">
        <div class="header">
          <h3>Add Products to Your Catalog</h3>
          <p>Choose how you'd like to add products to your store</p>
        </div>

        <mat-tab-group (selectedTabChange)="onTabChange($event.index)">
          <mat-tab label="Quick Start">
            <div class="tab-content">
              <form [formGroup]="catalogForm" (ngSubmit)="onNext()">
                <div class="catalog-methods">
                  <div class="method-card" 
                       [class.selected]="catalogForm.get('catalogMethod')?.value === 'excel'"
                       (click)="selectMethod('excel')">
                    <mat-icon>upload_file</mat-icon>
                    <h4>Upload Excel File</h4>
                    <p>Have an existing product list? Upload it quickly</p>
                    <span class="badge">Recommended</span>
                  </div>

                  <div class="method-card"
                       [class.selected]="catalogForm.get('catalogMethod')?.value === 'manual'"
                       (click)="selectMethod('manual')">
                    <mat-icon>edit</mat-icon>
                    <h4>Add Manually</h4>
                    <p>Create products one by one with full control</p>
                  </div>

                  <div class="method-card"
                       [class.selected]="catalogForm.get('catalogMethod')?.value === 'voice'"
                       (click)="selectMethod('voice')">
                    <mat-icon>mic</mat-icon>
                    <h4>Voice Input</h4>
                    <p>Speak your products and we'll create them</p>
                    <span class="badge new">New</span>
                  </div>
                </div>

                @if (catalogForm.get('catalogMethod')?.value === 'excel') {
                  <div class="excel-section">
                    <div class="upload-area" (click)="fileInput.click()">
                      <mat-icon>cloud_upload</mat-icon>
                      <p>Click to upload Excel file or drag and drop</p>
                      <p class="hint">Supported formats: .xlsx, .csv (Max 10MB)</p>
                      <input #fileInput type="file" style="display: none" accept=".xlsx,.csv" (change)="onFileSelected($event)">
                    </div>
                    @if (selectedFileName) {
                      <div class="selected-file">
                        <mat-icon>description</mat-icon>
                        <span>{{ selectedFileName }}</span>
                        <button type="button" mat-icon-button (click)="removeFile()">
                          <mat-icon>close</mat-icon>
                        </button>
                      </div>
                    }
                  </div>
                }

                @if (catalogForm.get('catalogMethod')?.value === 'manual') {
                  <div class="manual-section">
                    <div class="sample-product">
                      <h4>Let's add your first product</h4>
                      <mat-form-field class="full-width">
                        <mat-label>Product Name</mat-label>
                        <input matInput formControlName="firstProductName" placeholder="e.g., Cotton T-Shirt">
                      </mat-form-field>
                      <div class="form-row">
                        <mat-form-field class="half-width">
                          <mat-label>Price (₹)</mat-label>
                          <input matInput type="number" formControlName="firstProductPrice" placeholder="299">
                        </mat-form-field>
                        <mat-form-field class="half-width">
                          <mat-label>Category</mat-label>
                          <mat-select formControlName="firstProductCategory">
                            <mat-option value="clothing">Clothing</mat-option>
                            <mat-option value="electronics">Electronics</mat-option>
                            <mat-option value="home">Home & Garden</mat-option>
                            <mat-option value="books">Books</mat-option>
                            <mat-option value="sports">Sports</mat-option>
                            <mat-option value="beauty">Beauty</mat-option>
                            <mat-option value="food">Food & Beverages</mat-option>
                            <mat-option value="other">Other</mat-option>
                          </mat-select>
                        </mat-form-field>
                      </div>
                    </div>
                  </div>
                }

                @if (catalogForm.get('catalogMethod')?.value === 'voice') {
                  <div class="voice-section">
                    <div class="voice-control">
                      <button type="button" mat-fab color="primary" (click)="toggleVoiceRecording()">
                        <mat-icon>{{ isRecording ? 'stop' : 'mic' }}</mat-icon>
                      </button>
                      <p>{{ isRecording ? 'Recording... Say your products' : 'Click to start recording' }}</p>
                    </div>
                    @if (voiceTranscript) {
                      <div class="transcript">
                        <h4>Recognized Products:</h4>
                        <p>{{ voiceTranscript }}</p>
                      </div>
                    }
                  </div>
                }

                <div class="form-actions">
                  <button 
                    type="button" 
                    mat-stroked-button 
                    (click)="onBack()"
                    [disabled]="!canGoPrevious">
                    Back
                  </button>
                  <button 
                    type="submit" 
                    mat-raised-button 
                    color="primary"
                    [disabled]="!canGoNext">
                    Continue
                  </button>
                </div>
              </form>
            </div>
          </mat-tab>

          <mat-tab label="Sample Template" [disabled]="catalogForm.get('catalogMethod')?.value !== 'excel'">
            <div class="tab-content">
              <div class="template-section">
                <h4>Download Sample Template</h4>
                <p>Use our template to format your products correctly</p>
                <button type="button" mat-raised-button color="accent" (click)="downloadTemplate()">
                  <mat-icon>download</mat-icon>
                  Download Excel Template
                </button>
                
                <div class="template-preview">
                  <h4>Template Preview:</h4>
                  <table class="sample-table">
                    <thead>
                      <tr>
                        <th>Product Name</th>
                        <th>Price</th>
                        <th>Category</th>
                        <th>Description</th>
                        <th>Stock</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Cotton T-Shirt</td>
                        <td>299</td>
                        <td>Clothing</td>
                        <td>Comfortable cotton t-shirt</td>
                        <td>50</td>
                      </tr>
                      <tr>
                        <td>Wireless Earphones</td>
                        <td>1999</td>
                        <td>Electronics</td>
                        <td>High-quality wireless earphones</td>
                        <td>25</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </mat-tab>
        </mat-tab-group>
      </div>
    </div>
  `,
  styles: [`
    .onboarding-step {
      max-width: 700px;
      margin: 0 auto;
      padding: 2rem;
    }

    .step-content {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
    }

    .header h3 {
      margin: 0 0 0.5rem 0;
      color: #374151;
    }

    .header p {
      margin: 0 0 1.5rem 0;
      color: #6b7280;
    }

    .tab-content {
      padding: 1.5rem 0;
    }

    .catalog-methods {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .method-card {
      position: relative;
      padding: 1.5rem;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      text-align: center;
      cursor: pointer;
      transition: all 0.2s;
    }

    .method-card:hover {
      border-color: #6366f1;
      background: #fafbff;
    }

    .method-card.selected {
      border-color: #6366f1;
      background: #f0f4ff;
    }

    .method-card mat-icon {
      font-size: 2rem;
      width: 2rem;
      height: 2rem;
      color: #6366f1;
      margin-bottom: 0.5rem;
    }

    .method-card h4 {
      margin: 0 0 0.5rem 0;
      color: #374151;
    }

    .method-card p {
      margin: 0;
      color: #6b7280;
      font-size: 0.875rem;
    }

    .badge {
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      background: #10b981;
      color: white;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.75rem;
    }

    .badge.new {
      background: #f59e0b;
    }

    .excel-section {
      margin-bottom: 2rem;
    }

    .upload-area {
      border: 2px dashed #d1d5db;
      border-radius: 8px;
      padding: 2rem;
      text-align: center;
      cursor: pointer;
      transition: border-color 0.2s;
    }

    .upload-area:hover {
      border-color: #6366f1;
    }

    .upload-area mat-icon {
      font-size: 3rem;
      width: 3rem;
      height: 3rem;
      color: #6b7280;
      margin-bottom: 1rem;
    }

    .upload-area p {
      margin: 0;
      color: #374151;
    }

    .upload-area .hint {
      color: #6b7280;
      font-size: 0.875rem;
    }

    .selected-file {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem;
      background: #f3f4f6;
      border-radius: 6px;
      margin-top: 1rem;
    }

    .manual-section {
      margin-bottom: 2rem;
    }

    .sample-product {
      padding: 1.5rem;
      background: #f9fafb;
      border-radius: 8px;
    }

    .sample-product h4 {
      margin: 0 0 1rem 0;
      color: #374151;
    }

    .voice-section {
      text-align: center;
      margin-bottom: 2rem;
    }

    .voice-control {
      padding: 2rem;
    }

    .voice-control button {
      margin-bottom: 1rem;
    }

    .voice-control p {
      margin: 0;
      color: #6b7280;
    }

    .transcript {
      text-align: left;
      padding: 1rem;
      background: #f3f4f6;
      border-radius: 6px;
      margin-top: 1rem;
    }

    .template-section {
      padding: 1rem 0;
    }

    .template-preview {
      margin-top: 2rem;
    }

    .sample-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 1rem;
    }

    .sample-table th,
    .sample-table td {
      border: 1px solid #e5e7eb;
      padding: 0.5rem;
      text-align: left;
    }

    .sample-table th {
      background: #f9fafb;
      font-weight: 500;
    }

    .full-width {
      width: 100%;
      margin-bottom: 1rem;
    }

    .form-row {
      display: flex;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .half-width {
      flex: 1;
    }

    .form-actions {
      display: flex;
      justify-content: space-between;
      margin-top: 2rem;
    }
  `]
})
export class OnboardingProductCatalogComponent implements OnDestroy {
  private destroy$ = new Subject<void>();
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private onboardingService = inject(OnboardingStoreService);

  catalogForm: FormGroup;
  selectedFileName = '';
  isRecording = false;
  voiceTranscript = '';

  constructor() {
    this.catalogForm = this.fb.group({
      catalogMethod: ['', Validators.required],
      firstProductName: [''],
      firstProductPrice: [''],
      firstProductCategory: [''],
      fileUploaded: [false]
    });

    // Load existing data
    const existingData = this.onboardingService.onboardingData();
    if (existingData.catalogMethod) {
      this.catalogForm.patchValue({
        catalogMethod: existingData.catalogMethod
      });
    }

    // Save form changes automatically
    this.catalogForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        const products = [];
        if (value.catalogMethod === 'manual' && value.firstProductName && value.firstProductPrice) {
          products.push({
            name: value.firstProductName,
            price: value.firstProductPrice,
            category: value.firstProductCategory || 'other'
          });
        } else if (value.catalogMethod === 'excel' && value.fileUploaded) {
          products.push({ name: 'Sample Product', price: 299, category: 'sample' });
        } else if (value.catalogMethod === 'voice' && this.voiceTranscript) {
          products.push({ name: 'Voice Product', price: 0, category: 'voice' });
        }

        this.onboardingService.updateData({
          catalogMethod: value.catalogMethod,
          products: products
        });
      });
  }

  selectMethod(method: 'excel' | 'manual' | 'voice'): void {
    this.catalogForm.patchValue({ catalogMethod: method });
    
    // Clear validators for other methods
    this.clearMethodValidators();
    
    // Set validators for selected method
    switch (method) {
      case 'manual':
        this.catalogForm.get('firstProductName')?.setValidators([Validators.required]);
        this.catalogForm.get('firstProductPrice')?.setValidators([Validators.required, Validators.min(0)]);
        break;
      case 'excel':
        this.catalogForm.get('fileUploaded')?.setValidators([Validators.requiredTrue]);
        break;
      case 'voice':
        // Voice validation will be handled separately
        break;
    }
    
    this.catalogForm.updateValueAndValidity();
  }

  private clearMethodValidators(): void {
    this.catalogForm.get('firstProductName')?.clearValidators();
    this.catalogForm.get('firstProductPrice')?.clearValidators();
    this.catalogForm.get('firstProductCategory')?.clearValidators();
    this.catalogForm.get('fileUploaded')?.clearValidators();
  }

  onFileSelected(event: any): void {
    const file = event.target.files?.[0];
    if (file) {
      this.selectedFileName = file.name;
      this.catalogForm.patchValue({ fileUploaded: true });
    }
  }

  removeFile(): void {
    this.selectedFileName = '';
    this.catalogForm.patchValue({ fileUploaded: false });
  }

  toggleVoiceRecording(): void {
    this.isRecording = !this.isRecording;
    
    if (this.isRecording) {
      // Simulate voice recognition
      setTimeout(() => {
        this.voiceTranscript = 'Cotton T-Shirt ₹299, Wireless Earphones ₹1999, Coffee Mug ₹149';
        this.isRecording = false;
      }, 3000);
    }
  }

  downloadTemplate(): void {
    // In a real app, this would download an actual Excel template
    const link = document.createElement('a');
    link.href = 'data:text/csv;charset=utf-8,Product Name,Price,Category,Description,Stock\nCotton T-Shirt,299,Clothing,Comfortable cotton t-shirt,50\nWireless Earphones,1999,Electronics,High-quality wireless earphones,25';
    link.download = 'product-catalog-template.csv';
    link.click();
  }

  onTabChange(index: number): void {
    // Handle tab changes if needed
  }

  get canGoPrevious(): boolean {
    return this.onboardingService.canGoPrevious();
  }

  get canGoNext(): boolean {
    const method = this.catalogForm.get('catalogMethod')?.value;
    let methodValid = false;

    switch (method) {
      case 'excel':
        methodValid = this.catalogForm.get('fileUploaded')?.value === true;
        break;
      case 'manual':
        methodValid = !!(this.catalogForm.get('firstProductName')?.valid && 
                        this.catalogForm.get('firstProductPrice')?.valid);
        break;
      case 'voice':
        methodValid = !!this.voiceTranscript;
        break;
    }

    return methodValid && this.onboardingService.canGoNext();
  }

  onBack(): void {
    this.onboardingService.goToPreviousStep();
    const currentStep = this.onboardingService.currentStep();
    if (currentStep) {
      this.router.navigate(['/merchant/onboarding', currentStep.key]);
    }
  }

  onNext(): void {
    if (this.canGoNext) {
      this.onboardingService.goToNextStep();
      const currentStep = this.onboardingService.currentStep();
      if (currentStep) {
        this.router.navigate(['/merchant/onboarding', currentStep.key]);
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}