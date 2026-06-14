import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import { EventsProvider } from './contexts/EventsContext';

// Loading fallback component
function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
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
const EventnicEventManagementPlatform = lazy(() => import('./pages/EventnicEventManagementPlatform'));
const EventOverviewAnalyticsEventnic = lazy(() => import('./pages/EventOverviewAnalyticsEventnic'));
const ExploreEventsEventnic = lazy(() => import('./pages/ExploreEventsEventnic'));
const ForgotPasswordEventnic = lazy(() => import('./pages/ForgotPasswordEventnic'));
const HelpCenterEventnic = lazy(() => import('./pages/HelpCenterEventnic'));
const HomeEventnic = lazy(() => import('./pages/HomeEventnic'));
const LoginEventnic = lazy(() => import('./pages/LoginEventnic'));
const MyTicketsEventnic = lazy(() => import('./pages/MyTicketsEventnic'));
const OrganizerDashboardEventnic = lazy(() => import('./pages/OrganizerDashboardEventnic'));
const PaymentSuccessfulEventnic = lazy(() => import('./pages/PaymentSuccessfulEventnic'));
const PayoutSettingsEventnic = lazy(() => import('./pages/PayoutSettingsEventnic'));
const PricingEventnic = lazy(() => import('./pages/PricingEventnic'));
const PrivacyPolicyEventnic = lazy(() => import('./pages/PrivacyPolicyEventnic'));
const RefundPolicyEventnic = lazy(() => import('./pages/RefundPolicyEventnic'));
const PaymentFailedEventnic = lazy(() => import('./pages/PaymentFailedEventnic'));
const TicketLookupEventnic = lazy(() => import('./pages/TicketLookupEventnic'));
const PublicEventPageTechpulseGlobal2024 = lazy(() => import('./pages/PublicEventPageTechpulseGlobal2024'));
const SignupEventnic = lazy(() => import('./pages/SignupEventnic'));
const TermsOfServiceEventnic = lazy(() => import('./pages/TermsOfServiceEventnic'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const NomineeDashboard = lazy(() => import('./pages/nominee/NomineeDashboard'));
const AdminUserManagement = lazy(() => import('./pages/admin/AdminUserManagement'));
const AdminEventModeration = lazy(() => import('./pages/admin/AdminEventModeration'));
const OrganizerEmailBroadcasts = lazy(() => import('./pages/organizer/OrganizerEmailBroadcasts'));
const OrganizerCheckInScanner = lazy(() => import('./pages/organizer/OrganizerCheckInScanner'));
const NomineeVoteResults = lazy(() => import('./pages/nominee/NomineeVoteResults'));

function Layout() {
  const location = useLocation();
  const hideHeaderFooter = ['/login', '/signup', '/forgot-password'].includes(location.pathname);

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
            <Route path="/events" element={<ExploreEventsEventnic />} />
            <Route path="/pricing" element={<PricingEventnic />} />
            <Route path="/login" element={<LoginEventnic />} />
            <Route path="/signup" element={<SignupEventnic />} />
            <Route path="/forgot-password" element={<ForgotPasswordEventnic />} />
            <Route path="/event/:slug" element={<PublicEventPageTechpulseGlobal2024 />} />
            <Route path="/checkout" element={<CheckoutEventnic />} />
            <Route path="/payment-success" element={<PaymentSuccessfulEventnic />} />
            <Route path="/payment-failed" element={<PaymentFailedEventnic />} />
            <Route path="/ticket-lookup" element={<TicketLookupEventnic />} />
            <Route path="/my-tickets" element={<MyTicketsEventnic />} />
            <Route path="/help" element={<HelpCenterEventnic />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyEventnic />} />
            <Route path="/refund-policy" element={<RefundPolicyEventnic />} />
            <Route path="/terms-of-service" element={<TermsOfServiceEventnic />} />
            <Route path="/eventnic-platform" element={<EventnicEventManagementPlatform />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminUserManagement /></ProtectedRoute>} />
            <Route path="/admin/moderation" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminEventModeration /></ProtectedRoute>} />

            {/* Organizer Routes */}
            <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['ORGANIZER', 'ADMIN']}><OrganizerDashboardEventnic /></ProtectedRoute>} />
            <Route path="/create-event/basic-info" element={<ProtectedRoute allowedRoles={['ORGANIZER', 'ADMIN']}><CreateEventBasicInfoEventnic /></ProtectedRoute>} />
            <Route path="/create-event/tickets" element={<ProtectedRoute allowedRoles={['ORGANIZER', 'ADMIN']}><CreateEventTicketsEventnic /></ProtectedRoute>} />
            <Route path="/create-event/schedule" element={<ProtectedRoute allowedRoles={['ORGANIZER', 'ADMIN']}><CreateEventScheduleEventnic /></ProtectedRoute>} />
            <Route path="/create-event/review" element={<ProtectedRoute allowedRoles={['ORGANIZER', 'ADMIN']}><CreateEventReviewEventnic /></ProtectedRoute>} />
            <Route path="/event-analytics" element={<ProtectedRoute allowedRoles={['ORGANIZER', 'ADMIN']}><EventOverviewAnalyticsEventnic /></ProtectedRoute>} />
            <Route path="/event-attendees" element={<ProtectedRoute allowedRoles={['ORGANIZER', 'ADMIN']}><AttendeeListOrdersEventnic /></ProtectedRoute>} />
            <Route path="/payout-settings" element={<ProtectedRoute allowedRoles={['ORGANIZER', 'ADMIN']}><PayoutSettingsEventnic /></ProtectedRoute>} />
            <Route path="/organizer/broadcasts" element={<ProtectedRoute allowedRoles={['ORGANIZER', 'ADMIN']}><OrganizerEmailBroadcasts /></ProtectedRoute>} />
            <Route path="/organizer/scanner" element={<ProtectedRoute allowedRoles={['ORGANIZER', 'ADMIN']}><OrganizerCheckInScanner /></ProtectedRoute>} />

            {/* Nominee Routes */}
            <Route path="/nominee" element={<ProtectedRoute allowedRoles={['NOMINEE']}><NomineeDashboard /></ProtectedRoute>} />
            <Route path="/nominee/results" element={<ProtectedRoute allowedRoles={['NOMINEE']}><NomineeVoteResults /></ProtectedRoute>} />

            {/* 404 */}
            <Route path="*" element={<Page404PageNotFoundEventnic />} />
          </Routes>
        </Suspense>
      </div>
      {!hideHeaderFooter && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <EventsProvider>
          <Layout />
        </EventsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
