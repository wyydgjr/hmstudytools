if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface CourseCard_Params {
    course?: Course;
    progressValue?: number;
    onCardClick?: () => void;
}
import { Course } from "@normalized:N&&&entry/src/main/ets/model/CourseModel&";
import { Constants } from "@normalized:N&&&entry/src/main/ets/utils/Constants&";
export class CourseCard extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__course = new SynchedPropertyObjectOneWayPU(params.course, this, "course");
        this.__progressValue = new ObservedPropertySimplePU(0, this, "progressValue");
        this.onCardClick = () => { };
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: CourseCard_Params) {
        if (params.course === undefined) {
            this.__course.set(new Course());
        }
        if (params.progressValue !== undefined) {
            this.progressValue = params.progressValue;
        }
        if (params.onCardClick !== undefined) {
            this.onCardClick = params.onCardClick;
        }
    }
    updateStateVars(params: CourseCard_Params) {
        this.__course.reset(params.course);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__course.purgeDependencyOnElmtId(rmElmtId);
        this.__progressValue.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__course.aboutToBeDeleted();
        this.__progressValue.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __course: SynchedPropertySimpleOneWayPU<Course>;
    get course() {
        return this.__course.get();
    }
    set course(newValue: Course) {
        this.__course.set(newValue);
    }
    private __progressValue: ObservedPropertySimplePU<number>;
    get progressValue() {
        return this.__progressValue.get();
    }
    set progressValue(newValue: number) {
        this.__progressValue.set(newValue);
    }
    private onCardClick: () => void;
    aboutToAppear(): void {
        this.progressValue = this.course.progress;
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.padding(16);
            Column.backgroundColor(Constants.COLOR_CARD);
            Column.borderRadius(16);
            Column.shadow({
                radius: this.course.progress >= 100 ? 10 : 6,
                offsetX: 0,
                offsetY: this.course.progress >= 100 ? 3 : 2,
                color: this.course.progress >= 100 ? 0x2210B981 : 0x12000000
            });
            Column.onClick(() => {
                this.course.lastAccessedAt = Date.now();
                this.onCardClick();
            });
            Column.transition(TransitionEffect.translate({ x: 40, y: 0 })
                .combine(TransitionEffect.opacity(0)));
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create();
            Stack.width(48);
            Stack.height(48);
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Circle.create();
            Circle.width(48);
            Circle.height(48);
            Circle.fill(this.getIconBgColor());
        }, Circle);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.course.title.charAt(0));
            Text.fontSize(20);
            Text.fontColor('#FFFFFF');
            Text.fontWeight(FontWeight.Bold);
        }, Text);
        Text.pop();
        Stack.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.layoutWeight(1);
            Column.margin({ left: 12 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.course.title);
            Text.fontSize(16);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(Constants.COLOR_TEXT);
            Text.maxLines(1);
            Text.textOverflow({ overflow: TextOverflow.Ellipsis });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        this.buildStatusBadge.bind(this)();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.course.description);
            Text.fontSize(12);
            Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
            Text.maxLines(1);
            Text.textOverflow({ overflow: TextOverflow.Ellipsis });
            Text.margin({ top: 2 });
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`${this.progressValue}%`);
            Text.fontSize(14);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(this.course.progress >= 100 ? Constants.COLOR_ACCENT_GREEN : Constants.COLOR_PRIMARY);
        }, Text);
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Progress.create({ value: this.progressValue, total: 100, type: ProgressType.Linear });
            Progress.width('100%');
            Progress.height(4);
            Progress.value(this.progressValue);
            Progress.color(this.course.progress >= 100 ? Constants.COLOR_ACCENT_GREEN : Constants.COLOR_PRIMARY);
            Progress.backgroundColor(Constants.COLOR_DIVIDER);
            Progress.borderRadius(2);
            Progress.margin({ top: 10 });
        }, Progress);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.margin({ top: 8 });
        }, Row);
        this.getStepDot.bind(this)('Q1', '心智模型', this.course.q1Completed);
        this.getStepDot.bind(this)('Q2', '学术分歧', this.course.q2Completed);
        this.getStepDot.bind(this)('Q3', '深度测评', this.course.q3Completed);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 16777238, "type": 20000, params: [], "bundleName": "com.threeq.learner", "moduleName": "entry" });
            Image.width(16);
            Image.height(16);
            Image.opacity(0.4);
        }, Image);
        Row.pop();
        Column.pop();
    }
    buildStatusBadge(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.course.status === 'completed') {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('已完成');
                        Text.fontSize(10);
                        Text.fontColor(Constants.COLOR_ACCENT_GREEN);
                        Text.backgroundColor(0x1510B981);
                        Text.padding({ left: 8, right: 8, top: 3, bottom: 3 });
                        Text.borderRadius(10);
                    }, Text);
                    Text.pop();
                });
            }
            else if (this.course.progress > 0) {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('学习中');
                        Text.fontSize(10);
                        Text.fontColor(Constants.COLOR_PRIMARY);
                        Text.backgroundColor(0x150078D7);
                        Text.padding({ left: 8, right: 8, top: 3, bottom: 3 });
                        Text.borderRadius(10);
                    }, Text);
                    Text.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(2, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('待开始');
                        Text.fontSize(10);
                        Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
                        Text.backgroundColor(0x0F6B7280);
                        Text.padding({ left: 8, right: 8, top: 3, bottom: 3 });
                        Text.borderRadius(10);
                    }, Text);
                    Text.pop();
                });
            }
        }, If);
        If.pop();
    }
    getStepDot(q: string, label: string, completed: boolean, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width(18);
            Row.height(18);
            Row.margin({ right: 4 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Circle.create();
            Circle.width(18);
            Circle.height(18);
            Circle.fill(completed ? Constants.COLOR_ACCENT_GREEN : Constants.COLOR_DIVIDER);
        }, Circle);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(q);
            Text.fontSize(9);
            Text.fontColor('#FFFFFF');
            Text.fontWeight(FontWeight.Bold);
        }, Text);
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(label);
            Text.fontSize(11);
            Text.fontColor(completed ? Constants.COLOR_ACCENT_GREEN : Constants.COLOR_TEXT_SECONDARY);
            Text.margin({ right: 8 });
        }, Text);
        Text.pop();
    }
    getIconBgColor(): ResourceColor {
        if (this.course.status === 'completed')
            return Constants.COLOR_ACCENT_GREEN;
        if (this.course.progress > 0)
            return Constants.COLOR_PRIMARY;
        return Constants.COLOR_PRIMARY_LIGHT;
    }
    getStatusColor(): ResourceColor {
        if (this.course.status === 'completed')
            return Constants.COLOR_ACCENT_GREEN;
        if (this.course.progress > 0)
            return Constants.COLOR_PRIMARY;
        return Constants.COLOR_PRIMARY_LIGHT;
    }
    rerender() {
        this.updateDirtyElements();
    }
}
