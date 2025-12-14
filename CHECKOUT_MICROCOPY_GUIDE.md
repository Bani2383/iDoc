# Guide d'utilisation du Microcopy de Checkout

## Vue d'ensemble

Le microcopy de checkout a été intégré dans le système i18n de l'application pour garantir une expérience utilisateur cohérente et professionnelle lors du processus de paiement.

## Structure des traductions

Les traductions sont disponibles dans les fichiers suivants :
- `/src/locales/fr.json` (Français canadien - fr-CA)
- `/src/locales/en.json` (Anglais canadien - en-CA)

### Clés disponibles

```typescript
checkout: {
  // En-têtes et labels
  previewHeader: string          // Titre de la prévisualisation du document
  priceLabel: string            // Label pour le prix du téléchargement PDF

  // Boutons d'action
  primaryButton: string         // Bouton principal de paiement
  secondaryButton: string       // Bouton secondaire pour modifier les données

  // Éléments de confiance
  trustLine: string            // Indicateur de paiement sécurisé

  // Mentions légales
  legalLine: string            // Avertissement juridique principal
  noGuaranteeLine: string      // Clause de non-garantie IRCC

  // Section d'aide
  helpTitle: string            // Titre de la section d'aide
  helpText: string             // Texte explicatif d'aide
  faqLinkText: string          // Texte du lien vers la FAQ
}
```

## Utilisation dans les composants

### Exemple basique avec useLanguage hook

```tsx
import { useLanguage } from '../contexts/LanguageContext';

function CheckoutComponent() {
  const { t } = useLanguage();

  return (
    <div>
      <h2>{t('checkout.previewHeader')}</h2>
      <button>{t('checkout.primaryButton')}</button>
      <p>{t('checkout.legalLine')}</p>
    </div>
  );
}
```

### Composant CheckoutPreview complet

Le composant `CheckoutPreview` a été créé comme exemple d'implémentation complète :

```tsx
import { CheckoutPreview } from './components/CheckoutPreview';

function App() {
  return (
    <CheckoutPreview
      documentPreview="<html>...</html>"
      price={24.99}
      onPayment={() => console.log('Payment')}
      onEditData={() => console.log('Edit')}
      onBack={() => console.log('Back')}
    />
  );
}
```

## Caractéristiques du composant CheckoutPreview

### Interface visuelle
- Layout responsive en 2 colonnes (desktop) / 1 colonne (mobile)
- Prévisualisation du document avec scroll
- Section de paiement avec prix en évidence
- Indicateurs de confiance (sécurité SSL, support 24/7)

### Éléments de réassurance
- Badge de paiement sécurisé avec icône cadenas
- Avertissements légaux dans une boîte colorée
- Section d'aide contextuelle extensible
- Lien vers la FAQ pour plus d'informations

### Accessibilité
- Contraste de couleurs respectant les normes WCAG
- Boutons avec états hover clairs
- Hiérarchie visuelle bien définie
- Textes lisibles et aérés

## Personnalisation

### Modifier les traductions

Pour modifier le texte, éditez directement les fichiers JSON :

**Français** (`src/locales/fr.json`) :
```json
{
  "checkout": {
    "previewHeader": "Votre nouveau texte ici"
  }
}
```

**Anglais** (`src/locales/en.json`) :
```json
{
  "checkout": {
    "previewHeader": "Your new text here"
  }
}
```

### Ajouter de nouvelles langues

1. Créer un nouveau fichier de locale (ex: `src/locales/es.json`)
2. Ajouter la section `checkout` avec toutes les clés
3. Enregistrer la nouvelle langue dans le contexte

## Bonnes pratiques

### Cohérence
- Utiliser toujours `t('checkout.xxx')` au lieu de texte en dur
- Maintenir les mêmes clés dans toutes les langues
- Tester les changements dans toutes les langues supportées

### UX juridique
- **legalLine** : Clause de non-responsabilité obligatoire
- **noGuaranteeLine** : Spécifique aux documents d'immigration
- Ces deux textes doivent toujours être visibles avant le paiement

### Éléments de conversion
- **trustLine** : Rassure sur la sécurité du paiement
- **helpTitle/helpText** : Réduit l'hésitation avant l'achat
- **faqLinkText** : Offre un support proactif

## Exemples d'intégration

### Dans un modal de paiement

```tsx
import { useLanguage } from '../contexts/LanguageContext';
import { Lock, AlertCircle } from 'lucide-react';

function PaymentModal({ price, onConfirm }) {
  const { t } = useLanguage();

  return (
    <div className="modal">
      <div className="price-section">
        <span>{t('checkout.priceLabel')}</span>
        <span>{price} $</span>
      </div>

      <button onClick={onConfirm}>
        {t('checkout.primaryButton')}
      </button>

      <div className="trust-badge">
        <Lock /> {t('checkout.trustLine')}
      </div>

      <div className="legal-notice">
        <AlertCircle />
        <p>{t('checkout.legalLine')}</p>
        <p>{t('checkout.noGuaranteeLine')}</p>
      </div>
    </div>
  );
}
```

### Dans un flow de checkout multi-étapes

```tsx
function CheckoutStep3Preview() {
  const { t } = useLanguage();

  return (
    <>
      <h1>{t('checkout.previewHeader')}</h1>
      <DocumentPreview />

      <div className="actions">
        <button className="secondary">
          {t('checkout.secondaryButton')}
        </button>
        <button className="primary">
          {t('checkout.primaryButton')}
        </button>
      </div>

      <HelpSection
        title={t('checkout.helpTitle')}
        text={t('checkout.helpText')}
        linkText={t('checkout.faqLinkText')}
      />
    </>
  );
}
```

## Tests

Vérifier que les traductions s'affichent correctement :

```tsx
import { render } from '@testing-library/react';
import { LanguageProvider } from '../contexts/LanguageContext';
import { CheckoutPreview } from './CheckoutPreview';

test('displays French checkout copy', () => {
  const { getByText } = render(
    <LanguageProvider initialLanguage="fr">
      <CheckoutPreview {...props} />
    </LanguageProvider>
  );

  expect(getByText('Payer et télécharger')).toBeInTheDocument();
});

test('displays English checkout copy', () => {
  const { getByText } = render(
    <LanguageProvider initialLanguage="en">
      <CheckoutPreview {...props} />
    </LanguageProvider>
  );

  expect(getByText('Pay & download')).toBeInTheDocument();
});
```

## Support

Pour toute question sur l'utilisation du microcopy de checkout :
- Consulter la documentation du système i18n
- Vérifier les exemples dans `CheckoutPreview.tsx`
- Tester dans les deux langues (FR/EN) avant déploiement
