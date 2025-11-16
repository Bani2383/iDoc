import { useState } from 'react';
import { FileText, Sparkles, Info } from 'lucide-react';

interface GuestDocument {
  templateId: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

type Screen = 'guest' | 'auth' | 'dashboard';

export default function GuestFlowDemo() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('guest');
  const [guestTitle, setGuestTitle] = useState('');
  const [guestContext, setGuestContext] = useState('');
  const [guestDoc, setGuestDoc] = useState<GuestDocument | null>(null);

  const canGenerate = guestTitle.trim().length > 3 && guestContext.trim().length > 10;

  const handleGenerate = () => {
    if (!canGenerate) return;

    const now = new Date();
    const newDoc: GuestDocument = {
      templateId: 'template-simulation',
      title: guestTitle.trim(),
      content: `${guestTitle.trim()}\n\nContexte :\n${guestContext.trim()}\n\n[Contenu généré par l'IA – simulation iDoc / Noz]`,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };

    setGuestDoc(newDoc);
  };

  const handleGoToAuth = () => {
    setCurrentScreen('auth');
  };

  const handleAuthSuccess = () => {
    setCurrentScreen('dashboard');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-slate-950 to-blue-950 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-5xl bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-slate-800/40 overflow-hidden">
        {/* Header */}
        <header className="px-6 sm:px-8 py-4 border-b border-slate-200/80 bg-gradient-to-r from-white via-white to-blue-50 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-2xl bg-blue-600 flex items-center justify-center text-white">
              <FileText className="w-5 h-5" />
            </div>
            <div className="leading-tight">
              <div className="text-lg font-bold text-slate-900">
                i<span className="text-blue-600">Doc</span>
              </div>
              <div className="text-[11px] uppercase tracking-[0.12em] text-slate-500">
                Noz Avocats – Simulation
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="hidden sm:inline-flex items-center px-3 py-1 rounded-full bg-slate-900 text-slate-100 border border-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-400 mr-2"></span>
              Flux démo
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
              État :
              <span className="font-semibold ml-1">
                {currentScreen === 'guest' && 'Invité'}
                {currentScreen === 'auth' && 'Auth'}
                {currentScreen === 'dashboard' && 'Dashboard'}
              </span>
            </span>
          </div>
        </header>

        {/* Barre info */}
        <div className="px-6 sm:px-8 py-2 bg-slate-900 text-[11px] text-slate-200 flex flex-wrap items-center justify-between gap-2">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            <span>
              Parcours : invité → création de compte → récupération du document généré
            </span>
          </span>
          <span className="text-slate-400 hidden sm:inline">
            Simulation front-only (pas de backend réel)
          </span>
        </div>

        {/* Contenu */}
        <main className="p-6 sm:p-8 bg-slate-50">
          {/* Écran : Génération invité */}
          {currentScreen === 'guest' && (
            <section className="space-y-5">
              <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                <div className="flex-1 space-y-3">
                  <h2 className="text-xl font-semibold text-slate-900">
                    Générer un document en mode invité
                  </h2>
                  <p className="text-sm text-slate-600">
                    Cette étape reproduit le comportement de <strong>GuestDocumentGenerator</strong> :
                    votre visiteur choisit un modèle, remplit quelques informations, et l'IA
                    génère un projet de document. Il pourra ensuite créer un compte pour le
                    sauvegarder dans iDoc.
                  </p>
                </div>
                <div className="px-4 py-3 rounded-2xl bg-blue-900 text-[11px] text-slate-100 border border-blue-700 shadow-inner">
                  <div className="font-semibold mb-1">Design iDoc / Noz</div>
                  <p>
                    Palette sobre (blue + slate), cartes blanches, et accents bleus comme
                    dans ton app iDoc.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-2">
                {/* Form invité */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-semibold text-slate-900">
                      Informations pour l'IA
                    </h3>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[11px] font-semibold border border-blue-100">
                      Mode invité
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1.5" htmlFor="guest-title">
                        Titre du document
                      </label>
                      <input
                        id="guest-title"
                        type="text"
                        value={guestTitle}
                        onChange={(e) => setGuestTitle(e.target.value)}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                        placeholder="Ex : Contrat de prestation de services"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1.5" htmlFor="guest-context">
                        Contexte & détails
                      </label>
                      <textarea
                        id="guest-context"
                        value={guestContext}
                        onChange={(e) => setGuestContext(e.target.value)}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 min-h-[120px]"
                        placeholder="Décrivez la situation, les parties, l'objet du document, les clauses importantes…"
                      />
                      <p className="mt-1 text-[11px] text-slate-500">
                        Dans ton app réelle, ces informations sont envoyées à l'IA pour générer
                        le document.
                      </p>
                    </div>

                    <button
                      onClick={handleGenerate}
                      disabled={!canGenerate}
                      className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl text-sm font-semibold bg-blue-600 text-white shadow-sm hover:bg-blue-700 disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none disabled:cursor-not-allowed transition"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Générer le document
                    </button>
                  </div>
                </div>

                {/* Aperçu invité */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-slate-900">
                      Aperçu du document généré
                    </h3>
                    <span className="text-[11px] text-slate-500">
                      Simulation d'un .docx / .pdf généré
                    </span>
                  </div>

                  <div className="border border-dashed border-slate-300 rounded-xl p-4 bg-slate-50 text-xs sm:text-sm text-slate-700 min-h-[180px] whitespace-pre-wrap">
                    {guestDoc ? guestDoc.content : "Aucun document généré pour l'instant. Remplissez les champs à gauche puis cliquez sur « Générer le document »."}
                  </div>

                  {guestDoc && (
                    <div className="space-y-3 mt-2">
                      <div className="text-[11px] sm:text-xs text-blue-900 bg-blue-50 border border-blue-100 rounded-xl px-3 py-2">
                        <span className="font-semibold">Document généré en mode invité.</span>
                        <br />
                        Dans iDoc, vous proposez ici de créer un compte pour le sauvegarder dans
                        l'espace client.
                      </div>
                      <button
                        onClick={handleGoToAuth}
                        className="w-full inline-flex items-center justify-center px-4 py-2.5 rounded-xl text-sm font-semibold bg-slate-900 text-slate-50 hover:bg-black transition"
                      >
                        Sauvegarder en créant un compte
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* Écran : Auth */}
          {currentScreen === 'auth' && (
            <section className="space-y-5">
              <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                <div className="flex-1 space-y-2">
                  <h2 className="text-xl font-semibold text-slate-900">
                    Connexion / création de compte
                  </h2>
                  <p className="text-sm text-slate-600">
                    Ici, on simule ton <strong>AuthModal</strong> : dans la vraie app, tu utiliserais
                    Supabase / Firebase / autre pour authentifier l'utilisateur avant de
                    rattacher le document invité à son compte.
                  </p>
                </div>
                <div className="px-4 py-3 rounded-2xl bg-slate-900 text-[11px] text-slate-100 border border-slate-700 shadow-inner">
                  <div className="font-semibold mb-1">Étape 2 – Auth</div>
                  <p>
                    Quand l'auth est OK, tu appelles <code>/api/documents/import-guest</code> avec
                    les documents générés côté invité.
                  </p>
                </div>
              </div>

              <div className="max-w-md bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Adresse e-mail
                  </label>
                  <input
                    type="email"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                    defaultValue="invited-user@example.com"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Mot de passe
                  </label>
                  <input
                    type="password"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                    defaultValue="password"
                  />
                </div>
                <button
                  onClick={handleAuthSuccess}
                  className="w-full inline-flex items-center justify-center px-4 py-2.5 rounded-xl text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                  Se connecter (simulation)
                </button>
                <p className="text-[11px] text-slate-500">
                  Dans la vraie app, cette étape déclenche aussi le contexte utilisateur dans le
                  <code> AuthContext</code>.
                </p>
              </div>
            </section>
          )}

          {/* Écran : Dashboard */}
          {currentScreen === 'dashboard' && guestDoc && (
            <section className="space-y-5">
              <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-slate-900 mb-1">
                    Espace client iDoc
                  </h2>
                  <p className="text-sm text-slate-600">
                    Ce bloc reproduit l'esprit de ton <strong>ClientDashboard</strong> :
                    documents récents, mise en avant des documents importés depuis le mode
                    invité, et layout propre.
                  </p>
                </div>
                <div className="px-4 py-3 rounded-2xl bg-blue-50 text-[11px] text-blue-900 border border-blue-100 flex items-start gap-2">
                  <Info className="w-4 h-4 mt-[2px] flex-shrink-0" />
                  <div>
                    <span className="font-semibold">Documents récupérés depuis le mode invité</span>
                    <p className="mt-1">
                      Le document généré en tant qu'invité a été ajouté à votre compte. Il porte
                      le badge
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-blue-600 text-white text-[11px] font-semibold ml-1">
                        Invité
                      </span>.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <article className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col justify-between">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="space-y-1">
                      <div className="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-900 text-slate-50 text-[10px] uppercase tracking-wide">
                        Document
                      </div>
                      <h3 className="text-sm font-semibold text-slate-900 line-clamp-2">
                        {guestDoc.title}
                      </h3>
                    </div>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-blue-600 text-white text-[11px] font-semibold">
                      Invité
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-4 mb-3">
                    {guestDoc.content.length > 220
                      ? guestDoc.content.slice(0, 220) + '…'
                      : guestDoc.content}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 mt-auto border-t border-slate-100 pt-2">
                    <span>Créé le {formatDate(guestDoc.createdAt)}</span>
                    <span>Modifié le {formatDate(guestDoc.updatedAt)}</span>
                  </div>
                </article>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
