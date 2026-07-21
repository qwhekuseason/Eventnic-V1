import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import { EventsProvider } from './contexts/EventsContext';
import { MarketplaceProvider } from './contexts/MarketplaceContext';
import { NominationsProvider } from './contexts/NominationsContext';
import { ThemeProvider } from './contexts/ThemeContext';
// Loading fallback component
function LoadingFallback() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 w-24 h-24 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
        <div className="w-16 h-16 border-4 border-surface-variant border-t-primary rounded-full animate-spin relative z-10"></div>
        <img src="/eventnic.png" alt="Eventnic" className="absolute w-8 h-8 object-contain z-20 animate-pulse opacity-50" style={{ filter: 'brightness(0) saturate(100%) invert(21%) sepia(85%) saturate(2258%) hue-rotate(248deg) brightness(85%) contrast(101%)' }} />
      </div>
      <p className="mt-lg font-label-md text-primary tracking-widest uppercase animate-pulse">Loading Eventnic...</p>
    </div>
  );
}

// Lazy load all page components
const Page404PageNotFoundEventnic = lazy(() => import('./pages/Page404PageNotFoundEventnic'));
const AboutEventnic = lazy(() => import('./pages/AboutEventnic'));
const AttendeeListOrdersEventnic = lazy(() => import('./pages/AttendeeListOrdersEventnic'));
const CheckoutEventnic = lazy(() => import('./pages/CheckoutEventnic'));
const ContactEventnic = lazy(() => import('./pages/ContactEventnic'));
const CreateEventBasicInfoEventnic = lazy(() => import('./pages/CreateEventBasicInfoEventnic'));
const CreateEventReviewEventnic = lazy(() => import('./pages/CreateEventReviewEventnic'));
const CreateEventScheduleEventnic = lazy(() => import('./pages/CreateEventScheduleEventnic'));
const CreateEventTicketsEventnic = lazy(() => import('./pages/CreateEventTicketsEventnic'));
const EditEventEventnic = lazy(() => import('./pages/EditEventEventnic'));
const EventnicEventManagementPlatform = lazy(() => import('./pages/EventnicEventManagementPlatform'));
const EventOverviewAnalyticsEventnic = lazy(() => import('./pages/EventOverviewAnalyticsEventnic'));
const ExploreEventsEventnic = lazy(() => import('./pages/ExploreEventsEventnic'));
const ForgotPasswordEventnic = lazy(() => import('./pages/ForgotPasswordEventnic'));
const HelpCenterEventnic = lazy(() => import('./pages/HelpCenterEventnic'));
const HomeEventnic = lazy(() => import('./pages/HomeEventnic'));
const LoginEventnic = lazy(() => import('./pages/LoginEventnic'));
const MyTicketsEventnic = lazy(() => import('./pages/MyTicketsEventnic'));
const PricingEventnic = lazy(() => import('./pages/PricingEventnic'));
const TicketingEventnic = lazy(() => import('./pages/TicketingEventnic'));
const OrganizerDashboardEventnic = lazy(() => import('./pages/OrganizerDashboardEventnic'));
const PaymentSuccessfulEventnic = lazy(() => import('./pages/PaymentSuccessfulEventnic'));
const PayoutSettingsEventnic = lazy(() => import('./pages/PayoutSettingsEventnic'));
const AccountSettingsEventnic = lazy(() => import('./pages/AccountSettingsEventnic'));

const PrivacyPolicyEventnic = lazy(() => import('./pages/PrivacyPolicyEventnic'));
const RefundPolicyEventnic = lazy(() => import('./pages/RefundPolicyEventnic'));
const PaymentFailedEventnic = lazy(() => import('./pages/PaymentFailedEventnic'));
const TicketLookupEventnic = lazy(() => import('./pages/TicketLookupEventnic'));
const PublicEventPage = lazy(() => import('./pages/PublicEventPage'));
const PublicVotingPage = lazy(() => import('./pages/PublicVotingPage'));
const PublicNomineeVotingPage = lazy(() => import('./pages/PublicNomineeVotingPage'));
const SignupEventnic = lazy(() => import('./pages/SignupEventnic'));
const SignupVerificationEventnic = lazy(() => import('./pages/SignupVerificationEventnic'));
const TermsOfServiceEventnic = lazy(() => import('./pages/TermsOfServiceEventnic'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const NomineeDashboard = lazy(() => import('./pages/nominee/NomineeDashboard'));
const AdminUserManagement = lazy(() => import('./pages/admin/AdminUserManagement'));
const AdminEventModeration = lazy(() => import('./pages/admin/AdminEventModeration'));
const OrganizerEmailBroadcasts = lazy(() => import('./pages/organizer/OrganizerEmailBroadcasts'));
const OrganizerCheckInScanner = lazy(() => import('./pages/organizer/OrganizerCheckInScanner'));
const OrganizerNominations = lazy(() => import('./pages/organizer/OrganizerNominations'));
const MarketplaceListingManager = lazy(() => import('./pages/organizer/MarketplaceListingManager'));
const NomineeVoteResults = lazy(() => import('./pages/nominee/NomineeVoteResults'));
const PublicNominationForm = lazy(() => import('./pages/PublicNominationForm'));
const Marketplace = lazy(() => import('./pages/Marketplace'));
const VoterDashboard = lazy(() => import('./pages/VoterDashboard'));
const AdminTransactions = lazy(() => import('./pages/admin/AdminTransactions'));
const OrganizerTransactions = lazy(() => import('./pages/organizer/OrganizerTransactions'));
const SettingsEventnic = lazy(() => import('./pages/SettingsEventnic'));

function Layout() {
  const location = useLocation();
  const hideHeaderFooter = ['/login', '/signup', '/signup/verification', '/forgot-password'].includes(location.pathname);

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col w-full">
      {!hideHeaderFooter && <Header />}
      <div className="flex-grow flex flex-col w-full">
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomeEventnic />} />
            <Route path="/about" element={<AboutEventnic />} />
            <Route path="/contact" element={<ContactEventnic />} />
            <Route path="/explore" element={<ExploreEventsEventnic />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/pricing" element={<PricingEventnic />} />
            <Route path="/ticketing" element={<TicketingEventnic />} />
            <Route path="/checkout" element={<CheckoutEventnic />} />

            <Route path="/login" element={<LoginEventnic />} />
            <Route path="/signup" element={<SignupEventnic />} />
            <Route path="/signup/verification" element={<SignupVerificationEventnic />} />
            <Route path="/forgot-password" element={<ForgotPasswordEventnic />} />
            <Route path="/event/:slug" element={<PublicEventPage />} />
            <Route path="/event/:slug/vote" element={<PublicVotingPage />} />
            <Route path="/event/:slug/vote/:categoryId/:nomineeId" element={<PublicNomineeVotingPage />} />
            <Route path="/payment-success" element={<PaymentSuccessfulEventnic />} />
            <Route path="/payment-failed" element={<PaymentFailedEventnic />} />
            <Route path="/ticket-lookup" element={<TicketLookupEventnic />} />
            <Route path="/my-tickets" element={<MyTicketsEventnic />} />
            <Route path="/event/:slug/nominate" element={<PublicNominationForm />} />
            <Route path="/help" element={<HelpCenterEventnic />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyEventnic />} />
            <Route path="/refund-policy" element={<RefundPolicyEventnic />} />
            <Route path="/terms-of-service" element={<TermsOfServiceEventnic />} />
            <Route path="/eventnic-platform" element={<EventnicEventManagementPlatform />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminUserManagement /></ProtectedRoute>} />
            <Route path="/admin/moderation" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminEventModeration /></ProtectedRoute>} />
            <Route path="/admin/transactions" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminTransactions /></ProtectedRoute>} />

            {/* Organizer Routes */}
            <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['ORGANIZER', 'ADMIN']}><OrganizerDashboardEventnic /></ProtectedRoute>} />
            <Route path="/create-event/basic-info" element={<ProtectedRoute allowedRoles={['ORGANIZER', 'ADMIN']}><CreateEventBasicInfoEventnic /></ProtectedRoute>} />
            <Route path="/create-event/tickets" element={<ProtectedRoute allowedRoles={['ORGANIZER', 'ADMIN']}><CreateEventTicketsEventnic /></ProtectedRoute>} />
            <Route path="/create-event/schedule" element={<ProtectedRoute allowedRoles={['ORGANIZER', 'ADMIN']}><CreateEventScheduleEventnic /></ProtectedRoute>} />
            <Route path="/create-event/review" element={<ProtectedRoute allowedRoles={['ORGANIZER', 'ADMIN']}><CreateEventReviewEventnic /></ProtectedRoute>} />
            <Route path="/event-analytics" element={<ProtectedRoute allowedRoles={['ORGANIZER', 'ADMIN']}><EventOverviewAnalyticsEventnic /></ProtectedRoute>} />
            <Route path="/event/:slug/edit" element={<ProtectedRoute allowedRoles={['ORGANIZER', 'ADMIN']}><EditEventEventnic /></ProtectedRoute>} />
            <Route path="/event-attendees" element={<ProtectedRoute allowedRoles={['ORGANIZER', 'ADMIN']}><AttendeeListOrdersEventnic /></ProtectedRoute>} />
            <Route path="/payout-settings" element={<ProtectedRoute allowedRoles={['ORGANIZER', 'ADMIN']}><PayoutSettingsEventnic /></ProtectedRoute>} />
            <Route path="/organizer/broadcasts" element={<ProtectedRoute allowedRoles={['ORGANIZER', 'ADMIN']}><OrganizerEmailBroadcasts /></ProtectedRoute>} />
            <Route path="/organizer/scanner" element={<ProtectedRoute allowedRoles={['ORGANIZER', 'ADMIN']}><OrganizerCheckInScanner /></ProtectedRoute>} />
            <Route path="/organizer/nominations" element={<ProtectedRoute allowedRoles={['ORGANIZER', 'ADMIN']}><OrganizerNominations /></ProtectedRoute>} />
            <Route path="/organizer/marketplace" element={<ProtectedRoute allowedRoles={['ORGANIZER', 'ADMIN']}><MarketplaceListingManager /></ProtectedRoute>} />
            <Route path="/organizer/transactions" element={<ProtectedRoute allowedRoles={['ORGANIZER', 'ADMIN']}><OrganizerTransactions /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute allowedRoles={['ORGANIZER', 'ADMIN', 'NOMINEE', 'VOTER']}><SettingsEventnic /></ProtectedRoute>} />
            <Route path="/settings/account" element={<ProtectedRoute allowedRoles={['ORGANIZER', 'ADMIN', 'NOMINEE', 'VOTER']}><AccountSettingsEventnic /></ProtectedRoute>} />
            <Route path="/settings/payout" element={<ProtectedRoute allowedRoles={['ORGANIZER', 'ADMIN']}><PayoutSettingsEventnic /></ProtectedRoute>} />
            <Route path="/payout-settings" element={<ProtectedRoute allowedRoles={['ORGANIZER', 'ADMIN']}><PayoutSettingsEventnic /></ProtectedRoute>} />

            {/* Voter Routes */}
            <Route path="/voter-dashboard" element={<ProtectedRoute allowedRoles={['VOTER']}><VoterDashboard /></ProtectedRoute>} />

            {/* Nominee Routes */}
            <Route path="/nominee" element={<ProtectedRoute allowedRoles={['NOMINEE']}><NomineeDashboard /></ProtectedRoute>} />
            <Route path="/nominee/results" element={<ProtectedRoute allowedRoles={['NOMINEE']}><NomineeVoteResults /></ProtectedRoute>} />

            {/* 404 */}
            <Route path="*" element={<Page404PageNotFoundEventnic />} />
          </Routes>
        </Suspense>
      </div>
      {!hideHeaderFooter && <Footer />}
      <Toaster position="bottom-right" />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <EventsProvider>
            <MarketplaceProvider>
              <NominationsProvider>
                <Layout />
              </NominationsProvider>
            </MarketplaceProvider>
          </EventsProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}
