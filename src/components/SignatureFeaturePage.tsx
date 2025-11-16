import { FileSignature, Edit3, Upload, Type, Shield, Zap, CheckCircle, Download } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { SignedDocumentShowcase } from './SignedDocumentShowcase';

interface SignatureFeaturePageProps {
  onGetStarted: () => void;
}

export function SignatureFeaturePage({ onGetStarted }: SignatureFeaturePageProps) {
  const { theme } = useTheme();

  return (
    <div className={theme === 'minimal' ? 'min-h-screen bg-white' : 'min-h-screen bg-gradient-to-br from-slate-50 to-blue-50'}>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center mb-16">
          <div className={theme === 'minimal' ? 'inline-flex items-center justify-center w-20 h-20 border border-black mb-6 animate-pulse' : 'inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-2xl mb-6'}>
            <FileSignature className={theme === 'minimal' ? 'w-10 h-10 text-black' : 'w-10 h-10 text-blue-600'} />
          </div>
          <h1 className={theme === 'minimal' ? 'text-4xl sm:text-5xl lg:text-6xl font-light text-black mb-6 leading-tight tracking-tight animate-fade-in-up' : 'text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight animate-fade-in-up'} style={theme === 'minimal' ? { fontFamily: 'serif' } : {}}>
            Ajouter votre signature à un<br />document PDF avec iDoc
          </h1>
          <p className={theme === 'minimal' ? 'text-sm text-gray-700 max-w-3xl mx-auto mb-8 leading-loose tracking-wide' : 'text-xl text-gray-700 max-w-3xl mx-auto mb-8 leading-relaxed'} style={theme === 'minimal' ? { fontFamily: 'serif' } : {}}>
            Générez, signez et téléchargez votre document en ligne — en quelques clics.
          </p>
          <p className={theme === 'minimal' ? 'text-xs text-gray-600 max-w-3xl mx-auto mb-8 leading-loose tracking-wide' : 'text-lg text-gray-600 max-w-3xl mx-auto mb-8'} style={theme === 'minimal' ? { fontFamily: 'serif' } : {}}>
            Vous avez besoin de signer un contrat, une attestation ou un formulaire PDF ? Avec iDoc, vous pouvez ajouter votre propre signature électronique à un document en ligne, sans impression, ni scanner, ni logiciel.
          </p>
          <button
            onClick={onGetStarted}
            className={theme === 'minimal' ? 'px-8 py-4 bg-black text-white text-xs tracking-[0.2em] hover:bg-gray-800 hover:scale-105 transition-all border border-black' : 'px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-xl hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-2xl'}
            style={theme === 'minimal' ? { fontFamily: 'serif' } : {}}
          >
            {theme === 'minimal' ? 'CRÉER ET SIGNER MON DOCUMENT' : 'Créer et signer mon document maintenant'}
          </button>
        </div>

        <section className={theme === 'minimal' ? 'bg-white border border-black p-8 sm:p-12 mb-20' : 'bg-white rounded-3xl p-8 sm:p-12 shadow-xl mb-20'}>
          <h2 className={theme === 'minimal' ? 'text-2xl sm:text-3xl font-light text-black mb-8 text-center tracking-tight' : 'text-3xl sm:text-4xl font-bold text-gray-900 mb-8 text-center'} style={theme === 'minimal' ? { fontFamily: 'serif' } : {}}>
            Comment ça fonctionne ?
          </h2>
          <div className="space-y-8">
            <div className="flex items-start space-x-6">
              <div className={theme === 'minimal' ? 'flex-shrink-0 w-12 h-12 bg-black text-white flex items-center justify-center text-sm' : 'flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold'}>
                1
              </div>
              <div>
                <h3 className={theme === 'minimal' ? 'text-sm font-light text-black mb-2 tracking-tight' : 'text-xl font-bold text-gray-900 mb-2'} style={theme === 'minimal' ? { fontFamily: 'serif' } : {}}>Générez votre document</h3>
                <p className={theme === 'minimal' ? 'text-xs text-gray-600 tracking-wide leading-loose' : 'text-gray-600'} style={theme === 'minimal' ? { fontFamily: 'serif' } : {}}>
                  Créez votre document (PDF, formulaire, contrat...) directement sur iDoc grâce aux modèles pré-remplis.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-6">
              <div className={theme === 'minimal' ? 'flex-shrink-0 w-12 h-12 bg-black text-white flex items-center justify-center text-sm' : 'flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold'}>
                2
              </div>
              <div>
                <h3 className={theme === 'minimal' ? 'text-sm font-light text-black mb-2 tracking-tight' : 'text-xl font-bold text-gray-900 mb-2'} style={theme === 'minimal' ? { fontFamily: 'serif' } : {}}>Cliquez sur "Ajouter une signature"</h3>
                <p className={theme === 'minimal' ? 'text-xs text-gray-600 tracking-wide leading-loose' : 'text-gray-600'} style={theme === 'minimal' ? { fontFamily: 'serif' } : {}}>
                  Une fois votre document prêt, sélectionnez l'option de signature intégrée.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-6">
              <div className={theme === 'minimal' ? 'flex-shrink-0 w-12 h-12 bg-black text-white flex items-center justify-center text-sm' : 'flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold'}>
                3
              </div>
              <div>
                <h3 className={theme === 'minimal' ? 'text-sm font-light text-black mb-2 tracking-tight' : 'text-xl font-bold text-gray-900 mb-2'} style={theme === 'minimal' ? { fontFamily: 'serif' } : {}}>Choisissez votre méthode</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                  <div className={theme === 'minimal' ? 'flex items-center space-x-2 border border-black p-3' : 'flex items-center space-x-2 bg-blue-50 rounded-lg p-3'}>
                    <Edit3 className={theme === 'minimal' ? 'w-5 h-5 text-black' : 'w-5 h-5 text-blue-600'} />
                    <span className={theme === 'minimal' ? 'text-xs font-light text-gray-900 tracking-wide' : 'text-sm font-medium text-gray-900'} style={theme === 'minimal' ? { fontFamily: 'serif' } : {}}>Dessiner avec la souris</span>
                  </div>
                  <div className={theme === 'minimal' ? 'flex items-center space-x-2 border border-black p-3' : 'flex items-center space-x-2 bg-blue-50 rounded-lg p-3'}>
                    <Upload className={theme === 'minimal' ? 'w-5 h-5 text-black' : 'w-5 h-5 text-blue-600'} />
                    <span className={theme === 'minimal' ? 'text-xs font-light text-gray-900 tracking-wide' : 'text-sm font-medium text-gray-900'} style={theme === 'minimal' ? { fontFamily: 'serif' } : {}}>Importer une image</span>
                  </div>
                  <div className={theme === 'minimal' ? 'flex items-center space-x-2 border border-black p-3' : 'flex items-center space-x-2 bg-blue-50 rounded-lg p-3'}>
                    <Type className={theme === 'minimal' ? 'w-5 h-5 text-black' : 'w-5 h-5 text-blue-600'} />
                    <span className={theme === 'minimal' ? 'text-xs font-light text-gray-900 tracking-wide' : 'text-sm font-medium text-gray-900'} style={theme === 'minimal' ? { fontFamily: 'serif' } : {}}>Taper votre nom</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-6">
              <div className={theme === 'minimal' ? 'flex-shrink-0 w-12 h-12 bg-black text-white flex items-center justify-center text-sm' : 'flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold'}>
                4
              </div>
              <div>
                <h3 className={theme === 'minimal' ? 'text-sm font-light text-black mb-2 tracking-tight' : 'text-xl font-bold text-gray-900 mb-2'} style={theme === 'minimal' ? { fontFamily: 'serif' } : {}}>Positionnez la signature</h3>
                <p className={theme === 'minimal' ? 'text-xs text-gray-600 tracking-wide leading-loose' : 'text-gray-600'} style={theme === 'minimal' ? { fontFamily: 'serif' } : {}}>
                  Glissez votre signature à l'endroit souhaité sur le document.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-6">
              <div className={theme === 'minimal' ? 'flex-shrink-0 w-12 h-12 bg-black text-white flex items-center justify-center text-sm' : 'flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold'}>
                5
              </div>
              <div>
                <h3 className={theme === 'minimal' ? 'text-sm font-light text-black mb-2 tracking-tight' : 'text-xl font-bold text-gray-900 mb-2'} style={theme === 'minimal' ? { fontFamily: 'serif' } : {}}>Finalisez et téléchargez</h3>
                <p className={theme === 'minimal' ? 'text-xs text-gray-600 tracking-wide leading-loose' : 'text-gray-600'} style={theme === 'minimal' ? { fontFamily: 'serif' } : {}}>
                  Cliquez sur "Valider" pour obtenir un PDF signé, sécurisé et prêt à l'emploi.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-20">
          <h2 className={theme === 'minimal' ? 'text-2xl sm:text-3xl font-light text-black mb-8 text-center tracking-tight' : 'text-3xl sm:text-4xl font-bold text-gray-900 mb-8 text-center'} style={theme === 'minimal' ? { fontFamily: 'serif' } : {}}>
            Pourquoi choisir iDoc pour signer vos PDF ?
          </h2>
          <div className={theme === 'minimal' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-black' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'}>
            <div className={theme === 'minimal' ? 'bg-white p-6' : 'bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow'}>
              <div className={theme === 'minimal' ? 'w-12 h-12 border border-black flex items-center justify-center mb-4' : 'w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4'}>
                <Shield className={theme === 'minimal' ? 'w-6 h-6 text-black' : 'w-6 h-6 text-blue-600'} />
              </div>
              <h3 className={theme === 'minimal' ? 'text-sm font-light text-black mb-2 tracking-tight' : 'text-lg font-bold text-gray-900 mb-2'} style={theme === 'minimal' ? { fontFamily: 'serif' } : {}}>Sécurité RGPD</h3>
              <p className={theme === 'minimal' ? 'text-xs text-gray-600 tracking-wide leading-loose' : 'text-gray-600 text-sm'} style={theme === 'minimal' ? { fontFamily: 'serif' } : {}}>
                Chiffrement SSL, aucune donnée stockée sans consentement
              </p>
            </div>

            <div className={theme === 'minimal' ? 'bg-white p-6' : 'bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow'}>
              <div className={theme === 'minimal' ? 'w-12 h-12 border border-black flex items-center justify-center mb-4' : 'w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4'}>
                <Zap className={theme === 'minimal' ? 'w-6 h-6 text-black' : 'w-6 h-6 text-blue-600'} />
              </div>
              <h3 className={theme === 'minimal' ? 'text-sm font-light text-black mb-2 tracking-tight' : 'text-lg font-bold text-gray-900 mb-2'} style={theme === 'minimal' ? { fontFamily: 'serif' } : {}}>Rapide et sans inscription</h3>
              <p className={theme === 'minimal' ? 'text-xs text-gray-600 tracking-wide leading-loose' : 'text-gray-600 text-sm'} style={theme === 'minimal' ? { fontFamily: 'serif' } : {}}>
                Pas d'inscription obligatoire pour signer vos documents
              </p>
            </div>

            <div className={theme === 'minimal' ? 'bg-white p-6' : 'bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow'}>
              <div className={theme === 'minimal' ? 'w-12 h-12 border border-black flex items-center justify-center mb-4' : 'w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4'}>
                <FileSignature className={theme === 'minimal' ? 'w-6 h-6 text-black' : 'w-6 h-6 text-blue-600'} />
              </div>
              <h3 className={theme === 'minimal' ? 'text-sm font-light text-black mb-2 tracking-tight' : 'text-lg font-bold text-gray-900 mb-2'} style={theme === 'minimal' ? { fontFamily: 'serif' } : {}}>Multi-plateforme</h3>
              <p className={theme === 'minimal' ? 'text-xs text-gray-600 tracking-wide leading-loose' : 'text-gray-600 text-sm'} style={theme === 'minimal' ? { fontFamily: 'serif' } : {}}>
                Fonctionne sur ordinateur, mobile et tablette
              </p>
            </div>

            <div className={theme === 'minimal' ? 'bg-white p-6' : 'bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow'}>
              <div className={theme === 'minimal' ? 'w-12 h-12 border border-black flex items-center justify-center mb-4' : 'w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4'}>
                <Download className={theme === 'minimal' ? 'w-6 h-6 text-black' : 'w-6 h-6 text-blue-600'} />
              </div>
              <h3 className={theme === 'minimal' ? 'text-sm font-light text-black mb-2 tracking-tight' : 'text-lg font-bold text-gray-900 mb-2'} style={theme === 'minimal' ? { fontFamily: 'serif' } : {}}>PDF compatible</h3>
              <p className={theme === 'minimal' ? 'text-xs text-gray-600 tracking-wide leading-loose' : 'text-gray-600 text-sm'} style={theme === 'minimal' ? { fontFamily: 'serif' } : {}}>
                Format PDF compatible tous systèmes
              </p>
            </div>

            <div className={theme === 'minimal' ? 'bg-white p-6' : 'bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow'}>
              <div className={theme === 'minimal' ? 'w-12 h-12 border border-black flex items-center justify-center mb-4' : 'w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4'}>
                <CheckCircle className={theme === 'minimal' ? 'w-6 h-6 text-black' : 'w-6 h-6 text-green-600'} />
              </div>
              <h3 className={theme === 'minimal' ? 'text-sm font-light text-black mb-2 tracking-tight' : 'text-lg font-bold text-gray-900 mb-2'} style={theme === 'minimal' ? { fontFamily: 'serif' } : {}}>Juridiquement valide</h3>
              <p className={theme === 'minimal' ? 'text-xs text-gray-600 tracking-wide leading-loose' : 'text-gray-600 text-sm'} style={theme === 'minimal' ? { fontFamily: 'serif' } : {}}>
                Signature électronique conforme au règlement eIDAS
              </p>
            </div>

            <div className={theme === 'minimal' ? 'bg-white p-6' : 'bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow'}>
              <div className={theme === 'minimal' ? 'w-12 h-12 border border-black flex items-center justify-center mb-4' : 'w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4'}>
                <CheckCircle className={theme === 'minimal' ? 'w-6 h-6 text-black' : 'w-6 h-6 text-green-600'} />
              </div>
              <h3 className={theme === 'minimal' ? 'text-sm font-light text-black mb-2 tracking-tight' : 'text-lg font-bold text-gray-900 mb-2'} style={theme === 'minimal' ? { fontFamily: 'serif' } : {}}>100% Gratuit</h3>
              <p className={theme === 'minimal' ? 'text-xs text-gray-600 tracking-wide leading-loose' : 'text-gray-600 text-sm'} style={theme === 'minimal' ? { fontFamily: 'serif' } : {}}>
                L'ajout de signature est gratuit sur iDoc
              </p>
            </div>
          </div>
        </section>

        <section className={theme === 'minimal' ? 'bg-white border border-black p-8 sm:p-12 mb-20' : 'bg-white rounded-3xl p-8 sm:p-12 shadow-xl mb-20'}>
          <h2 className={theme === 'minimal' ? 'text-2xl sm:text-3xl font-light text-black mb-8 text-center tracking-tight' : 'text-3xl sm:text-4xl font-bold text-gray-900 mb-8 text-center'} style={theme === 'minimal' ? { fontFamily: 'serif' } : {}}>
            Questions fréquentes
          </h2>
          <div className="space-y-6 max-w-3xl mx-auto">
            <div>
              <h3 className={theme === 'minimal' ? 'text-sm font-light text-black mb-2 tracking-tight' : 'text-lg font-bold text-gray-900 mb-2'} style={theme === 'minimal' ? { fontFamily: 'serif' } : {}}>Est-ce légal ?</h3>
              <p className={theme === 'minimal' ? 'text-xs text-gray-600 tracking-wide leading-loose' : 'text-gray-600'} style={theme === 'minimal' ? { fontFamily: 'serif' } : {}}>
                Oui, la signature électronique sur iDoc est conforme au règlement européen eIDAS. Elle est juridiquement valable dans la majorité des cas du quotidien.
              </p>
            </div>

            <div>
              <h3 className={theme === 'minimal' ? 'text-sm font-light text-black mb-2 tracking-tight' : 'text-lg font-bold text-gray-900 mb-2'} style={theme === 'minimal' ? { fontFamily: 'serif' } : {}}>Puis-je signer un document déjà existant ?</h3>
              <p className={theme === 'minimal' ? 'text-xs text-gray-600 tracking-wide leading-loose' : 'text-gray-600'} style={theme === 'minimal' ? { fontFamily: 'serif' } : {}}>
                Bientôt disponible. Pour l'instant, utilisez les modèles iDoc pour générer puis signer le document.
              </p>
            </div>

            <div>
              <h3 className={theme === 'minimal' ? 'text-sm font-light text-black mb-2 tracking-tight' : 'text-lg font-bold text-gray-900 mb-2'} style={theme === 'minimal' ? { fontFamily: 'serif' } : {}}>Est-ce gratuit ?</h3>
              <p className={theme === 'minimal' ? 'text-xs text-gray-600 tracking-wide leading-loose' : 'text-gray-600'} style={theme === 'minimal' ? { fontFamily: 'serif' } : {}}>
                Oui, l'ajout de signature est gratuit sur les documents générés avec iDoc.
              </p>
            </div>
          </div>
        </section>

        <SignedDocumentShowcase />

        <section className={theme === 'minimal' ? 'bg-black p-8 sm:p-12 text-center text-white' : 'bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl p-8 sm:p-12 text-center text-white'}>
          <FileSignature className="w-16 h-16 mx-auto mb-6 opacity-90" />
          <h2 className={theme === 'minimal' ? 'text-2xl sm:text-3xl font-light mb-4 tracking-tight' : 'text-3xl sm:text-4xl font-bold mb-4'} style={theme === 'minimal' ? { fontFamily: 'serif' } : {}}>
            Essayez maintenant
          </h2>
          <p className={theme === 'minimal' ? 'text-sm mb-8 opacity-90 max-w-2xl mx-auto tracking-wide leading-loose' : 'text-xl mb-8 opacity-90 max-w-2xl mx-auto'} style={theme === 'minimal' ? { fontFamily: 'serif' } : {}}>
            Commencez ici pour créer et signer votre document PDF en moins de 3 minutes.
          </p>
          <button
            onClick={onGetStarted}
            className={theme === 'minimal' ? 'px-8 py-4 bg-white text-black text-xs tracking-[0.2em] hover:bg-gray-100 transition-colors' : 'px-8 py-4 bg-white text-blue-600 text-lg font-semibold rounded-xl hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg'}
            style={theme === 'minimal' ? { fontFamily: 'serif' } : {}}
          >
            {theme === 'minimal' ? 'CRÉER MON DOCUMENT SIGNÉ' : 'Créer mon document signé gratuitement'}
          </button>
        </section>
      </section>
    </div>
  );
}
