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
import { format, addMinutes } from 'date-fns'
import { Droplet, Minus, Plus } from 'lucide-react'

interface FeedingSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export default function FeedingSheet({ open, onOpenChange, onSuccess }: FeedingSheetProps) {
  const [startTime, setStartTime] = useState(format(new Date(), "yyyy-MM-dd'T'HH:mm"))
  const [duration, setDuration] = useState(15) // 默认15分钟
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleDecrease = () => {
    if (duration > 1) {
      setDuration(duration - 1)
    }
  }

  const handleIncrease = () => {
    setDuration(duration + 1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!amount) {
      toast({
        title: '请填写奶量',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)
    try {
      // 自动计算结束时间
      const start = new Date(startTime)
      const end = addMinutes(start, duration)

      const res = await fetch('/api/feeding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startTime: start.toISOString(),
          endTime: end.toISOString(),
          amount: parseInt(amount),
        }),
      })

      const data = await res.json()

      if (data.success) {
        toast({
          title: '记录成功',
        })
        onSuccess()
        // 重置表单
        setStartTime(format(new Date(), "yyyy-MM-dd'T'HH:mm"))
        setDuration(15)
        setAmount('')
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
      <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl">
        <SheetHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-50 rounded-2xl">
              <Droplet className="h-5 w-5 text-rose-500" />
            </div>
            <div>
              <SheetTitle className="text-xl text-stone-700">记录喂奶</SheetTitle>
              <SheetDescription>填写喂奶信息</SheetDescription>
            </div>
          </div>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="startTime" className="text-base font-medium text-stone-700">开始时间</Label>
            <Input
              id="startTime"
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="h-12 text-base rounded-2xl border-rose-100"
              required
            />
          </div>

          <div className="space-y-3">
            <Label className="text-base font-medium text-stone-700">持续时长</Label>
            <div className="flex items-center justify-center gap-4 bg-rose-50 rounded-3xl p-4">
              <button
                type="button"
                onClick={handleDecrease}
                disabled={duration <= 1}
                className="w-12 h-12 rounded-full bg-white border-2 border-rose-100 flex items-center justify-center hover:bg-rose-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
              >
                <Minus className="h-5 w-5 text-stone-700" />
              </button>
              <div className="min-w-[120px] text-center">
                <span className="text-4xl font-bold text-rose-900">{duration}</span>
                <span className="text-lg text-stone-400 ml-2">分钟</span>
              </div>
              <button
                type="button"
                onClick={handleIncrease}
                className="w-12 h-12 rounded-full bg-white border-2 border-rose-100 flex items-center justify-center hover:bg-rose-50 transition-colors shadow-sm"
              >
                <Plus className="h-5 w-5 text-stone-700" />
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount" className="text-base font-medium text-stone-700">奶量 (ml)</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="请输入奶量"
              className="h-14 text-2xl font-semibold text-center rounded-2xl border-rose-100 text-rose-900"
              required
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
