import { type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import Overview from '@/pages/overview';
import RecordsPage from '@/pages/records';
import { AppShell } from '@/components/hospital-ui';
import { HospitalStore } from '@/lib/hospital-store';
import { useGetDashboard, useGetDepartment, useGetDoctor, useGetPatient, useGetAppointment, useListDepartments, useListDoctors, useListPatients, useListAppointments } from '@workspace/api-client-react';
import {
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';

const queryClient = new QueryClient();

function ApiBridge() {
  useGetDashboard({ query: { staleTime: 60000, retry: false, queryKey: ['/api/dashboard'] } });
  useListDepartments({ query: { staleTime: 60000, retry: false, queryKey: ['/api/departments'] } });
  useListDoctors({ query: { staleTime: 60000, retry: false, queryKey: ['/api/doctors'] } });
  useListPatients({ query: { staleTime: 60000, retry: false, queryKey: ['/api/patients'] } });
  useListAppointments({ query: { staleTime: 60000, retry: false, queryKey: ['/api/appointments'] } });
  useGetDepartment(0, { query: { enabled: false, queryKey: ['/api/departments/0'] } });
  useGetDoctor(0, { query: { enabled: false, queryKey: ['/api/doctors/0'] } });
  useGetPatient(0, { query: { enabled: false, queryKey: ['/api/patients/0'] } });
  useGetAppointment(0, { query: { enabled: false, queryKey: ['/api/appointments/0'] } });
  return null;
}

function Router() {
  return (
    // Keep a shared shell (sidebar, navbar) outside the boundary so it
    // survives a page crash.
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Overview} />
        <Route path="/departments"><RecordsPage mode="departments" /></Route>
        <Route path="/doctors"><RecordsPage mode="doctors" /></Route>
        <Route path="/patients"><RecordsPage mode="patients" /></Route>
        <Route path="/appointments"><RecordsPage mode="appointments" /></Route>
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <HospitalStore>
            <ApiBridge />
            <AppShell><Router /></AppShell>
          </HospitalStore>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
