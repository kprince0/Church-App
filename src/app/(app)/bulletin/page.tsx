'use client';

import { useState } from 'react';
import { PlusCircle, UploadCloud, FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { bulletins } from '@/lib/data';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';

// Mock current user role
const currentUserRole = '시무장로';
const canUploadBulletin = currentUserRole === '시무장로' || currentUserRole === '담임목사';

export default function BulletinPage() {
    const { toast } = useToast();
    const [isUploading, setIsUploading] = useState(false);

    const handleUpload = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsUploading(true);
        // Simulate upload
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsUploading(false);
        toast({
            title: "업로드 성공",
            description: "새로운 주보가 등록되었습니다.",
        });
    }

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold font-headline">주보</h1>
        {canUploadBulletin && (
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                주보 업로드
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>새 주보 업로드</DialogTitle>
                <DialogDescription>이번 주 주보 파일을 업로드합니다. (PDF, JPG, PNG)</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleUpload} className="mt-4 space-y-4">
                <div>
                  <Label htmlFor="bulletin-file" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    파일 선택
                  </Label>
                  <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pb-6 pt-5 dark:border-gray-600">
                    <div className="space-y-1 text-center">
                      <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600 dark:text-gray-400">
                        <label
                          htmlFor="bulletin-file"
                          className="relative cursor-pointer rounded-md bg-white font-medium text-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 hover:text-primary-dark dark:bg-background dark:text-accent"
                        >
                          <span>파일 업로드</span>
                          <Input id="bulletin-file" name="file-upload" type="file" className="sr-only" accept=".pdf,.jpg,.jpeg,.png"/>
                        </label>
                        <p className="pl-1">또는 파일을 드래그하세요</p>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-500">PDF, JPG, PNG up to 10MB</p>
                    </div>
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={isUploading}>
                  {isUploading ? '업로드 중...' : '업로드'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="space-y-4">
        {bulletins.map((bulletin) => (
          <Card key={bulletin.id}>
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <FileText className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-semibold">{bulletin.date} 주보</p>
                  <p className="text-sm text-muted-foreground">
                    {bulletin.fileType.toUpperCase()} 파일
                  </p>
                </div>
              </div>
              <Button variant="outline" size="icon" asChild>
                <a href={bulletin.fileUrl} download={`${bulletin.date}_bulletin.${bulletin.fileType}`}>
                  <Download className="h-4 w-4" />
                  <span className="sr-only">Download</span>
                </a>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
