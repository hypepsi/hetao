"use client"

import { useState } from 'react'
import useSWR from 'swr'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatDateTime } from '@/lib/date-utils'
import Link from 'next/link'
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/form'
import { useToast } from '@/hooks/use-toast'
import { format } from 'date-fns'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function FeedingHistoryClient() {
  const { data, mutate } = useSWR('/api/feeding/history', fetcher)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const [editForm, setEditForm] = useState({
    startTime: '',
    endTime: '',
    amount: '',
  })

  const handleEdit = (item: any) => {
    setEditingItem(item)
    setEditForm({
      startTime: format(new Date(item.startTime), "yyyy-MM-dd'T'HH:mm"),
      endTime: item.endTime ? format(new Date(item.endTime), "yyyy-MM-dd'T'HH:mm") : '',
      amount: item.amount.toString(),
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdate = async () => {
    if (!editingItem) return

    setLoading(true)
    try {
      // 将 datetime-local 字符串转换为 ISO 格式（带时区信息）
      const startDate = new Date(editForm.startTime)
      const endDate = editForm.endTime ? new Date(editForm.endTime) : null
      
      const res = await fetch(`/api/feeding/${editingItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startTime: startDate.toISOString(),
          endTime: endDate ? endDate.toISOString() : null,
          amount: editForm.amount,
        }),
      })

      const data = await res.json()

      if (data.success) {
        toast({ title: '更新成功' })
        mutate()
        setIsEditDialogOpen(false)
        setEditingItem(null)
      } else {
        toast({
          title: '更新失败',
          description: data.error,
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: '更新失败',
        description: '网络错误，请重试',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deletingId) return

    setLoading(true)
    try {
      const res = await fetch(`/api/feeding/${deletingId}`, {
        method: 'DELETE',
      })

      const data = await res.json()

      if (data.success) {
        toast({ title: '删除成功' })
        mutate()
        setIsDeleteDialogOpen(false)
        setDeletingId(null)
      } else {
        toast({
          title: '删除失败',
          description: data.error,
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: '删除失败',
        description: '网络错误，请重试',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-stone-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center mb-6">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold ml-4 text-stone-700">喂奶历史</h1>
        </div>

        <div className="space-y-4">
          {data?.feedings?.map((item: any) => (
            <Card key={item.id} className="bg-white/90 backdrop-blur-sm shadow-md rounded-3xl border-rose-100">
              <CardContent className="p-5">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-lg font-semibold mb-2 text-stone-700">
                      {formatDateTime(new Date(item.startTime))}
                    </p>
                    {item.endTime && (
                      <p className="text-sm text-stone-500 mb-1">
                        结束：{formatDateTime(new Date(item.endTime))}
                      </p>
                    )}
                    <p className="text-sm text-stone-500">奶量：{item.amount} ml</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(item)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setDeletingId(item.id)
                        setIsDeleteDialogOpen(true)
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {data?.feedings?.length === 0 && (
            <div className="text-center text-stone-400 py-12">暂无记录</div>
          )}
        </div>
      </div>

      {/* 编辑对话框 */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>编辑喂奶记录</DialogTitle>
            <DialogDescription>修改喂奶信息</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-startTime">开始时间</Label>
              <Input
                id="edit-startTime"
                type="datetime-local"
                value={editForm.startTime}
                onChange={(e) => setEditForm({ ...editForm, startTime: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-endTime">结束时间（可选）</Label>
              <Input
                id="edit-endTime"
                type="datetime-local"
                value={editForm.endTime}
                onChange={(e) => setEditForm({ ...editForm, endTime: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-amount">奶量 (ml)</Label>
              <Input
                id="edit-amount"
                type="number"
                value={editForm.amount}
                onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleUpdate} disabled={loading}>
              {loading ? '保存中...' : '保存'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 删除确认对话框 */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
            <DialogDescription>确定要删除这条记录吗？此操作无法撤销。</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              取消
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={loading}>
              {loading ? '删除中...' : '删除'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}






