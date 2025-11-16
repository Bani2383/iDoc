import { useTheme } from '../contexts/ThemeContext';
import { Sparkles, Zap, CheckCircle, ArrowRight } from 'lucide-react';

interface VisualExperienceSectionProps {
  onTryNow: () => void;
}

export function VisualExperienceSection({ onTryNow }: VisualExperienceSectionProps) {
  const { theme } = useTheme();
  const isMinimal = theme === 'minimal';

  if (isMinimal) {
    return (
      <section className="py-32 bg-white">
      <div className="max-w-5xl mx-auto px-8 sm:px-12 lg:px-16">
        <div className="text-center mb-32 relative">
          <div className="absolute top-0 right-1/4 w-2 h-2 border border-black rounded-full"></div>
          <div className="flex items-start justify-center mb-12">
            <span className="text-xs tracking-[0.3em] text-gray-900 font-light" style={{ fontFamily: 'serif', writingMode: 'vertical-rl', textOrientation: 'mixed' }}>
              CRÉATION / INSTANTANÉE
            </span>
          </div>
          <h2 className="text-7xl sm:text-8xl lg:text-9xl font-light text-black mb-20 leading-none tracking-tight" style={{ fontFamily: 'serif' }}>
            DOCUMENTS<br />INTELLIGENTS.
          </h2>
          <div className="max-w-2xl mx-auto space-y-8">
            <p className="text-xs text-gray-700 leading-loose tracking-wide" style={{ fontFamily: 'serif' }}>
              Créez vos contrats, attestations et conventions en quelques minutes.
              Notre plateforme génère automatiquement vos documents juridiques personnalisés,
              avec signature électronique intégrée et validation légale instantanée.
            </p>
          </div>
        </div>

        <div className="space-y-24 mb-32">
          <div className="border-t border-black pt-12">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              <div className="md:col-span-3">
                <span className="text-xs tracking-[0.2em] text-gray-500" style={{ fontFamily: 'serif' }}>01</span>
              </div>
              <div className="md:col-span-9">
                <h3 className="text-3xl font-light text-black mb-6 tracking-tight" style={{ fontFamily: 'serif' }}>
                  Exemple : Contrat<br />de travail CDI
                </h3>
                <p className="text-xs text-gray-700 leading-loose tracking-wide mb-8" style={{ fontFamily: 'serif' }}>
                  Générez un contrat de travail complet et conforme au droit français en 3 minutes.
                  Remplissez simplement les informations de l'employeur et du salarié, notre système
                  crée automatiquement un document juridiquement valide prêt à être signé.
                </p>

                {/* Document Example Card */}
                <div className="border-2 border-black bg-gray-50 p-6 mb-6">
                  <div className="flex items-start justify-between mb-4 pb-4 border-b border-gray-300">
                    <div>
                      <h4 className="text-sm font-light text-black mb-1 tracking-tight" style={{ fontFamily: 'serif' }}>
                        CONTRAT DE TRAVAIL À DURÉE INDÉTERMINÉE
                      </h4>
                      <p className="text-[10px] text-gray-600 tracking-wide" style={{ fontFamily: 'serif' }}>
                        Document généré le 10 novembre 2025
                      </p>
                    </div>
                    <span className="text-[9px] tracking-wider text-gray-500 border border-gray-400 px-2 py-1" style={{ fontFamily: 'serif' }}>
                      PDF
                    </span>
                  </div>

                  <div className="space-y-3 text-[10px] text-gray-700 leading-relaxed" style={{ fontFamily: 'serif' }}>
                    <p className="tracking-wide">
                      Entre les soussignés :<br />
                      <span className="text-black font-light">SARL INNOVATION TECH</span>, société au capital de 50 000€,
                      immatriculée au RCS de Paris sous le numéro 123 456 789, dont le siège social est situé
                      15 Avenue des Champs-Élysées, 75008 Paris, représentée par <span className="text-black font-light">M. Pierre MARTIN</span>,
                      agissant en qualité de Directeur Général, ci-après dénommée "l'Employeur",
                    </p>

                    <p className="tracking-wide">
                      D'une part,<br />
                      Et <span className="text-black font-light">Mme Sophie DUBOIS</span>, née le 15 mars 1990 à Lyon (69),
                      de nationalité française, domiciliée au 42 Rue de la République, 69002 Lyon,
                      N° de Sécurité Sociale : 2 90 03 69 123 456 78, ci-après dénommée "le Salarié",
                    </p>

                    <p className="tracking-wide">D'autre part,</p>

                    <p className="tracking-wide font-light">
                      Il a été convenu et arrêté ce qui suit :
                    </p>

                    <div className="mt-4 pt-4 border-t border-gray-300">
                      <p className="text-black font-light tracking-wide mb-2">ARTICLE 1 - ENGAGEMENT</p>
                      <p className="tracking-wide">
                        L'Employeur engage le Salarié qui accepte, au poste de <span className="text-black font-light">Développeur Full Stack Senior</span>,
                        à compter du <span className="text-black font-light">1er décembre 2025</span>. Le présent contrat est conclu
                        pour une durée indéterminée...
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-300 flex items-center justify-between">
                    <span className="text-[9px] text-gray-500 tracking-wider" style={{ fontFamily: 'serif' }}>
                      ✓ 12 ARTICLES • 4 PAGES • CONFORME 2025
                    </span>
                    <span className="text-[9px] text-black tracking-wider" style={{ fontFamily: 'serif' }}>
                      → SIGNATURE ÉLECTRONIQUE
                    </span>
                  </div>
                </div>

                <ul className="space-y-3">
                  <li className="text-xs text-gray-600 tracking-wide" style={{ fontFamily: 'serif' }}>— Clauses juridiques à jour du Code du travail 2025</li>
                  <li className="text-xs text-gray-600 tracking-wide" style={{ fontFamily: 'serif' }}>— Personnalisation automatique selon votre secteur</li>
                  <li className="text-xs text-gray-600 tracking-wide" style={{ fontFamily: 'serif' }}>— Validation par nos experts en droit social</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t border-black pt-12">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              <div className="md:col-span-3">
                <span className="text-xs tracking-[0.2em] text-gray-500" style={{ fontFamily: 'serif' }}>02</span>
              </div>
              <div className="md:col-span-9">
                <h3 className="text-3xl font-light text-black mb-6 tracking-tight" style={{ fontFamily: 'serif' }}>
                  Signature électronique<br />fluide et sans friction
                </h3>
                <p className="text-xs text-gray-700 leading-loose tracking-wide mb-6" style={{ fontFamily: 'serif' }}>
                  Signez vos documents PDF d'un simple geste, avec une expérience tactile naturelle et réactive.
                  Dessinez votre signature au doigt ou à la souris, importez une image, ou tapez votre nom avec une police manuscrite élégante.
                  L'animation se charge du reste pour un rendu professionnel instantané.
                </p>
                <ul className="space-y-3">
                  <li className="text-xs text-gray-600 tracking-wide" style={{ fontFamily: 'serif' }}>— Interface de signature tactile ultra-réactive</li>
                  <li className="text-xs text-gray-600 tracking-wide" style={{ fontFamily: 'serif' }}>— Positionnement par glisser-déposer intuitif</li>
                  <li className="text-xs text-gray-600 tracking-wide" style={{ fontFamily: 'serif' }}>— Intégration animée dans le document final</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t border-black pt-12">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              <div className="md:col-span-3">
                <span className="text-xs tracking-[0.2em] text-gray-500" style={{ fontFamily: 'serif' }}>03</span>
              </div>
              <div className="md:col-span-9">
                <h3 className="text-3xl font-light text-black mb-6 tracking-tight" style={{ fontFamily: 'serif' }}>
                  Illustrations explicatives<br />à chaque étape
                </h3>
                <p className="text-xs text-gray-700 leading-loose tracking-wide mb-6" style={{ fontFamily: 'serif' }}>
                  Chaque action que vous effectuez sur iDoc est accompagnée d'illustrations numériques claires et modernes.
                  Des pictogrammes animés guident vos choix, des infobulles contextuelles s'affichent au bon moment,
                  et des micro-animations confirment vos actions. Une expérience pensée pour vous accompagner du début à la fin.
                </p>
                <ul className="space-y-3">
                  <li className="text-xs text-gray-600 tracking-wide" style={{ fontFamily: 'serif' }}>— Icônes animées pour chaque type de document</li>
                  <li className="text-xs text-gray-600 tracking-wide" style={{ fontFamily: 'serif' }}>— Guides visuels pour le remplissage des formulaires</li>
                  <li className="text-xs text-gray-600 tracking-wide" style={{ fontFamily: 'serif' }}>— Feedback visuel immédiat sur chaque action</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t border-black pt-12">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              <div className="md:col-span-3">
                <span className="text-xs tracking-[0.2em] text-gray-500" style={{ fontFamily: 'serif' }}>04</span>
              </div>
              <div className="md:col-span-9">
                <h3 className="text-3xl font-light text-black mb-6 tracking-tight" style={{ fontFamily: 'serif' }}>
                  Un design pensé pour<br />l'utilisateur non expert
                </h3>
                <p className="text-xs text-gray-700 leading-loose tracking-wide mb-6" style={{ fontFamily: 'serif' }}>
                  Pas besoin d'être un pro de la technologie pour utiliser iDoc. Notre interface épurée, nos animations guidées
                  et nos transitions fluides rendent la création de documents accessible à tous. L'application s'adapte à votre niveau,
                  jamais l'inverse. Une expérience visuelle rassurante qui vous donne confiance à chaque clic.
                </p>
                <ul className="space-y-3">
                  <li className="text-xs text-gray-600 tracking-wide" style={{ fontFamily: 'serif' }}>— Navigation intuitive sans courbe d'apprentissage</li>
                  <li className="text-xs text-gray-600 tracking-wide" style={{ fontFamily: 'serif' }}>— Messages d'aide contextuels au bon moment</li>
                  <li className="text-xs text-gray-600 tracking-wide" style={{ fontFamily: 'serif' }}>— Design responsive parfait sur mobile et tablette</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-black pt-16 pb-16">
          <div className="text-center mb-12">
            <h3 className="text-5xl sm:text-6xl font-light text-black mb-8 tracking-tight" style={{ fontFamily: 'serif' }}>
              Découvrez iDoc<br />en action
            </h3>
            <p className="text-xs text-gray-700 leading-loose tracking-wide max-w-xl mx-auto mb-12" style={{ fontFamily: 'serif' }}>
              Explorez l'expérience visuelle iDoc : formulaires animés, signature fluide, génération PDF en temps réel.
              Une interface moderne qui transforme la création de documents en un moment agréable.
            </p>
            <button
              onClick={onTryNow}
              className="px-12 py-4 bg-black text-white text-xs tracking-[0.2em] hover:bg-gray-800 transition-all border border-black"
              style={{ fontFamily: 'serif' }}
            >
              ESSAYER MAINTENANT
            </button>
          </div>

          <div className="relative mt-20">
            <svg viewBox="0 0 400 200" className="w-full max-w-md mx-auto">
              <path
                d="M 50 150 Q 100 50, 200 100 T 350 150"
                stroke="black"
                strokeWidth="1"
                fill="none"
                className="signature-path"
              />
            </svg>
            <p className="text-center text-xs text-gray-500 mt-4 tracking-wide" style={{ fontFamily: 'serif' }}>
              Daraia Ijun
            </p>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-3 gap-px bg-black">
          <div className="bg-white p-8 text-center">
            <div className="text-4xl font-light text-black mb-2" style={{ fontFamily: 'serif' }}>100%</div>
            <p className="text-xs text-gray-600 tracking-wide" style={{ fontFamily: 'serif' }}>Interface web</p>
          </div>
          <div className="bg-white p-8 text-center">
            <div className="text-4xl font-light text-black mb-2" style={{ fontFamily: 'serif' }}>60fps</div>
            <p className="text-xs text-gray-600 tracking-wide" style={{ fontFamily: 'serif' }}>Animations fluides</p>
          </div>
          <div className="bg-white p-8 text-center">
            <div className="text-4xl font-light text-black mb-2" style={{ fontFamily: 'serif' }}>0</div>
            <p className="text-xs text-gray-600 tracking-wide" style={{ fontFamily: 'serif' }}>Friction</p>
          </div>
        </div>
      </div>
    </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <Sparkles className="w-4 h-4" />
            <span>Documents intelligents</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Créez vos documents juridiques<br />en quelques minutes
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Créez vos contrats, attestations et conventions en toute simplicité.
            Notre plateforme génère automatiquement vos documents juridiques personnalisés,
            avec signature électronique intégrée et validation légale instantanée.
          </p>
        </div>

        {/* Document Example Card - Full Width */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-gray-200 mb-12">
          <div className="flex items-start justify-between mb-6 pb-6 border-b-2 border-blue-100">
            <div>
              <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold mb-3">
                <Zap className="w-3 h-3" />
                <span>Exemple de document généré</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Contrat de travail à durée indéterminée (CDI)
              </h3>
              <p className="text-sm text-gray-600">
                Document généré automatiquement le 10 novembre 2025 • Conforme Code du travail 2025
              </p>
            </div>
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200">
              PDF
            </span>
          </div>

          <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6 sm:p-8 border border-gray-200">
            <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
              <p>
                Entre les soussignés :<br />
                <span className="font-semibold text-gray-900">SARL INNOVATION TECH</span>, société au capital de 50 000€,
                immatriculée au RCS de Paris sous le numéro 123 456 789, dont le siège social est situé
                15 Avenue des Champs-Élysées, 75008 Paris, représentée par <span className="font-semibold text-gray-900">M. Pierre MARTIN</span>,
                agissant en qualité de Directeur Général, ci-après dénommée "l'Employeur",
              </p>

              <p>
                D'une part,<br />
                Et <span className="font-semibold text-gray-900">Mme Sophie DUBOIS</span>, née le 15 mars 1990 à Lyon (69),
                de nationalité française, domiciliée au 42 Rue de la République, 69002 Lyon,
                N° de Sécurité Sociale : 2 90 03 69 123 456 78, ci-après dénommée "le Salarié",
              </p>

              <p>D'autre part,</p>

              <p className="font-semibold text-gray-900">
                Il a été convenu et arrêté ce qui suit :
              </p>

              <div className="mt-6 pt-6 border-t-2 border-blue-100">
                <p className="font-bold text-gray-900 mb-3">ARTICLE 1 - ENGAGEMENT</p>
                <p>
                  L'Employeur engage le Salarié qui accepte, au poste de <span className="font-semibold text-blue-700">Développeur Full Stack Senior</span>,
                  à compter du <span className="font-semibold text-blue-700">1er décembre 2025</span>. Le présent contrat est conclu
                  pour une durée indéterminée et prendra effet à la date susmentionnée...
                </p>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t-2 border-blue-100 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-4 text-xs text-gray-600">
                <span className="flex items-center space-x-1">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>12 articles</span>
                </span>
                <span className="flex items-center space-x-1">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>4 pages</span>
                </span>
                <span className="flex items-center space-x-1">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Conforme 2025</span>
                </span>
              </div>
              <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold">
                <span>Ajouter signature électronique</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-gray-900">Clauses juridiques à jour</p>
                <p className="text-xs text-gray-600">Code du travail 2025</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-gray-900">Personnalisation automatique</p>
                <p className="text-xs text-gray-600">Selon votre secteur d'activité</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-gray-900">Validation juridique</p>
                <p className="text-xs text-gray-600">Par nos experts en droit</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 rounded-3xl p-10 sm:p-12 text-center text-white shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-transparent opacity-20"></div>
          <div className="relative z-10">
            <Sparkles className="w-16 h-16 mx-auto mb-6 opacity-90" />
            <h3 className="text-3xl sm:text-4xl font-bold mb-4">
              Découvrez iDoc en action
            </h3>
            <p className="text-xl text-blue-50 mb-8 max-w-2xl mx-auto">
              Explorez l'expérience visuelle iDoc : formulaires animés, signature fluide, génération PDF en temps réel.
              Une interface moderne qui transforme la création de documents en un moment agréable.
            </p>
            <button
              onClick={onTryNow}
              className="px-8 py-4 bg-white text-blue-600 text-lg font-bold rounded-xl hover:bg-blue-50 transition-all transform hover:scale-105 shadow-xl inline-flex items-center space-x-3"
            >
              <span>Essayer l'expérience visuelle iDoc</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <p className="text-sm text-blue-100 mt-4">
              Aucune installation • Interface 100% web • Gratuit
            </p>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="text-4xl font-bold text-blue-600 mb-2">100%</div>
            <p className="text-gray-700 font-semibold">Interface web</p>
            <p className="text-sm text-gray-600 mt-1">Aucun téléchargement requis</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="text-4xl font-bold text-blue-600 mb-2">60fps</div>
            <p className="text-gray-700 font-semibold">Animations fluides</p>
            <p className="text-sm text-gray-600 mt-1">Expérience ultra-réactive</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="text-4xl font-bold text-blue-600 mb-2">0</div>
            <p className="text-gray-700 font-semibold">Friction utilisateur</p>
            <p className="text-sm text-gray-600 mt-1">Prise en main immédiate</p>
          </div>
        </div>
      </div>
    </section>
  );
}
