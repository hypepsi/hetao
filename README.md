<div align="center">

```
██╗  ██╗███████╗████████╗ █████╗  ██████╗ ██╗      ██████╗  ██████╗ 
██║  ██║██╔════╝╚══██╔══╝██╔══██╗██╔═══██╗██║     ██╔═══██╗██╔════╝ 
███████║█████╗     ██║   ███████║██║   ██║██║     ██║   ██║██║  ███╗
██╔══██║██╔══╝     ██║   ██╔══██║██║   ██║██║     ██║   ██║██║   ██║
██║  ██║███████╗   ██║   ██║  ██║╚██████╔╝███████╗╚██████╔╝╚██████╔╝
╚═╝  ╚═╝╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝ ╚══════╝ ╚═════╝  ╚═════╝ 
```

# 🍼 小核桃 · HetaoLog

**新生儿智能喂养记录系统**  
*为新手父母设计的极简主义育儿数据追踪工具*

[![Next.js](https://img.shields.io/badge/Next.js-14.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)

[✨ 功能特性](#-核心功能) · [🚀 快速开始](#-快速开始) · [📊 统计系统](#-智能统计系统) · [🛠️ 技术栈](#️-技术栈)

---

</div>

## 💡 设计哲学

> **"在凌晨3点的哭声中，你需要的不是复杂的表单，而是一个3秒完成的记录按钮。"**

HetaoLog 基于以下核心理念打造：

- 🎯 **极速记录** - 3秒内完成一次喂养/排便记录
- 📱 **单手操作** - 所有操作触手可及，无需双手
- 🌙 **暗夜友好** - 温暖的配色系统，不刺激宝宝睡眠
- 📊 **数据洞察** - 自动分析喂养模式，提供智能建议
- 🔒 **隐私优先** - 本地部署，数据完全掌控

---

## ✨ 核心功能

### 🍼 智能喂养追踪
<table>
<tr>
<td width="50%">

#### 实时监控
- ⏱️ **距离上次喂养** - 精确到分钟的实时倒计时
- 📈 **今日统计** - 次数、累计奶量即时更新
- 🔔 **计时中提示** - 喂养进行时动态显示

#### 喂养记录
- 📅 **时间选择器** - 支持历史时间补录
- ⏰ **智能时长** - 自动计算喂养持续时间
- 🎚️ **±按钮调节** - 快速微调喂养时长

</td>
<td width="50%">

#### 智能建议（NEW）
- 🤖 **AI建议** - 基于体重和喂养数据推荐奶量
- 📊 **趋势分析** - 7天奶量趋势可视化
- ⚠️ **异常提醒** - 喂养间隔过长/过短预警

#### 每日统计（NEW）
- 📉 **奶量分布** - 平均/最大/最小奶量
- ⏲️ **间隔分析** - 平均/最长/最短间隔
- 🔥 **频繁喂养** - <2h间隔自动预警

</td>
</tr>
</table>

### 💩 排便健康追踪
- 🎨 **颜色记录** - 6种预设颜色（黄色、金黄色、绿色、墨绿色、褐色）
- 🧪 **性状分析** - 6种质地类型（糊状、水便分离、奶瓣便等）
- 📊 **今日次数** - 实时统计当日排便频率
- 📝 **备注系统** - 记录异常情况和观察

### ⚖️ 体重成长曲线
- 📏 **WHO标准对比** - 与女宝0-12月标准曲线对照
- 📈 **成长趋势** - 可视化体重增长轨迹
- 🎯 **精准插值** - 月龄精确到日的标准值计算
- 📊 **混合图表** - 柱状图（实测）+ 圆点图（标准）

### 🕐 双轨时间系统（独创）
<table>
<tr>
<th>A轨：自然日历</th>
<th>B轨：医院统计</th>
</tr>
<tr>
<td>

**换日点**: 00:00（北京时间）

**用途**:
- 👶 宝宝年龄计算
- 📅 出生天数显示
- 🎂 月龄统计

</td>
<td>

**换日点**: 06:00（北京时间）

**用途**:
- 🍼 喂养数据统计
- 💩 排便次数统计
- 📊 历史趋势分析

</td>
</tr>
</table>

> **为什么需要双轨？**  
> 凌晨3点的喂养在医学上属于"夜奶"，应归入前一天的统计周期。这符合医院的统计习惯，也更贴近实际育儿场景。

---

## 📊 智能统计系统

### 每日喂养分析
```
┌─────────────────────────────────────────┐
│ 📊 今日喂养统计               📋 历史  │
├─────────────────────────────────────────┤
│  ┌──────────┬──────────┐               │
│  │ 总次数    │ 平均奶量  │               │
│  │ 5次      │ 100ml    │               │
│  ├──────────┼──────────┤               │
│  │ 最大奶量  │ 最小奶量  │               │
│  │ 120ml    │ 80ml     │               │
│  └──────────┴──────────┘               │
├─────────────────────────────────────────┤
│  喂养间隔分析                            │
│  ┌────────┬────────┬────────┐         │
│  │ 平均    │ 最长    │ 最短    │         │
│  │ 2h 15m │ 3h 30m │ 1h 15m │         │
│  └────────┴────────┴────────┘         │
├─────────────────────────────────────────┤
│  ⚠️  频繁喂养 (<2h)                     │
│      2次 (40%)                         │
│      建议：间隔较短，注意观察宝宝状态    │
└─────────────────────────────────────────┘
```

### 关键指标
- **📈 趋势图表** - 7天奶量/体重可视化
- **🎯 智能预警** - 频繁喂养自动提醒（>30%高亮）
- **📊 历史对比** - 按日期查看每天的统计详情
- **⏱️ 实时更新** - 30秒自动刷新，数据永不过时

---

## 🛠️ 技术栈

<div align="center">

| 层级 | 技术选型 | 说明 |
|:---:|---------|------|
| 🎨 **前端框架** | Next.js 14 (App Router) | React 服务端组件 + 客户端交互 |
| 💎 **UI组件库** | shadcn/ui | 基于 Radix UI 的高质量组件 |
| 🎭 **样式系统** | Tailwind CSS | 原子化 CSS + Rose色系主题 |
| 📊 **图表库** | Recharts | 响应式图表，支持混合图表 |
| 🗄️ **数据库** | SQLite + Prisma | 轻量级本地数据库 + 类型安全ORM |
| 🔄 **状态管理** | SWR | 数据获取、缓存、自动重新验证 |
| ⏰ **时间处理** | date-fns + date-fns-tz | 时区安全的时间计算 |
| 🔐 **认证系统** | Cookie + Middleware | 简单安全的密码认证 |

</div>

### 核心依赖版本
```json
{
  "next": "14.0.4",
  "react": "18.2.0",
  "typescript": "5.0+",
  "prisma": "5.0+",
  "recharts": "2.0+",
  "date-fns": "3.0+",
  "date-fns-tz": "3.0+",
  "swr": "2.0+"
}
```

---

## 🚀 快速开始

### 环境要求
- Node.js 18+
- npm 或 yarn
- SQLite 3

### 安装步骤

```bash
# 1. 克隆仓库
git clone https://github.com/hypepsi/hetao.git
cd hetao

# 2. 安装依赖
npm install

# 3. 初始化数据库
npx prisma db push

# 4. 启动开发服务器
npm run dev

# 5. 访问应用
# 浏览器打开 http://localhost:3000
# 默认密码：hetao@sbl
```

### 生产部署（PM2）

```bash
# 1. 构建应用
npm run build

# 2. 使用 PM2 启动
pm2 start npm --name "hetalog" -- start

# 3. 设置开机自启
pm2 startup
pm2 save

# 4. 查看状态
pm2 status
pm2 logs hetalog
```

---

## 📸 功能展示

### 主界面 - 大卡片设计
```
┌─────────────────────────────────┐
│     👶 小核桃已出生 10 天          │
│        0个月 + 1周 + 3天          │
├─────────────────────────────────┤
│  🤖 智能建议                      │
│  今日已喂 520ml，建议再喂 180ml   │
├─────────────────────────────────┤
│  🍼 喂奶          📋 历史         │
│  距离上次喂奶                     │
│  2小时30分                       │
│  今日 5次 | 累计 520ml           │
├─────────────────────────────────┤
│  📊 今日喂养统计    📋 历史       │
│  [4项奶量 + 间隔分析 + 频繁预警]  │
├─────────────────────────────────┤
│  💩 大便          📋 历史         │
│  今日次数: 3次                   │
├─────────────────────────────────┤
│  ⚖️  体重          📋 历史        │
│  最新体重: 3.50 kg               │
├─────────────────────────────────┤
│  📈 近7天奶量趋势                 │
│  [柱状图：自动过滤空数据]         │
├─────────────────────────────────┤
│  📈 体重趋势                      │
│  [混合图：柱状+WHO标准圆点]       │
└─────────────────────────────────┘
```

### 喂养记录表单 - 极简交互
- ⚡ **3秒完成** - 选择时间 → 输入奶量 → 保存
- 🎚️ **智能时长** - ±按钮快速调节喂养持续时间
- 🔄 **自动计算** - 开始时间+时长自动得出结束时间

### 历史统计列表 - 数据洞察
- 📅 **按日展示** - 每天一个卡片，倒序排列
- 🏷️ **今日标签** - 当天数据高亮标识
- ⚠️ **异常预警** - 频繁喂养自动橙色高亮
- 📊 **完整指标** - 奶量、间隔、频率一目了然

---

## 🌟 特色功能

### 🔥 频繁喂养预警系统
自动分析喂养间隔，当**<2小时的喂养次数**占比超过30%时：
- 🟠 卡片背景变为橙色
- ⚠️ 显示警告图标
- 💬 提供关注建议

**示例**：
```
⚠️ 频繁喂养 (<2h): 3次 (60%)
频繁喂养次数较多，宝宝可能需要更多关注
```

### 🎯 智能喂养建议
基于**WHO标准 + 实际体重 + 历史数据**的AI推荐：
```
今日已喂 520ml (目标 700ml)
建议再喂 180ml
```

### 📊 双轨时间系统
**业界首创**的分离式时间统计逻辑：

| 场景 | 换日时间 | 应用范围 | 原因 |
|:---:|:-------:|---------|------|
| **A轨** | 00:00 | 年龄、天数、月龄 | 符合日常认知 |
| **B轨** | 06:00 | 喂养、排便、统计 | 符合医疗习惯 |

**示例**：凌晨2点的喂养
- ✅ 归入"昨天"的喂养统计（医院逻辑）
- ❌ 不会让宝宝"出生天数"提前+1

### 🎨 图表优化
- ✨ **消除黑框** - 点击图表无丑陋边框
- 📏 **紧凑布局** - 柱子间距优化（`barCategoryGap="20%"`）
- 🎯 **智能过滤** - 自动隐藏空数据，柱子从左对齐
- 🔵 **WHO圆点** - 标准曲线使用优雅的圆点显示

### 🌐 时区完美处理
- 🕐 **北京时间** - 所有输入/显示统一UTC+8
- 🔄 **自动转换** - 前端 `+08:00` 标记 → 后端UTC存储
- ✅ **零偏移** - 告别"输入23:35变成07:35"的噩梦

---

## 🗂️ 数据模型

```prisma
model Feeding {
  id        String   @id @default(cuid())
  startTime DateTime
  endTime   DateTime?
  amount    Int      // 奶量（ml）
  createdAt DateTime @default(now())
}

model Excretion {
  id        String   @id @default(cuid())
  type      String   // "大便" or "小便"
  color     String?  // 颜色
  texture   String?  // 性状
  note      String?  // 备注
  createdAt DateTime @default(now())
}

model Weight {
  id        String   @id @default(cuid())
  kg        Float    // 体重（kg）
  createdAt DateTime @default(now())
}
```

---

## 🎨 UI/UX 亮点

### 设计系统
```css
/* 配色方案：Rose系列 + Stone中性色 */
--primary: #f43f5e      /* Rose-500 主色 */
--secondary: #fb7185    /* Rose-400 次要色 */
--accent: #be123c       /* Rose-700 强调色 */
--neutral: #78716c      /* Stone-500 文本色 */
```

### 交互细节
- 🎭 **毛玻璃效果** - `backdrop-blur-sm` 半透明卡片
- 🌊 **流畅动画** - `transition-all` 全局过渡动画
- 👆 **点击反馈** - `active:scale-[0.98]` 按压缩放
- 🎯 **大热区** - 所有按钮 ≥44x44px 移动端标准
- 🌈 **悬停效果** - `hover:bg-rose-50` 圆角高亮

---

## 🚀 部署架构

### 推荐配置
```yaml
服务器: VPS / 云服务器
内存: 1GB+
存储: 10GB+
系统: Ubuntu 20.04+ / Debian 11+
Node.js: 18.0+
进程管理: PM2
反向代理: Nginx（可选）
```

### Nginx配置（可选）
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 📚 开发文档

### 项目结构
```
hetalog/
├── app/                    # Next.js App Router
│   ├── api/               # API路由
│   │   ├── feeding/       # 喂养相关API
│   │   ├── excretion/     # 排便相关API
│   │   └── weight/        # 体重相关API
│   ├── history/           # 历史记录页面
│   │   ├── feeding/       # 喂养历史
│   │   ├── feeding-stats/ # 统计历史（NEW）
│   │   ├── excretion/     # 排便历史
│   │   └── weight/        # 体重历史
│   └── home-client.tsx    # 主页面
├── components/            # React组件
│   ├── ui/               # shadcn/ui基础组件
│   ├── DailyFeedingStats.tsx    # 每日统计（NEW）
│   ├── FeedingCard.tsx          # 喂养卡片
│   ├── FeedingSheet.tsx         # 喂养表单
│   ├── MilkTrendChart.tsx       # 奶量趋势图
│   ├── WeightTrendChart.tsx     # 体重趋势图
│   └── SmartFeedingCard.tsx     # 智能建议
├── lib/                   # 工具函数
│   ├── date-utils.ts            # 双轨时间系统
│   ├── feeding-stats-utils.ts   # 统计计算（NEW）
│   ├── prisma.ts                # Prisma客户端
│   └── auth.ts                  # 认证逻辑
├── prisma/
│   └── schema.prisma      # 数据库Schema
└── public/                # 静态资源
```

### 核心工具函数

#### 时间系统
```typescript
// A轨：自然日历（00:00换日）
getBabyAge()           // 获取宝宝年龄（天、周）
getDetailedBabyAge()   // 获取详细年龄（月+周+天）

// B轨：医院统计（06:00换日）
getTodayStart()        // 获取今日统计起始时间
getStatsDate(date)     // 获取记录所属的统计日期（NEW）

// 通用工具
formatDateTime(date)   // 格式化为北京时间显示
formatDuration(start, end)  // 格式化时长
```

#### 统计计算
```typescript
calculateDailyStats(feedings)  // 计算每日统计
formatInterval(minutes)        // 格式化时间间隔
```

---

## 🔧 管理命令

### PM2 进程管理
```bash
# 查看状态
pm2 status

# 查看日志（实时）
pm2 logs hetalog

# 查看日志（最近100行）
pm2 logs hetalog --lines 100

# 重启应用
pm2 restart hetalog

# 停止应用
pm2 stop hetalog

# 删除进程
pm2 delete hetalog
```

### 数据库管理
```bash
# 打开Prisma Studio（图形化界面）
npx prisma studio

# 应用Schema更改
npx prisma db push

# 查看数据库状态
sqlite3 prisma/dev.db ".tables"

# 导出数据（备份）
sqlite3 prisma/dev.db ".dump" > backup.sql
```

### 日志分析
```bash
# 查看错误日志
pm2 logs hetalog --err

# 查看输出日志
pm2 logs hetalog --out

# 清除日志
pm2 flush
```

---

## 🎯 最佳实践

### 📱 移动端优化
- ✅ 响应式设计，完美适配移动设备
- ✅ PWA支持，可添加到主屏幕
- ✅ 触控友好，所有按钮≥44x44px
- ✅ 单手操作，核心功能触手可及

### ⚡ 性能优化
- ✅ 服务端组件减少客户端JS
- ✅ 图表动态导入（`dynamic import`）
- ✅ SWR缓存机制（60秒重新验证）
- ✅ Next.js缓存标签系统

### 🔒 数据安全
- ✅ 本地部署，数据完全可控
- ✅ Cookie认证，30天有效期
- ✅ Middleware保护所有API
- ✅ SQLite文件级加密（可选）

---

## 🐛 故障排查

### 应用无法启动
```bash
# 检查端口占用
lsof -i :3000

# 检查PM2状态
pm2 status

# 查看错误日志
pm2 logs hetalog --err --lines 50
```

### 数据库问题
```bash
# 重新生成Prisma Client
npx prisma generate

# 检查数据库文件
ls -lh prisma/dev.db

# 重置数据库（谨慎！）
npx prisma db push --force-reset
```

### 时间显示异常
- 检查服务器时区：`timedatectl`
- 确认系统时间：`date`
- 所有时间计算基于北京时间（UTC+8）

---

## 📈 未来计划

- [ ] 🌙 **夜间模式** - 深色主题切换
- [ ] 📧 **邮件报告** - 每周自动发送统计摘要
- [ ] 📱 **小程序** - 微信小程序版本
- [ ] 🤖 **AI助手** - GPT驱动的育儿问答
- [ ] 📊 **高级图表** - 更多可视化分析
- [ ] 👥 **多用户** - 支持多个宝宝记录
- [ ] ☁️ **云同步** - 可选的云端备份
- [ ] 🏥 **医疗对接** - 导出儿保报告格式

---

## 🤝 贡献指南

欢迎提交Issue和Pull Request！

### 开发流程
1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

### 代码规范
- ✅ TypeScript严格模式
- ✅ ESLint + Prettier
- ✅ 组件使用shadcn/ui
- ✅ 遵循现有的Rose配色系统

---

## 📄 开源协议

本项目采用 MIT 协议开源。

---

## 👨‍💻 作者

**hypepsi** - [GitHub](https://github.com/hypepsi)

---

## 🙏 致谢

- [Next.js](https://nextjs.org/) - 强大的React框架
- [shadcn/ui](https://ui.shadcn.com/) - 精美的UI组件库
- [Prisma](https://www.prisma.io/) - 现代化的ORM
- [Recharts](https://recharts.org/) - 优雅的图表库
- [date-fns](https://date-fns.org/) - 时间处理利器

---

<div align="center">

**⭐ 如果这个项目对你有帮助，请给个Star支持一下！⭐**

Made with ❤️ for 小核桃

</div>
