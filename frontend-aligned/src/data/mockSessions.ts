import type { ChatSession, PinnedOutput } from '../types/session';

export const mockSessions: ChatSession[] = [
  {
    id: '1',
    title: 'Portfolio Rebalancing Discussion',
    clientName: 'Sarah Johnson',
    timestamp: new Date('2024-01-20T14:30:00'),
    messageCount: 12,
    isPinned: true,
    summary: 'Discussed equity allocation adjustment and risk management strategies',
    tags: ['Portfolio', 'Risk'],
    messages: [
      {
        id: '1-1',
        content: 'Can you analyze Sarah Johnson\'s portfolio allocation?',
        sender: 'user',
        timestamp: new Date('2024-01-20T14:30:00'),
      },
      {
        id: '1-2',
        content: 'Based on Sarah Johnson\'s portfolio, here\'s the current allocation:\n\n✓ Equity: 55%\n✓ Debt: 30%\n✓ Gold: 10%\n✓ Cash: 5%\n\nThe equity allocation is 5% above the target of 50%. I recommend rebalancing to align with the medium risk profile.',
        sender: 'ai',
        timestamp: new Date('2024-01-20T14:30:30'),
      },
      {
        id: '1-3',
        content: 'What specific actions should we take?',
        sender: 'user',
        timestamp: new Date('2024-01-20T14:31:00'),
      },
      {
        id: '1-4',
        content: 'Recommended actions:\n\n1. Sell 5% equity positions\n2. Move funds to debt instruments\n3. Focus on tax-efficient debt funds\n4. Timeline: Complete within 7 days\n\nThis will bring the portfolio back to target allocation and maintain risk compliance.',
        sender: 'ai',
        timestamp: new Date('2024-01-20T14:31:30'),
      },
    ],
  },
  {
    id: '2',
    title: 'Tax Optimization Strategy',
    clientName: 'Michael Chen',
    timestamp: new Date('2024-01-19T10:15:00'),
    messageCount: 8,
    isPinned: false,
    summary: 'Explored tax-loss harvesting and long-term capital gains strategies',
    tags: ['Tax', 'Optimization'],
    messages: [
      {
        id: '2-1',
        content: 'What tax optimization opportunities exist for Michael Chen?',
        sender: 'user',
        timestamp: new Date('2024-01-19T10:15:00'),
      },
      {
        id: '2-2',
        content: 'Tax optimization opportunities for Michael Chen:\n\n💰 Key Strategies:\n1. Tax-loss harvesting: Potential savings of $5,000\n2. Long-term capital gains: Hold positions for 3+ months\n3. Switch to tax-efficient debt funds\n\nEstimated annual tax savings: $8,000-$12,000',
        sender: 'ai',
        timestamp: new Date('2024-01-19T10:15:30'),
      },
    ],
  },
  {
    id: '3',
    title: 'Risk Assessment Review',
    clientName: 'Emily Rodriguez',
    timestamp: new Date('2024-01-18T16:45:00'),
    messageCount: 15,
    isPinned: true,
    summary: 'Comprehensive risk analysis and mitigation recommendations',
    tags: ['Risk', 'Analysis'],
    messages: [
      {
        id: '3-1',
        content: 'Analyze the risk factors for Emily Rodriguez',
        sender: 'user',
        timestamp: new Date('2024-01-18T16:45:00'),
      },
      {
        id: '3-2',
        content: 'Risk analysis for Emily Rodriguez:\n\n⚠️ Risk Score: 75/100 (high risk)\n\nKey factors:\n• High equity concentration (65%)\n• Market volatility exposure\n• Limited diversification\n\nRecommendation: Immediate rebalancing required to reduce risk exposure.',
        sender: 'ai',
        timestamp: new Date('2024-01-18T16:45:30'),
      },
    ],
  },
  {
    id: '4',
    title: 'Quarterly Performance Review',
    clientName: 'James Wilson',
    timestamp: new Date('2024-01-17T11:00:00'),
    messageCount: 20,
    isPinned: false,
    summary: 'Q4 performance analysis and future investment recommendations',
    tags: ['Performance', 'Review'],
    messages: [
      {
        id: '4-1',
        content: 'Give me a quarterly performance summary for James Wilson',
        sender: 'user',
        timestamp: new Date('2024-01-17T11:00:00'),
      },
      {
        id: '4-2',
        content: 'Q4 Performance Summary for James Wilson:\n\n📊 Results:\n• Total Return: +15.7%\n• Benchmark: +12.3%\n• Outperformance: +3.4%\n\nTop performers:\n1. Equity funds: +18.2%\n2. Debt funds: +7.8%\n\nExcellent performance across all asset classes.',
        sender: 'ai',
        timestamp: new Date('2024-01-17T11:00:30'),
      },
    ],
  },
  {
    id: '5',
    title: 'Compliance Alert Resolution',
    clientName: 'Lisa Anderson',
    timestamp: new Date('2024-01-16T09:30:00'),
    messageCount: 6,
    isPinned: false,
    summary: 'Addressed compliance issues and regulatory requirements',
    tags: ['Compliance', 'Regulatory'],
    messages: [
      {
        id: '5-1',
        content: 'What compliance issues need attention for Lisa Anderson?',
        sender: 'user',
        timestamp: new Date('2024-01-16T09:30:00'),
      },
      {
        id: '5-2',
        content: 'Compliance status for Lisa Anderson:\n\n🔴 Active Alerts:\n1. KYC update required (due in 5 days)\n2. Portfolio rebalancing needed\n\n✓ All other compliance checks are green.\n\nAction required: Schedule KYC update meeting.',
        sender: 'ai',
        timestamp: new Date('2024-01-16T09:30:30'),
      },
    ],
  },
];

export const mockPinnedOutputs: PinnedOutput[] = [
  {
    id: 'p1',
    sessionId: '1',
    title: 'Rebalancing Action Plan',
    content: 'Recommended actions:\n\n1. Sell 5% equity positions\n2. Move funds to debt instruments\n3. Focus on tax-efficient debt funds\n4. Timeline: Complete within 7 days',
    timestamp: new Date('2024-01-20T14:31:30'),
  },
  {
    id: 'p2',
    sessionId: '3',
    title: 'Risk Mitigation Strategy',
    content: 'Immediate actions required:\n• Reduce equity from 65% to 50%\n• Increase debt allocation to 35%\n• Add gold for diversification (10%)\n• Maintain 5% cash buffer',
    timestamp: new Date('2024-01-18T16:45:30'),
  },
];
