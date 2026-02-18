import 'dotenv/config';
import { applicationDefault, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { FieldValue, getFirestore } from 'firebase-admin/firestore';

const departments = ['예배부', '교육부', '재정부', '선교부', '친교부', '관리부'];

const departmentRooms = [
  { id: 'dept-worship', name: '예배부', department: '예배부' },
  { id: 'dept-education', name: '교육부', department: '교육부' },
  { id: 'dept-finance', name: '재정부', department: '재정부' },
  { id: 'dept-mission', name: '선교부', department: '선교부' },
  { id: 'dept-fellowship', name: '친교부', department: '친교부' },
  { id: 'dept-management', name: '관리부', department: '관리부' },
];

function now() {
  return new Date().toISOString();
}

function getRequiredEnv(name, fallback = '') {
  return process.env[name] || fallback;
}

async function ensureAdminUser(auth) {
  const email = getRequiredEnv('SEED_DEFAULT_ADMIN_EMAIL', 'admin@jkpc.org');
  const password = getRequiredEnv('SEED_DEFAULT_ADMIN_PASSWORD', 'ChangeMe123!');

  let user;
  try {
    user = await auth.getUserByEmail(email);
  } catch {
    user = await auth.createUser({
      email,
      password,
      displayName: getRequiredEnv('SEED_DEFAULT_ADMIN_KOREAN_NAME', '기본관리자'),
    });
  }

  if (password) {
    await auth.updateUser(user.uid, { password });
  }

  return user;
}

async function upsertAdminMember(db, uid) {
  const memberRef = db.collection('members').doc(uid);
  const snapshot = await memberRef.get();
  const createdAt = snapshot.exists ? snapshot.data().createdAt || now() : now();

  await memberRef.set(
    {
      uid,
      koreanName: getRequiredEnv('SEED_DEFAULT_ADMIN_KOREAN_NAME', '기본관리자'),
      englishName: getRequiredEnv('SEED_DEFAULT_ADMIN_ENGLISH_NAME', 'Default Admin'),
      phone: getRequiredEnv('SEED_DEFAULT_ADMIN_PHONE', '904-000-0000'),
      email: getRequiredEnv('SEED_DEFAULT_ADMIN_EMAIL', 'admin@jkpc.org'),
      status: 'approved',
      position: '시무장로',
      isLeadPastor: true,
      isFinanceElder: true,
      departments,
      address: {
        address1: getRequiredEnv('SEED_DEFAULT_ADMIN_ADDRESS1', '5001 Main St'),
        address2: '',
        city: getRequiredEnv('SEED_DEFAULT_ADMIN_CITY', 'Jacksonville'),
        state: getRequiredEnv('SEED_DEFAULT_ADMIN_STATE', 'FL'),
        zip: getRequiredEnv('SEED_DEFAULT_ADMIN_ZIP', '32207'),
      },
      family: [],
      createdAt,
      updatedAt: now(),
    },
    { merge: true }
  );
}

async function upsertDepartmentRooms(db, adminUid) {
  for (const room of departmentRooms) {
    const roomRef = db.collection('chats').doc(room.id);
    await roomRef.set(
      {
        type: 'group',
        name: room.name,
        isDepartment: true,
        department: room.department,
        members: FieldValue.arrayUnion(adminUid),
        createdAt: now(),
        updatedAt: now(),
      },
      { merge: true }
    );
  }
}

async function main() {
  initializeApp({ credential: applicationDefault() });

  const auth = getAuth();
  const db = getFirestore();

  const adminUser = await ensureAdminUser(auth);
  await upsertAdminMember(db, adminUser.uid);
  await upsertDepartmentRooms(db, adminUser.uid);

  console.log('Firebase 시드 완료');
  console.log(`- 기본 관리자 이메일: ${getRequiredEnv('SEED_DEFAULT_ADMIN_EMAIL', 'admin@jkpc.org')}`);
  console.log(`- 관리자 UID: ${adminUser.uid}`);
  console.log('- 기관 채팅방 6개 업서트 완료');
}

main().catch((error) => {
  console.error('시드 실패:', error);
  process.exit(1);
});
