# Packtok QA Testing Guide
**Version 1.0** | Last Updated: December 12, 2024
**Prepared by:** Nikhil Sahni

---

## Overview

This document covers all testable features for the Packtok platform. The platform has two main interfaces:
- **Customer Website:** https://packtok.com
- **Admin Panel:** https://admin.packtok.com

---

## 1. Authentication Module

### 1.1 User Sign Up (Customer)
**URL:** https://packtok.com/auth/signup

| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| Valid signup | Fill name, email, phone (optional), country, password (8+ chars with upper, lower, number), agree to terms → Submit | Success message, redirects to OTP verification page |
| Password validation | Try password "test123" | Error: must contain uppercase |
| Password validation | Try password "TEST123" | Error: must contain lowercase |
| Password validation | Try password "Test" | Error: minimum 8 characters |
| Duplicate email | Use already registered email | Error: email already exists |
| Terms unchecked | Leave "agree to terms" unchecked | Error: must agree to terms |

### 1.2 OTP Verification
**URL:** https://packtok.com/auth/verify-otp?email=test@example.com

| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| Valid OTP | Enter 6-digit OTP from email | Success, redirects to signin |
| Invalid OTP | Enter wrong 6-digit code | Error message |
| Expired OTP | Wait 10+ minutes, enter OTP | Error: OTP expired |

### 1.3 User Sign In
**URL:** https://packtok.com/auth/signin

| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| Valid login | Enter valid email + password | Success, redirects to home |
| Invalid password | Enter wrong password | Error: invalid credentials |
| Non-existent user | Enter unregistered email | Error: user not found |
| Remember me | Check "remember me", login, close browser, reopen | Session persists |

### 1.4 Forgot Password
**URL:** https://packtok.com/auth/forgot-password

| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| Request OTP | Enter registered email → Submit | OTP sent, shows password reset form |
| Reset password | Enter OTP + new password + confirm password | Success, redirects to signin |
| Password mismatch | Enter different passwords | Error: passwords don't match |
| Invalid OTP | Enter wrong OTP | Error message |

### 1.5 Vendor Registration
**URL:** https://packtok.com/auth/vendor/signup

| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| Vendor signup | Fill all fields including company name (optional), notes → Submit | Success, pending admin approval |

---

## 2. Marketplace Module

### 2.1 Browse Products
**URL:** https://packtok.com/marketplace

| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| View categories | Navigate to marketplace | Categories displayed: Machinery, Spare Parts, Consumables, Raw Materials |
| Filter by category | Click on a category | Products filtered by that category |
| Filter by condition | Select "New" or "Used" | Filtered results |
| Filter by price | Set min/max price | Filtered results |
| Search products | Enter search term | Matching products shown |

### 2.2 Product Details
**URL:** https://packtok.com/marketplace/[category]/[productId]

| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| View product | Click on any product | Product page with images, price, specs, description |
| Image gallery | Click on product images | Image zoom/gallery opens |
| Download specs PDF | Click "Download Specifications" (if available) | PDF downloads |
| Video preview | Click video thumbnail (if available) | Video plays |

### 2.3 Quote Request
**URL:** Product detail page → "Request Quote" button

| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| Request quote (logged in) | Click "Request Quote" → Fill form → Submit | Success message, quote submitted |
| Request quote (logged out) | Click "Request Quote" | Redirects to signin page |
| Form validation | Submit with empty required fields | Validation errors shown |
| Fill all fields | Fill company name, phone, email, address, message | All fields accept input correctly |
| Email field | Type in email field | Email stays in email field (not company name) |

---

## 3. Services Module

### 3.1 Maintenance Service
**URL:** https://packtok.com/services/maintenance/form

| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| Submit request | Fill all required fields: maintenance type, company, address, machine details → Submit | Success modal appears |
| Required fields | Leave machine name empty | Validation error |

### 3.2 Consultancy Service
**URL:** https://packtok.com/services/consultancy/form

| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| Submit request | Fill company info, industry type, services required, goals → Submit | Success confirmation |
| Multi-select | Select multiple services and goals | All selections saved |

### 3.3 Turnkey Projects
**URL:** https://packtok.com/services/turnkey-projects/form

| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| Submit inquiry | Fill contact info, facility type, project description, timeline, budget → Submit | Success confirmation |

### 3.4 Company Acquisition
**URL:** https://packtok.com/services/investment-and-takeover/form

| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| Submit as Buyer | Select "Buyer" type, fill preferred business details | Form adjusts for buyer fields |
| Submit as Seller | Select "Seller" type, fill business description | Form adjusts for seller fields |

### 3.5 Manpower Hiring
**URL:** https://packtok.com/services/manpower-hiring/form

| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| Submit request | Fill company, manpower types needed, numbers, duration → Submit | Success confirmation |

### 3.6 Job Seeker
**URL:** https://packtok.com/services/job-seeker/form

| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| Submit profile | Fill personal info, upload CV, select position → Submit | Profile submitted |
| CV upload | Upload PDF/DOC file | File uploads successfully |

---

## 4. Auction Module

### 4.1 View Auctions
**URL:** https://packtok.com/auctions

| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| List auctions | Navigate to auctions page | All scheduled/live auctions displayed |
| Auction details | Click on an auction | Auction detail page with product, timing, current bids |

### 4.2 Enroll in Auction
**Prerequisite:** User must be logged in

| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| Enroll button | Click "Enroll" on auction | Razorpay payment modal opens |
| Test payment | Use Razorpay test card: 4111 1111 1111 1111, any future expiry, any CVV | Payment processed, enrollment confirmed |
| Payment failure | Use invalid card | Error message, enrollment not created |

### 4.3 Bidding (Live Auction)
**Prerequisite:** Must be enrolled in a LIVE auction

| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| Place bid | Enter bid amount higher than current → Submit | Bid placed, leaderboard updates in real-time |
| Invalid bid | Enter bid lower than minimum increment | Error: bid too low |
| Real-time updates | Open auction in 2 browsers, bid from one | Other browser shows new bid instantly |

---

## 5. Admin Panel

### 5.1 Admin Login
**URL:** https://admin.packtok.com

| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| Admin login | Use admin credentials | Dashboard loads |
| Invalid credentials | Wrong email/password | Error message |

### 5.2 Product Management
**URL:** https://admin.packtok.com/dashboard/products

| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| View products | Navigate to Products | All products listed with pagination |
| Add product | Click "Add Product" → Fill title, description, price, category (Machinery/Spare Parts/Consumables/Raw Materials), condition, upload images → Save | Product created |
| Edit product | Click Edit on a product → Modify details → Save | Changes saved |
| Delete product | Click Delete → Confirm | Product removed |
| Change status | Toggle status (Available/Out of Stock/Draft/Sold) | Status updated |

### 5.3 Product Submissions (Vendor)
**URL:** https://admin.packtok.com/dashboard/submissions

| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| View pending | Navigate to Submissions | List of vendor-submitted products |
| Approve submission | Click Approve | Product becomes available |
| Reject submission | Click Reject, add notes | Submission rejected |

### 5.4 Quote Requests
**URL:** https://admin.packtok.com/dashboard/quotes

| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| View quotes | Navigate to Quotes | All quote requests listed |
| View details | Click "View" on a quote | Dialog shows company, phone, email, address, message, product details |
| Update status | Mark as Reviewed/Completed/Cancelled | Status updates |
| Filter by status | Filter by Pending/Reviewed/Completed | Filtered list |
| Search | Search by company name | Matching results |

### 5.5 Service Requests
**URL:** https://admin.packtok.com/dashboard/services

| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| View all services | Navigate to Services | All service requests listed |
| Filter by type | Select Maintenance/Consultancy/Turnkey/etc | Filtered results |
| View details | Click "View" on a service | Full details dialog |
| Assign to admin | Click Assign → Select admin | Admin assigned |
| Update status | Change status (Submitted/In Review/In Progress/Completed/Cancelled) | Status updated |
| Delete request | Click Delete → Confirm | Request removed |

### 5.6 Vendor Applications
**URL:** https://admin.packtok.com/dashboard/vendors

| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| View applications | Navigate to Vendors | List of vendor applications |
| Approve vendor | Click Approve | User role changed to VENDOR |
| Reject vendor | Click Reject | Application rejected |

### 5.7 Auction Management
**URL:** https://admin.packtok.com/dashboard/auctions

| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| View auctions | Navigate to Auctions | All auctions listed |
| Create auction | Select product, set mode (Forward/Reverse), start/end time, starting amount, earnest money, bid increment | Auction created as DRAFT |
| Schedule auction | Change status to SCHEDULED | Auction scheduled |
| Start auction | Change status to LIVE | Auction goes live, bidding enabled |
| Close auction | Change status to CLOSED | Auction closes, winners determined |
| View enrollments | View enrolled users for an auction | List of enrolled users |
| View bids | View bid history | All bids with timestamps |

### 5.8 Categories
**URL:** https://admin.packtok.com/dashboard/categories

| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| Add category | Add new category with subcategories | Category created |
| Edit category | Modify category name/subcategories | Changes saved |

---

## 6. Razorpay Test Card Details

For testing payments in auction enrollment:

| Card Type | Number | Expiry | CVV |
|-----------|--------|--------|-----|
| Success | 4111 1111 1111 1111 | Any future date | Any 3 digits |
| Failure | 4000 0000 0000 0002 | Any future date | Any 3 digits |

---

## 7. Known Test Data Requirements

1. **Admin Account:** Need admin credentials from dev team
2. **Test User:** Create new account or use existing test account
3. **Products:** At least one product in each category for testing
4. **Active Auction:** At least one auction in SCHEDULED/LIVE status

---

## 8. Browser Compatibility

Test on:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (Chrome/Safari on iOS and Android)

---

## 9. Reporting Issues

When reporting bugs, include:
1. Steps to reproduce
2. Expected behavior
3. Actual behavior
4. Screenshots/screen recordings
5. Browser and device info
6. Console errors (if any)

---

**End of Testing Document**
