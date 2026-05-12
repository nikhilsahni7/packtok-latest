# Packtok Monorepo

Packtok is a packaging and industrial commerce platform. Think of it as one system with four entry points:

- customer-facing web app for discovery, shopping, service requests, and bidding
- internal admin panel for moderation and operations
- mobile app for the same customer/vendor workflows on Expo/RN
- API that handles auth, marketplace, auctions, orders, content, notifications, and vendor tooling

If you are joining this codebase, the mental model is simple: **all product behavior lives in `apps/api`**, and every client (`web`, `admin`, `mobile`) is mostly a specialized UI over the same REST surface.

---

## What Problem This Solves

Packtok is built for industrial packaging commerce where users do more than just buy from a catalog:

- customers browse equipment, spare parts, consumables, and raw material
- vendors submit products and run their own catalogs
- both sides interact through quotes, auctions, and service workflows
- admin teams moderate listings, vendor onboarding, auctions, orders, and content

The platform combines e-commerce, lead generation, and operations tooling in one stack, instead of splitting them into separate products.

---

## Architecture Overview

### Apps and how they connect

- `apps/api` (Express + Prisma): source of truth for auth, business rules, DB access, storage, email, payments, and socket events
- `apps/web` (Next.js): customer and vendor browser experience
- `apps/admin` (Next.js): back-office dashboard
- `apps/mobile/Packtok-Main` (Expo + React Native): mobile customer/vendor app

### Data flow

1. Client app calls API at `NEXT_PUBLIC_API_BASE_URL` (web/admin) or hardcoded base URL in mobile (`lib/api.ts`).
2. API validates Supabase JWT in `authMiddleware` and resolves/creates local `User`.
3. API reads/writes PostgreSQL via Prisma (`@packtok/db`).
4. API integrates with external services as needed:
   - Supabase Auth + Storage
   - Razorpay (payments)
   - Resend (emails/OTP)
   - S3-compatible storage for podcast video
5. Auction and quote realtime updates are published over Socket.IO.

### Monorepo build/runtime tooling

- `pnpm` workspaces (`pnpm-workspace.yaml`)
- Turborepo pipelines (`turbo.json`)
- shared TS baseline (`tsconfig.base.json`)
- shared config package (`packages/config`)
- shared UI package (`packages/ui`)
- shared utilities/logger/schemas package (`packages/utils`)
- shared Prisma client package (`packages/db`)

---

## Feature Breakdown by App

### API (`apps/api`)

Core capabilities from routes/services:

- auth lifecycle: signup/login (user + vendor), OTP verify/resend, forgot password, token refresh, logout
- user profile (`/auth/me`), address book, notifications, cart, checkout flow
- marketplace: products, vendor submissions, category/subcategory management
- quotes: create, track, cancel; admin-side quote management
- auctions: enrollment, bids, payment capture, live events, periodic auction status updater
- orders: checkout/payment verification/order history + admin order operations
- vendor operations: apply flow, dashboard analytics, vendor product CRUD, subscriptions/plans
- industrial services: maintenance, consultancy, turnkey, acquisition, manpower, installer, jobseeker
- investments/properties and inquiry submission
- content: articles, podcasts/series, reactions/comments
- user-tracking: bookmarks, views, search history, recommendations, activity
- contact and email-subscription ingestion

Notable design detail: JWT verification uses `SUPABASE_JWT_SECRET` (not `JWT_SECRET`) in middleware.

### Web (`apps/web`)

Primary user-facing product:

- landing and content pages
- marketplace catalog by category + product detail + reviews
- cart + checkout with Razorpay loader
- services landing and per-service forms
- auctions list/detail with socket-driven updates
- podcasts and articles
- account area: orders, addresses, notifications, wishlist, quotes, form tracking, bidding/sell history
- vendor area: dashboard, product lifecycle (new/drafts/scheduled/released), analytics, subscription
- customer and vendor auth flows with OTP + password recovery

State/data patterns:

- React Query for server state
- Zustand for auth token/user persistence
- axios interceptors for refresh-and-retry
- `Protected` wrappers on account/vendor UI

### Admin (`apps/admin`)

Operations console:

- dashboard metrics and charts (products, quotes, orders)
- product moderation and CRUD
- auction management and detail views with realtime
- categories, submissions, vendors, customers/users
- order management and status workflows
- service request operations by service type
- investments, messages, email subscriptions, notifications
- article and podcast management

Admin auth is role-checked on the client (`ADMIN` / `SUPER_ADMIN`) and relies on API permission enforcement.

### Mobile (`apps/mobile/Packtok-Main`)

Expo app with file-based routing (`expo-router`):

- onboarding + auth selection
- customer flows: home, categories, marketplace, wishlist, cart, settings
- service forms and history
- bidding/auction screens with realtime hooks
- articles, podcasts, notifications, addresses, orders
- vendor flows: sign-in, dashboard, products, analytics, subscription

Technical note: mobile currently uses a hardcoded API base URL in `lib/api.ts` and `lib/socket.ts`.

---

## Tech Stack (and Why It Exists)

### Backend

- `express`: HTTP app and router composition
- `@prisma/client` + `prisma`: database schema/migrations/query layer
- `@packtok/db`: shared Prisma singleton and exported Prisma types across workspace
- `@supabase/supabase-js`: auth + storage operations from server side
- `jsonwebtoken`: validates Supabase access tokens
- `socket.io`: auction/quote realtime transport
- `razorpay`: order/payment workflows
- `resend`: OTP and transactional email delivery
- `multer` + `sharp`: upload parsing + media processing before storage
- `@aws-sdk/client-s3` + `s3-request-presigner`: podcast video storage and signed links
- `pino`/`pino-http`: structured logs

### Web/Admin

- `next` (App Router): UI shells and route-driven UX
- `@tanstack/react-query`: async state + caching + invalidation
- `axios`: centralized API client with refresh handling
- `zustand`: lightweight auth/UI persistence
- `react-hook-form` + `zod`: validated form handling
- `socket.io-client`: live auction/quote updates
- `@packtok/ui`: shared component primitives and styles
- `tailwindcss`: utility-first styling

### Mobile

- `expo` + `react-native`: managed native platform
- `expo-router`: file-based navigation for RN app
- `nativewind`/Tailwind: styling model aligned with web conventions
- `expo-secure-store`: secure token storage
- `@react-native-async-storage/async-storage`: persisted non-sensitive app state
- same React Query + axios + Zustand pattern as web/admin for consistency

---

## Project Structure Walkthrough

```text
.
├── apps/
│   ├── api/
│   │   ├── prisma/                    # Prisma schema + SQL migrations
│   │   └── src/
│   │       ├── config/                # Env parsing / runtime config
│   │       ├── controllers/           # HTTP handlers
│   │       ├── middlewares/           # auth/role/upload middlewares
│   │       ├── routers/               # main route modules
│   │       ├── routes/                # review route modules (legacy split)
│   │       ├── services/              # business logic by domain
│   │       ├── realtime/              # socket server + event publishing
│   │       ├── utils/                 # logger/errors/storage helpers
│   │       ├── seed.ts                # founder admin seed
│   │       ├── seed-products.ts       # product seed
│   │       └── server.ts              # app bootstrap + route mounting
│   ├── web/
│   │   ├── app/                       # Next App Router pages/layouts
│   │   ├── components/                # feature UI
│   │   ├── hooks/                     # React Query hooks
│   │   ├── lib/                       # axios/socket/auth helpers
│   │   ├── store/                     # Zustand auth store
│   │   ├── schemas/                   # zod schemas
│   │   └── contexts/                  # cart context
│   ├── admin/
│   │   ├── app/                       # dashboard routes + page modules
│   │   ├── components/                # sidebar/auth/shared components
│   │   ├── hooks/                     # admin data mutations/queries
│   │   ├── lib/                       # axios/fetch/socket/auth helpers
│   │   ├── store/                     # auth and UI stores
│   │   ├── schemas/                   # zod validation
│   │   └── constants/                 # sidebar nav + dashboard tabs
│   └── mobile/
│       └── Packtok-Main/              # actual Expo project root
│           ├── app/                   # expo-router screens/routes
│           ├── components/            # reusable RN UI
│           ├── hooks/                 # api/query/auth hooks
│           ├── lib/                   # axios/socket + token helpers
│           ├── store/                 # auth store
│           └── providers/             # Query provider
├── packages/
│   ├── config/                        # shared lint/prettier settings
│   ├── db/                            # shared Prisma singleton/types
│   ├── ui/                            # shared React UI primitives
│   └── utils/                         # zod/utils/logger helpers
├── turbo.json                         # task graph
├── pnpm-workspace.yaml                # workspace package globs
└── tsconfig.base.json                 # base TS settings
```

---

## Local Setup (Step-by-Step)

### 1) Prerequisites

- Node `>=18`
- pnpm `>=8` (repo pins `pnpm@9.11.0`)
- PostgreSQL running locally
- Supabase project (URL + service role + JWT secret)
- Razorpay test keys if testing checkout
- Resend key if testing OTP/email
- optional S3-compatible bucket config for podcast video

### 2) Install dependencies

```bash
pnpm install
```

### 3) Configure environment

You need API env vars first, then frontend/admin vars.

### API env (`apps/api/.env`)

Required for API boot:

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | yes | PostgreSQL connection string for Prisma. |
| `PORT` | yes (or default) | API port (`3001` if omitted). |
| `SUPABASE_URL` | yes | Supabase project URL. |
| `SUPABASE_SERVICE_ROLE_KEY` | yes | server-side Supabase auth/storage access. |
| `SUPABASE_JWT_SECRET` | yes | validates bearer JWTs in auth middleware. |
| `SUPABASE_IMAGE_BUCKET` | yes | bucket for image assets. |
| `SUPABASE_VIDEO_BUCKET` | yes | bucket for video assets. |
| `SUPABASE_DOC_BUCKET` | yes | bucket for docs/uploads. |
| `RESEND_API_KEY` | yes for OTP/email | Resend API key. |
| `RESEND_FROM_EMAIL` | yes for OTP/email | sender identity used by API. |
| `RAZORPAY_KEY_ID` | yes for payment flows | Razorpay key id. |
| `RAZORPAY_KEY_SECRET` | yes for payment flows | Razorpay secret. |
| `CORS_ORIGIN` | strongly recommended | comma-separated web/admin origins. |

Optional but used:

| Variable | Purpose |
| --- | --- |
| `JWT_SECRET` | defined in config but not currently used by request auth path. |
| `SUPABASE_BUCKET_PRIVATE` | if `true`, storage helpers prefer signed URLs. |
| `NODE_ENV` | toggles prod behaviors/cookies/log formatting. |
| `COOKIE_DOMAIN` | refresh/access cookie domain scoping. |
| `AWS_ACCESS_KEY_ID` | S3 credentials for podcast video. |
| `AWS_SECRET_ACCESS_KEY` | S3 credentials for podcast video. |
| `AWS_REGION` | S3 region. |
| `AWS_PODCAST_BUCKET` | podcast video bucket. |
| `AWS_PODCAST_PUBLIC_BASE_URL` | optional public URL base for object links. |
| `AWS_S3_ENDPOINT` | S3-compatible custom endpoint (R2/MinIO/etc.). |
| `AWS_S3_FORCE_PATH_STYLE` | path-style URL toggle. |
| `AWS_PODCAST_SIGNED_URL_EXPIRES_SECONDS` | signed URL TTL (default `3600`). |
| `PODCAST_UPLOAD_CONCURRENCY` | upload batching/concurrency for podcast service. |

### Web env (`apps/web/.env.local`)

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_API_BASE_URL` | yes | base URL for REST + socket host. |
| `NODE_ENV` | auto | used for devtools/console config branching. |

### Admin env (`apps/admin/.env.local`)

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_API_BASE_URL` | yes | base URL for REST + socket host. |
| `NEXT_PUBLIC_APP_URL` | optional/declared | present in `.env.example`, not used directly in source. |
| `NODE_ENV` | auto | devtools and prod console stripping. |

### Mobile config

No `.env` consumption for API base in current code. API URL is hardcoded in:

- `apps/mobile/Packtok-Main/lib/api.ts`
- `apps/mobile/Packtok-Main/lib/socket.ts`

If you need local API testing on mobile, change those values (or refactor to `EXPO_PUBLIC_*`).

### 4) Database + Prisma

From `apps/api`:

```bash
pnpm prisma:generate
pnpm prisma:migrate
```

Optional seed:

```bash
pnpm seed
pnpm seed:products
```

### 5) Run services in practical order

Start in separate terminals:

1. API first:

```bash
pnpm --filter @packtok/api dev
```

1. Web app:

```bash
pnpm --filter @packtok/web dev
```

1. Admin app:

```bash
pnpm --filter @packtok/admin dev -- --port 3002
```

1. Mobile app (inside `apps/mobile/Packtok-Main`):

```bash
npm install
npm run start
```

You can use root `pnpm dev` (Turbo), but both Next apps default to port 3000 unless one is explicitly moved.

---

## Scripts You’ll Actually Use

### Root

- `pnpm dev`: turbo dev graph (api + web + admin dev scripts)
- `pnpm build`: turbo build graph
- `pnpm lint`: workspace lint
- `pnpm format` / `pnpm format:check`: formatting
- `pnpm type-check`: workspace type checking
- `pnpm clean`: defined, but currently no package-level `clean` tasks

### API (`@packtok/api`)

- `pnpm --filter @packtok/api dev`
- `pnpm --filter @packtok/api build`
- `pnpm --filter @packtok/api start`
- `pnpm --filter @packtok/api prisma:generate|prisma:migrate|prisma:push`
- `pnpm --filter @packtok/api seed`
- `pnpm --filter @packtok/api seed:products`
- `pnpm --filter @packtok/api print:product -- <productId>`

### Web/Admin scripts

Both support: `dev`, `build`, `start`, `lint`, `format`, `format:check`, `type-check`.

### Mobile scripts (`apps/mobile/Packtok-Main`)

- `npm run start`
- `npm run android`
- `npm run ios`
- `npm run web`
- `npm run lint`

---

## API Overview

Base path: `/api/v1`

### Auth and identity

- `/auth/*` handles signup, login (user/vendor), OTP verification, password reset, refresh, profile (`/me`)
- access token can come from `Authorization` header or cookie
- refresh token flow is cookie + token aware depending on client path
- role model includes `NORMAL_USER`, `VENDOR`, `ADMIN`, `SUPER_ADMIN`

### Core route groups

- `/products`, `/vendors/products`: product catalog + vendor product lifecycle
- `/categories`: category/subcategory management
- `/quotes`: quote submission and tracking
- `/auctions`: enroll, bid, user auction history, payment capture
- `/cart`, `/orders`, `/addresses`: commerce lifecycle
- `/services`: multiple industrial service request types
- `/investments`: property listings and lead queries
- `/podcasts`, `/articles`: content delivery
- `/notifications`, `/user-tracking`: engagement and user activity
- `/subscriptions`: vendor plan/subscription flows
- `/contact`, `/email-subscriptions`: inbound leads/subscribers

### Admin route groups

- `/admins/*` modules for users, vendors, products, services, auctions, orders, notifications, investments, subscriptions, podcasts, articles, reviews

Healthcheck:

- `/healthcheck`

---

## Non-obvious Things Worth Knowing

- API config reads `PORT`, but root `.env.example` still mentions `API_PORT`.
- `JWT_SECRET` exists in config but runtime auth checks use `SUPABASE_JWT_SECRET`.
- `apps/api/src/routes` vs `apps/api/src/routers`: both exist; review routes are in `routes`.
- `apps/api` has an open-looking admin review router shape worth double-checking during security hardening.
- `AuctionStatusUpdater` runs on an interval in API startup and auto-finalizes auctions.
- root `pnpm dev` can cause web/admin port collision unless one app is moved.
- mobile app is not rooted at `apps/mobile`; it is `apps/mobile/Packtok-Main`.
- mobile API base URL is hardcoded; no env switching by default.
- some dependencies look unused in parts of the repo (`swagger`, `zod`, `bcrypt` in api source; `react-image-gallery` in web), so dependency hygiene is a good cleanup candidate.
- `apps/api` has both `start` and `start:prod` with different output path assumptions.

---

## Quick New-Teammate Checklist

1. Get API running with real Supabase + DB first.
2. Confirm `/api/v1/healthcheck` and `/api/v1/auth/login` work.
3. Start web + admin with explicit ports.
4. Validate auth refresh flow in browser (login, refresh, protected route access).
5. Only then run mobile and point it to your API endpoint.

If something feels weird, check env names and ports first. Most “app is broken” reports here are config mismatch, not code regressions.

---

## Route and Component Index

This section is intentionally direct: it tells you where route and UI definitions actually live.

### API route module index

`apps/api/src/server.ts` mounts these router modules:

- `auth.routes.ts`
- `admin.routes.ts`
- `article.routes.ts`
- `product.routes.ts`
- `vendor.products.routes.ts`
- `quote.routes.ts`
- `category.routes.ts`
- `auction.routes.ts`
- `service.routes.ts`
- `admin.services.routes.ts`
- `admin.auctions.routes.ts`
- `admin.order.routes.ts`
- `vendor.routes.ts`
- `admin.vendors.routes.ts`
- `admin.user.routes.ts`
- `admin.article.routes.ts`
- `admin.podcast.routes.ts`
- `podcast.routes.ts`
- `user-tracking.routes.ts`
- `address.routes.ts`
- `cart.routes.ts`
- `order.routes.ts`
- `investment.routes.ts`
- `admin.investment.routes.ts`
- `notification.routes.ts`
- `admin.notification.routes.ts`
- `admin.email-subscription.routes.ts`
- `subscription.routes.ts`
- `admin.subscription.routes.ts`
- `contact.routes.ts`
- `email-subscription.routes.ts`
- plus review modules in `apps/api/src/routes`: `review.routes.ts`, `admin.review.routes.ts`

### Web app route and component index

Web route files live under `apps/web/app` (96 files currently), including:

- auth and vendor auth: `auth/*`, `auth/vendor/*`
- account suite: `account/*`
- vendor suite: `vendor/*`
- marketplace: `app/(main)/marketplace/**`
- services: `app/(main)/services/**`
- bidding: `app/(main)/bidding/**`
- podcasts/articles/contact/legal pages

Web reusable components live under `apps/web/components` (51 files currently), including:

- auth components: `components/auth/*`
- marketplace/cart/reviews: `components/cart/*`, `components/products/*`, `components/reviews/*`
- bidding widgets: `components/bidding/*`
- landing/home sections: `components/landing/**`
- common shells: `components/navbar/navbar.tsx`, `components/footer/footer.tsx`

### Admin route and component index

Admin route files live under `apps/admin/app` (83 files currently), centered around:

- auth: `app/auth/*`
- dashboard shell: `app/dashboard/layout.tsx`
- feature modules: `dashboard/products/**`, `dashboard/orders/**`, `dashboard/quotes/**`, `dashboard/services/**`, `dashboard/auctions/**`, `dashboard/customers/**`, `dashboard/categories/**`, `dashboard/vendors/**`, `dashboard/submissions/**`, `dashboard/articles/**`, `dashboard/podcasts/**`, `dashboard/notifications/**`, `dashboard/investments/**`, `dashboard/analytics/**`

Admin shared components are in `apps/admin/components`:

- `components/sidebar.tsx`
- `components/tooltip.tsx`
- `components/auth/signin-form.tsx`

### Mobile route and component index

Mobile route files live under `apps/mobile/Packtok-Main/app` (77 files currently), including:

- tabs shell: `app/(tabs)/_layout.tsx` + tab routes
- auth/onboarding: `auth-selection.tsx`, `login.tsx`, `signup-*.tsx`, `verify-otp.tsx`, `welcome*.tsx`
- marketplace: `marketplace/**`
- services: `services/**`
- vendor: `vendor/**`
- bidding: `bidding/**`
- content/support/policies: `articles*`, `podcasts*`, `help-support.tsx`, `privacy-policy.tsx`, `refund-policy.tsx`, `shipping-delivery.tsx`

Mobile shared components live under `apps/mobile/Packtok-Main/components` (24 files currently), including:

- bidding UI: `components/bidding/*`
- checkout/payments: `components/RazorpayCheckout.tsx`
- common widgets: `PageHeader.tsx`, `FloatingCartBar.tsx`, `QuoteModal.tsx`, `DropdownField.tsx`
