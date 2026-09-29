export type UserRole = 'admin' | 'event_lead' | 'member';

export type EventStatus = 'Draft' | 'Published' | 'Live' | 'Completed' | 'Cancelled';

export interface ReadinessChecklist {
  venueConfirmed: boolean;
  posterApproved: boolean;
  speakersAssigned: boolean;
  volunteersEnlisted: boolean;
  announcementDrafted: boolean;
}

export interface ClubEventItem {
  id: string;
  title: string;
  category: 'Workshops' | 'Hackathons' | 'Competitions' | 'Talks';
  status: EventStatus;
  startDateTime: string; // ISO
  endDateTime: string;   // ISO
  venue: string | null;
  capacity: number;
  registeredMemberIds: string[];
  waitlistedMemberIds: string[];
  checkedInMemberIds: string[];
  description: string;
  readiness: ReadinessChecklist;
  targetDomain?: string;
  leadId: string; // memberId
  bannerTheme?: 'wizard' | 'cyber' | 'academic';
}

export interface MemberBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: string;
}

export interface ClubMemberItem {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  domain: 'AI / ML' | 'Web App Development' | 'Cloud & DevOps' | 'Design & Media' | 'Cybersecurity' | 'Competitive Coding';
  yearOrdinal: '1st Year' | '2nd Year' | '3rd Year' | '4th Year';
  branch: 'Computer Science & Engineering' | 'Information Technology' | 'Computer Engineering' | 'DEPSTAR';
  githubHandle: string;
  xp: number;
  streakWeeks: number;
  joinedAt: string; // ISO
  isCore: boolean;
  avatarSeed: string;
  bio?: string;
}

export interface ClubProjectItem {
  id: string;
  title: string;
  category: 'AI / Systems' | 'Robotics & IoT' | 'Campus Tools' | 'Web & Cloud' | 'Security';
  status: 'Active' | 'Completed' | 'In Development';
  description: string;
  leadMemberId: string;
  contributorIds: string[];
  pendingApplicantIds: string[];
  repositoryUrl: string;
  maxContributors: number;
}

export interface ApprovalRequest {
  id: string;
  type: 'membership' | 'project_join';
  applicantName: string;
  applicantId: string;
  targetTitle: string;
  targetId: string;
  domain: string;
  requestedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  note?: string;
}

export interface RegistrationMomentumPoint {
  dayLabel: string;
  registrations: number;
}
