'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { format } from 'date-fns';
import { CalendarIcon, Church, PlusCircle, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  koreanName: z.string().min(1, '한국이름을 입력해주세요.'),
  englishName: z.string().min(1, '영문이름을 입력해주세요.'),
  title: z.enum(['없음', '서리집사', '안수집사', '은퇴장로', '시무장로', '목회자']),
  appointmentDate: z.date().optional(),
  appointmentLocation: z.string().optional(),
  phone: z.string().min(1, '전화번호를 입력해주세요.'),
  email: z.string().email('유효한 이메일 주소를 입력해주세요.'),
  address1: z.string().min(1, '주소를 입력해주세요.'),
  address2: z.string().optional(),
  city: z.string().min(1, '도시를 입력해주세요.'),
  state: z.string().min(1, '주/도를 입력해주세요.'),
  zip: z.string().min(1, '우편번호를 입력해주세요.'),
  family: z.array(z.object({
    relationship: z.enum(['배우자', '자녀', '부모']),
    name: z.string().min(1, '이름을 입력해주세요.'),
  })).optional(),
});

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      koreanName: '',
      englishName: '',
      title: '없음',
      phone: '',
      email: '',
      address1: '',
      city: '',
      state: '',
      zip: '',
      family: [],
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: "등록 요청 완료",
      description: "관리자 승인 후 로그인이 가능합니다.",
    });
    router.push('/login');
  }

  const { fields, append, remove } = require("react-hook-form").useFieldArray({
    control: form.control,
    name: "family",
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="mx-auto w-full max-w-2xl shadow-xl">
        <CardHeader>
          <div className="flex items-center gap-4">
            <Church className="h-10 w-10 text-primary" />
            <div>
              <CardTitle className="text-2xl font-headline">교인 등록</CardTitle>
              <CardDescription>EkklesiaConnect에 오신 것을 환영합니다. 정보를 입력해주세요.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField control={form.control} name="koreanName" render={({ field }) => (
                  <FormItem>
                    <FormLabel>한국 이름</FormLabel>
                    <FormControl><Input placeholder="홍길동" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="englishName" render={({ field }) => (
                  <FormItem>
                    <FormLabel>영문 이름 (Legal Name)</FormLabel>
                    <FormControl><Input placeholder="Gildong Hong" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <FormField control={form.control} name="title" render={({ field }) => (
                  <FormItem>
                    <FormLabel>직분</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="직분을 선택하세요" /></SelectTrigger></FormControl>
                      <SelectContent>
                        {['없음', '서리집사', '안수집사', '은퇴장로', '시무장로', '목회자'].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="appointmentDate" render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>직분 임명일</FormLabel>
                    <Popover>
                        <PopoverTrigger asChild>
                            <FormControl>
                            <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                {field.value ? format(field.value, "PPP") : <span>날짜 선택</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                            </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                        </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="appointmentLocation" render={({ field }) => (
                  <FormItem>
                    <FormLabel>임명 교회</FormLabel>
                    <FormControl><Input placeholder="임명받은 교회" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField control={form.control} name="phone" render={({ field }) => (
                  <FormItem>
                    <FormLabel>전화번호</FormLabel>
                    <FormControl><Input placeholder="010-1234-5678" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem>
                    <FormLabel>이메일</FormLabel>
                    <FormControl><Input placeholder="email@example.com" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <div>
                <FormLabel>주소</FormLabel>
                <div className="mt-2 space-y-2">
                    <FormField control={form.control} name="address1" render={({ field }) => (
                        <FormItem>
                            <FormControl><Input placeholder="Address 1" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="address2" render={({ field }) => (
                        <FormItem>
                            <FormControl><Input placeholder="Address 2 (Optional)" {...field} /></FormControl>
                        </FormItem>
                    )} />
                    <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
                        <FormField control={form.control} name="city" render={({ field }) => (
                            <FormItem><FormControl><Input placeholder="City" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="state" render={({ field }) => (
                            <FormItem><FormControl><Input placeholder="State" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="zip" render={({ field }) => (
                            <FormItem><FormControl><Input placeholder="Zip Code" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                    </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                    <FormLabel>가족 관계</FormLabel>
                    <Button type="button" variant="ghost" size="sm" onClick={() => append({ relationship: '배우자', name: '' })}>
                        <PlusCircle className="mr-2 h-4 w-4" /> 추가
                    </Button>
                </div>
                <div className="mt-2 space-y-2">
                    {fields.map((item, index) => (
                    <div key={item.id} className="flex items-center gap-2">
                        <FormField control={form.control} name={`family.${index}.relationship`} render={({ field }) => (
                            <FormItem className="w-1/3">
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        <SelectItem value="배우자">배우자</SelectItem>
                                        <SelectItem value="자녀">자녀</SelectItem>
                                        <SelectItem value="부모">부모</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormItem>
                        )} />
                         <FormField control={form.control} name={`family.${index}.name`} render={({ field }) => (
                            <FormItem className="flex-1">
                                <FormControl><Input placeholder="가족 이름" {...field} /></FormControl>
                            </FormItem>
                        )} />
                        <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                    ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4">
                <Link href="/login" className="text-sm underline">
                  이미 계정이 있으신가요?
                </Link>
                <Button type="submit">등록 요청</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
