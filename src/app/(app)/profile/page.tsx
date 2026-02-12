import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { users } from "@/lib/data";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
    const currentUser = users.find(u => u.id === 'user-current');

    if (!currentUser) return null;

    return (
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
            <div className="max-w-2xl mx-auto">
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-6">
                            <Avatar className="h-24 w-24 border-2 border-primary">
                                <AvatarImage src={`https://picsum.photos/seed/${currentUser.avatar.replace('.png', '')}/200/200`} alt={currentUser.koreanName} />
                                <AvatarFallback className="text-3xl">{currentUser.koreanName.substring(0, 1)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <CardTitle className="text-3xl font-headline">{currentUser.koreanName}</CardTitle>
                                <CardDescription className="text-base">{currentUser.englishName}</CardDescription>
                                <p className="text-lg text-primary font-semibold mt-1">{currentUser.role}</p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="text-center">
                            <p className="text-muted-foreground">프로필 페이지는 현재 개발 중입니다.</p>
                            <Button variant="outline" className="mt-4">정보 수정</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}
