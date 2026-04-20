export interface PortfolioData {
  totalAUM: string;
  ytdReturn: number;
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'very-high';
  allocations: {
    equity: number;
    debt: number;
    gold: number;
    cash: number;
  };
  performance: {
    month: string;
    value: number;
  }[];
  holdings: {
    id: number;
    name: string;
    type: string;
    value: string;
    allocation: number;
    return: number;
  }[];
  transactions: {
    id: number;
    date: string;
    type: 'buy' | 'sell' | 'dividend';
    asset: string;
    amount: string;
    status: 'completed' | 'pending';
  }[];
}

export const mockPortfolioData: PortfolioData = {
  totalAUM: '$2,450,000',
  ytdReturn: 12.5,
  riskScore: 65,
  riskLevel: 'medium',
  allocations: {
    equity: 55,
    debt: 30,
    gold: 10,
    cash: 5,
  },
  performance: [
    { month: 'Jan', value: 2100000 },
    { month: 'Feb', value: 2150000 },
    { month: 'Mar', value: 2200000 },
    { month: 'Apr', value: 2180000 },
    { month: 'May', value: 2250000 },
    { month: 'Jun', value: 2300000 },
    { month: 'Jul', value: 2350000 },
    { month: 'Aug', value: 2400000 },
    { month: 'Sep', value: 2420000 },
    { month: 'Oct', value: 2450000 },
  ],
  holdings: [
    {
      id: 1,
      name: 'Nifty 50 Index Fund',
      type: 'Equity',
      value: '$1,347,500',
      allocation: 55,
      return: 15.2,
    },
    {
      id: 2,
      name: 'Corporate Bond Fund',
      type: 'Debt',
      value: '$735,000',
      allocation: 30,
      return: 7.8,
    },
    {
      id: 3,
      name: 'Gold ETF',
      type: 'Gold',
      value: '$245,000',
      allocation: 10,
      return: 8.5,
    },
    {
      id: 4,
      name: 'Liquid Fund',
      type: 'Cash',
      value: '$122,500',
      allocation: 5,
      return: 4.2,
    },
  ],
  transactions: [
    {
      id: 1,
      date: '2024-01-15',
      type: 'buy',
      asset: 'Nifty 50 Index Fund',
      amount: '$50,000',
      status: 'completed',
    },
    {
      id: 2,
      date: '2024-01-10',
      type: 'dividend',
      asset: 'Corporate Bond Fund',
      amount: '$2,500',
      status: 'completed',
    },
    {
      id: 3,
      date: '2024-01-05',
      type: 'sell',
      asset: 'Gold ETF',
      amount: '$10,000',
      status: 'completed',
    },
  ],
};
