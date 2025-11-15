# TourBrain User Stories & Feature Map

**Version:** 0.3.1  
**Last Updated:** November 15, 2025  
**Format:** Gherkin (Given-When-Then)  
**Status:** Production Release - Core Platform Complete with Weather Intelligence

---

## ✅ Completed Features Status

**Authentication & Multi-Tenancy:** 100% Complete  
**Venue Management:** 100% Complete  
**Artist Management:** 100% Complete  
**Tour Management:** 100% Complete  
**Show Management:** 100% Complete  
**Day Sheet Generation:** 100% Complete  
**AI Features:** 100% Complete  
**Weather Intelligence:** 100% Complete  
**Admin CRM System:** 100% Complete  
**Marketing Website:** 100% Complete  
**Database Schema:** 100% Complete

**Next Phase:** Production Polish, Design Partner Onboarding

### 🎊 Achievement: Complete Tour Operations Platform

**All core user stories are now implemented!** TourBrain provides end-to-end tour operations management:

1. **✅ User Authentication & Multi-Tenancy** - Secure organization-based access
2. **✅ Venue Management** - Professional venue database with contacts and technical specs
3. **✅ Artist Management** - Comprehensive artist roster with social media integration
4. **✅ Tour Management** - Complete tour lifecycle from planning to execution
5. **✅ Show Management** - Individual show tracking with professional day sheets
6. **✅ AI Features** - Production notes generation and tour risk analysis
7. **✅ Weather Intelligence** - Comprehensive climate scoring and outdoor venue planning
8. **✅ Admin Tools** - CRM system for waitlist management and user administration

**Result:** A production-ready platform that can replace Prism/Master Tour workflows with modern, AI-enhanced tour operations management.

---

## Document Structure

This document organizes work using a three-tier hierarchy:

1. **Epics** - Large business capabilities (aligned to milestones in REQUIREMENTS.md)
2. **Features** - Discrete product capabilities within an epic
3. **User Stories** - Specific user-facing scenarios written in Gherkin format

**Status Legend:**

- ✅ **Complete** - Implemented and tested
- 🚧 **In Progress** - Currently being developed
- 📋 **Planned** - Specified but not started
- 💡 **Future** - Ideas for later releases

Each user story follows the format:

```gherkin
Feature: [Feature Name]

Scenario: [Scenario Name]
  Given [context/precondition]
  When [action/trigger]
  Then [expected outcome]
  And [additional outcomes]
```

---

## ✅ Epic 1: Authentication & Multi-Tenancy System

**Status:** Complete  
**Business Goal:** Secure, scalable user management with organization isolation  
**Success Criteria:** Users can sign up, create organizations, and access protected features

### ✅ Feature 1.1: User Authentication

**Description:** Clerk-based authentication with sign-up, sign-in, and session management  
**Status:** Complete

#### ✅ Story 1.1.1: User Sign-Up

```gherkin
Feature: User Authentication

Scenario: New user creates account
  Given I am a tour industry professional
  When I visit the sign-up page
  And I enter my email and password
  And I verify my email address
  Then I should be redirected to organization onboarding
  And my account should be created in the system
```

#### ✅ Story 1.1.2: User Sign-In

```gherkin
Feature: User Authentication

Scenario: Existing user signs in
  Given I have an existing TourBrain account
  When I visit the sign-in page
  And I enter my credentials
  Then I should be redirected to my dashboard
  And I should have access to my organization's data
```

#### ✅ Story 1.1.3: Route Protection

```gherkin
Feature: User Authentication

Scenario: Unauthenticated user tries to access protected route
  Given I am not signed in
  When I try to visit /venues or /dashboard
  Then I should be redirected to the sign-in page
  And I should not be able to access protected content
```

### ✅ Feature 1.2: Organization Management

**Description:** Multi-tenant organization system with role-based access  
**Status:** Complete

#### ✅ Story 1.2.1: Organization Onboarding

```gherkin
Feature: Organization Management

Scenario: New user creates organization
  Given I have just signed up and verified my email
  When I am redirected to the onboarding page
  And I enter organization name, type, and description
  And I submit the form
  Then my organization should be created
  And I should be set as the owner
  And I should be redirected to the dashboard
```

#### ✅ Story 1.2.2: Organization Types

```gherkin
Feature: Organization Management

Scenario: User selects organization type
  Given I am completing organization onboarding
  When I select from venue, promoter, agency, artist management, or other
  Then the system should store my organization type
  And this should influence my dashboard experience
```

---

## ✅ Epic 2: Venue Management System

**Status:** Complete  
**Business Goal:** Comprehensive venue database with CRUD operations  
**Success Criteria:** Users can add, view, edit, and manage venue information

### ✅ Feature 2.1: Venue Creation

**Description:** Form-based venue creation with professional fields  
**Status:** Complete

#### ✅ Story 2.1.1: Add New Venue

```gherkin
Feature: Venue Creation

Scenario: User adds a new venue to their organization
  Given I am signed in and have an organization
  When I navigate to /venues/new
  And I fill in venue name, address, city, and country
  And I optionally add capacity, contact info, and technical specs
  And I submit the form
  Then the venue should be created in my organization
  And I should be redirected to the venues list
  And I should see my new venue in the list
```

#### ✅ Story 2.1.2: Venue Form Validation

```gherkin
Feature: Venue Creation

Scenario: User submits incomplete venue form
  Given I am on the new venue form
  When I submit without required fields (name, address, city, country)
  Then I should see validation errors
  And the form should not submit
  And I should be able to correct and resubmit
```

### ✅ Feature 2.2: Venue Directory

**Description:** List and manage all organization venues  
**Status:** Complete

#### ✅ Story 2.2.1: View Venue List

```gherkin
Feature: Venue Directory

Scenario: User views their organization's venues
  Given I am signed in and have venues in my organization
  When I navigate to /venues
  Then I should see a grid of my organization's venues
  And each venue should show name, location, and capacity
  And I should see action buttons for view and edit
  And I should not see venues from other organizations
```

#### ✅ Story 2.2.2: Empty Venue State

```gherkin
Feature: Venue Directory

Scenario: User views venues when none exist
  Given I am signed in but have no venues
  When I navigate to /venues
  Then I should see an empty state message
  And I should see a prominent "Add Venue" button
  And I should be encouraged to create my first venue
```

### ✅ Feature 2.3: Venue Details Management

**Description:** Comprehensive venue information management  
**Status:** Complete

#### ✅ Story 2.3.1: Professional Venue Fields

```gherkin
Feature: Venue Details Management

Scenario: User adds comprehensive venue information
  Given I am creating or editing a venue
  When I fill in all available fields
  Then I can add basic info (name, address, capacity)
  And I can add contact information (name, email, phone, website)
  And I can add technical specs (load-in time, soundcheck, curfew)
  And I can add operational notes
  And all information should be saved and retrievable
```

---

## ✅ Epic 3: Admin CRM System

**Status:** Complete  
**Business Goal:** Advanced waitlist management with CRM capabilities  
**Success Criteria:** Admins can track, prioritize, and manage early access users

### ✅ Feature 3.1: Waitlist CRM

**Description:** Advanced waitlist management with status tracking  
**Status:** Complete

#### ✅ Story 3.1.1: Waitlist Status Management

```gherkin
Feature: Waitlist CRM

Scenario: Admin manages waitlist entry status
  Given I am an admin viewing the waitlist
  When I select a waitlist entry
  And I change their status from "New" to "Qualified"
  And I add priority and internal notes
  Then the entry should be updated
  And I should be able to track their progress through the pipeline
```

#### ✅ Story 3.1.2: Waitlist Filtering and Search

```gherkin
Feature: Waitlist CRM

Scenario: Admin filters waitlist by criteria
  Given I am viewing the admin waitlist
  When I filter by role (venue, promoter, agency)
  Or I filter by status (New, Qualified, Contacted, etc.)
  Or I search by name or organization
  Then I should see only matching entries
  And I should be able to clear filters to see all entries
```

#### ✅ Story 3.1.3: Waitlist Data Export

```gherkin
Feature: Waitlist CRM

Scenario: Admin exports waitlist data
  Given I am viewing the admin waitlist
  When I click the export button
  Then I should receive a CSV file
  And it should contain all waitlist fields including CRM data
  And it should be formatted for Excel compatibility
```

---

## ✅ Epic 4: Marketing & Early Access Pipeline

**Status:** Complete  
**Business Goal:** Build awareness and capture early adopter signups  
**Success Criteria:** Professional marketing presence with working waitlist

### ✅ Feature 4.1: Marketing Website

**Description:** Public-facing website that explains TourBrain value proposition  
**Status:** Complete

#### ✅ Story 4.1.1: View Product Overview

```gherkin
Feature: Marketing Website

Scenario: Visitor lands on homepage and understands value proposition
  Given I am a venue booker visiting tourbrain.ai
  When I land on the homepage
  Then I should see a clear headline "Replace Prism + Master Tour with an AI Tour OS"
  And I should see the three core pillars: Booking, Logistics, and AI Routing
  And I should understand TourBrain is for venues, promoters, and agencies
```

#### Story 1.1.2: Compare TourBrain to Current Tools

```gherkin
Feature: Marketing Website

Scenario: Venue manager compares TourBrain to existing tools
  Given I am a venue manager currently using Prism
  When I scroll to the comparison section
  Then I should see a table comparing TourBrain vs Prism vs Master Tour
  And I should see 10 comparison dimensions including Primary Focus, Deployment, and AI Routing
  And I should clearly see TourBrain's advantages marked
```

#### Story 1.1.3: Get Questions Answered

```gherkin
Feature: Marketing Website

Scenario: Promoter has concerns about replacing existing tools
  Given I am a promoter considering TourBrain
  When I scroll to the FAQ section
  Then I should see answers to common questions like "Can TourBrain replace both Prism and Master Tour?"
  And I should see migration guidance
  And I should feel confident about the transition path
```

### Feature 1.2: Waitlist Signup

**Description:** Capture early access signups with role and company information

#### Story 1.2.1: Join Waitlist

```gherkin
Feature: Waitlist Signup

Scenario: Venue booker joins early access waitlist
  Given I am a venue booker interested in TourBrain
  When I scroll to the "Get Early Access" section
  And I fill in my name "Sarah Johnson"
  And I fill in my email "sarah@redrocksdenver.com"
  And I select role "Venue - Booker/Buyer"
  And I fill in company "Red Rocks Amphitheatre"
  And I optionally add notes about my needs
  And I click "Join Waitlist"
  Then I should see a success message "✓ You're on the list!"
  And my information should be saved in the database
  And I should not be able to submit duplicate emails
```

#### Story 1.2.2: Handle Duplicate Signup

```gherkin
Feature: Waitlist Signup

Scenario: User tries to sign up with email already on waitlist
  Given I previously signed up with "sarah@redrocksdenver.com"
  When I attempt to sign up again with the same email
  And I submit the waitlist form
  Then the system should update my existing record
  And I should still see a success message
  And there should only be one record for my email in the database
```

#### Story 1.2.3: Validate Required Fields

```gherkin
Feature: Waitlist Signup

Scenario: User attempts signup without required information
  Given I am on the early access form
  When I leave the email field blank
  And I click "Join Waitlist"
  Then I should see a validation error
  And the form should not submit
  And I should be prompted to fill in required fields
```

### Feature 1.3: Waitlist Management

**Description:** Track and analyze early access signups

#### Story 1.3.1: View Waitlist Analytics

```gherkin
Feature: Waitlist Management

Scenario: Product team reviews waitlist signups
  Given I am a TourBrain team member with admin access
  When I open Prisma Studio
  And I navigate to the WaitlistEntry table
  Then I should see all signups with timestamps
  And I should see role distribution (Venue, Promoter, Agency)
  And I should see company names and notes
  And I can identify high-priority beta candidates
```

---

## Epic 2: Authentication & Multi-Tenancy

**Alignment:** REQUIREMENTS.md - Milestone 1  
**Business Goal:** Enable secure, organization-scoped access  
**Success Criteria:** Users can sign up, create organizations, and invite team members

### Feature 2.1: User Registration

**Description:** Allow users to create accounts and organizations

#### Story 2.1.1: Sign Up as New Organization

```gherkin
Feature: User Registration

Scenario: Venue manager creates new organization account
  Given I am a venue manager invited from the waitlist
  When I visit the signup page
  And I enter my email "sarah@redrocksdenver.com"
  And I enter my name "Sarah Johnson"
  And I create a password
  And I enter organization name "Red Rocks Amphitheatre"
  And I select organization type "Venue"
  And I click "Create Account"
  Then my user account should be created
  And a new organization "Red Rocks Amphitheatre" should be created
  And I should be assigned the ADMIN role
  And I should be logged in automatically
  And I should see my organization dashboard
```

#### Story 2.1.2: Sign Up via Magic Link

```gherkin
Feature: User Registration

Scenario: User signs up without password
  Given I prefer passwordless authentication
  When I visit the signup page
  And I enter my email
  And I enter basic information
  And I click "Send Magic Link"
  Then I should receive an email with a secure login link
  When I click the magic link
  Then I should be logged in
  And my account should be fully created
```

#### Story 2.1.3: Validate Unique Email

```gherkin
Feature: User Registration

Scenario: User attempts signup with existing email
  Given an account already exists for "sarah@redrocksdenver.com"
  When I attempt to sign up with the same email
  And I submit the registration form
  Then I should see an error "Email already registered"
  And I should be directed to the login page
  And I should have the option to reset my password
```

### Feature 2.2: Authentication

**Description:** Secure login and session management

#### Story 2.2.1: Login with Email and Password

```gherkin
Feature: Authentication

Scenario: Registered user logs in
  Given I have an existing account
  When I visit the login page
  And I enter my email "sarah@redrocksdenver.com"
  And I enter my password
  And I click "Log In"
  Then I should be authenticated
  And I should be redirected to my organization's dashboard
  And my session should remain active for 30 days
```

#### Story 2.2.2: Login with Magic Link

```gherkin
Feature: Authentication

Scenario: User logs in without password
  Given I prefer passwordless login
  When I visit the login page
  And I enter my email
  And I click "Send Magic Link"
  Then I should receive an email with a login link
  When I click the link within 15 minutes
  Then I should be logged in
  And I should be redirected to my dashboard
```

#### Story 2.2.3: Handle Invalid Credentials

```gherkin
Feature: Authentication

Scenario: User enters wrong password
  Given I have an account with email "sarah@redrocksdenver.com"
  When I attempt to login
  And I enter an incorrect password
  And I click "Log In"
  Then I should see an error "Invalid email or password"
  And I should remain on the login page
  And I should have the option to reset my password
```

#### Story 2.2.4: Reset Password

```gherkin
Feature: Authentication

Scenario: User forgets password and resets it
  Given I have forgotten my password
  When I click "Forgot Password?" on the login page
  And I enter my email
  And I click "Send Reset Link"
  Then I should receive a password reset email
  When I click the reset link
  And I enter a new password
  And I confirm the new password
  And I click "Reset Password"
  Then my password should be updated
  And I should be logged in automatically
```

### Feature 2.3: Organization Management

**Description:** Create and configure organizations

#### Story 2.3.1: View Organization Settings

```gherkin
Feature: Organization Management

Scenario: Admin views organization details
  Given I am logged in as an ADMIN user
  When I navigate to Organization Settings
  Then I should see my organization name
  And I should see organization type (Venue, Promoter, Agency)
  And I should see the organization's unique slug
  And I should see a list of team members
  And I should see organization creation date
```

#### Story 2.3.2: Update Organization Details

```gherkin
Feature: Organization Management

Scenario: Admin updates organization information
  Given I am logged in as an ADMIN user
  When I navigate to Organization Settings
  And I click "Edit Organization"
  And I change the organization name to "Red Rocks - AEG"
  And I click "Save Changes"
  Then the organization name should be updated
  And I should see a success confirmation
  And all team members should see the updated name
```

### Feature 2.4: Team Collaboration

**Description:** Invite team members and manage roles

#### Story 2.4.1: Invite Team Member

```gherkin
Feature: Team Collaboration

Scenario: Admin invites a colleague to join organization
  Given I am an ADMIN user for "Red Rocks Amphitheatre"
  When I navigate to Team Settings
  And I click "Invite Team Member"
  And I enter email "mike@redrocksdenver.com"
  And I enter name "Mike Rodriguez"
  And I select role "BOOKER"
  And I click "Send Invitation"
  Then an invitation email should be sent to Mike
  And Mike should appear in the Pending Invitations list
  When Mike clicks the invitation link
  And completes his account setup
  Then Mike should have access to the organization
  And Mike should have BOOKER permissions
```

#### Story 2.4.2: Assign User Roles

```gherkin
Feature: Team Collaboration

Scenario: Admin changes team member's role
  Given I am an ADMIN user
  And "Mike Rodriguez" is a team member with BOOKER role
  When I navigate to Team Settings
  And I click on Mike's profile
  And I change his role to "TOUR_MANAGER"
  And I click "Update Role"
  Then Mike's role should be updated to TOUR_MANAGER
  And Mike's permissions should change accordingly
  And Mike should see different features based on his new role
```

#### Story 2.4.3: Remove Team Member

```gherkin
Feature: Team Collaboration

Scenario: Admin removes a team member
  Given I am an ADMIN user
  And "Mike Rodriguez" is a team member
  When I navigate to Team Settings
  And I select Mike from the team list
  And I click "Remove from Organization"
  And I confirm the removal
  Then Mike should no longer have access to the organization
  And Mike's login should be revoked
  And Mike should receive an email notification
```

### Feature 2.5: Multi-Tenancy & Data Scoping

**Description:** Ensure users only access their organization's data

#### Story 2.5.1: Data Isolation Between Organizations

```gherkin
Feature: Multi-Tenancy

Scenario: User only sees their organization's data
  Given I am logged in to "Red Rocks Amphitheatre"
  And another organization "Belly Up Tavern" exists with tours
  When I navigate to the Tours list
  Then I should only see tours belonging to Red Rocks Amphitheatre
  And I should not see any tours from Belly Up Tavern
  And I should not be able to access Belly Up's tour URLs
```

#### Story 2.5.2: API Enforces Organization Scope

```gherkin
Feature: Multi-Tenancy

Scenario: API blocks cross-organization access
  Given I am logged in to "Red Rocks Amphitheatre" (org ID: abc123)
  And a tour exists in "Belly Up Tavern" (org ID: xyz789) with ID: tour-456
  When I attempt to access API endpoint /api/tours/tour-456
  Then I should receive a 403 Forbidden error
  And I should see message "Access denied"
  And the tour data should not be returned
```

---

## Epic 3: Tour & Show Operations

**Alignment:** REQUIREMENTS.md - Milestone 2  
**Business Goal:** Replace spreadsheets with structured tour/show management  
**Success Criteria:** Users can create tours with 5+ shows and generate day sheets

### Feature 3.1: Tour Management

**Description:** Create, view, and organize tours

#### Story 3.1.1: Create New Tour

```gherkin
Feature: Tour Management

Scenario: Tour manager creates a tour
  Given I am logged in as a TOUR_MANAGER
  When I navigate to Tours page
  And I click "Create Tour"
  And I enter tour name "Midnite Summer Tour 2025"
  And I enter artist name "Midnite"
  And I select start date "2025-06-15"
  And I select end date "2025-08-20"
  And I set status to "PLANNING"
  And I click "Create Tour"
  Then a new tour should be created
  And I should be redirected to the tour detail page
  And I should see the tour in my tours list
```

#### Story 3.1.2: View Tours List

```gherkin
Feature: Tour Management

Scenario: Booker views all tours
  Given I am logged in as a BOOKER
  And my organization has 10 tours
  When I navigate to Tours page
  Then I should see a list of all tours
  And each tour card should show: artist, dates, status, number of shows
  And I should be able to filter by status (PLANNING, ANNOUNCED, ON_SALE, etc.)
  And I should be able to sort by start date
```

#### Story 3.1.3: View Tour Details

```gherkin
Feature: Tour Management

Scenario: Tour manager views comprehensive tour information
  Given I am viewing "Midnite Summer Tour 2025"
  When I open the tour detail page
  Then I should see tour header with artist, dates, and status
  And I should see a list/table of all shows on the tour
  And I should see financial summary (total estimated gross, expenses, profit)
  And I should be able to navigate to individual show details
  And I should see quick actions: Add Show, Edit Tour, Export Tour
```

#### Story 3.1.4: Edit Tour

```gherkin
Feature: Tour Management

Scenario: Tour manager updates tour dates
  Given I am viewing "Midnite Summer Tour 2025"
  When I click "Edit Tour"
  And I change the end date to "2025-09-10"
  And I update the status to "ANNOUNCED"
  And I click "Save Changes"
  Then the tour should be updated
  And I should see the new dates on the tour detail page
  And the status should show "ANNOUNCED"
```

#### Story 3.1.5: Delete Tour

```gherkin
Feature: Tour Management

Scenario: Admin deletes a cancelled tour
  Given I am logged in as an ADMIN
  And I am viewing a tour with status "CANCELLED"
  When I click "Delete Tour"
  And I confirm the deletion
  Then the tour and all associated shows should be deleted
  And I should be redirected to the tours list
  And the tour should no longer appear in any lists
```

### Feature 3.2: Show Management

**Description:** Add and manage individual shows on a tour

#### Story 3.2.1: Add Show to Tour

```gherkin
Feature: Show Management

Scenario: Booker adds a show to a tour
  Given I am viewing "Midnite Summer Tour 2025"
  When I click "Add Show"
  And I select venue "Red Rocks Amphitheatre"
  And I select date "2025-07-22"
  And I set doors time "18:00"
  And I set show time "20:00"
  And I set capacity to 9525
  And I click "Add Show"
  Then the show should be created
  And it should appear in the tour's show list
  And I should be able to view the show detail page
```

#### Story 3.2.2: View Show Details - Overview Tab

```gherkin
Feature: Show Management

Scenario: Tour manager views show overview
  Given I have a show on 2025-07-22 at Red Rocks
  When I open the show detail page
  And I am on the Overview tab
  Then I should see date, venue name, and location
  And I should see doors, show time, and curfew
  And I should see capacity and current ticket count
  And I should see show status (SCHEDULED, ON_SALE, SOLD_OUT, etc.)
  And I should see a map of the venue location
```

#### Story 3.2.3: Manage Show Deal - Deal Tab

```gherkin
Feature: Show Management

Scenario: Promoter enters deal terms
  Given I am viewing a show detail page
  When I click the "Deal" tab
  And I select deal type "Guarantee vs Percentage"
  And I enter guarantee amount "15000"
  And I enter deal percentage "85"
  And I enter estimated gross "50000"
  And I add expenses: Production $5000, Marketing $2000, Catering $1500
  And I click "Save Deal"
  Then the deal should be saved
  And I should see calculated estimated profit: $21,500 (50000 * 0.85 - 15000 - 8500)
  And the tour financial summary should update
```

#### Story 3.2.4: Manage Show Logistics - Logistics Tab

```gherkin
Feature: Show Management

Scenario: Tour manager adds logistics information
  Given I am viewing a show detail page
  When I click the "Logistics" tab
  And I enter load-in time "14:00"
  And I enter soundcheck time "17:00"
  And I enter doors time "18:30"
  And I enter show time "20:00"
  And I enter curfew "23:00"
  And I add notes "Bring extra cables for outdoor setup"
  And I add contact: Stage Manager - John Doe - 555-0100
  And I click "Save Logistics"
  Then the logistics should be saved
  And this information should appear on the day sheet
```

#### Story 3.2.5: Update Show Status

```gherkin
Feature: Show Management

Scenario: Show status progresses through lifecycle
  Given I have a show with status "SCHEDULED"
  When tickets go on sale
  And I update status to "ON_SALE"
  Then the show status should change
  And the status should be visible on tour overview
  When the show sells out
  And I update status to "SOLD_OUT"
  Then the status should reflect the sellout
  When the show happens
  And I update status to "COMPLETED"
  Then the show should be marked complete
```

### Feature 3.3: Venue Calendar

**Description:** Calendar view of all shows and holds

#### Story 3.3.1: View Venue Calendar

```gherkin
Feature: Venue Calendar

Scenario: Venue booker views monthly calendar
  Given I am logged in as a BOOKER for a venue
  When I navigate to the Calendar page
  Then I should see a month view calendar
  And I should see all confirmed shows as colored blocks
  And I should see tentative holds as lighter/dashed blocks
  And I should be able to click on any date to see details
  And I should be able to switch between month and week views
```

#### Story 3.3.2: Detect Booking Conflicts

```gherkin
Feature: Venue Calendar

Scenario: System prevents double-booking
  Given I have a confirmed show on 2025-07-22
  When I attempt to create another show on 2025-07-22
  And I select the same venue
  Then I should see a warning "Venue already has a show on this date"
  And I should be prevented from creating the conflicting show
  And I should see options to choose a different date or venue
```

#### Story 3.3.3: Quick Show Creation from Calendar

```gherkin
Feature: Venue Calendar

Scenario: Booker adds show directly from calendar
  Given I am viewing the venue calendar
  When I click on an empty date "2025-08-05"
  And I click "Add Show"
  Then a quick-add modal should appear
  And the date should be pre-filled
  When I select artist, venue, and basic details
  And I click "Create"
  Then the show should be created
  And it should immediately appear on the calendar
```

### Feature 3.4: Financial Tracking

**Description:** Track deal terms and calculate P&L

#### Story 3.4.1: Calculate Show P&L

```gherkin
Feature: Financial Tracking

Scenario: System calculates show profit
  Given I have a show with:
    | Estimated Gross | $50,000  |
    | Guarantee       | $15,000  |
    | Deal Percentage | 85%      |
    | Expenses        | $8,500   |
  When the system calculates P&L
  Then estimated payout should be: max($15,000, $50,000 * 0.85) = $42,500
  And estimated profit should be: $42,500 - $15,000 - $8,500 = $19,000
  And I should see this breakdown on the Deal tab
```

#### Story 3.4.2: View Tour Financial Summary

```gherkin
Feature: Financial Tracking

Scenario: Tour manager views tour-level finances
  Given I am viewing "Midnite Summer Tour 2025"
  And the tour has 20 shows
  When I view the financial summary
  Then I should see total estimated gross across all shows
  And I should see total estimated expenses
  And I should see total estimated profit
  And I should see average profit per show
  And I should see shows sorted by profitability
```

### Feature 3.5: Day Sheet Generation

**Description:** Auto-generate printable day sheets

#### Story 3.5.1: Generate Day Sheet

```gherkin
Feature: Day Sheet Generation

Scenario: Tour manager generates day sheet for show
  Given I have a show on 2025-07-22 at Red Rocks
  And all logistics and contacts are entered
  When I click "Generate Day Sheet"
  Then a formatted day sheet document should be created
  And it should include:
    | Show Date        | July 22, 2025           |
    | Venue Name       | Red Rocks Amphitheatre  |
    | Venue Address    | 18300 W Alameda Pkwy    |
    | Load-in          | 2:00 PM                 |
    | Soundcheck       | 5:00 PM                 |
    | Doors            | 6:30 PM                 |
    | Show Time        | 8:00 PM                 |
    | Curfew           | 11:00 PM                |
    | Stage Manager    | John Doe - 555-0100     |
```

#### Story 3.5.2: Export Day Sheet

```gherkin
Feature: Day Sheet Generation

Scenario: Tour manager exports day sheet as PDF
  Given I have generated a day sheet
  When I click "Export as PDF"
  Then a PDF file should be downloaded
  And it should be formatted for printing
  And it should be readable on mobile devices
  And I can email it to the tour crew
```

---

## ✅ Epic 4: Weather & Seasonality Intelligence

**Status:** Complete  
**Business Goal:** Enable weather-informed decision making for outdoor venue planning  
**Success Criteria:** Users can assess weather risk for outdoor shows and get actionable insights

### ✅ Feature 4.1: Weather Data Infrastructure

**Description:** Climate data collection and caching system for outdoor venues  
**Status:** Complete

#### ✅ Story 4.1.1: Automatic Climate Data Collection

```gherkin
Feature: Weather Data Infrastructure

Scenario: System collects climate data for new outdoor venue
  Given I am logged in as a VENUE_MANAGER
  When I create a venue "Red Rocks Amphitheatre"
  And I set isOutdoor to true
  And I enter latitude 39.6654 and longitude -105.2057
  And I save the venue
  Then the system should automatically trigger climate data collection
  And climate profiles should be created for all 12 months
  And each profile should contain temperature, precipitation, and extreme weather stats
  And the data should be sourced from historical weather records
```

#### ✅ Story 4.1.2: Climate Data Caching and Refresh

```gherkin
Feature: Weather Data Infrastructure

Scenario: System maintains fresh climate data
  Given a venue has climate profiles older than 90 days
  When the background refresh job runs
  Then stale climate profiles should be updated with fresh data
  And the lastUpdated timestamp should be current
  And shows at the venue should have their weather scores recalculated
```

### ✅ Feature 4.2: Weather Score Computation

**Description:** Intelligent scoring algorithm for outdoor show weather conditions  
**Status:** Complete

#### ✅ Story 4.2.1: Calculate Weather Score for Show

```gherkin
Feature: Weather Score Computation

Scenario: System calculates weather score for outdoor summer show
  Given a show scheduled for July 15th in Denver
  And the venue is marked as outdoor
  And climate data shows:
    | Metric           | Value |
    | Avg High Temp    | 28°C  |
    | Avg Low Temp     | 15°C  |
    | Avg Rainy Days   | 4     |
    | Hot Days %       | 25%   |
    | Cold Days %      | 0%    |
  When the system computes the weather score
  Then the score should be between 80-90 (excellent conditions)
  And the summary should indicate "Great weather conditions with minimal risk"
  And the reasons should include "Ideal temperature range for outdoor events"
```

#### ✅ Story 4.2.2: Handle Poor Weather Conditions

```gherkin
Feature: Weather Score Computation

Scenario: System identifies high-risk weather conditions
  Given a show scheduled for January 15th in Minneapolis
  And climate data shows frequent freezing temperatures and snow
  When the system computes the weather score
  Then the score should be below 40 (high risk)
  And the summary should warn about significant weather challenges
  And recommendations should suggest indoor alternatives or extensive weather preparations
```

### ✅ Feature 4.3: Weather Panel UI

**Description:** Interactive weather intelligence display for show planning  
**Status:** Complete

#### ✅ Story 4.3.1: View Weather Intelligence on Show Page

```gherkin
Feature: Weather Panel UI

Scenario: Tour manager reviews weather conditions for upcoming show
  Given I am viewing a show at an outdoor venue
  When I navigate to the show detail page
  Then I should see a Weather & Seasonality panel
  And it should display a color-coded weather score badge
  And I should see monthly climate statistics for the show month
  And I should see venue-specific weather notes if available
  And the panel should indicate if it's an outdoor or indoor venue
```

#### ✅ Story 4.3.2: Recompute Weather Score Manually

```gherkin
Feature: Weather Panel UI

Scenario: User requests fresh weather calculation
  Given I am viewing a show with existing weather data
  When I click the recompute weather button
  Then the system should fetch fresh climate data
  And recalculate the weather score with current information
  And update the UI with the new score and recommendations
  And display a loading state during computation
```

### ✅ Feature 4.4: AI Weather Explanations

**Description:** AI-powered weather analysis and recommendations  
**Status:** Complete

#### ✅ Story 4.4.1: Generate AI Weather Analysis

```gherkin
Feature: AI Weather Explanations

Scenario: Tour manager gets detailed weather insights
  Given I am viewing a show with computed weather data
  When I click "Get AI Weather Analysis"
  Then the system should generate a detailed explanation using AI
  And the analysis should consider tour routing context if available
  And it should provide specific, actionable recommendations
  And compare this show's weather risk to other tour dates
  And explain why this location and time of year are suitable or risky
```

#### ✅ Story 4.4.2: Cache and Display AI Explanations

```gherkin
Feature: AI Weather Explanations

Scenario: System caches AI-generated insights
  Given I have requested an AI weather explanation
  When the AI analysis is completed
  Then the explanation should be cached with the show's weather data
  And future visits should display the cached explanation immediately
  And the explanation should be cleared if weather data is recomputed
```

### ✅ Feature 4.5: Background Weather Processing

**Description:** Automated weather data management and score updates  
**Status:** Complete

#### ✅ Story 4.5.1: Automatic Weather Score for New Shows

```gherkin
Feature: Background Weather Processing

Scenario: Weather score computed when show is created
  Given I create a show at an outdoor venue with climate data
  When I save the show
  Then the system should automatically trigger weather score computation
  And the weather score should be calculated in the background
  And the score should appear on the show detail page
  And no user action should be required
```

#### ✅ Story 4.5.2: Scheduled Climate Data Maintenance

```gherkin
Feature: Background Weather Processing

Scenario: System maintains climate data quality
  Given the system has scheduled maintenance jobs configured
  When the cleanup job runs monthly
  Then climate profiles older than 1 year should be deleted
  And stale profiles (90+ days) should be refreshed
  And affected shows should have weather scores recalculated
```

---

## 📋 Epic 5: Ticketing Intelligence

**Alignment:** REQUIREMENTS.md - Milestone 3  
**Business Goal:** Provide real-time visibility into ticket sales and show health  
**Success Criteria:** Users can track pacing and identify at-risk shows

### Feature 4.1: Ticket Data Ingestion

**Description:** Import ticket snapshot data

#### Story 5.1.1: Upload Ticket CSV

```gherkin
Feature: Ticket Data Ingestion

Scenario: Venue manager uploads ticket sales data
  Given I am viewing a show detail page
  When I click "Upload Ticket Data"
  And I select a CSV file with columns: date, tier, sold, available, gross
  And I click "Upload"
  Then the system should parse the CSV
  And ticket snapshots should be created for each row
  And I should see a success message with count of imported records
  And the pacing chart should update with new data
```

#### Story 5.1.2: Manual Ticket Entry

```gherkin
Feature: Ticket Data Ingestion

Scenario: Promoter manually enters ticket snapshot
  Given I am viewing a show detail page
  And I don't have CSV export from my ticketing system
  When I click "Add Ticket Snapshot"
  And I select snapshot date "2025-07-01"
  And I enter tickets sold: 5420
  And I enter tickets available: 4105
  And I enter gross sales: $270,500
  And I click "Save Snapshot"
  Then the snapshot should be recorded
  And the pacing chart should update
```

#### Story 5.1.3: Validate Ticket Data

```gherkin
Feature: Ticket Data Ingestion

Scenario: System validates uploaded ticket data
  Given I am uploading a ticket CSV
  When the CSV has a row with negative tickets sold
  Then the system should reject that row
  And I should see an error "Invalid data: Tickets sold cannot be negative"
  And valid rows should still be imported
  And I should see a summary of successful and failed imports
```

### Feature 4.2: Show Pacing Visualization

**Description:** Visualize ticket sales over time

#### Story 4.2.1: View Pacing Chart

```gherkin
Feature: Show Pacing Visualization

Scenario: Promoter views ticket sales trend
  Given I am viewing a show on 2025-07-22
  And ticket snapshots exist from announce date to today
  When I navigate to the Ticketing tab
  Then I should see a line chart of tickets sold over time
  And the X-axis should show dates
  And the Y-axis should show cumulative tickets sold
  And I should see days until show countdown: "22 days"
  And I should see current sell-through percentage: "57%"
```

#### Story 4.2.2: Compare to Venue Historical Performance

```gherkin
Feature: Show Pacing Visualization

Scenario: Venue compares show to historical averages
  Given I have 3 years of historical data for my venue
  And I am viewing a current show's pacing chart
  When I toggle "Compare to Historical"
  Then I should see an overlay of average pacing for similar shows
  And I should see if current show is pacing ahead or behind average
  And I should see confidence intervals based on historical variance
```

### Feature 4.3: Risk Scoring & Alerts

**Description:** Identify shows that need attention

#### Story 4.3.1: Automatic Risk Assessment

```gherkin
Feature: Risk Scoring

Scenario: System calculates show health status
  Given a show has the following data:
    | Days Until Show | 10 days  |
    | Tickets Sold    | 2500     |
    | Capacity        | 9525     |
    | Sell-through    | 26%      |
  When the system calculates risk score
  Then the show should be labeled "At Risk"
  And the risk label should be RED
  And I should see this label on the show card
  And I should see this label on the tour overview
```

#### Story 4.3.2: View Risk by Category

```gherkin
Feature: Risk Scoring

Scenario: Promoter filters shows by risk level
  Given I am viewing "Midnite Summer Tour 2025"
  And the tour has 20 shows with varying risk levels
  When I filter by risk level "At Risk"
  Then I should see only shows labeled "At Risk"
  And I should see them sorted by severity
  And I should see recommended actions for each show
```

#### Story 4.3.3: Receive Risk Alerts

```gherkin
Feature: Risk Scoring

Scenario: Tour manager receives alert for underperforming show
  Given I have a show labeled "Healthy" yesterday
  And today's snapshot shows pacing has dropped significantly
  When the system recalculates risk
  And the show becomes "Needs Attention"
  Then I should receive an email alert
  And I should see a notification in the app
  And the notification should include: show name, date, current sell-through, days remaining
```

### Feature 4.4: Show Pacing Report

**Description:** Tour-level view of all show pacing

#### Story 4.4.1: View Tour Pacing Dashboard

```gherkin
Feature: Show Pacing Report

Scenario: Tour manager reviews all shows at once
  Given I am viewing "Midnite Summer Tour 2025"
  When I navigate to the Pacing Report
  Then I should see a table with all shows
  And each row should show: date, venue, capacity, tickets sold, sell-through %, days until show, risk level
  And I should be able to sort by risk level
  And I should be able to sort by sell-through percentage
  And I should see color-coded risk indicators
```

#### Story 4.4.2: Get Recommended Actions

```gherkin
Feature: Show Pacing Report

Scenario: System suggests actions for at-risk show
  Given I have a show labeled "At Risk"
  When I click on the show in the pacing report
  Then I should see recommended actions:
    | Action              | Description                                    |
    | Price Drop          | Reduce GA ticket price by 15%                  |
    | Marketing Push      | Increase Facebook ad spend by $500             |
    | Email Blast         | Send reminder to venue's email list            |
    | Add Support Act     | Announce special guest to drive interest       |
  And I should be able to track which actions I've taken
```

---

## Epic 6: AI Routing & Tour Design

**Alignment:** REQUIREMENTS.md - Milestone 4  
**Business Goal:** Automate tour routing with intelligent suggestions  
**Success Criteria:** Generate viable tour route in <1 minute

### Feature 5.1: Routing Scenario Creation

**Description:** Define routing parameters and constraints

#### Story 6.1.1: Create Routing Request

```gherkin
Feature: Routing Scenario Creation

Scenario: Agent creates routing scenario for East Coast tour
  Given I am viewing "Midnite Summer Tour 2025"
  When I click "Create Routing Scenario"
  And I enter scenario name "East Coast Run - July 2025"
  And I select date range "2025-07-01" to "2025-07-31"
  And I select regions: NY, PA, MA, CT, NJ, MD, VA
  And I set max drive time between shows: 4 hours
  And I set minimum off-days per week: 1
  And I add anchor date: 2025-07-15 at The Fillmore Philadelphia
  And I set capacity range: 2000-5000
  And I click "Generate Route"
  Then the system should begin processing
  And I should see a loading indicator
```

#### Story 6.1.2: Define Anchor Dates

```gherkin
Feature: Routing Scenario Creation

Scenario: Agent locks in must-play shows
  Given I am creating a routing scenario
  When I add anchor date: 2025-07-04 at Red Rocks Amphitheatre
  And I add anchor date: 2025-07-22 at The Greek Theatre
  Then the routing algorithm should build route around these fixed dates
  And all other shows should fit between anchors
  And drive time constraints should respect anchor dates
```

### Feature 5.2: AI Routing Engine

**Description:** Generate optimized tour routes

#### Story 6.2.1: Generate Initial Route

```gherkin
Feature: AI Routing Engine

Scenario: System generates East Coast routing scenario
  Given I have submitted a routing request for East Coast
  And I specified 4-hour max drive time
  And I specified 1 off-day per week
  When the routing engine runs
  Then it should return a scenario with 12-15 shows
  And each show should be within 4 hours drive of the previous
  And there should be at least 1 off-day per week
  And the route should flow geographically (no backtracking)
  And I should see the result within 30 seconds
```

#### Story 6.2.2: Respect Regional Boundaries

```gherkin
Feature: AI Routing Engine

Scenario: System only suggests venues in specified regions
  Given I specified regions: NY, PA, MA, CT, NJ, MD, VA
  When the routing engine generates a scenario
  Then all suggested venues should be in those states
  And no venues from other states should appear
  And I should see geographic clustering within regions
```

#### Story 6.2.3: Apply Capacity Filters

```gherkin
Feature: AI Routing Engine

Scenario: System matches venue sizes to tour requirements
  Given I specified capacity range 2000-5000
  When the routing engine generates a scenario
  Then all suggested venues should have capacity between 2000 and 5000
  And venues should be sorted by historical performance
  And I should see venue capacity displayed for each stop
```

### Feature 5.3: Routing Scenario Review

**Description:** Review and edit generated routes

#### Story 6.3.1: View Route on Map

```gherkin
Feature: Routing Scenario Review

Scenario: Agent visualizes route geographically
  Given I have a generated routing scenario
  When I open the scenario review page
  Then I should see an interactive map
  And each venue should be marked with a numbered pin
  And pins should be connected with lines showing drive path
  And I should be able to click each pin to see venue details
  And I should see total miles traveled
```

#### Story 6.3.2: View Route as List

```gherkin
Feature: Routing Scenario Review

Scenario: Agent reviews route chronologically
  Given I have a generated routing scenario
  When I switch to List View
  Then I should see a table with columns:
    | Sequence | Date       | Venue                  | City         | Drive Time | Off Day |
    | 1        | 2025-07-01 | 9:30 Club              | Washington   | -          | No      |
    | 2        | 2025-07-03 | The Fillmore Silver Spring | Silver Spring | 45 min | No  |
    | 3        | 2025-07-04 | -                      | OFF DAY      | -          | Yes     |
    | 4        | 2025-07-05 | Union Transfer         | Philadelphia | 2h 30m     | No      |
  And I should see summary statistics: 12 shows, 3 off-days, 1200 total miles
```

#### Story 6.3.3: Edit Individual Stops

```gherkin
Feature: Routing Scenario Review

Scenario: Agent swaps a venue
  Given I am reviewing a routing scenario
  And stop #5 is at The Bowery Ballroom
  When I click "Edit" on stop #5
  And I search for alternative venues in New York
  And I select "Webster Hall" instead
  And I click "Update Stop"
  Then stop #5 should now be Webster Hall
  And drive times should recalculate
  And the map should update
  And I should see if any constraints are now violated
```

#### Story 6.3.4: Adjust Dates

```gherkin
Feature: Routing Scenario Review

Scenario: Agent shifts entire tour by one week
  Given I have a routing scenario starting 2025-07-01
  When I click "Adjust Dates"
  And I select "Shift all dates"
  And I enter offset: +7 days
  And I click "Apply"
  Then all show dates should move forward by 7 days
  And the route sequence should remain the same
  And venue availability should be rechecked
```

### Feature 5.4: Scenario Comparison

**Description:** Compare multiple routing options

#### Story 6.4.1: Generate Multiple Scenarios

```gherkin
Feature: Scenario Comparison

Scenario: Agent creates alternative routes
  Given I have routing scenario "East Coast Run - Option A"
  When I click "Create Alternative"
  And I change max drive time to 5 hours
  And I generate a new scenario "East Coast Run - Option B"
  Then both scenarios should be saved
  And I should be able to switch between them
```

#### Story 6.4.2: Compare Side-by-Side

```gherkin
Feature: Scenario Comparison

Scenario: Agent evaluates two routing options
  Given I have two scenarios: "Option A" and "Option B"
  When I select both scenarios
  And I click "Compare"
  Then I should see a side-by-side comparison:
    | Metric           | Option A | Option B |
    | Total Shows      | 12       | 15       |
    | Total Miles      | 1200     | 1450     |
    | Off Days         | 3        | 4        |
    | Avg Drive Time   | 2h 15m   | 3h 0m    |
    | Est. Total Gross | $450k    | $520k    |
  And I should see a map showing both routes
  And I can select the preferred option
```

### Feature 5.5: Apply Scenario

**Description:** Convert scenario into actual shows

#### Story 6.5.1: Apply Scenario to Tour

```gherkin
Feature: Apply Scenario

Scenario: Agent commits routing scenario
  Given I have finalized routing scenario "East Coast Run - Option A"
  And the scenario has 12 stops
  When I click "Apply to Tour"
  And I confirm the action
  Then 12 new shows should be created on the tour
  And each show should have venue, date, and basic logistics pre-filled
  And the scenario should be marked as APPLIED
  And I should be redirected to the tour detail page
  And I should see all new shows in the tour's show list
```

#### Story 6.5.2: Prevent Duplicate Application

```gherkin
Feature: Apply Scenario

Scenario: System prevents applying scenario twice
  Given I have applied scenario "East Coast Run - Option A"
  When I view the scenario again
  Then the "Apply to Tour" button should be disabled
  And I should see status "APPLIED on 2025-06-01"
  And I should not be able to create duplicate shows
```

---

## Epic 7: Collaboration & Sharing

**Alignment:** REQUIREMENTS.md - Milestone 5  
**Business Goal:** Enable cross-organization collaboration  
**Success Criteria:** Promoter can share tour with venue, venue can update logistics

### Feature 6.1: Show Sharing

**Description:** Share show information with external collaborators

#### Story 7.1.1: Generate Shareable Link

```gherkin
Feature: Show Sharing

Scenario: Promoter shares show details with venue
  Given I am a promoter viewing a show at Red Rocks
  When I click "Share Show"
  And I select permission level "VIEW_ONLY"
  And I click "Generate Link"
  Then a unique shareable URL should be created
  And I can copy the link to my clipboard
  And anyone with the link can view the show
  And they should not need to log in
```

#### Story 7.1.2: Invite Collaborator by Email

```gherkin
Feature: Show Sharing

Scenario: Tour manager invites venue to edit logistics
  Given I am a tour manager viewing a show
  When I click "Share Show"
  And I select "Invite by Email"
  And I enter email "sarah@redrocksdenver.com"
  And I select permission level "EDIT_LOGISTICS"
  And I click "Send Invitation"
  Then Sarah should receive an email invitation
  And she should be able to click the link
  And she should see the show details
  And she should be able to edit logistics fields
  And she should not be able to edit financial fields
```

#### Story 7.1.3: View Public Show Page

```gherkin
Feature: Show Sharing

Scenario: Venue views shared show without account
  Given a promoter has shared a show link with me
  When I click the shareable link
  Then I should see a public show page
  And I should see: date, venue, artist, doors/show times
  And I should see logistics information
  And I should not see financial information (unless explicitly shared)
  And I should not see internal notes
```

### Feature 6.2: Tour Collaboration

**Description:** Multi-organization collaboration on tours

#### Story 7.2.1: Invite Organization to Tour

```gherkin
Feature: Tour Collaboration

Scenario: Agency invites promoter to collaborate
  Given I am an agency managing "Midnite Summer Tour 2025"
  When I navigate to Tour Settings
  And I click "Invite Collaborator"
  And I enter organization name "AEG Presents"
  And I select permission level "EDIT_SHOWS"
  And I click "Send Invitation"
  Then AEG Presents should receive an invitation
  And they should be able to view all shows on the tour
  And they should be able to edit show details
  And they should not be able to delete the tour
```

#### Story 7.2.2: View Collaboration Activity Log

```gherkin
Feature: Tour Collaboration

Scenario: Tour manager reviews who changed what
  Given multiple organizations are collaborating on a tour
  When I navigate to the Activity Log
  Then I should see a chronological list of changes:
    | Timestamp       | User                  | Action                         |
    | 2025-06-15 3:42 PM | Sarah (Red Rocks)  | Updated logistics for show on 7/22 |
    | 2025-06-15 2:18 PM | Mike (AEG Presents)| Changed ticket price for show on 7/15 |
    | 2025-06-14 11:05 AM | Jamie (Tour Manager) | Added new show on 7/30 |
  And I should be able to filter by user or action type
  And I should be able to click any entry to see full details
```

### Feature 6.3: Permissions & Access Control

**Description:** Granular permission levels for collaborators

#### Story 7.3.1: Enforce VIEW_ONLY Permissions

```gherkin
Feature: Permissions & Access Control

Scenario: User with VIEW_ONLY cannot edit
  Given I have been invited to a tour with VIEW_ONLY permission
  When I view a show detail page
  Then I should see all show information
  And all edit buttons should be hidden or disabled
  When I attempt to directly access an edit API endpoint
  Then I should receive a 403 Forbidden error
```

#### Story 7.3.2: Enforce EDIT_LOGISTICS Permissions

```gherkin
Feature: Permissions & Access Control

Scenario: User can edit logistics but not financials
  Given I have EDIT_LOGISTICS permission for a show
  When I view the show detail page
  Then I should be able to edit the Logistics tab
  And I should not see the Deal tab at all
  And API calls to update deal terms should return 403 Forbidden
```

#### Story 7.3.3: Remove Collaborator Access

```gherkin
Feature: Permissions & Access Control

Scenario: Tour owner revokes access
  Given "AEG Presents" has been invited to collaborate
  And they have edited several shows
  When I navigate to Tour Settings
  And I click "Remove Collaborator" for AEG Presents
  And I confirm the removal
  Then AEG Presents should lose access to the tour
  And their users should no longer see the tour in their lists
  And they should receive an email notification
```

### Feature 6.4: Export & Integration

**Description:** Export data to external systems

#### Story 7.4.1: Export Tour as CSV

```gherkin
Feature: Export & Integration

Scenario: Tour manager exports tour data to spreadsheet
  Given I am viewing "Midnite Summer Tour 2025"
  When I click "Export Tour"
  And I select format "CSV"
  And I click "Download"
  Then a CSV file should be downloaded
  And it should contain columns: date, venue, city, state, capacity, status, doors, showtime
  And it should include all shows on the tour
  And I can open it in Excel or Google Sheets
```

#### Story 7.4.2: Export Day Sheet as PDF

```gherkin
Feature: Export & Integration

Scenario: Tour manager creates printable day sheet
  Given I have a show on 2025-07-22
  When I click "Generate Day Sheet"
  And I click "Export as PDF"
  Then a formatted PDF should be downloaded
  And it should be print-ready
  And I can email it to the tour crew
```

#### Story 7.4.3: Sync to Calendar

```gherkin
Feature: Export & Integration

Scenario: Tour manager subscribes to tour calendar
  Given I am viewing "Midnite Summer Tour 2025"
  When I click "Calendar Sync"
  And I click "Get iCal Link"
  Then I should receive an iCal subscription URL
  When I add this URL to Google Calendar
  Then all tour shows should appear in my calendar
  And updates to shows should sync automatically
  And I should see show time, venue, and location for each event
```

#### Story 7.4.4: Webhook Notifications

```gherkin
Feature: Export & Integration

Scenario: External system receives show updates
  Given I have configured a webhook URL in settings
  When a show is created or updated
  Then a POST request should be sent to my webhook URL
  And the payload should include:
    | Field       | Example                        |
    | event       | show.updated                   |
    | show_id     | show-abc123                    |
    | tour_id     | tour-xyz789                    |
    | changed_at  | 2025-06-15T14:32:00Z           |
    | changes     | {"status": "SOLD_OUT"}         |
  And I can process this in my own system
```

---

## ✅ Epic 5: Artist Management

**Status:** Complete  
**Business Goal:** Comprehensive artist database with contact and social management  
**Success Criteria:** Users can manage artist information for tour planning

### ✅ Feature 5.1: Artist Creation and Management

**Description:** Artist profiles with contact info and social links  
**Status:** Complete with full CRUD operations

#### ✅ Story 5.1.1: Add New Artist

```gherkin
Feature: Artist Management

Scenario: User adds a new artist to their organization
  Given I am signed in with a promoter organization
  When I navigate to /app/artists/new
  And I fill in artist name, genre, and contact information
  And I optionally add social media links and website
  And I submit the form
  Then the artist should be created in my organization
  And I should be redirected to the artists list
```

#### ✅ Story 5.1.2: Artist Roster Management

```gherkin
Feature: Artist Management

Scenario: User views and manages artist roster
  Given I have artists in my organization
  When I visit /app/artists
  Then I should see all artists in card layout
  And I should see contact information and social links
  And I should be able to click "New Tour" for any artist
  And I should see tour count for each artist
```

---

## ✅ Epic 6: Tour & Show Management

**Status:** Complete  
**Business Goal:** Core tour operations with deal tracking and logistics  
**Success Criteria:** End-to-end tour creation and show management

### ✅ Feature 6.1: Tour Management

**Description:** Complete tour lifecycle management with artist relationships  
**Status:** Complete with full functionality

#### ✅ Story 6.1.1: Tour Dashboard

```gherkin
Feature: Tour Management

Scenario: User manages tours from central dashboard
  Given I am signed in as a promoter
  When I visit /app/tours
  Then I should see all tours for my organization
  And I should see upcoming and past shows for each tour
  And I should see deal information and tour status
  And I should be able to create new tours
```

#### ✅ Story 6.1.2: Tour Detail Management

```gherkin
Feature: Tour Management

Scenario: User views detailed tour information
  Given I have a tour created
  When I click on the tour name
  Then I should see the tour detail page
  And I should see upcoming shows in a table format
  And I should see completed shows separately
  And I should be able to add new shows to the tour
```

### ✅ Feature 6.2: Show Management

**Description:** Individual show management with venue booking and logistics  
**Status:** Complete with professional day sheets

#### ✅ Story 6.2.1: Show Detail Pages

```gherkin
Feature: Show Management

Scenario: User manages individual show details
  Given I have a show scheduled
  When I visit /app/shows/[id]
  Then I should see comprehensive show information
  And I should see venue details and contact information
  And I should see timing information (doors, showtime, curfew)
  And I should see deal information (guarantee, split)
```

#### ✅ Story 6.2.2: Professional Day Sheets

```gherkin
Feature: Show Management

Scenario: User generates printable day sheet
  Given I am viewing a show detail page
  When I click "Print Day Sheet"
  Then I should see a clean, professional day sheet
  And it should include venue information and contacts
  And it should include show timing and deal information
  And it should be optimized for printing
  And it should include blank sections for production notes
```

---

## ✅ Epic 7: AI-Powered Features

**Status:** Complete  
**Business Goal:** AI-powered insights and automation to save time and improve decisions  
**Success Criteria:** Useful AI features that provide actionable insights

### ✅ Feature 7.1: AI Day Sheet Helper

**Description:** AI-generated production notes and day sheet assistance  
**Status:** Complete with OpenAI integration

#### ✅ Story 7.1.1: Generate AI Day Sheet Notes

```gherkin
Feature: AI Day Sheet Helper

Scenario: Tour manager generates AI production notes
  Given I am viewing a show detail page
  When I click "Generate AI Notes"
  Then I should see AI-generated production notes
  And the notes should be specific to the venue type and capacity
  And the notes should include load-in and sound check guidance
  And I should be able to copy the notes to clipboard
```

### ✅ Feature 7.2: AI Tour Risk Analysis

**Description:** AI-powered tour risk assessment and recommendations  
**Status:** Complete with strategic insights

#### ✅ Story 7.2.1: Generate Tour Risk Summary

```gherkin
Feature: AI Tour Risk Analysis

Scenario: Tour manager gets AI risk assessment
  Given I am viewing a tour detail page
  When I click "Generate Analysis"
  Then I should see AI-generated risk assessment
  And it should highlight shows with potential issues
  And it should identify market concentration risks
  And it should provide actionable recommendations
  And I should be able to refresh the analysis
```

---

## 💡 Epic 8: Advanced Logistics (Future)

**Status:** Future Release  
**Business Goal:** Advanced logistics and production management  
**Success Criteria:** Professional production workflows and crew collaboration

### 💡 Feature 8.1: Production Management

**Description:** Advanced production workflows and crew collaboration  
**Status:** Future consideration

#### 💡 Story 8.1.1: Production Timeline Management

```gherkin
Feature: Production Management

Scenario: Tour manager manages detailed production timeline
  Given I have a show with complex production requirements
  When I create a detailed production timeline
  Then I should be able to manage load-in, sound check, and strike times
  And I should be able to assign crew members to tasks
  And I should be able to track progress in real-time
```

---

## 🚧 Epic 8: Advanced Features (Backlog)

**Status:** Future Consideration  
**Business Goal:** Advanced functionality for power users  
**Success Criteria:** TBD per feature

### Feature 7.1: AI Copilot

**Description:** Natural language summaries and recommendations

#### Story 8.1.1: Tour Risk Summary

```gherkin
Feature: AI Copilot

Scenario: Tour manager asks for tour health summary
  Given I am viewing "Midnite Summer Tour 2025"
  And the tour has 20 shows with varying pacing
  When I click "AI Summary"
  Then I should see a natural language summary:
    """
    Overall tour health: Moderate concern.

    3 shows are at risk and need immediate attention:
    - July 8 in Boston (18% sold, 12 days out)
    - July 15 in Portland (22% sold, 19 days out)
    - August 2 in Denver (31% sold, 26 days out)

    Recommended actions:
    1. Consider price drop for Boston show
    2. Increase marketing spend for Portland
    3. Add support act announcement for Denver

    Strong performers: July 22 Red Rocks (87% sold) and August 10 Greek Theatre (92% sold)
    """
  And I can ask follow-up questions
```

#### Story 8.1.2: Generate Day Sheet Content

```gherkin
Feature: AI Copilot

Scenario: AI drafts day sheet from show data
  Given I have a show with logistics information entered
  When I click "Generate Day Sheet with AI"
  Then the AI should draft formatted sections:
    - Load-in schedule with time allocations
    - Soundcheck order and timing
    - Guest list management notes
    - Catering schedule
    - Security briefing points
  And I can edit the generated content
  And I can save it to the day sheet template
```

### Feature 7.2: Settlement & Reporting

**Description:** Post-show financial reconciliation

#### Story 8.2.1: Enter Actual Show Results

```gherkin
Feature: Settlement & Reporting

Scenario: Venue enters final ticket counts
  Given a show has status "COMPLETED"
  When I navigate to the Settlement tab
  And I enter actual tickets sold: 5283
  And I enter actual gross: $264,150
  And I enter actual expenses: $9,200
  And I click "Save Actual Results"
  Then the system should calculate final P&L
  And I should see variance from estimates
```

#### Story 8.2.2: Calculate Multi-Party Split

```gherkin
Feature: Settlement & Reporting

Scenario: System calculates settlement amounts
  Given a show with deal: $15,000 guarantee vs 85% of net
  And actual gross: $264,150
  And actual expenses: $9,200
  When the system calculates settlement
  Then net revenue should be: $264,150 - $9,200 = $254,950
  And artist payout should be: max($15,000, $254,950 * 0.85) = $216,707.50
  And promoter net should be: $254,950 - $216,707.50 = $38,242.50
  And I should see a detailed breakdown
```

### Feature 7.3: Mobile Apps

**Description:** Native iOS and Android apps

#### Story 8.3.1: View Day Sheet on Mobile

```gherkin
Feature: Mobile Apps

Scenario: Tour manager accesses day sheet offline
  Given I have the TourBrain mobile app installed
  And I am on a bus between shows
  And I have no internet connection
  When I open the app
  And I navigate to today's show
  Then I should see the full day sheet
  And all logistics information should be available offline
  And I can make notes that sync later
```

#### Story 8.3.2: Update Show Status from Phone

```gherkin
Feature: Mobile Apps

Scenario: Tour manager marks show as completed
  Given I am backstage after a show
  When I open the mobile app
  And I navigate to tonight's show
  And I tap "Mark as Completed"
  Then the show status should update
  And the update should sync to all collaborators
  And I should receive a prompt to enter settlement data
```

### Feature 7.4: Prism/Master Tour Migration

**Description:** Tools to migrate from existing systems

#### Story 8.4.1: Import from Prism CSV

```gherkin
Feature: Migration Tools

Scenario: Venue imports historical shows from Prism
  Given I have exported my data from Prism as CSV
  When I navigate to Settings > Import Data
  And I select "Import from Prism"
  And I upload the CSV file
  And I map Prism columns to TourBrain fields
  And I click "Import"
  Then all historical shows should be created
  And I should see a summary of imported records
  And I can review and edit imported data
```

---

## Traceability Matrix

| Epic   | Feature                       | User Stories               | Requirements Reference                         |
| ------ | ----------------------------- | -------------------------- | ---------------------------------------------- |
| Epic 1 | Marketing Website             | 1.1.1, 1.1.2, 1.1.3        | REQUIREMENTS.md - v0.1 - Marketing Site        |
| Epic 1 | Waitlist Signup               | 1.2.1, 1.2.2, 1.2.3        | REQUIREMENTS.md - v0.1 - Marketing Site        |
| Epic 1 | Waitlist Management           | 1.3.1                      | REQUIREMENTS.md - v0.1 - Marketing Site        |
| Epic 2 | User Registration             | 2.1.1, 2.1.2, 2.1.3        | REQUIREMENTS.md - Milestone 1 - Auth System    |
| Epic 2 | Authentication                | 2.2.1, 2.2.2, 2.2.3, 2.2.4 | REQUIREMENTS.md - Milestone 1 - Auth System    |
| Epic 2 | Organization Management       | 2.3.1, 2.3.2               | REQUIREMENTS.md - Milestone 1 - Org Model      |
| Epic 2 | Team Collaboration            | 2.4.1, 2.4.2, 2.4.3        | REQUIREMENTS.md - Milestone 1 - Invite System  |
| Epic 2 | Multi-Tenancy                 | 2.5.1, 2.5.2               | REQUIREMENTS.md - Milestone 1 - Multi-tenancy  |
| Epic 3 | Tour Management               | 3.1.1-3.1.5                | REQUIREMENTS.md - Milestone 2 - Tours          |
| Epic 3 | Show Management               | 3.2.1-3.2.5                | REQUIREMENTS.md - Milestone 2 - Shows          |
| Epic 3 | Venue Calendar                | 3.3.1-3.3.3                | REQUIREMENTS.md - Milestone 2 - Calendar       |
| Epic 3 | Financial Tracking            | 3.4.1, 3.4.2               | REQUIREMENTS.md - Milestone 2 - Financials     |
| Epic 3 | Day Sheet Generation          | 3.5.1, 3.5.2               | REQUIREMENTS.md - Milestone 2 - Day Sheets     |
| Epic 4 | Weather Data Infrastructure   | 4.1.1, 4.1.2               | REQUIREMENTS.md - v0.3.1 - Weather System      |
| Epic 4 | Weather Score Computation     | 4.2.1, 4.2.2               | REQUIREMENTS.md - v0.3.1 - Weather System      |
| Epic 4 | Weather Panel UI              | 4.3.1, 4.3.2               | REQUIREMENTS.md - v0.3.1 - Weather System      |
| Epic 4 | AI Weather Explanations       | 4.4.1, 4.4.2               | REQUIREMENTS.md - v0.3.1 - Weather System      |
| Epic 4 | Background Weather Processing | 4.5.1, 4.5.2               | REQUIREMENTS.md - v0.3.1 - Weather System      |
| Epic 5 | Ticket Data Ingestion         | 5.1.1-5.1.3                | REQUIREMENTS.md - Milestone 3 - Ingestion      |
| Epic 5 | Show Pacing Visualization     | 5.2.1, 5.2.2               | REQUIREMENTS.md - Milestone 3 - Visualization  |
| Epic 5 | Risk Scoring                  | 5.3.1-5.3.3                | REQUIREMENTS.md - Milestone 3 - Risk Detection |
| Epic 5 | Show Pacing Report            | 5.4.1, 5.4.2               | REQUIREMENTS.md - Milestone 3 - Reporting      |
| Epic 6 | Routing Scenario Creation     | 6.1.1, 6.1.2               | REQUIREMENTS.md - Milestone 4 - Request Form   |
| Epic 6 | AI Routing Engine             | 6.2.1-6.2.3                | REQUIREMENTS.md - Milestone 4 - Engine         |
| Epic 6 | Routing Scenario Review       | 6.3.1-6.3.4                | REQUIREMENTS.md - Milestone 4 - Review UI      |
| Epic 6 | Scenario Comparison           | 6.4.1, 6.4.2               | REQUIREMENTS.md - Milestone 4 - Comparison     |
| Epic 6 | Apply Scenario                | 6.5.1, 6.5.2               | REQUIREMENTS.md - Milestone 4 - Apply          |
| Epic 7 | Show Sharing                  | 7.1.1-7.1.3                | REQUIREMENTS.md - Milestone 5 - Sharing        |
| Epic 7 | Tour Collaboration            | 7.2.1, 7.2.2               | REQUIREMENTS.md - Milestone 5 - Collaboration  |
| Epic 7 | Permissions                   | 7.3.1-7.3.3                | REQUIREMENTS.md - Milestone 5 - Permissions    |
| Epic 7 | Export & Integration          | 7.4.1-7.4.4                | REQUIREMENTS.md - Milestone 5 - Export         |
| Epic 8 | AI Copilot                    | 8.1.1, 8.1.2               | REQUIREMENTS.md - Backlog - AI Copilot         |
| Epic 8 | Settlement                    | 8.2.1, 8.2.2               | REQUIREMENTS.md - Backlog - Settlement         |
| Epic 8 | Mobile Apps                   | 8.3.1, 8.3.2               | REQUIREMENTS.md - Backlog - Mobile             |
| Epic 7 | Migration Tools               | 7.4.1                      | REQUIREMENTS.md - Backlog - Migration          |

---

## Story Sizing & Estimation

### Epic 1 (Complete)

- **Total Stories:** 6
- **Status:** ✅ Shipped

### Epic 2: Authentication & Multi-Tenancy

- **Total Stories:** 13
- **Estimated Time:** 2-3 weeks
- **Dependencies:** None
- **Priority:** CRITICAL - Blocks all other work

### Epic 3: Tour & Show Operations

- **Total Stories:** 15
- **Estimated Time:** 3-4 weeks
- **Dependencies:** Epic 2 (Auth)
- **Priority:** HIGH - Core product value

### Epic 4: Weather Intelligence

- **Total Stories:** 10
- **Estimated Time:** Complete
- **Dependencies:** Epic 3 (Shows exist)
- **Priority:** COMPLETE - Unique differentiator

### Epic 5: Ticketing Intelligence

- **Total Stories:** 9
- **Estimated Time:** 2-3 weeks
- **Dependencies:** Epic 3 (Shows exist)
- **Priority:** HIGH - Key differentiator

### Epic 6: AI Routing

- **Total Stories:** 11
- **Estimated Time:** 4-5 weeks
- **Dependencies:** Epic 3 (Tours/Shows/Venues)
- **Priority:** MEDIUM-HIGH - Unique selling point

### Epic 7: Collaboration

- **Total Stories:** 10
- **Estimated Time:** 2 weeks
- **Dependencies:** Epic 2, Epic 3
- **Priority:** MEDIUM - Enables network effects

### Epic 8: Advanced Features

- **Total Stories:** 7
- **Estimated Time:** Variable
- **Dependencies:** Variable
- **Priority:** LOW - Nice-to-have, backlog

---

## Acceptance Criteria Standards

All user stories follow these acceptance criteria standards:

1. **Functional:** The feature works as described in the scenario
2. **UI/UX:** The interface is intuitive and follows design system
3. **Performance:** Actions complete within acceptable time (<2s for reads, <5s for writes)
4. **Security:** Proper authentication and authorization checks
5. **Data Integrity:** Data validation and error handling
6. **Accessibility:** Keyboard navigation, screen reader support
7. **Mobile Responsive:** Works on desktop, tablet, and mobile
8. **Browser Compatibility:** Chrome, Firefox, Safari, Edge

---

## Definition of Done

A user story is considered "Done" when:

- [ ] Code is written and peer-reviewed
- [ ] All Gherkin scenarios pass (manual or automated tests)
- [ ] UI matches design mockups
- [ ] Error handling and validation implemented
- [ ] Database migrations created and tested
- [ ] API endpoints documented
- [ ] Security review completed
- [ ] Performance tested under load
- [ ] Responsive design verified on mobile
- [ ] Accessibility audit passed
- [ ] Documentation updated
- [ ] Deployed to staging environment
- [ ] Product owner approval
- [ ] Deployed to production

---

**Document Owner:** TourBrain Product Team  
**Review Cadence:** Sprint planning (every 2 weeks)  
**Next Review:** Before Milestone 2 kickoff
