import { CommandEvent, CommandMember, CommandProject, CommandAnnouncement, CommandActivityItem } from '../types/commandCenter';

// Institutional Facts from official CSPIT website:
export const CSPIT_INSTITUTION_INFO = {
  name: 'Chandubhai S. Patel Institute of Technology (CSPIT)',
  parentUniversity: 'CHARUSAT - Charotar University of Science and Technology',
  establishmentYear: 2000,
  intakeInfo: '600 total undergraduate intake across 8 B.Tech programs, 63 postgraduate seats, Ph.D. programme',
  btechPrograms: [
    'Computer Science & Engineering',
    'Electronics & Communication Engineering',
    'Information Technology',
    'Civil Engineering',
    'Computer Engineering',
    'Mechanical Engineering',
    'Artificial Intelligence and Machine Learning',
    'Electrical Engineering'
  ],
  officialClubs: ['Innovators Club', 'Math for AI Club', 'Robotics Club', 'SpiriTech Club'],
  phone: '+91-2697-265112',
  email: 'principal.cspit@charusat.ac.in',
  address: 'Off. Nadiad-Petlad Highway, Changa-388421, Anand, Gujarat, India',
  officialUrl: 'https://cspit.charusat.ac.in/',
  eventsUrl: 'https://cspit.charusat.ac.in/events',
  aboutUrl: 'https://cspit.charusat.ac.in/about'
};

// Official CSPIT 2026 Academic Enrichment Activities (Source of truth)
export const INITIAL_EVENTS: CommandEvent[] = [
  {
    id: 'evt-git-workshop',
    title: 'Hands-on Workshop on Git',
    category: 'Workshops',
    year: 2026,
    description: 'Practical hands-on training on Git version control fundamentals, branch management, repository collaboration, and resolving merge conflicts.',
    officialUrl: 'https://cspit.charusat.ac.in/events',
    isOfficialCspit: true,
    isDraft: false,
    date: 'August 07, 2026',
    time: '12:00 PM Onwards',
    venue: 'DEPSTAR 2nd Floor Seminar Hall A5, CSPIT',
    targetAudience: '1st - 4th Year B.Tech CSE / IT / CE',
    teamSize: 'Individual Lab Participation',
    attendeesCount: 142,
    badge: 'Flagship Workshop'
  },
  {
    id: 'evt-code-wizards',
    title: 'Code Wizards: 6 Hours Hackathon',
    category: 'Hackathons',
    year: 2026,
    description: 'Flagship 6-hour sprint where 2nd and 3rd year students tackle on-the-spot industry grade problem statements with real-time Git commit evaluation.',
    officialUrl: 'https://cspit.charusat.ac.in/events',
    isOfficialCspit: true,
    isDraft: false,
    date: 'October 01, 2026',
    time: '09:00 AM – 04:00 PM',
    venue: 'CSPIT Computer Labs',
    targetAudience: 'Only 2nd & 3rd Year Wizards (Inter-department allowed)',
    teamSize: 'Teams of 2+',
    attendeesCount: 96,
    badge: 'Flagship Hackathon'
  },
  {
    id: 'evt-wizards-treasure-hunt',
    title: 'Wizards Treasure Hunt: Secret Chambers',
    category: 'Competitions',
    year: 2026,
    description: 'Solve exciting code snippets and cryptic terminal puzzles to reveal where secret chambers take your team across the CSPIT campus.',
    officialUrl: 'https://cspit.charusat.ac.in/events',
    isOfficialCspit: true,
    isDraft: false,
    date: 'September 30, 2026',
    time: '09:10 AM – 04:20 PM',
    venue: 'CSPIT Campus Chambers',
    targetAudience: 'Exclusively for First Year Wizards',
    teamSize: 'Teams of 3',
    attendeesCount: 88,
    badge: '1st Year Special'
  },
  {
    id: 'evt-sih-2026',
    title: 'Internal Hackathon for SIH 2026',
    category: 'Hackathons',
    year: 2026,
    description: 'Official CSPIT internal hackathon qualifying round for Smart India Hackathon 2026 with evaluation panels.',
    officialUrl: 'https://cspit.charusat.ac.in/events',
    isOfficialCspit: true,
    isDraft: false,
    date: 'September 2026',
    time: 'Full Day Event',
    venue: 'CSPIT Central Auditorium',
    targetAudience: 'All CSPIT & CHARUSAT Undergraduate Teams',
    teamSize: 'Teams of 6',
    attendeesCount: 180,
    badge: 'National Qualifier'
  },
  {
    id: 'evt-claude-agentic',
    title: 'From Prompt to Production: Hands-on Workshop on Claude Code, AI Coding Agents & Context Engineering',
    category: 'Workshops',
    year: 2026,
    description: 'Advanced developer session exploring context protocols, modern agent workflows, tool-use execution, and automated code review pipelines.',
    officialUrl: 'https://cspit.charusat.ac.in/events',
    isOfficialCspit: true,
    isDraft: false,
    date: '2026 Session',
    time: 'TBA',
    venue: 'CSPIT High-Tech Lab',
    targetAudience: 'Developers & AI Researchers',
    teamSize: 'Individual',
    attendeesCount: 75,
    badge: 'Advanced AI'
  },
  {
    id: 'evt-coders-arcade',
    title: "Coder's Arcade 3.0",
    category: 'Competitions',
    year: 2026,
    description: 'Speed-coding, algorithmic debugging, and rapid problem-solving contest across multiple language tracks.',
    officialUrl: 'https://cspit.charusat.ac.in/events',
    isOfficialCspit: true,
    isDraft: false,
    date: '2026 Session',
    time: 'TBA',
    venue: 'CSE Department Computing Center',
    targetAudience: 'Undergraduate Coders',
    teamSize: 'Solo / Duo',
    attendeesCount: 110
  },
  {
    id: 'evt-aws-student-day',
    title: 'Amazon Web Services Student Community Day 2026',
    category: 'Talks',
    year: 2026,
    description: 'Technical keynotes, serverless architecture demos, and containerized deployment pipelines led by AWS community champions.',
    officialUrl: 'https://cspit.charusat.ac.in/events',
    isOfficialCspit: true,
    isDraft: false,
    date: '2026 Session',
    time: 'TBA',
    venue: 'CSPIT Seminar Hall',
    targetAudience: 'Cloud Enthusiasts',
    teamSize: 'Open Attendance',
    attendeesCount: 220
  },
  {
    id: 'evt-agentic-ai-workflows',
    title: 'Workshop on Fundamentals of Agentic AI Workflows',
    category: 'Workshops',
    year: 2026,
    description: 'Autonomous multi-agent orchestration, function calling paradigms, memory stores, and vector database integrations.',
    officialUrl: 'https://cspit.charusat.ac.in/events',
    isOfficialCspit: true,
    isDraft: true, // Needs Attention draft item
    date: 'TBA (In Draft)',
    time: 'TBA',
    venue: 'Lab 3, CSPIT CSE',
    targetAudience: '3rd & 4th Year B.Tech',
    teamSize: 'Individual',
    attendeesCount: 0,
    badge: 'Draft Review'
  }
];

// Official CSPIT Project Highlights (Transparently labelled as CSPIT Context)
export const INITIAL_PROJECTS: CommandProject[] = [
  {
    id: 'proj-attendx',
    title: 'AttendX: AI-Based Attendance System',
    category: 'AI / Systems',
    status: 'Active',
    isCspitHighlight: true,
    description: 'Automated student face-recognition and real-time attendance tracking integrated with university timetable databases.',
    contributorsCount: 4,
    repositoryUrl: 'https://github.com/cspit-charusat',
    updatedAt: 'Yesterday'
  },
  {
    id: 'proj-gaganmitra',
    title: 'Gaganmitra Autonomous Drone',
    category: 'Robotics & IoT',
    status: 'Completed',
    isCspitHighlight: true,
    description: 'Aerial environmental telemetry and computer vision mapping platform built by CSPIT engineering students.',
    contributorsCount: 6,
    repositoryUrl: 'https://github.com/cspit-charusat',
    updatedAt: '3 days ago'
  },
  {
    id: 'proj-hexapod',
    title: 'Hexapod Multi-Terrain Rover',
    category: 'Robotics & IoT',
    status: 'Active',
    isCspitHighlight: true,
    description: 'Six-legged biomimetic robot for rough terrain navigation with ROS2 inverse kinematics control.',
    contributorsCount: 5,
    updatedAt: '5 days ago'
  },
  {
    id: 'proj-rickmate',
    title: 'RickMate: Share Rides, Save More!',
    category: 'Campus Tools',
    status: 'In Development',
    isCspitHighlight: true,
    description: 'Verified student carpooling and autorickshaw sharing mobile web app for the Changa-Anand-Nadiad campus commute.',
    contributorsCount: 3,
    repositoryUrl: 'https://github.com/cspit-charusat',
    updatedAt: '12 hours ago'
  },
  {
    id: 'proj-security-robot',
    title: 'Security Surveillance Robot',
    category: 'Robotics & IoT',
    status: 'In Development',
    isCspitHighlight: true,
    description: 'Patrolling autonomous ground vehicle equipped with thermal night cameras and collision avoidance LIDAR.',
    contributorsCount: 4,
    needsDescription: true, // Needs Attention item
    updatedAt: '1 week ago'
  },
  {
    id: 'proj-smart-bin',
    title: 'AI Enabled Smart Bin',
    category: 'AI / Systems',
    status: 'Completed',
    isCspitHighlight: true,
    description: 'Smart waste segregation mechanism using computer vision edge models to classify recyclables from compostable waste.',
    contributorsCount: 4,
    updatedAt: '2 weeks ago'
  }
];

// Committee & Core Members from the user uploaded photos
export const INITIAL_MEMBERS: CommandMember[] = [
  {
    id: 'mem-amit-thakkar',
    name: 'Dr. Amit Thakkar',
    role: 'Convener & Head of Department',
    domain: 'AI / ML',
    year: 'Faculty Convener',
    branch: 'Computer Science & Engineering',
    avatarInitials: 'AT',
    gender: 'male',
    isLead: true,
    email: 'amitthakkar.ce@charusat.ac.in'
  },
  {
    id: 'mem-dhara-solanki',
    name: 'Prof. Dhara Solanki',
    role: 'Faculty Coordinator',
    domain: 'Web App Development',
    year: 'Faculty Coordinator',
    branch: 'Computer Science & Engineering',
    avatarInitials: 'DS',
    gender: 'female',
    isLead: true
  },
  {
    id: 'mem-srushti-gajjar',
    name: 'Prof. Srushti Gajjar',
    role: 'Faculty Coordinator',
    domain: 'Cloud & DevOps',
    year: 'Faculty Coordinator',
    branch: 'Computer Science & Engineering',
    avatarInitials: 'SG',
    gender: 'female',
    isLead: true
  },
  {
    id: 'mem-brinda-patel',
    name: 'Prof. Brinda Patel',
    role: 'Faculty Coordinator',
    domain: 'Competitive Coding',
    year: 'Faculty Coordinator',
    branch: 'Computer Science & Engineering',
    avatarInitials: 'BP',
    gender: 'female',
    isLead: true
  },
  {
    id: 'mem-ohm-bhatia',
    name: 'Ohm Bhatia',
    role: 'Technical Team Lead',
    domain: 'Cloud & DevOps',
    year: '3rd Year B.Tech',
    branch: 'Computer Science & Engineering',
    avatarInitials: 'OB',
    gender: 'male',
    isLead: true,
    github: 'https://github.com'
  },
  {
    id: 'mem-priyesh-bhalodiya',
    name: 'Priyesh Bhalodiya',
    role: 'Technical Team Lead',
    domain: 'Web App Development',
    year: '3rd Year B.Tech',
    branch: 'Computer Science & Engineering',
    avatarInitials: 'PB',
    gender: 'male',
    isLead: true,
    github: 'https://github.com'
  },
  {
    id: 'mem-nisarg-makwana',
    name: 'Nisarg Makwana',
    role: 'Technical Team Member',
    domain: 'Competitive Coding',
    year: '2nd Year B.Tech',
    branch: 'Computer Science & Engineering',
    avatarInitials: 'NM',
    gender: 'male'
  },
  {
    id: 'mem-erva-savaliya',
    name: 'Erva Savaliya',
    role: 'Technical Team Member',
    domain: 'Web App Development',
    year: '2nd Year B.Tech',
    branch: 'Computer Science & Engineering',
    avatarInitials: 'ES',
    gender: 'female'
  },
  {
    id: 'mem-om-rashiya',
    name: 'Om Rashiya',
    role: 'Management Team Lead',
    domain: 'Design & Media',
    year: '3rd Year B.Tech',
    branch: 'Computer Science & Engineering',
    avatarInitials: 'OR',
    gender: 'male',
    isLead: true
  },
  {
    id: 'mem-dhruv-kava',
    name: 'Dhruv Kava',
    role: 'Management Team Lead',
    domain: 'Design & Media',
    year: '3rd Year B.Tech',
    branch: 'Computer Science & Engineering',
    avatarInitials: 'DK',
    gender: 'male',
    isLead: true
  },
  {
    id: 'mem-mendpara-shubham',
    name: 'Mendpara Shubham',
    role: 'Management Team',
    domain: 'Design & Media',
    year: '2nd Year B.Tech',
    branch: 'Computer Science & Engineering',
    avatarInitials: 'MS',
    gender: 'male'
  },
  {
    id: 'mem-kirtan-kakadiya',
    name: 'Kirtan Kakadiya',
    role: 'Management Team',
    domain: 'Design & Media',
    year: '2nd Year B.Tech',
    branch: 'Computer Science & Engineering',
    avatarInitials: 'KK',
    gender: 'male'
  },
  {
    id: 'mem-bhargav-rathod',
    name: 'Bhargav Rathod',
    role: 'Social Media Manager',
    domain: 'Design & Media',
    year: '2nd Year B.Tech',
    branch: 'Computer Science & Engineering',
    avatarInitials: 'BR',
    gender: 'male'
  },
  {
    id: 'mem-mayank-parmar',
    name: 'Mayank Parmar',
    role: 'Social Media Manager',
    domain: 'Design & Media',
    year: '2nd Year B.Tech',
    branch: 'Computer Science & Engineering',
    avatarInitials: 'MP',
    gender: 'male'
  }
];

export const INITIAL_ANNOUNCEMENTS: CommandAnnouncement[] = [
  {
    id: 'ann-1',
    title: 'Code Wizards 6-Hour Hackathon Registrations Open',
    message: 'Problem statements will be released on-the-spot. Verified public repositories required for all teams of 2 to 4.',
    publishedAt: '2 hours ago',
    author: 'Ohm Bhatia (Tech Lead)',
    category: 'Event'
  },
  {
    id: 'ann-2',
    title: 'Git Fundamentals Practical Hall Allocation',
    message: 'DEPSTAR 2nd Floor Seminar Hall A5 has been confirmed for the 3-module hands-on workshop.',
    publishedAt: 'Yesterday',
    author: 'Prof. Dhara Solanki',
    category: 'Workshop'
  },
  {
    id: 'ann-3',
    title: 'Upcoming activity announcement not published',
    message: 'Draft bulletin for October Open Source Sprint is ready for committee approval before dispatching.',
    publishedAt: 'Draft (Pending)',
    author: 'Committee Desk',
    isDraft: true,
    category: 'Administrative'
  }
];

export const INITIAL_ACTIVITY: CommandActivityItem[] = [
  {
    id: 'act-1',
    type: 'event',
    title: 'Internal Hackathon for SIH 2026',
    action: 'Event draft reviewed and synchronized with CSPIT roster',
    timestamp: '2m ago',
    badgeColor: 'purple'
  },
  {
    id: 'act-2',
    type: 'member',
    title: 'New Member Induction',
    action: 'Mayank Parmar verified as Social Media Manager',
    timestamp: '18m ago',
    badgeColor: 'blue'
  },
  {
    id: 'act-3',
    type: 'project',
    title: 'AttendX: AI Attendance System',
    action: 'Repository showcase link updated by Technical Lead',
    timestamp: '1h ago',
    badgeColor: 'emerald'
  },
  {
    id: 'act-4',
    type: 'announcement',
    title: 'Code Wizards Sprint Bulletin',
    action: 'Announcement published to student notice board',
    timestamp: '3h ago',
    badgeColor: 'amber'
  },
  {
    id: 'act-5',
    type: 'event',
    title: 'Wizards Treasure Hunt',
    action: 'Secret Chamber clues checkpoint approved by coordinators',
    timestamp: '5h ago',
    badgeColor: 'purple'
  }
];

// Sample club participation data (Monthly metrics clearly labeled as demo data per prompt)
export const PARTICIPATION_CHART_DATA_12M = [
  { month: 'Jan', participants: 80, events: 1 },
  { month: 'Feb', participants: 120, events: 2 },
  { month: 'Mar', participants: 105, events: 1 },
  { month: 'Apr', participants: 160, events: 3 },
  { month: 'May', participants: 140, events: 2 },
  { month: 'Jun', participants: 190, events: 3 },
  { month: 'Jul', participants: 210, events: 4 },
  { month: 'Aug', participants: 175, events: 2 },
  { month: 'Sep', participants: 240, events: 4 },
  { month: 'Oct', participants: 280, events: 5 },
  { month: 'Nov', participants: 215, events: 3 },
  { month: 'Dec', participants: 160, events: 2 }
];

export const PARTICIPATION_CHART_DATA_7M = PARTICIPATION_CHART_DATA_12M.slice(0, 7);
