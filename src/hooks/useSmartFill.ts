import { useState, useEffect } from 'react';
import { supabase, UserProfile } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface SmartFillMapping {
  templateVariable: string;
  profileField: keyof UserProfile;
  transform?: (value: unknown) => string;
}

const SMART_FILL_MAPPINGS: SmartFillMapping[] = [
  { templateVariable: 'nom_complet', profileField: 'full_name' },
  { templateVariable: 'nom', profileField: 'full_name', transform: (v) => {
    const parts = String(v || '').split(' ');
    return parts.slice(1).join(' ');
  }},
  { templateVariable: 'prenom', profileField: 'full_name', transform: (v) => {
    const parts = String(v || '').split(' ');
    return parts[0] || '';
  }},
  { templateVariable: 'email', profileField: 'email' },
  { templateVariable: 'telephone', profileField: 'phone' },
  { templateVariable: 'phone', profileField: 'phone' },
  { templateVariable: 'date_naissance', profileField: 'birth_date', transform: (v) => {
    if (!v) return '';
    const date = new Date(String(v));
    return date.toLocaleDateString('fr-CA');
  }},
  { templateVariable: 'adresse_complete', profileField: 'address_line1', transform: (v) => v ? String(v) : '' },
  { templateVariable: 'adresse', profileField: 'address_line1' },
  { templateVariable: 'adresse_ligne1', profileField: 'address_line1' },
  { templateVariable: 'adresse_ligne2', profileField: 'address_line2' },
  { templateVariable: 'ville', profileField: 'city' },
  { templateVariable: 'code_postal', profileField: 'postal_code' },
  { templateVariable: 'pays', profileField: 'country' },
  { templateVariable: 'profession', profileField: 'profession' },
  { templateVariable: 'employeur', profileField: 'company_name' },
  { templateVariable: 'entreprise', profileField: 'company_name' },
  { templateVariable: 'statut_professionnel', profileField: 'professional_status' },
  { templateVariable: 'statut_logement', profileField: 'housing_status' },
];

export function useSmartFill() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadProfile();
    } else {
      setProfile(null);
      setLoading(false);
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error loading profile for SmartFill:', error);
    } finally {
      setLoading(false);
    }
  };

  const applySmartFill = (formData: Record<string, unknown>): Record<string, unknown> => {
    if (!profile) return formData;

    const filledData = { ...formData };

    SMART_FILL_MAPPINGS.forEach(({ templateVariable, profileField, transform }) => {
      if (filledData[templateVariable] === undefined || filledData[templateVariable] === '') {
        const profileValue = profile[profileField];
        if (profileValue !== null && profileValue !== undefined) {
          filledData[templateVariable] = transform ? transform(profileValue) : profileValue;
        }
      }
    });

    return filledData;
  };

  const getSmartFillValue = (variableName: string): string | null => {
    if (!profile) return null;

    const mapping = SMART_FILL_MAPPINGS.find(m => m.templateVariable === variableName);
    if (!mapping) return null;

    const profileValue = profile[mapping.profileField];
    if (profileValue === null || profileValue === undefined) return null;

    return mapping.transform ? mapping.transform(profileValue) : String(profileValue);
  };

  const isSmartFillAvailable = (variableName: string): boolean => {
    return getSmartFillValue(variableName) !== null;
  };

  const getProfileCompleteness = (): number => {
    if (!profile) return 0;

    const totalFields = 11;
    const filledFields = [
      profile.full_name,
      profile.email,
      profile.phone,
      profile.birth_date,
      profile.address_line1,
      profile.city,
      profile.postal_code,
      profile.country,
      profile.profession,
      profile.professional_status,
      profile.housing_status,
    ].filter(field => field !== null && field !== '').length;

    return Math.round((filledFields / totalFields) * 100);
  };

  return {
    profile,
    loading,
    applySmartFill,
    getSmartFillValue,
    isSmartFillAvailable,
    getProfileCompleteness,
    refreshProfile: loadProfile,
  };
}
