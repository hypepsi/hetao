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

interface ExcretionSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export default function ExcretionSheet({ open, onOpenChange, onSuccess }: ExcretionSheetProps) {
  const [color, setColor] = useState('')
  const [texture, setTexture] = useState('')
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
          type: '大便', // 固定为大便
          color,
          texture,
          note,
        }),
      })

      const data = await res.json()

      if (data.success) {
        toast({
          title: '记录成功',
        })
        onSuccess()
        // 重置表单
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
      <SheetContent side="bottom" className="h-[80vh]">
        <SheetHeader>
          <SheetTitle>记录排便</SheetTitle>
          <SheetDescription>填写排便信息</SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* 类型固定为大便，不再显示选择器 */}
          <div className="space-y-2">
            <Label htmlFor="color">颜色/性状（可选）</Label>
            <Input
              id="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              placeholder="例如：黄色、正常"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="texture">质地（可选）</Label>
            <Input
              id="texture"
              value={texture}
              onChange={(e) => setTexture(e.target.value)}
              placeholder="例如：稀、正常、干"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="note">备注（可选）</Label>
            <Input
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="其他备注信息"
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? '保存中...' : '保存'}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  )
}





