# Project Brief: AI Budgeting Coach

## Executive Summary

**AI Budgeting Coach** is a web-based personal finance assistant that goes beyond traditional expense tracking by providing **AI-driven financial coaching** with transparent, explainable insights. Built on an event-driven microservices architecture, the application helps users track expenses across multiple accounts, automatically categorize transactions, and receive personalized coaching through conversational AI that explains *why* spending patterns matter and *how* to improve financial habits.

**Primary Problem:** Individuals and families struggle to gain actionable insights from their spending across multiple bank accounts, credit cards, and payment methods. While existing budgeting tools provide basic categorization and charts, they lack deeper financial coaching and transparent explanations for their recommendations. Users receive data but not understanding, insights but not education, making it difficult to build lasting financial literacy and behavior change.

**Target Market:**
- **Phase 1 (MVP):** Learning-focused development project for mastering modern software architecture patterns (microservices, event-driven design, AI integration, DevOps) while building a functional AI coaching tool
- **Phase 2 (Future Market):** Families and individuals with multiple financial accounts who want unified visibility and intelligent coaching. This phase would include bank API integration for automated transaction imports and real-time consolidated financial overview.

**Key Value Proposition:**
- **AI Financial Coach (Not Just Insights):** Conversational AI that explains financial concepts, provides personalized coaching dialogues, and helps users understand the "why" behind spending patterns
- **Transparent Recommendations:** AI explains the reasoning behind every spending insight and recommendation, building financial literacy and trust rather than providing black-box suggestions
- **Unified Multi-Account Visibility:** Consolidate spending across multiple accounts into a single intelligent dashboard
- **Privacy-First MVP Approach:** Manual entry and CSV import for full data control (Phase 1), with optional bank integration later (Phase 2)
- **Production-Grade Learning Platform:** Modern architecture demonstrating microservices, event-driven messaging, and cloud-native patterns

---

## Problem Statement

### Current State and Pain Points

Individuals and families face critical challenges in managing personal finances across three interconnected dimensions:

**1. Fragmented Financial Visibility Across Multiple Accounts**

Most people manage money across multiple financial accounts - checking accounts, savings, credit cards, digital wallets, student accounts, and cash. This fragmentation makes it nearly impossible to understand total spending at any given time.

**For Young Adults (18-25):**
- Juggling student accounts, part-time job direct deposits, personal checking, and first credit cards
- 60% don't know their monthly spending total across all accounts
- Lower ability to cover monthly expenses and bills compared to other age groups
- 1 in 5 have overdrafted in the past year due to poor visibility

**For Families:**
- Parents managing household checking, savings, multiple credit cards, children's allowances, and shared expenses
- Spouses with separate accounts struggling to coordinate household budgets
- Parents teaching teens (who now have early bank access at 13-17) without consolidated visibility
- Time-consuming manual reconciliation across platforms to understand household finances

**Impact:** Inaccurate understanding leads to budget overruns, overspending that goes unnoticed, and inability to identify spending patterns across all sources.

**2. Data Without Understanding - The Financial Literacy Crisis**

Existing budgeting tools (Mint, YNAB, Copilot, Monarch) excel at categorizing transactions and generating charts, but they fail to bridge the gap between data and financial literacy.

**The Education Gap:**
- **Young adults (18-24) have the LOWEST financial literacy rate at 35.2%**
- **Only 23% of teens** know how to make a budget
- **Financial literacy scores dropped 3 points** year-over-year in 2025
- **49% of teens are eager** to learn about money management but lack tools that teach

**What's Missing:**
- Users see they overspent, but don't understand *why* it happened or *how* to prevent it
- AI recommendations appear as black-box suggestions without context or educational value
- No guidance on building better financial habits or understanding core financial concepts
- Charts show "what" but don't explain "so what?" or "now what?"

**Real-World Impact:**
- **57% of Gen Z** say money stress affects their mental health
- **44% overspend** due to social pressures they don't know how to resist
- **Only 15% are confident** they can achieve financial success
- **74% of teens** feel their financial literacy is lacking

**3. Lack of Personalized Financial Coaching**

Most people cannot afford or justify hiring a personal financial advisor for everyday budgeting decisions ($150-300/hour). Current apps provide automation but not coaching.

**For Young Adults:**
- Need to learn budgeting, credit building, debt management, and investment basics
- Want practical, hands-on education (not just formal instruction)
- Prefer hybrid approach: 91% use digital tools, but want human-like support for guidance
- Desire transparency: want to understand WHY recommendations are made

**For Families:**
- Parents need to teach children financial literacy while managing household budgets
- Require age-appropriate guidance for teens (13-17) with first bank accounts
- Need tools that explain trade-offs and build consensus on family spending decisions
- Want to instill good financial habits, not just track expenses

**What's Missing:**
- Generic advice that doesn't account for individual circumstances or life stage
- No conversational guidance to help users think through financial decisions
- Missing educational component to build lasting financial capability
- Users left to interpret complex data and make decisions without support

### Why Existing Solutions Fall Short

**Teen Banking Apps (Greenlight, FamZoo, Current):**
- ✅ Parental controls and basic goal-setting
- ❌ No AI coaching or explanation of financial concepts
- ❌ Limited to single account visibility (no multi-account consolidation)
- ❌ Tracking-focused, not education-focused
- ❌ Lack credit education, debt management, or investment guidance

**Adult Budgeting Tools (YNAB, Copilot, Monarch):**
- ✅ Multi-account aggregation via bank linking
- ✅ AI categorization (~90% accuracy)
- ❌ Passive reporting vs. active coaching
- ❌ Black-box AI recommendations without transparency
- ❌ No focus on building financial literacy alongside budgeting
- ❌ Not designed for teaching or family financial education

**The Gap:** No tool combines multi-account visibility, AI-powered coaching, transparent recommendations, and financial education for both young adults building first habits AND families teaching the next generation.

### Impact of the Problem

**Quantifiable Impact:**
- Average household wastes **$1,800 annually** on untracked or unnoticed overspending
- **60% of people** don't know their monthly spending total across all accounts
- **1 in 5 young adults** overdraft due to poor visibility and planning
- **Financial stress affects 73% of Americans**, largely due to lack of visibility and understanding

**Behavioral & Educational Impact:**
- Poor financial habits persist because users don't understand root causes
- Budget tools are abandoned when users feel overwhelmed by data without guidance
- Financial literacy remains low (35.2% for young adults) despite access to technology
- Young people enter adulthood unprepared for financial independence
- Families struggle to teach children in absence of educational tools

### Urgency and Importance

**Why Now:**

**1. Financial Literacy Crisis:**
- 35 states now mandate personal finance education (up from 16 in 2022)
- 40% of high school seniors take personal finance before graduation
- **But tools don't exist to support ongoing learning beyond classroom**

**2. AI Capabilities Have Matured:**
- LLMs can now provide personalized, explainable coaching at scale
- Transparent AI can explain reasoning, not just provide suggestions
- Conversational AI enables human-like guidance without human cost

**3. Market Opportunity:**
- Post-Mint shutdown creates gap for trustworthy, transparent tools
- 59% of consumers switched financial providers in 2025 (dissatisfaction high)
- Teen banking accounts growing rapidly (50% of teens have accounts)

**4. Learning & Portfolio Value:**
- Modern architecture patterns (microservices, event-driven) are industry standard
- AI integration experience is highly valuable
- Full-stack + DevOps mastery demonstrates production-grade capabilities

**Who This Hurts Most:**
- **Young adults (18-25)** trying to build first financial habits with multiple accounts but lacking literacy and confidence
- **Families** managing multiple accounts and shared budgets while trying to teach children financial responsibility
- **Parents of teens (13-17)** who have early bank access but need educational tools, not just parental controls
- **Anyone seeking transparent, educational financial tools** that explain recommendations and build lasting capability

---

## Proposed Solution

**AI Budgeting Coach** is an AI-powered financial literacy platform that combines multi-account expense tracking with personalized, transparent coaching to help young adults and families build financial confidence and capability.

### Core Concept and Approach

Unlike traditional budgeting tools that simply categorize and report, AI Budgeting Coach acts as a **personal financial educator** that:

1. **Consolidates Multi-Account Visibility**
   - Aggregate transactions from multiple sources (checking, savings, credit cards, student accounts, allowances)
   - Provide unified dashboard showing total spending across all accounts
   - Enable manual entry and CSV import for full data control (MVP)
   - Support bank API integration for automated imports (Phase 2)

2. **AI-Powered Coaching (Not Just Insights)**
   - Conversational AI that explains *why* spending patterns matter and *how* to improve
   - Transparent recommendations that show reasoning: "You spent 40% more on dining this month because you had 5 weekend brunches vs. your usual 2. Consider meal prepping on Sundays to reduce weekend expenses."
   - Personalized coaching dialogues tailored to user's life stage (young adult vs. family)
   - Educational explanations integrated into every insight

3. **Financial Literacy Builder**
   - AI explains financial concepts as they arise naturally in budgeting
   - Credit building guidance, debt management education, budget fundamentals
   - Age-appropriate lessons for different user segments
   - Builds lasting capability, not just short-term behavior change

4. **Event-Driven Microservices Architecture**
   - Production-grade technical implementation for learning objectives
   - 6 core microservices: API Gateway, UserService, TransactionService, AIService, BudgetService, NotificationService
   - RabbitMQ message broker for asynchronous event processing
   - React/TypeScript frontend, .NET 8 backend, PostgreSQL databases

### Key Differentiators from Existing Solutions

**vs. Teen Banking Apps (Greenlight, FamZoo):**
- ✅ **AI coaching** that explains financial concepts, not just tracks spending
- ✅ **Multi-account consolidation** (allowance + job + student account)
- ✅ **Education-first approach** that builds literacy alongside budgeting
- ✅ **Credit/debt/investment** education integrated into experience

**vs. Adult Budgeting Tools (YNAB, Copilot, Monarch):**
- ✅ **Transparent AI** that explains reasoning behind every recommendation
- ✅ **Conversational coaching** vs. passive charts and reports
- ✅ **Financial literacy focus** - teaches while budgeting
- ✅ **Family education mode** to teach teens and young adults
- ✅ **Privacy-first MVP** with manual entry before bank linking

**Unique Combination:**
No existing tool combines multi-account visibility + AI coaching + transparent recommendations + financial education for both young adults AND families.

### Why This Solution Will Succeed

**1. Addresses Root Cause, Not Symptoms**
- Other tools show data (symptom); AI Budgeting Coach builds understanding (root cause)
- Focuses on financial literacy gap that perpetuates poor money habits
- Sustainable behavior change through education, not just tracking

**2. Perfect Timing for Market Need**
- 49% of teens eager to learn + 35.2% literacy rate for young adults = massive demand
- 35 states mandate financial education but no tools support ongoing learning
- Post-Mint shutdown + 59% switching providers = market opportunity
- AI maturity enables personalized coaching at scale economically

**3. Dual-Market Approach**
- **Young adults**: Independent users who need first financial habits (MVP focus)
- **Families**: Shared budgets + teaching tools (natural Phase 2 expansion)
- Both segments share core needs: visibility + education + transparent guidance

**4. Technical Differentiation**
- Production-grade microservices architecture stands out in portfolio
- Event-driven design demonstrates modern patterns
- AI integration shows cutting-edge capabilities
- Full-stack + DevOps mastery highly marketable

**5. Privacy-to-Integration Progression**
- MVP starts with manual entry/CSV (no bank linking complexity)
- Proves value through AI coaching and education first
- Bank API integration adds convenience later without being crutch
- Users choose their privacy/convenience trade-off

### High-Level Vision for the Product

**Phase 1 - MVP (Learning Project, 8-12 weeks):**
- Single-user experience for young adults
- Manual transaction entry + CSV import
- AI categorization and transparent coaching
- Multi-account dashboard and budget tracking
- Basic notification system for budget alerts
- Docker Compose deployment locally

**Phase 2 - Extended Features (+4-6 weeks):**
- Family/household mode with multiple users
- Shared budgets and consensus features
- Age-appropriate coaching for teens vs. adults
- Goal setting and progress tracking
- Enhanced AI coaching depth

**Phase 3 - Production Ready (+2-4 weeks):**
- Bank API integration for automated imports
- Kubernetes deployment to Azure AKS
- CI/CD pipeline with GitHub Actions
- Monitoring (Prometheus + Grafana)
- Production-grade security and performance

**Long-Term Vision (Post-MVP):**
- Conversational AI interface for real-time coaching
- Predictive spending forecasts
- Investment education and tracking
- Multi-generational family financial planning
- Open-source community edition for self-hosting
- Mobile applications (iOS/Android)

---

## Target Users

AI Budgeting Coach serves two primary user segments, each with distinct needs but overlapping requirements for multi-account visibility and financial education.

### Primary User Segment: Young Adults (Ages 18-25)

**Demographic Profile:**
- Ages 18-25 (college students, recent graduates, early-career professionals)
- Managing first independent finances
- Income: $0-60K annually (part-time jobs, internships, entry-level positions)
- Tech-savvy, digital natives comfortable with apps and AI
- Geographically distributed (U.S. focus initially)

**Current Behaviors and Workflows:**
- Juggle 3-5 financial accounts: student checking, savings, credit card(s), student loans, part-time job direct deposits
- Primarily use mobile banking apps but check multiple apps separately
- Manually track expenses sporadically (if at all) using spreadsheets or notes
- Overwhelmed by financial data but eager to learn (49% want to learn more)
- Use social media for financial advice (48% learn from social platforms)
- Prefer hybrid digital + human guidance (91% use digital, only 10% want fully digital)

**Specific Needs and Pain Points:**
- **Multi-account chaos:** "I have no idea how much I'm actually spending across my credit card, checking account, and Venmo"
- **Overdraft anxiety:** 1 in 5 have overdrafted due to poor visibility across accounts
- **Credit confusion:** Don't understand how to build credit or manage first credit card responsibly
- **Student debt stress:** Need guidance on managing loans alongside daily budgeting
- **Social pressure overspending:** 44% overspend due to social influences; need help resisting
- **Mental health impact:** 57% say money stress affects mental health; need supportive coaching
- **Confidence gap:** Only 15% feel confident achieving financial success; need education to build capability

**Goals They're Trying to Achieve:**
- Understand total spending across all accounts without manual reconciliation
- Learn budgeting fundamentals through practical application (not theory)
- Build credit score while avoiding debt traps
- Develop sustainable financial habits before bad patterns solidify
- Reduce money-related anxiety through understanding and control
- Save for short-term goals (travel, car, emergency fund) with guidance
- Gain confidence in financial decision-making

**Why AI Budgeting Coach Fits:**
- Multi-account dashboard solves visibility problem immediately
- AI coaching provides the "human guidance" they want at digital scale
- Transparent recommendations build understanding, not just compliance
- Educational approach addresses 35.2% literacy gap in their age group
- Reduces mental health stress through supportive, explainable coaching
- Manual entry gives control while learning good tracking habits

### Secondary User Segment: Families with Children/Teens

**Demographic Profile:**
- Parents (ages 30-50) with children aged 8-25
- Household income: $50K-150K annually
- Managing family budgets + teaching next generation
- Mix of tech comfort levels (parents vary, kids are digital natives)
- Suburban and urban families across U.S.

**Current Behaviors and Workflows:**
- Manage 5-10+ accounts: multiple checking/savings, credit cards, children's accounts, college savings
- Parents often use different banks; spouses may have separate accounts
- Track allowances and teen spending through teen banking apps (Greenlight, etc.)
- Struggle to consolidate household view across all family accounts
- Want to teach children financial literacy but lack effective tools
- Split between tracking apps (for parents) and teaching tools (for kids)

**Specific Needs and Pain Points:**
- **Fragmented household view:** "We have 8 different accounts across 3 banks; I never know our total household spending"
- **Spouse coordination:** Different spending styles need unified visibility and consensus
- **Teaching challenge:** Want to educate teens (50% have bank accounts) but current apps just track/control
- **Multi-generational complexity:** College-age kids, teens with allowances, younger children learning money basics
- **Time constraints:** Need efficient tools that don't require constant manual effort
- **Age-appropriate guidance:** Need different coaching for 13-year-old vs. 21-year-old

**Goals They're Trying to Achieve:**
- Unified visibility across all family accounts for better household budgeting
- Teach children financial responsibility through guided experience, not just parental controls
- Build consensus on family spending priorities and trade-offs
- Prepare teens for financial independence with real-world skills
- Model good financial habits for children to emulate
- Save for family goals (education, home, vacations) with everyone aligned

**Why AI Budgeting Coach Fits:**
- Multi-account consolidation solves household visibility problem
- AI coaching provides educational layer missing from teen banking apps
- Transparent recommendations help parents explain financial decisions to kids
- Age-appropriate coaching can adapt to different family member needs (Phase 2)
- Shared budgets enable family consensus and coordination (Phase 2)
- Teaches financial literacy to entire household, not just tracks spending

### User Segment Overlap and Synergy

**Shared Needs Across Both Segments:**
1. **Multi-account visibility** - Both juggle multiple accounts and need consolidated view
2. **Financial education** - Young adults building first habits; families teaching next generation
3. **Transparent guidance** - Both want to understand *why*, not just *what*
4. **Confidence building** - Young adults need capability; families need teaching tools
5. **Practical learning** - Both prefer hands-on education over formal instruction

**MVP Strategy:**
- **Phase 1**: Focus on single-user experience that serves young adults AND individual family members
- Each family member can have their own account with their own AI coaching
- Proves core value (multi-account visibility + AI coaching + education)
- **Phase 2**: Add family features (shared budgets, household view, multi-user coordination)

**Natural Progression:**
- Young adults using the tool → Start families → Adopt family mode → Teach their children
- Long-term user retention through life stage progression

---

## Goals & Success Metrics

### Business Objectives

**Primary Objective (Learning Project):**
- **Master modern software architecture patterns** through hands-on implementation of production-grade microservices, event-driven messaging, AI integration, and DevOps practices
  - *Metric:* Successfully deploy all 6 microservices with event-driven communication working reliably
  - *Target:* Complete MVP Phase 1 within 8-12 weeks (part-time)
  - *Success:* Portfolio-ready demonstration of full-stack + cloud-native capabilities

**Secondary Objective (Market Validation):**
- **Build a functional financial literacy tool** that delivers real value to young adults and families
  - *Metric:* User feedback indicates improved financial understanding and reduced money stress
  - *Target:* 5-10 beta users actively using the tool for 30+ days
  - *Success:* Positive user testimonials about AI coaching effectiveness

**Tertiary Objective (Future Market Potential):**
- **Validate product-market fit** for AI-powered financial education platform
  - *Metric:* User retention rate and engagement with AI coaching features
  - *Target:* 60% of users return weekly; 40% engage with AI recommendations
  - *Success:* Evidence that AI coaching differentiation resonates with target users

### User Success Metrics

**For Young Adults (18-25):**
- **Financial Visibility:** Users can answer "What's my total spending this month?" across all accounts within 30 seconds
- **Financial Literacy Improvement:** Users report increased confidence in financial decision-making (self-assessment survey)
- **Behavior Change:** Users demonstrate improved budgeting adherence (staying within category budgets more often month-over-month)
- **Stress Reduction:** Users report decreased money-related anxiety after 30 days of use
- **Overdraft Prevention:** Active users reduce overdraft incidents compared to pre-use baseline

**For Families:**
- **Household Visibility:** Parents can view consolidated family spending across all accounts in single dashboard
- **Teaching Effectiveness:** Parents report successful financial literacy conversations with teens using AI insights
- **Family Consensus:** Families report better alignment on spending priorities and budgeting decisions
- **Teen Preparedness:** Teens demonstrate improved financial knowledge through interactions with AI coach

### Key Performance Indicators (KPIs)

**Technical KPIs (Learning Success):**
- **System Reliability:** 99% uptime for all microservices during development and testing
- **Event Processing:** Sub-second latency for transaction events through RabbitMQ pipeline
- **AI Accuracy:** >80% transaction categorization accuracy with OpenAI API
- **API Performance:** <500ms response time for 95% of API requests
- **Data Import:** Successfully process CSV imports of 1,000+ transactions without errors
- **Deployment:** Successful containerized deployment via Docker Compose locally

**Product KPIs (Market Viability):**
- **User Activation:** 70% of signups complete profile setup and add at least one transaction within first session
- **Engagement:** Users log in 3+ times per week on average
- **Feature Adoption:** 60% of users interact with AI coaching recommendations
- **Multi-Account Usage:** Average user tracks 3+ accounts in the system
- **Retention:** 50% of users still active after 30 days
- **User Satisfaction:** Net Promoter Score (NPS) of 40+ among active users

**Learning KPIs (Financial Literacy Impact):**
- **AI Coaching Engagement:** 50% of users read full AI coaching explanations (not just headlines)
- **Educational Value:** Users report learning at least 3 new financial concepts within first month
- **Transparency Effectiveness:** 70% of users understand *why* AI made specific recommendations
- **Behavior Change Indicators:** 40% of users adjust spending based on AI coaching insights

---

## MVP Scope

The MVP focuses on delivering core value (multi-account visibility + AI coaching + financial education) for single-user experience, establishing the technical foundation while validating the product concept.

### Core Features (Must Have for MVP)

**1. User Management & Authentication**
- **User Registration:** Email-based signup with secure password requirements
- **JWT Authentication:** Secure login/logout with token-based session management
- **User Profile:** Basic profile management (name, email, preferences)
- **Rationale:** Foundation for personalized AI coaching and secure data access

**2. Transaction Management**
- **Manual Transaction Entry:** Add individual transactions with date, amount, merchant, account, category (optional)
- **CSV Import:** Upload and parse CSV files from bank exports (common formats: Chase, Bank of America, etc.)
- **Transaction History:** View all transactions across all accounts in chronological order
- **Filtering & Search:** Filter by date range, account, category, merchant
- **Edit & Delete:** Modify or remove transactions
- **Rationale:** Core data input mechanism; CSV import reduces friction for getting started

**3. AI-Powered Transaction Categorization**
- **Automatic Categorization:** AI/ML service analyzes merchant names and assigns categories (Dining, Groceries, Transportation, etc.)
- **AI Provider Flexibility:** Use OpenAI API, Azure AI Services, ML.NET, or similar - not locked to specific provider
- **Category Confidence Scores:** Show AI confidence level for each categorization
- **Manual Override:** Users can correct AI categorizations (improves future accuracy)
- **Standard Category Set:** Pre-defined categories based on common budgeting needs
- **Rationale:** Demonstrates AI capabilities; reduces manual work; foundation for insights

**4. Multi-Account Transaction View**
- **Account Identification:** During CSV import, user specifies which account the transactions belong to (e.g., "Chase Checking", "Amex Credit Card")
- **Consolidated Transaction List:** All transactions from all imported CSVs displayed in single view
- **Account Filtering:** Filter transaction list by account source
- **Multi-Account Spending Totals:** Total spending automatically aggregates across all accounts
- **Rationale:** Solves core multi-account visibility problem through CSV imports; no complex account management UI needed for MVP

**5. AI Financial Coach - Insights & Recommendations**
- **Spending Pattern Analysis:** AI identifies trends (e.g., "dining up 40% this month")
- **Transparent Recommendations:** AI explains *why* pattern occurred and *how* to improve (e.g., "5 weekend brunches vs. usual 2 - consider meal prep")
- **Monthly Summaries:** AI-generated overview of financial health and key insights
- **Educational Explanations:** Financial concepts explained contextually (e.g., "Why tracking matters for building credit")
- **Insight Prioritization:** Show most impactful recommendations first
- **Rationale:** Core differentiation; delivers educational value; validates AI coaching concept

**6. Budget Tracking & Alerts**
- **Category Budgets:** Set monthly budget limits per category
- **Budget vs. Actual:** Track progress against budgets in real-time
- **Visual Indicators:** Color-coded status (on track, warning, exceeded)
- **Budget Alerts:** Notifications when approaching (80%) or exceeding budget limits
- **Rationale:** Essential budgeting functionality; triggers for AI coaching opportunities

**7. Notification System**
- **In-App Notifications:** Budget alerts, spending insights, AI coaching tips
- **Email Notifications:** Weekly summary, budget warnings
- **Notification Preferences:** Users can customize frequency and types
- **Rationale:** Drives engagement; delivers value proactively

### Out of Scope for MVP

**Explicitly NOT Included in MVP:**
- ❌ **Bank API Integration:** Manual entry + CSV only (Phase 2 feature - adds complexity and regulatory considerations)
- ❌ **Advanced Account Management UI:** No dedicated account setup/editing screens; accounts defined during CSV import
- ❌ **Visual Dashboards & Charts:** No pie charts, bar charts, or advanced visualizations (Phase 2)
- ❌ **Mobile Applications:** Web-first approach; responsive design supports mobile browsers
- ❌ **Family/Household Mode:** Multi-user accounts, shared budgets, family-level consolidated view (Phase 2 - adds significant complexity)
- ❌ **Goal Setting & Tracking:** Savings goals, debt payoff plans (Phase 2 - nice-to-have, not core)
- ❌ **Investment Tracking:** Stock portfolios, retirement accounts (future feature)
- ❌ **Bill Payment Integration:** Pay bills directly from app (out of scope entirely)
- ❌ **Advanced AI Features:** Conversational chat interface, predictive forecasting (Phase 2)
- ❌ **Social Features:** Share budgets, compare with friends (not aligned with core value)
- ❌ **Multi-Currency Support:** USD only for MVP
- ❌ **Advanced Security:** 2FA, biometric auth (Phase 3 - production hardening)
- ❌ **Gamification:** Badges, achievements, rewards (Phase 2 if validated)
- ❌ **Third-Party Integrations:** Venmo, PayPal, cryptocurrency tracking
- ❌ **Custom ML Model Training:** Use existing AI APIs; no custom model training
- ❌ **Production Infrastructure:** Kubernetes, CI/CD, monitoring (Phase 3)

### MVP Success Criteria

The MVP is considered successful when:

**Technical Success:**
- ✅ All 6 microservices (API Gateway, UserService, TransactionService, AIService, BudgetService, NotificationService) deployed and communicating via RabbitMQ
- ✅ Users can register, login, import CSVs from multiple banks
- ✅ Transactions from different accounts display in consolidated view
- ✅ AI categorization works with >80% accuracy
- ✅ Multi-account spending totals aggregate correctly
- ✅ AI coach generates at least 3 types of insights (spending trends, recommendations, educational content)
- ✅ Budget tracking and alerts function correctly
- ✅ System runs locally via Docker Compose with no critical bugs

**Product Success:**
- ✅ 5+ beta users actively using for 30+ days
- ✅ Users report improved financial visibility across accounts through CSV imports
- ✅ Users engage with AI coaching explanations (not just dismiss)
- ✅ Positive feedback on transparency of AI recommendations
- ✅ Evidence of learning (users mention understanding new concepts)

**Learning Success:**
- ✅ Portfolio-ready demonstration of microservices architecture
- ✅ Working knowledge of event-driven messaging with RabbitMQ
- ✅ Practical AI integration experience with AI/ML APIs
- ✅ Full-stack implementation (React/TypeScript + .NET 8)
- ✅ Containerization and Docker Compose orchestration

---

## Post-MVP Vision

### Phase 2 Features (Extended MVP)
- Family/household mode with multi-user accounts
- Shared budgets and family-level consolidated financials
- Bank API integration for automated transaction imports
- Visual dashboards and charts (pie charts, trends, comparisons)
- Goal setting and progress tracking
- Enhanced AI coaching depth with more educational content

### Long-Term Vision
- Conversational AI interface for real-time coaching
- Predictive spending forecasts and early warnings
- Investment education and basic tracking
- Multi-generational family financial planning tools
- Open-source community edition for self-hosting
- Mobile applications (iOS/Android)

---

## Technical Considerations

### Platform Requirements
- **Target Platforms:** Web (responsive design for desktop and mobile browsers)
- **Browser Support:** Modern browsers (Chrome, Firefox, Safari, Edge - latest 2 versions)
- **Performance Requirements:** <500ms API response times, sub-second event processing

### Technology Stack

**Backend:**
- **Language/Framework:** .NET 8 (C#) with ASP.NET Core Web API
- **Architecture:** Microservices (6 services) with event-driven messaging
- **API Gateway:** YARP (Yet Another Reverse Proxy)
- **Authentication:** JWT tokens
- **Message Broker:** RabbitMQ

**Frontend:**
- **Framework:** React 18+
- **Language:** TypeScript
- **State Management:** React Query or Redux Toolkit
- **Build Tool:** Vite
- **UI Framework:** Material-UI or Ant Design (TBD)

**Data:**
- **Database:** PostgreSQL (per-service databases)
- **AI/ML:** OpenAI API, Azure AI Services, or ML.NET (flexible)

**DevOps (Two Deployment Paths - TBD by Architect):**

*Option A - Azure Cloud-Native:*
- **Containerization:** Docker with Azure Container Registry (ACR)
- **Orchestration:** Docker Compose (MVP), Azure Kubernetes Service (AKS) (Phase 3)
- **Database:** Azure Database for PostgreSQL
- **Messaging:** Azure Service Bus (RabbitMQ alternative)
- **Monitoring & Logging:** Azure Monitor, Application Insights
- **CI/CD:** GitHub Actions with Azure deployment pipelines

*Option B - Self-Hosted Open Source:*
- **Containerization:** Docker with private registry or Docker Hub
- **Orchestration:** Docker Compose (MVP), Kubernetes (Phase 3)
- **Database:** Self-hosted PostgreSQL
- **Messaging:** RabbitMQ
- **Monitoring:** Prometheus + Grafana
- **Logging:** Serilog with structured logging, ELK Stack (Elasticsearch, Logstash, Kibana)
- **CI/CD:** GitHub Actions with self-hosted runners

*Common:*
- **Version Control:** Git + GitHub
- **Architecture Decision:** To be determined during architecture design phase based on cost, scalability, and learning objectives

### Repository Structure
- **Monorepo** - All microservices in single repository for easier development and coordination

### Service Architecture
- **Microservices** with clear service boundaries and database-per-service pattern
- Event-driven communication via RabbitMQ
- API Gateway for external client access

### Testing Requirements
- Unit tests for core business logic
- Integration tests for event flows
- Manual testing for MVP; automated E2E tests in Phase 3

---

## Constraints & Assumptions

### Constraints

**Budget:**
- OpenAI API costs (~$20-50/month for MVP beta testing)
- Free-tier cloud resources where possible
- No budget for paid tools or services in MVP

**Timeline:**
- 8-12 weeks part-time for MVP Phase 1
- Self-paced learning (not hard deadline)

**Resources:**
- Solo developer project
- No dedicated designer (use component library)
- No QA team (self-testing)

**Technical:**
- Web-only (no mobile apps for MVP)
- USD currency only
- English language only
- Manual data entry + CSV import (no bank APIs)

### Key Assumptions

- CSV import sufficient for MVP validation (users willing to manually import)
- Young adults and individual family members willing to try AI coaching approach
- AI provider APIs (OpenAI, Azure AI, etc.) remain accessible and cost-effective
- Microservices complexity justified by learning value
- 5-10 beta users achievable through personal network
- Users prefer transparent AI over black-box automation
- Financial literacy education resonates as value proposition
- Docker Compose adequate for MVP deployment

---

## Risks & Open Questions

### Key Risks

- **AI API Costs:** OpenAI usage could exceed budget with active users - *Mitigation: Set usage caps, monitor costs closely, consider ML.NET alternatives*
- **CSV Import Friction:** Users may find manual CSV import too cumbersome - *Mitigation: Make import UX extremely simple, provide clear templates/guides*
- **Scope Creep:** Microservices architecture complexity could delay MVP - *Mitigation: Strict MVP scope adherence, cut features if needed*
- **User Acquisition:** Difficulty finding 5-10 beta testers - *Mitigation: Reach out to personal network early, offer early access incentives*
- **AI Categorization Accuracy:** <80% accuracy could frustrate users - *Mitigation: Make manual override easy, learn from corrections*
- **Competition:** Established players (YNAB, Copilot) may add similar features - *Mitigation: Focus on learning goals, differentiate on transparency and education*

### Open Questions

- Which AI provider offers best balance of cost/accuracy for transaction categorization?
- What's the optimal category set for budgeting? (Use standard categories vs. custom)
- How detailed should AI coaching explanations be? (Risk: too verbose vs. too shallow)
- Should we support Excel in addition to CSV for imports?
- What's the minimum viable UX for CSV import to reduce friction?
- How do we measure financial literacy improvement quantitatively?

### Areas Needing Further Research

- Competitive feature analysis of YNAB, Copilot, Monarch (deeper dive)
- User research on CSV import workflows and pain points
- AI provider cost/performance benchmarking (OpenAI vs. Azure AI vs. ML.NET)
- Financial literacy assessment methodologies
- Event-driven architecture best practices for .NET microservices

---

## Next Steps

### Immediate Actions

1. **Complete PRD Creation** - Work with PM agent to create detailed Product Requirements Document
2. **Create Architecture Document** - Design system architecture with Architect agent
3. **Set Up Development Environment** - Install .NET 8, Docker, PostgreSQL, Node.js
4. **Initialize Repository** - Create monorepo structure for all microservices
5. **Prototype AI Categorization** - Test OpenAI/Azure AI APIs with sample transaction data

### PM Handoff

This Project Brief provides the full context for **AI Budgeting Coach**. The product is an AI-powered financial literacy platform that helps young adults and families gain multi-account visibility and build financial capability through transparent, educational AI coaching.

**Key Differentiators:**
- AI coaching that explains *why* (not just reports data)
- Multi-account visibility through CSV imports
- Financial education integrated into budgeting
- Transparent, explainable recommendations

**MVP Scope:** Single-user experience with CSV import, AI categorization, multi-account transaction view, budget tracking, and AI coaching insights.

**Primary Goal:** Learning project for microservices, event-driven architecture, and AI integration.

**Secondary Goal:** Validate market fit for AI financial literacy coaching.

---

*Project Brief completed: 2025-11-03*
*Status: Ready for PRD and Architecture Design*

