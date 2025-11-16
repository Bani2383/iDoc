import { useState, useEffect } from 'react';
import { supabase, Subscription } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export type UpsellTrigger = 'volume' | 'feature' | 'profile' | null;

interface UseUpsellTriggersReturn {
  shouldShowUpsell: boolean;
  triggerType: UpsellTrigger;
  dismissUpsell: () => void;
  checkVolumeLimit: (count: number) => boolean;
  checkFeatureAccess: (feature: string) => boolean;
  hasActiveSubscription: boolean;
}

const VOLUME_THRESHOLD = 5;
const UPSELL_COOLDOWN_MS = 24 * 60 * 60 * 1000;

const PRO_FEATURES = [
  'signflow',
  'docvault',
  'smartfill',
  'compliance_check',
  'proofstamp',
  'dochistory',
  'regulasmart',
  'bulksend',
  'api_access',
];

export function useUpsellTriggers(): UseUpsellTriggersReturn {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [documentCount, setDocumentCount] = useState(0);
  const [shouldShowUpsell, setShouldShowUpsell] = useState(false);
  const [triggerType, setTriggerType] = useState<UpsellTrigger>(null);

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;

    try {
      const [subResult, docsResult] = await Promise.all([
        supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .in('status', ['active', 'trialing'])
          .maybeSingle(),
        supabase
          .from('generated_documents')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id),
      ]);

      if (subResult.data) {
        setSubscription(subResult.data);
      }

      setDocumentCount(docsResult.count || 0);
    } catch (error) {
      console.error('Error loading user data for upsell:', error);
    }
  };

  const hasActiveSubscription = subscription !== null;

  const getLastDismissed = (): number | null => {
    const dismissed = localStorage.getItem('upsell_dismissed_at');
    return dismissed ? parseInt(dismissed, 10) : null;
  };

  const isInCooldown = (): boolean => {
    const lastDismissed = getLastDismissed();
    if (!lastDismissed) return false;

    const now = Date.now();
    return now - lastDismissed < UPSELL_COOLDOWN_MS;
  };

  const checkVolumeLimit = (count: number): boolean => {
    if (hasActiveSubscription) return true;
    if (isInCooldown()) return true;

    if (count >= VOLUME_THRESHOLD) {
      setTriggerType('volume');
      setShouldShowUpsell(true);
      return false;
    }

    return true;
  };

  const checkFeatureAccess = (feature: string): boolean => {
    if (hasActiveSubscription) return true;

    if (PRO_FEATURES.includes(feature)) {
      if (!isInCooldown()) {
        setTriggerType('feature');
        setShouldShowUpsell(true);
      }
      return false;
    }

    return true;
  };

  const dismissUpsell = () => {
    localStorage.setItem('upsell_dismissed_at', Date.now().toString());
    setShouldShowUpsell(false);
    setTriggerType(null);
  };

  return {
    shouldShowUpsell,
    triggerType,
    dismissUpsell,
    checkVolumeLimit,
    checkFeatureAccess,
    hasActiveSubscription,
  };
}
