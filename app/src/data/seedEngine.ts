/**
 * Data & Seed Engine (gitclub-cc-v2)
 * Deterministic generation of 96 realistic members with 0 digits in names,
 * authentic Gujarati/Indian names, fixed core team, realistic join dates,
 * 5 event states with readiness checklists, projects, and approvals queue.
 */

import { 
  ClubMemberItem, 
  ClubEventItem, 
  ClubProjectItem, 
  ApprovalRequest,
  RegistrationMomentumPoint
} from '../types/store';

const GUJARATI_FIRST_NAMES = [
  'Aarav', 'Riya', 'Kavya', 'Dev', 'Ishaan', 'Meera', 'Harsh', 'Diya',
  'Aryan', 'Ananya', 'Yash', 'Pooja', 'Rohan', 'Tanvi', 'Parth', 'Khushi',
  'Dhruv', 'Sneha', 'Manan', 'Nidhi', 'Smit', 'Krisha', 'Aditya', 'Shreya',
  'Het', 'Riddhi', 'Vivek', 'Dhyani', 'Meet', 'Mansi', 'Tirth', 'Jahnvi',
  'Nilay', 'Vrushika', 'Jay', 'Foram', 'Krunal', 'Bansi', 'Darshan', 'Maitri',
  'Bhavya', 'Isha', 'Deep', 'Vidhi', 'Pratik', 'Heer', 'Jenil', 'Aastha'
];

const GUJARATI_LAST_NAMES = [
  'Desai', 'Patel', 'Shah', 'Parmar', 'Trivedi', 'Joshi', 'Mehta', 'Dave',
  'Pandya', 'Bhatt', 'Vora', 'Raval', 'Rathod', 'Gohil', 'Zala', 'Chauhan',
  'Solanki', 'Makwana', 'Prajapati', 'Panchal', 'Soni', 'Suthar', 'Barot', 'Shukla',
  'Jani', 'Upadhyay', 'Dholakia', 'Modi', 'Thakkar', 'Somani', 'Kapadia', 'Sanghavi',
  'Kothari', 'Sheth', 'Gajjar', 'Bhalodiya', 'Bhatia', 'Acharya', 'Pujara', 'Vyas',
  'Chotai', 'Mandavia', 'Choksi', 'Chhaya', 'Kadakia', 'Bhattacharya', 'Goswami', 'Majmudar'
];

const DOMAINS: ClubMemberItem['domain'][] = [
  'Web App Development',
  'AI / ML',
  'Cloud & DevOps',
  'Cybersecurity',
  'Competitive Coding',
  'Design & Media'
];

const BRANCHES: ClubMemberItem['branch'][] = [
  'Computer Science & Engineering',
  'Information Technology',
  'Computer Engineering',
  'DEPSTAR'
];

const YEARS: ClubMemberItem['yearOrdinal'][] = [
  '1st Year',
  '2nd Year',
  '3rd Year',
  '4th Year'
];

export function generateSeedMembers(): ClubMemberItem[] {
  const members: ClubMemberItem[] = [];
  const now = new Date();

  // 1. Fixed Core Team (6 members, joined 14-24 months ago)
  const coreTeamDefs = [
    {
      name: 'Aarav Desai',
      email: 'aarav.desai@charusat.edu.in',
      role: 'admin' as const,
      domain: 'Cloud & DevOps' as const,
      yearOrdinal: '4th Year' as const,
      branch: 'Computer Science & Engineering' as const,
      githubHandle: 'aarav-desai-dev',
      xp: 850,
      streakWeeks: 12,
      monthsAgo: 22,
      bio: 'Club President & Lead System Architect. Passionate about Git internals and distributed systems.'
    },
    {
      name: 'Riya Patel',
      email: 'riya.patel@charusat.edu.in',
      role: 'event_lead' as const,
      domain: 'Web App Development' as const,
      yearOrdinal: '3rd Year' as const,
      branch: 'Information Technology' as const,
      githubHandle: 'riya-patel-git',
      xp: 720,
      streakWeeks: 9,
      monthsAgo: 18,
      bio: 'VP Events & Community Lead. Curator of Code Wizards Hackathon and Git Bootcamp.'
    },
    {
      name: 'Kavya Shah',
      email: 'kavya.shah@charusat.edu.in',
      role: 'event_lead' as const,
      domain: 'AI / ML' as const,
      yearOrdinal: '3rd Year' as const,
      branch: 'Computer Science & Engineering' as const,
      githubHandle: 'kavya-shah-ai',
      xp: 680,
      streakWeeks: 8,
      monthsAgo: 16,
      bio: 'Workshops Coordinator & Machine Learning enthusiast. Focused on open source tooling.'
    },
    {
      name: 'Dev Parmar',
      email: 'dev.parmar@charusat.edu.in',
      role: 'admin' as const,
      domain: 'Cybersecurity' as const,
      yearOrdinal: '4th Year' as const,
      branch: 'Computer Engineering' as const,
      githubHandle: 'dev-parmar-sec',
      xp: 800,
      streakWeeks: 11,
      monthsAgo: 20,
      bio: 'Technical Council Admin. Infrastructure security and campus CI/CD pipelines maintainer.'
    },
    {
      name: 'Ishaan Trivedi',
      email: 'ishaan.trivedi@charusat.edu.in',
      role: 'member' as const,
      domain: 'Competitive Coding' as const,
      yearOrdinal: '2nd Year' as const,
      branch: 'Computer Science & Engineering' as const,
      githubHandle: 'ishaan-trivedi-code',
      xp: 510,
      streakWeeks: 6,
      monthsAgo: 15,
      bio: 'Core algorithms mentor. Organizer of Git Treasure Hunt and competitive programming sprints.'
    },
    {
      name: 'Meera Joshi',
      email: 'meera.joshi@charusat.edu.in',
      role: 'member' as const,
      domain: 'Design & Media' as const,
      yearOrdinal: '2nd Year' as const,
      branch: 'DEPSTAR' as const,
      githubHandle: 'meera-joshi-ui',
      xp: 490,
      streakWeeks: 7,
      monthsAgo: 14,
      bio: 'Creative Lead & Brand Designer. Crafts visual identity and interactive web interfaces.'
    }
  ];

  coreTeamDefs.forEach((core, idx) => {
    const joinDate = new Date(now.getTime() - core.monthsAgo * 30 * 24 * 60 * 60 * 1000);
    members.push({
      id: `gwg-member-core-${idx + 1}`,
      name: core.name,
      email: core.email,
      role: core.role,
      domain: core.domain,
      yearOrdinal: core.yearOrdinal,
      branch: core.branch,
      githubHandle: core.githubHandle,
      xp: core.xp,
      streakWeeks: core.streakWeeks,
      joinedAt: joinDate.toISOString(),
      isCore: true,
      avatarSeed: core.name.replace(/\s+/g, ''),
      bio: core.bio
    });
  });

  // Track used name pairs to ensure unique full names without replacement
  const usedPairs = new Set<string>();
  coreTeamDefs.forEach(c => usedPairs.add(c.name));

  // 2. Generate 90 remaining members (Total = 96)
  // Exactly 16 non-core joined within the last 30 days
  // Remaining 74 joined between 1 and 13 months ago
  let fIdx = 6;
  let lIdx = 6;

  for (let i = 0; i < 90; i++) {
    let firstName = GUJARATI_FIRST_NAMES[fIdx % GUJARATI_FIRST_NAMES.length];
    let lastName = GUJARATI_LAST_NAMES[lIdx % GUJARATI_LAST_NAMES.length];
    let candidateName = `${firstName} ${lastName}`;

    let shift = 1;
    while (usedPairs.has(candidateName)) {
      lastName = GUJARATI_LAST_NAMES[(lIdx + shift) % GUJARATI_LAST_NAMES.length];
      candidateName = `${firstName} ${lastName}`;
      shift++;
    }
    usedPairs.add(candidateName);
    fIdx++;
    lIdx += 2;

    const domain = DOMAINS[i % DOMAINS.length];
    const branch = BRANCHES[i % BRANCHES.length];
    const yearOrdinal = YEARS[i % YEARS.length];
    const handle = `${firstName.toLowerCase()}-${lastName.toLowerCase()}`;
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@charusat.edu.in`;

    // 16 joined within last 30 days; others between 31 and 390 days ago
    let daysAgo: number;
    if (i < 16) {
      daysAgo = Math.floor(2 + (i * 27) / 16); // 2 to 29 days ago
    } else {
      daysAgo = Math.floor(35 + ((i - 16) * 360) / 74); // 35 to 395 days ago
    }
    const joinDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);

    const eventsAttended = Math.max(1, Math.floor((395 - daysAgo) / 60));
    const xp = eventsAttended * 100 + (i % 5) * 20;
    const streak = Math.max(1, (i % 6) + 1);

    members.push({
      id: `gwg-member-${i + 7}`,
      name: candidateName,
      email,
      role: 'member',
      domain,
      yearOrdinal,
      branch,
      githubHandle: handle,
      xp,
      streakWeeks: streak,
      joinedAt: joinDate.toISOString(),
      isCore: false,
      avatarSeed: candidateName.replace(/\s+/g, '')
    });
  }

  return members;
}

export function generateSeedEvents(members: ClubMemberItem[]): ClubEventItem[] {
  const memberIds = members.map(m => m.id);

  // 1. Demo event seeded from the supplied Code Wizards poster
  const codeWizards: ClubEventItem = {
    id: 'evt-code-wizards-2026',
    title: 'Code Wizards: 6 Hours Hackathon',
    category: 'Hackathons',
    status: 'Published',
    startDateTime: '2026-10-01T09:00:00+05:30',
    endDateTime: '2026-10-01T16:00:00+05:30',
    venue: 'CSPIT, CHARUSAT',
    capacity: 120,
    registeredMemberIds: memberIds.slice(0, 114),
    waitlistedMemberIds: memberIds.slice(114, 117), // 3 on waitlist
    checkedInMemberIds: memberIds.slice(0, 78),
    description: 'Six-hour hackathon for 2nd and 3rd year students with on-the-spot industry-grade problem statements. Inter-department and cross-year teams are allowed.',
    leadId: 'gwg-member-core-2', // Riya Patel
    readiness: {
      venueConfirmed: true,
      posterApproved: true,
      speakersAssigned: true,
      volunteersEnlisted: true,
      announcementDrafted: true
    },
    targetDomain: 'Web App Development',
    bannerTheme: 'wizard'
  };

  // 2. Published: Mastering Git & GitHub
  const gitWorkshop: ClubEventItem = {
    id: 'evt-git-fundamentals-2024',
    title: 'Mastering Git & GitHub: From Init to Rebase',
    category: 'Workshops',
    status: 'Published',
    startDateTime: '2024-11-14T10:00:00.000Z',
    endDateTime: '2024-11-15T10:00:00.000Z',
    venue: 'BVM Seminar Hall, CSPIT',
    capacity: 80,
    registeredMemberIds: memberIds.slice(10, 72),
    waitlistedMemberIds: [],
    checkedInMemberIds: [],
    description: 'Comprehensive hands-on workshop covering Git plumbing, porcelain commands, interactive rebase, and resolving severe merge conflicts.',
    leadId: 'gwg-member-core-3', // Kavya Shah
    readiness: {
      venueConfirmed: true,
      posterApproved: true,
      speakersAssigned: true,
      volunteersEnlisted: true,
      announcementDrafted: true
    },
    targetDomain: 'Web App Development',
    bannerTheme: 'academic'
  };

  // 3. Draft 1: Linux Kernel Contribution (has blockers)
  const linuxDraft: ClubEventItem = {
    id: 'evt-linux-kernel-2024',
    title: 'Linux Kernel & Open Source Contribution',
    category: 'Workshops',
    status: 'Draft',
    startDateTime: '2024-11-28T14:00:00.000Z',
    endDateTime: '2024-11-28T17:00:00.000Z',
    venue: null, // Blocked: venue unconfirmed!
    capacity: 60,
    registeredMemberIds: [],
    waitlistedMemberIds: [],
    checkedInMemberIds: [],
    description: 'Deep dive into mailing list etiquette, patch formatting via git format-patch, and contributing upstream to open source kernels.',
    leadId: 'gwg-member-core-1', // Aarav Desai
    readiness: {
      venueConfirmed: false, // Blocker
      posterApproved: false,  // Blocker
      speakersAssigned: true,
      volunteersEnlisted: true,
      announcementDrafted: false // Blocker
    },
    targetDomain: 'Cloud & DevOps',
    bannerTheme: 'cyber'
  };

  // 4. Draft 2: Agentic AI Workflows
  const aiDraft: ClubEventItem = {
    id: 'evt-agentic-ai-2024',
    title: 'Prompt Engineering & Agentic AI Workflows',
    category: 'Talks',
    status: 'Draft',
    startDateTime: '2024-12-05T11:00:00.000Z',
    endDateTime: '2024-12-05T13:30:00.000Z',
    venue: 'Room 204, IT Block, CSPIT',
    capacity: 50,
    registeredMemberIds: [],
    waitlistedMemberIds: [],
    checkedInMemberIds: [],
    description: 'Explore generative AI tool calling, multi-agent evaluation frameworks, and integration with modern GitHub developer workflows.',
    leadId: 'gwg-member-core-3',
    readiness: {
      venueConfirmed: true,
      posterApproved: true,
      speakersAssigned: false, // Blocker: needs speaker confirmation
      volunteersEnlisted: true,
      announcementDrafted: true
    },
    targetDomain: 'AI / ML',
    bannerTheme: 'cyber'
  };

  // 5. Completed: Campus Git Treasure Hunt & CTF
  const treasureHunt: ClubEventItem = {
    id: 'evt-treasure-hunt-completed',
    title: 'Campus Git Treasure Hunt & CTF',
    category: 'Competitions',
    status: 'Completed',
    startDateTime: '2024-09-18T10:00:00.000Z',
    endDateTime: '2024-09-18T17:00:00.000Z',
    venue: 'Central Courtyard, CHARUSAT Campus',
    capacity: 200,
    registeredMemberIds: memberIds.slice(0, 190),
    waitlistedMemberIds: [],
    checkedInMemberIds: memberIds.slice(0, 188), // 188 checked in
    description: 'Exciting on-ground technical treasure hunt where participants decrypted Git commit hashes, traversed branches, and extracted flags.',
    leadId: 'gwg-member-core-2',
    readiness: {
      venueConfirmed: true,
      posterApproved: true,
      speakersAssigned: true,
      volunteersEnlisted: true,
      announcementDrafted: true
    },
    targetDomain: 'Cybersecurity',
    bannerTheme: 'wizard'
  };

  // 6. Completed: DevOps CI/CD with GitHub Actions
  const devopsCompleted: ClubEventItem = {
    id: 'evt-devops-cicd-completed',
    title: 'DevOps CI/CD with GitHub Actions',
    category: 'Workshops',
    status: 'Completed',
    startDateTime: '2024-08-20T14:00:00.000Z',
    endDateTime: '2024-08-20T18:00:00.000Z',
    venue: 'Lab 3, CSE Department, CSPIT',
    capacity: 100,
    registeredMemberIds: memberIds.slice(0, 95),
    waitlistedMemberIds: [],
    checkedInMemberIds: memberIds.slice(0, 92), // 92 checked in
    description: 'End-to-end containerized deployments using Docker, GitHub Actions matrix builds, and automated preview branch hosting.',
    leadId: 'gwg-member-core-1',
    readiness: {
      venueConfirmed: true,
      posterApproved: true,
      speakersAssigned: true,
      volunteersEnlisted: true,
      announcementDrafted: true
    },
    targetDomain: 'Cloud & DevOps',
    bannerTheme: 'cyber'
  };

  // 7. Completed: Webcraft Hack-Sprint (154 attended)
  const webcraftCompleted: ClubEventItem = {
    id: 'evt-webcraft-completed',
    title: 'Webcraft: Frontend & Fullstack Sprint',
    category: 'Competitions',
    status: 'Completed',
    startDateTime: '2024-07-12T09:00:00.000Z',
    endDateTime: '2024-07-12T18:00:00.000Z',
    venue: 'Auditorium Hall 2, CSPIT',
    capacity: 160,
    registeredMemberIds: memberIds.slice(0, 160),
    waitlistedMemberIds: [],
    checkedInMemberIds: memberIds.slice(0, 154), // 154 checked in
    description: 'Rapid UI design and client-side engineering marathon building accessible open web tools.',
    leadId: 'gwg-member-core-6',
    readiness: {
      venueConfirmed: true,
      posterApproved: true,
      speakersAssigned: true,
      volunteersEnlisted: true,
      announcementDrafted: true
    },
    targetDomain: 'Web App Development',
    bannerTheme: 'academic'
  };

  // 8. Completed: Git 101 Induction (169 attended)
  const git101Completed: ClubEventItem = {
    id: 'evt-git-101-completed',
    title: 'Git 101: Freshers Open Source Induction',
    category: 'Workshops',
    status: 'Completed',
    startDateTime: '2024-06-15T10:00:00.000Z',
    endDateTime: '2024-06-15T15:00:00.000Z',
    venue: 'Main Auditorium, CHARUSAT',
    capacity: 180,
    registeredMemberIds: memberIds.slice(0, 175),
    waitlistedMemberIds: [],
    checkedInMemberIds: memberIds.slice(0, 169), // 169 checked in
    description: 'Welcoming first-year students to the version control ecosystem, GitHub profiles, and student developer packs.',
    leadId: 'gwg-member-core-1',
    readiness: {
      venueConfirmed: true,
      posterApproved: true,
      speakersAssigned: true,
      volunteersEnlisted: true,
      announcementDrafted: true
    },
    targetDomain: 'Competitive Coding',
    bannerTheme: 'academic'
  };

  // 9. Completed: Linux Bootcamp (100 attended)
  // Total completed attendees = 188 + 92 + 154 + 169 + 100 = 703 attendees!
  const linuxBootCompleted: ClubEventItem = {
    id: 'evt-linux-bootcamp-completed',
    title: 'Linux System Administration Bootcamp',
    category: 'Workshops',
    status: 'Completed',
    startDateTime: '2024-05-10T11:00:00.000Z',
    endDateTime: '2024-05-10T16:00:00.000Z',
    venue: 'Lab 1, Information Technology, CSPIT',
    capacity: 100,
    registeredMemberIds: memberIds.slice(0, 100),
    waitlistedMemberIds: [],
    checkedInMemberIds: memberIds.slice(0, 100), // 100 checked in
    description: 'Shell scripting, file system hierarchy, process management, and Git SSH key configuration on Debian Linux.',
    leadId: 'gwg-member-core-4',
    readiness: {
      venueConfirmed: true,
      posterApproved: true,
      speakersAssigned: true,
      volunteersEnlisted: true,
      announcementDrafted: true
    },
    targetDomain: 'Cloud & DevOps',
    bannerTheme: 'cyber'
  };

  return [
    codeWizards,
    gitWorkshop,
    linuxDraft,
    aiDraft,
    treasureHunt,
    devopsCompleted,
    webcraftCompleted,
    git101Completed,
    linuxBootCompleted
  ];
}

export function generateSeedProjects(): ClubProjectItem[] {
  return [
    {
      id: 'proj-1',
      title: 'GrowWithGit Official Campus Hub',
      category: 'Web & Cloud',
      status: 'Active',
      description: 'The internal club command center, real-time event ticketing engine, and member credentials portal for CSPIT CHARUSAT.',
      leadMemberId: 'gwg-member-core-1',
      contributorIds: ['gwg-member-core-1', 'gwg-member-core-2', 'gwg-member-core-6'],
      pendingApplicantIds: [],
      repositoryUrl: 'https://github.com/growwithgit/campus-command-center',
      maxContributors: 6
    },
    {
      id: 'proj-2',
      title: 'Automated Attendance & Pass Scanner',
      category: 'Campus Tools',
      status: 'Active',
      description: 'Progressive Web App barcode and QR engine for instant event admission, cryptographic signature verification, and check-in metrics.',
      leadMemberId: 'gwg-member-core-2',
      contributorIds: ['gwg-member-core-2', 'gwg-member-core-4'],
      pendingApplicantIds: ['gwg-member-9'],
      repositoryUrl: 'https://github.com/growwithgit/pass-scanner',
      maxContributors: 5
    },
    {
      id: 'proj-3',
      title: 'Interactive Git Visualizer CLI',
      category: 'AI / Systems',
      status: 'In Development',
      description: 'Terminal UI and visual node tree engine illustrating branch merges, three-way comparisons, cherry-picks, and reflog state machines.',
      leadMemberId: 'gwg-member-core-3',
      contributorIds: ['gwg-member-core-3', 'gwg-member-core-5'],
      pendingApplicantIds: [],
      repositoryUrl: 'https://github.com/growwithgit/git-visualizer-cli',
      maxContributors: 4
    },
    {
      id: 'proj-4',
      title: 'Autonomous Campus Surveillance Robot',
      category: 'Robotics & IoT',
      status: 'In Development',
      description: 'LIDAR-guided rover with ROS2 integration, obstacle avoidance algorithms, and live telemetry relayed over campus LoRaWAN.',
      leadMemberId: 'gwg-member-core-4',
      contributorIds: ['gwg-member-core-4'],
      pendingApplicantIds: ['gwg-member-12', 'gwg-member-15'],
      repositoryUrl: 'https://github.com/growwithgit/surveillance-bot',
      maxContributors: 4
    },
    {
      id: 'proj-5',
      title: 'Smart Campus AI Assistant',
      category: 'AI / Systems',
      status: 'Active',
      description: 'Retrieval-Augmented Generation (RAG) assistant indexing CSPIT syllabus, examination notices, timetable schedules, and faculty directories.',
      leadMemberId: 'gwg-member-core-3',
      contributorIds: ['gwg-member-core-3', 'gwg-member-core-1'],
      pendingApplicantIds: [],
      repositoryUrl: 'https://github.com/growwithgit/charusat-ai-assistant',
      maxContributors: 5
    }
  ];
}

export function generateSeedApprovals(): ApprovalRequest[] {
  return [
    {
      id: 'req-app-1',
      type: 'membership',
      applicantName: 'Tirth Patel',
      applicantId: 'gwg-member-37',
      targetTitle: 'Full Club Membership',
      targetId: 'club-membership',
      domain: 'AI / ML',
      requestedAt: '2 hours ago',
      status: 'pending',
      note: '2nd Year CSE student with PyTorch and open source experience.'
    },
    {
      id: 'req-app-2',
      type: 'membership',
      applicantName: 'Jahnvi Dave',
      applicantId: 'gwg-member-38',
      targetTitle: 'Full Club Membership',
      targetId: 'club-membership',
      domain: 'Web App Development',
      requestedAt: '5 hours ago',
      status: 'pending',
      note: '3rd Year IT student, contributor to React documentation.'
    },
    {
      id: 'req-app-3',
      type: 'membership',
      applicantName: 'Nilay Trivedi',
      applicantId: 'gwg-member-39',
      targetTitle: 'Full Club Membership',
      targetId: 'club-membership',
      domain: 'Cloud & DevOps',
      requestedAt: '1 day ago',
      status: 'pending',
      note: 'Docker enthusiast managing home cluster nodes.'
    },
    {
      id: 'req-proj-1',
      type: 'project_join',
      applicantName: 'Khushi Shah',
      applicantId: 'gwg-member-22',
      targetTitle: 'Interactive Git Visualizer CLI',
      targetId: 'proj-3',
      domain: 'Competitive Coding',
      requestedAt: '4 hours ago',
      status: 'pending',
      note: 'Wants to optimize directed acyclic graph (DAG) layout algorithms.'
    },
    {
      id: 'req-proj-2',
      type: 'project_join',
      applicantName: 'Aryan Joshi',
      applicantId: 'gwg-member-15',
      targetTitle: 'Autonomous Campus Surveillance Robot',
      targetId: 'proj-4',
      domain: 'Robotics & IoT',
      requestedAt: '1 day ago',
      status: 'pending',
      note: 'Background in Arduino, ESP32, and brushless motor ESC calibration.'
    }
  ];
}

export function getRegistrationMomentum(): RegistrationMomentumPoint[] {
  return [
    { dayLabel: 'Day 1', registrations: 18 },
    { dayLabel: 'Day 2', registrations: 34 },
    { dayLabel: 'Day 3', registrations: 58 },
    { dayLabel: 'Day 4', registrations: 79 },
    { dayLabel: 'Day 5', registrations: 96 },
    { dayLabel: 'Day 6', registrations: 114 }
  ];
}
