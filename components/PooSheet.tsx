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
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { format } from 'date-fns'
import { Wind } from 'lucide-react'

interface PooSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

const COLOR_OPTIONS = ['黄色', '金黄色', '绿色', '墨绿色', '褐色', '其他']

const TEXTURE_OPTIONS = ['糊状', '水便分离', '奶瓣便', '墨绿便', '正常条状', '干硬']

export default function PooSheet({ open, onOpenChange, onSuccess }: PooSheetProps) {
  const [time, setTime] = useState(format(new Date(), "yyyy-MM-dd'T'HH:mm"))
  const [color, setColor] = useState<string>('')
  const [texture, setTexture] = useState<string>('')
  const [note, setNote] = useState('')
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
          type: '大便',
          time: time, // 发送前端选择的时间
          color: color || null,
          texture: texture || null,
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
        setColor('')
        setTexture('')
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
      <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl">
        <SheetHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-50 rounded-2xl">
              <Wind className="h-5 w-5 text-rose-500" />
            </div>
            <div>
              <SheetTitle className="text-xl text-stone-700">记录大便</SheetTitle>
              <SheetDescription>选择颜色和性状</SheetDescription>
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
            <Label className="text-base font-medium text-stone-700">颜色</Label>
            <div className="flex flex-wrap gap-2">
              {COLOR_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setColor(opt)}
                  className={`
                    px-4 py-2 rounded-full text-sm font-medium transition-all
                    ${color === opt
                      ? 'bg-rose-400 text-white shadow-md'
                      : 'bg-white text-stone-700 border-2 border-rose-100 hover:border-rose-300'
                    }
                  `}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-base font-medium text-stone-700">性状</Label>
            <div className="flex flex-wrap gap-2">
              {TEXTURE_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setTexture(opt)}
                  className={`
                    px-4 py-2 rounded-full text-sm font-medium transition-all
                    ${texture === opt
                      ? 'bg-rose-400 text-white shadow-md'
                      : 'bg-white text-stone-700 border-2 border-rose-100 hover:border-rose-300'
                    }
                  `}
                >
                  {opt}
                </button>
              ))}
            </div>
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
