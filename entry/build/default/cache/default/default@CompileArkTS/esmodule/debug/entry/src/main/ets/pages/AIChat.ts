if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface AIChat_Params {
    courseId?: string;
    courseTitle?: string;
    messages?: ChatRecord[];
    inputText?: string;
    isLoading?: boolean;
    isConfigured?: boolean;
    scrollHeight?: number;
    chatHistory?: ChatMessage[];
    scroller?: Scroller;
}
import router from "@ohos:router";
import { aiService } from "@normalized:N&&&entry/src/main/ets/model/AIService&";
import type { ChatMessage } from "@normalized:N&&&entry/src/main/ets/model/AIService&";
import { Constants } from "@normalized:N&&&entry/src/main/ets/utils/Constants&";
interface ChatRecord {
    role: 'user' | 'assistant';
    content: string;
    time: number;
}
class AIChat extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__courseId = new ObservedPropertySimplePU('', this, "courseId");
        this.__courseTitle = new ObservedPropertySimplePU('', this, "courseTitle");
        this.__messages = new ObservedPropertyObjectPU([], this, "messages");
        this.__inputText = new ObservedPropertySimplePU('', this, "inputText");
        this.__isLoading = new ObservedPropertySimplePU(false, this, "isLoading");
        this.__isConfigured = new ObservedPropertySimplePU(false, this, "isConfigured");
        this.__scrollHeight = new ObservedPropertySimplePU(0, this, "scrollHeight");
        this.chatHistory = [];
        this.scroller = new Scroller();
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: AIChat_Params) {
        if (params.courseId !== undefined) {
            this.courseId = params.courseId;
        }
        if (params.courseTitle !== undefined) {
            this.courseTitle = params.courseTitle;
        }
        if (params.messages !== undefined) {
            this.messages = params.messages;
        }
        if (params.inputText !== undefined) {
            this.inputText = params.inputText;
        }
        if (params.isLoading !== undefined) {
            this.isLoading = params.isLoading;
        }
        if (params.isConfigured !== undefined) {
            this.isConfigured = params.isConfigured;
        }
        if (params.scrollHeight !== undefined) {
            this.scrollHeight = params.scrollHeight;
        }
        if (params.chatHistory !== undefined) {
            this.chatHistory = params.chatHistory;
        }
        if (params.scroller !== undefined) {
            this.scroller = params.scroller;
        }
    }
    updateStateVars(params: AIChat_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__courseId.purgeDependencyOnElmtId(rmElmtId);
        this.__courseTitle.purgeDependencyOnElmtId(rmElmtId);
        this.__messages.purgeDependencyOnElmtId(rmElmtId);
        this.__inputText.purgeDependencyOnElmtId(rmElmtId);
        this.__isLoading.purgeDependencyOnElmtId(rmElmtId);
        this.__isConfigured.purgeDependencyOnElmtId(rmElmtId);
        this.__scrollHeight.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__courseId.aboutToBeDeleted();
        this.__courseTitle.aboutToBeDeleted();
        this.__messages.aboutToBeDeleted();
        this.__inputText.aboutToBeDeleted();
        this.__isLoading.aboutToBeDeleted();
        this.__isConfigured.aboutToBeDeleted();
        this.__scrollHeight.aboutToBeDeleted();
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
    private __messages: ObservedPropertyObjectPU<ChatRecord[]>;
    get messages() {
        return this.__messages.get();
    }
    set messages(newValue: ChatRecord[]) {
        this.__messages.set(newValue);
    }
    private __inputText: ObservedPropertySimplePU<string>;
    get inputText() {
        return this.__inputText.get();
    }
    set inputText(newValue: string) {
        this.__inputText.set(newValue);
    }
    private __isLoading: ObservedPropertySimplePU<boolean>;
    get isLoading() {
        return this.__isLoading.get();
    }
    set isLoading(newValue: boolean) {
        this.__isLoading.set(newValue);
    }
    private __isConfigured: ObservedPropertySimplePU<boolean>;
    get isConfigured() {
        return this.__isConfigured.get();
    }
    set isConfigured(newValue: boolean) {
        this.__isConfigured.set(newValue);
    }
    private __scrollHeight: ObservedPropertySimplePU<number>;
    get scrollHeight() {
        return this.__scrollHeight.get();
    }
    set scrollHeight(newValue: number) {
        this.__scrollHeight.set(newValue);
    }
    private chatHistory: ChatMessage[];
    private scroller: Scroller;
    aboutToAppear(): void {
        aiService.loadConfig();
        this.isConfigured = aiService.isConfigured();
        // 获取路由参数
        const params = router.getParams() as Record<string, string>;
        if (params) {
            this.courseId = params['courseId'] || '';
            this.courseTitle = params['courseTitle'] || '鸿蒙开发';
        }
        // 添加欢迎消息
        if (this.isConfigured) {
            this.messages.push({
                role: 'assistant',
                content: `你好！我是你的${this.courseTitle}学习导师。\n\n你可以问我关于${this.courseTitle}的任何问题，我会帮助你深入理解相关知识。\n\n试着问我：\n• ${this.courseTitle}的核心概念是什么？\n• 如何快速入门${this.courseTitle}？\n• ${this.courseTitle}有哪些最佳实践？`,
                time: Date.now()
            });
        }
        else {
            this.messages.push({
                role: 'assistant',
                content: 'AI服务未配置，请先在设置中配置API Key。',
                time: Date.now()
            });
        }
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
            If.create();
            if (this.isConfigured) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.buildChatArea.bind(this)();
                    this.buildInputArea.bind(this)();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.buildNotConfigured.bind(this)();
                });
            }
        }, If);
        If.pop();
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
            Text.create('◀');
            Text.fontSize(24);
            Text.fontColor(Constants.COLOR_PRIMARY);
            Text.onClick(() => {
                router.back();
            });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.alignItems(HorizontalAlign.Start);
            Column.layoutWeight(1);
            Column.margin({ left: 12 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('AI 学习助手');
            Text.fontSize(18);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(Constants.COLOR_TEXT);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.courseTitle);
            Text.fontSize(12);
            Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
            Text.margin({ top: 2 });
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create();
            Stack.width(36);
            Stack.height(36);
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Circle.create();
            Circle.width(36);
            Circle.height(36);
            Circle.fill(Constants.COLOR_PRIMARY);
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
    }
    buildChatArea(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Scroll.create(this.scroller);
            Scroll.layoutWeight(1);
            Scroll.width('100%');
            Scroll.backgroundColor(Constants.COLOR_BACKGROUND);
        }, Scroll);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.padding({ left: 16, right: 16, top: 12, bottom: 12 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = (_item, index: number) => {
                const msg = _item;
                this.buildMessageItem.bind(this)(msg, index);
            };
            this.forEachUpdateFunction(elmtId, this.messages, forEachItemGenFunction, (msg: ChatRecord) => msg.time.toString(), true, false);
        }, ForEach);
        ForEach.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.isLoading) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.buildLoadingIndicator.bind(this)();
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
    }
    buildMessageItem(msg: ChatRecord, index: number, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.margin({ bottom: 12 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (msg.role === 'user') {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 用户消息 - 右对齐
                        Row.create();
                        // 用户消息 - 右对齐
                        Row.width('100%');
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Blank.create();
                    }, Blank);
                    Blank.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.padding({ left: 14, right: 14, top: 10, bottom: 10 });
                        Column.backgroundColor(Constants.COLOR_PRIMARY);
                        Column.borderRadius({ topLeft: 16, topRight: 4, bottomLeft: 16, bottomRight: 16 });
                        Column.constraintSize({ maxWidth: '75%' });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(msg.content);
                        Text.fontSize(14);
                        Text.fontColor('#FFFFFF');
                        Text.lineHeight(22);
                    }, Text);
                    Text.pop();
                    Column.pop();
                    // 用户消息 - 右对齐
                    Row.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // AI消息 - 左对齐
                        Row.create();
                        // AI消息 - 左对齐
                        Row.width('100%');
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.padding({ left: 14, right: 14, top: 10, bottom: 10 });
                        Column.backgroundColor('#FFFFFF');
                        Column.borderRadius({ topLeft: 4, topRight: 16, bottomLeft: 16, bottomRight: 16 });
                        Column.constraintSize({ maxWidth: '85%' });
                        Column.alignItems(HorizontalAlign.Start);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(msg.content);
                        Text.fontSize(14);
                        Text.fontColor(Constants.COLOR_TEXT);
                        Text.lineHeight(22);
                    }, Text);
                    Text.pop();
                    Column.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Blank.create();
                    }, Blank);
                    Blank.pop();
                    // AI消息 - 左对齐
                    Row.pop();
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.formatTime(msg.time));
            Text.fontSize(10);
            Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
            Text.width('100%');
            Text.textAlign(msg.role === 'user' ? TextAlign.End : TextAlign.Start);
            Text.margin({ top: 4 });
        }, Text);
        Text.pop();
        Column.pop();
    }
    buildLoadingIndicator(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.margin({ bottom: 12 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.padding({ left: 14, right: 14, top: 10, bottom: 10 });
            Column.backgroundColor('#FFFFFF');
            Column.borderRadius(16);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            LoadingProgress.create();
            LoadingProgress.width(20);
            LoadingProgress.height(20);
            LoadingProgress.color(Constants.COLOR_PRIMARY);
        }, LoadingProgress);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('AI正在思考...');
            Text.fontSize(12);
            Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
            Text.margin({ left: 8 });
        }, Text);
        Text.pop();
        Row.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        Row.pop();
    }
    buildInputArea(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.padding({ left: 16, right: 16, top: 8, bottom: 12 });
            Column.backgroundColor('#FFFFFF');
            Column.border({ width: { top: 1 }, color: 0x10000000 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 快捷问题
            Scroll.create();
            // 快捷问题
            Scroll.width('100%');
            // 快捷问题
            Scroll.scrollable(ScrollDirection.Horizontal);
            // 快捷问题
            Scroll.height(40);
            // 快捷问题
            Scroll.scrollBar(BarState.Off);
        }, Scroll);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.padding({ left: 4, right: 4 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = _item => {
                const q = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(q);
                    Text.fontSize(11);
                    Text.fontColor(Constants.COLOR_PRIMARY);
                    Text.backgroundColor(0x0F0078D7);
                    Text.padding({ left: 10, right: 10, top: 6, bottom: 6 });
                    Text.borderRadius(16);
                    Text.margin({ right: 8 });
                    Text.onClick(() => {
                        this.inputText = q;
                        this.sendMessage();
                    });
                }, Text);
                Text.pop();
            };
            this.forEachUpdateFunction(elmtId, this.getQuickQuestions(), forEachItemGenFunction, (q: string) => q, false, false);
        }, ForEach);
        ForEach.pop();
        Row.pop();
        // 快捷问题
        Scroll.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 输入框
            Row.create();
            // 输入框
            Row.width('100%');
            // 输入框
            Row.margin({ top: 8 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextArea.create({ placeholder: '输入你的问题...', text: this.inputText });
            TextArea.layoutWeight(1);
            TextArea.height(44);
            TextArea.backgroundColor('#FFFFFF');
            TextArea.borderRadius(22);
            TextArea.placeholderColor(Constants.COLOR_TEXT_SECONDARY);
            TextArea.onChange((val: string) => {
                this.inputText = val;
            });
            TextArea.onSubmit(() => {
                this.sendMessage();
            });
        }, TextArea);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create();
            Stack.width(44);
            Stack.height(44);
            Stack.margin({ left: 8 });
            Stack.onClick(() => {
                if (this.inputText.length > 0) {
                    this.sendMessage();
                }
            });
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Circle.create();
            Circle.width(44);
            Circle.height(44);
            Circle.fill(this.inputText.length > 0 ? Constants.COLOR_PRIMARY : 0x20000000);
        }, Circle);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('发送');
            Text.fontSize(12);
            Text.fontColor(this.inputText.length > 0 ? '#FFFFFF' : Constants.COLOR_TEXT_SECONDARY);
            Text.fontWeight(FontWeight.Bold);
        }, Text);
        Text.pop();
        Stack.pop();
        // 输入框
        Row.pop();
        Column.pop();
    }
    buildNotConfigured(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.layoutWeight(1);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create();
            Stack.width(80);
            Stack.height(80);
            Stack.margin({ top: 80 });
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Circle.create();
            Circle.width(80);
            Circle.height(80);
            Circle.fill(0x0F0078D7);
        }, Circle);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('AI');
            Text.fontSize(32);
            Text.fontColor(Constants.COLOR_PRIMARY);
            Text.fontWeight(FontWeight.Bold);
        }, Text);
        Text.pop();
        Stack.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('AI服务未配置');
            Text.fontSize(20);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(Constants.COLOR_TEXT);
            Text.margin({ top: 20 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('请先配置API Key以启用AI学习助手功能');
            Text.fontSize(14);
            Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
            Text.margin({ top: 8 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('前往设置');
            Button.width(160);
            Button.height(48);
            Button.backgroundColor(Constants.COLOR_PRIMARY);
            Button.fontColor('#FFFFFF');
            Button.borderRadius(24);
            Button.margin({ top: 24 });
            Button.onClick(() => {
                router.pushUrl({ url: 'pages/AISettings' });
            });
        }, Button);
        Button.pop();
        Column.pop();
    }
    getQuickQuestions(): string[] {
        return [
            '核心概念是什么？',
            '如何快速入门？',
            '有哪些最佳实践？',
            '常见问题有哪些？',
            '推荐学习路径？',
            '实际应用案例？'
        ];
    }
    formatTime(timestamp: number): string {
        const date = new Date(timestamp);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }
    async sendMessage(): Promise<void> {
        const text = this.inputText.trim();
        if (!text || this.isLoading)
            return;
        // 添加用户消息
        this.messages.push({
            role: 'user',
            content: text,
            time: Date.now()
        });
        this.inputText = '';
        this.isLoading = true;
        // 更新聊天历史
        this.chatHistory.push({ role: 'user', content: text });
        // 滚动到底部
        setTimeout(() => {
            this.scroller.scrollEdge(Edge.Bottom);
        }, 100);
        // 调用AI
        const response = await aiService.chatLearn(this.courseTitle, text, this.chatHistory);
        this.isLoading = false;
        if (response.success) {
            // 添加AI回复
            this.messages.push({
                role: 'assistant',
                content: response.content,
                time: Date.now()
            });
            this.chatHistory.push({ role: 'assistant', content: response.content });
        }
        else {
            // 显示错误
            this.messages.push({
                role: 'assistant',
                content: '抱歉，发生了错误：' + (response.error || '未知错误'),
                time: Date.now()
            });
        }
        // 滚动到底部
        setTimeout(() => {
            this.scroller.scrollEdge(Edge.Bottom);
        }, 100);
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "AIChat";
    }
}
registerNamedRoute(() => new AIChat(undefined, {}), "", { bundleName: "com.threeq.learner", moduleName: "entry", pagePath: "pages/AIChat", pageFullPath: "entry/src/main/ets/pages/AIChat", integratedHsp: "false", moduleType: "followWithHap" });
