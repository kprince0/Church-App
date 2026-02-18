"use client";

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuthMember } from '@/hooks/use-auth-member';

export default function ProfilePage() {
  const { member } = useAuthMember();

  if (!member) {
    return null;
  }

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-6">
      <div className="mx-auto max-w-3xl space-y-4">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-6">
              <Avatar className="h-24 w-24 border-2 border-primary">
                <AvatarImage src={`https://picsum.photos/seed/${member.uid}/200/200`} alt={member.koreanName} />
                <AvatarFallback className="text-3xl">{member.koreanName.substring(0, 1)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-3xl font-headline">{member.koreanName}</CardTitle>
                <CardDescription className="text-base">{member.englishName}</CardDescription>
                <p className="mt-1 text-lg font-semibold text-primary">{member.position}</p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4 text-sm">
            <div>
              <p className="mb-1 font-semibold">연락처</p>
              <p className="text-muted-foreground">전화번호: {member.phone}</p>
              <p className="text-muted-foreground">이메일: {member.email}</p>
            </div>

            <div>
              <p className="mb-1 font-semibold">주소</p>
              <p className="text-muted-foreground">
                {member.address.address1} {member.address.address2 || ''}, {member.address.city}, {member.address.state} {member.address.zip}
              </p>
            </div>

            <div>
              <p className="mb-1 font-semibold">소속 기관</p>
              <div className="flex flex-wrap gap-2">
                {member.departments.length > 0 ? (
                  member.departments.map((department) => (
                    <Badge key={department} variant="secondary">
                      {department}
                    </Badge>
                  ))
                ) : (
                  <p className="text-muted-foreground">소속 기관이 지정되지 않았습니다.</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
