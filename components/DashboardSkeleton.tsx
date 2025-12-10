"use client"

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function DashboardSkeleton() {
  return (
    <div className="space-y-4">
      {/* 喂奶卡片骨架 */}
      <Card className="bg-white/90 backdrop-blur-sm shadow-md rounded-3xl border-rose-100">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-2xl" />
              <Skeleton className="h-6 w-16" />
            </div>
            <Skeleton className="h-4 w-12" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-10 w-48" />
            <div className="flex items-center gap-4 pt-2 border-t border-rose-100">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-24" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 大便卡片骨架 */}
      <Card className="bg-white/90 backdrop-blur-sm shadow-md rounded-3xl border-rose-100">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-2xl" />
              <Skeleton className="h-6 w-16" />
            </div>
            <Skeleton className="h-4 w-12" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-10 w-32" />
          </div>
        </CardContent>
      </Card>

      {/* 体重卡片骨架 */}
      <Card className="bg-white/90 backdrop-blur-sm shadow-md rounded-3xl border-rose-100">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-2xl" />
              <Skeleton className="h-6 w-16" />
            </div>
            <Skeleton className="h-4 w-12" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-4 w-16 mt-1" />
          </div>
        </CardContent>
      </Card>

      {/* 趋势图骨架 */}
      <Card className="bg-white/90 backdrop-blur-sm shadow-md rounded-3xl border-rose-100">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-2xl" />
            <Skeleton className="h-6 w-32" />
          </div>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full rounded-lg" />
        </CardContent>
      </Card>
    </div>
  )
}





