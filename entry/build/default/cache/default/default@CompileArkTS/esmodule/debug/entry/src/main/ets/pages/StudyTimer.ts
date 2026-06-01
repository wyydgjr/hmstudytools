if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface StudyTimer_Params {
    focusMinutes?: number;
    breakMinutes?: number;
    secondsLeft?: number;
    isActive?: boolean;
    isBreak?: boolean;
    sessionCount?: number;
    todayFocus?: number;
    selectedMinutes?: number;
    showPreset?: boolean;
    timerId?: number;
}
import router from "@ohos:router";
import { globalData } from "@normalized:N&&&entry/src/main/ets/model/LearningData&";
import { Constants } from "@normalized:N&&&entry/src/main/ets/utils/Constants&";
import { StorageUtil } from "@normalized:N&&&entry/src/main/ets/utils/StorageUtil&";
class StudyTimer extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__focusMinutes = new ObservedPropertySimplePU(25, this, "focusMinutes");
        this.__breakMinutes = new ObservedPropertySimplePU(5, this, "breakMinutes");
        this.__secondsLeft = new ObservedPropertySimplePU(25 * 60, this, "secondsLeft");
        this.__isActive = new ObservedPropertySimplePU(false, this, "isActive");
        this.__isBreak = new ObservedPropertySimplePU(false, this, "isBreak");
        this.__sessionCount = new ObservedPropertySimplePU(0, this, "sessionCount");
        this.__todayFocus = new ObservedPropertySimplePU(0, this, "todayFocus");
        this.__selectedMinutes = new ObservedPropertySimplePU(25, this, "selectedMinutes");
        this.__showPreset = new ObservedPropertySimplePU(false, this, "showPreset");
        this.timerId = -1;
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: StudyTimer_Params) {
        if (params.focusMinutes !== undefined) {
            this.focusMinutes = params.focusMinutes;
        }
        if (params.breakMinutes !== undefined) {
            this.breakMinutes = params.breakMinutes;
        }
        if (params.secondsLeft !== undefined) {
            this.secondsLeft = params.secondsLeft;
        }
        if (params.isActive !== undefined) {
            this.isActive = params.isActive;
        }
        if (params.isBreak !== undefined) {
            this.isBreak = params.isBreak;
        }
        if (params.sessionCount !== undefined) {
            this.sessionCount = params.sessionCount;
        }
        if (params.todayFocus !== undefined) {
            this.todayFocus = params.todayFocus;
        }
        if (params.selectedMinutes !== undefined) {
            this.selectedMinutes = params.selectedMinutes;
        }
        if (params.showPreset !== undefined) {
            this.showPreset = params.showPreset;
        }
        if (params.timerId !== undefined) {
            this.timerId = params.timerId;
        }
    }
    updateStateVars(params: StudyTimer_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__focusMinutes.purgeDependencyOnElmtId(rmElmtId);
        this.__breakMinutes.purgeDependencyOnElmtId(rmElmtId);
        this.__secondsLeft.purgeDependencyOnElmtId(rmElmtId);
        this.__isActive.purgeDependencyOnElmtId(rmElmtId);
        this.__isBreak.purgeDependencyOnElmtId(rmElmtId);
        this.__sessionCount.purgeDependencyOnElmtId(rmElmtId);
        this.__todayFocus.purgeDependencyOnElmtId(rmElmtId);
        this.__selectedMinutes.purgeDependencyOnElmtId(rmElmtId);
        this.__showPreset.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__focusMinutes.aboutToBeDeleted();
        this.__breakMinutes.aboutToBeDeleted();
        this.__secondsLeft.aboutToBeDeleted();
        this.__isActive.aboutToBeDeleted();
        this.__isBreak.aboutToBeDeleted();
        this.__sessionCount.aboutToBeDeleted();
        this.__todayFocus.aboutToBeDeleted();
        this.__selectedMinutes.aboutToBeDeleted();
        this.__showPreset.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __focusMinutes: ObservedPropertySimplePU<number>;
    get focusMinutes() {
        return this.__focusMinutes.get();
    }
    set focusMinutes(newValue: number) {
        this.__focusMinutes.set(newValue);
    }
    private __breakMinutes: ObservedPropertySimplePU<number>;
    get breakMinutes() {
        return this.__breakMinutes.get();
    }
    set breakMinutes(newValue: number) {
        this.__breakMinutes.set(newValue);
    }
    private __secondsLeft: ObservedPropertySimplePU<number>;
    get secondsLeft() {
        return this.__secondsLeft.get();
    }
    set secondsLeft(newValue: number) {
        this.__secondsLeft.set(newValue);
    }
    private __isActive: ObservedPropertySimplePU<boolean>;
    get isActive() {
        return this.__isActive.get();
    }
    set isActive(newValue: boolean) {
        this.__isActive.set(newValue);
    }
    private __isBreak: ObservedPropertySimplePU<boolean>;
    get isBreak() {
        return this.__isBreak.get();
    }
    set isBreak(newValue: boolean) {
        this.__isBreak.set(newValue);
    }
    private __sessionCount: ObservedPropertySimplePU<number>;
    get sessionCount() {
        return this.__sessionCount.get();
    }
    set sessionCount(newValue: number) {
        this.__sessionCount.set(newValue);
    }
    private __todayFocus: ObservedPropertySimplePU<number>;
    get todayFocus() {
        return this.__todayFocus.get();
    }
    set todayFocus(newValue: number) {
        this.__todayFocus.set(newValue);
    }
    private __selectedMinutes: ObservedPropertySimplePU<number>;
    get selectedMinutes() {
        return this.__selectedMinutes.get();
    }
    set selectedMinutes(newValue: number) {
        this.__selectedMinutes.set(newValue);
    }
    private __showPreset: ObservedPropertySimplePU<boolean>;
    get showPreset() {
        return this.__showPreset.get();
    }
    set showPreset(newValue: boolean) {
        this.__showPreset.set(newValue);
    }
    private timerId: number;
    aboutToAppear(): void {
        this.todayFocus = globalData.getTodayFocusMinutes();
        this.resetTimer();
    }
    aboutToDisappear(): void {
        this.stopTimer();
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor(Constants.COLOR_BACKGROUND);
        }, Column);
        this.buildHeader.bind(this)();
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
        this.buildTimerCard.bind(this)();
        this.buildPresetSelector.bind(this)();
        this.buildSessionStats.bind(this)();
        this.buildTodaySummary.bind(this)();
        Column.pop();
        Scroll.pop();
        Column.pop();
    }
    buildHeader(parent = null) {
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
            Stack.onClick(() => {
                router.back();
            });
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
            Text.create('番茄专注钟');
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
            Stack.create();
            Stack.width(36);
            Stack.height(36);
            Stack.onClick(() => {
                this.showPreset = !this.showPreset;
            });
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Circle.create();
            Circle.width(36);
            Circle.height(36);
            Circle.fill(0x0F000000);
        }, Circle);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('📊');
            Text.fontSize(16);
        }, Text);
        Text.pop();
        Stack.pop();
        Row.pop();
    }
    buildTimerCard(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.padding(24);
            Column.backgroundColor(Constants.COLOR_CARD);
            Column.borderRadius(20);
            Column.alignItems(HorizontalAlign.Center);
            Column.shadow({ radius: 8, offsetY: 4, color: 0x1A000000 });
            Column.margin({ top: 20 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (!this.isBreak) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('专注时间');
                        Text.fontSize(14);
                        Text.fontColor(Constants.COLOR_PRIMARY);
                        Text.fontWeight(FontWeight.Medium);
                    }, Text);
                    Text.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('休息时间');
                        Text.fontSize(14);
                        Text.fontColor('#F59E0B');
                        Text.fontWeight(FontWeight.Medium);
                    }, Text);
                    Text.pop();
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.formatTime(this.secondsLeft));
            Text.fontSize(64);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(this.isBreak ? '#F59E0B' : Constants.COLOR_TEXT);
            Text.margin({ top: 12 });
            Text.fontFamily('Courier New');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.isActive) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('学习中... 保持专注');
                        Text.fontSize(12);
                        Text.fontColor(Constants.COLOR_ACCENT_GREEN);
                        Text.margin({ top: 4 });
                    }, Text);
                    Text.pop();
                });
            }
            else if (this.secondsLeft > 0) {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('点击开始专注');
                        Text.fontSize(12);
                        Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
                        Text.margin({ top: 4 });
                    }, Text);
                    Text.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(2, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.justifyContent(FlexAlign.Center);
            Row.margin({ top: 20 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (!this.isActive) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithChild();
                        Button.width(120);
                        Button.height(48);
                        Button.backgroundColor(Constants.COLOR_ACCENT_GREEN);
                        Button.borderRadius(24);
                        Button.onClick(() => {
                            this.startTimer();
                        });
                    }, Button);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('▶ 开始');
                        Text.fontSize(16);
                        Text.fontColor('#FFFFFF');
                    }, Text);
                    Text.pop();
                    Button.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithChild();
                        Button.width(120);
                        Button.height(48);
                        Button.backgroundColor(Constants.COLOR_ACCENT_ORANGE);
                        Button.borderRadius(24);
                        Button.onClick(() => {
                            this.pauseTimer();
                        });
                    }, Button);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('⏸ 暂停');
                        Text.fontSize(16);
                        Text.fontColor('#FFFFFF');
                    }, Text);
                    Text.pop();
                    Button.pop();
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithChild();
            Button.width(100);
            Button.height(48);
            Button.backgroundColor('#FFFFFF');
            Button.borderRadius(24);
            Button.margin({ left: 12 });
            Button.shadow({ radius: 2, offsetY: 1, color: 0x0A000000 });
            Button.onClick(() => {
                this.stopTimer();
                this.resetTimer();
            });
        }, Button);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('↺ 重置');
            Text.fontSize(16);
            Text.fontColor(Constants.COLOR_TEXT);
        }, Text);
        Text.pop();
        Button.pop();
        Row.pop();
        Column.pop();
    }
    buildPresetSelector(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.margin({ top: 16 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('专注时长');
            Text.fontSize(12);
            Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
            Text.width('100%');
            Text.margin({ bottom: 8 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.justifyContent(FlexAlign.SpaceBetween);
        }, Row);
        this.buildPresetButton.bind(this)(15);
        this.buildPresetButton.bind(this)(25);
        this.buildPresetButton.bind(this)(30);
        this.buildPresetButton.bind(this)(45);
        this.buildPresetButton.bind(this)(60);
        Row.pop();
        Column.pop();
    }
    buildPresetButton(minutes: number, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.padding({ top: 10, bottom: 10, left: 16, right: 16 });
            Column.backgroundColor(this.selectedMinutes === minutes ? Constants.COLOR_PRIMARY : Constants.COLOR_CARD);
            Column.borderRadius(12);
            Column.onClick(() => {
                if (!this.isActive) {
                    this.selectedMinutes = minutes;
                    this.focusMinutes = minutes;
                    this.resetTimer();
                }
            });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(minutes.toString());
            Text.fontSize(18);
            Text.fontWeight(this.selectedMinutes === minutes ? FontWeight.Bold : FontWeight.Normal);
            Text.fontColor(this.selectedMinutes === minutes ? '#FFFFFF' : Constants.COLOR_TEXT);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('分钟');
            Text.fontSize(10);
            Text.fontColor(this.selectedMinutes === minutes ? 'rgba(255,255,255,0.7)' : Constants.COLOR_TEXT_SECONDARY);
        }, Text);
        Text.pop();
        Column.pop();
    }
    buildSessionStats(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.padding(16);
            Row.backgroundColor(Constants.COLOR_CARD);
            Row.borderRadius(16);
            Row.margin({ top: 16 });
            Row.shadow({ radius: 4, offsetY: 2, color: 0x0C000000 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.layoutWeight(1);
            Column.alignItems(HorizontalAlign.Center);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('已完成');
            Text.fontSize(12);
            Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.sessionCount.toString());
            Text.fontSize(28);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(Constants.COLOR_TEXT);
            Text.margin({ top: 4 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('个专注时段');
            Text.fontSize(11);
            Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.layoutWeight(1);
            Column.alignItems(HorizontalAlign.Center);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('本周专注');
            Text.fontSize(12);
            Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.getWeekFocusMinutes().toString());
            Text.fontSize(28);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(Constants.COLOR_PRIMARY);
            Text.margin({ top: 4 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('分钟');
            Text.fontSize(11);
            Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
        }, Text);
        Text.pop();
        Column.pop();
        Row.pop();
    }
    buildTodaySummary(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.padding(16);
            Column.backgroundColor(Constants.COLOR_CARD);
            Column.borderRadius(16);
            Column.margin({ top: 12, bottom: 20 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('📋 今日学习概览');
            Text.fontSize(14);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(Constants.COLOR_TEXT);
            Text.width('100%');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.margin({ top: 8 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('今日专注');
            Text.fontSize(12);
            Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.todayFocus + ' 分钟');
            Text.fontSize(14);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(Constants.COLOR_PRIMARY);
        }, Text);
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.margin({ top: 4 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('连续学习');
            Text.fontSize(12);
            Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(globalData.getStreak() + ' 天');
            Text.fontSize(14);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(Constants.COLOR_ACCENT_ORANGE);
        }, Text);
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('番茄工作法：专注25分钟 + 休息5分钟，每4个循环后长休息15-30分钟');
            Text.fontSize(11);
            Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
            Text.margin({ top: 12 });
            Text.lineHeight(16);
        }, Text);
        Text.pop();
        Column.pop();
    }
    startTimer(): void {
        this.isActive = true;
        this.timerId = setInterval(() => {
            if (this.secondsLeft <= 1) {
                this.completeTimer();
            }
            else {
                this.secondsLeft--;
            }
        }, 1000);
    }
    pauseTimer(): void {
        this.isActive = false;
        if (this.timerId > 0) {
            clearInterval(this.timerId);
            this.timerId = -1;
        }
    }
    stopTimer(): void {
        this.isActive = false;
        if (this.timerId > 0) {
            clearInterval(this.timerId);
            this.timerId = -1;
        }
    }
    completeTimer(): void {
        this.stopTimer();
        if (!this.isBreak) {
            this.sessionCount++;
            const now = new Date();
            const dateStr = now.getFullYear() + '-' +
                String(now.getMonth() + 1).padStart(2, '0') + '-' +
                String(now.getDate()).padStart(2, '0');
            const lastCourse = globalData.getLastActiveCourse();
            globalData.addStudySession(dateStr, this.focusMinutes, lastCourse ? lastCourse.id : '');
            StorageUtil.saveData();
            this.todayFocus = globalData.getTodayFocusMinutes();
            AlertDialog.show({
                title: '🎉 专注完成！',
                message: '已完成 ' + this.focusMinutes + ' 分钟专注学习\n休息一下吧～',
                confirm: { value: '开始休息', action: () => {
                        this.isBreak = true;
                        this.secondsLeft = this.breakMinutes * 60;
                        this.startTimer();
                    } }
            });
        }
        else {
            AlertDialog.show({
                title: '☕ 休息结束',
                message: '休息好了吗？准备开始下一轮专注！',
                confirm: { value: '开始专注', action: () => {
                        this.isBreak = false;
                        this.resetTimer();
                    } }
            });
        }
    }
    resetTimer(): void {
        this.isBreak = false;
        this.secondsLeft = this.selectedMinutes * 60;
    }
    formatTime(seconds: number): string {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
    }
    getWeekFocusMinutes(): number {
        const sessions = globalData.getStudySessions();
        const now = new Date();
        const weekAgo = now.getTime() - 7 * 24 * 60 * 60 * 1000;
        let total = 0;
        for (let i = 0; i < sessions.length; i++) {
            const parts = sessions[i].date.split('-');
            const sessionTime = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2])).getTime();
            if (sessionTime >= weekAgo) {
                total += sessions[i].minutes;
            }
        }
        return total;
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "StudyTimer";
    }
}
registerNamedRoute(() => new StudyTimer(undefined, {}), "", { bundleName: "com.threeq.learner", moduleName: "entry", pagePath: "pages/StudyTimer", pageFullPath: "entry/src/main/ets/pages/StudyTimer", integratedHsp: "false", moduleType: "followWithHap" });
