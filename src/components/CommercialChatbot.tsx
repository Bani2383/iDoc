import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Sparkles, FileText, CreditCard } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

export default function CommercialChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length === 0 && isOpen) {
      addBotMessage(
        "Bonjour ! Je suis votre assistant iDoc. Comment puis-je vous aider aujourd'hui ?",
        [
          "Quel document me conseillez-vous ?",
          "Comment ça marche ?",
          "Quels sont vos tarifs ?",
          "Avez-vous un service d'urgence ?"
        ]
      );
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const addBotMessage = (content: string, suggestions?: string[]) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type: 'bot',
      content,
      timestamp: new Date(),
      suggestions
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const handleSend = (text?: string) => {
    const messageText = text || inputValue.trim();
    if (!messageText) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: messageText,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      handleBotResponse(messageText.toLowerCase());
    }, 1000 + Math.random() * 1000);
  };

  const handleBotResponse = (userInput: string) => {
    let response = '';
    let suggestions: string[] = [];

    if (userInput.includes('tarif') || userInput.includes('prix') || userInput.includes('coût')) {
      response = "Nos tarifs sont très compétitifs ! Chaque document coûte entre 9.90€ et 29.90€ selon la complexité. Vous pouvez aussi acheter des packs de crédits pour économiser jusqu'à 40% ! Voulez-vous que je vous montre nos offres spéciales ?";
      suggestions = [
        "Voir les packs de crédits",
        "Voir les abonnements",
        "Offre du jour"
      ];
    } else if (userInput.includes('comment') || userInput.includes('marche') || userInput.includes('fonctionne')) {
      response = "C'est très simple ! En 3 étapes :\n\n1️⃣ Choisissez votre template\n2️⃣ Remplissez le formulaire guidé\n3️⃣ Téléchargez votre document en PDF\n\nTout est automatisé et prend moins de 5 minutes ! Voulez-vous essayer ?";
      suggestions = [
        "Voir les templates",
        "Démo gratuite",
        "Créer mon premier document"
      ];
    } else if (userInput.includes('document') || userInput.includes('template') || userInput.includes('quel')) {
      response = "Nous avons plus de 50 templates professionnels ! Les plus populaires sont :\n\n📄 Contrat de location\n📄 Lettre de démission\n📄 Bail commercial\n📄 Testament\n📄 Statuts de société\n\nQue recherchez-vous exactement ?";
      suggestions = [
        "Documents juridiques",
        "Documents administratifs",
        "Contrats professionnels"
      ];
    } else if (userInput.includes('urgence') || userInput.includes('rapide') || userInput.includes('vite')) {
      response = "Excellent choix ! Nos documents sont générés instantanément. Pour un service ultra-rapide :\n\n⚡ Génération en 2 minutes\n👨‍⚖️ Révision juridique sous 24h (service premium)\n✍️ Remplissage par nos experts sous 4h\n\nVoulez-vous en savoir plus sur nos services premium ?";
      suggestions = [
        "Services premium",
        "Révision juridique",
        "Remplissage express"
      ];
    } else if (userInput.includes('sécurit') || userInput.includes('confiance') || userInput.includes('fiable')) {
      response = "Excellente question ! Votre sécurité est notre priorité :\n\n🔒 Chiffrement SSL\n✅ Conformité RGPD\n👨‍⚖️ Documents validés par des juristes\n💾 Stockage sécurisé\n⭐ +15,000 clients satisfaits\n\nVous pouvez nous faire confiance à 100% !";
      suggestions = [
        "Voir les avis clients",
        "En savoir plus",
        "Créer un document maintenant"
      ];
    } else if (userInput.includes('réduction') || userInput.includes('promo') || userInput.includes('offre')) {
      response = "J'ai une offre spéciale pour vous ! 🎁\n\n✨ Code WELCOME40 : -40% sur votre 1er document\n🔥 Offre flash du jour : jusqu'à -50%\n💎 Pack 50 crédits : BONUS de +20 crédits gratuits\n\nVoulez-vous profiter de l'une de ces offres ?";
      suggestions = [
        "Utiliser WELCOME40",
        "Voir l'offre flash",
        "Acheter le pack bonus"
      ];
    } else if (userInput.includes('abonnement') || userInput.includes('subscription') || userInput.includes('mensuel')) {
      response = "Nos abonnements sont parfaits pour les utilisateurs réguliers !\n\n💼 Pro : 29.90€/mois - Génération illimitée\n👑 Business : 49.90€/mois - + API + White-label\n🏢 Enterprise : Sur mesure\n\n📊 Économisez 20% avec l'abonnement annuel !\n\nQuel plan vous intéresse ?";
      suggestions = [
        "Comparer les plans",
        "Essai gratuit 7 jours",
        "Souscrire maintenant"
      ];
    } else {
      response = "Je comprends votre question ! Je peux vous aider avec :\n\n📄 Nos templates et documents\n💰 Les tarifs et offres spéciales\n⚡ Les services premium\n🎁 Les réductions en cours\n\nQue souhaitez-vous savoir ?";
      suggestions = [
        "Voir tous les documents",
        "Offres du moment",
        "Parler à un humain"
      ];
    }

    addBotMessage(response, suggestions);
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSend(suggestion);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full p-4 shadow-2xl hover:shadow-3xl transition-all z-50 group"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
          1
        </span>
        <div className="absolute bottom-full right-0 mb-2 bg-gray-900 text-white px-4 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
          Besoin d'aide ? Discutons ! 💬
        </div>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col z-50">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
        <div className="flex items-center">
          <div className="relative">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-blue-600" />
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
          </div>
          <div className="ml-3">
            <div className="font-bold">Assistant iDoc</div>
            <div className="text-xs text-blue-100">En ligne • Répond en ~1min</div>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((message) => (
          <div key={message.id}>
            <div
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                  message.type === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-gray-200'
                }`}
              >
                <div className="text-sm whitespace-pre-line">{message.content}</div>
                <div
                  className={`text-xs mt-1 ${
                    message.type === 'user' ? 'text-blue-100' : 'text-gray-400'
                  }`}
                >
                  {message.timestamp.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>

            {message.suggestions && message.suggestions.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2 ml-2">
                {message.suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="text-sm bg-white border-2 border-blue-300 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-50 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-gray-200 bg-white rounded-b-2xl">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Posez votre question..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={() => handleSend()}
            disabled={!inputValue.trim()}
            className="bg-blue-600 text-white rounded-full p-2 hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center justify-center gap-4 mt-3 text-xs text-gray-500">
          <span className="flex items-center">
            <FileText className="w-3 h-3 mr-1" />
            50+ templates
          </span>
          <span className="flex items-center">
            <CreditCard className="w-3 h-3 mr-1" />
            Paiement sécurisé
          </span>
        </div>
      </div>
    </div>
  );
}
