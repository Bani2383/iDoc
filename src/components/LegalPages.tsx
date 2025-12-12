import React from 'react';
import { Shield, FileText, Lock, Scale } from 'lucide-react';

export function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8 md:p-12">
        <div className="flex items-center mb-8">
          <Lock className="w-8 h-8 text-blue-600 mr-3" />
          <h1 className="text-4xl font-bold text-gray-900">
            Politique de Confidentialité
          </h1>
        </div>

        <p className="text-gray-600 mb-8">
          Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
        </p>

        <div className="space-y-8 text-gray-700">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              1. Introduction
            </h2>
            <p>
              iDoc s'engage à protéger la confidentialité de vos données
              personnelles. Cette politique explique comment nous collectons,
              utilisons et protégeons vos informations conformément au RGPD.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              2. Données collectées
            </h2>
            <h3 className="text-xl font-semibold mb-2">2.1 Informations d'inscription</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Nom et prénom</li>
              <li>Adresse email</li>
              <li>Mot de passe (hashé)</li>
            </ul>

            <h3 className="text-xl font-semibold mb-2 mt-4">2.2 Données d'utilisation</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Documents générés (contenu et métadonnées)</li>
              <li>Historique d'activité</li>
              <li>Préférences utilisateur</li>
              <li>Données techniques (IP, navigateur, système d'exploitation)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              3. Utilisation des données
            </h2>
            <p className="mb-4">Nous utilisons vos données pour :</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Fournir et améliorer nos services</li>
              <li>Gérer votre compte et vos abonnements</li>
              <li>Communiquer avec vous (notifications, support)</li>
              <li>Analyser l'utilisation de la plateforme</li>
              <li>Assurer la sécurité et prévenir la fraude</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              4. Partage des données
            </h2>
            <p className="mb-4">Nous ne vendons jamais vos données. Nous pouvons les partager avec :</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Fournisseurs de services</strong> : hébergement (Supabase), paiements (Stripe)</li>
              <li><strong>Obligations légales</strong> : autorités judiciaires si requis par la loi</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              5. Vos droits (RGPD)
            </h2>
            <p className="mb-4">Vous disposez des droits suivants :</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Accès</strong> : consulter vos données</li>
              <li><strong>Rectification</strong> : corriger vos données</li>
              <li><strong>Suppression</strong> : supprimer votre compte et données</li>
              <li><strong>Portabilité</strong> : exporter vos données</li>
              <li><strong>Opposition</strong> : refuser certains traitements</li>
              <li><strong>Limitation</strong> : limiter l'utilisation de vos données</li>
            </ul>
            <p className="mt-4">
              Pour exercer vos droits : <a href="mailto:privacy@idoc.com" className="text-blue-600 hover:underline">privacy@idoc.com</a>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              6. Sécurité
            </h2>
            <p>
              Nous mettons en œuvre des mesures de sécurité appropriées :
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Chiffrement des données en transit (HTTPS) et au repos</li>
              <li>Authentification sécurisée</li>
              <li>Sauvegardes régulières</li>
              <li>Accès restreint aux données</li>
              <li>Monitoring et alertes de sécurité</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              7. Cookies
            </h2>
            <p>
              Nous utilisons des cookies essentiels au fonctionnement du site et
              des cookies analytiques (avec votre consentement) pour améliorer
              notre service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              8. Conservation des données
            </h2>
            <p>
              Vos données sont conservées tant que votre compte est actif. Après
              suppression du compte, les données sont effacées dans les 30 jours
              (sauf obligations légales de conservation).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              9. Contact
            </h2>
            <p>
              Délégué à la protection des données :<br />
              Email : <a href="mailto:dpo@idoc.com" className="text-blue-600 hover:underline">dpo@idoc.com</a><br />
              Adresse : iDoc, [Votre adresse]
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

export function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8 md:p-12">
        <div className="flex items-center mb-8">
          <FileText className="w-8 h-8 text-blue-600 mr-3" />
          <h1 className="text-4xl font-bold text-gray-900">
            Conditions Générales d'Utilisation
          </h1>
        </div>

        <p className="text-gray-600 mb-8">
          Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
        </p>

        <div className="space-y-8 text-gray-700">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              1. Objet
            </h2>
            <p>
              Les présentes Conditions Générales d'Utilisation (CGU) régissent
              l'accès et l'utilisation de la plateforme iDoc, accessible à
              l'adresse idoc.com.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              2. Acceptation des CGU
            </h2>
            <p>
              En utilisant iDoc, vous acceptez sans réserve les présentes CGU.
              Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser
              nos services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              3. Description des services
            </h2>
            <p className="mb-4">iDoc propose :</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Génération de documents juridiques personnalisés</li>
              <li>Signature électronique de documents</li>
              <li>Stockage sécurisé de documents</li>
              <li>Accès à une bibliothèque de templates professionnels</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              4. Inscription et compte utilisateur
            </h2>
            <h3 className="text-xl font-semibold mb-2">4.1 Création de compte</h3>
            <p>L'utilisation complète d'iDoc nécessite la création d'un compte avec des informations exactes et à jour.</p>

            <h3 className="text-xl font-semibold mb-2 mt-4">4.2 Sécurité du compte</h3>
            <p>Vous êtes responsable de la confidentialité de vos identifiants et de toutes les activités sur votre compte.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              5. Utilisation de la plateforme
            </h2>
            <h3 className="text-xl font-semibold mb-2">5.1 Utilisation autorisée</h3>
            <p>Vous vous engagez à utiliser iDoc uniquement à des fins légales et conformément aux présentes CGU.</p>

            <h3 className="text-xl font-semibold mb-2 mt-4">5.2 Utilisations interdites</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Utilisation frauduleuse ou illégale</li>
              <li>Violation des droits de propriété intellectuelle</li>
              <li>Tentative de piratage ou d'accès non autorisé</li>
              <li>Transmission de contenus illicites ou offensants</li>
              <li>Utilisation abusive des ressources système</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              6. Propriété intellectuelle
            </h2>
            <p className="mb-4">
              Tous les contenus de la plateforme (templates, textes, graphiques,
              logos) sont protégés par des droits de propriété intellectuelle.
            </p>
            <p>
              <strong>Vos documents</strong> : vous conservez tous les droits sur
              les documents que vous créez avec iDoc.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              7. Limitation de responsabilité
            </h2>
            <p className="mb-4">
              <strong>Important</strong> : Les documents générés sont des modèles
              à titre informatif. Nous recommandons de consulter un professionnel
              du droit pour tout besoin juridique spécifique.
            </p>
            <p>
              iDoc ne peut être tenu responsable des dommages directs ou
              indirects résultant de l'utilisation de la plateforme.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              8. Modification et suspension du service
            </h2>
            <p>
              Nous nous réservons le droit de modifier, suspendre ou interrompre
              tout ou partie du service à tout moment, avec ou sans préavis.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              9. Résiliation
            </h2>
            <p>
              Vous pouvez résilier votre compte à tout moment. Nous pouvons
              suspendre ou résilier votre compte en cas de violation des CGU.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              10. Droit applicable et juridiction
            </h2>
            <p>
              Les présentes CGU sont régies par le droit français. Tout litige
              relève de la compétence exclusive des tribunaux français.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              11. Contact
            </h2>
            <p>
              Pour toute question concernant ces CGU :<br />
              Email : <a href="mailto:legal@idoc.com" className="text-blue-600 hover:underline">legal@idoc.com</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

export function TermsOfSale() {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8 md:p-12">
        <div className="flex items-center mb-8">
          <Scale className="w-8 h-8 text-blue-600 mr-3" />
          <h1 className="text-4xl font-bold text-gray-900">
            Conditions Générales de Vente
          </h1>
        </div>

        <p className="text-gray-600 mb-8">
          Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
        </p>

        <div className="space-y-8 text-gray-700">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              1. Dispositions générales
            </h2>
            <p>
              Les présentes Conditions Générales de Vente (CGV) s'appliquent à
              toutes les ventes de services réalisées sur idoc.com.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              2. Services proposés
            </h2>
            <h3 className="text-xl font-semibold mb-2">2.1 Plan Gratuit</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>5 documents par mois</li>
              <li>Accès à 50+ templates</li>
              <li>Stockage 30 jours</li>
            </ul>

            <h3 className="text-xl font-semibold mb-2 mt-4">2.2 Plan Pro</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>19€/mois ou 190€/an</li>
              <li>Documents illimités</li>
              <li>Tous les templates</li>
              <li>Fonctionnalités avancées</li>
            </ul>

            <h3 className="text-xl font-semibold mb-2 mt-4">2.3 Plan Entreprise</h3>
            <p>Tarification sur mesure selon besoins</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              3. Prix et paiement
            </h2>
            <h3 className="text-xl font-semibold mb-2">3.1 Prix</h3>
            <p>Les prix sont indiqués en euros TTC. Nous nous réservons le droit de modifier nos tarifs à tout moment.</p>

            <h3 className="text-xl font-semibold mb-2 mt-4">3.2 Moyens de paiement</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Carte bancaire (Visa, Mastercard, Amex)</li>
              <li>Virement bancaire (plan Entreprise)</li>
            </ul>

            <h3 className="text-xl font-semibold mb-2 mt-4">3.3 Facturation</h3>
            <p>
              Les abonnements sont facturés mensuellement ou annuellement selon
              votre choix. Le renouvellement est automatique.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              4. Droit de rétractation
            </h2>
            <p>
              Conformément à l'article L221-28 du Code de la consommation, vous
              disposez d'un délai de 14 jours pour exercer votre droit de
              rétractation sans avoir à justifier de motifs.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              5. Résiliation
            </h2>
            <p className="mb-4">
              Vous pouvez résilier votre abonnement à tout moment depuis votre
              espace client. La résiliation prend effet à la fin de la période
              de facturation en cours.
            </p>
            <p>
              En cas de résiliation annuelle anticipée, un remboursement au
              prorata des mois non utilisés sera effectué.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              6. Garanties
            </h2>
            <p>
              Nous garantissons un accès au service 99.9% du temps (hors
              maintenance programmée). En cas de dysfonctionnement, contactez
              notre support.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              7. Réclamations
            </h2>
            <p>
              Toute réclamation doit être adressée à :<br />
              Email : <a href="mailto:support@idoc.com" className="text-blue-600 hover:underline">support@idoc.com</a><br />
              Délai de réponse : 48h ouvrées
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              8. Médiation
            </h2>
            <p>
              En cas de litige, vous pouvez recourir à la médiation de la
              consommation auprès de [Nom du médiateur agréé].
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              9. Données personnelles
            </h2>
            <p>
              Le traitement de vos données personnelles est détaillé dans notre
              Politique de Confidentialité.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              10. Droit applicable
            </h2>
            <p>
              Les présentes CGV sont régies par le droit français. En cas de
              litige, les tribunaux français sont seuls compétents.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

export function LegalNotice() {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8 md:p-12">
        <div className="flex items-center mb-8">
          <Shield className="w-8 h-8 text-blue-600 mr-3" />
          <h1 className="text-4xl font-bold text-gray-900">
            Mentions Légales
          </h1>
        </div>

        <div className="space-y-8 text-gray-700">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              1. Éditeur du site
            </h2>
            <p>
              <strong>Raison sociale</strong> : [Votre société]<br />
              <strong>Forme juridique</strong> : [SAS/SARL/etc.]<br />
              <strong>Capital social</strong> : [Montant]<br />
              <strong>Siège social</strong> : [Adresse complète]<br />
              <strong>RCS</strong> : [Ville + numéro]<br />
              <strong>SIRET</strong> : [Numéro]<br />
              <strong>TVA intracommunautaire</strong> : [Numéro]<br />
              <strong>Email</strong> : <a href="mailto:contact@idoc.com" className="text-blue-600 hover:underline">contact@idoc.com</a><br />
              <strong>Téléphone</strong> : [Numéro]
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              2. Directeur de la publication
            </h2>
            <p>
              <strong>Nom</strong> : [Nom du directeur]<br />
              <strong>Qualité</strong> : [Fonction]
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              3. Hébergement
            </h2>
            <p>
              <strong>Hébergeur</strong> : Vercel Inc.<br />
              <strong>Adresse</strong> : 340 S Lemon Ave #4133, Walnut, CA 91789, USA<br />
              <strong>Site web</strong> : <a href="https://vercel.com" className="text-blue-600 hover:underline" target="_blank" rel="noopener">vercel.com</a>
            </p>
            <p className="mt-4">
              <strong>Base de données</strong> : Supabase Inc.<br />
              <strong>Adresse</strong> : Singapore<br />
              <strong>Site web</strong> : <a href="https://supabase.com" className="text-blue-600 hover:underline" target="_blank" rel="noopener">supabase.com</a>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              4. Propriété intellectuelle
            </h2>
            <p>
              L'ensemble du contenu du site idoc.com (structure, textes, logos,
              images, vidéos, etc.) est la propriété exclusive de [Votre société]
              et est protégé par les lois françaises et internationales relatives
              à la propriété intellectuelle.
            </p>
            <p className="mt-4">
              Toute reproduction, représentation, modification, publication ou
              adaptation totale ou partielle des éléments du site est interdite
              sans autorisation écrite préalable.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              5. Protection des données personnelles
            </h2>
            <p>
              Conformément au RGPD et à la loi Informatique et Libertés, vous
              disposez d'un droit d'accès, de rectification, de suppression et de
              portabilité de vos données personnelles.
            </p>
            <p className="mt-4">
              Pour plus d'informations, consultez notre{' '}
              <a href="/privacy" className="text-blue-600 hover:underline">
                Politique de Confidentialité
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              6. Cookies
            </h2>
            <p>
              Le site utilise des cookies pour améliorer l'expérience
              utilisateur. Vous pouvez désactiver les cookies dans les paramètres
              de votre navigateur.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              7. Loi applicable
            </h2>
            <p>
              Les présentes mentions légales sont régies par le droit français.
              Tout litige relève de la compétence exclusive des tribunaux
              français.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
