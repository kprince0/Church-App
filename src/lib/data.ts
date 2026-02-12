export type User = {
  id: string;
  koreanName: string;
  englishName: string;
  avatar: string;
  role: '담임목사' | '시무장로' | '재정장로' | '안수집사' | '서리집사' | '일반성도';
};

export type Message = {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  image?: string;
  file?: { name: string; url: string };
};

export type Chat = {
  id: string;
  type: 'individual' | 'group';
  name: string;
  members: string[];
  messages: Message[];
  avatar?: string;
  isDepartment?: boolean;
};

export const users: User[] = [
  { id: 'user-1', koreanName: '김목사', englishName: 'John Kim', avatar: '/avatars/user1.png', role: '담임목사' },
  { id: 'user-2', koreanName: '박장로', englishName: 'Peter Park', avatar: '/avatars/user2.png', role: '시무장로' },
  { id: 'user-3', koreanName: '이재정', englishName: 'James Lee', avatar: '/avatars/user3.png', role: '재정장로' },
  { id: 'user-4', koreanName: '최성도', englishName: 'Paul Choi', avatar: '/avatars/user4.png', role: '일반성도' },
  { id: 'user-5', koreanName: '윤집사', englishName: 'Esther Yoon', avatar: '/avatars/user5.png', role: '안수집사' },
  { id: 'user-current', koreanName: '나', englishName: 'Me', avatar: '/avatars/user-current.png', role: '일반성도' },
];

export const chats: Chat[] = [
  {
    id: 'chat-1',
    type: 'group',
    name: '예배부',
    members: ['user-1', 'user-2', 'user-5', 'user-current'],
    avatar: '/avatars/group-worship.png',
    isDepartment: true,
    messages: [
      { id: 'msg-1-1', senderId: 'user-2', text: '이번 주 주일 예배 찬양 순서입니다.', timestamp: '오후 2:30' },
      { id: 'msg-1-2', senderId: 'user-5', text: '확인했습니다. 기도하겠습니다.', timestamp: '오후 2:32' },
    ],
  },
  {
    id: 'chat-2',
    type: 'group',
    name: '재정부',
    members: ['user-1', 'user-3', 'user-2'],
    avatar: '/avatars/group-finance.png',
    isDepartment: true,
    messages: [
      { id: 'msg-2-1', senderId: 'user-3', text: '지난 달 재정 보고서 초안입니다. 검토 부탁드립니다.', timestamp: '오전 11:15' },
    ],
  },
  {
    id: 'chat-3',
    type: 'individual',
    name: '박장로',
    members: ['user-current', 'user-2'],
    avatar: '/avatars/user2.png',
    messages: [
      { id: 'msg-3-1', senderId: 'user-current', text: '장로님, 안녕하세요. 여쭤볼 것이 있습니다.', timestamp: '오전 10:01' },
      { id: 'msg-3-2', senderId: 'user-2', text: '네, 성도님. 말씀하세요.', timestamp: '오전 10:02' },
    ],
  },
  {
    id: 'chat-4',
    type: 'group',
    name: '청년부 모임',
    members: ['user-4', 'user-current'],
    avatar: '/avatars/group-youth.png',
    messages: [
      { id: 'msg-4-1', senderId: 'user-4', text: '이번 주 토요일에 볼링 어때요?', timestamp: '어제' },
      { id: 'msg-4-2', senderId: 'user-current', text: '좋아요! 다들 시간 괜찮으신가요?', timestamp: '어제' },
       { id: 'msg-4-3', senderId: 'user-4', text: '교회 행사 사진 공유합니다!', timestamp: '어제', image: 'https://picsum.photos/seed/chat1/300/200' },
    ],
  },
   {
    id: 'chat-5',
    type: 'group',
    name: '교육부',
    isDepartment: true,
    members: ['user-1', 'user-2', 'user-5'],
    avatar: '/avatars/group-edu.png',
    messages: [
      { id: 'msg-5-1', senderId: 'user-5', text: '여름성경학교 교재 준비 현황 공유드립니다.', timestamp: '그저께' },
    ],
  },
  {
    id: 'chat-6',
    type: 'group',
    name: '선교부',
    isDepartment: true,
    members: ['user-1', 'user-2'],
    avatar: '/avatars/group-mission.png',
    messages: [
      { id: 'msg-6-1', senderId: 'user-2', text: '단기선교팀 훈련 일정을 조율해야 합니다.', timestamp: '2일 전' },
    ],
  },
];

export type Sermon = {
  id: string;
  title: string;
  preacher: string;
  date: string;
  youtubeUrl: string;
  thumbnailUrl: string;
};

export const sermons: Sermon[] = [
  { id: 'sermon-1', title: '믿음의 기초', preacher: '김목사', date: '2024-05-19', youtubeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', thumbnailUrl: 'https://picsum.photos/seed/sermon1/480/270' },
  { id: 'sermon-2', title: '사랑의 계명', preacher: '김목사', date: '2024-05-12', youtubeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', thumbnailUrl: 'https://picsum.photos/seed/sermon2/480/270' },
  { id: 'sermon-3', title: '소망의 이유', preacher: '김목사', date: '2024-05-05', youtubeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', thumbnailUrl: 'https://picsum.photos/seed/sermon3/480/270' },
  { id: 'sermon-4', title: '은혜의 강가로', preacher: '김목사', date: '2024-04-28', youtubeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', thumbnailUrl: 'https://picsum.photos/seed/sermon4/480/270' },
];

export type Bulletin = {
  id: string;
  date: string;
  fileUrl: string;
  fileType: 'pdf' | 'jpg' | 'png';
};

export const bulletins: Bulletin[] = [
    { id: 'bulletin-1', date: '2024-05-26', fileUrl: '/bulletins/placeholder.pdf', fileType: 'pdf' },
    { id: 'bulletin-2', date: '2024-05-19', fileUrl: '/bulletins/placeholder.pdf', fileType: 'pdf' },
    { id: 'bulletin-3', date: '2024-05-12', fileUrl: '/bulletins/placeholder.pdf', fileType: 'pdf' },
];

export type TithingRecord = {
    id: string;
    date: string;
    type: '십일조' | '주일헌금' | '감사헌금' | '건축헌금' | '선교헌금';
    amount: number;
    memo?: string;
}

export const tithingRecords: TithingRecord[] = [
    { id: 'tith-1', date: '2024-05-19', type: '주일헌금', amount: 50 },
    { id: 'tith-2', date: '2024-05-12', type: '주일헌금', amount: 50 },
    { id: 'tith-3', date: '2024-05-05', type: '십일조', amount: 500 },
    { id: 'tith-4', date: '2024-05-05', type: '주일헌금', amount: 50 },
    { id: 'tith-5', date: '2024-05-01', type: '감사헌금', amount: 200, memo: '가족 건강에 감사하며' },
    { id: 'tith-6', date: '2024-04-28', type: '주일헌금', amount: 50 },
];
