# Epic 7: AI Service - Insights

**Epic ID:** EPIC-07
**Priority:** P2 (Medium)
**Status:** Not Started
**Estimated Duration:** 4-5 days
**Owner:** Dev Team
**Depends On:** Epic 6 (AI Categorization)

---

## Epic Overview

Implement AI-powered spending analysis, pattern detection, and transparent coaching recommendations. This epic delivers the key product differentiator: transparent AI insights that explain WHY patterns occur and HOW to improve, with educational context.

**Goal:** Generate actionable, educational AI insights that build financial literacy.

---

## Stories

### Story 7.1: Implement InsightGenerationService
**Story ID:** STORY-07-01
**Priority:** P0
**Estimated:** 3 hours

**Description:**
Create core service for generating AI insights from transaction data.

**Acceptance Criteria:**
- [ ] InsightGenerationService class in AIService.Core
- [ ] IInsightGenerator interface for abstraction
- [ ] GenerateInsights method: input userId + timeframe, output insights list
- [ ] Supports insight types: Weekly, Monthly, Alert, Custom
- [ ] Stores insights in AIInsight table
- [ ] Deduplication: don't generate duplicate insights
- [ ] Priority scoring: High (exceeded budgets), Medium (warnings), Low (general tips)
- [ ] Expiration logic: weekly insights expire after 7 days, monthly after 30 days

**Implementation Notes:**
- Query transaction data via TransactionService API or database (consider data ownership)
- Generate multiple insights per analysis run
- Use builder pattern for insight construction

**Testing:**
- Unit tests for insight generation logic
- Test deduplication
- Test priority scoring

**Dependencies:**
- Epic 6: AI Service structure

---

### Story 7.2: Create Weekly Insights Analyzer (7-Day Patterns)
**Story ID:** STORY-07-02
**Priority:** P0
**Estimated:** 3 hours

**Description:**
Analyze spending patterns over the past 7 days compared to previous week.

**Acceptance Criteria:**
- [ ] WeeklyAnalyzer class
- [ ] Compares current week to previous week
- [ ] Identifies per-category changes >10%
- [ ] Identifies unusual merchants (new or absent)
- [ ] Identifies daily spending spikes
- [ ] Generates 2-3 insights per week
- [ ] Insights include: pattern description, comparison data, category
- [ ] Scheduled to run every Sunday at 8 AM

**Implementation Notes:**
- Use hosted service or Hangfire for scheduling
- Calculate week boundaries (Monday-Sunday)
- Focus on actionable patterns, not noise

**Testing:**
- Unit tests with sample transaction data
- Test with various spending patterns
- Test edge cases (no transactions, only one week of data)

**Dependencies:**
- Story 7.1

---

### Story 7.3: Create Monthly Insights Analyzer (30-Day Patterns)
**Story ID:** STORY-07-03
**Priority:** P0
**Estimated:** 3 hours

**Description:**
Analyze spending patterns over the past 30 days compared to previous month.

**Acceptance Criteria:**
- [ ] MonthlyAnalyzer class
- [ ] Compares current month to previous month
- [ ] Identifies per-category changes >15%
- [ ] Calculates average daily spending vs. budget
- [ ] Identifies recurring subscriptions (same merchant, similar amounts monthly)
- [ ] Generates 3-5 insights per month
- [ ] Insights prioritize categories with budgets
- [ ] Scheduled to run on 1st of each month

**Implementation Notes:**
- Use calendar months for analysis
- Consider seasonal variations (holidays, etc.)
- Focus on high-impact categories

**Testing:**
- Unit tests with multi-month data
- Test with various patterns (increase, decrease, stable)
- Test subscription detection

**Dependencies:**
- Story 7.2

---

### Story 7.4: Implement Spending Trend Detection
**Story ID:** STORY-07-04
**Priority:** P1
**Estimated:** 3 hours

**Description:**
Detect upward/downward trends in spending over time.

**Acceptance Criteria:**
- [ ] TrendDetector class
- [ ] Calculates trend line (linear regression) for each category
- [ ] Identifies significant trends: >20% increase/decrease over 3 months
- [ ] Detects acceleration: trend is getting steeper
- [ ] Generates insights for trends: "Your dining spending has increased 40% over 3 months"
- [ ] Includes trajectory projection: "At this rate, you'll spend $X in 6 months"
- [ ] Visual trend data included in insight metadata

**Implementation Notes:**
- Minimum 3 months of data required
- Use simple linear regression
- Store trend data in insight metadata for frontend charting

**Testing:**
- Unit tests with trending data
- Test with insufficient data
- Test projection accuracy

**Dependencies:**
- Story 7.3

---

### Story 7.5: Implement Anomaly Detection (Unusual Spending)
**Story ID:** STORY-07-05
**Priority:** P1
**Estimated:** 4 hours

**Description:**
Detect unusual spending events that deviate from user's normal patterns.

**Acceptance Criteria:**
- [ ] AnomalyDetector class
- [ ] Calculates baseline: average and standard deviation per category
- [ ] Identifies outliers: transactions >2 standard deviations from mean
- [ ] Identifies spending spikes: daily spending >3x average
- [ ] Identifies unusual merchants: new merchant with large transaction
- [ ] Generates alert-type insights for anomalies
- [ ] Includes explanation: "This is 3x your usual daily spending"
- [ ] Suppresses false positives (rent, mortgage - expected large amounts)

**Implementation Notes:**
- Require 30 days of history for baseline
- Z-score calculation for outlier detection
- Whitelist categories that typically have large transactions (Housing, Car Purchase)

**Testing:**
- Unit tests with anomalous transactions
- Test false positive suppression
- Test with insufficient history

**Dependencies:**
- Story 7.4

---

### Story 7.6: Generate Actionable Recommendations with Explanations
**Story ID:** STORY-07-06
**Priority:** P0
**Estimated:** 5 hours

**Description:**
Use GPT-4 to generate transparent recommendations explaining WHY and HOW.

**Acceptance Criteria:**
- [ ] RecommendationGenerator class
- [ ] Uses OpenAI GPT-4 API for natural language generation
- [ ] Prompt includes: pattern data, user context (budgets, goals), instruction for transparency
- [ ] Response format: { "why": "explanation", "how": "actionable suggestion", "education": "financial concept" }
- [ ] Example output:
  - WHY: "You had 5 weekend brunches this month compared to your usual 2. Weekend dining is typically more expensive than weekday meals."
  - HOW: "Consider meal prepping on Sundays to reduce weekend restaurant temptation. Even replacing 2 brunches saves ~$60/month."
  - EDUCATION: "Small recurring expenses compound quickly. A $30 brunch weekly = $1,560/year. Redirecting just half to savings builds a $780 emergency fund."
- [ ] Tone: supportive, educational, never judgmental
- [ ] Handles API failures gracefully (fallback to template-based recommendations)

**Implementation Notes:**
- Reuse OpenAI client from Epic 6
- Craft prompts carefully for desired tone
- Cache common recommendations to reduce API calls
- Monitor token usage and costs

**Testing:**
- Test with various patterns
- Validate response format
- Test tone and quality manually
- Test fallback handling

**Dependencies:**
- Story 7.5

---

### Story 7.7: Implement Event Publisher for InsightGenerated
**Story ID:** STORY-07-07
**Priority:** P0
**Estimated:** 2 hours

**Description:**
Publish events when insights are generated for notification delivery.

**Acceptance Criteria:**
- [ ] InsightGenerated event defined: InsightId, UserId, InsightType, Priority, InsightText, Timestamp
- [ ] Event published to RabbitMQ exchange: ai.events
- [ ] Event consumed by NotificationService
- [ ] Event includes correlation ID
- [ ] Publishing failures logged

**Implementation Notes:**
- Use MassTransit Publish
- Event contract in shared/Contracts
- Only publish high/medium priority insights

**Testing:**
- Integration test: generate insight → verify event published
- Test event consumption by NotificationService

**Dependencies:**
- Story 7.6

---

### Story 7.8: Create InsightsController with GET Endpoint
**Story ID:** STORY-07-08
**Priority:** P0
**Estimated:** 2 hours

**Description:**
Create API endpoint for retrieving user's insights.

**Acceptance Criteria:**
- [ ] GET /api/ai/insights endpoint
- [ ] Query parameters: insightType, priority, startDate, endDate
- [ ] Returns insights for authenticated user only
- [ ] Pagination supported (20 per page)
- [ ] Includes dismissed insights by default, filter with includeDismissed=false
- [ ] Ordered by priority (High → Medium → Low), then by date (newest first)
- [ ] Response includes insight metadata (trend data, etc.)
- [ ] PATCH /api/ai/insights/{id}/dismiss endpoint for dismissing insights

**Implementation Notes:**
- Extract user ID from JWT claims
- Use EF Core for querying with filters
- Return InsightResponse DTOs

**Testing:**
- Test filtering and pagination
- Test authorization
- Test dismiss functionality

**Dependencies:**
- Story 7.7

---

### Story 7.9: Add Unit Tests for Insight Generation Logic
**Story ID:** STORY-07-09
**Priority:** P1
**Estimated:** 4 hours

**Description:**
Create comprehensive unit tests for insight generation algorithms.

**Acceptance Criteria:**
- [ ] Tests for WeeklyAnalyzer
- [ ] Tests for MonthlyAnalyzer
- [ ] Tests for TrendDetector (trend calculation accuracy)
- [ ] Tests for AnomalyDetector (outlier detection)
- [ ] Tests for RecommendationGenerator (prompt formatting, response parsing)
- [ ] Tests for priority scoring logic
- [ ] Tests for deduplication
- [ ] Code coverage >75% for insight generation

**Implementation Notes:**
- Use realistic transaction data sets
- Mock OpenAI API calls
- Test edge cases (no data, insufficient data)

**Testing:**
```bash
dotnet test --filter "Category=Insights"
```

**Dependencies:**
- Story 7.8

---

### Story 7.10: Create Frontend Insights Page
**Story ID:** STORY-07-10
**Priority:** P0
**Estimated:** 4 hours

**Description:**
Build dedicated page for viewing AI coaching insights.

**Acceptance Criteria:**
- [ ] InsightsPage component accessible from main navigation
- [ ] Displays insights as expandable cards
- [ ] Card header shows: icon (based on priority), headline, date, priority badge
- [ ] Expandable sections: "Why This Happened", "What You Can Do", "Learn More"
- [ ] Sections collapsed by default, expand on click
- [ ] Filters: All Insights, Recommendations, Patterns, This Month, Last 3 Months
- [ ] Empty state: "Not enough data yet. Add more transactions to receive personalized coaching."
- [ ] Loading state with skeleton cards
- [ ] Responsive: stacked on mobile

**Implementation Notes:**
- Use MUI Accordion or Card + Collapse components
- Use TanStack Query for data fetching
- Memoize filtered insights

**Testing:**
- Test with various insights
- Test filters
- Test expandable sections
- Test responsive design

**Dependencies:**
- Story 7.9
- Epic 2: Frontend auth

---

### Story 7.11: Implement Insight Cards with Priority Indicators
**Story ID:** STORY-07-11
**Priority:** P0
**Estimated:** 3 hours

**Description:**
Design visually appealing insight cards with clear priority and category indicators.

**Acceptance Criteria:**
- [ ] Card styling varies by priority:
  - High: red accent, warning icon
  - Medium: yellow accent, info icon
  - Low: blue accent, lightbulb icon
- [ ] Category badge shows related spending category
- [ ] Confidence indicator if AI-generated
- [ ] Date stamp: "Generated 2 days ago"
- [ ] Dismiss button (X icon) in card header
- [ ] Dismissed insights show in separate "Dismissed" tab
- [ ] Cards use consistent typography and spacing

**Implementation Notes:**
- Create InsightCard reusable component
- Use MUI theme colors for consistency
- Add smooth transitions for expand/collapse

**Testing:**
- Test visual appearance for each priority
- Test dismiss functionality
- Test accessibility (keyboard navigation, screen readers)

**Dependencies:**
- Story 7.10

---

### Story 7.12: Add Dismiss Functionality for Insights
**Story ID:** STORY-07-12
**Priority:** P1
**Estimated:** 2 hours

**Description:**
Allow users to dismiss insights they've reviewed or find not relevant.

**Acceptance Criteria:**
- [ ] Dismiss button (X icon) on each insight card
- [ ] Clicking dismiss calls PATCH /api/ai/insights/{id}/dismiss
- [ ] Dismissed insight removed from main view (fade-out animation)
- [ ] Dismissed insights viewable in "Dismissed" tab
- [ ] Undo dismiss option (within 5 seconds, toast notification)
- [ ] Dismiss tracked for analytics (which insights dismissed most often)

**Implementation Notes:**
- Use optimistic updates
- Store dismissed state locally until API confirms
- Show toast with undo button

**Testing:**
- Test dismiss flow
- Test undo
- Test dismissed insights view
- Test error handling

**Dependencies:**
- Story 7.11

---

### Story 7.13: Display Spending Trend Charts (Recharts)
**Story ID:** STORY-07-13
**Priority:** P1
**Estimated:** 3 hours

**Description:**
Visualize spending trends with interactive charts.

**Acceptance Criteria:**
- [ ] Line chart showing spending per category over time
- [ ] Bar chart for category comparison (this month vs. last month)
- [ ] Trend line overlay on line chart
- [ ] Interactive: hover to see exact values
- [ ] Date range selector (3 months, 6 months, 1 year)
- [ ] Legend for multiple categories
- [ ] Responsive: adapts to screen size
- [ ] Accessibility: data table alternative for screen readers

**Implementation Notes:**
- Use Recharts library
- Fetch trend data from /api/ai/insights metadata
- Use consistent color scheme for categories

**Testing:**
- Test chart rendering
- Test interactivity
- Test with various data ranges
- Test responsive breakpoints

**Dependencies:**
- Story 7.12

---

## Epic Acceptance Criteria

- ✅ Weekly insights generated automatically
- ✅ Insights explain WHY patterns occurred (educational)
- ✅ Insights provide HOW to improve (actionable)
- ✅ Insights stored in database for historical view
- ✅ InsightGenerated events trigger notifications
- ✅ Frontend displays insights with visual indicators
- ✅ Users can dismiss insights
- ✅ Spending trends visualized with charts
- ✅ Unit test coverage >75%
- ✅ AI tone is supportive and educational, never judgmental

---

## Dependencies

**Blocks:**
- Epic 9: Notification Service (consumes InsightGenerated events)

**Depends On:**
- Epic 6: AI Categorization (provides categorized transaction data)
- Epic 4: Transaction Service (source of spending data)

**Enables:**
- Core product differentiator: transparent AI coaching
- Educational value for users

---

## Notes

- AI insights are the MVP's key innovation - prioritize quality over quantity
- Tone and transparency are critical - test with real users
- Future: Personalized insights based on user goals and financial profile
- Future: Goal tracking (save for vacation, emergency fund, etc.)
- Future: Gamification (achievements for financial milestones)
- Future: Comparison to anonymous peer averages (privacy-safe)
- Monitor insight relevance through dismiss rates
- Consider A/B testing different insight formats during beta

---

**Created:** 2025-01-05
**Last Updated:** 2025-01-05
