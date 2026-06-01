if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface Index_Params {
    searchText?: string;
    courses?: Course[];
    greetAnim?: boolean;
    showAchievements?: boolean;
    animateCards?: boolean;
    suggestions?: string[];
    showSuggestions?: boolean;
    achievementInfos?: AchievementInfo[];
    newAchievements?: string[];
    showCelebration?: boolean;
    celebrationMsg?: string;
    currentInspiration?: string;
    todayFocusMinutes?: number;
    inspirations?: string[];
}
import router from "@ohos:router";
import { Course } from "@normalized:N&&&entry/src/main/ets/model/CourseModel&";
import type { AchievementInfo } from "@normalized:N&&&entry/src/main/ets/model/CourseModel&";
import { globalData } from "@normalized:N&&&entry/src/main/ets/model/LearningData&";
import { StorageUtil } from "@normalized:N&&&entry/src/main/ets/utils/StorageUtil&";
import { Constants } from "@normalized:N&&&entry/src/main/ets/utils/Constants&";
import { CourseCard } from "@normalized:N&&&entry/src/main/ets/components/CourseCard&";
class Index extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__searchText = new ObservedPropertySimplePU('', this, "searchText");
        this.__courses = new ObservedPropertyObjectPU([], this, "courses");
        this.__greetAnim = new ObservedPropertySimplePU(false, this, "greetAnim");
        this.__showAchievements = new ObservedPropertySimplePU(false, this, "showAchievements");
        this.__animateCards = new ObservedPropertySimplePU(false, this, "animateCards");
        this.__suggestions = new ObservedPropertyObjectPU([], this, "suggestions");
        this.__showSuggestions = new ObservedPropertySimplePU(false, this, "showSuggestions");
        this.__achievementInfos = new ObservedPropertyObjectPU([], this, "achievementInfos");
        this.__newAchievements = new ObservedPropertyObjectPU([], this, "newAchievements");
        this.__showCelebration = new ObservedPropertySimplePU(false, this, "showCelebration");
        this.__celebrationMsg = new ObservedPropertySimplePU('', this, "celebrationMsg");
        this.__currentInspiration = new ObservedPropertySimplePU('', this, "currentInspiration");
        this.__todayFocusMinutes = new ObservedPropertySimplePU(0, this, "todayFocusMinutes");
        this.inspirations = [
            '学习不是填满水桶，而是点燃火焰。',
            '知之者不如好之者，好之者不如乐之者。',
            '学而不思则罔，思而不学则殆。',
            '千里之行，始于足下。',
            '温故而知新，可以为师矣。',
            '努力不一定成功，但放弃一定失败。',
            '每一次专注都是对未来的投资。',
            '知识就是力量。',
            '学习是一辈子的事。',
            '不怕慢，就怕站。',
            '种一棵树最好的时间是十年前，其次是现在。',
            '不积跬步，无以至千里。'
        ];
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: Index_Params) {
        if (params.searchText !== undefined) {
            this.searchText = params.searchText;
        }
        if (params.courses !== undefined) {
            this.courses = params.courses;
        }
        if (params.greetAnim !== undefined) {
            this.greetAnim = params.greetAnim;
        }
        if (params.showAchievements !== undefined) {
            this.showAchievements = params.showAchievements;
        }
        if (params.animateCards !== undefined) {
            this.animateCards = params.animateCards;
        }
        if (params.suggestions !== undefined) {
            this.suggestions = params.suggestions;
        }
        if (params.showSuggestions !== undefined) {
            this.showSuggestions = params.showSuggestions;
        }
        if (params.achievementInfos !== undefined) {
            this.achievementInfos = params.achievementInfos;
        }
        if (params.newAchievements !== undefined) {
            this.newAchievements = params.newAchievements;
        }
        if (params.showCelebration !== undefined) {
            this.showCelebration = params.showCelebration;
        }
        if (params.celebrationMsg !== undefined) {
            this.celebrationMsg = params.celebrationMsg;
        }
        if (params.currentInspiration !== undefined) {
            this.currentInspiration = params.currentInspiration;
        }
        if (params.todayFocusMinutes !== undefined) {
            this.todayFocusMinutes = params.todayFocusMinutes;
        }
        if (params.inspirations !== undefined) {
            this.inspirations = params.inspirations;
        }
    }
    updateStateVars(params: Index_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__searchText.purgeDependencyOnElmtId(rmElmtId);
        this.__courses.purgeDependencyOnElmtId(rmElmtId);
        this.__greetAnim.purgeDependencyOnElmtId(rmElmtId);
        this.__showAchievements.purgeDependencyOnElmtId(rmElmtId);
        this.__animateCards.purgeDependencyOnElmtId(rmElmtId);
        this.__suggestions.purgeDependencyOnElmtId(rmElmtId);
        this.__showSuggestions.purgeDependencyOnElmtId(rmElmtId);
        this.__achievementInfos.purgeDependencyOnElmtId(rmElmtId);
        this.__newAchievements.purgeDependencyOnElmtId(rmElmtId);
        this.__showCelebration.purgeDependencyOnElmtId(rmElmtId);
        this.__celebrationMsg.purgeDependencyOnElmtId(rmElmtId);
        this.__currentInspiration.purgeDependencyOnElmtId(rmElmtId);
        this.__todayFocusMinutes.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__searchText.aboutToBeDeleted();
        this.__courses.aboutToBeDeleted();
        this.__greetAnim.aboutToBeDeleted();
        this.__showAchievements.aboutToBeDeleted();
        this.__animateCards.aboutToBeDeleted();
        this.__suggestions.aboutToBeDeleted();
        this.__showSuggestions.aboutToBeDeleted();
        this.__achievementInfos.aboutToBeDeleted();
        this.__newAchievements.aboutToBeDeleted();
        this.__showCelebration.aboutToBeDeleted();
        this.__celebrationMsg.aboutToBeDeleted();
        this.__currentInspiration.aboutToBeDeleted();
        this.__todayFocusMinutes.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __searchText: ObservedPropertySimplePU<string>;
    get searchText() {
        return this.__searchText.get();
    }
    set searchText(newValue: string) {
        this.__searchText.set(newValue);
    }
    private __courses: ObservedPropertyObjectPU<Course[]>;
    get courses() {
        return this.__courses.get();
    }
    set courses(newValue: Course[]) {
        this.__courses.set(newValue);
    }
    private __greetAnim: ObservedPropertySimplePU<boolean>;
    get greetAnim() {
        return this.__greetAnim.get();
    }
    set greetAnim(newValue: boolean) {
        this.__greetAnim.set(newValue);
    }
    private __showAchievements: ObservedPropertySimplePU<boolean>;
    get showAchievements() {
        return this.__showAchievements.get();
    }
    set showAchievements(newValue: boolean) {
        this.__showAchievements.set(newValue);
    }
    private __animateCards: ObservedPropertySimplePU<boolean>;
    get animateCards() {
        return this.__animateCards.get();
    }
    set animateCards(newValue: boolean) {
        this.__animateCards.set(newValue);
    }
    private __suggestions: ObservedPropertyObjectPU<string[]>;
    get suggestions() {
        return this.__suggestions.get();
    }
    set suggestions(newValue: string[]) {
        this.__suggestions.set(newValue);
    }
    private __showSuggestions: ObservedPropertySimplePU<boolean>;
    get showSuggestions() {
        return this.__showSuggestions.get();
    }
    set showSuggestions(newValue: boolean) {
        this.__showSuggestions.set(newValue);
    }
    private __achievementInfos: ObservedPropertyObjectPU<AchievementInfo[]>;
    get achievementInfos() {
        return this.__achievementInfos.get();
    }
    set achievementInfos(newValue: AchievementInfo[]) {
        this.__achievementInfos.set(newValue);
    }
    private __newAchievements: ObservedPropertyObjectPU<string[]>;
    get newAchievements() {
        return this.__newAchievements.get();
    }
    set newAchievements(newValue: string[]) {
        this.__newAchievements.set(newValue);
    }
    private __showCelebration: ObservedPropertySimplePU<boolean>;
    get showCelebration() {
        return this.__showCelebration.get();
    }
    set showCelebration(newValue: boolean) {
        this.__showCelebration.set(newValue);
    }
    private __celebrationMsg: ObservedPropertySimplePU<string>;
    get celebrationMsg() {
        return this.__celebrationMsg.get();
    }
    set celebrationMsg(newValue: string) {
        this.__celebrationMsg.set(newValue);
    }
    private __currentInspiration: ObservedPropertySimplePU<string>;
    get currentInspiration() {
        return this.__currentInspiration.get();
    }
    set currentInspiration(newValue: string) {
        this.__currentInspiration.set(newValue);
    }
    private __todayFocusMinutes: ObservedPropertySimplePU<number>;
    get todayFocusMinutes() {
        return this.__todayFocusMinutes.get();
    }
    set todayFocusMinutes(newValue: number) {
        this.__todayFocusMinutes.set(newValue);
    }
    private inspirations: string[];
    aboutToAppear(): void {
        StorageUtil.loadData();
        this.courses = globalData.getCourses();
        globalData.recordStudyActivity();
        this.todayFocusMinutes = globalData.getTodayFocusMinutes();
        this.currentInspiration = this.inspirations[Math.floor(Math.random() * this.inspirations.length)];
        const newlyEarned = globalData.checkAllAchievements();
        if (newlyEarned.length > 0) {
            this.newAchievements = newlyEarned;
            const names = newlyEarned.map(id => {
                const infos = globalData.getAllAchievementInfos();
                const info = infos.find(i => i.id === id);
                return info ? info.name : id;
            });
            this.celebrationMsg = '🎉 获得成就: ' + names.join(', ');
            this.showCelebration = true;
            setTimeout(() => {
                this.showCelebration = false;
            }, 4000);
        }
        this.achievementInfos = globalData.getAllAchievementInfos();
        setTimeout(() => {
            this.greetAnim = true;
        }, 100);
        setTimeout(() => {
            this.animateCards = true;
        }, 300);
        StorageUtil.saveData();
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor(Constants.COLOR_BACKGROUND);
        }, Column);
        this.buildHeader.bind(this)();
        this.buildDailyInspiration.bind(this)();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.courses.length > 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.buildStatsStrip.bind(this)();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Scroll.create();
            Scroll.layoutWeight(1);
            Scroll.margin({ top: 8 });
        }, Scroll);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.padding({ left: 20, right: 20 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.courses.length === 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.buildEmptyState.bind(this)();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.buildCourseList.bind(this)();
                });
            }
        }, If);
        If.pop();
        Column.pop();
        Scroll.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.showCelebration && this.celebrationMsg.length > 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.celebrationMsg);
                        Text.fontSize(14);
                        Text.fontColor('#FFFFFF');
                        Text.fontWeight(FontWeight.Bold);
                        Text.backgroundColor(0xCC0078D7);
                        Text.padding({ left: 20, right: 20, top: 12, bottom: 12 });
                        Text.borderRadius(24);
                        Text.margin({ bottom: 16 });
                        Text.shadow({ radius: 8, offsetY: 4, color: 0x330078D7 });
                        Text.transition(TransitionEffect.opacity(0).combine(TransitionEffect.translate({ x: 0, y: 20 })));
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
    }
    buildHeader(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.padding({ left: 20, right: 20, bottom: 16 });
            Column.linearGradient({
                direction: GradientDirection.Bottom,
                colors: [[Constants.COLOR_GRADIENT_START, 0], [Constants.COLOR_GRADIENT_MID, 0.5], [Constants.COLOR_GRADIENT_END, 1]]
            });
            Column.borderRadius({ bottomLeft: 24, bottomRight: 24 });
            Column.shadow({ radius: 8, offsetY: 4, color: 0x1A0078D7 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.padding({ top: 16, bottom: 4 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.getGreeting());
            Text.fontSize(18);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor('#FFFFFF');
            Text.opacity(this.greetAnim ? 1 : 0);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.greetAnim) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(' 🌟');
                        Text.fontSize(16);
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
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('三问高效学习法 · 今日学习');
            Text.fontSize(12);
            Text.fontColor('rgba(255,255,255,0.7)');
            Text.margin({ top: 2 });
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create();
            Stack.width(36);
            Stack.height(36);
            Stack.onClick(() => {
                router.pushUrl({ url: 'pages/AISettings' });
            });
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Circle.create();
            Circle.width(36);
            Circle.height(36);
            Circle.fill(0x33FFFFFF);
        }, Circle);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('AI');
            Text.fontSize(12);
            Text.fontColor('#FFFFFF');
            Text.fontWeight(FontWeight.Bold);
        }, Text);
        Text.pop();
        Stack.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.margin({ top: 8 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create();
            Stack.layoutWeight(1);
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ placeholder: Constants.SEARCH_PLACEHOLDER, text: this.searchText });
            TextInput.layoutWeight(1);
            TextInput.height(48);
            TextInput.backgroundColor(0x33FFFFFF);
            TextInput.placeholderColor('rgba(255,255,255,0.6)');
            TextInput.fontColor('#FFFFFF');
            TextInput.borderRadius(24);
            TextInput.padding({ left: 16 });
            TextInput.onChange((val: string) => {
                this.searchText = val;
                this.updateSuggestions(val);
            });
            TextInput.onSubmit(() => {
                this.showSuggestions = false;
                this.createCourse();
            });
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.showSuggestions && this.suggestions.length > 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                        Column.backgroundColor(0xE6005A9E);
                        Column.borderRadius(12);
                        Column.margin({ top: 4 });
                        Column.position({ x: 0, y: 52 });
                        Column.zIndex(10);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        ForEach.create();
                        const forEachItemGenFunction = _item => {
                            const s = _item;
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create(s);
                                Text.fontSize(14);
                                Text.fontColor('#FFFFFF');
                                Text.padding({ left: 16, top: 10, bottom: 10, right: 16 });
                                Text.width('100%');
                                Text.onClick(() => {
                                    this.searchText = s;
                                    this.showSuggestions = false;
                                    const existing = this.courses.find(c => c.title === s);
                                    if (existing) {
                                        existing.lastAccessedAt = Date.now();
                                        StorageUtil.saveData();
                                        router.pushUrl({
                                            url: 'pages/LearningSpace',
                                            params: { courseId: existing.id, courseTitle: existing.title }
                                        });
                                    }
                                });
                            }, Text);
                            Text.pop();
                        };
                        this.forEachUpdateFunction(elmtId, this.suggestions, forEachItemGenFunction, (s: string) => s, false, false);
                    }, ForEach);
                    ForEach.pop();
                    Column.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        Stack.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create();
            Stack.width(48);
            Stack.height(48);
            Stack.margin({ left: 8 });
            Stack.onClick(() => {
                this.showSuggestions = false;
                this.createCourse();
            });
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Circle.create();
            Circle.width(48);
            Circle.height(48);
            Circle.fill(0x33FFFFFF);
        }, Circle);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('创建');
            Text.fontSize(12);
            Text.fontColor('#FFFFFF');
            Text.fontWeight(FontWeight.Bold);
        }, Text);
        Text.pop();
        Column.pop();
        Stack.pop();
        Row.pop();
        Column.pop();
    }
    buildDailyInspiration(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.currentInspiration.length > 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.width('100%');
                        Row.padding({ left: 20, right: 20, top: 12, bottom: 12 });
                        Row.backgroundColor(Constants.COLOR_CARD);
                        Row.margin({ top: 8 });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('💡');
                        Text.fontSize(18);
                        Text.margin({ right: 10 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.layoutWeight(1);
                        Column.alignItems(HorizontalAlign.Start);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.currentInspiration);
                        Text.fontSize(13);
                        Text.fontColor(Constants.COLOR_TEXT);
                        Text.lineHeight(20);
                        Text.fontWeight(FontWeight.Medium);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.courses.length > 0 ? '💪 已坚持 ' + globalData.getStreak() + ' 天不间断学习' : '🌟 开始你的第一个课程吧');
                        Text.fontSize(11);
                        Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
                        Text.margin({ top: 4 });
                    }, Text);
                    Text.pop();
                    Column.pop();
                    Row.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
    }
    buildStatsStrip(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.padding(14);
            Row.backgroundColor(Constants.COLOR_CARD);
            Row.borderRadius(16);
            Row.margin({ top: 12, left: 20, right: 20 });
            Row.shadow({ radius: 4, offsetY: 2, color: 0x0C000000 });
        }, Row);
        this.buildStatItem.bind(this)('📚', '课程总数', `${this.courses.length}`);
        this.buildStatItem.bind(this)('✅', '已完成', `${globalData.getCompletedCourses()}`);
        this.buildStatItem.bind(this)('🔥', '连续学习', `${globalData.getStreak()}天`);
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.justifyContent(FlexAlign.SpaceBetween);
            Row.margin({ top: 10, left: 20, right: 20 });
        }, Row);
        this.buildQuickAction.bind(this)('🍅 专注', Constants.COLOR_ACCENT_RED, () => {
            router.pushUrl({ url: 'pages/StudyTimer' });
        });
        this.buildQuickAction.bind(this)('▶ 继续学习', Constants.COLOR_PRIMARY, () => {
            const last = globalData.getLastActiveCourse();
            if (last) {
                last.lastAccessedAt = Date.now();
                StorageUtil.saveData();
                router.pushUrl({
                    url: 'pages/LearningSpace',
                    params: { courseId: last.id, courseTitle: last.title }
                });
            }
            else if (this.courses.length > 0) {
                const c = this.courses[0];
                c.lastAccessedAt = Date.now();
                StorageUtil.saveData();
                router.pushUrl({
                    url: 'pages/LearningSpace',
                    params: { courseId: c.id, courseTitle: c.title }
                });
            }
        });
        this.buildQuickAction.bind(this)('📖 新课程', Constants.COLOR_ACCENT_GREEN, () => {
            this.searchText = '';
        });
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.justifyContent(FlexAlign.SpaceBetween);
            Row.margin({ top: 6, left: 20, right: 20 });
        }, Row);
        this.buildQuickAction.bind(this)('🏆 成就', Constants.COLOR_ACCENT_ORANGE, () => {
            this.showAchievements = !this.showAchievements;
            this.achievementInfos = globalData.getAllAchievementInfos();
        });
        this.buildQuickAction.bind(this)('⏱ 今日专注 ' + this.todayFocusMinutes + '分钟', Constants.COLOR_ACCENT_GREEN, () => {
            router.pushUrl({ url: 'pages/StudyTimer' });
        });
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.showAchievements) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.buildAchievementsPanel.bind(this)();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
    }
    buildStatItem(icon: string, label: string, value: string, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.layoutWeight(1);
            Column.alignItems(HorizontalAlign.Center);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(icon);
            Text.fontSize(14);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(value);
            Text.fontSize(18);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(Constants.COLOR_TEXT);
            Text.margin({ left: 4 });
        }, Text);
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(label);
            Text.fontSize(11);
            Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
            Text.margin({ top: 2 });
        }, Text);
        Text.pop();
        Column.pop();
    }
    buildQuickAction(text: string, color: ResourceColor, action: () => void, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(text);
            Text.fontSize(12);
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor(color);
            Text.backgroundColor(0x0F000000);
            Text.padding({ left: 12, right: 12, top: 8, bottom: 8 });
            Text.borderRadius(16);
            Text.border({ width: 1, color: color });
            Text.onClick(() => { action(); });
        }, Text);
        Text.pop();
    }
    buildAchievementsPanel(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.padding(14);
            Column.backgroundColor(Constants.COLOR_CARD);
            Column.borderRadius(16);
            Column.margin({ top: 8 });
            Column.shadow({ radius: 4, offsetY: 2, color: 0x0C000000 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('🏅 学习成就');
            Text.fontSize(16);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(Constants.COLOR_TEXT);
            Text.width('100%');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Scroll.create();
            Scroll.width('100%');
            Scroll.scrollable(ScrollDirection.Horizontal);
            Scroll.margin({ top: 8 });
        }, Scroll);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = _item => {
                const info = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Column.create();
                    Column.padding(10);
                    Column.backgroundColor(info.unlocked ? 0x0F10B981 : Constants.COLOR_CARD);
                    Column.borderRadius(12);
                    Column.margin({ right: 8 });
                    Column.width(100);
                    Column.alignItems(HorizontalAlign.Center);
                    Column.border({ width: 1, color: info.unlocked ? 0x2210B981 : Constants.COLOR_DIVIDER });
                }, Column);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(info.icon);
                    Text.fontSize(28);
                    Text.opacity(info.unlocked ? 1 : 0.3);
                }, Text);
                Text.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(info.name);
                    Text.fontSize(11);
                    Text.fontWeight(FontWeight.Bold);
                    Text.fontColor(info.unlocked ? Constants.COLOR_TEXT : Constants.COLOR_TEXT_SECONDARY);
                    Text.margin({ top: 4 });
                }, Text);
                Text.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(info.description);
                    Text.fontSize(9);
                    Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
                    Text.textAlign(TextAlign.Center);
                    Text.maxLines(1);
                    Text.textOverflow({ overflow: TextOverflow.Ellipsis });
                }, Text);
                Text.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    If.create();
                    if (info.unlocked) {
                        this.ifElseBranchUpdateFunction(0, () => {
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create('✓ 已获得');
                                Text.fontSize(9);
                                Text.fontColor(Constants.COLOR_ACCENT_GREEN);
                                Text.margin({ top: 2 });
                            }, Text);
                            Text.pop();
                        });
                    }
                    else {
                        this.ifElseBranchUpdateFunction(1, () => {
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create('未解锁');
                                Text.fontSize(9);
                                Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
                                Text.margin({ top: 2 });
                            }, Text);
                            Text.pop();
                        });
                    }
                }, If);
                If.pop();
                Column.pop();
            };
            this.forEachUpdateFunction(elmtId, this.achievementInfos, forEachItemGenFunction, (info: AchievementInfo) => info.id, false, false);
        }, ForEach);
        ForEach.pop();
        Row.pop();
        Scroll.pop();
        Column.pop();
    }
    buildEmptyState(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create();
            Stack.width(80);
            Stack.height(80);
            Stack.margin({ top: 60 });
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Circle.create();
            Circle.width(80);
            Circle.height(80);
            Circle.fill(0x0F0078D7);
        }, Circle);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('?');
            Text.fontSize(36);
            Text.fontColor(Constants.COLOR_PRIMARY);
            Text.fontWeight(FontWeight.Bold);
        }, Text);
        Text.pop();
        Stack.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('开始你的学习之旅');
            Text.fontSize(20);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(Constants.COLOR_TEXT);
            Text.margin({ top: 20 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('输入你想学习的任何课程或问题\nAI将为你生成专属三问学习课程');
            Text.fontSize(14);
            Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
            Text.textAlign(TextAlign.Center);
            Text.margin({ top: 12 });
            Text.lineHeight(22);
        }, Text);
        Text.pop();
        this.buildQuickStart.bind(this)();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('三问学习法三步走');
            Text.fontSize(13);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(Constants.COLOR_TEXT);
            Text.margin({ top: 32 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.margin({ top: 12 });
            Row.justifyContent(FlexAlign.SpaceBetween);
        }, Row);
        this.buildStepCard.bind(this)('Q1', '心智模型', '建立知识框架', Constants.COLOR_PRIMARY);
        this.buildStepCard.bind(this)('Q2', '学术分歧', '培养批判思维', Constants.COLOR_ACCENT_PURPLE);
        this.buildStepCard.bind(this)('Q3', '深度测评', '检验学习效果', Constants.COLOR_ACCENT_GREEN);
        Row.pop();
        Column.pop();
    }
    buildQuickStart(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('快速开始示例');
            Text.fontSize(12);
            Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
            Text.margin({ top: 20, bottom: 8 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Flex.create({ wrap: FlexWrap.Wrap, justifyContent: FlexAlign.Center });
            Flex.width('100%');
        }, Flex);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = _item => {
                const topic = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(topic);
                    Text.fontSize(12);
                    Text.fontColor(Constants.COLOR_PRIMARY);
                    Text.backgroundColor(0x0F0078D7);
                    Text.padding({ left: 12, right: 12, top: 6, bottom: 6 });
                    Text.borderRadius(16);
                    Text.margin(4);
                    Text.onClick(() => {
                        this.searchText = topic;
                        this.createCourse();
                    });
                }, Text);
                Text.pop();
            };
            this.forEachUpdateFunction(elmtId, ['鸿蒙ArkTS开发', '机器学习入门', '经济学原理', 'Python编程', '量子计算', '设计模式'], forEachItemGenFunction, (topic: string) => topic, false, false);
        }, ForEach);
        ForEach.pop();
        Flex.pop();
        Column.pop();
    }
    buildStepCard(q: string, title: string, desc: string, color: ResourceColor, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.padding(12);
            Column.backgroundColor(Constants.COLOR_CARD);
            Column.borderRadius(12);
            Column.shadow({ radius: 4, offsetY: 1, color: 0x0A000000 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create();
            Stack.width(36);
            Stack.height(36);
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Circle.create();
            Circle.width(36);
            Circle.height(36);
            Circle.fill(color);
        }, Circle);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(q);
            Text.fontSize(14);
            Text.fontColor('#FFFFFF');
            Text.fontWeight(FontWeight.Bold);
        }, Text);
        Text.pop();
        Stack.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(title);
            Text.fontSize(12);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(Constants.COLOR_TEXT);
            Text.margin({ top: 6 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(desc);
            Text.fontSize(10);
            Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
        }, Text);
        Text.pop();
        Column.pop();
    }
    buildCourseList(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('我的课程');
            Text.fontSize(18);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(Constants.COLOR_TEXT);
            Text.width('100%');
            Text.margin({ top: 4, bottom: 8 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            List.create();
            List.width('100%');
        }, List);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = _item => {
                const course = _item;
                {
                    const itemCreation = (elmtId, isInitialRender) => {
                        ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                        ListItem.create(deepRenderFunction, true);
                        if (!isInitialRender) {
                            ListItem.pop();
                        }
                        ViewStackProcessor.StopGetAccessRecording();
                    };
                    const itemCreation2 = (elmtId, isInitialRender) => {
                        ListItem.create(deepRenderFunction, true);
                        ListItem.margin({ bottom: 12 });
                        ListItem.transition(TransitionEffect.translate({ x: 60, y: 0 })
                            .combine(TransitionEffect.opacity(0)));
                    };
                    const deepRenderFunction = (elmtId, isInitialRender) => {
                        itemCreation(elmtId, isInitialRender);
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            __Common__.create();
                            __Common__.transition(TransitionEffect.translate({ x: 60, y: 0 })
                                .combine(TransitionEffect.opacity(0)));
                        }, __Common__);
                        {
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                if (isInitialRender) {
                                    let componentCall = new CourseCard(this, {
                                        course: course,
                                        onCardClick: () => {
                                            course.lastAccessedAt = Date.now();
                                            StorageUtil.saveData();
                                            router.pushUrl({
                                                url: 'pages/LearningSpace',
                                                params: { courseId: course.id, courseTitle: course.title }
                                            });
                                        }
                                    }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/Index.ets", line: 536, col: 13 });
                                    ViewPU.create(componentCall);
                                    let paramsLambda = () => {
                                        return {
                                            course: course,
                                            onCardClick: () => {
                                                course.lastAccessedAt = Date.now();
                                                StorageUtil.saveData();
                                                router.pushUrl({
                                                    url: 'pages/LearningSpace',
                                                    params: { courseId: course.id, courseTitle: course.title }
                                                });
                                            }
                                        };
                                    };
                                    componentCall.paramsGenerator_ = paramsLambda;
                                }
                                else {
                                    this.updateStateVarsOfChildByElmtId(elmtId, {
                                        course: course
                                    });
                                }
                            }, { name: "CourseCard" });
                        }
                        __Common__.pop();
                        ListItem.pop();
                    };
                    this.observeComponentCreation2(itemCreation2, ListItem);
                    ListItem.pop();
                }
            };
            this.forEachUpdateFunction(elmtId, this.courses, forEachItemGenFunction, (course: Course) => course.id, false, false);
        }, ForEach);
        ForEach.pop();
        List.pop();
        Column.pop();
    }
    updateSuggestions(val: string): void {
        if (val.trim().length === 0) {
            this.suggestions = [];
            this.showSuggestions = false;
            return;
        }
        this.suggestions = this.courses
            .map(c => c.title)
            .filter(t => t.toLowerCase().includes(val.toLowerCase()))
            .slice(0, 5);
        this.showSuggestions = this.suggestions.length > 0;
    }
    getGreeting(): string {
        const hour = new Date().getHours();
        let timeMsg = '';
        let emoji = '';
        if (hour < 6) {
            timeMsg = '夜深了';
            emoji = '🌙';
        }
        else if (hour < 9) {
            timeMsg = '早上好';
            emoji = '🌅';
        }
        else if (hour < 12) {
            timeMsg = '上午好';
            emoji = '☀️';
        }
        else if (hour < 14) {
            timeMsg = '中午好';
            emoji = '🌞';
        }
        else if (hour < 18) {
            timeMsg = '下午好';
            emoji = '📚';
        }
        else if (hour < 22) {
            timeMsg = '晚上好';
            emoji = '🌆';
        }
        else {
            timeMsg = '夜深了';
            emoji = '🌙';
        }
        return `${timeMsg}！今天也要加油哦 ${emoji}`;
    }
    createCourse(): void {
        const text = this.searchText.trim();
        if (!text)
            return;
        const existing = this.courses.find(c => c.title === text);
        if (existing) {
            existing.lastAccessedAt = Date.now();
            StorageUtil.saveData();
            router.pushUrl({
                url: 'pages/LearningSpace',
                params: { courseId: existing.id, courseTitle: existing.title }
            });
            return;
        }
        const course = Course.createFromTopic(text);
        globalData.addCourse(course);
        this.courses = globalData.getCourses();
        this.searchText = '';
        this.showSuggestions = false;
        const newlyEarned = globalData.checkAllAchievements();
        if (newlyEarned.length > 0) {
            this.newAchievements = newlyEarned;
            const names = newlyEarned.map(id => {
                const infos = globalData.getAllAchievementInfos();
                const info = infos.find(i => i.id === id);
                return info ? info.name : id;
            });
            this.celebrationMsg = '🎉 获得成就: ' + names.join(', ');
            this.showCelebration = true;
            setTimeout(() => {
                this.showCelebration = false;
            }, 4000);
        }
        this.achievementInfos = globalData.getAllAchievementInfos();
        StorageUtil.saveData();
        router.pushUrl({
            url: 'pages/LearningSpace',
            params: { courseId: course.id, courseTitle: course.title }
        });
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "Index";
    }
}
registerNamedRoute(() => new Index(undefined, {}), "", { bundleName: "com.threeq.learner", moduleName: "entry", pagePath: "pages/Index", pageFullPath: "entry/src/main/ets/pages/Index", integratedHsp: "false", moduleType: "followWithHap" });
