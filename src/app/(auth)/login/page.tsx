'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Church } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();
    router.push('/chat');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="mx-auto w-full max-w-sm shadow-xl">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <Church className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl font-headline">EkklesiaConnect</CardTitle>
          <CardDescription>교회 공동체를 위한 공간에 오신 것을 환영합니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">이메일</Label>
              <Input id="email" type="email" placeholder="email@example.com" required />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">비밀번호</Label>
                <Link href="#" className="ml-auto inline-block text-sm underline">
                  비밀번호를 잊으셨나요?
                </Link>
              </div>
              <Input id="password" type="password" required />
            </div>
            <Button type="submit" className="w-full">
              로그인
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            아직 계정이 없으신가요?{' '}
            <Link href="/register" className="underline">
              교인 등록
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
