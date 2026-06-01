if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface AISettings_Params {
    apiKey?: string;
    baseUrl?: string;
    model?: string;
    aiEnabled?: boolean;
    showApiKey?: boolean;
    testResult?: string;
    isTesting?: boolean;
    presetModels?: string[];
    presetUrls?: string[];
}
import router from "@ohos:router";
import { aiService, AIService } from "@normalized:N&&&entry/src/main/ets/model/AIService&";
import { Constants } from "@normalized:N&&&entry/src/main/ets/utils/Constants&";
class AISettings extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__apiKey = new ObservedPropertySimplePU('', this, "apiKey");
        this.__baseUrl = new ObservedPropertySimplePU('', this, "baseUrl");
        this.__model = new ObservedPropertySimplePU('', this, "model");
        this.__aiEnabled = new ObservedPropertySimplePU(false, this, "aiEnabled");
        this.__showApiKey = new ObservedPropertySimplePU(false, this, "showApiKey");
        this.__testResult = new ObservedPropertySimplePU('', this, "testResult");
        this.__isTesting = new ObservedPropertySimplePU(false, this, "isTesting");
        this.presetModels = [
            'deepseek-chat',
            'deepseek-coder',
            'gpt-3.5-turbo',
            'gpt-4',
            'gpt-4-turbo',
            'qwen-turbo',
            'qwen-plus',
            'glm-4',
            'claude-3-sonnet',
            'claude-3-opus'
        ];
        this.presetUrls = [
            'https://api.deepseek.com/v1',
            'https://api.openai.com/v1',
            'https://dashscope.aliyuncs.com/compatible-mode/v1',
            'https://open.bigmodel.cn/api/paas/v4',
            'https://api.anthropic.com/v1'
        ];
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: AISettings_Params) {
        if (params.apiKey !== undefined) {
            this.apiKey = params.apiKey;
        }
        if (params.baseUrl !== undefined) {
            this.baseUrl = params.baseUrl;
        }
        if (params.model !== undefined) {
            this.model = params.model;
        }
        if (params.aiEnabled !== undefined) {
            this.aiEnabled = params.aiEnabled;
        }
        if (params.showApiKey !== undefined) {
            this.showApiKey = params.showApiKey;
        }
        if (params.testResult !== undefined) {
            this.testResult = params.testResult;
        }
        if (params.isTesting !== undefined) {
            this.isTesting = params.isTesting;
        }
        if (params.presetModels !== undefined) {
            this.presetModels = params.presetModels;
        }
        if (params.presetUrls !== undefined) {
            this.presetUrls = params.presetUrls;
        }
    }
    updateStateVars(params: AISettings_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__apiKey.purgeDependencyOnElmtId(rmElmtId);
        this.__baseUrl.purgeDependencyOnElmtId(rmElmtId);
        this.__model.purgeDependencyOnElmtId(rmElmtId);
        this.__aiEnabled.purgeDependencyOnElmtId(rmElmtId);
        this.__showApiKey.purgeDependencyOnElmtId(rmElmtId);
        this.__testResult.purgeDependencyOnElmtId(rmElmtId);
        this.__isTesting.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__apiKey.aboutToBeDeleted();
        this.__baseUrl.aboutToBeDeleted();
        this.__model.aboutToBeDeleted();
        this.__aiEnabled.aboutToBeDeleted();
        this.__showApiKey.aboutToBeDeleted();
        this.__testResult.aboutToBeDeleted();
        this.__isTesting.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __apiKey: ObservedPropertySimplePU<string>;
    get apiKey() {
        return this.__apiKey.get();
    }
    set apiKey(newValue: string) {
        this.__apiKey.set(newValue);
    }
    private __baseUrl: ObservedPropertySimplePU<string>;
    get baseUrl() {
        return this.__baseUrl.get();
    }
    set baseUrl(newValue: string) {
        this.__baseUrl.set(newValue);
    }
    private __model: ObservedPropertySimplePU<string>;
    get model() {
        return this.__model.get();
    }
    set model(newValue: string) {
        this.__model.set(newValue);
    }
    private __aiEnabled: ObservedPropertySimplePU<boolean>;
    get aiEnabled() {
        return this.__aiEnabled.get();
    }
    set aiEnabled(newValue: boolean) {
        this.__aiEnabled.set(newValue);
    }
    private __showApiKey: ObservedPropertySimplePU<boolean>;
    get showApiKey() {
        return this.__showApiKey.get();
    }
    set showApiKey(newValue: boolean) {
        this.__showApiKey.set(newValue);
    }
    private __testResult: ObservedPropertySimplePU<string>;
    get testResult() {
        return this.__testResult.get();
    }
    set testResult(newValue: string) {
        this.__testResult.set(newValue);
    }
    private __isTesting: ObservedPropertySimplePU<boolean>;
    get isTesting() {
        return this.__isTesting.get();
    }
    set isTesting(newValue: boolean) {
        this.__isTesting.set(newValue);
    }
    // 预设模型列表（DeepSeek排首位）
    private presetModels: string[];
    // 预设API地址
    private presetUrls: string[];
    aboutToAppear(): void {
        aiService.loadConfig();
        const config = aiService.getConfig();
        this.apiKey = config.apiKey;
        this.baseUrl = config.baseUrl;
        this.model = config.model;
        this.aiEnabled = config.enabled;
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
        }, Scroll);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.padding({ left: 20, right: 20 });
        }, Column);
        this.buildStatusCard.bind(this)();
        this.buildApiConfig.bind(this)();
        this.buildModelConfig.bind(this)();
        this.buildPresetCards.bind(this)();
        this.buildActionButtons.bind(this)();
        Column.pop();
        Scroll.pop();
        Column.pop();
    }
    buildHeader(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.padding({ left: 20, right: 20, top: 16, bottom: 16 });
            Row.backgroundColor('#FFFFFF');
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
            Text.create('AI 设置');
            Text.fontSize(20);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(Constants.COLOR_TEXT);
            Text.margin({ left: 16 });
            Text.layoutWeight(1);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.aiEnabled) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('已启用');
                        Text.fontSize(12);
                        Text.fontColor('#FFFFFF');
                        Text.backgroundColor(Constants.COLOR_ACCENT_GREEN);
                        Text.padding({ left: 8, right: 8, top: 4, bottom: 4 });
                        Text.borderRadius(12);
                    }, Text);
                    Text.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('未启用');
                        Text.fontSize(12);
                        Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
                        Text.backgroundColor(0x10000000);
                        Text.padding({ left: 8, right: 8, top: 4, bottom: 4 });
                        Text.borderRadius(12);
                    }, Text);
                    Text.pop();
                });
            }
        }, If);
        If.pop();
        Row.pop();
    }
    buildStatusCard(parent = null) {
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
            Stack.create();
            Stack.width(48);
            Stack.height(48);
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Circle.create();
            Circle.width(48);
            Circle.height(48);
            Circle.fill(this.aiEnabled ? Constants.COLOR_ACCENT_GREEN : 0x20000000);
        }, Circle);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.aiEnabled ? '✓' : '?');
            Text.fontSize(24);
            Text.fontColor(this.aiEnabled ? '#FFFFFF' : Constants.COLOR_TEXT_SECONDARY);
        }, Text);
        Text.pop();
        Stack.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.alignItems(HorizontalAlign.Start);
            Column.layoutWeight(1);
            Column.margin({ left: 12 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.aiEnabled ? 'AI 服务已配置' : 'AI 服务未配置');
            Text.fontSize(16);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(Constants.COLOR_TEXT);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.aiEnabled ? `当前模型: ${this.model}` : '请配置API Key以启用AI功能');
            Text.fontSize(12);
            Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
            Text.margin({ top: 4 });
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Toggle.create({ type: ToggleType.Switch, isOn: this.aiEnabled });
            Toggle.onChange((isOn: boolean) => {
                this.aiEnabled = isOn;
                this.saveConfig();
            });
        }, Toggle);
        Toggle.pop();
        Row.pop();
        Column.pop();
    }
    buildApiConfig(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.padding(16);
            Column.backgroundColor(Constants.COLOR_CARD);
            Column.borderRadius(16);
            Column.margin({ top: 12 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('API 配置');
            Text.fontSize(16);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(Constants.COLOR_TEXT);
            Text.width('100%');
            Text.margin({ bottom: 12 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // API Key
            Column.create();
            // API Key
            Column.width('100%');
            // API Key
            Column.margin({ bottom: 12 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.margin({ bottom: 6 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('API Key');
            Text.fontSize(12);
            Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.baseUrl.includes('deepseek')) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('DeepSeek Key已内置');
                        Text.fontSize(10);
                        Text.fontColor('#10B981');
                        Text.margin({ left: 8 });
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
            Row.create();
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.showApiKey) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        TextInput.create({ text: this.apiKey });
                        TextInput.layoutWeight(1);
                        TextInput.height(44);
                        TextInput.backgroundColor('#F5F5F5');
                        TextInput.borderRadius(8);
                        TextInput.onChange((val: string) => {
                            this.apiKey = val;
                        });
                    }, TextInput);
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        TextInput.create({ text: this.apiKey });
                        TextInput.layoutWeight(1);
                        TextInput.height(44);
                        TextInput.backgroundColor('#F5F5F5');
                        TextInput.borderRadius(8);
                        TextInput.type(InputType.Password);
                        TextInput.onChange((val: string) => {
                            this.apiKey = val;
                        });
                    }, TextInput);
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.showApiKey ? '隐藏' : '显示');
            Text.fontSize(12);
            Text.fontColor(Constants.COLOR_PRIMARY);
            Text.margin({ left: 8 });
            Text.onClick(() => {
                this.showApiKey = !this.showApiKey;
            });
        }, Text);
        Text.pop();
        Row.pop();
        // API Key
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // Base URL
            Column.create();
            // Base URL
            Column.width('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('API 地址');
            Text.fontSize(12);
            Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
            Text.width('100%');
            Text.margin({ bottom: 6 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ text: this.baseUrl });
            TextInput.width('100%');
            TextInput.height(44);
            TextInput.backgroundColor('#F5F5F5');
            TextInput.borderRadius(8);
            TextInput.onChange((val: string) => {
                this.baseUrl = val;
            });
        }, TextInput);
        // Base URL
        Column.pop();
        Column.pop();
    }
    buildModelConfig(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.padding(16);
            Column.backgroundColor(Constants.COLOR_CARD);
            Column.borderRadius(16);
            Column.margin({ top: 12 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('模型选择');
            Text.fontSize(16);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(Constants.COLOR_TEXT);
            Text.width('100%');
            Text.margin({ bottom: 12 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ placeholder: '输入模型名称', text: this.model });
            TextInput.width('100%');
            TextInput.height(44);
            TextInput.backgroundColor('#F5F5F5');
            TextInput.borderRadius(8);
            TextInput.onChange((val: string) => {
                this.model = val;
            });
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('常用模型');
            Text.fontSize(12);
            Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
            Text.width('100%');
            Text.margin({ top: 12, bottom: 8 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Flex.create({ wrap: FlexWrap.Wrap });
            Flex.width('100%');
        }, Flex);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = _item => {
                const m = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(m);
                    Text.fontSize(11);
                    Text.fontColor(this.model === m ? '#FFFFFF' : Constants.COLOR_PRIMARY);
                    Text.backgroundColor(this.model === m ? Constants.COLOR_PRIMARY : 0x0F0078D7);
                    Text.padding({ left: 10, right: 10, top: 6, bottom: 6 });
                    Text.borderRadius(16);
                    Text.margin({ right: 6, bottom: 6 });
                    Text.onClick(() => {
                        this.model = m;
                    });
                }, Text);
                Text.pop();
            };
            this.forEachUpdateFunction(elmtId, this.presetModels, forEachItemGenFunction, (m: string) => m, false, false);
        }, ForEach);
        ForEach.pop();
        Flex.pop();
        Column.pop();
    }
    buildPresetCards(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.padding(16);
            Column.backgroundColor(Constants.COLOR_CARD);
            Column.borderRadius(16);
            Column.margin({ top: 12 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('预设配置（一键配置）');
            Text.fontSize(16);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(Constants.COLOR_TEXT);
            Text.width('100%');
            Text.margin({ bottom: 12 });
        }, Text);
        Text.pop();
        this.buildPresetItem.bind(this)('DeepSeek（内置Key·即开即用）', 'https://api.deepseek.com/v1', 'deepseek-chat', '#6366F1', true);
        this.buildPresetItem.bind(this)('OpenAI', 'https://api.openai.com/v1', 'gpt-3.5-turbo', Constants.COLOR_PRIMARY, false);
        this.buildPresetItem.bind(this)('通义千问', 'https://dashscope.aliyuncs.com/compatible-mode/v1', 'qwen-turbo', '#F97316', false);
        this.buildPresetItem.bind(this)('智谱GLM', 'https://open.bigmodel.cn/api/paas/v4', 'glm-4', '#10B981', false);
        Column.pop();
    }
    buildPresetItem(name: string, url: string, model: string, color: ResourceColor, hasBuiltInKey: boolean, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.padding({ top: 8, bottom: 8 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.alignItems(HorizontalAlign.Start);
            Column.layoutWeight(1);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(name);
            Text.fontSize(14);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(Constants.COLOR_TEXT);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (hasBuiltInKey) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('Key内置');
                        Text.fontSize(9);
                        Text.fontColor('#FFFFFF');
                        Text.backgroundColor('#10B981');
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
            Text.create(model);
            Text.fontSize(11);
            Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
            Text.margin({ top: 2 });
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('使用');
            Text.fontSize(12);
            Text.fontColor('#FFFFFF');
            Text.backgroundColor(color);
            Text.padding({ left: 12, right: 12, top: 6, bottom: 6 });
            Text.borderRadius(16);
            Text.onClick(() => {
                this.baseUrl = url;
                this.model = model;
                if (hasBuiltInKey) {
                    const defaultCfg = AIService.getDefaultDeepSeekConfig();
                    this.apiKey = defaultCfg.apiKey;
                    this.aiEnabled = true;
                }
            });
        }, Text);
        Text.pop();
        Row.pop();
    }
    buildActionButtons(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.margin({ top: 16 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 测试连接
            Button.createWithLabel(this.isTesting ? '测试中...' : '测试连接');
            // 测试连接
            Button.width('100%');
            // 测试连接
            Button.height(48);
            // 测试连接
            Button.backgroundColor(Constants.COLOR_CARD);
            // 测试连接
            Button.fontColor(Constants.COLOR_PRIMARY);
            // 测试连接
            Button.borderRadius(24);
            // 测试连接
            Button.enabled(!this.isTesting && this.apiKey.length > 0);
            // 测试连接
            Button.onClick(() => {
                this.testConnection();
            });
        }, Button);
        // 测试连接
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.testResult.length > 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.testResult);
                        Text.fontSize(12);
                        Text.fontColor(this.testResult.includes('成功') ? Constants.COLOR_ACCENT_GREEN : Constants.COLOR_ACCENT_RED);
                        Text.margin({ top: 8 });
                    }, Text);
                    Text.pop();
                });
            }
            // 保存配置
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 保存配置
            Button.createWithLabel('保存配置');
            // 保存配置
            Button.width('100%');
            // 保存配置
            Button.height(48);
            // 保存配置
            Button.backgroundColor(Constants.COLOR_PRIMARY);
            // 保存配置
            Button.fontColor('#FFFFFF');
            // 保存配置
            Button.borderRadius(24);
            // 保存配置
            Button.margin({ top: 12 });
            // 保存配置
            Button.onClick(() => {
                this.saveConfig();
                AlertDialog.show({
                    title: '保存成功',
                    message: 'AI配置已保存',
                    confirm: { value: '好的', action: () => { } }
                });
            });
        }, Button);
        // 保存配置
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 使用说明
            Column.create();
            // 使用说明
            Column.width('100%');
            // 使用说明
            Column.padding(16);
            // 使用说明
            Column.backgroundColor(0x05000000);
            // 使用说明
            Column.borderRadius(12);
            // 使用说明
            Column.margin({ top: 16, bottom: 20 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('使用说明');
            Text.fontSize(14);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(Constants.COLOR_TEXT);
            Text.width('100%');
            Text.margin({ bottom: 8 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('✅ DeepSeek已内置API Key，点击"一键使用"即可');
            Text.fontSize(11);
            Text.fontColor('#10B981');
            Text.width('100%');
            Text.margin({ bottom: 4 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('1. 其他平台需访问对应官网注册获取API Key');
            Text.fontSize(11);
            Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
            Text.width('100%');
            Text.margin({ bottom: 4 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('2. 支持OpenAI兼容格式的API（包括国产大模型）');
            Text.fontSize(11);
            Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
            Text.width('100%');
            Text.margin({ bottom: 4 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('3. 配置后即可使用AI生成知识图谱、争议点、测评题');
            Text.fontSize(11);
            Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
            Text.width('100%');
        }, Text);
        Text.pop();
        // 使用说明
        Column.pop();
        Column.pop();
    }
    saveConfig(): void {
        aiService.setConfig({
            apiKey: this.apiKey,
            baseUrl: this.baseUrl,
            model: this.model,
            enabled: this.aiEnabled && this.apiKey.length > 0
        });
    }
    async testConnection(): Promise<void> {
        this.isTesting = true;
        this.testResult = '正在测试...';
        const response = await aiService.ask('你好，请回复"连接成功"');
        this.isTesting = false;
        if (response.success) {
            this.testResult = '✓ 连接成功！AI响应: ' + response.content.substring(0, 50);
        }
        else {
            this.testResult = '✗ 连接失败: ' + (response.error || '未知错误');
        }
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "AISettings";
    }
}
registerNamedRoute(() => new AISettings(undefined, {}), "", { bundleName: "com.threeq.learner", moduleName: "entry", pagePath: "pages/AISettings", pageFullPath: "entry/src/main/ets/pages/AISettings", integratedHsp: "false", moduleType: "followWithHap" });
