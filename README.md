# FAST Ride Connect

FAST Carpool — Frontend-Only MVP

Build a polished, modern, responsive React frontend only for a university student carpooling platform called FAST Carpool.

The initial target audience is FAST Karachi students.

CRITICAL REQUIREMENT — FRONTEND ONLY

This project is frontend-only.

Do NOT build, connect, or configure any backend.

Do NOT use:

Laravel

PHP backend

MySQL

Firebase

Supabase

PostgreSQL

Any database

Any real authentication provider

Any real email service

Any real OTP service

Any server-side API

Any payment service

Use realistic mock/local data only.

All authentication, users, requests, reports, admin actions, timetable processing, etc. must be simulated in the frontend.

The frontend must be structured so that the mock services can later be replaced by Laravel REST APIs without redesigning the UI.

Create clean service abstractions such as:

authService

profileService

timetableService

matchService

requestService

connectionService

reportService

adminService

Do not scatter mock data directly throughout components.

PRODUCT

FAST Carpool helps verified university students find compatible students for commuting to and from university.

The main matching factors are:

Approximate pickup location

University timetable compatibility

Ride type

Preferred partner gender

Available days

The product is a student transportation/matching platform, NOT a dating application.

VISUAL DIRECTION

Use the official FAST Karachi website only as visual identity inspiration:

https://khi.nu.edu.pk/

Use a FAST-inspired academic color identity, particularly:

Deep navy/dark blue

White

Light gray

Blue accent colors

However, do NOT copy the official website layout.

The application should look like a modern SaaS/student product:

Clean

Modern

Professional

Minimal

Trustworthy

Spacious

Responsive

Strong typography

Subtle borders

Soft shadows

Rounded cards

Clear hierarchy

Do not make the application look like a traditional university portal.

Do not imply that FAST Carpool is an official FAST NUCES service.

Do not use official FAST logos unless provided as approved assets.

Use language such as:

"FAST Carpool"

"Built for FAST students"

USER-FACING PAGES

Build the following student experience.

1. Landing Page

Hero:

"Find Your FAST Carpool."

Supporting text:

"Connect with FAST students who live near you and have a similar university schedule."

Buttons:

Get Started

Login

Sections:

How It Works

Verify your FAST email

Upload your timetable

Find compatible students

Connect after a request is accepted

Benefits

FAST Verified

Timetable-Based Matching

Privacy-Focused Locations

Privacy

Explain:

Approximate pickup areas only

Phone number hidden until connection

Course information from timetables is private

Minimal footer.

Do not add:

University news

Admissions

Programs

Faculty

Events

Generic university content

2. SIGNUP

Fields:

Full name

FAST university email

Password

Confirm password

CTA:

"Create Account"

Show validation states.

Use mock signup behavior.

3. EMAIL VERIFICATION

Show:

"Verify your FAST email"

"We sent a verification code to your university email."

Include:

6-digit OTP

Verify

Resend code

Countdown state

Invalid OTP state

Expired OTP state

Use mock verification.

After success:

"Email verified ✓"

Continue to onboarding.

4. ONBOARDING

Use a clean multi-step onboarding flow.

Ride Type

Options:

I can offer a ride

I need a ride

Both

Gender

Options:

Male

Female

Preferred Partner Gender

Options:

Anyone

Male

Female

Do not create unnecessary filters.

Pickup Area

The user must NOT enter their exact home address.

Allow selection of approximate areas/landmarks.

Mock options:

North Nazimabad — Block C

North Nazimabad — Dolmen Mall

North Nazimabad — Five Star Chowrangi

Nazimabad

Gulshan-e-Iqbal

PECHS

Johar

DHA

Show:

"Don't enter your home address. Choose a nearby area or public landmark instead."

Do not implement real maps.

Phone

Collect phone number.

Show:

"Your phone number stays hidden until a carpool request is accepted."

5. TIMETABLE UPLOAD

Title:

"Add your timetable"

Text:

"Upload a screenshot, image, or PDF of your FAST timetable. We'll use your class timings to find compatible carpools."

Upload formats:

JPG

PNG

PDF

Create:

Drag-and-drop upload area

File picker

Preview

Remove file

Upload state

Processing state

Use mock processing.

Show:

"Reading your timetable..."

Do NOT implement OCR yet.

6. TIMETABLE REVIEW

Show extracted schedule using mock data.

Only display:

Day

Start time

End time

Never display:

Course name

Teacher

Room

Section

Example:

Monday

08:00 AM — 09:30 AM

10:00 AM — 11:30 AM

Tuesday

09:30 AM — 11:00 AM

Wednesday

08:00 AM — 09:30 AM

Actions:

Looks correct

Edit schedule

Editing must allow:

Add class time

Edit time

Delete time

Add/remove days

7. STUDENT DASHBOARD

Main logged-in page.

Header:

"Good morning, Ahmed"

Main:

"Your Best Carpool Matches"

Explain:

"Matches are based on your pickup area, schedule, ride type, and preferences."

Create 6–10 realistic mock matches.

Each match card should show:

Name

FAST Verified badge

Gender

Approximate location

Ride type

Match score

Schedule compatibility

Example:

94% Carpool Match

Ayesha

FAST Verified ✓

Female

North Nazimabad — Dolmen Mall

Offering a ride

"Similar schedule"

Do not show course names.

Actions:

View Match

Request Carpool

8. MATCH DETAILS

Show:

Name

FAST Verified

Gender

Approximate pickup area

Ride type

Compatibility score

Schedule

Explain compatibility:

Nearby pickup area

Similar class timings

Compatible ride arrangement

Primary CTA:

"Request Carpool"

Do not expose:

Exact address

Phone number

Course names

Teacher names

Room numbers

Student ID

9. CARPOOL REQUEST

Confirmation modal:

"Send carpool request?"

"You're requesting to connect with Ayesha for a potential carpool."

Buttons:

Send Request

Cancel

After sending:

"Request sent ✓"

10. REQUESTS

Create two tabs.

Received

Show:

User

Approximate area

Schedule compatibility

Ride type

FAST verification

Actions:

Accept

Decline

Sent

Show:

User

Date

Status

Statuses:

Pending

Accepted

Declined

Cancelled

Allow cancelling pending requests.

11. CONNECTIONS

After both users accept a request, show:

"Carpool Connected ✓"

Display:

Name

Gender

Approximate pickup area

Ride type

Compatible days/times

Only after acceptance show:

"Phone number"

Use mock phone number.

Buttons:

Call

Message

Remove Connection

Do not build an in-app chat system yet.

Show safety reminder:

"Choose a public pickup point instead of sharing your exact home address."

12. MY SCHEDULE

Create:

"My Schedule"

Show weekly schedule.

Only:

Days

Start times

End times

Actions:

Edit Schedule

Replace Timetable

13. MY PROFILE

Show:

Name

FAST Verified

Gender

Ride type

Preferred partner gender

Approximate pickup area

Phone

Sections:

Carpool Preferences

Pickup Area

Weekly Schedule

Actions:

Edit Profile

Edit Schedule

14. SETTINGS

Keep settings minimal.

Account:

Email

Password

Privacy:

Phone privacy explanation

Location privacy explanation

Timetable privacy explanation

Safety:

Blocked users

Account:

Logout

15. REPORT / BLOCK

On match profiles and connections provide a small:

"•••"

menu.

Options:

Report User

Block User

Report modal:

"Why are you reporting this user?"

Options:

Inappropriate behavior

Fake profile

Safety concern

Other

Optional description field.

Use mock report submission.

ADMIN PANEL

Create a separate Admin Dashboard UI.

This is important.

The admin panel must be part of the frontend prototype, but it must remain frontend-only with mock data.

Do NOT build any backend admin functionality.

Do NOT connect admin pages to a real database.

Do NOT implement real authorization.

Simulate an admin login/state using mock data.

ADMIN NAVIGATION

Admin sidebar:

Dashboard

Users

Reports

Suspended Users

Activity

Admin Profile

Keep it simple.

Do NOT build a giant CMS.

ADMIN DASHBOARD

Create a professional moderation dashboard.

Show mock statistics:

Total Users

1,248

Verified Students

1,186

Active Connections

324

Pending Reports

12

Suspended Accounts

8

Use clean statistic cards.

Below that show:

Recent Reports

Columns:

Reported user

Report reason

Reported by

Date

Status

Action

Recent Activity

Examples:

New user verified

Carpool connection created

Report submitted

User suspended

Use realistic mock data.

ADMIN USERS PAGE

Create a searchable user management table.

Columns:

Name

University email

Gender

Verification

Ride type

Pickup area

Account status

Joined

Actions

Statuses:

Active

Suspended

Banned

Provide:

Search

Basic status filter

Verification filter

Ride type filter

Do not create dozens of filters.

ADMIN USER DETAILS

Clicking a user opens a detailed admin profile.

Show:

Name

University email

Verification status

Gender

Ride type

Approximate pickup area

Account status

Join date

Number of requests

Number of connections

Reports received

For timetable information, show only the schedule timings necessary for moderation.

Do NOT expose course names, teachers, room numbers, or other unnecessary academic data.

Never display an exact home address.

Provide admin actions:

Suspend Account

Unsuspend Account

Ban Account

Unban Account

These actions should only modify mock frontend state.

Before destructive actions, show a confirmation modal.

ADMIN REPORTS PAGE

This is one of the most important admin pages.

Create a report management interface.

Tabs:

Pending

Under Review

Resolved

Dismissed

Each report shows:

Report ID

Reported user

Reporter

Reason

Date

Status

Example reasons:

Inappropriate behavior

Fake profile

Safety concern

Harassment

Other

ADMIN REPORT DETAILS

When an admin opens a report, show:

Report Information

Report ID

Submitted date

Reason

Description

Reporter

Reported user

Current account status

Moderation Actions

Buttons:

Mark Under Review

Resolve

Dismiss

Suspend User

Ban User

For destructive actions, require confirmation.

Allow admin to add a short internal moderation note.

Use mock state only.

ADMIN SUSPENDED USERS

Show users currently suspended.

Columns:

User

Reason

Suspended date

Status

Action

Actions:

View

Unsuspend

ADMIN ACTIVITY

Create a simple activity/audit interface.

Show mock events such as:

Admin suspended a user

Report resolved

User verified

User banned

Report dismissed

Columns:

Action

Admin

Target

Date/time

This is only UI for now.

ADMIN PROFILE

Simple page showing:

Admin name

Admin email

Role

Last login

Do not build complex admin account management yet.

ADMIN PRIVACY RULES

The admin UI must follow these principles:

Exact home addresses do not exist.

Course names are not needed for carpool moderation.

Teacher names and room numbers are not shown.

Phone numbers should not be unnecessarily visible in general user tables.

Admin should only see information needed to perform moderation.

Sensitive information should not be displayed by default.

RESPONSIVE DESIGN

Student application:

Mobile-first.

Admin panel:

Desktop-first but responsive on tablet/mobile.

Student navigation:

Desktop:

Dashboard

My Schedule

Requests

Connections

Profile

Mobile:

Home

Schedule

Requests

Connections

Profile

Admin navigation:

Desktop sidebar.

Mobile collapsible sidebar.

MOCK DATA ARCHITECTURE

Create separate mock data files.

Example:

src/
├── components/
├── pages/
│   ├── public/
│   ├── student/
│   └── admin/
├── layouts/
│   ├── PublicLayout
│   ├── StudentLayout
│   └── AdminLayout
├── services/
│   ├── authService
│   ├── profileService
│   ├── timetableService
│   ├── matchService
│   ├── requestService
│   ├── connectionService
│   ├── reportService
│   └── adminService
├── mock/
│   ├── users
│   ├── schedules
│   ├── matches
│   ├── requests
│   ├── connections
│   ├── reports
│   └── adminActivity
└── components/


Keep mock data separate from UI components.

UI STATES

Every important screen should have:

Loading state

Empty state

Error state

Success state

Confirmation modal for destructive actions

Examples:

"No strong matches yet"

"You don't have any carpool requests."

"No pending reports."

"No suspended users."

ACCESSIBILITY

Use:

Semantic HTML

Proper labels

Keyboard navigation

Visible focus states

Good color contrast

Accessible buttons

Accessible modals

Do not communicate status using color alone.

DO NOT BUILD

Do NOT build:

Laravel

PHP

MySQL

Firebase

Supabase

Real authentication

Real OTP/email

Real OCR

Tesseract integration

Real maps

Real geocoding

Real notifications

Payments

Subscriptions

In-app chat

Ratings

Route optimization

AI matching

Vehicle registration system

Multi-university support

University administration features

Admissions

News

Events

Faculty pages

CMS

Marketing blog

The only backend-like behavior should be simulated with local/mock data.

FINAL FRONTEND USER FLOW

The student prototype should support this complete flow:

Landing
→ Signup
→ OTP Verification
→ Profile Setup
→ Ride Type
→ Gender
→ Partner Preference
→ Pickup Area
→ Phone
→ Timetable Upload
→ Timetable Review
→ Dashboard
→ Best Matches
→ Match Details
→ Request Carpool
→ Requests
→ Accepted Connection
→ Contact Information
→ My Schedule
→ Profile
→ Settings

FINAL ADMIN FLOW

The admin prototype should support:

Admin Login Mock
→ Admin Dashboard
→ Users
→ User Details
→ Reports
→ Report Details
→ Moderation Action
→ Suspended Users
→ Activity
→ Admin Profile

All actions use mock/local state.

FINAL QUALITY REQUIREMENT

The frontend should look like a polished production product even though there is no backend.

Prioritize:

Excellent UX

Consistent design

Responsive layout

Clean React architecture

Reusable components

Realistic mock data

Privacy-conscious UI

Clear student/admin separation

Good loading/empty/error states

No unnecessary features

Do not invent additional pages or features outside this specification.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/af922e48-66c9-41aa-8f92-88d8c6c895f2).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
