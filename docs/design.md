# 三问高效学习机 v2.1 — 人性化功能设计

## 1. 番茄专注钟 (StudyTimer)
- **新页面** `pages/StudyTimer.ets`，注册到 `main_pages.json`
- 25分钟专注倒计时 + 5分钟休息，自动循环
- 每次专注完成自动记录到 `globalData`（日期 + 分钟数）
- Index 首页增加导航入口和今日专注时长显示
- 使用 `setInterval` 实现秒级倒计时，支持暂停/继续

## 2. 课程笔记 (CourseNotes)
- 每个课程支持独立笔记（新增 `notes: Record<string, string>` 到 `globalData`）
- 在 `LearningSpace.ets` 每个课程卡片增加"笔记"按钮
- 笔记使用 `TextArea` + 自动保存（onChange 触发 saveData）
- 支持笔记标题和正文

## 3. 每日灵感 (Daily Inspiration)
- Index 首页顶部新增灵感卡片区域
- 内置10+条学习金句轮播（随机展示）
- 根据用户学习进度（有无课程、有无完成成就）展示不同文案
- 底部显示当前学习天数/阶段鼓励语

## 4. 间隔复习 (Spaced Review)
- 新增 `ReviewItem` 接口 + `reviewQueue` 到 `globalData`
- 错题自动进入复习队列，设定 `nextReviewDate`
- 复习间隔：1天 → 3天 → 7天 → 14天 → 30天
- 在 `ThreeQuestions.ets` 底部增加"待复习"入口，显示待复习题目数
- 复习页面：显示原题 + 用户答案 + 正确答案 + 下一轮复习时间

## 5. 学习日历 (Study Calendar)
- 在 `Profile.ets` 或 Index 增加热力图日历组件
- 展示最近7周（49天）的学习活动热力
- 颜色深浅表示当天专注/学习强度（基于 session 记录）
- 复用已有的 `weeklyActivity` + 新增的 `studySessions` 数据

## 数据模型变更
```typescript
// LearningData.ets 新增
studySessions: StudySession[] = [];         // 番茄钟记录
notes: Record<string, string> = {};          // 课程笔记
reviewQueue: ReviewItem[] = [];              // 复习队列
studyStats: { totalFocusMinutes: number, currentStreak: number, longestStreak: number };
```

## 页面路由
- Index → StudyTimer (新)
- Index → LearningSpace → 每个课程卡片有"笔记"按钮
- ThreeQuestions → 底部待复习入口
- Profile → 学习日历区域
