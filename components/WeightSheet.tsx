"use client"

import { useState } from 'react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/form'
import { useToast } from '@/hooks/use-toast'
import { format } from 'date-fns'
import { Scale } from 'lucide-react'

interface WeightSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export default function WeightSheet({ open, onOpenChange, onSuccess }: WeightSheetProps) {
  const [time, setTime] = useState(format(new Date(), "yyyy-MM-dd'T'HH:mm"))
  const [kg, setKg] = useState('')
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!kg) {
      toast({
        title: '请填写体重',
        variant: 'destructive',
      })
      return
    }

    const weightValue = parseFloat(kg)
    if (isNaN(weightValue) || weightValue <= 0) {
      toast({
        title: '请输入有效的体重值',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/weight', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kg: weightValue,
          note: note || null,
        }),
      })

      const data = await res.json()

      if (data.success) {
        toast({
          title: '记录成功',
        })
        onSuccess()
        // 重置表单
        setTime(format(new Date(), "yyyy-MM-dd'T'HH:mm"))
        setKg('')
        setNote('')
      } else {
        toast({
          title: '保存失败',
          description: data.error,
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: '保存失败',
        description: '网络错误，请重试',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[70vh] rounded-t-3xl">
        <SheetHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-50 rounded-2xl">
              <Scale className="h-5 w-5 text-rose-500" />
            </div>
            <div>
              <SheetTitle className="text-xl text-stone-700">记录体重</SheetTitle>
              <SheetDescription>填写体重信息</SheetDescription>
            </div>
          </div>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="time" className="text-base font-medium text-stone-700">时间</Label>
            <Input
              id="time"
              type="datetime-local"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="h-12 text-base rounded-2xl border-rose-100"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="kg" className="text-base font-medium text-stone-700">体重 (kg)</Label>
            <Input
              id="kg"
              type="number"
              step="0.1"
              value={kg}
              onChange={(e) => setKg(e.target.value)}
              placeholder="请输入体重"
              className="h-14 text-3xl font-semibold text-center rounded-2xl border-rose-100 text-rose-900"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="note" className="text-base font-medium text-stone-700">备注（可选）</Label>
            <Input
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="其他备注信息"
              className="h-12 text-base rounded-2xl border-rose-100"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full h-12 rounded-full bg-rose-400 text-white hover:bg-rose-500 text-base font-medium shadow-md" 
            disabled={loading}
          >
            {loading ? '保存中...' : '保存记录'}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  )
}






