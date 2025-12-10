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
import { Droplet } from 'lucide-react'

interface PeeSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

const COLOR_OPTIONS = ['清澈', '黄', '深黄']

export default function PeeSheet({ open, onOpenChange, onSuccess }: PeeSheetProps) {
  const [time, setTime] = useState(format(new Date(), "yyyy-MM-dd'T'HH:mm"))
  const [color, setColor] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    setLoading(true)
    try {
      const res = await fetch('/api/excretion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: '小便',
          color: color || null,
          texture: null,
          note: null,
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
        setColor('')
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
              <Droplet className="h-5 w-5 text-rose-500" />
            </div>
            <div>
              <SheetTitle className="text-xl text-stone-700">记录小便</SheetTitle>
              <SheetDescription>选择色泽</SheetDescription>
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

          <div className="space-y-3">
            <Label className="text-base font-medium text-stone-700">色泽</Label>
            <div className="grid grid-cols-3 gap-3">
              {COLOR_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setColor(opt)}
                  className={`
                    h-16 rounded-2xl border-2 transition-all font-medium text-base
                    ${color === opt
                      ? 'bg-rose-400 text-white border-rose-400 shadow-md'
                      : 'bg-white text-stone-700 border-rose-100 hover:border-rose-300'
                    }
                  `}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full h-12 rounded-full bg-rose-400 text-white hover:bg-rose-500 text-base font-medium shadow-md" 
            disabled={loading || !color}
          >
            {loading ? '保存中...' : '保存记录'}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  )
}
