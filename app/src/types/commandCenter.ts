export interface CommandEvent {
  id: string;
  title: string;
  category: 'Workshops' | 'Hackathons' | 'Talks' | 'Competitions' | 'Technical Event';
  year: number;
  description: string;
  officialUrl: string;
  isOfficialCspit: boolean;
  isDraft?: boolean;
  date?: string | null;
  time?: string | null;
  venue?: string | null;
  targetAudience?: string;
  teamSize?: string;
  attendeesCount?: number;
  badge?: string;
}

export interface CommandMember {
  id: string;
  name: string;
  role: string;
  domain: 'AI / ML' | 'Web App Development' | 'Cloud & DevOps' | 'Design & Media' | 'Cybersecurity' | 'Competitive Coding';
  year: string;
  branch: string;
  avatarInitials: string;
  gender: 'male' | 'female';
  isLead?: boolean;
  email?: string;
  github?: string;
}

export interface CommandProject {
  id: string;
  title: string;
  category: 'AI / Systems' | 'Robotics & IoT' | 'Campus Tools' | 'Web & Cloud' | 'Security';
  status: 'Active' | 'Completed' | 'In Development';
  isCspitHighlight?: boolean;
  description: string;
  contributorsCount: number;
  repositoryUrl?: string;
  needsDescription?: boolean;
  updatedAt: string;
}

export interface CommandAnnouncement {
  id: string;
  title: string;
  message: string;
  publishedAt: string;
  author: string;
  isDraft?: boolean;
  category: 'Event' | 'Project' | 'Administrative' | 'Workshop';
}

export interface CommandActivityItem {
  id: string;
  type: 'event' | 'member' | 'project' | 'announcement';
  title: string;
  action: string;
  timestamp: string;
  badgeColor?: string;
}

export interface MetricSummary {
  members: number;
  upcomingEvents: number;
  activeProjects: number;
  participants: number;
}
