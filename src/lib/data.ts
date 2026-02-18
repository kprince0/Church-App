export const churchName = '잭슨빌 한인장로교회';

export const departments = ['예배부', '교육부', '재정부', '선교부', '친교부', '관리부'] as const;

export type Department = (typeof departments)[number];

export type Position =
  | '없음'
  | '서리집사'
  | '안수집사'
  | '은퇴장로'
  | '시무장로'
  | '목회자';

export type FamilyRelationship = '배우자' | '자녀' | '부모';

export type FamilyMember = {
  relationship: FamilyRelationship;
  name: string;
};

export type User = {
  id: string;
  koreanName: string;
  englishName: string;
  avatar: string;
  position: Position;
  isLeadPastor?: boolean;
  isFinanceElder?: boolean;
  departments: Department[];
  phone: string;
  email: string;
  address: {
    address1: string;
    address2?: string;
    city: string;
    state: string;
    zip: string;
  };
  family: FamilyMember[];
};

export type Message = {
  id: string;
  senderId: string;
  text?: string;
  timestamp: string;
  image?: string;
  file?: {
    name: string;
    url: string;
  };
};

export type Chat = {
  id: string;
  type: 'individual' | 'group';
  name: string;
  members: string[];
  messages: Message[];
  avatar?: string;
  isDepartment?: boolean;
  department?: Department;
};

export type Sermon = {
  id: string;
  title: string;
  preacher: string;
  date: string;
  youtubeUrl: string;
};

export type Bulletin = {
  id: string;
  date: string;
  fileUrl: string;
  fileType: 'pdf' | 'jpg' | 'png';
  title: string;
};

export type TithingType = '십일조' | '주일헌금' | '감사헌금' | '건축헌금' | '선교헌금';

export type TithingRecord = {
  id: string;
  userId: string;
  date: string;
  type: TithingType;
  amount: number;
  memo?: string;
};

export type Announcement = {
  id: string;
  senderId: string;
  receiverId: string;
  title: string;
  content: string;
  createdAt: string;
};

export type BibleVerse = {
  id: string;
  book: string;
  chapter: number;
  verse: number;
  korean: string;
  english: string;
};

export type Hymn = {
  id: string;
  number: number;
  title: string;
  koreanLyrics: string;
  englishLyrics: string;
  sheetMusicUrl: string;
};

export const users: User[] = [
  {
    id: 'user-1',
    koreanName: '김은혜',
    englishName: 'Grace Kim',
    avatar: '/avatars/user1.png',
    position: '목회자',
    isLeadPastor: true,
    departments: ['예배부', '교육부', '재정부', '선교부', '친교부', '관리부'],
    phone: '904-111-1001',
    email: 'pastor@jkpc.org',
    address: {
      address1: '5001 Main St',
      city: 'Jacksonville',
      state: 'FL',
      zip: '32207',
    },
    family: [],
  },
  {
    id: 'user-2',
    koreanName: '박시무',
    englishName: 'Peter Park',
    avatar: '/avatars/user2.png',
    position: '시무장로',
    departments: ['예배부', '재정부', '관리부'],
    phone: '904-111-1002',
    email: 'elder.park@jkpc.org',
    address: {
      address1: '400 Oak Ln',
      city: 'Jacksonville',
      state: 'FL',
      zip: '32207',
    },
    family: [{ relationship: '배우자', name: '박은혜' }],
  },
  {
    id: 'user-3',
    koreanName: '이재정',
    englishName: 'James Lee',
    avatar: '/avatars/user3.png',
    position: '시무장로',
    isFinanceElder: true,
    departments: ['재정부'],
    phone: '904-111-1003',
    email: 'finance@jkpc.org',
    address: {
      address1: '102 Cedar Ave',
      city: 'Jacksonville',
      state: 'FL',
      zip: '32207',
    },
    family: [],
  },
  {
    id: 'user-4',
    koreanName: '최성도',
    englishName: 'Paul Choi',
    avatar: '/avatars/user4.png',
    position: '서리집사',
    departments: ['교육부', '친교부'],
    phone: '904-111-1004',
    email: 'paul.choi@jkpc.org',
    address: {
      address1: '99 River Rd',
      city: 'Jacksonville',
      state: 'FL',
      zip: '32207',
    },
    family: [{ relationship: '배우자', name: '최사라' }],
  },
  {
    id: 'user-5',
    koreanName: '윤집사',
    englishName: 'Esther Yoon',
    avatar: '/avatars/user5.png',
    position: '안수집사',
    departments: ['예배부', '선교부'],
    phone: '904-111-1005',
    email: 'esther.yoon@jkpc.org',
    address: {
      address1: '88 Mission Dr',
      city: 'Jacksonville',
      state: 'FL',
      zip: '32207',
    },
    family: [],
  },
  {
    id: 'user-current',
    koreanName: '한교인',
    englishName: 'Hanna Han',
    avatar: '/avatars/user-current.png',
    position: '서리집사',
    departments: ['예배부', '친교부'],
    phone: '904-111-1006',
    email: 'hanna.han@jkpc.org',
    address: {
      address1: '120 Grace Ct',
      city: 'Jacksonville',
      state: 'FL',
      zip: '32207',
    },
    family: [
      { relationship: '배우자', name: '한요셉' },
      { relationship: '자녀', name: '한사무엘' },
    ],
  },
];

export const currentUserId = 'user-current';

export const chats: Chat[] = [
  {
    id: 'dept-worship',
    type: 'group',
    name: '예배부',
    department: '예배부',
    isDepartment: true,
    members: ['user-1', 'user-2', 'user-5', 'user-current'],
    avatar: '/avatars/group-worship.png',
    messages: [
      { id: 'msg-1', senderId: 'user-2', text: '이번 주 예배 순서 최종본입니다.', timestamp: '오후 2:30' },
      {
        id: 'msg-2',
        senderId: 'user-5',
        image: 'https://picsum.photos/seed/worship-team/480/320',
        text: '찬양팀 리허설 사진 공유드립니다.',
        timestamp: '오후 2:36',
      },
    ],
  },
  {
    id: 'dept-education',
    type: 'group',
    name: '교육부',
    department: '교육부',
    isDepartment: true,
    members: ['user-1', 'user-4'],
    avatar: '/avatars/group-edu.png',
    messages: [
      { id: 'msg-3', senderId: 'user-4', text: '주일학교 교재가 도착했습니다.', timestamp: '오전 10:05' },
    ],
  },
  {
    id: 'dept-finance',
    type: 'group',
    name: '재정부',
    department: '재정부',
    isDepartment: true,
    members: ['user-1', 'user-2', 'user-3'],
    avatar: '/avatars/group-finance.png',
    messages: [
      {
        id: 'msg-4',
        senderId: 'user-3',
        file: { name: '2026-01-재정보고.pdf', url: '/files/2026-01-finance-report.pdf' },
        timestamp: '어제',
      },
    ],
  },
  {
    id: 'dept-mission',
    type: 'group',
    name: '선교부',
    department: '선교부',
    isDepartment: true,
    members: ['user-1', 'user-5'],
    avatar: '/avatars/group-mission.png',
    messages: [{ id: 'msg-5', senderId: 'user-5', text: '단기선교 일정표 올립니다.', timestamp: '2일 전' }],
  },
  {
    id: 'dept-fellowship',
    type: 'group',
    name: '친교부',
    department: '친교부',
    isDepartment: true,
    members: ['user-1', 'user-4', 'user-current'],
    avatar: '/avatars/group-fellowship.png',
    messages: [{ id: 'msg-6', senderId: 'user-current', text: '이번 주 점심 봉사 신청합니다.', timestamp: '2일 전' }],
  },
  {
    id: 'dept-management',
    type: 'group',
    name: '관리부',
    department: '관리부',
    isDepartment: true,
    members: ['user-1', 'user-2'],
    avatar: '/avatars/group-management.png',
    messages: [{ id: 'msg-7', senderId: 'user-2', text: '주차장 라인 보수 진행합니다.', timestamp: '3일 전' }],
  },
  {
    id: 'dm-park',
    type: 'individual',
    name: '박시무',
    members: ['user-current', 'user-2'],
    avatar: '/avatars/user2.png',
    messages: [
      { id: 'msg-8', senderId: 'user-current', text: '장로님, 공지 확인했습니다.', timestamp: '오전 9:11' },
      { id: 'msg-9', senderId: 'user-2', text: '네 감사합니다. 기도 부탁드립니다.', timestamp: '오전 9:13' },
    ],
  },
];

export const sermons: Sermon[] = [
  {
    id: 'sermon-1',
    title: '은혜 안에서 자라는 교회',
    preacher: '김은혜 담임목사',
    date: '2026-02-08',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  },
  {
    id: 'sermon-2',
    title: '기도의 자리로 돌아갑시다',
    preacher: '김은혜 담임목사',
    date: '2026-02-01',
    youtubeUrl: 'https://www.youtube.com/watch?v=oHg5SJYRHA0',
  },
  {
    id: 'sermon-3',
    title: '복음으로 세워지는 가정',
    preacher: '김은혜 담임목사',
    date: '2026-01-25',
    youtubeUrl: 'https://www.youtube.com/watch?v=DLzxrzFCyOs',
  },
];

export const bulletins: Bulletin[] = [
  {
    id: 'bulletin-2026-02-08',
    date: '2026-02-08',
    fileUrl: '/bulletins/2026-02-08.pdf',
    fileType: 'pdf',
    title: '2월 둘째 주 주보',
  },
  {
    id: 'bulletin-2026-02-01',
    date: '2026-02-01',
    fileUrl: '/bulletins/2026-02-01.png',
    fileType: 'png',
    title: '2월 첫째 주 주보',
  },
  {
    id: 'bulletin-2026-01-25',
    date: '2026-01-25',
    fileUrl: '/bulletins/2026-01-25.jpg',
    fileType: 'jpg',
    title: '1월 넷째 주 주보',
  },
];

export const tithingRecords: TithingRecord[] = [
  { id: 't1', userId: 'user-current', date: '2026-01-04', type: '주일헌금', amount: 30 },
  { id: 't2', userId: 'user-current', date: '2026-01-11', type: '주일헌금', amount: 30 },
  { id: 't3', userId: 'user-current', date: '2026-01-18', type: '십일조', amount: 300, memo: '1월 십일조' },
  { id: 't4', userId: 'user-current', date: '2026-02-02', type: '감사헌금', amount: 100, memo: '가정 예배 감사' },
  { id: 't5', userId: 'user-4', date: '2026-01-18', type: '주일헌금', amount: 25 },
  { id: 't6', userId: 'user-4', date: '2026-02-01', type: '선교헌금', amount: 50 },
];

export const announcements: Announcement[] = [
  {
    id: 'a1',
    senderId: 'user-2',
    receiverId: 'user-current',
    title: '심방 일정 안내',
    content: '이번 주 금요일 오후 7시에 가정 심방이 예정되어 있습니다.',
    createdAt: '2026-02-10 09:00',
  },
  {
    id: 'a2',
    senderId: 'user-1',
    receiverId: 'user-4',
    title: '교육부 봉사 확인',
    content: '주일학교 교사 봉사 가능 여부를 회신 부탁드립니다.',
    createdAt: '2026-02-09 15:20',
  },
];

export const bibleVerses: BibleVerse[] = [
  {
    id: 'b1',
    book: '요한복음',
    chapter: 3,
    verse: 16,
    korean: '하나님이 세상을 이처럼 사랑하사 독생자를 주셨으니...',
    english: 'For God so loved the world that he gave his one and only Son...',
  },
  {
    id: 'b2',
    book: '시편',
    chapter: 23,
    verse: 1,
    korean: '여호와는 나의 목자시니 내게 부족함이 없으리로다.',
    english: 'The Lord is my shepherd, I shall not want.',
  },
  {
    id: 'b3',
    book: '로마서',
    chapter: 8,
    verse: 28,
    korean: '하나님을 사랑하는 자 곧 그의 뜻대로 부르심을 입은 자들에게는...',
    english: 'And we know that in all things God works for the good...',
  },
  {
    id: 'b4',
    book: '빌립보서',
    chapter: 4,
    verse: 13,
    korean: '내게 능력 주시는 자 안에서 내가 모든 것을 할 수 있느니라.',
    english: 'I can do all this through him who gives me strength.',
  },
];

export const hymns: Hymn[] = [
  {
    id: 'h1',
    number: 23,
    title: '만 입이 내게 있으면',
    koreanLyrics: '만 입이 내게 있으면 그 입 다 가지고...',
    englishLyrics: 'O for a thousand tongues to sing my great Redeemer\'s praise...',
    sheetMusicUrl: '/hymns/023.pdf',
  },
  {
    id: 'h2',
    number: 79,
    title: '주 하나님 지으신 모든 세계',
    koreanLyrics: '주 하나님 지으신 모든 세계 내 마음 속에 그리어 볼 때...',
    englishLyrics: 'O Lord my God, when I in awesome wonder...',
    sheetMusicUrl: '/hymns/079.pdf',
  },
  {
    id: 'h3',
    number: 288,
    title: '예수를 나의 구주 삼고',
    koreanLyrics: '예수를 나의 구주 삼고 성령과 피로써 거듭나니...',
    englishLyrics: 'Blessed assurance, Jesus is mine...',
    sheetMusicUrl: '/hymns/288.pdf',
  },
  {
    id: 'h4',
    number: 405,
    title: '주의 친절한 팔에 안기세',
    koreanLyrics: '주의 친절한 팔에 안기세 우리 맘이 평안하리니...',
    englishLyrics: 'Safe in the arms of Jesus, safe on His gentle breast...',
    sheetMusicUrl: '/hymns/405.pdf',
  },
];

export function getCurrentUser() {
  return users.find((user) => user.id === currentUserId);
}

export function isChurchAdmin(user: User | undefined) {
  if (!user) {
    return false;
  }
  return user.isLeadPastor === true || user.position === '시무장로';
}

export function canManageAnnouncements(user: User | undefined) {
  return isChurchAdmin(user);
}

export function canManageSermons(user: User | undefined) {
  return isChurchAdmin(user);
}

export function canManageBulletins(user: User | undefined) {
  return isChurchAdmin(user);
}

export function canManageTithing(user: User | undefined) {
  if (!user) {
    return false;
  }
  return user.isFinanceElder === true && user.departments.includes('재정부');
}

export function canViewAllDepartmentChats(user: User | undefined) {
  return isChurchAdmin(user);
}

export function getVisibleChats(user: User | undefined) {
  if (!user) {
    return [];
  }
  if (canViewAllDepartmentChats(user)) {
    return chats;
  }
  return chats.filter((chat) => {
    if (!chat.isDepartment) {
      return chat.members.includes(user.id);
    }
    return chat.members.includes(user.id);
  });
}

export function getVisibleTithingRecords(user: User | undefined) {
  if (!user) {
    return [];
  }
  if (canManageTithing(user)) {
    return tithingRecords;
  }
  return tithingRecords.filter((record) => record.userId === user.id);
}

export function extractYoutubeVideoId(url: string) {
  try {
    const parsedUrl = new URL(url);
    if (parsedUrl.hostname.includes('youtu.be')) {
      return parsedUrl.pathname.replace('/', '');
    }
    if (parsedUrl.hostname.includes('youtube.com')) {
      return parsedUrl.searchParams.get('v') || '';
    }
    return '';
  } catch {
    return '';
  }
}

export function getYoutubeThumbnail(url: string) {
  const videoId = extractYoutubeVideoId(url);
  if (!videoId) {
    return 'https://picsum.photos/seed/sermon-fallback/640/360';
  }
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

export function getYoutubeEmbedUrl(url: string) {
  const videoId = extractYoutubeVideoId(url);
  if (!videoId) {
    return '';
  }
  return `https://www.youtube.com/embed/${videoId}`;
}
