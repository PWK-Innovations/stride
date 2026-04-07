import { createClient } from '@/lib/supabase/server';
import DashboardShell from '@/components/features/DashboardShell';

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const completedOnboarding = user?.user_metadata?.completed_onboarding === true;

  return (
    <DashboardShell
      userEmail={user?.email ?? ''}
      userId={user?.id ?? ''}
      completedOnboarding={completedOnboarding}
    >
      {children}
    </DashboardShell>
  );
}
