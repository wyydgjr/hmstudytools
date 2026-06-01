if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface ThreeQuestions_Params {
    courseId?: string;
    courseTitle?: string;
    initialTab?: number;
    currentTab?: number;
    course?: Course | null;
    questions?: Question[];
    currentQIndex?: number;
    selectedOption?: string;
    showResult?: boolean;
    answerCorrect?: boolean;
    answeredCount?: number;
    aiEnabled?: boolean;
    isAILoading?: boolean;
    aiKnowledgeNodes?: AIKnowledgeNode[];
    aiKGLoading?: boolean;
    expandedNodeIds?: string[];
    aiDisagreements?: AIDisagreement[];
    aiDisLoading?: boolean;
    aiQuizQuestions?: AIQuestion[];
    aiQuizLoading?: boolean;
    quizAISource?: boolean;
    dueReviewCount?: number;
    showReviewSection?: boolean;
    reviewItems?: ReviewItem[];
    reviewIndex?: number;
    showReviewDetail?: boolean;
}
import router from "@ohos:router";
import type { Course, Disagreement } from '../model/CourseModel';
import { Question, QuestionOption, BloomLevel, QuestionBank } from "@normalized:N&&&entry/src/main/ets/model/QuestionModel&";
import { globalData } from "@normalized:N&&&entry/src/main/ets/model/LearningData&";
import type { ReviewItem } from "@normalized:N&&&entry/src/main/ets/model/LearningData&";
import { Constants } from "@normalized:N&&&entry/src/main/ets/utils/Constants&";
import { KnowledgeGraph } from "@normalized:N&&&entry/src/main/ets/components/KnowledgeGraph&";
import { aiService } from "@normalized:N&&&entry/src/main/ets/model/AIService&";
import type { AIKnowledgeNode, AIDisagreement, AIQuestion } from "@normalized:N&&&entry/src/main/ets/model/AIService&";
import { StorageUtil } from "@normalized:N&&&entry/src/main/ets/utils/StorageUtil&";
class ThreeQuestions extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__courseId = new ObservedPropertySimplePU('', this, "courseId");
        this.__courseTitle = new ObservedPropertySimplePU('', this, "courseTitle");
        this.__initialTab = new ObservedPropertySimplePU(0, this, "initialTab");
        this.__currentTab = new ObservedPropertySimplePU(0, this, "currentTab");
        this.__course = new ObservedPropertyObjectPU(null, this, "course");
        this.__questions = new ObservedPropertyObjectPU([], this, "questions");
        this.__currentQIndex = new ObservedPropertySimplePU(0, this, "currentQIndex");
        this.__selectedOption = new ObservedPropertySimplePU('', this, "selectedOption");
        this.__showResult = new ObservedPropertySimplePU(false, this, "showResult");
        this.__answerCorrect = new ObservedPropertySimplePU(false, this, "answerCorrect");
        this.__answeredCount = new ObservedPropertySimplePU(0, this, "answeredCount");
        this.__aiEnabled = new ObservedPropertySimplePU(false, this, "aiEnabled");
        this.__isAILoading = new ObservedPropertySimplePU(false, this, "isAILoading");
        this.__aiKnowledgeNodes = new ObservedPropertyObjectPU([], this, "aiKnowledgeNodes");
        this.__aiKGLoading = new ObservedPropertySimplePU(false, this, "aiKGLoading");
        this.__expandedNodeIds = new ObservedPropertyObjectPU([], this, "expandedNodeIds");
        this.__aiDisagreements = new ObservedPropertyObjectPU([], this, "aiDisagreements");
        this.__aiDisLoading = new ObservedPropertySimplePU(false, this, "aiDisLoading");
        this.__aiQuizQuestions = new ObservedPropertyObjectPU([], this, "aiQuizQuestions");
        this.__aiQuizLoading = new ObservedPropertySimplePU(false, this, "aiQuizLoading");
        this.__quizAISource = new ObservedPropertySimplePU(false, this, "quizAISource");
        this.__dueReviewCount = new ObservedPropertySimplePU(0, this, "dueReviewCount");
        this.__showReviewSection = new ObservedPropertySimplePU(false, this, "showReviewSection");
        this.__reviewItems = new ObservedPropertyObjectPU([], this, "reviewItems");
        this.__reviewIndex = new ObservedPropertySimplePU(0, this, "reviewIndex");
        this.__showReviewDetail = new ObservedPropertySimplePU(false, this, "showReviewDetail");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: ThreeQuestions_Params) {
        if (params.courseId !== undefined) {
            this.courseId = params.courseId;
        }
        if (params.courseTitle !== undefined) {
            this.courseTitle = params.courseTitle;
        }
        if (params.initialTab !== undefined) {
            this.initialTab = params.initialTab;
        }
        if (params.currentTab !== undefined) {
            this.currentTab = params.currentTab;
        }
        if (params.course !== undefined) {
            this.course = params.course;
        }
        if (params.questions !== undefined) {
            this.questions = params.questions;
        }
        if (params.currentQIndex !== undefined) {
            this.currentQIndex = params.currentQIndex;
        }
        if (params.selectedOption !== undefined) {
            this.selectedOption = params.selectedOption;
        }
        if (params.showResult !== undefined) {
            this.showResult = params.showResult;
        }
        if (params.answerCorrect !== undefined) {
            this.answerCorrect = params.answerCorrect;
        }
        if (params.answeredCount !== undefined) {
            this.answeredCount = params.answeredCount;
        }
        if (params.aiEnabled !== undefined) {
            this.aiEnabled = params.aiEnabled;
        }
        if (params.isAILoading !== undefined) {
            this.isAILoading = params.isAILoading;
        }
        if (params.aiKnowledgeNodes !== undefined) {
            this.aiKnowledgeNodes = params.aiKnowledgeNodes;
        }
        if (params.aiKGLoading !== undefined) {
            this.aiKGLoading = params.aiKGLoading;
        }
        if (params.expandedNodeIds !== undefined) {
            this.expandedNodeIds = params.expandedNodeIds;
        }
        if (params.aiDisagreements !== undefined) {
            this.aiDisagreements = params.aiDisagreements;
        }
        if (params.aiDisLoading !== undefined) {
            this.aiDisLoading = params.aiDisLoading;
        }
        if (params.aiQuizQuestions !== undefined) {
            this.aiQuizQuestions = params.aiQuizQuestions;
        }
        if (params.aiQuizLoading !== undefined) {
            this.aiQuizLoading = params.aiQuizLoading;
        }
        if (params.quizAISource !== undefined) {
            this.quizAISource = params.quizAISource;
        }
        if (params.dueReviewCount !== undefined) {
            this.dueReviewCount = params.dueReviewCount;
        }
        if (params.showReviewSection !== undefined) {
            this.showReviewSection = params.showReviewSection;
        }
        if (params.reviewItems !== undefined) {
            this.reviewItems = params.reviewItems;
        }
        if (params.reviewIndex !== undefined) {
            this.reviewIndex = params.reviewIndex;
        }
        if (params.showReviewDetail !== undefined) {
            this.showReviewDetail = params.showReviewDetail;
        }
    }
    updateStateVars(params: ThreeQuestions_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__courseId.purgeDependencyOnElmtId(rmElmtId);
        this.__courseTitle.purgeDependencyOnElmtId(rmElmtId);
        this.__initialTab.purgeDependencyOnElmtId(rmElmtId);
        this.__currentTab.purgeDependencyOnElmtId(rmElmtId);
        this.__course.purgeDependencyOnElmtId(rmElmtId);
        this.__questions.purgeDependencyOnElmtId(rmElmtId);
        this.__currentQIndex.purgeDependencyOnElmtId(rmElmtId);
        this.__selectedOption.purgeDependencyOnElmtId(rmElmtId);
        this.__showResult.purgeDependencyOnElmtId(rmElmtId);
        this.__answerCorrect.purgeDependencyOnElmtId(rmElmtId);
        this.__answeredCount.purgeDependencyOnElmtId(rmElmtId);
        this.__aiEnabled.purgeDependencyOnElmtId(rmElmtId);
        this.__isAILoading.purgeDependencyOnElmtId(rmElmtId);
        this.__aiKnowledgeNodes.purgeDependencyOnElmtId(rmElmtId);
        this.__aiKGLoading.purgeDependencyOnElmtId(rmElmtId);
        this.__expandedNodeIds.purgeDependencyOnElmtId(rmElmtId);
        this.__aiDisagreements.purgeDependencyOnElmtId(rmElmtId);
        this.__aiDisLoading.purgeDependencyOnElmtId(rmElmtId);
        this.__aiQuizQuestions.purgeDependencyOnElmtId(rmElmtId);
        this.__aiQuizLoading.purgeDependencyOnElmtId(rmElmtId);
        this.__quizAISource.purgeDependencyOnElmtId(rmElmtId);
        this.__dueReviewCount.purgeDependencyOnElmtId(rmElmtId);
        this.__showReviewSection.purgeDependencyOnElmtId(rmElmtId);
        this.__reviewItems.purgeDependencyOnElmtId(rmElmtId);
        this.__reviewIndex.purgeDependencyOnElmtId(rmElmtId);
        this.__showReviewDetail.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__courseId.aboutToBeDeleted();
        this.__courseTitle.aboutToBeDeleted();
        this.__initialTab.aboutToBeDeleted();
        this.__currentTab.aboutToBeDeleted();
        this.__course.aboutToBeDeleted();
        this.__questions.aboutToBeDeleted();
        this.__currentQIndex.aboutToBeDeleted();
        this.__selectedOption.aboutToBeDeleted();
        this.__showResult.aboutToBeDeleted();
        this.__answerCorrect.aboutToBeDeleted();
        this.__answeredCount.aboutToBeDeleted();
        this.__aiEnabled.aboutToBeDeleted();
        this.__isAILoading.aboutToBeDeleted();
        this.__aiKnowledgeNodes.aboutToBeDeleted();
        this.__aiKGLoading.aboutToBeDeleted();
        this.__expandedNodeIds.aboutToBeDeleted();
        this.__aiDisagreements.aboutToBeDeleted();
        this.__aiDisLoading.aboutToBeDeleted();
        this.__aiQuizQuestions.aboutToBeDeleted();
        this.__aiQuizLoading.aboutToBeDeleted();
        this.__quizAISource.aboutToBeDeleted();
        this.__dueReviewCount.aboutToBeDeleted();
        this.__showReviewSection.aboutToBeDeleted();
        this.__reviewItems.aboutToBeDeleted();
        this.__reviewIndex.aboutToBeDeleted();
        this.__showReviewDetail.aboutToBeDeleted();
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
    private __courseTitle: ObservedPropertySimplePU<string>;
    get courseTitle() {
        return this.__courseTitle.get();
    }
    set courseTitle(newValue: string) {
        this.__courseTitle.set(newValue);
    }
    private __initialTab: ObservedPropertySimplePU<number>;
    get initialTab() {
        return this.__initialTab.get();
    }
    set initialTab(newValue: number) {
        this.__initialTab.set(newValue);
    }
    private __currentTab: ObservedPropertySimplePU<number>;
    get currentTab() {
        return this.__currentTab.get();
    }
    set currentTab(newValue: number) {
        this.__currentTab.set(newValue);
    }
    private __course: ObservedPropertyObjectPU<Course | null>;
    get course() {
        return this.__course.get();
    }
    set course(newValue: Course | null) {
        this.__course.set(newValue);
    }
    private __questions: ObservedPropertyObjectPU<Question[]>;
    get questions() {
        return this.__questions.get();
    }
    set questions(newValue: Question[]) {
        this.__questions.set(newValue);
    }
    private __currentQIndex: ObservedPropertySimplePU<number>;
    get currentQIndex() {
        return this.__currentQIndex.get();
    }
    set currentQIndex(newValue: number) {
        this.__currentQIndex.set(newValue);
    }
    private __selectedOption: ObservedPropertySimplePU<string>;
    get selectedOption() {
        return this.__selectedOption.get();
    }
    set selectedOption(newValue: string) {
        this.__selectedOption.set(newValue);
    }
    private __showResult: ObservedPropertySimplePU<boolean>;
    get showResult() {
        return this.__showResult.get();
    }
    set showResult(newValue: boolean) {
        this.__showResult.set(newValue);
    }
    private __answerCorrect: ObservedPropertySimplePU<boolean>;
    get answerCorrect() {
        return this.__answerCorrect.get();
    }
    set answerCorrect(newValue: boolean) {
        this.__answerCorrect.set(newValue);
    }
    private __answeredCount: ObservedPropertySimplePU<number>;
    get answeredCount() {
        return this.__answeredCount.get();
    }
    set answeredCount(newValue: number) {
        this.__answeredCount.set(newValue);
    }
    private __aiEnabled: ObservedPropertySimplePU<boolean>;
    get aiEnabled() {
        return this.__aiEnabled.get();
    }
    set aiEnabled(newValue: boolean) {
        this.__aiEnabled.set(newValue);
    }
    private __isAILoading: ObservedPropertySimplePU<boolean>;
    get isAILoading() {
        return this.__isAILoading.get();
    }
    set isAILoading(newValue: boolean) {
        this.__isAILoading.set(newValue);
    }
    private __aiKnowledgeNodes: ObservedPropertyObjectPU<AIKnowledgeNode[]>;
    get aiKnowledgeNodes() {
        return this.__aiKnowledgeNodes.get();
    }
    set aiKnowledgeNodes(newValue: AIKnowledgeNode[]) {
        this.__aiKnowledgeNodes.set(newValue);
    }
    private __aiKGLoading: ObservedPropertySimplePU<boolean>;
    get aiKGLoading() {
        return this.__aiKGLoading.get();
    }
    set aiKGLoading(newValue: boolean) {
        this.__aiKGLoading.set(newValue);
    }
    private __expandedNodeIds: ObservedPropertyObjectPU<string[]>;
    get expandedNodeIds() {
        return this.__expandedNodeIds.get();
    }
    set expandedNodeIds(newValue: string[]) {
        this.__expandedNodeIds.set(newValue);
    }
    private __aiDisagreements: ObservedPropertyObjectPU<AIDisagreement[]>;
    get aiDisagreements() {
        return this.__aiDisagreements.get();
    }
    set aiDisagreements(newValue: AIDisagreement[]) {
        this.__aiDisagreements.set(newValue);
    }
    private __aiDisLoading: ObservedPropertySimplePU<boolean>;
    get aiDisLoading() {
        return this.__aiDisLoading.get();
    }
    set aiDisLoading(newValue: boolean) {
        this.__aiDisLoading.set(newValue);
    }
    private __aiQuizQuestions: ObservedPropertyObjectPU<AIQuestion[]>;
    get aiQuizQuestions() {
        return this.__aiQuizQuestions.get();
    }
    set aiQuizQuestions(newValue: AIQuestion[]) {
        this.__aiQuizQuestions.set(newValue);
    }
    private __aiQuizLoading: ObservedPropertySimplePU<boolean>;
    get aiQuizLoading() {
        return this.__aiQuizLoading.get();
    }
    set aiQuizLoading(newValue: boolean) {
        this.__aiQuizLoading.set(newValue);
    }
    private __quizAISource: ObservedPropertySimplePU<boolean>;
    get quizAISource() {
        return this.__quizAISource.get();
    }
    set quizAISource(newValue: boolean) {
        this.__quizAISource.set(newValue);
    }
    private __dueReviewCount: ObservedPropertySimplePU<number>;
    get dueReviewCount() {
        return this.__dueReviewCount.get();
    }
    set dueReviewCount(newValue: number) {
        this.__dueReviewCount.set(newValue);
    }
    private __showReviewSection: ObservedPropertySimplePU<boolean>;
    get showReviewSection() {
        return this.__showReviewSection.get();
    }
    set showReviewSection(newValue: boolean) {
        this.__showReviewSection.set(newValue);
    }
    private __reviewItems: ObservedPropertyObjectPU<ReviewItem[]>;
    get reviewItems() {
        return this.__reviewItems.get();
    }
    set reviewItems(newValue: ReviewItem[]) {
        this.__reviewItems.set(newValue);
    }
    private __reviewIndex: ObservedPropertySimplePU<number>;
    get reviewIndex() {
        return this.__reviewIndex.get();
    }
    set reviewIndex(newValue: number) {
        this.__reviewIndex.set(newValue);
    }
    private __showReviewDetail: ObservedPropertySimplePU<boolean>;
    get showReviewDetail() {
        return this.__showReviewDetail.get();
    }
    set showReviewDetail(newValue: boolean) {
        this.__showReviewDetail.set(newValue);
    }
    getCurrentQuestion(): Question {
        return this.questions[this.currentQIndex];
    }
    getCorrectOption(): QuestionOption | undefined {
        const q = this.getCurrentQuestion();
        return q?.options.find(o => o.isCorrect);
    }
    getLevelColor(index: number): ResourceColor {
        const colors: ResourceColor[] = [
            Constants.COLOR_PRIMARY, Constants.COLOR_PRIMARY_LIGHT,
            Constants.COLOR_ACCENT_GREEN, Constants.COLOR_ACCENT_ORANGE,
            Constants.COLOR_ACCENT_PURPLE, Constants.COLOR_ACCENT_RED
        ];
        return colors[index % colors.length];
    }
    getNodeLevelColor(level: number): ResourceColor {
        const colors: ResourceColor[] = [
            Constants.COLOR_PRIMARY,
            Constants.COLOR_PRIMARY_LIGHT,
            Constants.COLOR_ACCENT_GREEN,
            Constants.COLOR_ACCENT_PURPLE,
            Constants.COLOR_ACCENT_ORANGE,
            Constants.COLOR_ACCENT_RED
        ];
        return colors[Math.min(level, colors.length - 1)];
    }
    aboutToAppear(): void {
        const params = router.getParams() as Record<string, Object>;
        if (params) {
            this.courseId = params['courseId'] as string || '';
            this.courseTitle = params['courseTitle'] as string || '';
            this.initialTab = (params['questionIndex'] as number) || 0;
        }
        this.currentTab = this.initialTab;
        this.course = globalData.getCourse(this.courseId) || null;
        aiService.loadConfig();
        this.aiEnabled = aiService.isConfigured();
        this.questions = QuestionBank.generateQuestions(this.courseId, this.courseTitle);
        this.dueReviewCount = globalData.getDueReviewCount();
        this.reviewItems = globalData.getDueReviews();
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor(Constants.COLOR_BACKGROUND);
        }, Column);
        this.buildTopBar.bind(this)();
        this.buildTabBar.bind(this)();
        this.buildProgressBar.bind(this)();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.course) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Scroll.create();
                        Scroll.layoutWeight(1);
                    }, Scroll);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                        Column.padding({ left: 20, right: 20, bottom: 20 });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        if (this.currentTab === 0) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.buildMentalModel.bind(this)();
                            });
                        }
                        else if (this.currentTab === 1) {
                            this.ifElseBranchUpdateFunction(1, () => {
                                this.buildDisagreements.bind(this)();
                            });
                        }
                        else {
                            this.ifElseBranchUpdateFunction(2, () => {
                                this.buildAssessment.bind(this)();
                            });
                        }
                    }, If);
                    If.pop();
                    this.buildReviewSection.bind(this)();
                    Column.pop();
                    Scroll.pop();
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
    buildProgressBar(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.course) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.width('100%');
                        Row.padding({ left: 24, right: 24, top: 12, bottom: 4 });
                    }, Row);
                    this.buildProgressStep.bind(this)('Q1', this.course.q1Completed, Constants.COLOR_PRIMARY);
                    this.buildProgressConnector.bind(this)(this.course.q1Completed);
                    this.buildProgressStep.bind(this)('Q2', this.course.q2Completed, Constants.COLOR_ACCENT_PURPLE);
                    this.buildProgressConnector.bind(this)(this.course.q2Completed);
                    this.buildProgressStep.bind(this)('Q3', this.course.q3Completed, Constants.COLOR_ACCENT_GREEN);
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
    buildProgressStep(label: string, completed: boolean, color: ResourceColor, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create();
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Circle.create();
            Circle.width(24);
            Circle.height(24);
            Circle.fill(completed ? color : 0x0F000000);
            Circle.stroke(completed ? color : Constants.COLOR_DIVIDER);
            Circle.strokeWidth(2);
        }, Circle);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(completed ? '✓' : label);
            Text.fontSize(completed ? 12 : 9);
            Text.fontColor(completed ? '#FFFFFF' : Constants.COLOR_TEXT_SECONDARY);
            Text.fontWeight(FontWeight.Bold);
        }, Text);
        Text.pop();
        Stack.pop();
        Column.pop();
    }
    buildProgressConnector(completed: boolean, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.height(2);
            Row.layoutWeight(1);
            Row.backgroundColor(completed ? Constants.COLOR_PRIMARY_LIGHT : Constants.COLOR_DIVIDER);
            Row.margin({ left: 4, right: 4 });
        }, Row);
        Row.pop();
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
            Text.create(this.courseTitle);
            Text.fontSize(17);
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
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create();
            Stack.width(36);
            Stack.height(36);
            Stack.onClick(() => {
                router.pushUrl({
                    url: 'pages/Profile',
                    params: { courseId: this.courseId }
                });
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
    buildTabBar(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.padding(6);
            Row.backgroundColor(Constants.COLOR_CARD);
            Row.margin({ top: 8, left: 16, right: 16 });
            Row.borderRadius(12);
        }, Row);
        this.buildTabItem.bind(this)('Q1 心智模型', 0, Constants.COLOR_PRIMARY);
        this.buildTabItem.bind(this)('Q2 学术分歧', 1, Constants.COLOR_ACCENT_PURPLE);
        this.buildTabItem.bind(this)('Q3 深度测评', 2, Constants.COLOR_ACCENT_GREEN);
        Row.pop();
    }
    buildTabItem(label: string, index: number, color: ResourceColor, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.layoutWeight(1);
            Column.padding({ top: 8, bottom: 8 });
            Column.backgroundColor(this.currentTab === index ? color : 'transparent');
            Column.borderRadius(8);
            Column.onClick(() => { this.currentTab = index; });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(label);
            Text.fontSize(13);
            Text.fontWeight(this.currentTab === index ? FontWeight.Bold : FontWeight.Normal);
            Text.fontColor(this.currentTab === index ? '#FFFFFF' : Constants.COLOR_TEXT_SECONDARY);
        }, Text);
        Text.pop();
        Column.pop();
    }
    buildMentalModel(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(Constants.TITLE_MENTAL_MODEL);
            Text.fontSize(18);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(Constants.COLOR_TEXT);
            Text.width('100%');
            Text.margin({ top: 16 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(Constants.Q1_INFO);
            Text.fontSize(13);
            Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
            Text.width('100%');
            Text.margin({ top: 6 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.course) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        __Common__.create();
                        __Common__.margin({ top: 16 });
                    }, __Common__);
                    {
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            if (isInitialRender) {
                                let componentCall = new KnowledgeGraph(this, { nodes: this.course.knowledgeGraph }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/ThreeQuestions.ets", line: 250, col: 9 });
                                ViewPU.create(componentCall);
                                let paramsLambda = () => {
                                    return {
                                        nodes: this.course.knowledgeGraph
                                    };
                                };
                                componentCall.paramsGenerator_ = paramsLambda;
                            }
                            else {
                                this.updateStateVarsOfChildByElmtId(elmtId, {
                                    nodes: this.course.knowledgeGraph
                                });
                            }
                        }, { name: "KnowledgeGraph" });
                    }
                    __Common__.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.margin({ top: 16 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('AI生成知识图谱');
            Button.height(40);
            Button.backgroundColor(Constants.COLOR_PRIMARY);
            Button.borderRadius(20);
            Button.layoutWeight(1);
            Button.onClick(() => {
                this.generateAIGraph();
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.aiKGLoading) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        LoadingProgress.create();
                        LoadingProgress.width(24);
                        LoadingProgress.height(24);
                        LoadingProgress.color(Constants.COLOR_PRIMARY);
                        LoadingProgress.margin({ left: 12 });
                    }, LoadingProgress);
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
            If.create();
            if (this.aiKnowledgeNodes.length > 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.buildAITreeView.bind(this)();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.padding(12);
            Column.backgroundColor(Constants.COLOR_CARD);
            Column.borderRadius(12);
            Column.margin({ top: 16 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.aiKnowledgeNodes.length > 0 ? 'AI生成知识框架' : '学科框架拆解');
            Text.fontSize(14);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(Constants.COLOR_TEXT);
            Text.width('100%');
            Text.margin({ bottom: 8 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = _item => {
                const item = _item;
                this.buildTreeNode.bind(this)(item);
            };
            this.forEachUpdateFunction(elmtId, this.aiKnowledgeNodes.length > 0 ? this.getFlatNodeList() : this.getStaticNodeList(), forEachItemGenFunction, (item: NodeListItem) => item.id, false, false);
        }, ForEach);
        ForEach.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (!this.course?.q1Completed) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('标记第一问完成');
                        Button.width('100%');
                        Button.height(44);
                        Button.backgroundColor(Constants.COLOR_PRIMARY);
                        Button.borderRadius(22);
                        Button.margin({ top: 20 });
                        Button.onClick(() => {
                            if (this.course) {
                                this.course.q1Completed = true;
                                globalData.updateCourseProgress(this.course.id, 33);
                                AlertDialog.show({
                                    title: '已完成第一问',
                                    message: '心智模型已提取，建议进入第二问深入探索',
                                    confirm: { value: '好的', action: () => { } }
                                });
                            }
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
    }
    buildAITreeView(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.padding(12);
            Column.backgroundColor(0x060078D7);
            Column.borderRadius(12);
            Column.margin({ top: 16 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('AI生成的知识图谱');
            Text.fontSize(14);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(Constants.COLOR_PRIMARY);
            Text.width('100%');
            Text.margin({ bottom: 8 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = _item => {
                const item = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Row.create();
                    Row.width('100%');
                    Row.padding({ top: 6, bottom: 6, left: 8, right: 8 });
                    Row.borderRadius(6);
                    Row.backgroundColor(item.depth === 0 ? 0x060078D7 : 'transparent');
                    Row.onClick(() => {
                        if (item.node.children && item.node.children.length > 0) {
                            this.toggleNode(item.node.id);
                        }
                        else {
                            AlertDialog.show({
                                title: item.node.name,
                                message: item.node.description || '暂无详细描述',
                                confirm: { value: '知道了', action: () => { } }
                            });
                        }
                    });
                }, Row);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Row.create();
                    Row.width(item.depth * 20);
                    Row.height(1);
                }, Row);
                Row.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    If.create();
                    if (item.node.children && item.node.children.length > 0) {
                        this.ifElseBranchUpdateFunction(0, () => {
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create(this.isNodeExpanded(item.node.id) ? '▼' : '▶');
                                Text.fontSize(10);
                                Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
                                Text.margin({ right: 4 });
                            }, Text);
                            Text.pop();
                        });
                    }
                    else {
                        this.ifElseBranchUpdateFunction(1, () => {
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Row.create();
                                Row.width(14);
                                Row.height(1);
                            }, Row);
                            Row.pop();
                        });
                    }
                }, If);
                If.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Circle.create();
                    Circle.width(item.depth === 0 ? 12 : 8);
                    Circle.height(item.depth === 0 ? 12 : 8);
                    Circle.fill(this.getNodeLevelColor(item.node.level));
                    Circle.margin({ right: 8 });
                }, Circle);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(item.node.name);
                    Text.fontSize(item.depth === 0 ? 14 : 13);
                    Text.fontWeight(item.depth === 0 ? FontWeight.Bold : FontWeight.Normal);
                    Text.fontColor(Constants.COLOR_TEXT);
                    Text.layoutWeight(1);
                }, Text);
                Text.pop();
                Row.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    If.create();
                    if (this.isNodeExpanded(item.node.id) && item.node.description) {
                        this.ifElseBranchUpdateFunction(0, () => {
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create(item.node.description);
                                Text.fontSize(12);
                                Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
                                Text.lineHeight(18);
                                Text.padding({ left: item.depth * 20 + 30, bottom: 6, right: 8 });
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
                    If.create();
                    if (this.isNodeExpanded(item.node.id) && item.node.relatedConcepts && item.node.relatedConcepts.length > 0) {
                        this.ifElseBranchUpdateFunction(0, () => {
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Row.create();
                                Row.padding({ left: item.depth * 20 + 30, bottom: 6, right: 8 });
                            }, Row);
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create('关联: ');
                                Text.fontSize(10);
                                Text.fontColor(Constants.COLOR_ACCENT_ORANGE);
                            }, Text);
                            Text.pop();
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                ForEach.create();
                                const forEachItemGenFunction = _item => {
                                    const rc = _item;
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Text.create(rc);
                                        Text.fontSize(10);
                                        Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
                                        Text.padding({ left: 4, right: 4, top: 2, bottom: 2 });
                                        Text.backgroundColor(0x0F000000);
                                        Text.borderRadius(4);
                                        Text.margin({ right: 4 });
                                    }, Text);
                                    Text.pop();
                                };
                                this.forEachUpdateFunction(elmtId, item.node.relatedConcepts, forEachItemGenFunction, (rc: string) => rc, false, false);
                            }, ForEach);
                            ForEach.pop();
                            Row.pop();
                        });
                    }
                    else {
                        this.ifElseBranchUpdateFunction(1, () => {
                        });
                    }
                }, If);
                If.pop();
            };
            this.forEachUpdateFunction(elmtId, this.getVisibleTreeNodes(), forEachItemGenFunction, (item: TreeNodeItem) => item.node.id + '_' + item.depth, false, false);
        }, ForEach);
        ForEach.pop();
        Column.pop();
    }
    buildTreeNode(item: NodeListItem, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.padding({ top: 8, bottom: 8 });
            Row.borderRadius(8);
            Row.onClick(() => {
                if (item.isAIExpandable) {
                    this.toggleNode(item.id);
                }
                else {
                    AlertDialog.show({
                        title: item.name,
                        message: `${item.description}\n\n包含${item.childrenCount}个子知识点`,
                        confirm: { value: '知道了', action: () => { } }
                    });
                }
            });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Circle.create();
            Circle.width(8);
            Circle.height(8);
            Circle.fill(item.color);
            Circle.margin({ right: 8 });
        }, Circle);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(item.name);
            Text.fontSize(13);
            Text.fontColor(Constants.COLOR_TEXT);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (item.hasChildren) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('展开 →');
                        Text.fontSize(11);
                        Text.fontColor(Constants.COLOR_PRIMARY);
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
    }
    buildDisagreements(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(Constants.TITLE_DISAGREEMENT);
            Text.fontSize(18);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(Constants.COLOR_TEXT);
            Text.width('100%');
            Text.margin({ top: 16 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(Constants.Q2_INFO);
            Text.fontSize(13);
            Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
            Text.width('100%');
            Text.margin({ top: 6 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.margin({ top: 12 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('AI挖掘学术分歧');
            Button.height(40);
            Button.backgroundColor(Constants.COLOR_ACCENT_PURPLE);
            Button.borderRadius(20);
            Button.layoutWeight(1);
            Button.onClick(() => {
                this.generateAIDisagreements();
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.aiDisLoading) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        LoadingProgress.create();
                        LoadingProgress.width(24);
                        LoadingProgress.height(24);
                        LoadingProgress.color(Constants.COLOR_ACCENT_PURPLE);
                        LoadingProgress.margin({ left: 12 });
                    }, LoadingProgress);
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
            ForEach.create();
            const forEachItemGenFunction = _item => {
                const dis = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Column.create();
                    Column.width('100%');
                    Column.padding(14);
                    Column.backgroundColor(Constants.COLOR_CARD);
                    Column.borderRadius(16);
                    Column.shadow({ radius: 4, offsetY: 1, color: 0x0A000000 });
                    Column.margin({ top: 16 });
                }, Column);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(dis.topic);
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
                this.buildViewCard.bind(this)('观点 A', dis.viewA, Constants.COLOR_PRIMARY);
                this.buildViewCard.bind(this)('观点 B', dis.viewB, Constants.COLOR_ACCENT_PURPLE);
                Row.pop();
                this.buildEvidenceChain.bind(this)(dis);
                this.buildEnhancedConclusion.bind(this)(dis);
                Column.pop();
            };
            this.forEachUpdateFunction(elmtId, this.aiDisagreements.length > 0 ? this.aiDisagreements :
                (this.course ? this.course.disagreements : []), forEachItemGenFunction, (dis: AIDisagreement | Disagreement) => dis.id, false, false);
        }, ForEach);
        ForEach.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (!this.course?.q2Completed) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('标记第二问完成');
                        Button.width('100%');
                        Button.height(44);
                        Button.backgroundColor(Constants.COLOR_ACCENT_PURPLE);
                        Button.borderRadius(22);
                        Button.margin({ top: 20 });
                        Button.onClick(() => {
                            if (this.course) {
                                this.course.q2Completed = true;
                                globalData.updateCourseProgress(this.course.id, 66);
                                AlertDialog.show({
                                    title: '已完成第二问',
                                    message: '学术分歧已挖掘，建议进入第三问检验学习效果',
                                    confirm: { value: '好的', action: () => { } }
                                });
                            }
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
    }
    buildEvidenceChain(dis: AIDisagreement | Disagreement, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.padding(10);
            Column.backgroundColor(0x0F000000);
            Column.borderRadius(8);
            Column.margin({ top: 8 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('证据链分析');
            Text.fontSize(12);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(Constants.COLOR_TEXT);
            Text.width('100%');
            Text.margin({ bottom: 8 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.layoutWeight(1);
            Column.padding(8);
            Column.backgroundColor(0x0F0078D7);
            Column.borderRadius(8);
            Column.margin({ right: 4 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create();
            Stack.width(20);
            Stack.height(20);
            Stack.margin({ bottom: 4 });
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Circle.create();
            Circle.width(20);
            Circle.height(20);
            Circle.fill(Constants.COLOR_PRIMARY);
        }, Circle);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('A');
            Text.fontSize(10);
            Text.fontColor('#FFFFFF');
            Text.fontWeight(FontWeight.Bold);
        }, Text);
        Text.pop();
        Stack.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(dis.evidenceA);
            Text.fontSize(11);
            Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
            Text.lineHeight(16);
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width(20);
            Column.justifyContent(FlexAlign.Center);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('→');
            Text.fontSize(18);
            Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.layoutWeight(1.2);
            Column.padding(8);
            Column.backgroundColor(0x0F10B981);
            Column.borderRadius(8);
            Column.margin({ left: 4, right: 4 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create();
            Stack.width(24);
            Stack.height(24);
            Stack.margin({ bottom: 4 });
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Circle.create();
            Circle.width(24);
            Circle.height(24);
            Circle.fill(Constants.COLOR_ACCENT_GREEN);
        }, Circle);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('结');
            Text.fontSize(10);
            Text.fontColor('#FFFFFF');
            Text.fontWeight(FontWeight.Bold);
        }, Text);
        Text.pop();
        Stack.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(dis.conclusion);
            Text.fontSize(12);
            Text.fontColor(Constants.COLOR_TEXT);
            Text.lineHeight(17);
            Text.fontWeight(FontWeight.Medium);
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width(20);
            Column.justifyContent(FlexAlign.Center);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('←');
            Text.fontSize(18);
            Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.layoutWeight(1);
            Column.padding(8);
            Column.backgroundColor(0x0F8B5CF6);
            Column.borderRadius(8);
            Column.margin({ left: 4 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create();
            Stack.width(20);
            Stack.height(20);
            Stack.margin({ bottom: 4 });
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Circle.create();
            Circle.width(20);
            Circle.height(20);
            Circle.fill(Constants.COLOR_ACCENT_PURPLE);
        }, Circle);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('B');
            Text.fontSize(10);
            Text.fontColor('#FFFFFF');
            Text.fontWeight(FontWeight.Bold);
        }, Text);
        Text.pop();
        Stack.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(dis.evidenceB);
            Text.fontSize(11);
            Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
            Text.lineHeight(16);
        }, Text);
        Text.pop();
        Column.pop();
        Row.pop();
        Column.pop();
    }
    buildEnhancedConclusion(dis: AIDisagreement | Disagreement, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.padding(12);
            Column.backgroundColor(0x0F10B981);
            Column.borderRadius(8);
            Column.margin({ top: 8 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('💡');
            Text.fontSize(14);
            Text.margin({ right: 6 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('综合结论');
            Text.fontSize(12);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(Constants.COLOR_ACCENT_GREEN);
        }, Text);
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(dis.conclusion);
            Text.fontSize(12);
            Text.fontColor(Constants.COLOR_TEXT);
            Text.lineHeight(18);
            Text.margin({ top: 4 });
        }, Text);
        Text.pop();
        Column.pop();
    }
    buildViewCard(label: string, content: string, color: ResourceColor, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.layoutWeight(1);
            Column.padding(10);
            Column.backgroundColor(0x0F000000);
            Column.borderRadius(8);
            Column.margin({ left: 4, right: 4 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create();
            Stack.width(16);
            Stack.height(16);
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Circle.create();
            Circle.width(16);
            Circle.height(16);
            Circle.fill(color);
        }, Circle);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(label.slice(-1));
            Text.fontSize(9);
            Text.fontColor('#FFFFFF');
        }, Text);
        Text.pop();
        Stack.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(label);
            Text.fontSize(11);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(color);
            Text.margin({ left: 4 });
        }, Text);
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(content);
            Text.fontSize(11);
            Text.fontColor(Constants.COLOR_TEXT);
            Text.lineHeight(16);
            Text.margin({ top: 6 });
        }, Text);
        Text.pop();
        Column.pop();
    }
    buildAssessment(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(Constants.TITLE_ASSESSMENT);
            Text.fontSize(18);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(Constants.COLOR_TEXT);
            Text.width('100%');
            Text.margin({ top: 16 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(Constants.Q3_INFO);
            Text.fontSize(13);
            Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
            Text.width('100%');
            Text.margin({ top: 6 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.margin({ top: 12 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('AI生成测评题');
            Button.height(40);
            Button.backgroundColor(Constants.COLOR_ACCENT_GREEN);
            Button.borderRadius(20);
            Button.layoutWeight(1);
            Button.onClick(() => {
                this.generateAIQuiz();
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.aiQuizLoading) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        LoadingProgress.create();
                        LoadingProgress.width(24);
                        LoadingProgress.height(24);
                        LoadingProgress.color(Constants.COLOR_ACCENT_GREEN);
                        LoadingProgress.margin({ left: 12 });
                    }, LoadingProgress);
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
            If.create();
            if (this.questions.length > 0 && this.currentQIndex < this.questions.length) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        if (this.showResult) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.buildResult.bind(this)();
                            });
                        }
                        else {
                            this.ifElseBranchUpdateFunction(1, () => {
                                this.buildQuestion.bind(this)();
                            });
                        }
                    }, If);
                    If.pop();
                });
            }
            else if (this.answeredCount > 0 && this.currentQIndex >= this.questions.length) {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.buildComplete.bind(this)();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(2, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                        Column.justifyContent(FlexAlign.Center);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('开始测评以检验学习效果');
                        Text.fontSize(14);
                        Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
                        Text.margin({ top: 40 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('开始测评');
                        Button.width(200);
                        Button.height(48);
                        Button.backgroundColor(Constants.COLOR_ACCENT_GREEN);
                        Button.borderRadius(24);
                        Button.margin({ top: 20 });
                        Button.onClick(() => {
                            if (this.aiQuizQuestions.length > 0) {
                                this.questions = this.convertAIQuestionsToQuestions(ObservedObject.GetRawObject(this.aiQuizQuestions), this.courseId);
                                this.quizAISource = true;
                            }
                            else {
                                this.questions = QuestionBank.generateQuestions(this.courseId, this.courseTitle);
                                this.quizAISource = false;
                            }
                            this.currentQIndex = 0;
                            this.answeredCount = 0;
                        });
                    }, Button);
                    Button.pop();
                    Column.pop();
                });
            }
        }, If);
        If.pop();
        Column.pop();
    }
    buildQuestion(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.currentQIndex < this.questions.length) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.width('100%');
                        Row.margin({ top: 16 });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(`第 ${this.currentQIndex + 1}/${this.questions.length} 题`);
                        Text.fontSize(12);
                        Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Blank.create();
                    }, Blank);
                    Blank.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        if (this.quizAISource) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create('AI');
                                    Text.fontSize(9);
                                    Text.fontColor('#FFFFFF');
                                    Text.fontWeight(FontWeight.Bold);
                                    Text.padding({ left: 6, right: 6, top: 2, bottom: 2 });
                                    Text.backgroundColor(Constants.COLOR_ACCENT_GREEN);
                                    Text.borderRadius(8);
                                    Text.margin({ right: 6 });
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
                        Row.create();
                        Row.padding({ left: 8, right: 8, top: 2, bottom: 2 });
                        Row.backgroundColor(0x0F000000);
                        Row.borderRadius(10);
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Circle.create();
                        Circle.width(8);
                        Circle.height(8);
                        Circle.fill(this.getLevelColor(this.currentQIndex));
                        Circle.margin({ right: 4 });
                    }, Circle);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.getCurrentQuestion().bloomLevel);
                        Text.fontSize(11);
                        Text.fontWeight(FontWeight.Bold);
                        Text.fontColor(this.getLevelColor(this.currentQIndex));
                    }, Text);
                    Text.pop();
                    Row.pop();
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.getCurrentQuestion().questionText);
                        Text.fontSize(15);
                        Text.fontColor(Constants.COLOR_TEXT);
                        Text.lineHeight(22);
                        Text.margin({ top: 16 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                        Column.margin({ top: 16 });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        ForEach.create();
                        const forEachItemGenFunction = _item => {
                            const opt = _item;
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Row.create();
                                Row.width('100%');
                                Row.padding(12);
                                Row.backgroundColor(this.selectedOption === opt.label ? 0x0F0078D7 : Constants.COLOR_CARD);
                                Row.borderRadius(12);
                                Row.margin({ top: 8 });
                                Row.onClick(() => {
                                    this.selectedOption = opt.label;
                                });
                            }, Row);
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Stack.create();
                                Stack.width(22);
                                Stack.height(22);
                            }, Stack);
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Circle.create();
                                Circle.width(22);
                                Circle.height(22);
                                Circle.stroke(this.selectedOption === opt.label ? Constants.COLOR_PRIMARY : Constants.COLOR_DIVIDER);
                                Circle.strokeWidth(2);
                                Circle.fill(this.selectedOption === opt.label ? Constants.COLOR_PRIMARY : 'transparent');
                            }, Circle);
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create(opt.label);
                                Text.fontSize(11);
                                Text.fontColor(this.selectedOption === opt.label ? '#FFFFFF' : Constants.COLOR_TEXT_SECONDARY);
                            }, Text);
                            Text.pop();
                            Stack.pop();
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create(opt.content);
                                Text.fontSize(13);
                                Text.fontColor(Constants.COLOR_TEXT);
                                Text.margin({ left: 10 });
                                Text.layoutWeight(1);
                                Text.lineHeight(18);
                            }, Text);
                            Text.pop();
                            Row.pop();
                        };
                        this.forEachUpdateFunction(elmtId, this.getCurrentQuestion().options, forEachItemGenFunction, (opt: QuestionOption) => opt.label, false, false);
                    }, ForEach);
                    ForEach.pop();
                    Column.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('提交答案');
                        Button.width('100%');
                        Button.height(44);
                        Button.backgroundColor(Constants.COLOR_PRIMARY);
                        Button.borderRadius(22);
                        Button.margin({ top: 20 });
                        Button.enabled(this.selectedOption.length > 0);
                        Button.onClick(() => {
                            if (!this.selectedOption)
                                return;
                            const q = this.questions[this.currentQIndex];
                            const correct = q.options.find(o => o.isCorrect);
                            this.answerCorrect = correct?.label === this.selectedOption;
                            globalData.submitAnswer(this.courseId, q.id, this.selectedOption, this.answerCorrect);
                            if (!this.answerCorrect) {
                                const correctIdx = q.options.findIndex(o => o.isCorrect);
                                const userIdx = q.options.findIndex(o => o.label === this.selectedOption);
                                const reviewItem: ReviewItem = {
                                    questionId: q.id,
                                    courseId: this.courseId,
                                    questionText: q.questionText,
                                    options: q.options.map(o => o.content),
                                    correctIndex: correctIdx >= 0 ? correctIdx : 0,
                                    userAnswer: userIdx >= 0 ? userIdx : 0,
                                    lastReviewDate: Date.now(),
                                    nextReviewDate: Date.now() + 24 * 60 * 60 * 1000,
                                    interval: 1,
                                    reviewCount: 0
                                } as ReviewItem;
                                globalData.addReviewItem(reviewItem);
                                StorageUtil.saveData();
                                this.dueReviewCount = globalData.getDueReviewCount();
                            }
                            this.showResult = true;
                            this.answeredCount++;
                        });
                    }, Button);
                    Button.pop();
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
    buildResult(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.currentQIndex < this.questions.length) {
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
                        Stack.margin({ top: 30 });
                    }, Stack);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Circle.create();
                        Circle.width(56);
                        Circle.height(56);
                        Circle.fill(this.answerCorrect ? Constants.COLOR_ACCENT_GREEN : Constants.COLOR_ACCENT_RED);
                    }, Circle);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.answerCorrect ? '✓' : '✗');
                        Text.fontSize(28);
                        Text.fontColor('#FFFFFF');
                        Text.fontWeight(FontWeight.Bold);
                    }, Text);
                    Text.pop();
                    Stack.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.answerCorrect ? '回答正确！' : '回答错误');
                        Text.fontSize(18);
                        Text.fontWeight(FontWeight.Bold);
                        Text.fontColor(this.answerCorrect ? Constants.COLOR_ACCENT_GREEN : Constants.COLOR_ACCENT_RED);
                        Text.margin({ top: 12 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(`正确答案：${this.getCorrectOption()?.label}. ${this.getCorrectOption()?.content}`);
                        Text.fontSize(13);
                        Text.fontColor(Constants.COLOR_TEXT);
                        Text.lineHeight(18);
                        Text.margin({ top: 12 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(`解析：${this.getCurrentQuestion().explanation}`);
                        Text.fontSize(12);
                        Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
                        Text.lineHeight(18);
                        Text.margin({ top: 8 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        if (this.quizAISource) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Row.create();
                                    Row.width('100%');
                                    Row.padding({ top: 8, bottom: 4 });
                                    Row.margin({ top: 4 });
                                }, Row);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create('✨ AI智能解析');
                                    Text.fontSize(11);
                                    Text.fontWeight(FontWeight.Bold);
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
                        Button.createWithLabel(this.currentQIndex < this.questions.length - 1 ? '下一题' : '查看报告');
                        Button.width('100%');
                        Button.height(44);
                        Button.backgroundColor(Constants.COLOR_PRIMARY);
                        Button.borderRadius(22);
                        Button.margin({ top: 24 });
                        Button.onClick(() => {
                            this.showResult = false;
                            this.selectedOption = '';
                            this.currentQIndex++;
                            if (this.currentQIndex >= this.questions.length && this.course && !this.course.q3Completed) {
                                this.course.q3Completed = true;
                                this.course.status = 'completed';
                                globalData.updateCourseProgress(this.course.id, 100);
                            }
                        });
                    }, Button);
                    Button.pop();
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
    buildComplete(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create();
            Stack.width(72);
            Stack.height(72);
            Stack.margin({ top: 40 });
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Circle.create();
            Circle.width(72);
            Circle.height(72);
            Circle.fill(Constants.COLOR_ACCENT_GREEN);
        }, Circle);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('🏆');
            Text.fontSize(36);
        }, Text);
        Text.pop();
        Stack.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('测评完成！');
            Text.fontSize(22);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(Constants.COLOR_TEXT);
            Text.margin({ top: 16 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`共完成 ${this.answeredCount}/${this.questions.length} 题`);
            Text.fontSize(14);
            Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
            Text.margin({ top: 8 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.quizAISource) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('本次测评使用AI生成题目');
                        Text.fontSize(12);
                        Text.fontColor(Constants.COLOR_ACCENT_GREEN);
                        Text.margin({ top: 4 });
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
            Button.createWithLabel('查看完整评价报告');
            Button.width('100%');
            Button.height(48);
            Button.backgroundColor(Constants.COLOR_PRIMARY);
            Button.borderRadius(24);
            Button.margin({ top: 30 });
            Button.onClick(() => {
                router.pushUrl({
                    url: 'pages/Profile',
                    params: { courseId: this.courseId }
                });
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('三问学习法全部完成！\n你已经掌握了该课程的核心心智模型、\n理解了学术争议，并通过了深度测评。');
            Text.fontSize(13);
            Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
            Text.textAlign(TextAlign.Center);
            Text.lineHeight(20);
            Text.margin({ top: 16 });
        }, Text);
        Text.pop();
        Column.pop();
    }
    async generateAIGraph(): Promise<void> {
        this.aiKGLoading = true;
        const nodes = await aiService.generateKnowledgeGraph(this.courseTitle);
        this.aiKnowledgeNodes = nodes;
        this.expandedNodeIds = nodes.filter(n => n.level === 0).map(n => n.id);
        this.aiKGLoading = false;
    }
    async generateAIDisagreements(): Promise<void> {
        this.aiDisLoading = true;
        const dis = await aiService.generateDisagreements(this.courseTitle);
        this.aiDisagreements = dis;
        this.aiDisLoading = false;
    }
    async generateAIQuiz(): Promise<void> {
        this.aiQuizLoading = true;
        const questions = await aiService.generateQuizQuestions(this.courseTitle, 6);
        this.aiQuizQuestions = questions;
        this.questions = this.convertAIQuestionsToQuestions(questions, this.courseId);
        this.currentQIndex = 0;
        this.answeredCount = 0;
        this.showResult = false;
        this.selectedOption = '';
        this.quizAISource = true;
        this.aiQuizLoading = false;
    }
    getAINodeById(id: string): AIKnowledgeNode | undefined {
        for (let i = 0; i < this.aiKnowledgeNodes.length; i++) {
            if (this.aiKnowledgeNodes[i].id === id) {
                return this.aiKnowledgeNodes[i];
            }
        }
        return undefined;
    }
    isNodeExpanded(id: string): boolean {
        for (let i = 0; i < this.expandedNodeIds.length; i++) {
            if (this.expandedNodeIds[i] === id) {
                return true;
            }
        }
        return false;
    }
    toggleNode(id: string): void {
        const idx = this.expandedNodeIds.indexOf(id);
        if (idx >= 0) {
            this.expandedNodeIds.splice(idx, 1);
        }
        else {
            this.expandedNodeIds.push(id);
        }
    }
    getVisibleTreeNodes(): TreeNodeItem[] {
        const result: TreeNodeItem[] = [];
        const seen: string[] = [];
        const traverse = (nodeId: string, depth: number) => {
            if (seen.indexOf(nodeId) >= 0) {
                return;
            }
            seen.push(nodeId);
            const node = this.getAINodeById(nodeId);
            if (!node) {
                return;
            }
            result.push({ node: node, depth: depth });
            if (this.isNodeExpanded(nodeId)) {
                const children = node.children || [];
                for (let i = 0; i < children.length; i++) {
                    traverse(children[i], depth + 1);
                }
            }
        };
        const roots: AIKnowledgeNode[] = [];
        for (let i = 0; i < this.aiKnowledgeNodes.length; i++) {
            if (this.aiKnowledgeNodes[i].level === 0) {
                roots.push(this.aiKnowledgeNodes[i]);
            }
        }
        for (let i = 0; i < roots.length; i++) {
            traverse(roots[i].id, 0);
        }
        for (let i = 0; i < this.aiKnowledgeNodes.length; i++) {
            if (seen.indexOf(this.aiKnowledgeNodes[i].id) < 0) {
                result.push({ node: this.aiKnowledgeNodes[i], depth: this.aiKnowledgeNodes[i].level });
                seen.push(this.aiKnowledgeNodes[i].id);
            }
        }
        return result;
    }
    getFlatNodeList(): NodeListItem[] {
        const result: NodeListItem[] = [];
        for (let i = 0; i < this.aiKnowledgeNodes.length; i++) {
            const node = this.aiKnowledgeNodes[i];
            const children = node.children || [];
            result.push({
                id: node.id,
                name: node.name,
                description: node.description,
                color: this.getNodeLevelColor(node.level),
                hasChildren: children.length > 0,
                childrenCount: children.length,
                isAIExpandable: true
            });
        }
        return result;
    }
    getStaticNodeList(): NodeListItem[] {
        const result: NodeListItem[] = [];
        if (this.course && this.course.knowledgeGraph.length > 0) {
            const children = this.course.knowledgeGraph[0].children || [];
            for (let i = 0; i < children.length; i++) {
                const node = children[i];
                result.push({
                    id: node.id,
                    name: node.name,
                    description: node.description,
                    color: Constants.COLOR_PRIMARY_LIGHT,
                    hasChildren: node.children.length > 0,
                    childrenCount: node.children.length,
                    isAIExpandable: false
                });
            }
        }
        return result;
    }
    convertAIQuestionsToQuestions(aiQuestions: AIQuestion[], courseId: string): Question[] {
        const labels: string[] = ['A', 'B', 'C', 'D', 'E', 'F'];
        const result: Question[] = [];
        for (let i = 0; i < aiQuestions.length; i++) {
            const aiq = aiQuestions[i];
            const q = new Question();
            q.id = aiq.id || `ai_q_${i}`;
            q.courseId = courseId;
            q.bloomLevel = this.bloomLevelFromString(aiq.bloomLevel);
            q.questionText = aiq.questionText;
            const opts: QuestionOption[] = [];
            for (let j = 0; j < aiq.options.length && j < labels.length; j++) {
                const opt = new QuestionOption();
                opt.label = labels[j];
                opt.content = aiq.options[j];
                opt.isCorrect = j === aiq.correctIndex;
                opts.push(opt);
            }
            q.options = opts;
            q.explanation = aiq.explanation || 'AI生成题目，暂无详细解析';
            q.difficulty = i + 1;
            result.push(q);
        }
        return result;
    }
    bloomLevelFromString(level: string): BloomLevel {
        if (level === '记忆') {
            return BloomLevel.MEMORY;
        }
        if (level === '理解') {
            return BloomLevel.UNDERSTAND;
        }
        if (level === '应用') {
            return BloomLevel.APPLY;
        }
        if (level === '分析') {
            return BloomLevel.ANALYZE;
        }
        if (level === '评价') {
            return BloomLevel.EVALUATE;
        }
        if (level === '创造') {
            return BloomLevel.CREATE;
        }
        return BloomLevel.MEMORY;
    }
    buildReviewSection(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.dueReviewCount > 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                        Column.padding(16);
                        Column.backgroundColor(Constants.COLOR_CARD);
                        Column.borderRadius(16);
                        Column.margin({ top: 16 });
                        Column.border({ width: 1, color: 0x22EF4444 });
                        Column.onClick(() => {
                            this.showReviewSection = !this.showReviewSection;
                            this.reviewItems = globalData.getDueReviews();
                            this.reviewIndex = 0;
                        });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.width('100%');
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('🔄 间隔复习');
                        Text.fontSize(16);
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
                        Stack.width(22);
                        Stack.height(22);
                    }, Stack);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Circle.create();
                        Circle.width(22);
                        Circle.height(22);
                        Circle.fill(Constants.COLOR_ACCENT_RED);
                    }, Circle);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.dueReviewCount.toString());
                        Text.fontSize(11);
                        Text.fontColor('#FFFFFF');
                        Text.fontWeight(FontWeight.Bold);
                    }, Text);
                    Text.pop();
                    Stack.pop();
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('有 ' + this.dueReviewCount + ' 道题目待复习，点击查看');
                        Text.fontSize(12);
                        Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
                        Text.width('100%');
                        Text.margin({ top: 4 });
                    }, Text);
                    Text.pop();
                    Column.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        if (this.showReviewSection && this.reviewItems.length > 0) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.buildReviewDetail.bind(this)();
                            });
                        }
                        else {
                            this.ifElseBranchUpdateFunction(1, () => {
                            });
                        }
                    }, If);
                    If.pop();
                });
            }
            else if (globalData.getReviewQueue().length > 0) {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                        Column.padding(16);
                        Column.backgroundColor(Constants.COLOR_CARD);
                        Column.borderRadius(16);
                        Column.margin({ top: 16 });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.width('100%');
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('✅ 间隔复习');
                        Text.fontSize(16);
                        Text.fontWeight(FontWeight.Bold);
                        Text.fontColor(Constants.COLOR_ACCENT_GREEN);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Blank.create();
                    }, Blank);
                    Blank.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('全部完成');
                        Text.fontSize(12);
                        Text.fontColor(Constants.COLOR_ACCENT_GREEN);
                    }, Text);
                    Text.pop();
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('暂时没有待复习的题目');
                        Text.fontSize(12);
                        Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
                        Text.width('100%');
                        Text.margin({ top: 4 });
                    }, Text);
                    Text.pop();
                    Column.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(2, () => {
                });
            }
        }, If);
        If.pop();
    }
    getReviewItem(): ReviewItem {
        if (this.reviewIndex < this.reviewItems.length) {
            return this.reviewItems[this.reviewIndex];
        }
        const empty: ReviewItem = {
            questionId: '', courseId: '', questionText: '', options: [],
            correctIndex: 0, userAnswer: 0, lastReviewDate: 0,
            nextReviewDate: 0, interval: 0, reviewCount: 0
        } as ReviewItem;
        return empty;
    }
    getReviewCount(): number {
        return this.reviewItems.length;
    }
    buildReviewDetail(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.padding(16);
            Column.backgroundColor(Constants.COLOR_CARD);
            Column.borderRadius(12);
            Column.margin({ top: 8 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.reviewIndex < this.reviewItems.length) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('第 ' + (this.reviewIndex + 1) + '/' + this.reviewItems.length + ' 题');
                        Text.fontSize(12);
                        Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
                        Text.width('100%');
                        Text.margin({ bottom: 8 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.reviewItems[this.reviewIndex].questionText);
                        Text.fontSize(16);
                        Text.fontWeight(FontWeight.Bold);
                        Text.fontColor(Constants.COLOR_TEXT);
                        Text.width('100%');
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                        Column.margin({ top: 12 });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        ForEach.create();
                        const forEachItemGenFunction = (_item, optIdx: number) => {
                            const opt = _item;
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Row.create();
                                Row.width('100%');
                                Row.padding({ top: 8, bottom: 8 });
                                Row.backgroundColor(optIdx === this.reviewItems[this.reviewIndex].correctIndex ? 0x0A10B981 :
                                    optIdx === this.reviewItems[this.reviewIndex].userAnswer && optIdx !== this.reviewItems[this.reviewIndex].correctIndex ? 0x0AEF4444 : 'transparent');
                                Row.borderRadius(8);
                                Row.margin({ bottom: 4 });
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
                                Circle.fill(optIdx === this.reviewItems[this.reviewIndex].correctIndex ? Constants.COLOR_ACCENT_GREEN :
                                    optIdx === this.reviewItems[this.reviewIndex].userAnswer && optIdx !== this.reviewItems[this.reviewIndex].correctIndex ? Constants.COLOR_ACCENT_RED :
                                        0x0F000000);
                            }, Circle);
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create(['A', 'B', 'C', 'D', 'E', 'F'][optIdx]);
                                Text.fontSize(12);
                                Text.fontColor(optIdx === this.reviewItems[this.reviewIndex].correctIndex || optIdx === this.reviewItems[this.reviewIndex].userAnswer ? '#FFFFFF' : Constants.COLOR_TEXT);
                                Text.fontWeight(FontWeight.Bold);
                            }, Text);
                            Text.pop();
                            Stack.pop();
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create(opt);
                                Text.fontSize(14);
                                Text.fontColor(Constants.COLOR_TEXT);
                                Text.margin({ left: 10 });
                                Text.layoutWeight(1);
                            }, Text);
                            Text.pop();
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                If.create();
                                if (optIdx === this.reviewItems[this.reviewIndex].correctIndex) {
                                    this.ifElseBranchUpdateFunction(0, () => {
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            Text.create('✓');
                                            Text.fontSize(16);
                                            Text.fontColor(Constants.COLOR_ACCENT_GREEN);
                                        }, Text);
                                        Text.pop();
                                    });
                                }
                                else if (optIdx === this.reviewItems[this.reviewIndex].userAnswer && optIdx !== this.reviewItems[this.reviewIndex].correctIndex) {
                                    this.ifElseBranchUpdateFunction(1, () => {
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            Text.create('✗');
                                            Text.fontSize(16);
                                            Text.fontColor(Constants.COLOR_ACCENT_RED);
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
                            Row.pop();
                        };
                        this.forEachUpdateFunction(elmtId, this.reviewItems[this.reviewIndex].options, forEachItemGenFunction, (opt: string) => opt, true, false);
                    }, ForEach);
                    ForEach.pop();
                    Column.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('复习次数: ' + this.reviewItems[this.reviewIndex].reviewCount + ' | 当前间隔: ' + this.reviewItems[this.reviewIndex].interval + '天');
                        Text.fontSize(11);
                        Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
                        Text.width('100%');
                        Text.margin({ top: 12 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.width('100%');
                        Row.margin({ top: 12 });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithChild();
                        Button.layoutWeight(1);
                        Button.height(44);
                        Button.backgroundColor(Constants.COLOR_ACCENT_GREEN);
                        Button.borderRadius(22);
                        Button.onClick(() => {
                            this.completeReview(this.reviewItems[this.reviewIndex]);
                        });
                    }, Button);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('✓ 复习完成');
                        Text.fontSize(14);
                        Text.fontColor('#FFFFFF');
                    }, Text);
                    Text.pop();
                    Button.pop();
                    Row.pop();
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
    completeReview(item: ReviewItem): void {
        const intervals: number[] = [1, 3, 7, 14, 30];
        const nextInterval = intervals[Math.min(item.reviewCount, intervals.length - 1)];
        const updatedItem: ReviewItem = {
            questionId: item.questionId,
            courseId: item.courseId,
            questionText: item.questionText,
            options: item.options,
            correctIndex: item.correctIndex,
            userAnswer: item.userAnswer,
            lastReviewDate: Date.now(),
            nextReviewDate: Date.now() + nextInterval * 24 * 60 * 60 * 1000,
            interval: nextInterval,
            reviewCount: item.reviewCount + 1
        } as ReviewItem;
        globalData.addReviewItem(updatedItem);
        StorageUtil.saveData();
        this.reviewItems = globalData.getDueReviews();
        this.dueReviewCount = this.reviewItems.length;
        this.reviewIndex++;
        if (this.reviewIndex >= this.reviewItems.length) {
            this.showReviewSection = false;
        }
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "ThreeQuestions";
    }
}
interface TreeNodeItem {
    node: AIKnowledgeNode;
    depth: number;
}
interface NodeListItem {
    id: string;
    name: string;
    description: string;
    color: ResourceColor;
    hasChildren: boolean;
    childrenCount: number;
    isAIExpandable: boolean;
}
registerNamedRoute(() => new ThreeQuestions(undefined, {}), "", { bundleName: "com.threeq.learner", moduleName: "entry", pagePath: "pages/ThreeQuestions", pageFullPath: "entry/src/main/ets/pages/ThreeQuestions", integratedHsp: "false", moduleType: "followWithHap" });
