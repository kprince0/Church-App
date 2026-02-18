import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { churchName } from '@/lib/data';

export default function AboutPage() {
  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-6">
      <div className="mx-auto max-w-4xl space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{churchName}</CardTitle>
            <CardDescription>예배와 말씀, 선교와 섬김으로 세워지는 공동체</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-7 text-muted-foreground">
            <p>
              잭슨빌 한인장로교회는 예수 그리스도의 복음을 중심으로 세대와 가정을 세우는 교회입니다.
              본 앱은 교회 소개, 교인 등록, 기관별 소통, 설교 시청, 주보 열람, 헌금 내역 확인을 한곳에서 제공하도록 구성되었습니다.
            </p>
            <p>
              예배부, 교육부, 재정부, 선교부, 친교부, 관리부가 앱 내 기관 채팅을 통해 소통하며,
              모든 성도는 본인 정보와 본인 헌금 기록만 안전하게 열람할 수 있습니다.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
