import { router } from '@kit.ArkUI';
import { Course } from '../model/CourseModel';
import { EvaluationReport, AnswerRecord, BloomLevel, QuestionBank, Question } from '../model/QuestionModel';
import { globalData } from '../model/LearningData';
import { Constants } from '../utils/Constants';
import { RadarChart } from '../components/RadarChart';
import { StorageUtil } from '../utils/StorageUtil';
import { aiService } from '../model/AIService';

@Entry
@Component
struct Profile {
  @State courseId: string = '';
  @State course: Course | null = null;
  @State report: EvaluationReport | null = null;
  @State selectedTab: number = 0;
  @State records: AnswerRecord[] = [];
  @State aiEvaluation: string = '';
  @State isLoadingAI: boolean = false;
  @State weeklyActivity: number[] = [];
  @State scoreTrendData: TrendItem[] = [];

  aboutToAppear(): void {
    const params = router.getParams() as Record<string, Object>;
    if (params) {
      this.courseId = params['courseId'] as string || '';
    }
    this.course = globalData.getCourse(this.courseId) || null;
    this.records = globalData.getAnswerRecords(this.courseId);
    if (this.course && this.records.length > 0) {
      this.report = globalData.generateReport(this.courseId);
    }
    this.weeklyActivity = globalData.getWeeklyActivity();
    this.scoreTrendData = this.getScoreTrend();
  }

  onPageShow(): void {
    this.records = globalData.getAnswerRecords(this.courseId);
    if (this.course && this.records.length > 0) {
      this.report = globalData.generateReport(this.courseId);
    }
    this.weeklyActivity = globalData.getWeeklyActivity();
    this.scoreTrendData = this.getScoreTrend();
  }

  getBloomLevels(): BloomLevel[] {
    return [BloomLevel.MEMORY, BloomLevel.UNDERSTAND, BloomLevel.APPLY,
            BloomLevel.ANALYZE, BloomLevel.EVALUATE, BloomLevel.CREATE];
  }

  getLevelScore(level: BloomLevel): number {
    return this.report?.getLevelScore(level) ?? 0;
  }

  getQuestions(): Question[] {
    if (this.report) {
      return QuestionBank.generateQuestions(this.courseId, this.report.courseTitle);
    }
    return [];
  }

  getQuestionById(questionId: string): Question | null {
    const questions = this.getQuestions();
    for (let i = 0; i < questions.length; i++) {
      if (questions[i].id === questionId) {
        return questions[i];
      }
    }
    return null;
  }

  getScoreTrend(): TrendItem[] {
    const dayMs = 24 * 60 * 60 * 1000;
    const now = Date.now();
    const trend: TrendItem[] = [];
    const dayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    for (let i = 6; i >= 0; i--) {
      const dayStart = new Date(now - i * dayMs);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(dayStart.getTime() + dayMs);
      const d = new Date(dayStart);
      const label = dayNames[d.getDay()];
      let correct = 0;
      let total = 0;
      this.records.forEach(r => {
        if (r.timestamp >= dayStart.getTime() && r.timestamp < dayEnd.getTime()) {
          total++;
          if (r.isCorrect) correct++;
        }
      });
      trend.push({ label: label, accuracy: total > 0 ? correct / total : 0 });
    }
    return trend;
  }

  async generateAISuggestions(): Promise<void> {
    if (!this.report || !this.course) return;
    this.isLoadingAI = true;
    this.aiEvaluation = '';
    const systemPrompt = '你是一位专业的学习分析师和教育顾问。请基于学习数据提供个性化分析。回答要简洁、有建设性，用中文。';
    const prompt = `以下是一名学生的课程学习评估报告数据，请提供个性化的学习评估和改进建议：

课程：${this.course.title}
总题目数：${this.report.totalQuestions}
正确数：${this.report.correctCount}
正确率：${Math.round(this.report.accuracy * 100)}%
薄弱环节：${this.report.weakPoints.join('；')}
优势领域：${this.report.strongPoints.join('；')}

请提供：
1. 整体评价（一句话概括）
2. 针对薄弱环节的学习方法建议（2-3条）
3. 下一步学习方向推荐

请用友好的语气回复，控制在200字以内。`;
    try {
      const resp = await aiService.ask(prompt, systemPrompt);
      if (resp.success) {
        this.aiEvaluation = resp.content;
      } else {
        this.aiEvaluation = 'AI评估暂时不可用：' + (resp.error || '未知错误') + '\n\n请先在设置中配置AI服务。';
      }
    } catch (e) {
      this.aiEvaluation = 'AI评估调用失败，请稍后重试。';
    }
    this.isLoadingAI = false;
  }

  getReportMarkdown(): string {
    if (!this.report || !this.course) return '';
    const lines: string[] = [];
    lines.push('# 学习评价报告');
    lines.push('');
    lines.push(`**课程**：${this.report.courseTitle}`);
    lines.push(`**完成时间**：${this.formatDate(this.report.completedAt)}`);
    lines.push(`**总题数**：${this.report.totalQuestions}`);
    lines.push(`**正确数**：${this.report.correctCount}`);
    lines.push(`**正确率**：${Math.round(this.report.accuracy * 100)}%`);
    lines.push('');
    lines.push('## 整体评价');
    lines.push(this.getOverallAssessment());
    lines.push('');
    lines.push('## 薄弱点');
    this.report.weakPoints.forEach(p => lines.push(`- ${p}`));
    lines.push('');
    lines.push('## 优势');
    this.report.strongPoints.forEach(p => lines.push(`- ${p}`));
    lines.push('');
    lines.push('## 学习建议');
    this.report.suggestions.forEach(s => lines.push(`- ${s}`));
    lines.push('');
    lines.push('## AI评估');
    lines.push(this.aiEvaluation || '（尚未生成AI评估）');
    return lines.join('\n');
  }

  getReportJSON(): string {
    if (!this.report) return '';
    const obj: Record<string, Object> = {};
    obj['courseTitle'] = this.report.courseTitle;
    obj['completedAt'] = this.formatDate(this.report.completedAt);
    obj['totalQuestions'] = this.report.totalQuestions;
    obj['correctCount'] = this.report.correctCount;
    obj['accuracy'] = Math.round(this.report.accuracy * 100) + '%';
    obj['weakPoints'] = this.report.weakPoints;
    obj['strongPoints'] = this.report.strongPoints;
    obj['suggestions'] = this.report.suggestions;
    obj['assessment'] = this.getOverallAssessment();
    obj['aiEvaluation'] = this.aiEvaluation || '';
    return JSON.stringify(obj, null, 2);
  }

  copyToClipboard(text: string): void {
    AlertDialog.show({
      title: '导出成功',
      message: text.length > 100 ? text.substring(0, 100) + '...\n\n报告数据已生成完毕。' : text,
      confirm: { value: '确定', action: () => {} }
    });
  }

  formatDate(ts: number): string {
    const d = new Date(ts);
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  build() {
    Column() {
      this.buildTopBar()
      if (this.report) {
        Scroll() {
          Column() {
            this.buildStatsDashboard()
            this.buildStudyCalendar()
            this.buildReportHeader()
            this.buildTabRow()
            if (this.selectedTab === 0) {
              this.buildOverview()
            } else if (this.selectedTab === 1) {
              this.buildRadarSection()
            } else {
              this.buildDialogueRecords()
            }
            this.buildExportSection()
          }
          .width('100%')
          .padding({ left: 20, right: 20, bottom: 30 })
        }
        .layoutWeight(1)
      } else {
        Column() {
          Stack() {
            Circle()
              .width(64)
              .height(64)
              .fill(0x0F000000)
            Text('📝')
              .fontSize(32)
          }
          .width(64)
          .height(64)
          .margin({ top: 60 })
          Text('暂无评价报告')
            .fontSize(18)
            .fontWeight(FontWeight.Bold)
            .fontColor(Constants.COLOR_TEXT)
            .margin({ top: 16 })
          Text('请先在「深度测评」中完成答题\n完成后生成详细评价报告')
            .fontSize(14)
            .fontColor(Constants.COLOR_TEXT_SECONDARY)
            .textAlign(TextAlign.Center)
            .lineHeight(22)
            .margin({ top: 12 })
          if (this.course) {
            Button('去测评')
              .width(160)
              .height(44)
              .backgroundColor(Constants.COLOR_PRIMARY)
              .borderRadius(22)
              .margin({ top: 24 })
              .onClick(() => {
                router.pushUrl({
                  url: 'pages/ThreeQuestions',
                  params: { courseId: this.courseId, courseTitle: this.course!.title, questionIndex: 2 }
                });
              })
          }
        }
        .width('100%')
        .justifyContent(FlexAlign.Start)
      }
    }
    .width('100%')
    .height('100%')
    .backgroundColor(Constants.COLOR_BACKGROUND)
  }

  @Builder buildTopBar() {
    Row() {
      Stack() {
        Circle()
          .width(36)
          .height(36)
          .fill(0x0F000000)
        Text('←')
          .fontSize(18)
          .fontColor(Constants.COLOR_TEXT)
      }
      .width(36)
      .height(36)
      .onClick(() => { router.back(); })
      Blank()
      Text('学习评价报告')
        .fontSize(18)
        .fontWeight(FontWeight.Bold)
        .fontColor(Constants.COLOR_TEXT)
      Blank()
      Circle()
        .width(36)
        .height(36)
        .fill(0x0F000000)
        .opacity(0)
    }
    .width('100%')
    .padding({ left: 16, right: 16, top: 12, bottom: 12 })
    .backgroundColor('#FFFFFF')
    .shadow({ radius: 2, offsetY: 1, color: 0x0A000000 })
  }

  @Builder buildStatsDashboard() {
    Column() {
      Text('学习数据总览')
        .fontSize(15)
        .fontWeight(FontWeight.Bold)
        .fontColor(Constants.COLOR_TEXT)
        .width('100%')
        .margin({ bottom: 12 })
      Row() {
        this.buildStatCard('总课程', `${globalData.getTotalCourses()}`, Constants.COLOR_PRIMARY)
        this.buildStatCard('已完成', `${globalData.getCompletedCourses()}`, Constants.COLOR_ACCENT_GREEN)
      }
      .width('100%')
      Row() {
        this.buildStatCard('🔥连学', `${globalData.getStreak()}天`, Constants.COLOR_ACCENT_ORANGE)
        this.buildStatCard('⏱今日专注', `${globalData.getTodayFocusMinutes()}分`, Constants.COLOR_ACCENT_GREEN)
      }
      .width('100%')
      .margin({ top: 8 })
      Row() {
        this.buildStatCard('平均正确率', `${Math.round(globalData.getOverallAccuracy() * 100)}%`, Constants.COLOR_ACCENT_PURPLE)
        this.buildStatCard('总专注', `${globalData.getTotalFocusMinutes()}分`, Constants.COLOR_PRIMARY)
      }
      .width('100%')
      .margin({ top: 8 })
    }
    .width('100%')
    .padding(14)
    .backgroundColor(Constants.COLOR_CARD)
    .borderRadius(12)
    .margin({ top: 16 })
  }

  getCalendarWeeks(): number[][] {
    return globalData.getWeeklyCalendar();
  }

  @Builder buildDayLabels() {
    ForEach(['一', '二', '三', '四', '五', '六', '日'], (d: string) => {
      Text(d)
        .fontSize(10)
        .fontColor(Constants.COLOR_TEXT_SECONDARY)
        .width(22)
        .height(22)
        .textAlign(TextAlign.Center)
        .margin({ bottom: 4 })
    }, (d: string) => d)
  }

  @Builder buildStudyCalendar() {
    Column() {
      Text('📅 学习日历')
        .fontSize(15)
        .fontWeight(FontWeight.Bold)
        .fontColor(Constants.COLOR_TEXT)
        .width('100%')
        .margin({ bottom: 10 })

      Scroll() {
        Row() {
          Column() {
            this.buildDayLabels()
          }
          .margin({ right: 6 })

          ForEach(this.getCalendarWeeks(), (week: number[], wIdx: number) => {
            Column() {
              ForEach(week, (level: number) => {
                Stack() {
                  Circle()
                    .width(22)
                    .height(22)
                    .fill(level === 0 ? 0x0F000000 :
                      level <= 2 ? 0x3310B981 :
                      level <= 4 ? 0x6610B981 :
                      level <= 6 ? 0xAA10B981 :
                      0xFF10B981)
                }
                .width(22)
                .height(22)
                .margin({ bottom: 4 })
              }, (level: number) => String(level))
            }
            .margin({ right: 4 })
          }, (week: number[], wIdx: number) => String(wIdx))
        }
      }
      .width('100%')
      .scrollable(ScrollDirection.Horizontal)

      Row() {
        Text('少').fontSize(9).fontColor(Constants.COLOR_TEXT_SECONDARY)
        Stack() { Circle().width(12).height(12).fill(0x0F000000) }
          .width(12).height(12).margin({ left: 4 })
        Stack() { Circle().width(12).height(12).fill(0x3310B981) }
          .width(12).height(12).margin({ left: 4 })
        Stack() { Circle().width(12).height(12).fill(0x6610B981) }
          .width(12).height(12).margin({ left: 4 })
        Stack() { Circle().width(12).height(12).fill(0xAA10B981) }
          .width(12).height(12).margin({ left: 4 })
        Stack() { Circle().width(12).height(12).fill(0xFF10B981) }
          .width(12).height(12).margin({ left: 4 })
        Text('多').fontSize(9).fontColor(Constants.COLOR_TEXT_SECONDARY).margin({ left: 4 })
      }
      .margin({ top: 8 })
      .alignSelf(ItemAlign.Center)

      Text('最近7周学习热力分布（颜色越深学习越多）')
        .fontSize(10)
        .fontColor(Constants.COLOR_TEXT_SECONDARY)
        .width('100%')
        .textAlign(TextAlign.Center)
        .margin({ top: 6 })
    }
    .width('100%')
    .padding(14)
    .backgroundColor(Constants.COLOR_CARD)
    .borderRadius(12)
    .margin({ top: 12 })
  }

  @Builder buildStatCard(label: string, value: string, color: ResourceColor) {
    Column() {
      Text(value)
        .fontSize(20)
        .fontWeight(FontWeight.Bold)
        .fontColor(color)
      Text(label)
        .fontSize(11)
        .fontColor(Constants.COLOR_TEXT_SECONDARY)
        .margin({ top: 4 })
    }
    .layoutWeight(1)
    .padding(12)
    .backgroundColor(0x0F000000)
    .borderRadius(10)
    .margin({ left: 4, right: 4 })
  }

  @Builder buildReportHeader() {
    if (this.report && this.course) {
      Column() {
        Stack() {
          Circle()
            .width(56)
            .height(56)
            .fill(this.getScoreColor(this.report.accuracy))
          Text(`${Math.round(this.report.accuracy * 100)}%`)
            .fontSize(18)
            .fontColor('#FFFFFF')
            .fontWeight(FontWeight.Bold)
        }
        .width(56)
        .height(56)
        Text(this.course.title)
          .fontSize(18)
          .fontWeight(FontWeight.Bold)
          .fontColor(Constants.COLOR_TEXT)
          .margin({ top: 10 })
        Text(`${this.report.correctCount}/${this.report.totalQuestions} 题正确`)
          .fontSize(13)
          .fontColor(Constants.COLOR_TEXT_SECONDARY)
          .margin({ top: 4 })
        Row() {
          this.buildStatItem('课程状态', this.course.status === 'completed' ? '已完成' : '学习中')
          this.buildStatItem('正确率', `${Math.round(this.report.accuracy * 100)}%`)
          this.buildStatItem('薄弱项', `${this.report.weakPoints.length}项`)
        }
        .width('100%')
        .margin({ top: 16 })
        .justifyContent(FlexAlign.SpaceAround)
      }
      .width('100%')
      .padding(20)
      .backgroundColor(Constants.COLOR_CARD)
      .borderRadius(16)
      .shadow({ radius: 4, offsetY: 2, color: 0x12000000 })
      .margin({ top: 16 })
    }
  }

  @Builder buildStatItem(label: string, value: string) {
    Column() {
      Text(value)
        .fontSize(16)
        .fontWeight(FontWeight.Bold)
        .fontColor(Constants.COLOR_TEXT)
      Text(label)
        .fontSize(11)
        .fontColor(Constants.COLOR_TEXT_SECONDARY)
        .margin({ top: 2 })
    }
  }

  @Builder buildTabRow() {
    Row() {
      this.buildSmallTab('总览', 0)
      this.buildSmallTab('能力维度', 1)
      this.buildSmallTab('对话记录', 2)
    }
    .width('100%')
    .padding(4)
    .backgroundColor(Constants.COLOR_CARD)
    .borderRadius(10)
    .margin({ top: 16 })
  }

  @Builder buildSmallTab(label: string, index: number) {
    Column() {
      Text(label)
        .fontSize(13)
        .fontWeight(this.selectedTab === index ? FontWeight.Bold : FontWeight.Normal)
        .fontColor(this.selectedTab === index ? '#FFFFFF' : Constants.COLOR_TEXT_SECONDARY)
    }
    .layoutWeight(1)
    .padding({ top: 6, bottom: 6 })
    .backgroundColor(this.selectedTab === index ? Constants.COLOR_PRIMARY : 'transparent')
    .borderRadius(8)
    .onClick(() => { this.selectedTab = index; })
  }

  @Builder buildOverview() {
    if (this.report) {
      Column() {
        Column() {
          Text('学习评价')
            .fontSize(15)
            .fontWeight(FontWeight.Bold)
            .fontColor(Constants.COLOR_TEXT)
            .width('100%')
            .margin({ bottom: 10 })
          Text(this.getOverallAssessment())
            .fontSize(13)
            .fontColor(Constants.COLOR_TEXT)
            .lineHeight(20)
        }
        .width('100%')
        .padding(14)
        .backgroundColor(Constants.COLOR_CARD)
        .borderRadius(12)
        .margin({ top: 16 })

        Column() {
          Text('近期正确率趋势')
            .fontSize(15)
            .fontWeight(FontWeight.Bold)
            .fontColor(Constants.COLOR_TEXT)
            .width('100%')
            .margin({ bottom: 10 })
          ForEach(this.scoreTrendData, (item: TrendItem) => {
            Row() {
              Text(item.label)
                .fontSize(12)
                .fontColor(Constants.COLOR_TEXT)
                .width(36)
              Progress({ value: item.accuracy * 100, total: 100, type: ProgressType.Linear })
                .height(8)
                .color(this.getScoreColor(item.accuracy))
                .backgroundColor(Constants.COLOR_DIVIDER)
                .borderRadius(4)
                .layoutWeight(1)
                .margin({ left: 4, right: 4 })
              Text(`${Math.round(item.accuracy * 100)}%`)
                .fontSize(12)
                .fontWeight(FontWeight.Bold)
                .fontColor(this.getScoreColor(item.accuracy))
                .width(40)
                .textAlign(TextAlign.End)
            }
            .width('100%')
            .margin({ bottom: 6 })
          }, (item: TrendItem, index: number) => item.label + index)
        }
        .width('100%')
        .padding(14)
        .backgroundColor(Constants.COLOR_CARD)
        .borderRadius(12)
        .margin({ top: 12 })

        Column() {
          Text('本周学习活动（分钟）')
            .fontSize(15)
            .fontWeight(FontWeight.Bold)
            .fontColor(Constants.COLOR_TEXT)
            .width('100%')
            .margin({ bottom: 10 })
          ForEach(this.weeklyActivity, (minutes: number, index: number) => {
            Row() {
              Text(globalData.getDayLabels()[index])
                .fontSize(12)
                .fontColor(Constants.COLOR_TEXT)
                .width(36)
              Progress({ value: minutes, total: 120, type: ProgressType.Linear })
                .height(8)
                .color(minutes >= 60 ? Constants.COLOR_ACCENT_GREEN : minutes >= 30 ? Constants.COLOR_ACCENT_ORANGE : Constants.COLOR_ACCENT_RED)
                .backgroundColor(Constants.COLOR_DIVIDER)
                .borderRadius(4)
                .layoutWeight(1)
                .margin({ left: 4, right: 4 })
              Text(`${minutes}分钟`)
                .fontSize(12)
                .fontColor(Constants.COLOR_TEXT)
                .width(52)
                .textAlign(TextAlign.End)
            }
            .width('100%')
            .margin({ bottom: 6 })
          }, (minutes: number, index: number) => index.toString())
        }
        .width('100%')
        .padding(14)
        .backgroundColor(Constants.COLOR_CARD)
        .borderRadius(12)
        .margin({ top: 12 })

        Column() {
          Text('薄弱点分析')
            .fontSize(15)
            .fontWeight(FontWeight.Bold)
            .fontColor(Constants.COLOR_TEXT)
            .width('100%')
            .margin({ bottom: 8 })
          ForEach(this.report.weakPoints, (point: string) => {
            Row() {
              Circle()
                .width(6)
                .height(6)
                .fill(Constants.COLOR_ACCENT_RED)
                .margin({ right: 8 })
              Text(point)
                .fontSize(12)
                .fontColor(Constants.COLOR_TEXT)
                .lineHeight(18)
            }
            .width('100%')
            .margin({ bottom: 6 })
          }, (point: string) => point)
        }
        .width('100%')
        .padding(14)
        .backgroundColor(Constants.COLOR_CARD)
        .borderRadius(12)
        .margin({ top: 12 })

        Column() {
          Text('优势分析')
            .fontSize(15)
            .fontWeight(FontWeight.Bold)
            .fontColor(Constants.COLOR_TEXT)
            .width('100%')
            .margin({ bottom: 8 })
          ForEach(this.report.strongPoints, (point: string) => {
            Row() {
              Circle()
                .width(6)
                .height(6)
                .fill(Constants.COLOR_ACCENT_GREEN)
                .margin({ right: 8 })
              Text(point)
                .fontSize(12)
                .fontColor(Constants.COLOR_TEXT)
                .lineHeight(18)
            }
            .width('100%')
            .margin({ bottom: 6 })
          }, (point: string) => point)
        }
        .width('100%')
        .padding(14)
        .backgroundColor(Constants.COLOR_CARD)
        .borderRadius(12)
        .margin({ top: 12 })

        Column() {
          Text('学习建议')
            .fontSize(15)
            .fontWeight(FontWeight.Bold)
            .fontColor(Constants.COLOR_TEXT)
            .width('100%')
            .margin({ bottom: 8 })
          ForEach(this.report.suggestions, (sug: string) => {
            Row() {
              Circle()
                .width(6)
                .height(6)
                .fill(Constants.COLOR_PRIMARY)
                .margin({ right: 8 })
              Text(sug)
                .fontSize(12)
                .fontColor(Constants.COLOR_TEXT)
                .lineHeight(18)
            }
            .width('100%')
            .margin({ bottom: 6 })
          }, (sug: string) => sug)
        }
        .width('100%')
        .padding(14)
        .backgroundColor(Constants.COLOR_CARD)
        .borderRadius(12)
        .margin({ top: 12 })

        Column() {
          Text('学习总结')
            .fontSize(15)
            .fontWeight(FontWeight.Bold)
            .fontColor(Constants.COLOR_TEXT)
            .width('100%')
            .margin({ bottom: 8 })
          Row() {
            Text('完成时间')
              .fontSize(12)
              .fontColor(Constants.COLOR_TEXT_SECONDARY)
            Text(this.formatDate(this.report.completedAt))
              .fontSize(12)
              .fontColor(Constants.COLOR_TEXT)
              .margin({ left: 8 })
          }
          .width('100%')
          .margin({ bottom: 6 })
          if (this.course && this.course.status === 'completed') {
            Row() {
              Circle()
                .width(6)
                .height(6)
                .fill(Constants.COLOR_ACCENT_GREEN)
                .margin({ right: 8 })
              Text('该课程已完成学习')
                .fontSize(12)
                .fontColor(Constants.COLOR_ACCENT_GREEN)
            }
            .width('100%')
            .margin({ bottom: 4 })
          }
          Text('总学习时长：' + globalData.getStudyTimeDisplay())
            .fontSize(12)
            .fontColor(Constants.COLOR_TEXT)
            .margin({ top: 4 })
        }
        .width('100%')
        .padding(14)
        .backgroundColor(Constants.COLOR_CARD)
        .borderRadius(12)
        .margin({ top: 12 })

        Column() {
          if (this.aiEvaluation.length > 0) {
            Text('AI智能评估')
              .fontSize(15)
              .fontWeight(FontWeight.Bold)
              .fontColor(Constants.COLOR_TEXT)
              .width('100%')
              .margin({ bottom: 8 })
            Text(this.aiEvaluation)
              .fontSize(12)
              .fontColor(Constants.COLOR_TEXT)
              .lineHeight(18)
          }
          Button() {
            if (this.isLoadingAI) {
              LoadingProgress()
                .width(20)
                .height(20)
                .color('#FFFFFF')
            } else {
              Text('🤖 AI智能评估')
                .fontSize(14)
                .fontColor('#FFFFFF')
            }
          }
          .width('100%')
          .height(44)
          .backgroundColor(this.isLoadingAI ? Constants.COLOR_TEXT_SECONDARY : Constants.COLOR_PRIMARY)
          .borderRadius(22)
          .margin({ top: this.aiEvaluation.length > 0 ? 12 : 0 })
          .enabled(!this.isLoadingAI)
          .onClick(() => { this.generateAISuggestions(); })
        }
        .width('100%')
        .padding(14)
        .backgroundColor(Constants.COLOR_CARD)
        .borderRadius(12)
        .margin({ top: 12 })
      }
      .width('100%')
    }
  }

  @Builder buildRadarSection() {
    if (this.report) {
      Column() {
        RadarChart({ levelScores: this.report.levelScores })
          .margin({ top: 16 })
        Column() {
          Text('各层级成绩明细')
            .fontSize(15)
            .fontWeight(FontWeight.Bold)
            .fontColor(Constants.COLOR_TEXT)
            .width('100%')
            .margin({ bottom: 10 })
          ForEach(this.getBloomLevels(), (level: BloomLevel) => {
            Row() {
              Text(level)
                .fontSize(12)
                .fontColor(Constants.COLOR_TEXT)
                .width(50)
              Progress({ value: this.getLevelScore(level) * 100, total: 100, type: ProgressType.Linear })
                .height(8)
                .color(this.getScoreColor(this.getLevelScore(level)))
                .backgroundColor(Constants.COLOR_DIVIDER)
                .borderRadius(4)
                .layoutWeight(1)
                .margin({ left: 8, right: 8 })
              Text(`${Math.round(this.getLevelScore(level) * 100)}%`)
                .fontSize(12)
                .fontWeight(FontWeight.Bold)
                .fontColor(this.getScoreColor(this.getLevelScore(level)))
                .width(40)
                .textAlign(TextAlign.End)
            }
            .width('100%')
            .margin({ bottom: 8 })
          }, (level: BloomLevel) => level)
        }
        .width('100%')
        .padding(14)
        .backgroundColor(Constants.COLOR_CARD)
        .borderRadius(12)
        .margin({ top: 12 })
      }
      .width('100%')
    }
  }

  @Builder buildDialogueRecords() {
    if (this.report) {
      Column() {
        Text('答题对话原始记录')
          .fontSize(15)
          .fontWeight(FontWeight.Bold)
          .fontColor(Constants.COLOR_TEXT)
          .width('100%')
          .margin({ top: 16, bottom: 8 })
        Text('以下为学习过程中的完整问答记录，用于评估学习效果')
          .fontSize(11)
          .fontColor(Constants.COLOR_TEXT_SECONDARY)
          .width('100%')
          .margin({ bottom: 12 })
        ForEach(this.records, (record: AnswerRecord) => {
          if (this.getQuestionById(record.questionId)) {
            Column() {
              Row() {
                Stack() {
                  Circle()
                    .width(28)
                    .height(28)
                    .fill(Constants.COLOR_PRIMARY)
                  Text('Q')
                    .fontSize(12)
                    .fontColor('#FFFFFF')
                    .fontWeight(FontWeight.Bold)
                }
                .width(28)
                .height(28)
                Text(this.getQuestionById(record.questionId)!.bloomLevel)
                  .fontSize(10)
                  .fontColor(Constants.COLOR_PRIMARY)
                  .backgroundColor(0x0F0078D7)
                  .padding({ left: 6, right: 6, top: 2, bottom: 2 })
                  .borderRadius(8)
                  .margin({ left: 8 })
                Blank()
                Text(record.isCorrect ? '正确' : '错误')
                  .fontSize(10)
                  .fontColor(record.isCorrect ? Constants.COLOR_ACCENT_GREEN : Constants.COLOR_ACCENT_RED)
                  .fontWeight(FontWeight.Bold)
              }
              .width('100%')
              Text(this.getQuestionById(record.questionId)!.questionText.length > 80 ?
                   this.getQuestionById(record.questionId)!.questionText.substring(0, 80) + '...' :
                   this.getQuestionById(record.questionId)!.questionText)
                .fontSize(12)
                .fontColor(Constants.COLOR_TEXT)
                .lineHeight(18)
                .margin({ top: 6 })
              Row() {
                Text(`你的回答：${record.selectedLabel}`)
                  .fontSize(12)
                  .fontColor(Constants.COLOR_TEXT)
                Stack() {
                  Circle()
                    .width(16)
                    .height(16)
                    .fill(record.isCorrect ? Constants.COLOR_ACCENT_GREEN : Constants.COLOR_ACCENT_RED)
                  Text(record.isCorrect ? '✓' : '✗')
                    .fontSize(9)
                    .fontColor('#FFFFFF')
                }
                .width(16)
                .height(16)
                .margin({ left: 6 })
              }
              .margin({ top: 6 })
              Row() {
                Text(`用时：${record.timeSpent}秒`)
                  .fontSize(10)
                  .fontColor(Constants.COLOR_TEXT_SECONDARY)
                Blank()
                Text(this.formatTime(record.timestamp))
                  .fontSize(10)
                  .fontColor(Constants.COLOR_TEXT_SECONDARY)
              }
              .width('100%')
              .margin({ top: 4 })
            }
            .width('100%')
            .padding(12)
            .backgroundColor(Constants.COLOR_CARD)
            .borderRadius(12)
            .shadow({ radius: 2, offsetY: 1, color: 0x06000000 })
            .margin({ bottom: 8 })
          }
        }, (record: AnswerRecord) => record.questionId + record.timestamp)
        if (this.records.length === 0) {
          Text('暂无答题记录')
            .fontSize(13)
            .fontColor(Constants.COLOR_TEXT_SECONDARY)
            .margin({ top: 20 })
        }
      }
      .width('100%')
    }
  }

  @Builder buildExportSection() {
    Column() {
      Button('📋 复制报告')
        .fontSize(14)
        .fontColor(Constants.COLOR_TEXT)
        .width('100%')
        .height(44)
        .backgroundColor(Constants.COLOR_CARD)
        .borderRadius(22)
        .margin({ top: 20 })
        .onClick(() => {
          const md = this.getReportMarkdown();
          this.copyToClipboard(md);
        })

      Button('📄 导出 JSON')
        .fontSize(14)
        .fontColor(Constants.COLOR_TEXT)
        .width('100%')
        .height(44)
        .backgroundColor(Constants.COLOR_CARD)
        .borderRadius(22)
        .margin({ top: 12 })
        .onClick(() => {
          const json = this.getReportJSON();
          AlertDialog.show({
            title: 'JSON导出预览',
            message: json.length > 300 ? json.substring(0, 300) + '\n...（内容已截断）' : json,
            confirm: { value: '复制并导出', action: () => {
              this.copyToClipboard(json);
              StorageUtil.saveData();
            } }
          });
        })

      Button('📝 导出 Markdown')
        .fontSize(14)
        .fontColor(Constants.COLOR_TEXT)
        .width('100%')
        .height(44)
        .backgroundColor(Constants.COLOR_CARD)
        .borderRadius(22)
        .margin({ top: 12 })
        .onClick(() => {
          const md = this.getReportMarkdown();
          AlertDialog.show({
            title: 'Markdown导出预览',
            message: md.length > 300 ? md.substring(0, 300) + '\n...（内容已截断）' : md,
            confirm: { value: '复制并导出', action: () => {
              this.copyToClipboard(md);
              StorageUtil.saveData();
            } }
          });
        })

      Button('📕 导出 PDF（即将推出）')
        .fontSize(14)
        .fontColor(Constants.COLOR_TEXT_SECONDARY)
        .width('100%')
        .height(44)
        .backgroundColor(Constants.COLOR_CARD)
        .borderRadius(22)
        .opacity(0.6)
        .margin({ top: 12 })
        .onClick(() => {
          AlertDialog.show({
            title: '导出 PDF',
            message: 'PDF导出功能即将推出，敬请期待！\n\n目前支持 JSON 和 Markdown 格式导出。',
            confirm: { value: '好的', action: () => {} }
          });
        })

      Button('返回首页')
        .fontSize(14)
        .fontColor('#FFFFFF')
        .width('100%')
        .height(44)
        .backgroundColor(Constants.COLOR_PRIMARY)
        .borderRadius(22)
        .margin({ top: 12 })
        .onClick(() => {
          router.clear();
          router.pushUrl({ url: 'pages/Index' });
        })
    }
    .width('100%')
    .margin({ top: 8 })
  }

  getScoreColor(score: number): ResourceColor {
    if (score >= 0.8) return Constants.COLOR_ACCENT_GREEN;
    if (score >= 0.5) return Constants.COLOR_ACCENT_ORANGE;
    return Constants.COLOR_ACCENT_RED;
  }

  getOverallAssessment(): string {
    if (!this.report) return '';
    const acc = this.report.accuracy;
    if (acc >= 0.9) return `优秀！你对「${this.report.courseTitle}」掌握非常扎实，建议尝试将该知识体系应用于实际项目或教授他人以进一步巩固。`;
    if (acc >= 0.7) return `良好！你对「${this.report.courseTitle}」有较好的理解，建议重点关注薄弱环节，通过间隔复习和项目实践深化掌握。`;
    if (acc >= 0.5) return `一般！你对「${this.report.courseTitle}」有基础了解，建议重新回顾第一问的心智模型和第二问的学术分歧，建立更完整的知识框架。`;
    return `需要加强！建议重新使用三问学习法从头学习「${this.report.courseTitle}」，重点关注核心概念的理解和知识体系的构建。`;
  }

  formatTime(ts: number): string {
    const d = new Date(ts);
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`;
  }
}

interface TrendItem {
  label: string;
  accuracy: number;
}
