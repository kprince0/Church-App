'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { BookOpen, Bot, Loader2, Send } from 'lucide-react';
import { handleAIQuery, AIQueryState } from '@/app/actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          검색 중...
        </>
      ) : (
        <>
          <Send className="mr-2 h-4 w-4" />
          질문하기
        </>
      )}
    </Button>
  );
}

export function AIQueryClient() {
  const initialState: AIQueryState = {};
  const [state, dispatch] = useFormState(handleAIQuery, initialState);

  return (
    <div className="flex-1 flex flex-col gap-6">
      <Card>
        <CardHeader>
          <div className="flex items-start gap-4">
            <div className="bg-primary p-3 rounded-full">
                <Bot className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
                <CardTitle className="font-headline text-xl">AI 성경/찬송가 도우미</CardTitle>
                <CardDescription>성경 구절이나 찬송가에 대해 자연어로 질문하세요.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form action={dispatch} className="space-y-4">
            <Textarea
              name="query"
              placeholder="예: '사랑은 오래 참고' 구절이 어디에 있나요?"
              className="min-h-[100px] text-base"
              required
            />
            {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
            <div className="flex justify-end">
              <SubmitButton />
            </div>
          </form>
        </CardContent>
      </Card>

      {state?.result && (
        <Card className="bg-muted/30">
          <CardHeader>
            <CardTitle>검색 결과</CardTitle>
            <CardDescription>{state.result.summary}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {state.result.results.map((item, index) => (
              <Card key={index} className="bg-background">
                <CardContent className="p-4">
                  {'book' in item ? (
                    <div>
                      <h4 className="font-semibold">{item.book} {item.chapter}:{item.verse}</h4>
                      <p className="mt-2 text-muted-foreground">"{item.text}"</p>
                    </div>
                  ) : (
                    <div>
                      <h4 className="font-semibold">{item.title} ({item.hymnNumber})</h4>
                       <p className="mt-2 text-muted-foreground">"{item.lyricsSnippet}"</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
            {state.result.additionalContext && (
                <Alert>
                    <BookOpen className="h-4 w-4" />
                    <AlertTitle>추가 정보</AlertTitle>
                    <AlertDescription>
                        {state.result.additionalContext}
                    </AlertDescription>
                </Alert>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
