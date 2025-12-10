#!/bin/bash

# HetaoLog 部署脚本

set -e

echo "🚀 开始部署 HetaoLog..."

# 进入项目目录
cd /root/hetalog

# 安装依赖
echo "📦 安装依赖..."
npm install

# 初始化数据库
echo "🗄️  初始化数据库..."
npx prisma db push

# 构建项目
echo "🔨 构建项目..."
npm run build

# 重启 PM2 应用
echo "🔄 重启应用..."
pm2 restart hetalog || pm2 start ecosystem.config.js

# 确保开机自启（仅需首次，重复执行也安全）
pm2 startup systemd -u root --hp /root >/dev/null 2>&1 || true

# 保存 PM2 配置以便重启后恢复
pm2 save

echo "✅ 部署完成！"
echo "📱 应用运行在: http://localhost:3000"
echo "🔐 登录密码: hetao@sbl"
echo ""
echo "查看状态: pm2 status"
echo "查看日志: pm2 logs hetalog"






