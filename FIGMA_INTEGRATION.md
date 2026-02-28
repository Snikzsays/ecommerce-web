# Figma AI Integration Setup Guide

## 🎨 **Complete Figma-to-Angular Pipeline**

Your Angular ecommerce catalog now has powerful Figma AI integration! Here's how to connect your designs:

### **📋 Prerequisites**

1. **Install required packages:**
   ```bash
   npm install @figma/rest-api-spec figma-api @figma/design-tokens figma-js style-dictionary
   ```

2. **Get Figma API Key:**
   - Go to [Figma Developer Settings](https://www.figma.com/developers/api#authentication)
   - Generate a new personal access token
   - Copy the token (starts with `figd_`)

3. **Get Figma File Key:**
   - Open your Figma catalog design file
   - Copy the file key from URL: `figma.com/file/FILE_KEY_HERE/...`

### **🚀 Quick Setup**

1. **Add route to access Figma integration:**
   ```typescript
   // Add to app.routes.ts
   {
     path: 'figma',
     loadComponent: () => import('./components/figma-integration/figma-integration').then(m => m.FigmaIntegrationComponent)
   }
   ```

2. **Access Figma Integration:**
   - Navigate to `/figma` in your app
   - Enter your API key and file key
   - Click "Connect to Figma"

3. **Sync Your Designs:**
   - **Design Tokens**: Extract colors, typography, spacing
   - **Product Cards**: Find and convert product components
   - **Catalog Layouts**: Extract grid and list layouts

### **✨ Features Available**

#### **🎨 Design Token Sync**
- Automatically extracts color palette from Figma
- Syncs typography styles (heading, body, caption)
- Applies spacing and border radius tokens
- Updates your Angular catalog theme in real-time

#### **🛍️ Product Card Generation**
- Finds components named "Product Card", "ProductCard", or "product-card"
- Generates Angular component code with proper styling
- Maintains existing cart functionality
- Downloads ready-to-use TypeScript files

#### **📱 Catalog Layout Extraction**
- Extracts "Catalog", "Product Grid", "Category Grid" layouts
- Converts Figma layouts to Angular templates
- Preserves responsive design patterns
- Integrates with existing navigation flow

### **🔄 Workflow Integration**

#### **Design-First Development**
1. Design your catalog in Figma
2. Use consistent component naming
3. Sync to Angular automatically
4. Maintain design-code consistency

#### **Real-Time Updates**
- Figma design changes → Re-sync tokens
- New product card designs → Generate components
- Layout updates → Update Angular templates

### **📁 Generated Files**

The integration creates:
- **Design tokens** as CSS custom properties
- **Angular components** from Figma components
- **SCSS styles** extracted from Figma
- **TypeScript interfaces** for component props

### **🎯 Best Practices**

#### **Figma File Structure**
```
Your Figma File
├── 🎨 Design System
│   ├── Colors (Primary, Secondary, Accent)
│   ├── Typography (Heading, Body, Caption)
│   └── Spacing (XS, SM, MD, LG, XL)
├── 🛍️ Product Components
│   ├── Product Card
│   ├── Featured Product Card
│   └── Sale Product Card
└── 📱 Catalog Layouts
    ├── Category Grid
    ├── Product Grid
    └── Search Results
```

#### **Component Naming**
- Use descriptive names: "Product Card", "Category Grid"
- Include variants: "Product Card - Featured", "Product Card - Sale"
- Follow Angular conventions for generated code

### **🔧 Advanced Features**

#### **Custom Token Mapping**
```typescript
// Configure custom token extraction
const tokenMapping = {
  'Primary Color': 'colors.primary',
  'Golden Theme': 'colors.secondary',
  'Card Padding': 'spacing.card'
};
```

#### **Component Customization**
```typescript
// Generated component with Figma styling
@Component({
  template: `<!-- Exact Figma layout -->`,
  styles: [`/* Figma extracted styles */`]
})
export class FigmaProductCardComponent {
  // Maintains Angular functionality
  @Input() product: Product;
  @Output() addToCart = new EventEmitter();
}
```

### **🎉 Result**

Your Angular catalog will:
- ✅ **Match Figma designs pixel-perfectly**
- ✅ **Update automatically when designs change**
- ✅ **Maintain all existing functionality (cart, search, chat)**
- ✅ **Generate clean, maintainable Angular code**
- ✅ **Support responsive design patterns**
- ✅ **Preserve your golden theme styling**

Navigate to `/figma` in your app to start the integration!