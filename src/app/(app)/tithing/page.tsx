'use client';

import React, { useState } from 'react';
import { Calendar as CalendarIcon, DollarSign, Download, PlusCircle } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { addDays, format } from 'date-fns';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/components/ui/table';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { tithingRecords as allRecords } from '@/lib/data';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';


// Mock current user role
const currentUserRole = '재정장로';
const canEditTithing = currentUserRole === '재정장로';


export default function TithingPage() {
  const { toast } = useToast();
  const [date, setDate] = useState<DateRange | undefined>({
    from: addDays(new Date(), -90),
    to: new Date(),
  });

  const filteredRecords = allRecords.filter(record => {
    const recordDate = new Date(record.date);
    return date?.from && date?.to && recordDate >= date.from && recordDate <= date.to;
  });

  const total = filteredRecords.reduce((acc, record) => acc + record.amount, 0);

  const handleAddTithing = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    toast({
        title: "헌금 내역 추가됨",
        description: "새로운 헌금 내역이 성공적으로 기록되었습니다."
    });
  }

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="font-headline text-2xl">헌금 내역</CardTitle>
              <CardDescription>지정한 기간 동안의 헌금 내역을 확인합니다.</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={'outline'}
                    className={cn(
                      'w-[240px] justify-start text-left font-normal',
                      !date && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date?.from ? (
                      date.to ? (
                        <>
                          {format(date.from, 'LLL dd, y')} - {format(date.to, 'LLL dd, y')}
                        </>
                      ) : (
                        format(date.from, 'LLL dd, y')
                      )
                    ) : (
                      <span>기간 선택</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={date?.from}
                    selected={date}
                    onSelect={setDate}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
                <span className="sr-only">Download</span>
              </Button>
               {canEditTithing && (
                 <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        내역 추가
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>새 헌금 내역 추가</DialogTitle>
                            <DialogDescription>헌금 내역을 수동으로 추가합니다.</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleAddTithing} className="space-y-4 pt-4">
                            <div className="grid grid-cols-2 gap-4">
                               <div className="space-y-2">
                                    <Label htmlFor="tithing-date">날짜</Label>
                                    <Input id="tithing-date" type="date" defaultValue={format(new Date(), 'yyyy-MM-dd')} />
                               </div>
                                <div className="space-y-2">
                                    <Label htmlFor="tithing-type">종류</Label>
                                    <Select>
                                        <SelectTrigger id="tithing-type">
                                            <SelectValue placeholder="종류 선택" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="십일조">십일조</SelectItem>
                                            <SelectItem value="주일헌금">주일헌금</SelectItem>
                                            <SelectItem value="감사헌금">감사헌금</SelectItem>
                                            <SelectItem value="건축헌금">건축헌금</SelectItem>
                                            <SelectItem value="선교헌금">선교헌금</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="amount">금액</Label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input id="amount" type="number" placeholder="0.00" className="pl-8" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="memo">메모</Label>
                                <Input id="memo" placeholder="메모 (선택 사항)" />
                            </div>
                            <Button type="submit" className="w-full">추가하기</Button>
                        </form>
                    </DialogContent>
                 </Dialog>
               )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>날짜</TableHead>
                <TableHead>종류</TableHead>
                <TableHead>메모</TableHead>
                <TableHead className="text-right">금액</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.length > 0 ? (
                filteredRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{record.date}</TableCell>
                    <TableCell>{record.type}</TableCell>
                    <TableCell className="text-muted-foreground">{record.memo || '-'}</TableCell>
                    <TableCell className="text-right">
                      ${record.amount.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">선택된 기간에 내역이 없습니다.</TableCell>
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
                <TableRow>
                    <TableCell colSpan={3} className="font-bold">총 합계</TableCell>
                    <TableCell className="text-right font-bold">${total.toFixed(2)}</TableCell>
                </TableRow>
            </TableFooter>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
}
