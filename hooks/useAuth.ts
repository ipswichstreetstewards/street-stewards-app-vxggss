
import { useEffect, useState } from 'react';
import { supabase } from '@/app/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { router } from 'expo-router';

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session:', session?.user?.id);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('Auth state changed:', _event, session?.user?.id);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    console.log('Signing out');
    await supabase.auth.signOut();
    router.replace('/(auth)/login');
  };

  return {
    session,
    user,
    loading,
    signOut,
  };
}
