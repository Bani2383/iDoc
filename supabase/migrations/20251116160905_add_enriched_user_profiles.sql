/*
  # Profils Utilisateur Enrichis (Phase 0)

  1. Modifications
    - Ajout de champs professionnels au profil utilisateur
    - Ajout de champs d'adresse pour pré-remplissage automatique
    - Ajout de données personnelles pour SmartFill

  2. Nouveaux Champs
    - `professional_status` : Statut professionnel (Employé, Indépendant, etc.)
    - `profession` : Titre du poste / profession
    - `housing_status` : Statut de logement (Propriétaire, Locataire, etc.)
    - `company_name` : Nom de l'employeur/entreprise
    - `address_line1` : Adresse ligne 1
    - `address_line2` : Adresse ligne 2
    - `city` : Ville
    - `postal_code` : Code postal
    - `country` : Pays (défaut: Canada)
    - `phone` : Téléphone
    - `birth_date` : Date de naissance

  3. Sécurité
    - Champs accessibles uniquement par le propriétaire du profil
    - Politiques RLS existantes s'appliquent
*/

-- Add new columns to user_profiles table
DO $$
BEGIN
  -- Professional information
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'professional_status') THEN
    ALTER TABLE user_profiles ADD COLUMN professional_status TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'profession') THEN
    ALTER TABLE user_profiles ADD COLUMN profession TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'housing_status') THEN
    ALTER TABLE user_profiles ADD COLUMN housing_status TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'company_name') THEN
    ALTER TABLE user_profiles ADD COLUMN company_name TEXT;
  END IF;

  -- Address information
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'address_line1') THEN
    ALTER TABLE user_profiles ADD COLUMN address_line1 TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'address_line2') THEN
    ALTER TABLE user_profiles ADD COLUMN address_line2 TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'city') THEN
    ALTER TABLE user_profiles ADD COLUMN city TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'postal_code') THEN
    ALTER TABLE user_profiles ADD COLUMN postal_code TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'country') THEN
    ALTER TABLE user_profiles ADD COLUMN country TEXT DEFAULT 'Canada';
  END IF;

  -- Personal information
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'phone') THEN
    ALTER TABLE user_profiles ADD COLUMN phone TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'birth_date') THEN
    ALTER TABLE user_profiles ADD COLUMN birth_date DATE;
  END IF;
END $$;

-- Add comment to document the purpose
COMMENT ON COLUMN user_profiles.professional_status IS 'Professional status: Employé, Indépendant, Étudiant, Retraité, Autre';
COMMENT ON COLUMN user_profiles.housing_status IS 'Housing status: Propriétaire, Locataire, Hébergé, Autre';