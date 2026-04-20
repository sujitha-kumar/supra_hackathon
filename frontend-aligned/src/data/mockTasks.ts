import type { Task } from '../types/task';

const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);
const nextWeek = new Date(today);
nextWeek.setDate(nextWeek.getDate() + 7);
const twoDaysAgo = new Date(today);
twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Review portfolio rebalancing for Sarah Johnson',
    description: 'Equity allocation is 5% above target. Need to rebalance within 7 days.',
    priority: 'urgent',
    status: 'pending',
    dueDate: yesterday,
    assignee: 'You',
    clientName: 'Sarah Johnson',
    tags: ['Portfolio', 'Compliance'],
  },
  {
    id: '2',
    title: 'Schedule Q4 review meeting with James Wilson',
    description: 'Quarterly portfolio performance review and future strategy discussion.',
    priority: 'high',
    status: 'pending',
    dueDate: twoDaysAgo,
    assignee: 'You',
    clientName: 'James Wilson',
    tags: ['Meeting', 'Review'],
  },
  {
    id: '3',
    title: 'Update KYC documents for Lisa Anderson',
    description: 'KYC update required. Documents expire in 5 days.',
    priority: 'high',
    status: 'in-progress',
    dueDate: today,
    assignee: 'You',
    clientName: 'Lisa Anderson',
    tags: ['Compliance', 'KYC'],
  },
  {
    id: '4',
    title: 'Generate tax optimization report for Michael Chen',
    description: 'Prepare detailed tax-loss harvesting opportunities report.',
    priority: 'medium',
    status: 'pending',
    dueDate: today,
    assignee: 'You',
    clientName: 'Michael Chen',
    tags: ['Tax', 'Report'],
  },
  {
    id: '5',
    title: 'Follow up on compliance alert for Emily Rodriguez',
    description: 'Address high risk portfolio allocation and rebalancing requirements.',
    priority: 'urgent',
    status: 'pending',
    dueDate: today,
    assignee: 'You',
    clientName: 'Emily Rodriguez',
    tags: ['Compliance', 'Risk'],
  },
  {
    id: '6',
    title: 'Prepare investment proposal for new client',
    description: 'Create customized investment strategy proposal for prospective client.',
    priority: 'medium',
    status: 'pending',
    dueDate: tomorrow,
    assignee: 'You',
    tags: ['Proposal', 'New Client'],
  },
  {
    id: '7',
    title: 'Review and approve fund allocation changes',
    description: 'Review proposed changes to mutual fund allocations across portfolios.',
    priority: 'low',
    status: 'pending',
    dueDate: tomorrow,
    assignee: 'Team Lead',
    tags: ['Review', 'Approval'],
  },
  {
    id: '8',
    title: 'Conduct risk assessment for high-value portfolios',
    description: 'Quarterly risk assessment for portfolios above $2M AUM.',
    priority: 'medium',
    status: 'pending',
    dueDate: nextWeek,
    assignee: 'You',
    tags: ['Risk', 'Assessment'],
  },
];
