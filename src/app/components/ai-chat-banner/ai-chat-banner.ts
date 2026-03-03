import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

interface Message {
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

@Component({
  selector: 'app-ai-chat-banner',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './ai-chat-banner.html',
  styleUrl: './ai-chat-banner.scss',
})
export class AiChatBannerComponent {
  message = '';
  chatMessages: Message[] = [];
  isExpanded = false;

  @ViewChild('messagesEnd') messagesEndRef?: ElementRef<HTMLDivElement>;
  @ViewChild('inputEl') inputRef?: ElementRef<HTMLInputElement>;

  get hasMessages(): boolean {
    return this.chatMessages.length > 0;
  }

  private scrollToBottom(): void {
    if (this.messagesEndRef?.nativeElement) {
      this.messagesEndRef.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }
  }

  async handleSendMessage(): Promise<void> {
    const trimmed = this.message.trim();
    if (!trimmed) return;

    const userMessage: Message = {
      text: trimmed,
      sender: 'user',
      timestamp: new Date(),
    };

    this.chatMessages = [...this.chatMessages, userMessage];
    this.message = '';
    this.isExpanded = true;
    this.scrollToBottom();

    await new Promise(resolve => setTimeout(resolve, 1000));

    const lowerMessage = trimmed.toLowerCase();
    let aiResponse = '';

    if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('₹')) {
      aiResponse = 'Our products have competitive pricing with bulk discounts available! Regular prices start from ₹132 for instant coffee (100g) to premium items. Bulk orders (20kg+) get 12-15% additional discount. Would you like details on a specific product?';
    } else if (lowerMessage.includes('delivery') || lowerMessage.includes('shipping')) {
      aiResponse = 'We offer fast delivery across Mumbai and pan-India shipping. Orders above ₹500 get free delivery. Typical delivery time is 2-3 business days within Mumbai and 5-7 days pan-India.';
    } else if (lowerMessage.includes('tea') || lowerMessage.includes('chai') || lowerMessage.includes('चाय')) {
      aiResponse = 'We have an excellent range of teas! From CTC Masala Tea (most popular), Green Tea varieties including Kashmiri Kawa, to instant chai premixes. Our CTC Masala blend is a customer favorite at ₹572/kg. Which type interests you?';
    } else if (lowerMessage.includes('coffee') || lowerMessage.includes('कॉफ़ी')) {
      aiResponse = 'Our coffee selection includes Instant Regular Blended, Premium Arabica varieties, Roasted Beans, and Filter Coffee Powder. The Instant Regular is our best seller with multiple size options. Looking for a specific type?';
    } else if (lowerMessage.includes('bulk') || lowerMessage.includes('wholesale')) {
      aiResponse = 'Great! We offer attractive bulk pricing. For orders of 20kg+ on tea and 25kg+ on coffee/premixes, you get 12-15% extra discount. We also provide dedicated support for bulk buyers. What quantities are you looking at?';
    } else if (lowerMessage.includes('organic') || lowerMessage.includes('premium')) {
      aiResponse = 'Our premium range includes Kashmiri Kawa Green Tea, Pure Kashmiri Organic Kesar (Saffron), and 100% Arabica Coffee Beans. All sourced from authentic suppliers with quality certifications. Would you like more details?';
    } else if (lowerMessage.includes('order') || lowerMessage.includes('track')) {
      aiResponse = 'You can track your order anytime through WhatsApp! Just send "Track Order" to our number. You\'ll receive updates at every stage - order confirmed, packed, shipped, and out for delivery. Need help with an existing order?';
    } else if (lowerMessage.includes('payment') || lowerMessage.includes('pay')) {
      aiResponse = 'We accept UPI, Cards, Net Banking, and Cash on Delivery. All payments are secure. For bulk orders, we also offer credit terms for registered businesses. What payment method would you prefer?';
    } else if (lowerMessage.includes('return') || lowerMessage.includes('refund')) {
      aiResponse = 'We have a hassle-free 7-day return policy for unopened products. For quality issues, we offer immediate replacement or full refund. Your satisfaction is our priority! Need to return something?';
    } else {
      aiResponse = "Hi! I'm VU's AI assistant. I can help you with product information, pricing, bulk orders, delivery, payments, and more. What would you like to know?";
    }

    const botMessage: Message = {
      text: aiResponse,
      sender: 'bot',
      timestamp: new Date(),
    };

    this.chatMessages = [...this.chatMessages, botMessage];

    setTimeout(() => this.scrollToBottom(), 0);
  }

  handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.handleSendMessage();
    }
  }

  onInputFocus(): void {
    if (this.hasMessages) {
      this.isExpanded = true;
    }
  }

  setQuickMessage(text: string): void {
    this.message = text;
    if (this.inputRef?.nativeElement) {
      this.inputRef.nativeElement.focus();
    }
  }

  minimize(): void {
    this.isExpanded = false;
    this.chatMessages = [];
    this.message = '';
  }
}
