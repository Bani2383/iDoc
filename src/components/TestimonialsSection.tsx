import React from 'react';
import { Star, Quote } from 'lucide-react';

interface Testimonial {
  name: string;
  role: string;
  company: string;
  image: string;
  rating: number;
  text: string;
}

export function TestimonialsSection() {
  const testimonials: Testimonial[] = [
    {
      name: 'Sophie Martin',
      role: 'Avocate',
      company: 'Cabinet Martin & Associés',
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
      rating: 5,
      text: 'iDoc a révolutionné ma façon de travailler. Je génère des contrats professionnels en quelques minutes au lieu de plusieurs heures. Un gain de temps incroyable!',
    },
    {
      name: 'Thomas Dubois',
      role: 'Freelance Développeur',
      company: 'Independent',
      image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
      rating: 5,
      text: 'En tant que freelance, j\'ai besoin de documents professionnels rapidement. Les templates sont parfaits et toujours à jour juridiquement. Je recommande à 100%!',
    },
    {
      name: 'Marie Lefebvre',
      role: 'DRH',
      company: 'TechCorp',
      image: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=150',
      rating: 5,
      text: 'Nous utilisons iDoc pour tous nos contrats de travail et documents RH. L\'équipe gagne un temps fou et les documents sont toujours conformes. Excellent service!',
    },
    {
      name: 'Ahmed Benali',
      role: 'Entrepreneur',
      company: 'StartupLab',
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
      rating: 5,
      text: 'J\'ai lancé ma startup sans avocat grâce à iDoc. Les documents sont clairs, professionnels et m\'ont permis d\'économiser des milliers d\'euros en frais juridiques.',
    },
    {
      name: 'Isabelle Rousseau',
      role: 'Consultante Immigration',
      company: 'ImmigrationPro',
      image: 'https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg?auto=compress&cs=tinysrgb&w=150',
      rating: 5,
      text: 'Les templates d\'immigration sont d\'une qualité exceptionnelle. Mes clients obtiennent leurs visas plus rapidement grâce aux documents parfaitement rédigés.',
    },
    {
      name: 'Jean-Pierre Durand',
      role: 'Gérant de Propriétés',
      company: 'Immo Services',
      image: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150',
      rating: 5,
      text: 'Je gère 50+ propriétés et iDoc me fait gagner un temps précieux sur les baux, états des lieux et documents locatifs. Indispensable pour mon activité!',
    },
  ];

  const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => (
    <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow">
      <div className="flex items-center mb-4">
        {[...Array(testimonial.rating)].map((_, i) => (
          <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
        ))}
      </div>

      <div className="relative mb-6">
        <Quote className="absolute -top-2 -left-2 w-8 h-8 text-blue-100" />
        <p className="text-gray-700 leading-relaxed pl-6">{testimonial.text}</p>
      </div>

      <div className="flex items-center">
        <img
          src={testimonial.image}
          alt={testimonial.name}
          className="w-12 h-12 rounded-full mr-4 object-cover"
        />
        <div>
          <p className="font-semibold text-gray-900">{testimonial.name}</p>
          <p className="text-sm text-gray-600">
            {testimonial.role} • {testimonial.company}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Ils nous font confiance
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Plus de 10 000 professionnels utilisent iDoc chaque jour pour créer
            leurs documents juridiques
          </p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16 text-center">
          <div>
            <div className="text-4xl font-bold text-blue-600 mb-2">10 000+</div>
            <div className="text-gray-600">Utilisateurs actifs</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-green-600 mb-2">500 000+</div>
            <div className="text-gray-600">Documents générés</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-purple-600 mb-2">4.9/5</div>
            <div className="text-gray-600">Note moyenne</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-orange-600 mb-2">99%</div>
            <div className="text-gray-600">Satisfaction client</div>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} testimonial={testimonial} />
          ))}
        </div>

        {/* Trust Badges */}
        <div className="mt-16 text-center">
          <p className="text-sm text-gray-500 mb-6">Ils nous ont fait confiance</p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-60">
            <div className="text-2xl font-bold text-gray-400">TechCorp</div>
            <div className="text-2xl font-bold text-gray-400">StartupLab</div>
            <div className="text-2xl font-bold text-gray-400">ImmigrationPro</div>
            <div className="text-2xl font-bold text-gray-400">Cabinet Martin</div>
            <div className="text-2xl font-bold text-gray-400">Immo Services</div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <button className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl">
            Rejoignez des milliers d'utilisateurs satisfaits
          </button>
        </div>
      </div>
    </section>
  );
}
