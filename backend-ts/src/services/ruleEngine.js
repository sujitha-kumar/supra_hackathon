/**
 * Rule Engine for RM Talking Framework
 * Evaluates 8 rules against client portfolio data
 * Generates actionable insights and talking points
 */

class RuleEngine {
  constructor() {
    this.engineVersion = '3.0';
    this.rulesEvaluated = 0;
    this.rulesTriggered = [];
    this.startTime = Date.now();
  }

  /**
   * Main entry point - analyzes client data and returns structured output
   */
  analyzeClient(clientData) {
    this.startTime = Date.now();
    this.rulesTriggered = [];

    // Evaluate all 8 rules
    const insights = {
      P0: this.evaluateP0Rules(clientData), // Risk & Portfolio Overview
      P1: this.evaluateP1Rules(clientData), // Market Intelligence
      P2: this.evaluateP2Rules(clientData), // Cash Flow & Transactions
      P4: this.evaluateP4Rules(clientData), // User Behavior
      P5: this.evaluateP5Rules(clientData), // Product Recommendations
      P6: this.evaluateP6Rules(clientData), // Support & Assistance
    };

    // Calculate overall risk level
    const overallRiskLevel = this.calculateOverallRiskLevel(insights);
    const primaryAction = this.determinePrimaryAction(insights);
    const confidence = this.calculateConfidence();

    // Build response
    return {
      client_id: clientData.client_id,
      engine_version: this.engineVersion,
      generated_at: new Date().toISOString(),

      summary: {
        overall_risk_level: overallRiskLevel,
        overall_confidence: confidence,
        top_flags: this.getTopFlags(insights),
        primary_action: primaryAction,
      },

      panels: {
        P0: { title: 'User Risk & Portfolio Overview', ...insights.P0 },
        P1: { title: 'Market Intelligence', ...insights.P1 },
        P2: { title: 'Cash Flow & Transactions', ...insights.P2 },
        P4: { title: 'User Behavior', ...insights.P4 },
        P5: { title: 'Product Recommendations', ...insights.P5 },
        P6: { title: 'Support & Assistance', ...insights.P6 },
      },

      actions: this.buildActions(insights),
      talking_points_flat: this.buildTalkingPointsByPriority(insights),

      meta: {
        rules_evaluated: 8,
        rules_triggered: this.rulesTriggered,
        overall_confidence: confidence,
        execution_time_ms: Date.now() - this.startTime,
      },
    };
  }

  /**
   * P0: User Risk & Portfolio Overview
   * Rules: RISK_OVEREXPOSURE, LOW_DEBT_ALLOCATION
   */
  evaluateP0Rules(data) {
    const insights = [];

    // Rule 1: RISK_OVEREXPOSURE
    if (data.risk_profile === 'Moderate' && data.portfolio.equity_pct > 65) {
      this.rulesTriggered.push('RISK_OVEREXPOSURE');
      insights.push({
        flag: 'OVEREXPOSED_EQUITY',
        rule_id: 'RISK_OVEREXPOSURE',
        severity_score: 95,
        severity_label: 'critical',
        confidence_score: 0.95,
        message: 'Equity allocation exceeds recommended range for your risk profile',
        impact: 'Higher downside risk during periods of market volatility',
        explanation: `Client's equity exposure is ${data.portfolio.equity_pct}%, above the 65% threshold for Moderate risk.`,
        linked_actions: ['REBALANCE'],
      });
    }

    // Rule 6: LOW_DEBT_ALLOCATION
    if (data.portfolio.debt_pct < 20) {
      this.rulesTriggered.push('LOW_DEBT_ALLOCATION');
      insights.push({
        flag: 'LOW_DEFENSIVE_ALLOCATION',
        rule_id: 'LOW_DEBT_ALLOCATION',
        severity_score: 72,
        severity_label: 'medium',
        confidence_score: 0.88,
        message: 'Debt allocation is below the recommended defensive floor',
        impact: 'Reduced downside protection during market downturns',
        explanation: `Debt allocation of ${data.portfolio.debt_pct}% is below the 20% minimum floor.`,
        linked_actions: ['INCREASE_DEBT'],
      });
    }

    return { insights, talking_points: [] };
  }

  /**
   * P1: Market Intelligence
   * Rules: PERFORMANCE_UNDERPERFORMANCE, HIGH_VOLATILITY_IMPACT
   */
  evaluateP1Rules(data) {
    const insights = [];

    // Rule 2: PERFORMANCE_UNDERPERFORMANCE
    if (data.performance.return_1m < data.performance.benchmark_1m) {
      this.rulesTriggered.push('PERFORMANCE_UNDERPERFORMANCE');
      const diff = (data.performance.return_1m - data.performance.benchmark_1m).toFixed(1);
      insights.push({
        flag: 'UNDERPERFORMANCE',
        rule_id: 'PERFORMANCE_UNDERPERFORMANCE',
        severity_score: 88,
        severity_label: 'high',
        confidence_score: 0.91,
        message: 'Portfolio has underperformed the benchmark over the past month',
        impact: 'Client dissatisfaction risk and potential redemption pressure',
        explanation: `Portfolio returned ${data.performance.return_1m}% vs benchmark ${data.performance.benchmark_1m}% (gap: ${diff}%).`,
        linked_actions: ['REVIEW_ALLOCATION'],
      });
    }

    // Rule 7: HIGH_VOLATILITY_IMPACT
    if (data.market.volatility_index > 20 && data.portfolio.equity_pct > 65) {
      this.rulesTriggered.push('HIGH_VOLATILITY_IMPACT');
      insights.push({
        flag: 'HIGH_VOLATILITY_IMPACT',
        rule_id: 'HIGH_VOLATILITY_IMPACT',
        severity_score: 90,
        severity_label: 'critical',
        confidence_score: 0.89,
        message: 'High equity exposure is amplifying the impact of current market volatility',
        impact: 'Higher drawdown versus benchmark during the current correction',
        explanation: `VIX at ${data.market.volatility_index} with ${data.portfolio.equity_pct}% equity creates amplified downside.`,
        linked_actions: ['REBALANCE'],
      });
    }

    return { insights, talking_points: [] };
  }

  /**
   * P2: Cash Flow & Transactions
   * Rules: RECENT_EQUITY_INCREASE
   */
  evaluateP2Rules(data) {
    const insights = [];

    // Rule 8: RECENT_EQUITY_INCREASE
    if (data.transactions.recent_equity_increase && data.portfolio.equity_pct > 60) {
      this.rulesTriggered.push('RECENT_EQUITY_INCREASE');
      insights.push({
        flag: 'RECENT_EQUITY_INCREASE',
        rule_id: 'RECENT_EQUITY_INCREASE',
        severity_score: 80,
        severity_label: 'high',
        confidence_score: 0.85,
        message: 'Recent transaction increased equity allocation at elevated valuation levels',
        impact: 'Portfolio risk increased at a point of high market valuations',
        explanation: 'A recent buy/switch transaction has raised equity exposure, increasing downside sensitivity.',
        linked_actions: ['REVIEW_TRANSACTION'],
      });
    }

    return { insights, talking_points: [] };
  }

  /**
   * P4: User Behavior
   * Rules: BEHAVIOR_PERFORMANCE_CHASING
   */
  evaluateP4Rules(data) {
    const insights = [];

    // Rule 4: BEHAVIOR_PERFORMANCE_CHASING
    if (data.behavior.last_action === 'increase_equity' && data.market.trend === 'bullish') {
      this.rulesTriggered.push('BEHAVIOR_PERFORMANCE_CHASING');
      insights.push({
        flag: 'PERFORMANCE_CHASING',
        rule_id: 'BEHAVIOR_PERFORMANCE_CHASING',
        severity_score: 85,
        severity_label: 'high',
        confidence_score: 0.87,
        message: 'Equity allocation was increased during a bullish market phase',
        impact: 'Higher correction risk — buying high increases exposure at peak valuations',
        explanation: 'Client increased equity during bullish trend—classic performance-chasing pattern.',
        linked_actions: ['REBALANCE'],
      });
    }

    return { insights, talking_points: [] };
  }

  /**
   * P5: Product Recommendations
   * Rules: REBALANCE_REQUIRED
   */
  evaluateP5Rules(data) {
    const insights = [];

    // Rule 5: REBALANCE_REQUIRED
    if (data.portfolio.equity_pct > 70 && data.risk_profile === 'Moderate') {
      this.rulesTriggered.push('REBALANCE_REQUIRED');
      insights.push({
        flag: 'REBALANCE_RECOMMENDED',
        rule_id: 'REBALANCE_REQUIRED',
        severity_score: 90,
        severity_label: 'critical',
        confidence_score: 0.94,
        message: 'Portfolio rebalancing is strongly recommended',
        impact: 'Continued overexposure increases downside risk and misalignment with client goals',
        explanation: `Equity at ${data.portfolio.equity_pct}% exceeds 70% for Moderate profile. Reduce by 10-15%.`,
        linked_actions: ['REBALANCE'],
        suggested_instruments: ['debt_fund', 'hybrid_fund', 'liquid_fund'],
      });
    }

    return { insights, talking_points: [] };
  }

  /**
   * P6: Support & Assistance
   * Rules: SIP_SHORT_TERM_LOSS
   */
  evaluateP6Rules(data) {
    const insights = [];

    // Rule 3: SIP_SHORT_TERM_LOSS
    if (data.portfolio.sip_active && data.performance.return_1m < 0) {
      this.rulesTriggered.push('SIP_SHORT_TERM_LOSS');
      insights.push({
        flag: 'SIP_TEMPORARY_UNDERPERFORMANCE',
        rule_id: 'SIP_SHORT_TERM_LOSS',
        severity_score: 35,
        severity_label: 'low',
        confidence_score: 0.96,
        message: 'SIP is experiencing short-term negative returns due to market volatility',
        impact: 'Normal market cycle behaviour — no corrective action required',
        explanation: `SIP showing ${data.performance.return_1m}% return. Normal during corrections—RCA benefit applies.`,
        linked_actions: ['EDUCATION'],
      });
    }

    return { insights, talking_points: [] };
  }

  /**
   * Calculate overall risk level based on triggered rules and severity scores
   */
  calculateOverallRiskLevel(insights) {
    let maxSeverity = 0;
    Object.values(insights).forEach((panel) => {
      panel.insights.forEach((insight) => {
        maxSeverity = Math.max(maxSeverity, insight.severity_score);
      });
    });

    if (maxSeverity >= 85) return 'critical';
    if (maxSeverity >= 70) return 'high';
    if (maxSeverity >= 50) return 'medium';
    return 'low';
  }

  /**
   * Determine primary action from all triggered rules
   */
  determinePrimaryAction(insights) {
    const actionCounts = {};
    Object.values(insights).forEach((panel) => {
      panel.insights.forEach((insight) => {
        insight.linked_actions?.forEach((action) => {
          actionCounts[action] = (actionCounts[action] || 0) + 1;
        });
      });
    });

    const topAction = Object.entries(actionCounts).sort(([, a], [, b]) => b - a)[0];
    return topAction ? topAction[0] : 'REVIEW_PORTFOLIO';
  }

  /**
   * Get top 5 flags by severity
   */
  getTopFlags(insights) {
    const allInsights = [];
    Object.values(insights).forEach((panel) => {
      allInsights.push(...panel.insights);
    });

    return allInsights
      .sort((a, b) => b.severity_score - a.severity_score)
      .slice(0, 5)
      .map((i) => i.flag);
  }

  /**
   * Build recommended actions from insights
   */
  buildActions(insights) {
    const actionMap = new Map();

    Object.values(insights).forEach((panel) => {
      panel.insights.forEach((insight) => {
        insight.linked_actions?.forEach((action) => {
          if (!actionMap.has(action)) {
            actionMap.set(action, {
              action_id: action,
              source_rules: [],
            });
          }
          actionMap.get(action).source_rules.push(insight.rule_id);
        });
      });
    });

    // Enrich actions with descriptions
    const actionDescriptions = {
      REBALANCE: {
        priority: 'critical',
        suggestion: 'Reduce equity allocation by 10–15% and reallocate to debt or hybrid funds',
        suggested_instruments: ['debt_fund', 'hybrid_fund', 'liquid_fund'],
      },
      REVIEW_ALLOCATION: {
        priority: 'high',
        suggestion: 'Review current asset allocation against benchmark and risk profile targets',
        suggested_instruments: [],
      },
      INCREASE_DEBT: {
        priority: 'medium',
        suggestion: 'Increase debt allocation to minimum 20% to improve downside protection',
        suggested_instruments: ['short_duration_fund', 'corporate_bond_fund'],
      },
      REVIEW_TRANSACTION: {
        priority: 'medium',
        suggestion: 'Review the recent equity increase transaction and assess whether partial reversal is appropriate',
        suggested_instruments: [],
      },
      EDUCATION: {
        priority: 'low',
        suggestion: 'Share SIP cost-averaging explainer content with the client to build conviction',
        suggested_instruments: [],
      },
    };

    return Array.from(actionMap.values())
      .map((action) => ({
        ...action,
        ...(actionDescriptions[action.action_id] || {}),
      }))
      .sort((a, b) => {
        const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      });
  }

  /**
   * Build talking points organized by priority
   */
  buildTalkingPointsByPriority(insights) {
    const talkingPoints = {
      critical: [],
      high: [],
      medium: [],
      low: [],
    };

    const pointTemplates = {
      OVEREXPOSED_EQUITY: [
        {
          priority: 'critical',
          text: 'Your equity exposure is currently higher than recommended for your risk profile.',
          persona: 'balanced',
        },
        {
          priority: 'high',
          text: 'This is amplifying the impact of recent market corrections on your portfolio value.',
          persona: 'risk_explainer',
        },
      ],
      LOW_DEFENSIVE_ALLOCATION: [
        {
          priority: 'medium',
          text: 'Your portfolio currently has limited exposure to safer, defensive assets.',
          persona: 'balanced',
        },
        {
          priority: 'medium',
          text: 'Adding debt or hybrid funds can provide a cushion while keeping your growth exposure intact.',
          persona: 'balanced',
        },
      ],
      UNDERPERFORMANCE: [
        {
          priority: 'high',
          text: 'Your portfolio has slightly underperformed the benchmark this month.',
          persona: 'balanced',
        },
        {
          priority: 'high',
          text: 'This is primarily driven by higher equity allocation during a period of market correction.',
          persona: 'risk_explainer',
        },
      ],
      HIGH_VOLATILITY_IMPACT: [
        {
          priority: 'critical',
          text: 'Current market volatility is having a magnified effect on your portfolio due to high equity exposure.',
          persona: 'risk_explainer',
        },
      ],
      RECENT_EQUITY_INCREASE: [
        {
          priority: 'high',
          text: 'Your recent transaction has increased your equity allocation at a time when markets are trading at elevated levels.',
          persona: 'risk_explainer',
        },
      ],
      PERFORMANCE_CHASING: [
        {
          priority: 'high',
          text: 'You recently increased equity exposure during a strong market phase — a common but risky pattern.',
          persona: 'balanced',
        },
      ],
      REBALANCE_RECOMMENDED: [
        {
          priority: 'critical',
          text: 'We recommend rebalancing your portfolio to bring it in line with your risk profile.',
          persona: 'balanced',
        },
        {
          priority: 'high',
          text: 'Shifting 10–15% from equity into debt or hybrid funds can reduce volatility meaningfully.',
          persona: 'balanced',
        },
      ],
      SIP_TEMPORARY_UNDERPERFORMANCE: [
        {
          priority: 'low',
          text: 'Your SIP is currently showing a short-term dip — this is entirely normal during a market correction.',
          persona: 'sip_educator',
        },
        {
          priority: 'low',
          text: 'Lower prices actually work in your favour — you are accumulating more units at a reduced cost.',
          persona: 'sip_educator',
        },
      ],
    };

    // Populate from triggered rules
    this.rulesTriggered.forEach((rule) => {
      Object.values(insights).forEach((panel) => {
        panel.insights.forEach((insight) => {
          if (insight.rule_id === rule && pointTemplates[insight.flag]) {
            pointTemplates[insight.flag].forEach((tp) => {
              talkingPoints[tp.priority].push({
                text: tp.text,
                source_rule: rule,
                persona: tp.persona,
              });
            });
          }
        });
      });
    });

    return talkingPoints;
  }

  /**
   * Calculate overall confidence score
   */
  calculateConfidence() {
    if (this.rulesTriggered.length === 0) return 0.5;
    if (this.rulesTriggered.length <= 2) return 0.75;
    if (this.rulesTriggered.length <= 4) return 0.85;
    return 0.92;
  }
}

module.exports = new RuleEngine();
