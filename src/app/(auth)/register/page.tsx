'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import * as z from 'zod';
import { format } from 'date-fns';
import { CalendarIcon, Church, PlusCircle, SearchCheck, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { churchName, users } from '@/lib/data';
import { registerMember } from '@/lib/firebase/auth';

const formSchema = z
  .object({
    koreanName: z.string().min(1, '한국이름을 입력해주세요.'),
    englishName: z.string().min(1, '영문 Legal Name을 입력해주세요.'),
    email: z.string().email('유효한 이메일을 입력해주세요.'),
    password: z.string().min(8, '비밀번호는 8자 이상이어야 합니다.'),
    passwordConfirm: z.string().min(8, '비밀번호 확인을 입력해주세요.'),
    position: z.enum(['없음', '서리집사', '안수집사', '은퇴장로', '시무장로', '목회자']),
    positionDate: z.date().optional(),
    positionChurch: z.string().optional(),
    phone: z.string().min(1, '전화번호를 입력해주세요.'),
    address1: z.string().min(1, 'Address 1을 입력해주세요.'),
    address2: z.string().optional(),
    city: z.string().min(1, 'City를 입력해주세요.'),
    state: z.string().min(1, 'State를 입력해주세요.'),
    zip: z.string().min(1, 'Zip을 입력해주세요.'),
    family: z
      .array(
        z.object({
          relationship: z.enum(['배우자', '자녀', '부모']),
          name: z.string().min(1, '이름을 입력해주세요.'),
        })
      )
      .optional(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    path: ['passwordConfirm'],
    message: '비밀번호가 일치하지 않습니다.',
  });

function getSurname(name: string) {
  return name.trim().charAt(0);
}

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      koreanName: '',
      englishName: '',
      email: '',
      password: '',
      passwordConfirm: '',
      position: '없음',
      phone: '',
      address1: '',
      address2: '',
      city: '',
      state: '',
      zip: '',
      family: [],
    },
  });

  const watchedKoreanName = form.watch('koreanName');
  const watchedAddress1 = form.watch('address1');
  const watchedCity = form.watch('city');
  const watchedState = form.watch('state');
  const watchedZip = form.watch('zip');

  const matchingFamilies = useMemo(() => {
    const surname = getSurname(watchedKoreanName || '');
    if (!surname || !watchedAddress1 || !watchedCity || !watchedState || !watchedZip) {
      return [];
    }

    return users.filter((user) => {
      const sameSurname = getSurname(user.koreanName) === surname;
      const sameAddress =
        user.address.address1.toLowerCase() === watchedAddress1.toLowerCase() &&
        user.address.city.toLowerCase() === watchedCity.toLowerCase() &&
        user.address.state.toLowerCase() === watchedState.toLowerCase() &&
        user.address.zip === watchedZip;
      return sameSurname && sameAddress;
    });
  }, [watchedAddress1, watchedCity, watchedKoreanName, watchedState, watchedZip]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'family',
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setSubmitting(true);
    try {
      await registerMember({
        email: values.email,
        password: values.password,
        koreanName: values.koreanName,
        englishName: values.englishName,
        phone: values.phone,
        position: values.position,
        positionDate: values.positionDate ? format(values.positionDate, 'yyyy-MM-dd') : undefined,
        positionChurch: values.positionChurch,
        address: {
          address1: values.address1,
          address2: values.address2,
          city: values.city,
          state: values.state,
          zip: values.zip,
        },
        family: values.family || [],
      });

      toast({
        title: '교인 등록 완료',
        description: '관리자 승인 후 로그인할 수 있습니다.',
      });
      router.push('/login');
    } catch {
      toast({
        title: '등록 실패',
        description: '이미 등록된 이메일이거나 입력 정보가 올바르지 않습니다.',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="mx-auto w-full max-w-4xl shadow-xl">
        <CardHeader>
          <div className="flex items-center gap-4">
            <Church className="h-10 w-10 text-primary" />
            <div>
              <CardTitle className="text-2xl font-headline">교인 등록</CardTitle>
              <CardDescription>{churchName} 등록 정보를 입력해주세요.</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField control={form.control} name="koreanName" render={({ field }) => (
                  <FormItem><FormLabel>한국이름</FormLabel><FormControl><Input placeholder="홍길동" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="englishName" render={({ field }) => (
                  <FormItem><FormLabel>영문이름 (Legal Name)</FormLabel><FormControl><Input placeholder="Gildong Hong" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem><FormLabel>이메일</FormLabel><FormControl><Input type="email" placeholder="name@example.com" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="password" render={({ field }) => (
                  <FormItem><FormLabel>비밀번호</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="passwordConfirm" render={({ field }) => (
                  <FormItem><FormLabel>비밀번호 확인</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <FormField control={form.control} name="position" render={({ field }) => (
                  <FormItem>
                    <FormLabel>직분</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="직분 선택" /></SelectTrigger></FormControl>
                      <SelectContent>{['없음', '서리집사', '안수집사', '은퇴장로', '시무장로', '목회자'].map((position) => (
                        <SelectItem key={position} value={position}>{position}</SelectItem>
                      ))}</SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="positionDate" render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>직분 맡은 날짜</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button variant="outline" className={cn('pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}>
                            {field.value ? format(field.value, 'yyyy-MM-dd') : <span>날짜 선택</span>}
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

                <FormField control={form.control} name="positionChurch" render={({ field }) => (
                  <FormItem><FormLabel>직분 맡은 교회</FormLabel><FormControl><Input placeholder="예: 서울중앙교회" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>

              <FormField control={form.control} name="phone" render={({ field }) => (
                <FormItem><FormLabel>전화번호</FormLabel><FormControl><Input placeholder="904-000-0000" {...field} /></FormControl><FormMessage /></FormItem>
              )} />

              <div>
                <FormLabel>주소</FormLabel>
                <div className="mt-2 space-y-2">
                  <FormField control={form.control} name="address1" render={({ field }) => (
                    <FormItem><FormControl><Input placeholder="Address 1" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="address2" render={({ field }) => (
                    <FormItem><FormControl><Input placeholder="Address 2" {...field} /></FormControl></FormItem>
                  )} />
                  <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
                    <FormField control={form.control} name="city" render={({ field }) => (
                      <FormItem><FormControl><Input placeholder="City" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="state" render={({ field }) => (
                      <FormItem><FormControl><Input placeholder="State" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="zip" render={({ field }) => (
                      <FormItem><FormControl><Input placeholder="Zip" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>
                </div>
              </div>

              {matchingFamilies.length > 0 && (
                <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-primary">
                    <SearchCheck className="h-4 w-4" /> 기등록 교인 교차검증 결과
                  </div>
                  <p className="text-sm text-muted-foreground">같은 성과 주소를 가진 교인이 확인되었습니다. 아래 대상과 관계를 가족관계에 입력해주세요.</p>
                  <ul className="mt-2 space-y-1 text-sm">
                    {matchingFamilies.map((member) => (
                      <li key={member.id}>{member.koreanName} ({member.position}) - {member.address.address1}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <FormLabel>가족관계</FormLabel>
                  <Button type="button" variant="ghost" size="sm" onClick={() => append({ relationship: '배우자', name: '' })}>
                    <PlusCircle className="mr-2 h-4 w-4" /> 추가
                  </Button>
                </div>
                <div className="space-y-2">
                  {fields.length === 0 && <p className="text-sm text-muted-foreground">배우자/자녀/부모 정보를 추가하세요.</p>}
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
                        <FormItem className="flex-1"><FormControl><Input placeholder="가족 이름" {...field} /></FormControl></FormItem>
                      )} />
                      <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4">
                <Link href="/login" className="text-sm underline">이미 등록된 교인이신가요?</Link>
                <Button type="submit" disabled={submitting}>{submitting ? '등록 중...' : '등록 요청'}</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
