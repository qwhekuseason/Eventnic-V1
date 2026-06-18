# Eventnic QA Report

## Test environment
- App run locally from `frontend` on `http://localhost:5173`
- Admin login used: `admin@eventnic.com` / `eventn1c26`
- Tested on the running dev server with the current source code and Firebase config present in `frontend/src/config/firebase.ts`

## Summary
- Admin login succeeded and the `/admin` routes were accessible.
- Core public and admin pages render.
- The organizer event creation flow pages are present and navigable.
- Important live data flows are impaired by Firebase permission issues.
- Nominee and voter-specific routes could not be fully validated with the admin account.

## Key issues found

### 1. Firebase permission issues
- The browser console shows repeated errors:
  - `FirebaseError: [code=permission-denied]: Missing or insufficient permissions.`
- These errors appear when the app tries to listen to the `events` collection and likely affect live event data loading.
- This will block published event listings, analytics, attendee lists, and voting data if permissions are not fixed.

### 2. Route and access observation
- Admin pages accessible:
  - `/admin`
  - `/admin/users`
  - `/admin/moderation`
  - `/admin/transactions`
- Organizer pages accessible to admin:
  - `/dashboard`
  - `/create-event/basic-info`
  - `/create-event/tickets`
  - `/create-event/schedule`
  - `/create-event/review`
  - `/event-analytics`
  - `/event-attendees`
  - `/payout-settings`
  - `/organizer/broadcasts`
  - `/organizer/scanner`
  - `/organizer/nominations`
  - `/organizer/marketplace`
  - `/organizer/transactions`
- Public pages accessible:
  - `/`
  - `/about`
  - `/contact`
  - `/explore`
  - `/marketplace`
  - `/checkout`
  - `/login`
  - `/signup`
  - `/forgot-password`
  - `/help`
  - `/privacy-policy`
  - `/refund-policy`
  - `/terms-of-service`
  - `/eventnic-platform`
- 404 handling works via `/non-existent-test`.

### 3. Event-specific routes and data gaps
- `/event/test-event` returned the app's "Event not found" page.
- `/event/test-event/nominate` also returned "Event not found".
- These are expected when no published event with that slug exists, but it means the public event page and nomination path were not tested with live event data.

### 4. Signup / nominee / voter flows
- `/nominee` and `/nominee/results` redirected away when using the admin account.
- `/voter-dashboard` also redirected to admin because the current user role is `ADMIN`.
- A separate nominee or voter account is required to test these flows end-to-end.

### 5. UI and React warnings
- Console warnings observed:
  - `Invalid DOM property '%s'. Did you mean '%s'? viewbox viewBox`
  - `You provided a value prop to a form field without an onChange handler...`
- These warnings indicate some JSX components have invalid SVG props or controlled inputs missing handlers.
- The warnings should be cleaned before production.

### 6. Loading state issues
- Some routes showed the `Loading session...` placeholder during navigation:
  - `/`
  - `/checkout`
  - `/help`
  - `/eventnic-platform`
  - `/payout-settings`
  - `/organizer/marketplace`
- This may indicate auth/session resolution is taking extra time or is not being handled smoothly in those views.

### 7. Event creation flow notes
- `Create Event` step pages are present and usable:
  - Basic Info
  - Tickets
  - Schedule
  - Review
- The multi-step form is implemented in the UI.
- Automated testing had trouble selecting some dropdowns with the current selectors, but the pages render and the required fields are visible.
- The actual publish flow was not completed because the test did not have a confirmed published event or deep validation of Firestore write permissions.

### 8. Marketplace and live data pages
- `/marketplace` loaded, but some data-driven pages may be empty until real marketplace listings exist.
- `/event-analytics` loaded but showed "No event selected," so the analytics panel is present but data dependent.

## Recommendations before launch
1. Fix Firestore security rules and access checks
   - Resolve the `permission-denied` errors for reads on `events`, `votes`, and related collections.
   - Ensure authenticated admin/organizer users can access only the data they should.
2. Add user accounts for test roles
   - Create a nominee account and a voter account for end-to-end testing.
   - Ensure role-based pages are validated with the correct role.
3. Verify event publish flow end-to-end
   - Publish a sample event, then test the public event page, ticket checkout, nomination page, voting flow, and attendee list.
4. Clean React warnings
   - Fix invalid SVG props and controlled input usage.
5. Validate protected route behavior
   - Confirm deep links to role-restricted pages show a clear message or redirect with explanation.
6. Confirm file upload and checkout flows
   - Test cover image upload on event creation.
   - Test checkout payment flow and ticket issuance.

## Notes
- The admin login worked.
- The app allowed admin access to organizer pages, which is correct for the current role design.
- The public event and nomination routes require live event data to validate fully.
- This report focuses on what was visible and reproducible in the running app; unresolved issues are mostly data/auth related rather than purely UI.
