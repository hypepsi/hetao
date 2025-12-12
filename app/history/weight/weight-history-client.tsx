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

export default function WeightHistoryClient() {
  const { data, mutate } = useSWR('/api/weight/history', fetcher)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const [editForm, setEditForm] = useState({
    time: '',
    kg: '',
    note: '',
  })

  const handleEdit = (item: any) => {
    setEditingItem(item)
    setEditForm({
      time: format(new Date(item.createdAt), "yyyy-MM-dd'T'HH:mm"),
      kg: item.kg.toString(),
      note: item.note || '',
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdate = async () => {
    if (!editingItem) return

    setLoading(true)
    try {
      const res = await fetch(`/api/weight/${editingItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kg: parseFloat(editForm.kg),
          note: editForm.note || null,
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
      const res = await fetch(`/api/weight/${deletingId}`, {
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
    <div className="min-h-screen bg-zinc-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center mb-6">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold ml-4">体重历史</h1>
        </div>

        <div className="space-y-4">
          {data?.weights?.map((item: any) => (
            <Card key={item.id} className="bg-white">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-lg font-semibold mb-2">
                      {formatDateTime(new Date(item.createdAt))}
                    </p>
                    <p className="text-sm text-zinc-600 mb-1">
                      体重：{item.kg} kg
                    </p>
                    {item.note && (
                      <p className="text-sm text-zinc-500">备注：{item.note}</p>
                    )}
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

          {data?.weights?.length === 0 && (
            <div className="text-center text-zinc-500 py-12">暂无记录</div>
          )}
        </div>
      </div>

      {/* 编辑对话框 */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>编辑体重记录</DialogTitle>
            <DialogDescription>修改体重信息</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-kg">体重 (kg)</Label>
              <Input
                id="edit-kg"
                type="number"
                step="0.1"
                value={editForm.kg}
                onChange={(e) => setEditForm({ ...editForm, kg: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-note">备注（可选）</Label>
              <Input
                id="edit-note"
                value={editForm.note}
                onChange={(e) => setEditForm({ ...editForm, note: e.target.value })}
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





