# 🎨 iDoc - Spécifications Design Complètes pour Figma

**Date:** 2025-11-16
**Version:** 1.0
**Objectif:** 1 vente/seconde - Conversion maximale flux invité

---

## 📋 Table des Matières

1. [Design System](#1-design-system)
2. [Pages & Layouts](#2-pages--layouts)
3. [Composants UI](#3-composants-ui)
4. [Animations & Micro-interactions](#4-animations--micro-interactions)
5. [États & Variations](#5-états--variations)
6. [Responsive Breakpoints](#6-responsive-breakpoints)
7. [Prototypes & Flows](#7-prototypes--flows)
8. [Assets & Exports](#8-assets--exports)

---

## 1️⃣ Design System

### 🎨 Palette de Couleurs

#### Couleurs Primaires
```
Primary Blue:     #2563EB (RGB: 37, 99, 235)
├─ Light:         #3B82F6 (hover states)
├─ Dark:          #1E40AF (pressed states)
└─ Ultra Light:   #DBEAFE (backgrounds)

Primary Indigo:   #4F46E5 (RGB: 79, 70, 229)
├─ Light:         #6366F1
├─ Dark:          #4338CA
└─ Ultra Light:   #E0E7FF

Gradients:
- CTA Gradient:   linear-gradient(135deg, #2563EB 0%, #4F46E5 100%)
- Hero Gradient:  linear-gradient(180deg, #DBEAFE 0%, #E0E7FF 100%)
```

#### Couleurs Secondaires
```
Orange FOMO:      #FF8C00 (RGB: 255, 140, 0)
└─ Usage:         Badges "Populaire", urgence, retour visiteur

Yellow Conversion: #FCD34D (RGB: 252, 211, 77)
└─ Usage:         Prix, highlights, CTA secondaires

Green Success:    #10B981 (RGB: 16, 185, 129)
└─ Usage:         Validation, checkmarks, confirmations

Red Error:        #EF4444 (RGB: 239, 68, 68)
└─ Usage:         Erreurs, alertes, champs invalides
```

#### Couleurs Neutres
```
Gray 900 (Text):     #111827
Gray 800 (Headings): #1F2937
Gray 700 (Body):     #374151
Gray 600 (Secondary):#4B5563
Gray 500 (Placeholder): #6B7280
Gray 400 (Borders):  #9CA3AF
Gray 300 (Dividers): #D1D5DB
Gray 200 (BG):       #E5E7EB
Gray 100 (BG Light): #F3F4F6
Gray 50 (BG Ultra):  #F9FAFB
White:               #FFFFFF
```

#### Overlays & Shadows
```
Modal Overlay:    rgba(0, 0, 0, 0.5)
Card Shadow:      0px 2px 8px rgba(0, 0, 0, 0.1)
Hover Shadow:     0px 4px 16px rgba(37, 99, 235, 0.2)
Focus Ring:       0px 0px 0px 4px rgba(37, 99, 235, 0.2)
```

---

### 🔤 Typographie

#### Font Families
```
Headings:  'Montserrat', sans-serif
Body:      'Roboto', sans-serif
Code:      'Courier New', monospace
```

#### Font Weights
```
Montserrat:
- Regular:    400
- SemiBold:   600
- Bold:       700
- ExtraBold:  800

Roboto:
- Light:      300
- Regular:    400
- Medium:     500
- Bold:       700
```

#### Type Scale

**Desktop:**
```
H1 (Hero):
- Size:         60px / 3.75rem
- Line Height:  72px / 1.2
- Weight:       Montserrat Bold (700)
- Letter Spacing: -0.02em

H2 (Section):
- Size:         40px / 2.5rem
- Line Height:  48px / 1.2
- Weight:       Montserrat Bold (700)
- Letter Spacing: -0.01em

H3 (Card Title):
- Size:         28px / 1.75rem
- Line Height:  36px / 1.286
- Weight:       Montserrat SemiBold (600)
- Letter Spacing: 0

H4 (Subsection):
- Size:         20px / 1.25rem
- Line Height:  28px / 1.4
- Weight:       Montserrat SemiBold (600)
- Letter Spacing: 0

Body Large:
- Size:         18px / 1.125rem
- Line Height:  27px / 1.5
- Weight:       Roboto Regular (400)
- Letter Spacing: 0

Body Regular:
- Size:         16px / 1rem
- Line Height:  24px / 1.5
- Weight:       Roboto Regular (400)
- Letter Spacing: 0

Body Small:
- Size:         14px / 0.875rem
- Line Height:  21px / 1.5
- Weight:       Roboto Regular (400)
- Letter Spacing: 0

CTA Text:
- Size:         18px / 1.125rem
- Line Height:  24px / 1.333
- Weight:       Roboto Bold (700)
- Letter Spacing: 0.01em
- Transform:    None

Caption:
- Size:         12px / 0.75rem
- Line Height:  16px / 1.333
- Weight:       Roboto Regular (400)
- Letter Spacing: 0.01em
```

**Mobile:**
```
H1:     48px → 40px
H2:     40px → 32px
H3:     28px → 24px
H4:     20px → 18px
Body:   16px (unchanged)
CTA:    18px → 16px
```

#### Font Loading
```css
@font-face {
  font-family: 'Montserrat';
  src: url('/fonts/montserrat-bold.woff2') format('woff2');
  font-weight: 700;
  font-display: swap;
}

@font-face {
  font-family: 'Roboto';
  src: url('/fonts/roboto-regular.woff2') format('woff2');
  font-weight: 400;
  font-display: swap;
}
```

---

### 📐 Spacing System (8px Grid)

```
Space Scale:
xs:   8px   (0.5rem)
sm:   16px  (1rem)
md:   24px  (1.5rem)
lg:   32px  (2rem)
xl:   48px  (3rem)
2xl:  64px  (4rem)
3xl:  96px  (6rem)
4xl:  128px (8rem)

Component Padding:
- Button:       16px 32px (sm xl)
- Card:         24px (md)
- Section:      64px 0 (2xl 0)
- Container:    0 24px (0 md) mobile, 0 48px (0 xl) desktop

Gaps:
- Stack (vertical):   24px (md)
- Grid (horizontal):  32px (lg)
```

---

### 🔲 Border Radius

```
None:       0px      (sharp corners)
Small:      4px      (inputs, tags)
Medium:     8px      (buttons, cards)
Large:      12px     (modals, large cards)
XLarge:     16px     (hero sections)
2XLarge:    24px     (feature cards)
Full:       9999px   (pills, badges)
```

---

### 🎭 Iconography

**Library:** Lucide React
**Size Scale:**
```
Small:      16px × 16px
Medium:     20px × 20px
Large:      24px × 24px
XLarge:     32px × 32px
Hero:       48px × 48px
```

**Stroke Width:** 2px (default), 1.5px (thin), 2.5px (bold)

**Key Icons:**
```
Search:         Search
User:           User
Document:       FileText
Payment:        CreditCard
Download:       Download
Check:          Check
Arrow Right:    ArrowRight
Location:       MapPin
Clock:          Clock
Star:           Star
Fire (FOMO):    Flame
```

---

## 2️⃣ Pages & Layouts

### 📄 Page 1: Accueil (Homepage)

**Dimensions:** 1440px width (desktop), 375px width (mobile)

#### Layout Structure (Desktop)

```
┌─────────────────────────────────────────────────────────────┐
│  HEADER (Sticky, 64px height)                               │
│  ┌────────────┐                           ┌──────────────┐  │
│  │ [Logo]     │                           │ Mon Compte → │  │
│  └────────────┘                           └──────────────┘  │
├─────────────────────────────────────────────────────────────┤
│  HERO SECTION (400px height)                                │
│                                                              │
│         Vos documents légaux.                                │
│         Instantanés. 1,99$.                                  │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  🔍 Recherchez votre document...                       │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ✅ Aucune inscription   💳 Paiement Express   🔒 Sécurisé  │
│                                                              │
│  [12,450 docs] [2,340 users] [Live Activity]                │
├─────────────────────────────────────────────────────────────┤
│  DOCUMENTS RÉCENTS (Dynamic, 0-200px)                       │
│  🕒 Vous avez récemment consulté                            │
│  [Card 1]    [Card 2]    [Card 3]                           │
├─────────────────────────────────────────────────────────────┤
│  DOCUMENTS POPULAIRES (600px)                               │
│  ⭐ Documents les plus populaires                           │
│  [Card 1]    [Card 2]    [Card 3]                           │
│  [Card 4]    [Card 5]    [Card 6]                           │
├─────────────────────────────────────────────────────────────┤
│  PREUVE SOCIALE LIVE (200px)                                │
│  🔴 Ils nous font confiance. En ce moment.                  │
│  [Activity Feed with auto-scroll]                           │
├─────────────────────────────────────────────────────────────┤
│  PROCESSUS 1-2-3 (300px)                                    │
│  C'est aussi simple que 1-2-3                               │
│  [Step 1]    [Step 2]    [Step 3]                           │
├─────────────────────────────────────────────────────────────┤
│  SEGMENTATION PRO/API (400px)                               │
│  Une solution pour chaque besoin                            │
│  [iDoc Pro Card]     [iDoc Connect Card]                    │
├─────────────────────────────────────────────────────────────┤
│  CTA FINAL (300px)                                          │
│  Prêt à créer votre document?                               │
│  [Commencer maintenant - 1,99$]                             │
├─────────────────────────────────────────────────────────────┤
│  FOOTER (200px)                                             │
│  [Links] [Legal] [Social]                                   │
└─────────────────────────────────────────────────────────────┘
```

#### Measurements (Desktop)

```
Container:
- Max Width:    1280px
- Padding:      0 48px
- Margin:       0 auto

Hero Section:
- Height:       400px
- Padding:      64px 0
- Background:   linear-gradient(180deg, #DBEAFE 0%, #E0E7FF 100%)

Search Bar:
- Width:        100% (max 800px)
- Height:       64px
- Border Radius: 12px
- Shadow:       0px 4px 16px rgba(37, 99, 235, 0.15)

Document Cards:
- Width:        calc((100% - 64px) / 3) [3 columns, 32px gap]
- Height:       auto (min 320px)
- Padding:      24px
- Border Radius: 12px
```

#### Layout Structure (Mobile)

```
┌──────────────────────┐
│  HEADER (56px)       │
│  [Logo]  [Compte →] │
├──────────────────────┤
│  HERO (300px)        │
│  H1 (2 lines)        │
│  Search Bar          │
│  Badges (2 cols)     │
├──────────────────────┤
│  COMPTEURS (80px)    │
│  [Docs] [Users]      │
├──────────────────────┤
│  RÉCENTS (Variable)  │
│  Stack vertical      │
├──────────────────────┤
│  POPULAIRES          │
│  Stack vertical      │
├──────────────────────┤
│  ACTIVITÉ LIVE       │
│  Compact feed        │
├──────────────────────┤
│  PROCESSUS 1-2-3     │
│  Stack vertical      │
├──────────────────────┤
│  PRO/API             │
│  Stack vertical      │
├──────────────────────┤
│  CTA FLOATING (80px) │
│  Fixed bottom        │
└──────────────────────┘
```

---

### 📄 Page 2: SmartFill Studio (Wizard)

**Dimensions:** Full viewport (100vw × 100vh)

#### Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│  TOP BAR (64px, fixed)                                      │
│  ← Retour  |  [Template Name]  |  Step 1/3  [Progress]     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────┬───────────────────────────────┐  │
│  │  FORM (50%)          │  PDF PREVIEW (50%)            │  │
│  │  (Scroll)            │  (Scroll, Sync)               │  │
│  │                      │                               │  │
│  │  [Icon]              │  ┌─────────────────────────┐  │  │
│  │  Step Title          │  │                         │  │  │
│  │  Step Subtitle       │  │  Document Preview       │  │  │
│  │                      │  │  with Live Sync         │  │  │
│  │  [Field 1]           │  │                         │  │  │
│  │  [Field 2]           │  │  Highlighted fields     │  │  │
│  │  [Field 3]           │  │  on focus               │  │  │
│  │                      │  │                         │  │  │
│  │  ← Précédent  Next→  │  └─────────────────────────┘  │  │
│  │                      │                               │  │
│  └──────────────────────┴───────────────────────────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

#### Measurements

```
Top Bar:
- Height:       64px
- Background:   #FFFFFF
- Shadow:       0px 2px 8px rgba(0, 0, 0, 0.1)

Split Screen:
- Left (Form):  50vw
- Right (PDF):  50vw
- Divider:      4px solid #2563EB

Form Section:
- Max Width:    640px
- Padding:      48px
- Background:   gradient-to-br from-blue-50 to-indigo-50

PDF Preview:
- Max Width:    800px
- Padding:      48px
- Background:   #F3F4F6
- Border Left:  4px solid #2563EB

Field Groups:
- Gap:          24px
- Margin:       0 0 48px 0

Navigation Buttons:
- Height:       56px
- Padding:      16px 32px
- Border Radius: 8px
```

---

### 📄 Page 3: Checkout (Modale)

**Dimensions:** 600px × 700px (centered modal)

#### Layout Structure

```
┌─────────────────────────────────────┐
│  ✕                                  │
│                                     │
│  Téléchargez votre document         │
│                                     │
│  [Document Name]                    │
│  [Document Icon]                    │
│                                     │
│  ┌─────────────────────────────────┐│
│  │         1,99 $ CAD              ││
│  └─────────────────────────────────┘│
│                                     │
│  Paiement Express:                  │
│                                     │
│  ┌─────────────────────────────────┐│
│  │   🍎 Apple Pay                  ││
│  └─────────────────────────────────┘│
│                                     │
│  ┌─────────────────────────────────┐│
│  │   G  Google Pay                 ││
│  └─────────────────────────────────┘│
│                                     │
│  ─────── ou ───────                 │
│                                     │
│  📧 Email                           │
│  [email input]                      │
│                                     │
│  💳 Carte bancaire                  │
│  [Stripe Elements]                  │
│                                     │
│  [Télécharger - 1,99$]              │
│                                     │
│  🔒 Paiement sécurisé par Stripe   │
│                                     │
└─────────────────────────────────────┘
```

#### Measurements

```
Modal:
- Width:        600px
- Height:       auto (max 90vh)
- Padding:      48px
- Border Radius: 16px
- Shadow:       0px 8px 32px rgba(0, 0, 0, 0.3)
- Background:   #FFFFFF

Price Display:
- Font Size:    48px
- Weight:       Bold
- Color:        #2563EB
- Background:   #DBEAFE
- Padding:      24px
- Border Radius: 12px

Payment Buttons:
- Height:       64px
- Width:        100%
- Margin:       16px 0
- Border Radius: 8px
- Shadow:       0px 2px 8px rgba(0, 0, 0, 0.1)

Stripe Elements:
- Height:       48px
- Border:       2px solid #D1D5DB
- Border Radius: 8px
- Padding:      12px 16px
```

---

### 📄 Page 4: Post-Achat (Success)

**Dimensions:** 600px × 500px (centered modal)

#### Layout Structure

```
┌─────────────────────────────────────┐
│                                     │
│       ✅ (animated checkmark)       │
│                                     │
│    Votre document est prêt!         │
│                                     │
│  Téléchargement automatique en      │
│  cours...                           │
│                                     │
│  📧 Copie envoyée par email         │
│                                     │
│  ┌─────────────────────────────────┐│
│  │  [Télécharger à nouveau]        ││
│  └─────────────────────────────────┘│
│                                     │
│  ─────────────────────────────────  │
│                                     │
│  💡 Créer un compte gratuit pour:   │
│                                     │
│  ✓ Sauvegarder dans DocVault        │
│  ✓ Retrouver vos documents          │
│  ✓ Signature électronique           │
│                                     │
│  [Créer mon compte] [Plus tard]     │
│                                     │
└─────────────────────────────────────┘
```

#### Measurements

```
Modal:
- Width:        600px
- Height:       auto
- Padding:      48px
- Border Radius: 16px

Checkmark Icon:
- Size:         80px × 80px
- Color:        #10B981
- Animation:    scale + checkmark draw

Upsell Section:
- Margin Top:   32px
- Padding:      24px
- Background:   #F0FDF4 (green-50)
- Border:       2px solid #10B981
- Border Radius: 12px
```

---

## 3️⃣ Composants UI

### 🔘 Buttons

#### Primary Button (CTA)

```
Default State:
- Background:   linear-gradient(135deg, #2563EB 0%, #4F46E5 100%)
- Color:        #FFFFFF
- Padding:      16px 32px
- Border Radius: 8px
- Font:         18px Roboto Bold
- Shadow:       0px 2px 8px rgba(37, 99, 235, 0.3)
- Transition:   all 200ms ease

Hover State:
- Transform:    scale(1.05)
- Shadow:       0px 4px 16px rgba(37, 99, 235, 0.4)

Pressed State:
- Transform:    scale(0.98)
- Background:   linear-gradient(135deg, #1E40AF 0%, #4338CA 100%)

Disabled State:
- Background:   #E5E7EB
- Color:        #9CA3AF
- Cursor:       not-allowed
- Shadow:       none
```

#### Secondary Button

```
Default State:
- Background:   #FFFFFF
- Color:        #2563EB
- Border:       2px solid #2563EB
- Padding:      14px 30px
- Border Radius: 8px
- Font:         16px Roboto Medium

Hover State:
- Background:   #DBEAFE
- Border Color: #1E40AF

Pressed State:
- Background:   #BFDBFE
```

#### Ghost Button

```
Default State:
- Background:   transparent
- Color:        #4B5563
- Padding:      12px 24px
- Font:         16px Roboto Medium

Hover State:
- Color:        #111827
- Background:   #F3F4F6
```

---

### 📝 Input Fields

#### Text Input (Default)

```
Default State:
- Width:        100%
- Height:       48px
- Padding:      12px 16px
- Border:       2px solid #D1D5DB
- Border Radius: 8px
- Font:         16px Roboto Regular
- Background:   #FFFFFF

Focus State:
- Border:       2px solid #2563EB
- Box Shadow:   0px 0px 0px 4px rgba(37, 99, 235, 0.2)
- Outline:      none

Error State:
- Border:       2px solid #EF4444
- Box Shadow:   0px 0px 0px 4px rgba(239, 68, 68, 0.2)

Success State:
- Border:       2px solid #10B981
- Icon:         Check (right side, 20px, green)

Disabled State:
- Background:   #F3F4F6
- Color:        #9CA3AF
- Cursor:       not-allowed
```

#### Search Bar (Large)

```
Default State:
- Width:        100% (max 800px)
- Height:       64px
- Padding:      20px 24px 20px 56px (left space for icon)
- Border:       2px solid #D1D5DB
- Border Radius: 12px
- Font:         18px Roboto Regular
- Background:   #FFFFFF
- Icon:         Search (24px, left 20px, #6B7280)
- Shadow:       0px 4px 16px rgba(37, 99, 235, 0.15)

Focus State:
- Border:       2px solid #2563EB
- Box Shadow:   0px 0px 0px 6px rgba(37, 99, 235, 0.2)
- Icon Color:   #2563EB
- Animation:    glow pulse

Autocomplete Dropdown:
- Width:        100% (same as input)
- Max Height:   400px
- Padding:      8px 0
- Border:       2px solid #2563EB
- Border Radius: 0 0 12px 12px
- Shadow:       0px 8px 24px rgba(0, 0, 0, 0.15)
- Background:   #FFFFFF
- Top Offset:   -2px (overlap border)
```

---

### 🃏 Cards

#### Document Card (Template)

```
Dimensions:
- Width:        calc((100% - 64px) / 3) [desktop]
- Width:        100% [mobile]
- Height:       auto (min 320px)
- Padding:      24px
- Border:       2px solid #E5E7EB
- Border Radius: 12px
- Background:   #FFFFFF
- Shadow:       0px 2px 8px rgba(0, 0, 0, 0.08)

Layout:
┌────────────────────────┐
│ [Badge: Populaire]     │  ← top-right, 8px margin
│                        │
│ [Icon: FileText 48px]  │  ← centered, blue gradient
│                        │
│ Template Name          │  ← 20px Montserrat SemiBold
│                        │
│ Description (2 lines)  │  ← 14px Roboto, gray-600
│                        │
│ ────────────────────   │
│                        │
│ ⏱️ 5 min  📝 8 champs  │  ← stats row
│                        │
│ [CTA: Remplir - 1,99$] │  ← primary button, full width
└────────────────────────┘

Hover State:
- Transform:    translateY(-4px)
- Shadow:       0px 8px 24px rgba(37, 99, 235, 0.15)
- Border:       2px solid #2563EB
- Transition:   all 300ms ease

Active State:
- Transform:    scale(0.98)
```

#### FOMO Badge (Compact)

```
Dimensions:
- Width:        auto (inline)
- Height:       24px
- Padding:      4px 12px
- Border Radius: 9999px (pill)
- Background:   #FF8C00
- Color:        #FFFFFF
- Font:         12px Roboto Bold
- Icon:         Flame (16px, white)

Position:       Absolute, top-right
Text:           "🔥 Populaire" or "156 dl/semaine"

Animation:      Pulse (subtle scale 1.0 → 1.05)
```

#### Activity Feed Item

```
Dimensions:
- Width:        100%
- Height:       48px
- Padding:      12px 16px
- Border Radius: 8px
- Background:   #F9FAFB
- Margin:       8px 0

Layout:
┌──────────────────────────────────────────┐
│ 👤  Alexandre (Montréal) a généré        │
│     "Lettre Résiliation" · il y a 14s    │
└──────────────────────────────────────────┘

Elements:
- Avatar:       👤 (20px)
- Name:         Bold, #111827
- Location:     Regular, #6B7280, (parentheses)
- Document:     "Quoted", #2563EB
- Timestamp:    Gray-500, italic

Animation:      Slide in from right
Transition:     300ms ease-out
```

---

### 📊 Stats Counter

```
Layout (Horizontal 3-column):
┌──────────┬──────────┬──────────┐
│ 12,450   │  2,340   │   Live   │
│ documents│utilisateurs│activité │
│  générés │  actifs  │          │
└──────────┴──────────┴──────────┘

Individual Stat:
- Number Font:  32px Montserrat Bold
- Number Color: #2563EB
- Label Font:   14px Roboto Regular
- Label Color:  #6B7280
- Alignment:    Center

Live Indicator:
- Dot:          8px circle, #10B981
- Animation:    Pulse (opacity 1.0 → 0.6)
- Duration:     1500ms infinite

Separator:
- Width:        1px
- Height:       48px
- Color:        #E5E7EB
```

---

### 🔄 Progress Bar

```
Container:
- Width:        100%
- Height:       8px
- Border Radius: 9999px
- Background:   #E5E7EB
- Overflow:     hidden

Fill:
- Height:       8px
- Border Radius: 9999px
- Background:   linear-gradient(90deg, #2563EB 0%, #4F46E5 100%)
- Transition:   width 500ms ease-out

States:
- 0%:           Empty (gray background visible)
- 33%:          1/3 filled (blue gradient)
- 66%:          2/3 filled
- 100%:         Complete (full gradient)
```

---

## 4️⃣ Animations & Micro-interactions

### ⚡ Global Animations

#### Fade In (Page Load)
```css
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.fade-in {
  animation: fadeIn 500ms ease-out;
}
```

#### Slide Up (Stagger)
```css
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.slide-up {
  animation: slideUp 500ms ease-out backwards;
}

/* Stagger children with delay */
.slide-up:nth-child(1) { animation-delay: 0ms; }
.slide-up:nth-child(2) { animation-delay: 100ms; }
.slide-up:nth-child(3) { animation-delay: 200ms; }
```

#### Scale In (Modal)
```css
@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.scale-in {
  animation: scaleIn 300ms ease-out;
}
```

#### Slide Right (Activity Feed)
```css
@keyframes slideRight {
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.slide-right {
  animation: slideRight 400ms ease-out;
}
```

#### Pulse (Live Indicator)
```css
@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.6;
    transform: scale(1.05);
  }
}

.pulse {
  animation: pulse 1500ms ease-in-out infinite;
}
```

#### Shake (Error)
```css
@keyframes shake {
  0%, 100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-5px);
  }
  75% {
    transform: translateX(5px);
  }
}

.shake {
  animation: shake 300ms ease-in-out;
}
```

#### Checkmark Draw (Success)
```css
@keyframes drawCheck {
  from {
    stroke-dashoffset: 100;
  }
  to {
    stroke-dashoffset: 0;
  }
}

.checkmark {
  stroke-dasharray: 100;
  animation: drawCheck 600ms ease-out forwards;
}
```

---

### 🎯 Micro-interactions

#### Search Bar Focus Glow
```
Trigger:        onFocus
Effect:         Box shadow expands (ring grows)
Duration:       200ms
Easing:         ease-out
CSS:            box-shadow: 0 0 0 6px rgba(37, 99, 235, 0.2);
```

#### Button Hover Lift
```
Trigger:        onHover
Effect:         translateY(-2px) + shadow intensify
Duration:       200ms
Easing:         ease-out
CSS:            transform: translateY(-2px);
                box-shadow: 0 4px 16px rgba(37, 99, 235, 0.4);
```

#### Card Hover Effect
```
Trigger:        onHover (Card)
Effect:         translateY(-4px), border color change, shadow
Duration:       300ms
Easing:         ease
CSS:            transform: translateY(-4px);
                border-color: #2563EB;
                box-shadow: 0 8px 24px rgba(37, 99, 235, 0.15);
```

#### Input Validation Check
```
Trigger:        onBlur (valid input)
Effect:         Border green + checkmark slide in from right
Duration:       300ms
Easing:         ease-out
CSS:            border-color: #10B981;
Icon:           translateX(20px) → translateX(0), opacity: 0 → 1
```

#### Field Focus in PDF Preview
```
Trigger:        onFocus (input field)
Effect:         Corresponding field in PDF highlights + scroll
Duration:       400ms (scroll), 200ms (highlight)
Easing:         ease-in-out
CSS (PDF):      background: #DBEAFE;
                border-bottom: 2px solid #2563EB;
```

#### Activity Feed Auto-scroll
```
Trigger:        Interval (4 seconds)
Effect:         Slide out top item, slide in new item from bottom
Duration:       400ms
Easing:         ease-in-out
Transition:     transform, opacity
```

#### Price Highlight Pulse
```
Trigger:        Page load (checkout modal)
Effect:         Scale pulse + glow
Duration:       1000ms
Easing:         ease-in-out
Iterations:     2
CSS:            transform: scale(1) → scale(1.05) → scale(1);
                box-shadow intensity change
```

#### Confetti Animation (Success)
```
Trigger:        Payment success
Effect:         Confetti particles fall from top
Duration:       3000ms
Library:        canvas-confetti
Colors:         #2563EB, #4F46E5, #10B981, #FCD34D
Count:          50 particles
```

---

### ⏱️ Timing Functions

```
Ease Out:       cubic-bezier(0.25, 1, 0.5, 1)      [default exit]
Ease In:        cubic-bezier(0.5, 0, 0.75, 0)      [default enter]
Ease In-Out:    cubic-bezier(0.4, 0, 0.2, 1)       [smooth both]
Spring:         cubic-bezier(0.34, 1.56, 0.64, 1)  [bounce effect]
```

---

## 5️⃣ États & Variations

### 🔄 Component States

#### Button States
```
1. Default:     Normal appearance
2. Hover:       Lift + glow
3. Focus:       Ring (accessibility)
4. Active:      Pressed (scale down)
5. Disabled:    Gray + cursor not-allowed
6. Loading:     Spinner + disabled
```

#### Input States
```
1. Default:     Gray border
2. Focus:       Blue border + ring
3. Filled:      Keep blue border (valid)
4. Error:       Red border + error message
5. Success:     Green border + checkmark
6. Disabled:    Gray background
```

#### Card States
```
1. Default:     White bg, gray border, subtle shadow
2. Hover:       Lift, blue border, stronger shadow
3. Active:      Scale down slightly
4. Selected:    Blue background, white text (if applicable)
5. Disabled:    Gray overlay, reduced opacity
```

---

### 📱 Responsive Variations

#### Breakpoints
```
Mobile:         < 768px   (375px reference)
Tablet:         768px - 1024px
Desktop:        > 1024px  (1440px reference)
Large:          > 1920px  (max-width cap)
```

#### Layout Changes

**Homepage Hero:**
```
Desktop:
- H1:           60px
- Search:       64px height
- Badges:       3-column row
- Padding:      64px vertical

Mobile:
- H1:           40px (2-line max)
- Search:       56px height (sticky after scroll)
- Badges:       2-column stack
- Padding:      32px vertical
```

**Document Cards:**
```
Desktop:        3 columns (gap 32px)
Tablet:         2 columns (gap 24px)
Mobile:         1 column (gap 16px)
```

**SmartFill Studio:**
```
Desktop:        50/50 split (form | pdf)
Tablet:         60/40 split
Mobile:         Tabs (form tab | preview tab)
                Fixed bottom navigation
```

**Navigation:**
```
Desktop:        Horizontal menu
Mobile:         Hamburger menu (drawer)
```

---

## 6️⃣ Responsive Breakpoints

### 📱 Mobile (< 768px)

```css
/* Global */
.container {
  padding: 0 16px;
  max-width: 100%;
}

/* Typography */
h1 { font-size: 40px; line-height: 48px; }
h2 { font-size: 32px; line-height: 40px; }
h3 { font-size: 24px; line-height: 32px; }

/* Header */
.header {
  height: 56px;
  padding: 0 16px;
}

/* Search Bar */
.search-bar {
  height: 56px;
  font-size: 16px;
  position: sticky;
  top: 56px;
  z-index: 40;
}

/* Cards */
.card {
  width: 100%;
  margin-bottom: 16px;
}

/* Buttons */
.button-primary {
  width: 100%;
  height: 56px;
  font-size: 16px;
}

/* Floating CTA */
.floating-cta {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 80px;
  padding: 16px;
  background: white;
  box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.1);
}

/* SmartFill Studio (Mobile Tabs) */
.smartfill-mobile {
  display: flex;
  flex-direction: column;
}

.tab-navigation {
  position: fixed;
  bottom: 0;
  height: 64px;
  background: white;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
}
```

---

### 💻 Tablet (768px - 1024px)

```css
.container {
  padding: 0 32px;
  max-width: 1024px;
}

/* Cards */
.card-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

/* SmartFill Studio */
.smartfill-layout {
  display: flex;
}

.smartfill-form {
  width: 60%;
}

.smartfill-preview {
  width: 40%;
}
```

---

### 🖥️ Desktop (> 1024px)

```css
.container {
  padding: 0 48px;
  max-width: 1280px;
  margin: 0 auto;
}

/* Cards */
.card-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
}

/* SmartFill Studio */
.smartfill-layout {
  display: flex;
}

.smartfill-form {
  width: 50%;
  padding: 48px;
}

.smartfill-preview {
  width: 50%;
  padding: 48px;
  border-left: 4px solid #2563EB;
}
```

---

## 7️⃣ Prototypes & Flows

### 🔄 User Flow: Guest Purchase

**Prototype Interactions:**

```
Frame 1: Homepage
├─ Trigger: Click Search Bar
└─ Action: Focus search, show autocomplete dropdown
   └─ Transition: Fade in (200ms)

Frame 2: Autocomplete Results
├─ Trigger: Click document result
└─ Action: Open Document Preview Modal
   └─ Transition: Scale in (300ms)

Frame 3: Document Preview Modal
├─ Trigger: Click "Remplir ce document - 1,99$"
└─ Action: Open SmartFill Studio (full screen)
   └─ Transition: Slide up (400ms)

Frame 4: SmartFill Studio (Step 1)
├─ Input: Fill personal info
├─ Live Preview: Fields populate in PDF preview (right side)
│  └─ Highlight: Focused field glows in PDF
├─ Trigger: Click "Suivant"
└─ Action: Advance to Step 2
   └─ Transition: Slide left (300ms)

Frame 5: SmartFill Studio (Step 2)
├─ Auto-prefill: City, Province, Country (from IP)
├─ Input: Address details
├─ Trigger: Click "Suivant"
└─ Action: Advance to Step 3
   └─ Transition: Slide left (300ms)

Frame 6: SmartFill Studio (Step 3)
├─ Input: Document details
├─ Trigger: Click "Terminer"
└─ Action: Open Checkout Modal
   └─ Transition: Scale in (300ms)

Frame 7: Checkout Modal
├─ Display: Price (1,99$ large)
├─ Options: Apple Pay, Google Pay, Card
├─ Trigger: Click Apple Pay
└─ Action: Process payment → Success Modal
   └─ Transition: Cross-fade (400ms)

Frame 8: Success Modal
├─ Animation: Checkmark draw + confetti
├─ Action: Auto-download PDF
├─ Display: Optional account creation
├─ Trigger: Click "Créer mon compte"
└─ Action: Open registration form (or skip)
   └─ Transition: Slide up (300ms)
```

---

### 🔄 User Flow: Returning Guest

**Prototype Interactions:**

```
Frame 1: Homepage (Returning)
├─ Display: "Documents Récents" section (visible)
│  └─ Cards: 3 previously viewed documents
├─ Badge: "Vous êtes revenu ! Téléchargez maintenant"
│  └─ Color: Orange (#FF8C00)
├─ Trigger: Click recent document card
└─ Action: Skip preview → Go directly to SmartFill
   └─ Transition: Slide up (400ms)
   └─ Auto-restore: Prefill saved form data (localStorage)

Frame 2: SmartFill Studio (Pre-filled)
├─ Display: All previous fields populated
├─ Badge: "Vos données ont été restaurées"
├─ User: Verify/modify fields
├─ Trigger: Click "Terminer"
└─ Action: Direct to checkout
   └─ Transition: Scale in (300ms)

Frame 3: Checkout Modal (Adaptive CTA)
├─ Title: "Vous avez consulté ce document 3 fois. Prêt?"
├─ Trigger: Click payment
└─ Action: Complete purchase
```

---

### 🎨 Figma Prototype Setup

**Auto-Animate Transitions:**
```
Homepage → Preview Modal:       Smart Animate (300ms ease-out)
Preview → SmartFill:            Instant (full screen)
SmartFill Step 1 → 2:           Smart Animate (300ms ease)
SmartFill → Checkout:           Dissolve (400ms)
Checkout → Success:             Instant + Confetti
```

**Interactive Components:**
```
- Buttons (all states)
- Input fields (focus, error, success)
- Cards (hover, active)
- Search bar (focus, autocomplete)
- Modal overlays
- Progress bars
- Live activity feed
```

**Overflow Behavior:**
```
- SmartFill sections: Vertical scroll
- PDF preview: Vertical scroll + sync
- Autocomplete: Max height 400px scroll
- Activity feed: Auto-rotate (no manual scroll)
```

---

## 8️⃣ Assets & Exports

### 📸 Export Settings

#### Icons
```
Format:         SVG
Size:           24×24px (default), 16×16, 32×32, 48×48
Color:          Single color (fill)
Stroke:         2px
Export:         /assets/icons/
```

#### Logos
```
Format:         SVG, PNG
Sizes:
  - SVG:        Original (scalable)
  - PNG:        @1x, @2x, @3x
  - Sizes:      120×30px (header), 240×60px (@2x)
Export:         /assets/logos/
```

#### Illustrations
```
Format:         SVG (preferred), PNG fallback
Max Size:       1920px width
Optimization:   SVGO
Export:         /assets/illustrations/
```

#### Images
```
Format:         WebP (primary), JPEG (fallback)
Sizes:
  - Mobile:     375px, 750px (@2x)
  - Desktop:    1280px, 2560px (@2x)
Quality:        80% (WebP), 85% (JPEG)
Export:         /assets/images/
```

#### Fonts
```
Format:         WOFF2 (primary), WOFF (fallback)
Weights:
  - Montserrat: 600, 700, 800
  - Roboto:     300, 400, 500, 700
Export:         /assets/fonts/
```

---

### 🎨 Design Tokens (JSON Export)

```json
{
  "colors": {
    "primary": {
      "blue": "#2563EB",
      "indigo": "#4F46E5"
    },
    "secondary": {
      "orange": "#FF8C00",
      "yellow": "#FCD34D",
      "green": "#10B981",
      "red": "#EF4444"
    },
    "neutral": {
      "900": "#111827",
      "800": "#1F2937",
      "700": "#374151",
      "600": "#4B5563",
      "500": "#6B7280",
      "400": "#9CA3AF",
      "300": "#D1D5DB",
      "200": "#E5E7EB",
      "100": "#F3F4F6",
      "50": "#F9FAFB"
    }
  },
  "typography": {
    "fontFamily": {
      "heading": "Montserrat, sans-serif",
      "body": "Roboto, sans-serif"
    },
    "fontSize": {
      "h1": "60px",
      "h2": "40px",
      "h3": "28px",
      "h4": "20px",
      "bodyLarge": "18px",
      "body": "16px",
      "small": "14px",
      "caption": "12px"
    }
  },
  "spacing": {
    "xs": "8px",
    "sm": "16px",
    "md": "24px",
    "lg": "32px",
    "xl": "48px",
    "2xl": "64px",
    "3xl": "96px",
    "4xl": "128px"
  },
  "borderRadius": {
    "small": "4px",
    "medium": "8px",
    "large": "12px",
    "xlarge": "16px",
    "2xlarge": "24px",
    "full": "9999px"
  }
}
```

---

### 📦 Component Library Export

**Figma Components to Create:**

1. **Buttons** (Primary, Secondary, Ghost)
   - All states (default, hover, focus, active, disabled)
   - Sizes (small, medium, large)
   - Variants with icons

2. **Input Fields** (Text, Email, Search, Textarea)
   - All states
   - With/without labels
   - With/without icons

3. **Cards** (Document, Activity, Stat)
   - Multiple content variations
   - With/without badges

4. **Modals** (Checkout, Success, Preview)
   - Fixed sizes
   - With overlay

5. **Navigation** (Header, Footer)
   - Desktop/Mobile variants

6. **Badges** (FOMO, Status)
   - Multiple colors
   - With/without icons

7. **Progress Indicators** (Bar, Spinner)
   - Multiple states

8. **Icons** (Full Lucide set)
   - Multiple sizes
   - Single color fill

---

## ✅ Checklist pour Figma

### Setup Initial
- [ ] Créer nouveau fichier Figma "iDoc - Design System"
- [ ] Configurer grille 8px
- [ ] Importer fonts (Montserrat, Roboto)
- [ ] Créer palette de couleurs (styles)
- [ ] Créer styles de texte (H1-H4, Body, etc.)

### Pages
- [ ] Page 1: Design System (colors, typo, components)
- [ ] Page 2: Homepage (1440px, 375px)
- [ ] Page 3: SmartFill Studio (full viewport)
- [ ] Page 4: Modals (Checkout, Success)
- [ ] Page 5: Components Library
- [ ] Page 6: Prototypes & Flows

### Composants
- [ ] Buttons (tous états)
- [ ] Input fields (tous types)
- [ ] Cards (3 variantes)
- [ ] Badges & Tags
- [ ] Navigation
- [ ] Modals
- [ ] Progress bars
- [ ] Icons

### Prototypes
- [ ] Flow 1: Guest purchase (8 frames)
- [ ] Flow 2: Returning guest (3 frames)
- [ ] Interactions: Hover, focus, click
- [ ] Transitions: Smart animate, dissolve
- [ ] Auto-scroll animations

### Export
- [ ] Design tokens (JSON)
- [ ] Icons (SVG)
- [ ] Logos (SVG, PNG @2x)
- [ ] Component specs (PDF)
- [ ] Developer handoff (Figma Inspect)

---

## 📚 Ressources Supplémentaires

### Inspiration & Références
```
Stripe Checkout:        Simplicité paiement
Linear:                 Animations micro-interactions
Notion:                 Clean UI, minimal
Typeform:               Wizard conversationnel
Apple Pay:              UX paiement express
```

### Plugins Figma Recommandés
```
- Autoflow:             Diagrammes de flux
- Iconify:              Icons Lucide
- Stark:                Accessibilité (contraste)
- Content Reel:         Contenu mock
- Anima:                Export code
```

### Livrables Finaux
```
1. Fichier Figma complet (.fig)
2. Design tokens (JSON)
3. Component library (Figma)
4. Prototypes interactifs
5. Specs PDF (ce document)
6. Assets exportés (ZIP)
```

---

**Document créé:** 2025-11-16
**Version:** 1.0
**Designer:** [À compléter]
**Developer handoff:** Ready ✅

---

*iDoc - Design System complet pour conversion maximale*
