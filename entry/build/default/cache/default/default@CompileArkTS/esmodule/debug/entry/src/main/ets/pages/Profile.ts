if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface Profile_Params {
    courseId?: string;
    course?: Course | null;
    report?: EvaluationReport | null;
    selectedTab?: number;
    records?: AnswerRecord[];
    aiEvaluation?: string;
    isLoadingAI?: boolean;
    weeklyActivity?: number[];
    scoreTrendData?: TrendItem[];
}
import router from "@ohos:router";
import type { Course } from '../model/CourseModel';
import { BloomLevel, QuestionBank } from "@normalized:N&&&entry/src/main/ets/model/QuestionModel&";
import type { EvaluationReport, AnswerRecord, Question } from "@normalized:N&&&entry/src/main/ets/model/QuestionModel&";
import { globalData } from "@normalized:N&&&entry/src/main/ets/model/LearningData&";
import { Constants } from "@normalized:N&&&entry/src/main/ets/utils/Constants&";
import { RadarChart } from "@normalized:N&&&entry/src/main/ets/components/RadarChart&";
import { StorageUtil } from "@normalized:N&&&entry/src/main/ets/utils/StorageUtil&";
import { aiService } from "@normalized:N&&&entry/src/main/ets/model/AIService&";
class Profile extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__courseId = new ObservedPropertySimplePU('', this, "courseId");
        this.__course = new ObservedPropertyObjectPU(null, this, "course");
        this.__report = new ObservedPropertyObjectPU(null, this, "report");
        this.__selectedTab = new ObservedPropertySimplePU(0, this, "selectedTab");
        this.__records = new ObservedPropertyObjectPU([], this, "records");
        this.__aiEvaluation = new ObservedPropertySimplePU('', this, "aiEvaluation");
        this.__isLoadingAI = new ObservedPropertySimplePU(false, this, "isLoadingAI");
        this.__weeklyActivity = new ObservedPropertyObjectPU([], this, "weeklyActivity");
        this.__scoreTrendData = new ObservedPropertyObjectPU([], this, "scoreTrendData");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: Profile_Params) {
        if (params.courseId !== undefined) {
            this.courseId = params.courseId;
        }
        if (params.course !== undefined) {
            this.course = params.course;
        }
        if (params.report !== undefined) {
            this.report = params.report;
        }
        if (params.selectedTab !== undefined) {
            this.selectedTab = params.selectedTab;
        }
        if (params.records !== undefined) {
            this.records = params.records;
        }
        if (params.aiEvaluation !== undefined) {
            this.aiEvaluation = params.aiEvaluation;
        }
        if (params.isLoadingAI !== undefined) {
            this.isLoadingAI = params.isLoadingAI;
        }
        if (params.weeklyActivity !== undefined) {
            this.weeklyActivity = params.weeklyActivity;
        }
        if (params.scoreTrendData !== undefined) {
            this.scoreTrendData = params.scoreTrendData;
        }
    }
    updateStateVars(params: Profile_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__courseId.purgeDependencyOnElmtId(rmElmtId);
        this.__course.purgeDependencyOnElmtId(rmElmtId);
        this.__report.purgeDependencyOnElmtId(rmElmtId);
        this.__selectedTab.purgeDependencyOnElmtId(rmElmtId);
        this.__records.purgeDependencyOnElmtId(rmElmtId);
        this.__aiEvaluation.purgeDependencyOnElmtId(rmElmtId);
        this.__isLoadingAI.purgeDependencyOnElmtId(rmElmtId);
        this.__weeklyActivity.purgeDependencyOnElmtId(rmElmtId);
        this.__scoreTrendData.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__courseId.aboutToBeDeleted();
        this.__course.aboutToBeDeleted();
        this.__report.aboutToBeDeleted();
        this.__selectedTab.aboutToBeDeleted();
        this.__records.aboutToBeDeleted();
        this.__aiEvaluation.aboutToBeDeleted();
        this.__isLoadingAI.aboutToBeDeleted();
        this.__weeklyActivity.aboutToBeDeleted();
        this.__scoreTrendData.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __courseId: ObservedPropertySimplePU<string>;
    get courseId() {
        return this.__courseId.get();
    }
    set courseId(newValue: string) {
        this.__courseId.set(newValue);
    }
    private __course: ObservedPropertyObjectPU<Course | null>;
    get course() {
        return this.__course.get();
    }
    set course(newValue: Course | null) {
        this.__course.set(newValue);
    }
    private __report: ObservedPropertyObjectPU<EvaluationReport | null>;
    get report() {
        return this.__report.get();
    }
    set report(newValue: EvaluationReport | null) {
        this.__report.set(newValue);
    }
    private __selectedTab: ObservedPropertySimplePU<number>;
    get selectedTab() {
        return this.__selectedTab.get();
    }
    set selectedTab(newValue: number) {
        this.__selectedTab.set(newValue);
    }
    private __records: ObservedPropertyObjectPU<AnswerRecord[]>;
    get records() {
        return this.__records.get();
    }
    set records(newValue: AnswerRecord[]) {
        this.__records.set(newValue);
    }
    private __aiEvaluation: ObservedPropertySimplePU<string>;
    get aiEvaluation() {
        return this.__aiEvaluation.get();
    }
    set aiEvaluation(newValue: string) {
        this.__aiEvaluation.set(newValue);
    }
    private __isLoadingAI: ObservedPropertySimplePU<boolean>;
    get isLoadingAI() {
        return this.__isLoadingAI.get();
    }
    set isLoadingAI(newValue: boolean) {
        this.__isLoadingAI.set(newValue);
    }
    private __weeklyActivity: ObservedPropertyObjectPU<number[]>;
    get weeklyActivity() {
        return this.__weeklyActivity.get();
    }
    set weeklyActivity(newValue: number[]) {
        this.__weeklyActivity.set(newValue);
    }
    private __scoreTrendData: ObservedPropertyObjectPU<TrendItem[]>;
    get scoreTrendData() {
        return this.__scoreTrendData.get();
    }
    set scoreTrendData(newValue: TrendItem[]) {
        this.__scoreTrendData.set(newValue);
    }
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
                    if (r.isCorrect)
                        correct++;
                }
            });
            trend.push({ label: label, accuracy: total > 0 ? correct / total : 0 });
        }
        return trend;
    }
    async generateAISuggestions(): Promise<void> {
        if (!this.report || !this.course)
            return;
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
            }
            else {
                this.aiEvaluation = 'AI评估暂时不可用：' + (resp.error || '未知错误') + '\n\n请先在设置中配置AI服务。';
            }
        }
        catch (e) {
            this.aiEvaluation = 'AI评估调用失败，请稍后重试。';
        }
        this.isLoadingAI = false;
    }
    getReportMarkdown(): string {
        if (!this.report || !this.course)
            return '';
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
        if (!this.report)
            return '';
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
            confirm: { value: '确定', action: () => { } }
        });
    }
    formatDate(ts: number): string {
        const d = new Date(ts);
        const year = d.getFullYear();
        const month = (d.getMonth() + 1).toString().padStart(2, '0');
        const day = d.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor(Constants.COLOR_BACKGROUND);
        }, Column);
        this.buildTopBar.bind(this)();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.report) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Scroll.create();
                        Scroll.layoutWeight(1);
                    }, Scroll);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                        Column.padding({ left: 20, right: 20, bottom: 30 });
                    }, Column);
                    this.buildStatsDashboard.bind(this)();
                    this.buildStudyCalendar.bind(this)();
                    this.buildReportHeader.bind(this)();
                    this.buildTabRow.bind(this)();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        if (this.selectedTab === 0) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.buildOverview.bind(this)();
                            });
                        }
                        else if (this.selectedTab === 1) {
                            this.ifElseBranchUpdateFunction(1, () => {
                                this.buildRadarSection.bind(this)();
                            });
                        }
                        else {
                            this.ifElseBranchUpdateFunction(2, () => {
                                this.buildDialogueRecords.bind(this)();
                            });
                        }
                    }, If);
                    If.pop();
                    this.buildExportSection.bind(this)();
                    Column.pop();
                    Scroll.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                        Column.justifyContent(FlexAlign.Start);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Stack.create();
                        Stack.width(64);
                        Stack.height(64);
                        Stack.margin({ top: 60 });
                    }, Stack);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Circle.create();
                        Circle.width(64);
                        Circle.height(64);
                        Circle.fill(0x0F000000);
                    }, Circle);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('📝');
                        Text.fontSize(32);
                    }, Text);
                    Text.pop();
                    Stack.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('暂无评价报告');
                        Text.fontSize(18);
                        Text.fontWeight(FontWeight.Bold);
                        Text.fontColor(Constants.COLOR_TEXT);
                        Text.margin({ top: 16 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('请先在「深度测评」中完成答题\n完成后生成详细评价报告');
                        Text.fontSize(14);
                        Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
                        Text.textAlign(TextAlign.Center);
                        Text.lineHeight(22);
                        Text.margin({ top: 12 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        if (this.course) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Button.createWithLabel('去测评');
                                    Button.width(160);
                                    Button.height(44);
                                    Button.backgroundColor(Constants.COLOR_PRIMARY);
                                    Button.borderRadius(22);
                                    Button.margin({ top: 24 });
                                    Button.onClick(() => {
                                        router.pushUrl({
                                            url: 'pages/ThreeQuestions',
                                            params: { courseId: this.courseId, courseTitle: this.course!.title, questionIndex: 2 }
                                        });
                                    });
                                }, Button);
                                Button.pop();
                            });
                        }
                        else {
                            this.ifElseBranchUpdateFunction(1, () => {
                            });
                        }
                    }, If);
                    If.pop();
                    Column.pop();
                });
            }
        }, If);
        If.pop();
        Column.pop();
    }
    buildTopBar(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.padding({ left: 16, right: 16, top: 12, bottom: 12 });
            Row.backgroundColor('#FFFFFF');
            Row.shadow({ radius: 2, offsetY: 1, color: 0x0A000000 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create();
            Stack.width(36);
            Stack.height(36);
            Stack.onClick(() => { router.back(); });
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Circle.create();
            Circle.width(36);
            Circle.height(36);
            Circle.fill(0x0F000000);
        }, Circle);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('←');
            Text.fontSize(18);
            Text.fontColor(Constants.COLOR_TEXT);
        }, Text);
        Text.pop();
        Stack.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('学习评价报告');
            Text.fontSize(18);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(Constants.COLOR_TEXT);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Circle.create();
            Circle.width(36);
            Circle.height(36);
            Circle.fill(0x0F000000);
            Circle.opacity(0);
        }, Circle);
        Row.pop();
    }
    buildStatsDashboard(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.padding(14);
            Column.backgroundColor(Constants.COLOR_CARD);
            Column.borderRadius(12);
            Column.margin({ top: 16 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('学习数据总览');
            Text.fontSize(15);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(Constants.COLOR_TEXT);
            Text.width('100%');
            Text.margin({ bottom: 12 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
        }, Row);
        this.buildStatCard.bind(this)('总课程', `${globalData.getTotalCourses()}`, Constants.COLOR_PRIMARY);
        this.buildStatCard.bind(this)('已完成', `${globalData.getCompletedCourses()}`, Constants.COLOR_ACCENT_GREEN);
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.margin({ top: 8 });
        }, Row);
        this.buildStatCard.bind(this)('🔥连学', `${globalData.getStreak()}天`, Constants.COLOR_ACCENT_ORANGE);
        this.buildStatCard.bind(this)('⏱今日专注', `${globalData.getTodayFocusMinutes()}分`, Constants.COLOR_ACCENT_GREEN);
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.margin({ top: 8 });
        }, Row);
        this.buildStatCard.bind(this)('平均正确率', `${Math.round(globalData.getOverallAccuracy() * 100)}%`, Constants.COLOR_ACCENT_PURPLE);
        this.buildStatCard.bind(this)('总专注', `${globalData.getTotalFocusMinutes()}分`, Constants.COLOR_PRIMARY);
        Row.pop();
        Column.pop();
    }
    getCalendarWeeks(): number[][] {
        return globalData.getWeeklyCalendar();
    }
    buildDayLabels(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = _item => {
                const d = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(d);
                    Text.fontSize(10);
                    Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
                    Text.width(22);
                    Text.height(22);
                    Text.textAlign(TextAlign.Center);
                    Text.margin({ bottom: 4 });
                }, Text);
                Text.pop();
            };
            this.forEachUpdateFunction(elmtId, ['一', '二', '三', '四', '五', '六', '日'], forEachItemGenFunction, (d: string) => d, false, false);
        }, ForEach);
        ForEach.pop();
    }
    buildStudyCalendar(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.padding(14);
            Column.backgroundColor(Constants.COLOR_CARD);
            Column.borderRadius(12);
            Column.margin({ top: 12 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('📅 学习日历');
            Text.fontSize(15);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(Constants.COLOR_TEXT);
            Text.width('100%');
            Text.margin({ bottom: 10 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Scroll.create();
            Scroll.width('100%');
            Scroll.scrollable(ScrollDirection.Horizontal);
        }, Scroll);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.margin({ right: 6 });
        }, Column);
        this.buildDayLabels.bind(this)();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = (_item, wIdx: number) => {
                const week = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Column.create();
                    Column.margin({ right: 4 });
                }, Column);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    ForEach.create();
                    const forEachItemGenFunction = _item => {
                        const level = _item;
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            Stack.create();
                            Stack.width(22);
                            Stack.height(22);
                            Stack.margin({ bottom: 4 });
                        }, Stack);
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            Circle.create();
                            Circle.width(22);
                            Circle.height(22);
                            Circle.fill(level === 0 ? 0x0F000000 :
                                level <= 2 ? 0x3310B981 :
                                    level <= 4 ? 0x6610B981 :
                                        level <= 6 ? 0xAA10B981 :
                                            0xFF10B981);
                        }, Circle);
                        Stack.pop();
                    };
                    this.forEachUpdateFunction(elmtId, week, forEachItemGenFunction, (level: number) => String(level), false, false);
                }, ForEach);
                ForEach.pop();
                Column.pop();
            };
            this.forEachUpdateFunction(elmtId, this.getCalendarWeeks(), forEachItemGenFunction, (week: number[], wIdx: number) => String(wIdx), true, true);
        }, ForEach);
        ForEach.pop();
        Row.pop();
        Scroll.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.margin({ top: 8 });
            Row.alignSelf(ItemAlign.Center);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('少');
            Text.fontSize(9);
            Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create();
            Stack.width(12);
            Stack.height(12);
            Stack.margin({ left: 4 });
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Circle.create();
            Circle.width(12);
            Circle.height(12);
            Circle.fill(0x0F000000);
        }, Circle);
        Stack.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create();
            Stack.width(12);
            Stack.height(12);
            Stack.margin({ left: 4 });
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Circle.create();
            Circle.width(12);
            Circle.height(12);
            Circle.fill(0x3310B981);
        }, Circle);
        Stack.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create();
            Stack.width(12);
            Stack.height(12);
            Stack.margin({ left: 4 });
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Circle.create();
            Circle.width(12);
            Circle.height(12);
            Circle.fill(0x6610B981);
        }, Circle);
        Stack.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create();
            Stack.width(12);
            Stack.height(12);
            Stack.margin({ left: 4 });
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Circle.create();
            Circle.width(12);
            Circle.height(12);
            Circle.fill(0xAA10B981);
        }, Circle);
        Stack.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create();
            Stack.width(12);
            Stack.height(12);
            Stack.margin({ left: 4 });
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Circle.create();
            Circle.width(12);
            Circle.height(12);
            Circle.fill(0xFF10B981);
        }, Circle);
        Stack.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('多');
            Text.fontSize(9);
            Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
            Text.margin({ left: 4 });
        }, Text);
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('最近7周学习热力分布（颜色越深学习越多）');
            Text.fontSize(10);
            Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
            Text.width('100%');
            Text.textAlign(TextAlign.Center);
            Text.margin({ top: 6 });
        }, Text);
        Text.pop();
        Column.pop();
    }
    buildStatCard(label: string, value: string, color: ResourceColor, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.layoutWeight(1);
            Column.padding(12);
            Column.backgroundColor(0x0F000000);
            Column.borderRadius(10);
            Column.margin({ left: 4, right: 4 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(value);
            Text.fontSize(20);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(color);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(label);
            Text.fontSize(11);
            Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
            Text.margin({ top: 4 });
        }, Text);
        Text.pop();
        Column.pop();
    }
    buildReportHeader(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.report && this.course) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                        Column.padding(20);
                        Column.backgroundColor(Constants.COLOR_CARD);
                        Column.borderRadius(16);
                        Column.shadow({ radius: 4, offsetY: 2, color: 0x12000000 });
                        Column.margin({ top: 16 });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Stack.create();
                        Stack.width(56);
                        Stack.height(56);
                    }, Stack);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Circle.create();
                        Circle.width(56);
                        Circle.height(56);
                        Circle.fill(this.getScoreColor(this.report.accuracy));
                    }, Circle);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(`${Math.round(this.report.accuracy * 100)}%`);
                        Text.fontSize(18);
                        Text.fontColor('#FFFFFF');
                        Text.fontWeight(FontWeight.Bold);
                    }, Text);
                    Text.pop();
                    Stack.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.course.title);
                        Text.fontSize(18);
                        Text.fontWeight(FontWeight.Bold);
                        Text.fontColor(Constants.COLOR_TEXT);
                        Text.margin({ top: 10 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(`${this.report.correctCount}/${this.report.totalQuestions} 题正确`);
                        Text.fontSize(13);
                        Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
                        Text.margin({ top: 4 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.width('100%');
                        Row.margin({ top: 16 });
                        Row.justifyContent(FlexAlign.SpaceAround);
                    }, Row);
                    this.buildStatItem.bind(this)('课程状态', this.course.status === 'completed' ? '已完成' : '学习中');
                    this.buildStatItem.bind(this)('正确率', `${Math.round(this.report.accuracy * 100)}%`);
                    this.buildStatItem.bind(this)('薄弱项', `${this.report.weakPoints.length}项`);
                    Row.pop();
                    Column.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
    }
    buildStatItem(label: string, value: string, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(value);
            Text.fontSize(16);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(Constants.COLOR_TEXT);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(label);
            Text.fontSize(11);
            Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
            Text.margin({ top: 2 });
        }, Text);
        Text.pop();
        Column.pop();
    }
    buildTabRow(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.padding(4);
            Row.backgroundColor(Constants.COLOR_CARD);
            Row.borderRadius(10);
            Row.margin({ top: 16 });
        }, Row);
        this.buildSmallTab.bind(this)('总览', 0);
        this.buildSmallTab.bind(this)('能力维度', 1);
        this.buildSmallTab.bind(this)('对话记录', 2);
        Row.pop();
    }
    buildSmallTab(label: string, index: number, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.layoutWeight(1);
            Column.padding({ top: 6, bottom: 6 });
            Column.backgroundColor(this.selectedTab === index ? Constants.COLOR_PRIMARY : 'transparent');
            Column.borderRadius(8);
            Column.onClick(() => { this.selectedTab = index; });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(label);
            Text.fontSize(13);
            Text.fontWeight(this.selectedTab === index ? FontWeight.Bold : FontWeight.Normal);
            Text.fontColor(this.selectedTab === index ? '#FFFFFF' : Constants.COLOR_TEXT_SECONDARY);
        }, Text);
        Text.pop();
        Column.pop();
    }
    buildOverview(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.report) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                        Column.padding(14);
                        Column.backgroundColor(Constants.COLOR_CARD);
                        Column.borderRadius(12);
                        Column.margin({ top: 16 });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('学习评价');
                        Text.fontSize(15);
                        Text.fontWeight(FontWeight.Bold);
                        Text.fontColor(Constants.COLOR_TEXT);
                        Text.width('100%');
                        Text.margin({ bottom: 10 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.getOverallAssessment());
                        Text.fontSize(13);
                        Text.fontColor(Constants.COLOR_TEXT);
                        Text.lineHeight(20);
                    }, Text);
                    Text.pop();
                    Column.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                        Column.padding(14);
                        Column.backgroundColor(Constants.COLOR_CARD);
                        Column.borderRadius(12);
                        Column.margin({ top: 12 });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('近期正确率趋势');
                        Text.fontSize(15);
                        Text.fontWeight(FontWeight.Bold);
                        Text.fontColor(Constants.COLOR_TEXT);
                        Text.width('100%');
                        Text.margin({ bottom: 10 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        ForEach.create();
                        const forEachItemGenFunction = _item => {
                            const item = _item;
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Row.create();
                                Row.width('100%');
                                Row.margin({ bottom: 6 });
                            }, Row);
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create(item.label);
                                Text.fontSize(12);
                                Text.fontColor(Constants.COLOR_TEXT);
                                Text.width(36);
                            }, Text);
                            Text.pop();
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Progress.create({ value: item.accuracy * 100, total: 100, type: ProgressType.Linear });
                                Progress.height(8);
                                Progress.color(this.getScoreColor(item.accuracy));
                                Progress.backgroundColor(Constants.COLOR_DIVIDER);
                                Progress.borderRadius(4);
                                Progress.layoutWeight(1);
                                Progress.margin({ left: 4, right: 4 });
                            }, Progress);
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create(`${Math.round(item.accuracy * 100)}%`);
                                Text.fontSize(12);
                                Text.fontWeight(FontWeight.Bold);
                                Text.fontColor(this.getScoreColor(item.accuracy));
                                Text.width(40);
                                Text.textAlign(TextAlign.End);
                            }, Text);
                            Text.pop();
                            Row.pop();
                        };
                        this.forEachUpdateFunction(elmtId, this.scoreTrendData, forEachItemGenFunction, (item: TrendItem, index: number) => item.label + index, false, true);
                    }, ForEach);
                    ForEach.pop();
                    Column.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                        Column.padding(14);
                        Column.backgroundColor(Constants.COLOR_CARD);
                        Column.borderRadius(12);
                        Column.margin({ top: 12 });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('本周学习活动（分钟）');
                        Text.fontSize(15);
                        Text.fontWeight(FontWeight.Bold);
                        Text.fontColor(Constants.COLOR_TEXT);
                        Text.width('100%');
                        Text.margin({ bottom: 10 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        ForEach.create();
                        const forEachItemGenFunction = (_item, index: number) => {
                            const minutes = _item;
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Row.create();
                                Row.width('100%');
                                Row.margin({ bottom: 6 });
                            }, Row);
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create(globalData.getDayLabels()[index]);
                                Text.fontSize(12);
                                Text.fontColor(Constants.COLOR_TEXT);
                                Text.width(36);
                            }, Text);
                            Text.pop();
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Progress.create({ value: minutes, total: 120, type: ProgressType.Linear });
                                Progress.height(8);
                                Progress.color(minutes >= 60 ? Constants.COLOR_ACCENT_GREEN : minutes >= 30 ? Constants.COLOR_ACCENT_ORANGE : Constants.COLOR_ACCENT_RED);
                                Progress.backgroundColor(Constants.COLOR_DIVIDER);
                                Progress.borderRadius(4);
                                Progress.layoutWeight(1);
                                Progress.margin({ left: 4, right: 4 });
                            }, Progress);
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create(`${minutes}分钟`);
                                Text.fontSize(12);
                                Text.fontColor(Constants.COLOR_TEXT);
                                Text.width(52);
                                Text.textAlign(TextAlign.End);
                            }, Text);
                            Text.pop();
                            Row.pop();
                        };
                        this.forEachUpdateFunction(elmtId, this.weeklyActivity, forEachItemGenFunction, (minutes: number, index: number) => index.toString(), true, true);
                    }, ForEach);
                    ForEach.pop();
                    Column.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                        Column.padding(14);
                        Column.backgroundColor(Constants.COLOR_CARD);
                        Column.borderRadius(12);
                        Column.margin({ top: 12 });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('薄弱点分析');
                        Text.fontSize(15);
                        Text.fontWeight(FontWeight.Bold);
                        Text.fontColor(Constants.COLOR_TEXT);
                        Text.width('100%');
                        Text.margin({ bottom: 8 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        ForEach.create();
                        const forEachItemGenFunction = _item => {
                            const point = _item;
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Row.create();
                                Row.width('100%');
                                Row.margin({ bottom: 6 });
                            }, Row);
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Circle.create();
                                Circle.width(6);
                                Circle.height(6);
                                Circle.fill(Constants.COLOR_ACCENT_RED);
                                Circle.margin({ right: 8 });
                            }, Circle);
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create(point);
                                Text.fontSize(12);
                                Text.fontColor(Constants.COLOR_TEXT);
                                Text.lineHeight(18);
                            }, Text);
                            Text.pop();
                            Row.pop();
                        };
                        this.forEachUpdateFunction(elmtId, this.report.weakPoints, forEachItemGenFunction, (point: string) => point, false, false);
                    }, ForEach);
                    ForEach.pop();
                    Column.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                        Column.padding(14);
                        Column.backgroundColor(Constants.COLOR_CARD);
                        Column.borderRadius(12);
                        Column.margin({ top: 12 });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('优势分析');
                        Text.fontSize(15);
                        Text.fontWeight(FontWeight.Bold);
                        Text.fontColor(Constants.COLOR_TEXT);
                        Text.width('100%');
                        Text.margin({ bottom: 8 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        ForEach.create();
                        const forEachItemGenFunction = _item => {
                            const point = _item;
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Row.create();
                                Row.width('100%');
                                Row.margin({ bottom: 6 });
                            }, Row);
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Circle.create();
                                Circle.width(6);
                                Circle.height(6);
                                Circle.fill(Constants.COLOR_ACCENT_GREEN);
                                Circle.margin({ right: 8 });
                            }, Circle);
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create(point);
                                Text.fontSize(12);
                                Text.fontColor(Constants.COLOR_TEXT);
                                Text.lineHeight(18);
                            }, Text);
                            Text.pop();
                            Row.pop();
                        };
                        this.forEachUpdateFunction(elmtId, this.report.strongPoints, forEachItemGenFunction, (point: string) => point, false, false);
                    }, ForEach);
                    ForEach.pop();
                    Column.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                        Column.padding(14);
                        Column.backgroundColor(Constants.COLOR_CARD);
                        Column.borderRadius(12);
                        Column.margin({ top: 12 });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('学习建议');
                        Text.fontSize(15);
                        Text.fontWeight(FontWeight.Bold);
                        Text.fontColor(Constants.COLOR_TEXT);
                        Text.width('100%');
                        Text.margin({ bottom: 8 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        ForEach.create();
                        const forEachItemGenFunction = _item => {
                            const sug = _item;
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Row.create();
                                Row.width('100%');
                                Row.margin({ bottom: 6 });
                            }, Row);
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Circle.create();
                                Circle.width(6);
                                Circle.height(6);
                                Circle.fill(Constants.COLOR_PRIMARY);
                                Circle.margin({ right: 8 });
                            }, Circle);
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create(sug);
                                Text.fontSize(12);
                                Text.fontColor(Constants.COLOR_TEXT);
                                Text.lineHeight(18);
                            }, Text);
                            Text.pop();
                            Row.pop();
                        };
                        this.forEachUpdateFunction(elmtId, this.report.suggestions, forEachItemGenFunction, (sug: string) => sug, false, false);
                    }, ForEach);
                    ForEach.pop();
                    Column.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                        Column.padding(14);
                        Column.backgroundColor(Constants.COLOR_CARD);
                        Column.borderRadius(12);
                        Column.margin({ top: 12 });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('学习总结');
                        Text.fontSize(15);
                        Text.fontWeight(FontWeight.Bold);
                        Text.fontColor(Constants.COLOR_TEXT);
                        Text.width('100%');
                        Text.margin({ bottom: 8 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.width('100%');
                        Row.margin({ bottom: 6 });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('完成时间');
                        Text.fontSize(12);
                        Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.formatDate(this.report.completedAt));
                        Text.fontSize(12);
                        Text.fontColor(Constants.COLOR_TEXT);
                        Text.margin({ left: 8 });
                    }, Text);
                    Text.pop();
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        if (this.course && this.course.status === 'completed') {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Row.create();
                                    Row.width('100%');
                                    Row.margin({ bottom: 4 });
                                }, Row);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Circle.create();
                                    Circle.width(6);
                                    Circle.height(6);
                                    Circle.fill(Constants.COLOR_ACCENT_GREEN);
                                    Circle.margin({ right: 8 });
                                }, Circle);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create('该课程已完成学习');
                                    Text.fontSize(12);
                                    Text.fontColor(Constants.COLOR_ACCENT_GREEN);
                                }, Text);
                                Text.pop();
                                Row.pop();
                            });
                        }
                        else {
                            this.ifElseBranchUpdateFunction(1, () => {
                            });
                        }
                    }, If);
                    If.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('总学习时长：' + globalData.getStudyTimeDisplay());
                        Text.fontSize(12);
                        Text.fontColor(Constants.COLOR_TEXT);
                        Text.margin({ top: 4 });
                    }, Text);
                    Text.pop();
                    Column.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                        Column.padding(14);
                        Column.backgroundColor(Constants.COLOR_CARD);
                        Column.borderRadius(12);
                        Column.margin({ top: 12 });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        if (this.aiEvaluation.length > 0) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create('AI智能评估');
                                    Text.fontSize(15);
                                    Text.fontWeight(FontWeight.Bold);
                                    Text.fontColor(Constants.COLOR_TEXT);
                                    Text.width('100%');
                                    Text.margin({ bottom: 8 });
                                }, Text);
                                Text.pop();
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create(this.aiEvaluation);
                                    Text.fontSize(12);
                                    Text.fontColor(Constants.COLOR_TEXT);
                                    Text.lineHeight(18);
                                }, Text);
                                Text.pop();
                            });
                        }
                        else {
                            this.ifElseBranchUpdateFunction(1, () => {
                            });
                        }
                    }, If);
                    If.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithChild();
                        Button.width('100%');
                        Button.height(44);
                        Button.backgroundColor(this.isLoadingAI ? Constants.COLOR_TEXT_SECONDARY : Constants.COLOR_PRIMARY);
                        Button.borderRadius(22);
                        Button.margin({ top: this.aiEvaluation.length > 0 ? 12 : 0 });
                        Button.enabled(!this.isLoadingAI);
                        Button.onClick(() => { this.generateAISuggestions(); });
                    }, Button);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        if (this.isLoadingAI) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    LoadingProgress.create();
                                    LoadingProgress.width(20);
                                    LoadingProgress.height(20);
                                    LoadingProgress.color('#FFFFFF');
                                }, LoadingProgress);
                            });
                        }
                        else {
                            this.ifElseBranchUpdateFunction(1, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create('🤖 AI智能评估');
                                    Text.fontSize(14);
                                    Text.fontColor('#FFFFFF');
                                }, Text);
                                Text.pop();
                            });
                        }
                    }, If);
                    If.pop();
                    Button.pop();
                    Column.pop();
                    Column.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
    }
    buildRadarSection(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.report) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        __Common__.create();
                        __Common__.margin({ top: 16 });
                    }, __Common__);
                    {
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            if (isInitialRender) {
                                let componentCall = new RadarChart(this, { levelScores: this.report.levelScores }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/Profile.ets", line: 783, col: 9 });
                                ViewPU.create(componentCall);
                                let paramsLambda = () => {
                                    return {
                                        levelScores: this.report.levelScores
                                    };
                                };
                                componentCall.paramsGenerator_ = paramsLambda;
                            }
                            else {
                                this.updateStateVarsOfChildByElmtId(elmtId, {});
                            }
                        }, { name: "RadarChart" });
                    }
                    __Common__.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                        Column.padding(14);
                        Column.backgroundColor(Constants.COLOR_CARD);
                        Column.borderRadius(12);
                        Column.margin({ top: 12 });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('各层级成绩明细');
                        Text.fontSize(15);
                        Text.fontWeight(FontWeight.Bold);
                        Text.fontColor(Constants.COLOR_TEXT);
                        Text.width('100%');
                        Text.margin({ bottom: 10 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        ForEach.create();
                        const forEachItemGenFunction = _item => {
                            const level = _item;
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Row.create();
                                Row.width('100%');
                                Row.margin({ bottom: 8 });
                            }, Row);
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create(level);
                                Text.fontSize(12);
                                Text.fontColor(Constants.COLOR_TEXT);
                                Text.width(50);
                            }, Text);
                            Text.pop();
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Progress.create({ value: this.getLevelScore(level) * 100, total: 100, type: ProgressType.Linear });
                                Progress.height(8);
                                Progress.color(this.getScoreColor(this.getLevelScore(level)));
                                Progress.backgroundColor(Constants.COLOR_DIVIDER);
                                Progress.borderRadius(4);
                                Progress.layoutWeight(1);
                                Progress.margin({ left: 8, right: 8 });
                            }, Progress);
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create(`${Math.round(this.getLevelScore(level) * 100)}%`);
                                Text.fontSize(12);
                                Text.fontWeight(FontWeight.Bold);
                                Text.fontColor(this.getScoreColor(this.getLevelScore(level)));
                                Text.width(40);
                                Text.textAlign(TextAlign.End);
                            }, Text);
                            Text.pop();
                            Row.pop();
                        };
                        this.forEachUpdateFunction(elmtId, this.getBloomLevels(), forEachItemGenFunction, (level: BloomLevel) => level, false, false);
                    }, ForEach);
                    ForEach.pop();
                    Column.pop();
                    Column.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
    }
    buildDialogueRecords(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.report) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('答题对话原始记录');
                        Text.fontSize(15);
                        Text.fontWeight(FontWeight.Bold);
                        Text.fontColor(Constants.COLOR_TEXT);
                        Text.width('100%');
                        Text.margin({ top: 16, bottom: 8 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('以下为学习过程中的完整问答记录，用于评估学习效果');
                        Text.fontSize(11);
                        Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
                        Text.width('100%');
                        Text.margin({ bottom: 12 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        ForEach.create();
                        const forEachItemGenFunction = _item => {
                            const record = _item;
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                If.create();
                                if (this.getQuestionById(record.questionId)) {
                                    this.ifElseBranchUpdateFunction(0, () => {
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            Column.create();
                                            Column.width('100%');
                                            Column.padding(12);
                                            Column.backgroundColor(Constants.COLOR_CARD);
                                            Column.borderRadius(12);
                                            Column.shadow({ radius: 2, offsetY: 1, color: 0x06000000 });
                                            Column.margin({ bottom: 8 });
                                        }, Column);
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            Row.create();
                                            Row.width('100%');
                                        }, Row);
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            Stack.create();
                                            Stack.width(28);
                                            Stack.height(28);
                                        }, Stack);
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            Circle.create();
                                            Circle.width(28);
                                            Circle.height(28);
                                            Circle.fill(Constants.COLOR_PRIMARY);
                                        }, Circle);
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            Text.create('Q');
                                            Text.fontSize(12);
                                            Text.fontColor('#FFFFFF');
                                            Text.fontWeight(FontWeight.Bold);
                                        }, Text);
                                        Text.pop();
                                        Stack.pop();
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            Text.create(this.getQuestionById(record.questionId)!.bloomLevel);
                                            Text.fontSize(10);
                                            Text.fontColor(Constants.COLOR_PRIMARY);
                                            Text.backgroundColor(0x0F0078D7);
                                            Text.padding({ left: 6, right: 6, top: 2, bottom: 2 });
                                            Text.borderRadius(8);
                                            Text.margin({ left: 8 });
                                        }, Text);
                                        Text.pop();
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            Blank.create();
                                        }, Blank);
                                        Blank.pop();
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            Text.create(record.isCorrect ? '正确' : '错误');
                                            Text.fontSize(10);
                                            Text.fontColor(record.isCorrect ? Constants.COLOR_ACCENT_GREEN : Constants.COLOR_ACCENT_RED);
                                            Text.fontWeight(FontWeight.Bold);
                                        }, Text);
                                        Text.pop();
                                        Row.pop();
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            Text.create(this.getQuestionById(record.questionId)!.questionText.length > 80 ?
                                                this.getQuestionById(record.questionId)!.questionText.substring(0, 80) + '...' :
                                                this.getQuestionById(record.questionId)!.questionText);
                                            Text.fontSize(12);
                                            Text.fontColor(Constants.COLOR_TEXT);
                                            Text.lineHeight(18);
                                            Text.margin({ top: 6 });
                                        }, Text);
                                        Text.pop();
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            Row.create();
                                            Row.margin({ top: 6 });
                                        }, Row);
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            Text.create(`你的回答：${record.selectedLabel}`);
                                            Text.fontSize(12);
                                            Text.fontColor(Constants.COLOR_TEXT);
                                        }, Text);
                                        Text.pop();
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            Stack.create();
                                            Stack.width(16);
                                            Stack.height(16);
                                            Stack.margin({ left: 6 });
                                        }, Stack);
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            Circle.create();
                                            Circle.width(16);
                                            Circle.height(16);
                                            Circle.fill(record.isCorrect ? Constants.COLOR_ACCENT_GREEN : Constants.COLOR_ACCENT_RED);
                                        }, Circle);
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            Text.create(record.isCorrect ? '✓' : '✗');
                                            Text.fontSize(9);
                                            Text.fontColor('#FFFFFF');
                                        }, Text);
                                        Text.pop();
                                        Stack.pop();
                                        Row.pop();
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            Row.create();
                                            Row.width('100%');
                                            Row.margin({ top: 4 });
                                        }, Row);
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            Text.create(`用时：${record.timeSpent}秒`);
                                            Text.fontSize(10);
                                            Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
                                        }, Text);
                                        Text.pop();
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            Blank.create();
                                        }, Blank);
                                        Blank.pop();
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            Text.create(this.formatTime(record.timestamp));
                                            Text.fontSize(10);
                                            Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
                                        }, Text);
                                        Text.pop();
                                        Row.pop();
                                        Column.pop();
                                    });
                                }
                                else {
                                    this.ifElseBranchUpdateFunction(1, () => {
                                    });
                                }
                            }, If);
                            If.pop();
                        };
                        this.forEachUpdateFunction(elmtId, this.records, forEachItemGenFunction, (record: AnswerRecord) => record.questionId + record.timestamp, false, false);
                    }, ForEach);
                    ForEach.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        if (this.records.length === 0) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create('暂无答题记录');
                                    Text.fontSize(13);
                                    Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
                                    Text.margin({ top: 20 });
                                }, Text);
                                Text.pop();
                            });
                        }
                        else {
                            this.ifElseBranchUpdateFunction(1, () => {
                            });
                        }
                    }, If);
                    If.pop();
                    Column.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
    }
    buildExportSection(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.margin({ top: 8 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('📋 复制报告');
            Button.fontSize(14);
            Button.fontColor(Constants.COLOR_TEXT);
            Button.width('100%');
            Button.height(44);
            Button.backgroundColor(Constants.COLOR_CARD);
            Button.borderRadius(22);
            Button.margin({ top: 20 });
            Button.onClick(() => {
                const md = this.getReportMarkdown();
                this.copyToClipboard(md);
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('📄 导出 JSON');
            Button.fontSize(14);
            Button.fontColor(Constants.COLOR_TEXT);
            Button.width('100%');
            Button.height(44);
            Button.backgroundColor(Constants.COLOR_CARD);
            Button.borderRadius(22);
            Button.margin({ top: 12 });
            Button.onClick(() => {
                const json = this.getReportJSON();
                AlertDialog.show({
                    title: 'JSON导出预览',
                    message: json.length > 300 ? json.substring(0, 300) + '\n...（内容已截断）' : json,
                    confirm: { value: '复制并导出', action: () => {
                            this.copyToClipboard(json);
                            StorageUtil.saveData();
                        } }
                });
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('📝 导出 Markdown');
            Button.fontSize(14);
            Button.fontColor(Constants.COLOR_TEXT);
            Button.width('100%');
            Button.height(44);
            Button.backgroundColor(Constants.COLOR_CARD);
            Button.borderRadius(22);
            Button.margin({ top: 12 });
            Button.onClick(() => {
                const md = this.getReportMarkdown();
                AlertDialog.show({
                    title: 'Markdown导出预览',
                    message: md.length > 300 ? md.substring(0, 300) + '\n...（内容已截断）' : md,
                    confirm: { value: '复制并导出', action: () => {
                            this.copyToClipboard(md);
                            StorageUtil.saveData();
                        } }
                });
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('📕 导出 PDF（即将推出）');
            Button.fontSize(14);
            Button.fontColor(Constants.COLOR_TEXT_SECONDARY);
            Button.width('100%');
            Button.height(44);
            Button.backgroundColor(Constants.COLOR_CARD);
            Button.borderRadius(22);
            Button.opacity(0.6);
            Button.margin({ top: 12 });
            Button.onClick(() => {
                AlertDialog.show({
                    title: '导出 PDF',
                    message: 'PDF导出功能即将推出，敬请期待！\n\n目前支持 JSON 和 Markdown 格式导出。',
                    confirm: { value: '好的', action: () => { } }
                });
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('返回首页');
            Button.fontSize(14);
            Button.fontColor('#FFFFFF');
            Button.width('100%');
            Button.height(44);
            Button.backgroundColor(Constants.COLOR_PRIMARY);
            Button.borderRadius(22);
            Button.margin({ top: 12 });
            Button.onClick(() => {
                router.clear();
                router.pushUrl({ url: 'pages/Index' });
            });
        }, Button);
        Button.pop();
        Column.pop();
    }
    getScoreColor(score: number): ResourceColor {
        if (score >= 0.8)
            return Constants.COLOR_ACCENT_GREEN;
        if (score >= 0.5)
            return Constants.COLOR_ACCENT_ORANGE;
        return Constants.COLOR_ACCENT_RED;
    }
    getOverallAssessment(): string {
        if (!this.report)
            return '';
        const acc = this.report.accuracy;
        if (acc >= 0.9)
            return `优秀！你对「${this.report.courseTitle}」掌握非常扎实，建议尝试将该知识体系应用于实际项目或教授他人以进一步巩固。`;
        if (acc >= 0.7)
            return `良好！你对「${this.report.courseTitle}」有较好的理解，建议重点关注薄弱环节，通过间隔复习和项目实践深化掌握。`;
        if (acc >= 0.5)
            return `一般！你对「${this.report.courseTitle}」有基础了解，建议重新回顾第一问的心智模型和第二问的学术分歧，建立更完整的知识框架。`;
        return `需要加强！建议重新使用三问学习法从头学习「${this.report.courseTitle}」，重点关注核心概念的理解和知识体系的构建。`;
    }
    formatTime(ts: number): string {
        const d = new Date(ts);
        return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`;
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "Profile";
    }
}
interface TrendItem {
    label: string;
    accuracy: number;
}
registerNamedRoute(() => new Profile(undefined, {}), "", { bundleName: "com.threeq.learner", moduleName: "entry", pagePath: "pages/Profile", pageFullPath: "entry/src/main/ets/pages/Profile", integratedHsp: "false", moduleType: "followWithHap" });
