# PS07 Testing Guide - Questions to Ask

## 🧪 Complete Testing Scenarios

Follow this guide to test all PS07 features. Each scenario tests a specific routing path.

---

## **TEST 1: Client Detection & Full Analysis** 🎯
### What It Tests: CLIENT_DETECT route + Rule Engine

**Step 1: Ask about a client name**
```
Type: "What is Rahul Sharma's risk level?"
OR
Type: "Show me Rahul Sharma portfolio"
OR
Type: "Rahul Sharma analysis"
```

**Expected Result:**
1. ✅ Chat shows: "✓ Found: Rahul Sharma"
2. ✅ Card displays:
   - Risk: Moderate
   - Portfolio: ₹5Cr (or similar value)
   - Last Contact: Recent date
3. ✅ Two buttons appear:
   - [Yes, Full Analysis] button
   - [Quick Summary] button

**Step 2: Click [Yes, Full Analysis]**

**Expected Result:**
1. ✅ Rule Engine Dashboard appears showing:

   **SUMMARY STATS (Top bar - 4 cards)**
   - Risk Level: 🔴 CRITICAL
   - Rules Triggered: 8 / 8
   - Primary Action: REBALANCE
   - Confidence: 92%

   **PANELS (2-column grid with 6 panels)**
   - P0: User Risk & Portfolio Overview (2 flags)
   - P1: Market Intelligence (2 flags)
   - P2: Cash Flow & Transactions (1 flag)
   - P4: User Behavior (1 flag)
   - P5: Product Recommendations (1 flag)
   - P6: Support & Assistance (1 flag)

   **Each flag shows:**
   - Icon (⚠️ for critical, 📊 for high, 🛡️ for low)
   - Flag name (OVEREXPOSED_EQUITY, etc.)
   - Message explaining the flag
   - Impact text
   - Severity bar (Red for critical, Orange for high, Green for low)
   - Severity score (95, 88, 80, etc.)

   **RECOMMENDED ACTIONS (3-column grid)**
   - REBALANCE (Critical priority)
   - REVIEW_ALLOCATION (High priority)
   - INCREASE_DEBT (Medium priority)
   - REVIEW_TRANSACTION (Medium priority)
   - EDUCATION (Low priority)

   **TALKING POINTS (organized by priority)**
   - 🔴 CRITICAL PRIORITY (3 talking points in red boxes)
   - 🟠 HIGH PRIORITY (5 talking points in orange boxes)
   - 🟢 LOW PRIORITY (1 talking point in green boxes)

   **META INFO (bottom)**
   - Engine: v3.0
   - Rules evaluated: 8
   - Execution: 38ms
   - Confidence: 92%

2. ✅ Client Panel (right sidebar) updates with:
   - Avatar with "RS" initials
   - Name: Rahul Sharma
   - Status: Active (green badge)
   - Risk: Moderate (yellow badge)
   - Last Contact: X days ago
   - Holdings Snapshot:
     * Equity: ₹3.6Cr | 72% | +12.3%
     * Debt: ₹0.8Cr | 16% | +7.1%
     * Hybrid: ₹0.4Cr | 8% | +9.8%
   - Quick Stats:
     * Total AUM: ₹5Cr
     * YTD Return: +11.2%
     * Active Tasks: 3
   - Analysis Summary:
     * Risk Assessment: CRITICAL
     * Rules Triggered: 8/8
     * Confidence: 92%
     * Primary Action: REBALANCE

3. ✅ Chat shows follow-up AI response with insights

---

## **TEST 2: Portfolio Question with Rule Engine** 💼
### What It Tests: PORTFOLIO route + Rule Engine

**Prerequisites:** Client should already be selected from TEST 1

**Step 1: Ask a portfolio question**
```
Type: "Should we rebalance this portfolio?"
OR
Type: "What are the risk factors?"
OR
Type: "Is the equity allocation too high?"
OR
Type: "What's the performance issue?"
```

**Expected Result:**
1. ✅ Loading indicator appears (3 animated dots)
2. ✅ Rule Engine Dashboard shows (same as TEST 1)
3. ✅ AI provides contextual answer using rule engine data
4. ✅ Message type shows as "rule_engine_report" + "text"

**Variations to test:**

**Ask: "What about rebalancing?"**
- Expected: High-priority actions highlighted
- Should mention: REBALANCE action with 4 supporting rules

**Ask: "What's the SIP performance?"**
- Expected: P6 (Support) panel highlighted
- Should show: SIP_TEMPORARY_UNDERPERFORMANCE flag
- Impact: "Normal market cycle - no action required"
- Severity: 35 (LOW - green bar)

**Ask: "Tell me about the performance issues"**
- Expected: P1 (Market Intelligence) panel highlighted
- Should show: UNDERPERFORMANCE flag
- Severity: 88 (HIGH - orange bar)

---

## **TEST 3: Market/News Question** 📈
### What It Tests: WEB_SEARCH route

**Step 1: Ask about current market**
```
Type: "How is Nifty doing today?"
OR
Type: "What about market news?"
OR
Type: "Tell me about current interest rates"
OR
Type: "How's the economy?"
OR
Type: "What's the market trend?"
```

**Expected Result:**
1. ✅ Loading indicator: "Searching web..."
2. ✅ Message shows with "Live Web Data" badge (green)
3. ✅ Answer shows live market information
4. ✅ Sources section appears with links:
   - Multiple source citations
   - Links clickable (or marked as external)

**Note:** This requires Gemini web search tool to be enabled

---

## **TEST 4: General Question** 🤔
### What It Tests: GENERAL route

**Step 1: Ask a general question**
```
Type: "Explain SIP cost averaging"
OR
Type: "What's the difference between equity and debt funds?"
OR
Type: "How should a Moderate investor think about allocation?"
OR
Type: "Tell me about rebalancing strategies"
```

**Expected Result:**
1. ✅ Loading indicator appears
2. ✅ Simple text message appears (no dashboard)
3. ✅ Gemini provides educational answer
4. ✅ No rule engine analysis (just AI response)

---

## **TEST 5: Quick Action Chips** ⚡
### What It Tests: Quick action buttons

**Step 1: At start, before typing anything**

**Expected Result:**
1. ✅ 4 quick action chips appear above input:
   - "What is Rahul's risk level?"
   - "Should I rebalance?"
   - "How is market today?"
   - "Explain SIP underperformance"

**Step 2: Click any chip**

**Expected Result:**
1. ✅ Chip text is sent as message
2. ✅ Chat flows through appropriate router
3. ✅ Chips disappear after first message

---

## **TEST 6: Client Panel Updates** 📊
### What It Tests: Sidebar reactivity

**Step 1: From TEST 1, verify client panel shows**

**Expected:**
- Client info displays correctly
- Portfolio holdings visible
- Stats accurate
- No errors in console

**Step 2: Ask another portfolio question**

**Expected:**
- Client panel updates
- Analysis summary section appears
- Shows: Risk Assessment, Rules Triggered, Confidence, Primary Action

---

## **TEST 7: Multiple Message Types in Chat** 💬
### What It Tests: Different message rendering

**Do this:** Run tests 1-5 in sequence

**Expected Result in Chat Bubbles:**
1. ✅ User messages: Blue bubbles, right-aligned
2. ✅ AI text: Gray bubbles, left-aligned, with "AI" avatar
3. ✅ Client confirm card: White card with client details + 2 buttons
4. ✅ Rule engine report: Full-width dashboard (no bubble)
5. ✅ Web result: White card with "Live Web Data" badge
6. ✅ Loading: 3 animated dots

---

## **TEST 8: Error Handling** ⚠️
### What It Tests: Error states

**Step 1: Type invalid/empty message**
```
Press Send with empty text
```

**Expected:** 
- Nothing happens (button disabled)

**Step 2: Type client name that doesn't exist**
```
Type: "Rajesh Patel analysis"
(where Rajesh Patel doesn't exist in DB)
```

**Expected:**
- Message: "I couldn't find a client named 'Rajesh Patel'"

**Step 3: If API times out (happens naturally)**

**Expected:**
- Error message: "Sorry, I encountered an error. Please try again."
- User can still type and retry

---

## **TEST 9: Responsive Design** 📱
### What It Tests: Mobile/tablet layout

**Step 1: Resize window to mobile (375px width)**

**Expected:**
- Chat takes full width
- Client panel stacks below (or hidden with toggle)
- Buttons resize appropriately
- Text remains readable

**Step 2: Resize to tablet (768px width)**

**Expected:**
- Layout adapts gracefully
- Dashboard visible but compact
- All functionality works

---

## **TEST 10: Input & Interaction** 🎮
### What It Tests: UI interactions

**Test send button:**
- Empty text: Disabled (grayed out)
- With text: Enabled (blue)
- Loading state: Shows "..." instead of "Send"

**Test Enter key:**
```
Type message and press Enter
```
**Expected:** Message sends (same as clicking Send)

**Test auto-scroll:**
- As new messages appear, chat auto-scrolls to bottom

**Test placeholder:**
- Input shows: "Ask about portfolio, market news, or type a client name..."

---

## **Quick Test Sequence (5 minutes)** ⏱️

Run these tests in order:

```
1. Open app → See placeholder text ✓
2. Type: "Rahul Sharma" → See confirmation ✓
3. Click: "Yes, Full Analysis" → See dashboard ✓
4. Type: "Should we rebalance?" → See rule engine ✓
5. Type: "How is Nifty?" → See live data ✓
6. Type: "Explain SIP" → See text answer ✓
7. Check: Client panel updates ✓
8. Check: All 8 rules triggered ✓
9. Verify: No console errors ✓
```

---

## **Expected Test Results Matrix**

| Test | Route | Input | Expected Output | Status |
|------|-------|-------|-----------------|--------|
| 1a | CLIENT_DETECT | "Rahul Sharma" | Confirmation card | ✓ |
| 1b | PORTFOLIO | Click "Full Analysis" | Dashboard + sidebar | ✓ |
| 2a | PORTFOLIO | "rebalance?" | Dashboard + AI | ✓ |
| 2b | PORTFOLIO | "SIP performance?" | P6 panel + low severity | ✓ |
| 3 | WEB_SEARCH | "Nifty today?" | Live data + sources | ✓ |
| 4 | GENERAL | "Explain SIP?" | Text answer only | ✓ |
| 5 | ROUTER | Click chip | Auto-route correctly | ✓ |
| 6 | UI | Portfolio change | Panel updates | ✓ |
| 7 | RENDERING | Multi-type messages | All render correctly | ✓ |
| 8 | ERROR | Invalid input | Graceful handling | ✓ |
| 9 | RESPONSIVE | Resize window | Layout adapts | ✓ |
| 10 | INPUT | Interactions | All work smoothly | ✓ |

---

## **Dashboard Deep Dive Test** 🔍

When dashboard appears, verify each section:

**✅ SUMMARY STATS**
- Risk Level: Shows "CRITICAL" in red badge
- Rules Triggered: Shows "8 / 8"
- Primary Action: Shows "REBALANCE" in bold
- Confidence: Shows "92%"

**✅ PANELS (Click each tab)**
- P0 Risk & Portfolio: 2 flags (OVEREXPOSED_EQUITY 95, LOW_DEFENSIVE_ALLOCATION 72)
- P1 Market: 2 flags (HIGH_VOLATILITY_IMPACT 90, UNDERPERFORMANCE 88)
- P2 Cash Flow: 1 flag (RECENT_EQUITY_INCREASE 80)
- P4 Behavior: 1 flag (PERFORMANCE_CHASING 85)
- P5 Recommendations: 1 flag (REBALANCE_RECOMMENDED 90)
- P6 Support: 1 flag (SIP_TEMPORARY_UNDERPERFORMANCE 35)

**✅ SEVERITY BARS**
- Score > 80 (Red): OVEREXPOSED_EQUITY (95), HIGH_VOLATILITY (90), REBALANCE (90)
- Score 60-80 (Orange): UNDERPERFORMANCE (88), CHASING (85), RECENT_INCREASE (80)
- Score < 60 (Green): LOW_DEFENSIVE (72), SIP_TEMP (35)

**✅ ACTIONS**
- REBALANCE: Shows "Critical" + "4 rules"
- REVIEW_ALLOCATION: Shows "High" + "1 rule"
- INCREASE_DEBT: Shows "Medium" + "1 rule"
- REVIEW_TRANSACTION: Shows "Medium" + "1 rule"
- EDUCATION: Shows "Low" + "1 rule"

**✅ TALKING POINTS**
- Critical (red dot): 3 points about equity exposure
- High (orange dot): 5 points about performance & behavior
- Low (green dot): 1 point about SIP cost-averaging

---

## **Console Checks** 🖥️

Open browser DevTools (F12) and check:

**No errors should appear:**
- ✓ No red error messages
- ✓ No "undefined" errors
- ✓ No failed API calls (unless expected)

**Network tab should show:**
- ✓ Successful API calls to `/api/rule-engine/analyze`
- ✓ Successful API calls to `/api/clients/search`
- ✓ HTTP 200 responses

**Performance:**
- ✓ Rule engine analysis < 100ms
- ✓ Dashboard renders < 500ms
- ✓ Smooth animations (no jank)

---

## **Sample Data Verification** 📋

When dashboard shows, verify sample client data is correct:

```json
{
  "client_id": "client_uuid_8a3f21",
  "risk_profile": "Moderate",
  "portfolio": {
    "equity_pct": 72,      ← Shows as percentage
    "debt_pct": 16,        ← Shows as percentage
    "hybrid_pct": 8,       ← Shows as percentage
    "cash_pct": 4          ← Shows as percentage
  },
  "performance": {
    "return_1m": -2.4,     ← Negative = underperformance flag
    "benchmark_1m": -0.8,  ← Portfolio worse than benchmark
    "return_3m": 3.1,
    "return_1y": 11.2
  },
  "market": {
    "trend": "bullish",         ← + increase_equity = chasing
    "volatility_index": 24      ← > 20 = high volatility impact
  },
  "behavior": {
    "last_action": "increase_equity"  ← + bullish = chasing
  },
  "transactions": {
    "recent_equity_increase": true    ← Triggers recent increase flag
  }
}
```

All 8 rules should trigger on this data ✓

---

## **Troubleshooting During Testing**

**Dashboard not showing?**
- Check browser console for errors
- Verify backend API is running (http://localhost:3001)
- Check that `/api/rule-engine/analyze` endpoint is accessible

**Client confirmation not showing?**
- Verify client search endpoint working
- Check that name detection logic triggered
- Look in console for route detection logs

**Sidebar not updating?**
- Verify CopilotChatPage is imported correctly
- Check that selectedClient state is being set
- Look for React errors in console

**Styling looks off?**
- Clear browser cache (Ctrl+Shift+Delete)
- Rebuild frontend (npm run build)
- Check that Tailwind CSS is loaded

**Rules not all triggering?**
- Verify sample data in CopilotChatPage.jsx
- Check rule conditions in ruleEngine.js
- All 8 should trigger on provided sample data

---

## **Success Criteria** ✅

Your PS07 implementation is working if:

1. ✅ Client detection recognizes "Rahul Sharma"
2. ✅ Confirmation card shows with correct client details
3. ✅ Full Analysis button triggers rule engine
4. ✅ Dashboard shows all 6 panels with insights
5. ✅ All 8 rules triggered (showing 8/8)
6. ✅ Severity bars show correct colors (Red/Orange/Green)
7. ✅ Recommended actions list shows 5 actions
8. ✅ Talking points organized by priority
9. ✅ Client panel updates with analysis summary
10. ✅ Portfolio questions trigger dashboard
11. ✅ Market questions use web search
12. ✅ General questions bypass rule engine
13. ✅ Quick chips work and send messages
14. ✅ No console errors
15. ✅ Responsive on mobile/tablet

**If all 15 checks pass: PS07 is fully functional! 🎉**

---

## **Record Your Testing**

Screenshots to capture:
1. Initial state with quick chips
2. Client confirmation card
3. Full rule engine dashboard
4. Each panel (P0-P6)
5. Recommended actions
6. Talking points sections
7. Client panel sidebar
8. Chat history with multiple message types
9. Web search result
10. Mobile responsive view

These screenshots prove your implementation works!

---

**Good luck testing! Let me know if you need help with any specific scenario. 🚀**
