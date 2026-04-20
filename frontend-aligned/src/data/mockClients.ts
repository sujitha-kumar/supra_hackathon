export interface Client {
  id: number;
  name: string;
  company: string;
  email: string;
  status: 'active' | 'inactive' | 'pending';
  lastContact: string;
  revenue: string;
  projects: number;
}

export const mockClients: Client[] = [
  {
    id: 1,
    name: 'Sarah Johnson',
    company: 'TechCorp Industries',
    email: 'sarah.j@techcorp.com',
    status: 'active',
    lastContact: '2 hours ago',
    revenue: '$45,000',
    projects: 3,
  },
  {
    id: 2,
    name: 'Michael Chen',
    company: 'Digital Solutions Inc',
    email: 'mchen@digitalsol.com',
    status: 'active',
    lastContact: '5 hours ago',
    revenue: '$32,500',
    projects: 2,
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    company: 'Global Ventures',
    email: 'emily.r@globalventures.com',
    status: 'pending',
    lastContact: '1 day ago',
    revenue: '$28,000',
    projects: 1,
  },
  {
    id: 4,
    name: 'James Wilson',
    company: 'Innovation Labs',
    email: 'jwilson@innovationlabs.com',
    status: 'active',
    lastContact: '3 hours ago',
    revenue: '$52,000',
    projects: 4,
  },
  {
    id: 5,
    name: 'Lisa Anderson',
    company: 'Startup Hub',
    email: 'lisa@startuphub.io',
    status: 'inactive',
    lastContact: '1 week ago',
    revenue: '$18,500',
    projects: 1,
  },
];
