"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { Baby, Lock } from 'lucide-react'

export default function LoginPage() {
  const [birthTime, setBirthTime] = useState('')
  const [loading, setLoading] = useState(false)
  const [shake, setShake] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!birthTime) {
      toast({
        title: '请选择出生时间',
        variant: 'destructive',
      })
      return
    }
    
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ birthTime }),
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: '请求失败' }))
        
        // 触发震动动画
        setShake(true)
        setTimeout(() => setShake(false), 500)
        
        toast({
          title: '时间不对哦',
          description: errorData.error || '再想想宝宝是哪一刻出生的？',
          variant: 'destructive',
        })
        setLoading(false)
        return
      }

      const data = await res.json()

      if (data.success) {
        toast({
          title: '解锁成功',
          description: '欢迎回来',
        })
        // 延迟一下确保 cookie 设置成功
        setTimeout(() => {
          window.location.href = '/'
        }, 300)
      } else {
        setShake(true)
        setTimeout(() => setShake(false), 500)
        
        toast({
          title: '时间不对哦',
          description: data.error || '再想想宝宝是哪一刻出生的？',
          variant: 'destructive',
        })
        setLoading(false)
      }
    } catch (error) {
      console.error('Login error:', error)
      setShake(true)
      setTimeout(() => setShake(false), 500)
      
      toast({
        title: '登录失败',
        description: '网络错误，请重试',
        variant: 'destructive',
      })
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#FFF5F5]">
      <div className={`w-full max-w-sm transition-transform ${shake ? 'animate-shake' : ''}`}>
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Baby className="h-10 w-10 text-rose-500" />
          </div>
          <h1 className="text-3xl font-bold text-stone-700 mb-2">小核桃成长记录</h1>
          <p className="text-base text-stone-400">请输入小核桃的出生时间以解锁</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="birthTime" className="text-sm font-medium text-stone-700 block">
              出生时间
            </label>
            <Input
              id="birthTime"
              type="datetime-local"
              value={birthTime}
              onChange={(e) => setBirthTime(e.target.value)}
              className="h-14 text-lg rounded-2xl border-rose-100 bg-white/90 backdrop-blur-sm focus:border-rose-400 focus:ring-2 focus:ring-rose-200"
              required
              autoFocus
            />
            <p className="text-xs text-stone-400 text-center mt-2">
              格式：年-月-日 时:分
            </p>
          </div>

          <Button
            type="submit"
            className="w-full h-14 text-lg rounded-full bg-rose-400 text-white hover:bg-rose-500 shadow-md flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>验证中...</span>
              </>
            ) : (
              <>
                <Lock className="h-5 w-5" />
                <span>解锁</span>
              </>
            )}
          </Button>
        </form>
      </div>
      
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-8px); }
          20%, 40%, 60%, 80% { transform: translateX(8px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  )
}
