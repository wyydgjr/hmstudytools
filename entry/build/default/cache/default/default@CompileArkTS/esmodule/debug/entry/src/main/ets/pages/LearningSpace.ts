if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface LearningSpace_Params {
    courseId?: string;
    courseTitle?: string;
    course?: Course | null;
    refreshKey?: number;
    currentCardIndex?: number;
    isAILoading?: boolean;
    aiEnabled?: boolean;
    aiNodes?: AIKnowledgeNode[];
    aiDisagreements?: AIDisagreement[];
    materials?: LearningMaterial[];
    searchQuery?: string;
    activeMaterialTab?: number;
    showMaterialDetail?: boolean;
    selectedMaterial?: LearningMaterial | null;
    isGeneratingMaterials?: boolean;
    showUploadInput?: boolean;
    uploadTitle?: string;
    uploadContent?: string;
    showNotesEditor?: boolean;
    notesContent?: string;
    isGeneratingDetail?: boolean;
    isDetailLoading?: boolean;
}
import router from "@ohos:router";
import type { Course } from '../model/CourseModel';
import { globalData } from "@normalized:N&&&entry/src/main/ets/model/LearningData&";
import { Constants } from "@normalized:N&&&entry/src/main/ets/utils/Constants&";
import { CourseCard } from "@normalized:N&&&entry/src/main/ets/components/CourseCard&";
import { aiService } from "@normalized:N&&&entry/src/main/ets/model/AIService&";
import type { AIKnowledgeNode, AIDisagreement } from "@normalized:N&&&entry/src/main/ets/model/AIService&";
import { StorageUtil } from "@normalized:N&&&entry/src/main/ets/utils/StorageUtil&";
import { LearningMaterial, MaterialType, MaterialSource, MaterialParser } from "@normalized:N&&&entry/src/main/ets/model/MaterialModel&";
class LearningSpace extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__courseId = new ObservedPropertySimplePU('', this, "courseId");
        this.__courseTitle = new ObservedPropertySimplePU('', this, "courseTitle");
        this.__course = new ObservedPropertyObjectPU(null, this, "course");
        this.__refreshKey = new ObservedPropertySimplePU(0, this, "refreshKey");
        this.__currentCardIndex = new ObservedPropertySimplePU(0, this, "currentCardIndex");
        this.__isAILoading = new ObservedPropertySimplePU(false, this, "isAILoading");
        this.__aiEnabled = new ObservedPropertySimplePU(false, this, "aiEnabled");
        this.__aiNodes = new ObservedPropertyObjectPU([], this, "aiNodes");
        this.__aiDisagreements = new ObservedPropertyObjectPU([], this, "aiDisagreements");
        this.__materials = new ObservedPropertyObjectPU([], this, "materials");
        this.__searchQuery = new ObservedPropertySimplePU('', this, "searchQuery");
        this.__activeMaterialTab = new ObservedPropertySimplePU(0, this, "activeMaterialTab");
        this.__showMaterialDetail = new ObservedPropertySimplePU(false, this, "showMaterialDetail");
        this.__selectedMaterial = new ObservedPropertyObjectPU(null, this, "selectedMaterial");
        this.__isGeneratingMaterials = new ObservedPropertySimplePU(false, this, "isGeneratingMaterials");
        this.__showUploadInput = new ObservedPropertySimplePU(false, this, "showUploadInput");
        this.__uploadTitle = new ObservedPropertySimplePU('', this, "uploadTitle");
        this.__uploadContent = new ObservedPropertySimplePU('', this, "uploadContent");
        this.__showNotesEditor = new ObservedPropertySimplePU(false, this, "showNotesEditor");
        this.__notesContent = new ObservedPropertySimplePU('', this, "notesContent");
        this.__isGeneratingDetail = new ObservedPropertySimplePU(false, this, "isGeneratingDetail");
        this.__isDetailLoading = new ObservedPropertySimplePU(false, this, "isDetailLoading");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: LearningSpace_Params) {
        if (params.courseId !== undefined) {
            this.courseId = params.courseId;
        }
        if (params.courseTitle !== undefined) {
            this.courseTitle = params.courseTitle;
        }
        if (params.course !== undefined) {
            this.course = params.course;
        }
        if (params.refreshKey !== undefined) {
            this.refreshKey = params.refreshKey;
        }
        if (params.currentCardIndex !== undefined) {
            this.currentCardIndex = params.currentCardIndex;
        }
        if (params.isAILoading !== undefined) {
            this.isAILoading = params.isAILoading;
        }
        if (params.aiEnabled !== undefined) {
            this.aiEnabled = params.aiEnabled;
        }
        if (params.aiNodes !== undefined) {
            this.aiNodes = params.aiNodes;
        }
        if (params.aiDisagreements !== undefined) {
            this.aiDisagreements = params.aiDisagreements;
        }
        if (params.materials !== undefined) {
            this.materials = params.materials;
        }
        if (params.searchQuery !== undefined) {
            this.searchQuery = params.searchQuery;
        }
        if (params.activeMaterialTab !== undefined) {
            this.activeMaterialTab = params.activeMaterialTab;
        }
        if (params.showMaterialDetail !== undefined) {
            this.showMaterialDetail = params.showMaterialDetail;
        }
        if (params.selectedMaterial !== undefined) {
            this.selectedMaterial = params.selectedMaterial;
        }
        if (params.isGeneratingMaterials !== undefined) {
            this.isGeneratingMaterials = params.isGeneratingMaterials;
        }
        if (params.showUploadInput !== undefined) {
            this.showUploadInput = params.showUploadInput;
        }
        if (params.uploadTitle !== undefined) {
            this.uploadTitle = params.uploadTitle;
        }
        if (params.uploadContent !== undefined) {
            this.uploadContent = params.uploadContent;
        }
        if (params.showNotesEditor !== undefined) {
            this.showNotesEditor = params.showNotesEditor;
        }
        if (params.notesContent !== undefined) {
            this.notesContent = params.notesContent;
        }
        if (params.isGeneratingDetail !== undefined) {
            this.isGeneratingDetail = params.isGeneratingDetail;
        }
        if (params.isDetailLoading !== undefined) {
            this.isDetailLoading = params.isDetailLoading;
        }
    }
    updateStateVars(params: LearningSpace_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__courseId.purgeDependencyOnElmtId(rmElmtId);
        this.__courseTitle.purgeDependencyOnElmtId(rmElmtId);
        this.__course.purgeDependencyOnElmtId(rmElmtId);
        this.__refreshKey.purgeDependencyOnElmtId(rmElmtId);
        this.__currentCardIndex.purgeDependencyOnElmtId(rmElmtId);
        this.__isAILoading.purgeDependencyOnElmtId(rmElmtId);
        this.__aiEnabled.purgeDependencyOnElmtId(rmElmtId);
        this.__aiNodes.purgeDependencyOnElmtId(rmElmtId);
        this.__aiDisagreements.purgeDependencyOnElmtId(rmElmtId);
        this.__materials.purgeDependencyOnElmtId(rmElmtId);
        this.__searchQuery.purgeDependencyOnElmtId(rmElmtId);
        this.__activeMaterialTab.purgeDependencyOnElmtId(rmElmtId);
        this.__showMaterialDetail.purgeDependencyOnElmtId(rmElmtId);
        this.__selectedMaterial.purgeDependencyOnElmtId(rmElmtId);
        this.__isGeneratingMaterials.purgeDependencyOnElmtId(rmElmtId);
        this.__showUploadInput.purgeDependencyOnElmtId(rmElmtId);
        this.__uploadTitle.purgeDependencyOnElmtId(rmElmtId);
        this.__uploadContent.purgeDependencyOnElmtId(rmElmtId);
        this.__showNotesEditor.purgeDependencyOnElmtId(rmElmtId);
        this.__notesContent.purgeDependencyOnElmtId(rmElmtId);
        this.__isGeneratingDetail.purgeDependencyOnElmtId(rmElmtId);
        this.__isDetailLoading.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__courseId.aboutToBeDeleted();
        this.__courseTitle.aboutToBeDeleted();
        this.__course.aboutToBeDeleted();
        this.__refreshKey.aboutToBeDeleted();
        this.__currentCardIndex.aboutToBeDeleted();
        this.__isAILoading.aboutToBeDeleted();
        this.__aiEnabled.aboutToBeDeleted();
        this.__aiNodes.aboutToBeDeleted();
        this.__aiDisagreements.aboutToBeDeleted();
        this.__materials.aboutToBeDeleted();
        this.__searchQuery.aboutToBeDeleted();
        this.__activeMaterialTab.aboutToBeDeleted();
        this.__showMaterialDetail.aboutToBeDeleted();
        this.__selectedMaterial.aboutToBeDeleted();
        this.__isGeneratingMaterials.aboutToBeDeleted();
        this.__showUploadInput.aboutToBeDeleted();
        this.__uploadTitle.aboutToBeDeleted();
        this.__uploadContent.aboutToBeDeleted();
        this.__showNotesEditor.aboutToBeDeleted();
        this.__notesContent.aboutToBeDeleted();
        this.__isGeneratingDetail.aboutToBeDeleted();
        this.__isDetailLoading.aboutToBeDeleted();
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
    private __course: ObservedPropertyObjectPU<Course | null>;
    get course() {
        return this.__course.get();
    }
    set course(newValue: Course | null) {
        this.__course.set(newValue);
    }
    private __refreshKey: ObservedPropertySimplePU<number>;
    get refreshKey() {
        return this.__refreshKey.get();
    }
    set refreshKey(newValue: number) {
        this.__refreshKey.set(newValue);
    }
    private __currentCardIndex: ObservedPropertySimplePU<number>;
    get currentCardIndex() {
        return this.__currentCardIndex.get();
    }
    set currentCardIndex(newValue: number) {
        this.__currentCardIndex.set(newValue);
    }
    private __isAILoading: ObservedPropertySimplePU<boolean>;
    get isAILoading() {
        return this.__isAILoading.get();
    }
    set isAILoading(newValue: boolean) {
        this.__isAILoading.set(newValue);
    }
    private __aiEnabled: ObservedPropertySimplePU<boolean>;
    get aiEnabled() {
        return this.__aiEnabled.get();
    }
    set aiEnabled(newValue: boolean) {
        this.__aiEnabled.set(newValue);
    }
    private __aiNodes: ObservedPropertyObjectPU<AIKnowledgeNode[]>;
    get aiNodes() {
        return this.__aiNodes.get();
    }
    set aiNodes(newValue: AIKnowledgeNode[]) {
        this.__aiNodes.set(newValue);
    }
    private __aiDisagreements: ObservedPropertyObjectPU<AIDisagreement[]>;
    get aiDisagreements() {
        return this.__aiDisagreements.get();
    }
    set aiDisagreements(newValue: AIDisagreement[]) {
        this.__aiDisagreements.set(newValue);
    }
    private __materials: ObservedPropertyObjectPU<LearningMaterial[]>;
    get materials() {
        return this.__materials.get();
    }
    set materials(newValue: LearningMaterial[]) {
        this.__materials.set(newValue);
    }
    private __searchQuery: ObservedPropertySimplePU<string>;
    get searchQuery() {
        return this.__searchQuery.get();
    }
    set searchQuery(newValue: string) {
        this.__searchQuery.set(newValue);
    }
    private __activeMaterialTab: ObservedPropertySimplePU<number>;
    get activeMaterialTab() {
        return this.__activeMaterialTab.get();
    }
    set activeMaterialTab(newValue: number) {
        this.__activeMaterialTab.set(newValue);
    }
    private __showMaterialDetail: ObservedPropertySimplePU<boolean>;
    get showMaterialDetail() {
        return this.__showMaterialDetail.get();
    }
    set showMaterialDetail(newValue: boolean) {
        this.__showMaterialDetail.set(newValue);
    }
    private __selectedMaterial: ObservedPropertyObjectPU<LearningMaterial | null>;
    get selectedMaterial() {
        return this.__selectedMaterial.get();
    }
    set selectedMaterial(newValue: LearningMaterial | null) {
        this.__selectedMaterial.set(newValue);
    }
    private __isGeneratingMaterials: ObservedPropertySimplePU<boolean>;
    get isGeneratingMaterials() {
        return this.__isGeneratingMaterials.get();
    }
    set isGeneratingMaterials(newValue: boolean) {
        this.__isGeneratingMaterials.set(newValue);
    }
    private __showUploadInput: ObservedPropertySimplePU<boolean>;
    get showUploadInput() {
        return this.__showUploadInput.get();
    }
    set showUploadInput(newValue: boolean) {
        this.__showUploadInput.set(newValue);
    }
    private __uploadTitle: ObservedPropertySimplePU<string>;
    get uploadTitle() {
        return this.__uploadTitle.get();
    }
    set uploadTitle(newValue: string) {
        this.__uploadTitle.set(newValue);
    }
    private __uploadContent: ObservedPropertySimplePU<string>;
    get uploadContent() {
        return this.__uploadContent.get();
    }
    set uploadContent(newValue: string) {
        this.__uploadContent.set(newValue);
    }
    private __showNotesEditor: ObservedPropertySimplePU<boolean>;
    get showNotesEditor() {
        return this.__showNotesEditor.get();
    }
    set showNotesEditor(newValue: boolean) {
        this.__showNotesEditor.set(newValue);
    }
    private __notesContent: ObservedPropertySimplePU<string>;
    get notesContent() {
        return this.__notesContent.get();
    }
    set notesContent(newValue: string) {
        this.__notesContent.set(newValue);
    }
    private __isGeneratingDetail: ObservedPropertySimplePU<boolean>;
    get isGeneratingDetail() {
        return this.__isGeneratingDetail.get();
    }
    set isGeneratingDetail(newValue: boolean) {
        this.__isGeneratingDetail.set(newValue);
    }
    private __isDetailLoading: ObservedPropertySimplePU<boolean>;
    get isDetailLoading() {
        return this.__isDetailLoading.get();
    }
    set isDetailLoading(newValue: boolean) {
        this.__isDetailLoading.set(newValue);
    }
    aboutToAppear(): void {
        const params = router.getParams() as Record<string, Object>;
        if (params) {
            this.courseId = params['courseId'] as string || '';
            this.courseTitle = params['courseTitle'] as string || '';
        }
        aiService.loadConfig();
        this.aiEnabled = aiService.isConfigured();
        this.loadCourse();
        this.loadMaterials();
    }
    onPageShow(): void {
        aiService.loadConfig();
        this.aiEnabled = aiService.isConfigured();
        this.loadCourse();
        this.loadMaterials();
    }
    loadCourse(): void {
        this.course = globalData.getCourse(this.courseId) || null;
        this.notesContent = globalData.getNotes(this.courseId);
        this.refreshKey++;
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create();
            Stack.width('100%');
            Stack.height('100%');
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor(Constants.COLOR_BACKGROUND);
        }, Column);
        this.buildTopBar.bind(this)();
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
                    this.buildCourseHeader.bind(this)();
                    this.buildAIChatCard.bind(this)();
                    this.buildThreeQuestions.bind(this)();
                    this.buildKnowledgeBase.bind(this)();
                    this.buildAIGeneratedContent.bind(this)();
                    this.buildCourseGrid.bind(this)();
                    Column.pop();
                    Scroll.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.layoutWeight(1);
                        Column.justifyContent(FlexAlign.Center);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('课程未找到');
                        Text.fontSize(16);
                        Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
                    }, Text);
                    Text.pop();
                    Column.pop();
                });
            }
        }, If);
        If.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.showMaterialDetail && this.selectedMaterial) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.buildMaterialDetail.bind(this)();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        Stack.pop();
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
            Text.create(this.course?.title || '学习空间');
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
            Row.create();
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // AI状态指示
            if (this.aiEnabled) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Stack.create();
                        Stack.width(8);
                        Stack.height(8);
                        Stack.margin({ right: 4 });
                    }, Stack);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Circle.create();
                        Circle.width(8);
                        Circle.height(8);
                        Circle.fill(Constants.COLOR_ACCENT_GREEN);
                    }, Circle);
                    Stack.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
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
        Row.pop();
    }
    buildCourseHeader(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.padding(16);
            Column.backgroundColor(Constants.COLOR_CARD);
            Column.borderRadius(16);
            Column.shadow({ radius: 4, offsetY: 2, color: 0x12000000 });
            Column.margin({ top: 16 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.margin({ top: 16 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create();
            Stack.width(56);
            Stack.height(56);
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Circle.create();
            Circle.width(56);
            Circle.height(56);
            Circle.fill(Constants.COLOR_PRIMARY);
        }, Circle);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.course!.title.charAt(0));
            Text.fontSize(28);
            Text.fontColor('#FFFFFF');
            Text.fontWeight(FontWeight.Bold);
        }, Text);
        Text.pop();
        Stack.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.layoutWeight(1);
            Column.margin({ left: 16 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.course!.title);
            Text.fontSize(20);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(Constants.COLOR_TEXT);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.course!.description);
            Text.fontSize(13);
            Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
            Text.margin({ top: 4 });
        }, Text);
        Text.pop();
        Column.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.margin({ top: 12 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('课程进度');
            Text.fontSize(13);
            Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`${this.course!.progress}%`);
            Text.fontSize(13);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(Constants.COLOR_PRIMARY);
        }, Text);
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Progress.create({ value: this.course!.progress, total: 100, type: ProgressType.Linear });
            Progress.width('100%');
            Progress.height(8);
            Progress.color(Constants.COLOR_PRIMARY);
            Progress.backgroundColor(Constants.COLOR_DIVIDER);
            Progress.borderRadius(4);
        }, Progress);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.margin({ top: 12 });
            Row.onClick(() => {
                this.showNotesEditor = !this.showNotesEditor;
                this.notesContent = globalData.getNotes(this.courseId);
            });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('📝 学习笔记');
            Text.fontSize(14);
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor(Constants.COLOR_PRIMARY);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.notesContent.length > 0 ? '已保存' : '点击编辑');
            Text.fontSize(11);
            Text.fontColor(this.notesContent.length > 0 ? Constants.COLOR_ACCENT_GREEN : Constants.COLOR_TEXT_SECONDARY);
        }, Text);
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.showNotesEditor) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        TextArea.create({ text: this.notesContent, placeholder: '在此输入你的学习笔记...' });
                        TextArea.width('100%');
                        TextArea.height(160);
                        TextArea.backgroundColor('#FFFFFF');
                        TextArea.borderRadius(8);
                        TextArea.padding(8);
                        TextArea.margin({ top: 8 });
                        TextArea.onChange((val: string) => {
                            this.notesContent = val;
                            globalData.setNotes(this.courseId, val);
                            StorageUtil.saveData();
                        });
                    }, TextArea);
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
    buildAIChatCard(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.padding(16);
            Column.backgroundColor(Constants.COLOR_CARD);
            Column.borderRadius(16);
            Column.margin({ top: 12 });
            Column.onClick(() => {
                if (this.aiEnabled) {
                    router.pushUrl({
                        url: 'pages/AIChat',
                        params: { courseId: this.courseId, courseTitle: this.courseTitle }
                    });
                }
                else {
                    router.pushUrl({ url: 'pages/AISettings' });
                }
            });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create();
            Stack.width(44);
            Stack.height(44);
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Circle.create();
            Circle.width(44);
            Circle.height(44);
            Circle.fill(this.aiEnabled ? Constants.COLOR_PRIMARY : 0x20000000);
        }, Circle);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('AI');
            Text.fontSize(16);
            Text.fontColor('#FFFFFF');
            Text.fontWeight(FontWeight.Bold);
        }, Text);
        Text.pop();
        Stack.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.layoutWeight(1);
            Column.alignItems(HorizontalAlign.Start);
            Column.margin({ left: 12 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('AI 学习助手');
            Text.fontSize(16);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(Constants.COLOR_TEXT);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.aiEnabled) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('点击开始与AI对话学习');
                        Text.fontSize(12);
                        Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
                        Text.margin({ top: 2 });
                    }, Text);
                    Text.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('未配置 - 点击设置API');
                        Text.fontSize(12);
                        Text.fontColor(Constants.COLOR_ACCENT_ORANGE);
                        Text.margin({ top: 2 });
                    }, Text);
                    Text.pop();
                });
            }
        }, If);
        If.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create();
            Stack.width(32);
            Stack.height(32);
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Circle.create();
            Circle.width(32);
            Circle.height(32);
            Circle.fill(this.aiEnabled ? Constants.COLOR_ACCENT_GREEN : 0x10000000);
        }, Circle);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('→');
            Text.fontSize(16);
            Text.fontColor(this.aiEnabled ? '#FFFFFF' : Constants.COLOR_TEXT_SECONDARY);
        }, Text);
        Text.pop();
        Stack.pop();
        Row.pop();
        Column.pop();
    }
    buildThreeQuestions(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('三问认知引擎');
            Text.fontSize(16);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(Constants.COLOR_TEXT);
            Text.width('100%');
            Text.margin({ top: 20, bottom: 12 });
        }, Text);
        Text.pop();
        this.buildQCard.bind(this)('Q1', '核心心智模型', '提取学科底层逻辑框架，构建动态知识图谱', Constants.COLOR_PRIMARY, this.course!.q1Completed, () => {
            this.executeQ1();
        });
        this.buildQCard.bind(this)('Q2', '学术分歧挖掘', '对比多源资料观点，培养批判性思维', Constants.COLOR_ACCENT_PURPLE, this.course!.q2Completed, () => {
            this.executeQ2();
        });
        this.buildQCard.bind(this)('Q3', '深度测评', '布鲁姆六层级多维自测，检验学习效果', Constants.COLOR_ACCENT_GREEN, this.course!.q3Completed, () => {
            this.executeQ3();
        });
        Column.pop();
    }
    buildQCard(q: string, title: string, desc: string, color: ResourceColor, completed: boolean, onAction: () => void, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.padding(16);
            Column.backgroundColor(Constants.COLOR_CARD);
            Column.borderRadius(16);
            Column.shadow({ radius: 4, offsetY: 1, color: 0x0A000000 });
            Column.margin({ bottom: 12 });
            Column.onClick(() => {
                if (!completed) {
                    onAction();
                }
                router.pushUrl({
                    url: 'pages/ThreeQuestions',
                    params: {
                        courseId: this.course!.id,
                        courseTitle: this.course!.title,
                        questionIndex: q === 'Q1' ? 0 : (q === 'Q2' ? 1 : 2)
                    }
                });
            });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create();
            Stack.width(40);
            Stack.height(40);
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Circle.create();
            Circle.width(40);
            Circle.height(40);
            Circle.fill(completed ? Constants.COLOR_ACCENT_GREEN : color);
        }, Circle);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(completed ? '✓' : q);
            Text.fontSize(18);
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
            Text.create(title);
            Text.fontSize(15);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(completed ? Constants.COLOR_ACCENT_GREEN : Constants.COLOR_TEXT);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(desc);
            Text.fontSize(11);
            Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
            Text.margin({ top: 2 });
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create();
            Stack.width(28);
            Stack.height(28);
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Circle.create();
            Circle.width(28);
            Circle.height(28);
            Circle.fill(completed ? Constants.COLOR_ACCENT_GREEN : 0x0F000000);
        }, Circle);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('→');
            Text.fontSize(14);
            Text.fontColor(completed ? '#FFFFFF' : Constants.COLOR_TEXT_SECONDARY);
        }, Text);
        Text.pop();
        Stack.pop();
        Row.pop();
        Column.pop();
    }
    buildAIGeneratedContent(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.aiNodes.length > 0 || this.aiDisagreements.length > 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('AI 生成内容');
                        Text.fontSize(16);
                        Text.fontWeight(FontWeight.Bold);
                        Text.fontColor(Constants.COLOR_TEXT);
                        Text.width('100%');
                        Text.margin({ top: 16, bottom: 12 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        // 知识图谱节点
                        if (this.aiNodes.length > 0) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Column.create();
                                    Column.width('100%');
                                    Column.padding(12);
                                    Column.backgroundColor(Constants.COLOR_CARD);
                                    Column.borderRadius(12);
                                }, Column);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create('知识图谱节点');
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
                                        const node = _item;
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            Row.create();
                                            Row.width('100%');
                                            Row.padding(8);
                                            Row.backgroundColor(0x05000000);
                                            Row.borderRadius(8);
                                            Row.margin({ bottom: 6 });
                                        }, Row);
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            Stack.create();
                                            Stack.width(24);
                                            Stack.height(24);
                                        }, Stack);
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            Circle.create();
                                            Circle.width(24);
                                            Circle.height(24);
                                            Circle.fill(Constants.COLOR_PRIMARY);
                                        }, Circle);
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            Text.create(node.level.toString());
                                            Text.fontSize(10);
                                            Text.fontColor('#FFFFFF');
                                        }, Text);
                                        Text.pop();
                                        Stack.pop();
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            Column.create();
                                            Column.layoutWeight(1);
                                            Column.alignItems(HorizontalAlign.Start);
                                            Column.margin({ left: 8 });
                                        }, Column);
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            Text.create(node.name);
                                            Text.fontSize(13);
                                            Text.fontWeight(FontWeight.Bold);
                                            Text.fontColor(Constants.COLOR_TEXT);
                                        }, Text);
                                        Text.pop();
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            Text.create(node.description);
                                            Text.fontSize(11);
                                            Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
                                            Text.margin({ top: 2 });
                                        }, Text);
                                        Text.pop();
                                        Column.pop();
                                        Row.pop();
                                    };
                                    this.forEachUpdateFunction(elmtId, this.aiNodes, forEachItemGenFunction, (node: AIKnowledgeNode) => node.id, false, false);
                                }, ForEach);
                                ForEach.pop();
                                Column.pop();
                            });
                        }
                        // 争议点
                        else {
                            this.ifElseBranchUpdateFunction(1, () => {
                            });
                        }
                    }, If);
                    If.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        // 争议点
                        if (this.aiDisagreements.length > 0) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Column.create();
                                    Column.width('100%');
                                }, Column);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create('学术争议点');
                                    Text.fontSize(14);
                                    Text.fontWeight(FontWeight.Bold);
                                    Text.fontColor(Constants.COLOR_TEXT);
                                    Text.width('100%');
                                    Text.margin({ top: 12, bottom: 8 });
                                }, Text);
                                Text.pop();
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    ForEach.create();
                                    const forEachItemGenFunction = _item => {
                                        const d = _item;
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            Column.create();
                                            Column.width('100%');
                                            Column.padding(12);
                                            Column.backgroundColor(Constants.COLOR_CARD);
                                            Column.borderRadius(12);
                                            Column.margin({ bottom: 8 });
                                        }, Column);
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            Text.create(d.topic);
                                            Text.fontSize(13);
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
                                            Column.create();
                                            Column.layoutWeight(1);
                                            Column.padding(8);
                                            Column.backgroundColor(0x05000000);
                                            Column.borderRadius(8);
                                        }, Column);
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            Text.create('观点A');
                                            Text.fontSize(11);
                                            Text.fontColor(Constants.COLOR_PRIMARY);
                                        }, Text);
                                        Text.pop();
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            Text.create(d.viewA);
                                            Text.fontSize(11);
                                            Text.fontColor(Constants.COLOR_TEXT);
                                            Text.margin({ top: 2 });
                                        }, Text);
                                        Text.pop();
                                        Column.pop();
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            Column.create();
                                            Column.layoutWeight(1);
                                            Column.padding(8);
                                            Column.backgroundColor(0x05000000);
                                            Column.borderRadius(8);
                                            Column.margin({ left: 8 });
                                        }, Column);
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            Text.create('观点B');
                                            Text.fontSize(11);
                                            Text.fontColor(Constants.COLOR_ACCENT_PURPLE);
                                        }, Text);
                                        Text.pop();
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            Text.create(d.viewB);
                                            Text.fontSize(11);
                                            Text.fontColor(Constants.COLOR_TEXT);
                                            Text.margin({ top: 2 });
                                        }, Text);
                                        Text.pop();
                                        Column.pop();
                                        Row.pop();
                                        Column.pop();
                                    };
                                    this.forEachUpdateFunction(elmtId, this.aiDisagreements, forEachItemGenFunction, (d: AIDisagreement) => d.id, false, false);
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
    buildCourseGrid(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.course) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('其他课程');
                        Text.fontSize(16);
                        Text.fontWeight(FontWeight.Bold);
                        Text.fontColor(Constants.COLOR_TEXT);
                        Text.width('100%');
                        Text.margin({ top: 16, bottom: 12 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        ForEach.create();
                        const forEachItemGenFunction = _item => {
                            const otherCourse = _item;
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                __Common__.create();
                                __Common__.margin({ bottom: 12 });
                            }, __Common__);
                            {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    if (isInitialRender) {
                                        let componentCall = new CourseCard(this, {
                                            course: otherCourse,
                                            onCardClick: () => {
                                                router.pushUrl({
                                                    url: 'pages/LearningSpace',
                                                    params: { courseId: otherCourse.id, courseTitle: otherCourse.title }
                                                });
                                            }
                                        }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/LearningSpace.ets", line: 575, col: 11 });
                                        ViewPU.create(componentCall);
                                        let paramsLambda = () => {
                                            return {
                                                course: otherCourse,
                                                onCardClick: () => {
                                                    router.pushUrl({
                                                        url: 'pages/LearningSpace',
                                                        params: { courseId: otherCourse.id, courseTitle: otherCourse.title }
                                                    });
                                                }
                                            };
                                        };
                                        componentCall.paramsGenerator_ = paramsLambda;
                                    }
                                    else {
                                        this.updateStateVarsOfChildByElmtId(elmtId, {
                                            course: otherCourse
                                        });
                                    }
                                }, { name: "CourseCard" });
                            }
                            __Common__.pop();
                        };
                        this.forEachUpdateFunction(elmtId, globalData.getCourses().filter(c => c.id !== this.courseId), forEachItemGenFunction, (otherCourse: Course) => otherCourse.id, false, false);
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
    }
    async executeQ1(): Promise<void> {
        if (this.course) {
            this.course.q1Completed = true;
            this.refreshKey++;
            globalData.updateCourseProgress(this.course.id, 33);
            StorageUtil.saveData();
            // 如果AI已配置，生成知识图谱
            if (this.aiEnabled) {
                this.isAILoading = true;
                this.aiNodes = await aiService.generateKnowledgeGraph(this.courseTitle);
                this.isAILoading = false;
            }
            AlertDialog.show({
                title: '心智模型已构建',
                message: this.aiEnabled ? 'AI已生成知识图谱，包含核心概念及逻辑关系' : '知识图谱已生成，包含所有核心概念及逻辑关系',
                confirm: { value: '进入学习', action: () => { } }
            });
        }
    }
    async executeQ2(): Promise<void> {
        if (this.course) {
            this.course.q2Completed = true;
            this.refreshKey++;
            globalData.updateCourseProgress(this.course.id, 66);
            StorageUtil.saveData();
            // 如果AI已配置，生成争议点
            if (this.aiEnabled) {
                this.isAILoading = true;
                this.aiDisagreements = await aiService.generateDisagreements(this.courseTitle);
                this.isAILoading = false;
            }
            AlertDialog.show({
                title: '学术分歧已挖掘',
                message: this.aiEnabled ? 'AI已识别关键争议点并生成正反方论证链' : '已识别关键争议点并生成正反方论证链',
                confirm: { value: '查看详情', action: () => { } }
            });
        }
    }
    executeQ3(): void {
        if (this.course) {
            this.course.q3Completed = true;
            this.refreshKey++;
            globalData.updateCourseProgress(this.course.id, 100);
            this.course.status = 'completed';
            StorageUtil.saveData();
            AlertDialog.show({
                title: '测评完成',
                message: '恭喜完成本课程的三问学习！查看评价报告了解学习效果。',
                confirm: { value: '查看报告', action: () => {
                        router.pushUrl({
                            url: 'pages/Profile',
                            params: { courseId: this.courseId }
                        });
                    } }
            });
        }
    }
    loadMaterials(): void {
        const existing = globalData.getMaterials(this.courseId);
        if (existing.length === 0) {
            this.initSampleMaterials();
        }
        else {
            this.materials = existing;
        }
    }
    initSampleMaterials(): void {
        const topic = this.courseTitle;
        const samples: LearningMaterial[] = [];
        const s1 = LearningMaterial.createFromAI(topic + '核心概念与知识体系全景', '## 概述\n\n' + topic + '是一个系统性的知识领域，其核心概念体系构成了理解和掌握该学科的基石。本材料将系统性地梳理' + topic + '的核心知识框架，帮助学习者建立完整、清晰的知识地图。\n\n## 一、基础概念层\n\n### 1.1 核心定义\n' + topic + '的基本定义涵盖了其研究范畴、对象和方法论。理解这一定义是进入该领域的第一步。从学术角度而言，' + topic + '关注的是特定现象和规律的探索，其研究对象具有明确的边界和特征。\n\n### 1.2 关键术语\n在该领域中，有几个关键术语是必须掌握的：首先是核心术语A，它描述了最基本的现象；其次是术语B，它连接了理论与实践的桥梁；最后是术语C，代表了该领域的前沿发展方向。\n\n### 1.3 概念关系图\n这些基本概念之间存在着密切的关联：术语A是基础，术语B是方法，术语C是目标。三者形成了一个完整的学习闭环。\n\n## 二、方法论层\n\n### 2.1 分析方法\n' + topic + '的核心分析方法包括：系统分析法、比较研究法和实证研究法。系统分析法强调整体性视角；比较研究法通过对比不同案例寻找规律；实证研究法则基于数据和事实进行验证。\n\n### 2.2 实践工具\n在实践中，常用的工具包括概念图、思维导图和决策矩阵。这些工具帮助学习者将抽象知识可视化、结构化，大大提高了学习效率。\n\n## 三、能力培养层\n\n### 3.1 批判性思维\n培养批判性思维能力是学习' + topic + '的重要目标。学习者需要学会质疑假设、分析论证、评估证据。这种能力不仅在学术中有价值，在实际工作和生活中同样重要。\n\n### 3.2 问题解决能力\n通过系统化学习，学习者应能运用所学知识解决实际问题。这包括：问题识别、方案设计、实施评估和反馈优化四个步骤。\n\n## 总结\n\n' + topic + '的核心知识框架是一个多层次、立体化的体系。初学者应该先从基础概念入手，逐步深入到方法论层面，最终培养出独立思考和解决问题的能力。建议学习者按照"概念→方法→能力"的路径循序渐进。', this.courseId, ['核心概念', '知识体系', '基础原理', '学习方法', '能力培养']);
        s1.summary = topic + '系统性知识框架，涵盖基础概念、分析方法与实践能力三大层次，帮助快速建立知识地图。';
        const s1Detail = s1.content.substring(0, 150);
        s1.summary = s1Detail;
        samples.push(s1);
        const s2 = LearningMaterial.createFromAI(topic + '高效学习策略与实践指南', '## 概述\n\n掌握' + topic + '不仅需要勤奋，更需要科学有效的学习策略。本材料将介绍经过验证的高效学习方法，帮助学习者在更短时间内取得更好的学习效果。\n\n## 一、主动学习策略\n\n### 1.1 费曼学习法\n费曼学习法被誉为最有效的学习方法之一，其核心理念是"如果你不能简单地解释它，你就没有真正理解它"。具体步骤包括：选择一个概念、向别人解释这个概念、发现解释中的 gaps、回顾和简化。\n\n### 1.2 SQ3R阅读法\nSQ3R是一种系统的阅读学习方法，包含五个步骤：Survey（浏览）、Question（提问）、Read（阅读）、Recite（复述）、Review（复习）。这种方法特别适合学习' + topic + '这类需要理解复杂概念的知识体系。\n\n## 二、知识管理策略\n\n### 2.1 间隔重复\n艾宾浩斯遗忘曲线表明，人类在学习了新知识后会在短时间内快速遗忘。间隔重复策略通过在最佳时间点进行复习，可以显著提高长期记忆效率。建议采用1-3-7-14-30天的复习间隔。\n\n### 2.2 知识关联\n将新知识与已有知识建立联系是深度学习的核心。在' + topic + '的学习中，可以构建知识网络图，将不同概念之间的关系可视化，这有助于形成立体化的知识结构。\n\n## 三、实践强化策略\n\n### 3.1 项目驱动学习\n选择一个与' + topic + '相关的实际项目，在完成项目的过程中学习所需知识。这种"做中学"的方式能够显著提高学习动机和知识保留率。\n\n### 3.2 教学相长\n尝试将所学内容教给别人或写文章分享。教学过程中需要组织知识、寻找合适的表达方式，这一过程本身就是深层次的复习和巩固。\n\n## 四、学习心态管理\n\n保持成长型思维是持续学习的关键。接受学习过程中的挫折和反复，将每一次"不会"视为学习的机会而非失败。建议每天固定学习时间，形成习惯。\n\n## 总结\n\n高效学习不是天赋，而是可以习得的技能。通过主动学习、科学的知识管理、实践强化和良好的心态管理，每个人都能够在' + topic + '领域取得显著进步。', this.courseId, ['学习策略', '主动学习', '间隔重复', '费曼学习法', '知识管理']);
        s2.summary = topic + '高效学习策略全攻略，包含费曼学习法、SQ3R阅读法、间隔重复等科学方法。';
        samples.push(s2);
        const s3 = LearningMaterial.createFromAI(topic + '进阶学习路径与深度探索', '## 概述\n\n当学习者掌握了' + topic + '的基础后，如何向更高层次进阶就成为关键。本材料规划了一条清晰的进阶学习路径，帮助学习者从入门到精通，最终达到专业水平。\n\n## 一、进阶三阶段\n\n### 阶段一：系统深化（1-2个月）\n在第一阶段，学习者需要对基础知识进行系统化深化。具体目标包括：掌握所有核心概念、能够独立完成基础项目、建立完整的知识框架。推荐的学习方式包括精读权威教材、参与在线课程和完成配套练习。\n\n### 阶段二：应用拓展（2-3个月）\n在第二阶段，重点转向实际应用。学习者应该：参与实际项目、阅读业界案例、尝试解决真实问题。这一阶段的目标是能够将所学知识灵活运用于不同场景。\n\n### 阶段三：创新突破（3个月以上）\n第三阶段是真正的进阶阶段。学习者应该开始：阅读前沿论文、参与学术讨论、开展独立研究或创新项目。目标是形成自己的见解和贡献。\n\n## 二、核心能力进阶\n\n### 2.1 分析能力\n从基础的分析框架开始，逐步掌握更复杂的分析工具。建议从经典案例分析开始，逐步过渡到真实场景的复杂问题分析。\n\n### 2.2 综合能力\n综合能力是指将不同领域的知识融会贯通的能力。在' + topic + '的高级学习中，学习者需要具备跨学科视野，能够将不同知识领域的方法和理论整合运用。\n\n### 2.3 评价能力\n高级学习者应该能够对理论、方法和实践结果进行批判性评价。这包括识别假设、评估证据质量、判断结论合理性等能力。\n\n## 三、学习资源推荐\n\n### 3.1 经典教材\n选择2-3本该领域的经典教材作为主要学习资源。建议先通读一遍建立整体印象，再精读重点章节。\n\n### 3.2 学术资源\nGoogle Scholar、知网等学术搜索引擎是获取前沿研究的重要渠道。建议每周抽出时间阅读1-2篇该领域的论文。\n\n### 3.3 实践平台\nGitHub、Kaggle等平台提供了丰富的实践项目和数据集。通过参与这些平台的实践项目，可以显著提高实际能力。\n\n## 总结\n\n进阶学习是一个持续的过程，需要耐心和毅力。建议制定明确的学习计划，定期评估自己的进步，并适时调整学习策略。记住，真正的大师永远保持学习者的心态。', this.courseId, ['学习路径', '进阶', '深度探索', '能力提升', '资源推荐']);
        s3.summary = topic + '进阶学习路径规划，三阶段系统提升方案，帮助从入门到精通。';
        samples.push(s3);
        this.materials = samples;
        globalData.setMaterials(this.courseId, samples);
        StorageUtil.saveData();
    }
    getFilteredMaterials(): LearningMaterial[] {
        let result = this.materials;
        if (this.activeMaterialTab === 1) {
            result = result.filter(m => m.source === MaterialSource.AI_SUPPLEMENT);
        }
        else if (this.activeMaterialTab === 2) {
            result = result.filter(m => m.source === MaterialSource.USER_UPLOAD);
        }
        if (this.searchQuery.length > 0) {
            const q = this.searchQuery.toLowerCase();
            result = result.filter(m => m.title.toLowerCase().includes(q) ||
                m.summary.toLowerCase().includes(q));
        }
        return result;
    }
    getAIMaterials(): LearningMaterial[] {
        return this.materials.filter(m => m.source === MaterialSource.AI_SUPPLEMENT);
    }
    getUserMaterials(): LearningMaterial[] {
        return this.materials.filter(m => m.source === MaterialSource.USER_UPLOAD);
    }
    getTypeColor(type: MaterialType): ResourceColor {
        if (type === MaterialType.PDF)
            return Constants.COLOR_PRIMARY;
        if (type === MaterialType.WORD)
            return Constants.COLOR_ACCENT_PURPLE;
        if (type === MaterialType.MARKDOWN)
            return Constants.COLOR_ACCENT_GREEN;
        if (type === MaterialType.WEB)
            return Constants.COLOR_ACCENT_ORANGE;
        return Constants.COLOR_ACCENT_PURPLE;
    }
    getTypeBgColor(type: MaterialType): ResourceColor {
        if (type === MaterialType.PDF)
            return 0x1A0078D7;
        if (type === MaterialType.WORD)
            return 0x1A8B5CF6;
        if (type === MaterialType.MARKDOWN)
            return 0x1A10B981;
        if (type === MaterialType.WEB)
            return 0x1AF59E0B;
        return 0x1A8B5CF6;
    }
    getTypeLabel(type: MaterialType): string {
        if (type === MaterialType.PDF)
            return 'PDF';
        if (type === MaterialType.WORD)
            return 'Word';
        if (type === MaterialType.MARKDOWN)
            return 'MD';
        if (type === MaterialType.WEB)
            return 'WEB';
        return 'AI';
    }
    getSourceLabel(source: MaterialSource): string {
        if (source === MaterialSource.USER_UPLOAD)
            return '用户上传';
        if (source === MaterialSource.AI_SUPPLEMENT)
            return 'AI补充';
        return '联网检索';
    }
    getSourceColor(source: MaterialSource): ResourceColor {
        if (source === MaterialSource.USER_UPLOAD)
            return Constants.COLOR_PRIMARY;
        if (source === MaterialSource.AI_SUPPLEMENT)
            return Constants.COLOR_ACCENT_PURPLE;
        return Constants.COLOR_ACCENT_GREEN;
    }
    getSourceBgColor(source: MaterialSource): ResourceColor {
        if (source === MaterialSource.USER_UPLOAD)
            return 0x1A0078D7;
        if (source === MaterialSource.AI_SUPPLEMENT)
            return 0x1A8B5CF6;
        return 0x1A10B981;
    }
    buildKnowledgeBase(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.margin({ top: 16, bottom: 12 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('知识库');
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
            Row.create();
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('共' + this.getFilteredMaterials().length + '项');
            Text.fontSize(12);
            Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
            Text.margin({ right: 12 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('AI ' + this.getAIMaterials().length);
            Text.fontSize(12);
            Text.fontColor(Constants.COLOR_ACCENT_PURPLE);
            Text.margin({ right: 12 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('用户 ' + this.getUserMaterials().length);
            Text.fontSize(12);
            Text.fontColor(Constants.COLOR_PRIMARY);
        }, Text);
        Text.pop();
        Row.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ placeholder: '搜索知识库资料...', text: this.searchQuery });
            TextInput.width('100%');
            TextInput.height(40);
            TextInput.backgroundColor('#FFFFFF');
            TextInput.borderRadius(20);
            TextInput.padding({ left: 16, right: 16 });
            TextInput.onChange((value: string) => {
                this.searchQuery = value;
            });
            TextInput.margin({ bottom: 12 });
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.margin({ bottom: 12 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.padding({ top: 6, bottom: 6, left: 12, right: 12 });
            Column.backgroundColor(this.activeMaterialTab === 0 ? 0x1A0078D7 : 'transparent');
            Column.borderRadius(16);
            Column.onClick(() => {
                this.activeMaterialTab = 0;
            });
            Column.margin({ right: 8 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('全部');
            Text.fontSize(14);
            Text.fontWeight(this.activeMaterialTab === 0 ? FontWeight.Bold : FontWeight.Normal);
            Text.fontColor(this.activeMaterialTab === 0 ? Constants.COLOR_PRIMARY : Constants.COLOR_TEXT_SECONDARY);
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.padding({ top: 6, bottom: 6, left: 12, right: 12 });
            Column.backgroundColor(this.activeMaterialTab === 1 ? 0x1A0078D7 : 'transparent');
            Column.borderRadius(16);
            Column.onClick(() => {
                this.activeMaterialTab = 1;
            });
            Column.margin({ right: 8 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('AI补充');
            Text.fontSize(14);
            Text.fontWeight(this.activeMaterialTab === 1 ? FontWeight.Bold : FontWeight.Normal);
            Text.fontColor(this.activeMaterialTab === 1 ? Constants.COLOR_PRIMARY : Constants.COLOR_TEXT_SECONDARY);
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.padding({ top: 6, bottom: 6, left: 12, right: 12 });
            Column.backgroundColor(this.activeMaterialTab === 2 ? 0x1A0078D7 : 'transparent');
            Column.borderRadius(16);
            Column.onClick(() => {
                this.activeMaterialTab = 2;
            });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('用户上传');
            Text.fontSize(14);
            Text.fontWeight(this.activeMaterialTab === 2 ? FontWeight.Bold : FontWeight.Normal);
            Text.fontColor(this.activeMaterialTab === 2 ? Constants.COLOR_PRIMARY : Constants.COLOR_TEXT_SECONDARY);
        }, Text);
        Text.pop();
        Column.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.margin({ bottom: 8 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithChild();
            Button.layoutWeight(1);
            Button.height(40);
            Button.backgroundColor(Constants.COLOR_PRIMARY);
            Button.borderRadius(20);
            Button.onClick(() => {
                this.generateAIMaterials();
            });
        }, Button);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.isGeneratingMaterials) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        LoadingProgress.create();
                        LoadingProgress.width(16);
                        LoadingProgress.height(16);
                        LoadingProgress.margin({ right: 4 });
                    }, LoadingProgress);
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.isGeneratingMaterials ? '生成中...' : '🤖 AI补充资料');
            Text.fontSize(14);
            Text.fontColor('#FFFFFF');
        }, Text);
        Text.pop();
        Row.pop();
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithChild();
            Button.height(40);
            Button.backgroundColor('#FFFFFF');
            Button.borderRadius(20);
            Button.margin({ left: 8 });
            Button.onClick(() => {
                this.showUploadInput = !this.showUploadInput;
            });
            Button.shadow({ radius: 2, offsetY: 1, color: 0x0A000000 });
        }, Button);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.showUploadInput ? '✕ 收起' : '📤 上传');
            Text.fontSize(14);
            Text.fontColor(Constants.COLOR_TEXT);
        }, Text);
        Text.pop();
        Button.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.showUploadInput) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                        Column.padding(12);
                        Column.backgroundColor(Constants.COLOR_CARD);
                        Column.borderRadius(12);
                        Column.margin({ bottom: 12 });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        TextInput.create({ placeholder: '资料标题', text: this.uploadTitle });
                        TextInput.width('100%');
                        TextInput.height(40);
                        TextInput.backgroundColor('#FFFFFF');
                        TextInput.borderRadius(8);
                        TextInput.padding({ left: 12, right: 12 });
                        TextInput.onChange((value: string) => {
                            this.uploadTitle = value;
                        });
                        TextInput.margin({ bottom: 8 });
                    }, TextInput);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        TextInput.create({ placeholder: '粘贴内容或URL', text: this.uploadContent });
                        TextInput.width('100%');
                        TextInput.height(40);
                        TextInput.backgroundColor('#FFFFFF');
                        TextInput.borderRadius(8);
                        TextInput.padding({ left: 12, right: 12 });
                        TextInput.onChange((value: string) => {
                            this.uploadContent = value;
                        });
                        TextInput.margin({ bottom: 8 });
                    }, TextInput);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithChild();
                        Button.width('100%');
                        Button.height(36);
                        Button.backgroundColor(Constants.COLOR_PRIMARY);
                        Button.borderRadius(18);
                        Button.onClick(() => {
                            this.addUserMaterial();
                        });
                    }, Button);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('确认上传');
                        Text.fontSize(14);
                        Text.fontColor('#FFFFFF');
                    }, Text);
                    Text.pop();
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
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = _item => {
                const material = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Column.create();
                    Column.width('100%');
                    Column.padding(12);
                    Column.backgroundColor(Constants.COLOR_CARD);
                    Column.borderRadius(12);
                    Column.shadow({ radius: 2, offsetY: 1, color: 0x06000000 });
                    Column.margin({ bottom: 8 });
                    Column.onClick(() => {
                        this.selectedMaterial = material;
                        this.showMaterialDetail = true;
                        this.onMaterialClicked(material);
                    });
                }, Column);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Row.create();
                    Row.width('100%');
                }, Row);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Stack.create();
                    Stack.width(36);
                    Stack.height(36);
                }, Stack);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Circle.create();
                    Circle.width(36);
                    Circle.height(36);
                    Circle.fill(this.getTypeBgColor(material.type));
                }, Circle);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(this.getTypeLabel(material.type));
                    Text.fontSize(10);
                    Text.fontColor(this.getTypeColor(material.type));
                    Text.fontWeight(FontWeight.Bold);
                }, Text);
                Text.pop();
                Stack.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Column.create();
                    Column.layoutWeight(1);
                    Column.margin({ left: 10 });
                    Column.alignItems(HorizontalAlign.Start);
                }, Column);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(material.title);
                    Text.fontSize(14);
                    Text.fontWeight(FontWeight.Bold);
                    Text.fontColor(Constants.COLOR_TEXT);
                    Text.maxLines(1);
                    Text.textOverflow({ overflow: TextOverflow.Ellipsis });
                }, Text);
                Text.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(material.summary);
                    Text.fontSize(11);
                    Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
                    Text.margin({ top: 2 });
                    Text.maxLines(2);
                    Text.textOverflow({ overflow: TextOverflow.Ellipsis });
                }, Text);
                Text.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Row.create();
                    Row.margin({ top: 4 });
                }, Row);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(this.getTypeLabel(material.type));
                    Text.fontSize(10);
                    Text.fontColor(this.getTypeColor(material.type));
                    Text.padding({ top: 2, bottom: 2, left: 6, right: 6 });
                    Text.backgroundColor(this.getTypeBgColor(material.type));
                    Text.borderRadius(8);
                }, Text);
                Text.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(this.getSourceLabel(material.source));
                    Text.fontSize(10);
                    Text.fontColor(this.getSourceColor(material.source));
                    Text.padding({ top: 2, bottom: 2, left: 6, right: 6 });
                    Text.backgroundColor(this.getSourceBgColor(material.source));
                    Text.borderRadius(8);
                    Text.margin({ left: 6 });
                }, Text);
                Text.pop();
                Row.pop();
                Column.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create('→');
                    Text.fontSize(16);
                    Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
                    Text.margin({ left: 4 });
                }, Text);
                Text.pop();
                Row.pop();
                Column.pop();
            };
            this.forEachUpdateFunction(elmtId, this.getFilteredMaterials(), forEachItemGenFunction, (material: LearningMaterial) => material.id, false, false);
        }, ForEach);
        ForEach.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.getFilteredMaterials().length === 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                        Column.padding({ top: 32, bottom: 32 });
                        Column.alignItems(HorizontalAlign.Center);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('📚');
                        Text.fontSize(32);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('暂无学习资料');
                        Text.fontSize(14);
                        Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
                        Text.margin({ top: 8 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('点击按钮AI补充或手动上传学习资料');
                        Text.fontSize(12);
                        Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
                        Text.margin({ top: 4 });
                    }, Text);
                    Text.pop();
                    Column.pop();
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
    buildMaterialDetail(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor(0x66000000);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.layoutWeight(1);
            Column.onClick(() => {
                this.closeMaterialDetail();
            });
        }, Column);
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('90%');
            Column.padding(20);
            Column.backgroundColor(Constants.COLOR_CARD);
            Column.borderRadius({ topLeft: 20, topRight: 20 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.margin({ bottom: 12 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.selectedMaterial!.title);
            Text.fontSize(18);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(Constants.COLOR_TEXT);
            Text.layoutWeight(1);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('✕');
            Text.fontSize(20);
            Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
            Text.onClick(() => {
                this.closeMaterialDetail();
            });
        }, Text);
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.margin({ bottom: 12 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.getTypeLabel(this.selectedMaterial!.type));
            Text.fontSize(11);
            Text.fontColor('#FFFFFF');
            Text.padding({ top: 3, bottom: 3, left: 8, right: 8 });
            Text.backgroundColor(this.getTypeColor(this.selectedMaterial!.type));
            Text.borderRadius(10);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.getSourceLabel(this.selectedMaterial!.source));
            Text.fontSize(11);
            Text.fontColor(this.getSourceColor(this.selectedMaterial!.source));
            Text.padding({ top: 3, bottom: 3, left: 8, right: 8 });
            Text.backgroundColor(this.getSourceBgColor(this.selectedMaterial!.source));
            Text.borderRadius(10);
            Text.margin({ left: 8 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.selectedMaterial!.content.length >= 500) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('详细');
                        Text.fontSize(10);
                        Text.fontColor('#10B981');
                        Text.backgroundColor(0x1A10B981);
                        Text.padding({ left: 6, right: 6, top: 2, bottom: 2 });
                        Text.borderRadius(8);
                        Text.margin({ left: 6 });
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
            Scroll.create();
            Scroll.layoutWeight(1);
            Scroll.margin({ top: 8 });
        }, Scroll);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.selectedMaterial!.content.length > 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        if (this.selectedMaterial!.content.length < 300) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Row.create();
                                    Row.width('100%');
                                    Row.padding(12);
                                    Row.backgroundColor(0x1AF59E0B);
                                    Row.borderRadius(8);
                                    Row.margin({ bottom: 12 });
                                }, Row);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create('📝');
                                    Text.fontSize(14);
                                    Text.margin({ right: 6 });
                                }, Text);
                                Text.pop();
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create('当前内容较为简略，点击下方按钮生成完整详细讲解');
                                    Text.fontSize(12);
                                    Text.fontColor(Constants.COLOR_ACCENT_ORANGE);
                                    Text.lineHeight(18);
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
                        Text.create(this.selectedMaterial!.content);
                        Text.fontSize(14);
                        Text.fontColor(Constants.COLOR_TEXT);
                        Text.lineHeight(24);
                        Text.width('100%');
                    }, Text);
                    Text.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                        Column.padding({ top: 20, bottom: 20 });
                        Column.alignItems(HorizontalAlign.Center);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('暂无内容');
                        Text.fontSize(14);
                        Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
                        Text.margin({ bottom: 8 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('点击下方按钮即可让AI生成完整的详细教学内容');
                        Text.fontSize(12);
                        Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
                    }, Text);
                    Text.pop();
                    Column.pop();
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.selectedMaterial!.keywords.length > 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('关键词');
                        Text.fontSize(14);
                        Text.fontWeight(FontWeight.Bold);
                        Text.fontColor(Constants.COLOR_TEXT);
                        Text.width('100%');
                        Text.margin({ top: 16, bottom: 8 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Flex.create({ wrap: FlexWrap.Wrap });
                        Flex.width('100%');
                    }, Flex);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        ForEach.create();
                        const forEachItemGenFunction = _item => {
                            const kw = _item;
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create(kw);
                                Text.fontSize(11);
                                Text.fontColor(Constants.COLOR_PRIMARY);
                                Text.padding({ top: 4, bottom: 4, left: 10, right: 10 });
                                Text.backgroundColor(Constants.COLOR_ACCENT_BLUE_LIGHT);
                                Text.borderRadius(12);
                                Text.margin({ right: 6, bottom: 6 });
                            }, Text);
                            Text.pop();
                        };
                        this.forEachUpdateFunction(elmtId, this.selectedMaterial!.keywords, forEachItemGenFunction, (kw: string) => kw, false, false);
                    }, ForEach);
                    ForEach.pop();
                    Flex.pop();
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
            if (this.selectedMaterial!.content.length >= 500) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('提示：内容采用Markdown格式，## 表示章节标题，每个章节下包含详细讲解');
                        Text.fontSize(11);
                        Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
                        Text.width('100%');
                        Text.margin({ top: 16 });
                        Text.lineHeight(16);
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
        Scroll.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.aiEnabled) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithChild();
                        Button.width('100%');
                        Button.height(44);
                        Button.backgroundColor(Constants.COLOR_ACCENT_PURPLE);
                        Button.borderRadius(22);
                        Button.enabled(!this.isGeneratingDetail);
                        Button.onClick(() => {
                            this.generateAIForMaterial();
                        });
                        Button.margin({ top: 8 });
                    }, Button);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        if (this.isGeneratingDetail) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Row.create();
                                }, Row);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    LoadingProgress.create();
                                    LoadingProgress.width(18);
                                    LoadingProgress.height(18);
                                    LoadingProgress.margin({ right: 6 });
                                }, LoadingProgress);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create('正在生成详细讲解...');
                                    Text.fontSize(14);
                                    Text.fontColor('#FFFFFF');
                                }, Text);
                                Text.pop();
                                Row.pop();
                            });
                        }
                        else {
                            this.ifElseBranchUpdateFunction(1, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create('🤖 AI 深度讲解');
                                    Text.fontSize(14);
                                    Text.fontColor('#FFFFFF');
                                }, Text);
                                Text.pop();
                            });
                        }
                    }, If);
                    If.pop();
                    Button.pop();
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
            Button.height(40);
            Button.backgroundColor(Constants.COLOR_PRIMARY);
            Button.borderRadius(20);
            Button.margin({ top: 8 });
            Button.onClick(() => {
                this.closeMaterialDetail();
            });
        }, Button);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('关闭');
            Text.fontSize(14);
            Text.fontColor('#FFFFFF');
        }, Text);
        Text.pop();
        Button.pop();
        Column.pop();
        Column.pop();
    }
    closeMaterialDetail(): void {
        this.showMaterialDetail = false;
        this.selectedMaterial = null;
    }
    onMaterialClicked(material: LearningMaterial): void {
        if (material.content.length < 300 && this.aiEnabled && !this.isDetailLoading) {
            this.isDetailLoading = true;
            setTimeout(() => {
                this.generateAIForMaterial();
            }, 200);
        }
    }
    async generateAIForMaterial(): Promise<void> {
        if (!this.selectedMaterial || !this.aiEnabled) {
            return;
        }
        this.isGeneratingDetail = true;
        try {
            const detail = await aiService.generateMaterialDetail(this.courseTitle, this.selectedMaterial.title);
            if (detail.length > 200) {
                this.selectedMaterial.content = detail;
                this.selectedMaterial.summary = detail.length > 150 ? detail.substring(0, 150) + '...' : detail;
                const matId = this.selectedMaterial.id;
                for (let i = 0; i < this.materials.length; i++) {
                    if (this.materials[i].id === matId) {
                        this.materials[i].content = detail;
                        this.materials[i].summary = this.selectedMaterial.summary;
                        break;
                    }
                }
                globalData.setMaterials(this.courseId, this.materials);
                StorageUtil.saveData();
            }
        }
        catch (e) {
            console.error('Generate material detail failed: ' + JSON.stringify(e));
        }
        this.isGeneratingDetail = false;
    }
    async generateAIMaterials(): Promise<void> {
        this.isGeneratingMaterials = true;
        if (this.aiEnabled) {
            try {
                const response = await aiService.ask('请为"' + this.courseTitle + '"课程生成4个高质量学习资料。每个资料必须包含：标题、详细的Markdown格式教学内容（至少800字，包含##概述、##核心知识（3个小节）、##实践应用、##总结要点）、关键词数组。返回JSON数组，格式：[{"title": "...", "content": "...完整详细内容...", "keywords": [...]}]。内容一定要详细专业。', '你是顶级学科专家和教材撰写专家。生成的学习资料要有深度、有结构、有教育价值。每个资料的内容部分是完整的知识点讲解，不是摘要。使用Markdown格式。只返回JSON数组。');
                if (response.success) {
                    let content = response.content.trim();
                    if (content.startsWith('```json')) {
                        content = content.substring(7);
                    }
                    if (content.startsWith('```')) {
                        content = content.substring(3);
                    }
                    if (content.endsWith('```')) {
                        content = content.substring(0, content.length - 3);
                    }
                    content = content.trim();
                    const items = JSON.parse(content) as Record<string, Object>[];
                    const newMaterials: LearningMaterial[] = [];
                    for (let i = 0; i < items.length; i++) {
                        const item = items[i];
                        const itemContent = (item['content'] as string) || '';
                        if (itemContent.length < 200) {
                            continue;
                        }
                        const mat = LearningMaterial.createFromAI((item['title'] as string) || this.courseTitle + '资料' + (i + 1), itemContent, this.courseId, (item['keywords'] as string[]) || []);
                        mat.summary = (item['summary'] as string) || itemContent.substring(0, 100) + '...';
                        newMaterials.push(mat);
                    }
                    if (newMaterials.length >= 2) {
                        this.materials = this.materials.concat(newMaterials);
                        globalData.setMaterials(this.courseId, this.materials);
                        StorageUtil.saveData();
                    }
                    else {
                        this.addDefaultAIMaterials();
                    }
                }
                else {
                    this.addDefaultAIMaterials();
                }
            }
            catch (e) {
                console.error('AI generate materials failed: ' + JSON.stringify(e));
                this.addDefaultAIMaterials();
            }
        }
        else {
            this.addDefaultAIMaterials();
        }
        this.isGeneratingMaterials = false;
    }
    addDefaultAIMaterials(): void {
        const topic = this.courseTitle;
        const defaults: LearningMaterial[] = [];
        const d1 = LearningMaterial.createFromAI(topic + '核心知识体系深度解析', '## 概述\n\n' + topic + '的核心知识体系是一个多层次、多维度的知识网络。掌握这一体系是学好' + topic + '的关键。本资料将从头开始，系统性地构建起完整的知识框架。\n\n## 核心知识\n\n### 1. 理论基础\n' + topic + '的理论基础建立在前人大量研究和实践基础之上。其核心理论包括：系统论、信息论和控制论三大支柱。理解这些基础理论有助于把握' + topic + '的本质特征和发展规律。\n\n### 2. 方法论体系\n' + topic + '的方法论体系包含多个层面的分析方法和技术工具。从定性分析到定量计算，从理论推演到实证验证，形成了一个完整的方法工具箱。\n\n### 3. 应用框架\n将理论知识转化为实践能力，需要一个清晰的应用框架。本部分将介绍' + topic + '的标准应用流程和最佳实践模式。\n\n## 实践应用\n\n在实际学习中，建议采用"理解-练习-反思"的循环模式。每学习一个知识点后，立即通过练习来巩固，然后反思自己的理解是否存在偏差。\n\n## 总结要点\n1. 建立系统性认知是学好' + topic + '的第一步\n2. 理论与实践相结合是最有效的学习路径\n3. 持续反思和总结能够加速知识内化', this.courseId, ['知识框架', '核心概念', '方法论', '学习路径']);
        defaults.push(d1);
        const d2 = LearningMaterial.createFromAI(topic + '常见误区与避坑指南', '## 概述\n\n学习' + topic + '的过程中，初学者往往会陷入一些常见的误区和思维陷阱。提前了解这些误区，可以帮助你避开学习路上的"坑"，事半功倍。\n\n## 核心知识\n\n### 1. 概念混淆\n最常见的误区是混淆' + topic + '中的相近概念。例如对基本概念的理解停留在表面，没有深入把握其本质区别。建议通过对比学习法和案例分析法来加深理解。\n\n### 2. 方法误用\n很多学习者在掌握了某种方法后，会在所有场景中生搬硬套。正确的做法是根据具体问题选择合适的方法，必要时进行方法组合。\n\n### 3. 实践盲区\n理论学习充分但实践不足是另一个常见问题。知识只有在应用中才能真正内化。建议在每个学习阶段都配合相应的实践练习。\n\n## 实践应用\n\n建立一个"错题本"或"误区记录本"，记录自己在学习和实践中遇到的问题和错误，定期回顾和总结。\n\n## 总结要点\n1. 概念理解要追根溯源\n2. 方法选择要因地制宜\n3. 实践练习要贯穿始终', this.courseId, ['常见误区', '避坑指南', '概念辨析', '学习方法']);
        defaults.push(d2);
        const d3 = LearningMaterial.createFromAI(topic + '实践案例分析', '## 概述\n\n通过真实世界中的案例分析，将' + topic + '的抽象理论知识具体化、场景化，是最高效的学习方式之一。本资料精选多个经典案例进行深度剖析。\n\n## 核心知识\n\n### 1. 案例一：基础应用场景\n该案例展示了' + topic + '基础知识的典型应用场景。通过对这个案例的详细分析，学习者可以建立起"理论→实践"的基本认知路径。\n\n### 2. 案例二：复杂问题解决\n在掌握了基础应用后，本案例展示了如何运用' + topic + '知识解决更复杂的实际问题。这需要学习者具备知识整合和灵活运用的能力。\n\n### 3. 案例三：创新性应用\n最高层次的应用是创新。本案例展示了如何在前人工作的基础上，运用' + topic + '知识进行创新性的探索和实践。\n\n## 实践应用\n\n建议学习者在阅读案例的同时，尝试自己动手复现案例中的分析和决策过程。只有亲手做一遍，才能真正理解其中的精髓。\n\n## 总结要点\n1. 案例学习是连接理论和实践的桥梁\n2. 从模仿到创新是能力提升的必由之路\n3. 多角度分析案例能够拓宽思维视野', this.courseId, ['实践案例', '应用分析', '场景学习', '最佳实践']);
        defaults.push(d3);
        this.materials = this.materials.concat(defaults);
        globalData.setMaterials(this.courseId, this.materials);
        StorageUtil.saveData();
    }
    addUserMaterial(): void {
        if (this.uploadTitle.length === 0) {
            AlertDialog.show({
                title: '提示',
                message: '请输入资料标题',
                confirm: { value: '确定', action: () => { } }
            });
            return;
        }
        const material = LearningMaterial.createFromUpload(this.uploadTitle, this.uploadContent.startsWith('http') ? MaterialType.WEB : MaterialType.MARKDOWN, this.uploadContent, this.courseId);
        material.summary = MaterialParser.generateSummary(this.uploadContent, 100);
        this.materials = this.materials.concat([material]);
        globalData.setMaterials(this.courseId, this.materials);
        StorageUtil.saveData();
        this.uploadTitle = '';
        this.uploadContent = '';
        this.showUploadInput = false;
        AlertDialog.show({
            title: '上传成功',
            message: '资料"' + material.title + '"已添加到知识库',
            confirm: { value: '确定', action: () => { } }
        });
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "LearningSpace";
    }
}
registerNamedRoute(() => new LearningSpace(undefined, {}), "", { bundleName: "com.threeq.learner", moduleName: "entry", pagePath: "pages/LearningSpace", pageFullPath: "entry/src/main/ets/pages/LearningSpace", integratedHsp: "false", moduleType: "followWithHap" });
