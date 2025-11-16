import { FileCheck, Award, FileText, CheckCircle, Shield, Lock } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export function SignedDocumentShowcase() {
  const { theme } = useTheme();
  const isMinimal = theme === 'minimal';

  const documents = [
    {
      title: 'Contrat de Travail',
      description: 'CDI signé numériquement',
      icon: FileText,
      signature: 'Jean Dupont',
      date: '15 Jan 2025',
    },
    {
      title: 'Attestation',
      description: 'Attestation sur l\'honneur',
      icon: Award,
      signature: 'Marie Martin',
      date: '12 Jan 2025',
    },
    {
      title: 'Convention',
      description: 'Convention de stage',
      icon: FileCheck,
      signature: 'Pierre Bernard',
      date: '08 Jan 2025',
    },
  ];

  return (
    <section className={`py-16 sm:py-24 ${isMinimal ? 'bg-gray-50' : 'bg-gradient-to-br from-blue-50 to-indigo-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2
            className={isMinimal ? 'text-3xl sm:text-4xl font-light text-black mb-4 tracking-tight' : 'text-3xl sm:text-4xl font-bold text-gray-900 mb-4'}
            style={isMinimal ? { fontFamily: 'serif' } : {}}
          >
            Exemples de documents signés
          </h2>
          <p
            className={isMinimal ? 'text-xs text-gray-600 max-w-2xl mx-auto tracking-wide leading-loose' : 'text-lg text-gray-600 max-w-2xl mx-auto'}
            style={isMinimal ? { fontFamily: 'serif' } : {}}
          >
            Découvrez comment vos documents apparaîtront une fois signés électroniquement
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {documents.map((doc, index) => (
            <div
              key={index}
              className={`group relative overflow-hidden transition-all duration-300 hover:scale-105 ${
                isMinimal
                  ? 'bg-white border-2 border-black hover:shadow-2xl'
                  : 'bg-white rounded-2xl shadow-lg hover:shadow-2xl'
              }`}
            >
              {/* Watermark PDF in background */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span
                  className={`text-9xl font-bold transform rotate-[-45deg] select-none ${
                    isMinimal ? 'text-gray-300' : 'text-gray-200'
                  }`}
                  style={isMinimal ? { fontFamily: 'serif', opacity: 0.25 } : { opacity: 0.15 }}
                >
                  PDF
                </span>
              </div>

              {/* Stamp/Seal watermark in background */}
              <div className={`absolute top-1/3 right-8 pointer-events-none ${
                isMinimal ? 'opacity-5' : 'opacity-5'
              }`}>
                <div className={`w-32 h-32 rounded-full border-8 ${
                  isMinimal ? 'border-black' : 'border-blue-600'
                } flex items-center justify-center transform rotate-12`}>
                  <CheckCircle className={`w-16 h-16 ${
                    isMinimal ? 'text-black' : 'text-blue-600'
                  }`} />
                </div>
              </div>
              {/* Document Header */}
              <div className={`p-6 ${isMinimal ? 'border-b-2 border-black' : 'border-b border-gray-200'}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className={isMinimal ? 'p-2 bg-black' : 'p-2 bg-blue-100 rounded-lg'}>
                      <doc.icon className={isMinimal ? 'w-6 h-6 text-white' : 'w-6 h-6 text-blue-600'} />
                    </div>
                    <div>
                      <h3
                        className={isMinimal ? 'text-sm font-light text-black tracking-tight' : 'text-lg font-bold text-gray-900'}
                        style={isMinimal ? { fontFamily: 'serif' } : {}}
                      >
                        {doc.title}
                      </h3>
                      <p
                        className={isMinimal ? 'text-xs text-gray-600 tracking-wide' : 'text-sm text-gray-500'}
                        style={isMinimal ? { fontFamily: 'serif' } : {}}
                      >
                        {doc.description}
                      </p>
                    </div>
                  </div>

                  {/* Security Badge */}
                  <div className={`flex items-center space-x-1 ${isMinimal ? 'border border-black px-2 py-1' : 'bg-green-50 px-2 py-1 rounded-lg'}`}>
                    <Shield className={isMinimal ? 'w-3 h-3 text-black' : 'w-3 h-3 text-green-600'} />
                    <Lock className={isMinimal ? 'w-3 h-3 text-black' : 'w-3 h-3 text-green-600'} />
                  </div>
                </div>
              </div>

              {/* Document Body - Simulated content */}
              <div className="relative p-6 space-y-3 z-10">
                <div className={`h-2 ${isMinimal ? 'bg-gray-300' : 'bg-gray-200'} rounded w-full`}></div>
                <div className={`h-2 ${isMinimal ? 'bg-gray-300' : 'bg-gray-200'} rounded w-5/6`}></div>
                <div className={`h-2 ${isMinimal ? 'bg-gray-300' : 'bg-gray-200'} rounded w-4/6`}></div>
                <div className={`h-2 ${isMinimal ? 'bg-gray-300' : 'bg-gray-200'} rounded w-full`}></div>
                <div className={`h-2 ${isMinimal ? 'bg-gray-300' : 'bg-gray-200'} rounded w-3/4`}></div>

                {/* Empty space for signature area */}
                <div className="py-8"></div>

                {/* Signature Section */}
                <div className={`relative mt-6 p-4 z-10 ${isMinimal ? 'border-2 border-black bg-gray-50' : 'bg-blue-50 rounded-lg border-2 border-blue-200'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={isMinimal ? 'text-xs font-light text-gray-600 tracking-wide' : 'text-sm font-semibold text-gray-700'}
                      style={isMinimal ? { fontFamily: 'serif' } : {}}
                    >
                      Signature électronique
                    </span>
                    <CheckCircle className={isMinimal ? 'w-4 h-4 text-black' : 'w-4 h-4 text-green-600'} />
                  </div>

                  {/* Handwritten signature style */}
                  <div className="mb-3">
                    <div
                      className={isMinimal ? 'text-2xl text-black' : 'text-2xl text-blue-900'}
                      style={{
                        fontFamily: 'cursive',
                        fontStyle: 'italic',
                        transform: 'rotate(-2deg)',
                      }}
                    >
                      {doc.signature}
                    </div>
                  </div>

                  {/* Signature metadata */}
                  <div className={`flex items-center justify-between text-xs ${isMinimal ? 'text-gray-600' : 'text-gray-500'}`}>
                    <span style={isMinimal ? { fontFamily: 'serif', fontSize: '10px', letterSpacing: '0.05em' } : {}}>
                      Signé le {doc.date}
                    </span>
                    <span
                      className={isMinimal ? 'text-xs' : 'font-semibold text-green-600'}
                      style={isMinimal ? { fontFamily: 'serif', fontSize: '10px', letterSpacing: '0.05em' } : {}}
                    >
                      ✓ Vérifié
                    </span>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Trust indicators */}
        <div className="mt-16 text-center">
          <div className={`inline-flex flex-col sm:flex-row items-center sm:space-x-6 space-y-4 sm:space-y-0 ${isMinimal ? 'border-2 border-black p-6' : 'bg-white rounded-2xl p-6 shadow-lg'}`}>
            <div className="flex items-center space-x-2">
              <Shield className={isMinimal ? 'w-5 h-5 text-black' : 'w-5 h-5 text-green-600'} />
              <span
                className={isMinimal ? 'text-xs font-light tracking-wide' : 'text-sm font-semibold text-gray-700'}
                style={isMinimal ? { fontFamily: 'serif' } : {}}
              >
                Document sécurisé
              </span>
            </div>
            <div className={`hidden sm:block w-px h-8 ${isMinimal ? 'bg-black' : 'bg-gray-300'}`}></div>
            <div className="flex items-center space-x-2">
              <CheckCircle className={isMinimal ? 'w-5 h-5 text-black' : 'w-5 h-5 text-green-600'} />
              <span
                className={isMinimal ? 'text-xs font-light tracking-wide' : 'text-sm font-semibold text-gray-700'}
                style={isMinimal ? { fontFamily: 'serif' } : {}}
              >
                Légalement valide
              </span>
            </div>
            <div className={`hidden sm:block w-px h-8 ${isMinimal ? 'bg-black' : 'bg-gray-300'}`}></div>
            <div className="flex items-center space-x-2">
              <Lock className={isMinimal ? 'w-5 h-5 text-black' : 'w-5 h-5 text-green-600'} />
              <span
                className={isMinimal ? 'text-xs font-light tracking-wide' : 'text-sm font-semibold text-gray-700'}
                style={isMinimal ? { fontFamily: 'serif' } : {}}
              >
                Horodatage sécurisé
              </span>
            </div>
            <div className={`hidden sm:block w-px h-8 ${isMinimal ? 'bg-black' : 'bg-gray-300'}`}></div>
            <div className="flex items-center space-x-2">
              <CheckCircle className={isMinimal ? 'w-5 h-5 text-black' : 'w-5 h-5 text-green-600'} />
              <span
                className={isMinimal ? 'text-xs font-light tracking-wide' : 'text-sm font-semibold text-gray-700'}
                style={isMinimal ? { fontFamily: 'serif' } : {}}
              >
                Conforme RGPD
              </span>
            </div>
          </div>

          {/* Security explanation */}
          <p
            className={`mt-6 max-w-3xl mx-auto ${isMinimal ? 'text-[10px] text-gray-600 tracking-wider leading-relaxed' : 'text-sm text-gray-500'}`}
            style={isMinimal ? { fontFamily: 'serif' } : {}}
          >
            <Shield className={`inline w-3 h-3 mr-1 ${isMinimal ? 'text-black' : 'text-green-600'}`} />
            <Lock className={`inline w-3 h-3 mr-2 ${isMinimal ? 'text-black' : 'text-green-600'}`} />
            Tous vos documents PDF sont protégés par un chiffrement SSL/TLS de niveau bancaire et stockés de manière sécurisée.
            Chaque signature électronique est certifiée, horodatée et juridiquement reconnue.
          </p>
        </div>
      </div>
    </section>
  );
}
