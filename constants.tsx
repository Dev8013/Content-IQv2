
import React from 'react';

export const COLORS = {
  primary: '#8B5CF6', // Vivid Purple
  secondary: '#06B6D4', // Cyan
  accent: '#10B981', // Emerald
  darkBg: '#0F172A',
  lightBg: '#F8FAFC'
};

export const PRICING_PLANS = [
  {
    name: 'Free',
    price: '$0',
    description: 'Perfect for trying out ContentIQ',
    features: [
      '3 content analyses / mo',
      'Basic quality scores',
      'YouTube video support',
      'PDF upload support',
      '7-day history retention'
    ],
    buttonText: 'Get Started',
    popular: false
  },
  {
    name: 'Basic',
    price: '$9',
    description: 'Great for regular content creators',
    features: [
      '20 content analyses / mo',
      'Detailed quality scores',
      'YouTube video support',
      'PDF upload support',
      'Improvement suggestions',
      '30-day history retention'
    ],
    buttonText: 'Start Basic',
    popular: true
  },
  {
    name: 'Pro',
    price: '$29',
    description: 'Best for professional creators',
    features: [
      'Unlimited analyses',
      'Advanced AI insights',
      'Priority processing',
      'AI-powered content ideas',
      'Unlimited history',
      'Priority support'
    ],
    buttonText: 'Go Pro',
    popular: false
  }
];
