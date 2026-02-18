export type Department = '예배부' | '교육부' | '재정부' | '선교부' | '친교부' | '관리부';
export type Position = '없음' | '서리집사' | '안수집사' | '은퇴장로' | '시무장로' | '목회자';

export type MemberProfile = {
  uid: string;
  koreanName: string;
  englishName: string;
  phone: string;
  email: string;
  status: 'pending' | 'approved' | 'rejected';
  position: Position;
  positionDate?: string;
  positionChurch?: string;
  isLeadPastor?: boolean;
  isFinanceElder?: boolean;
  departments: Department[];
  address: {
    address1: string;
    address2?: string;
    city: string;
    state: string;
    zip: string;
  };
  family: Array<{ relationship: '배우자' | '자녀' | '부모'; name: string }>;
  createdAt: string;
  updatedAt: string;
};

export type ChatRoom = {
  id: string;
  type: 'individual' | 'group';
  name: string;
  isDepartment: boolean;
  department?: Department;
  members: string[];
  createdAt: string;
  updatedAt: string;
};

export type ChatMessage = {
  id: string;
  senderId: string;
  senderName: string;
  text?: string;
  imageUrl?: string;
  imageThumbUrl?: string;
  fileUrl?: string;
  fileName?: string;
  createdAt: string;
};

export type Announcement = {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  title: string;
  content: string;
  createdAt: string;
};

export type TithingRecord = {
  id: string;
  userId: string;
  userName: string;
  type: '십일조' | '주일헌금' | '감사헌금' | '건축헌금' | '선교헌금';
  amount: number;
  memo?: string;
  date: string;
  createdBy: string;
  updatedAt: string;
};

export type Sermon = {
  id: string;
  title: string;
  preacher: string;
  youtubeUrl: string;
  date: string;
  createdBy: string;
};

export type Bulletin = {
  id: string;
  title: string;
  date: string;
  fileType: 'pdf' | 'jpg' | 'png';
  fileUrl: string;
  createdBy: string;
};
