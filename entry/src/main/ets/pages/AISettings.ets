import { router } from '@kit.ArkUI';
import { aiService, AIConfig, AIService } from '../model/AIService';
import { Constants } from '../utils/Constants';

@Entry
@Component
struct AISettings {
  @State apiKey: string = '';
  @State baseUrl: string = '';
  @State model: string = '';
  @State aiEnabled: boolean = false;
  @State showApiKey: boolean = false;
  @State testResult: string = '';
  @State isTesting: boolean = false;

  // 预设模型列表（DeepSeek排首位）
  private presetModels: string[] = [
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

  // 预设API地址
  private presetUrls: string[] = [
    'https://api.deepseek.com/v1',
    'https://api.openai.com/v1',
    'https://dashscope.aliyuncs.com/compatible-mode/v1',
    'https://open.bigmodel.cn/api/paas/v4',
    'https://api.anthropic.com/v1'
  ];

  aboutToAppear(): void {
    aiService.loadConfig();
    const config = aiService.getConfig();
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl;
    this.model = config.model;
    this.aiEnabled = config.enabled;
  }

  build() {
    Column() {
      this.buildHeader()
      
      Scroll() {
        Column() {
          this.buildStatusCard()
          this.buildApiConfig()
          this.buildModelConfig()
          this.buildPresetCards()
          this.buildActionButtons()
        }
        .width('100%')
        .padding({ left: 20, right: 20 })
      }
      .layoutWeight(1)
    }
    .width('100%')
    .height('100%')
    .backgroundColor(Constants.COLOR_BACKGROUND)
  }

  @Builder buildHeader() {
    Row() {
      Text('◀')
        .fontSize(24)
        .fontColor(Constants.COLOR_PRIMARY)
        .onClick(() => {
          router.back();
        })
      
      Text('AI 设置')
        .fontSize(20)
        .fontWeight(FontWeight.Bold)
        .fontColor(Constants.COLOR_TEXT)
        .margin({ left: 16 })
        .layoutWeight(1)
      
      if (this.aiEnabled) {
        Text('已启用')
          .fontSize(12)
          .fontColor('#FFFFFF')
          .backgroundColor(Constants.COLOR_ACCENT_GREEN)
          .padding({ left: 8, right: 8, top: 4, bottom: 4 })
          .borderRadius(12)
      } else {
        Text('未启用')
          .fontSize(12)
          .fontColor(Constants.COLOR_TEXT_SECONDARY)
          .backgroundColor(0x10000000)
          .padding({ left: 8, right: 8, top: 4, bottom: 4 })
          .borderRadius(12)
      }
    }
    .width('100%')
    .padding({ left: 20, right: 20, top: 16, bottom: 16 })
    .backgroundColor('#FFFFFF')
  }

  @Builder buildStatusCard() {
    Column() {
      Row() {
        Stack() {
          Circle()
            .width(48)
            .height(48)
            .fill(this.aiEnabled ? Constants.COLOR_ACCENT_GREEN : 0x20000000)
          Text(this.aiEnabled ? '✓' : '?')
            .fontSize(24)
            .fontColor(this.aiEnabled ? '#FFFFFF' : Constants.COLOR_TEXT_SECONDARY)
        }
        .width(48)
        .height(48)

        Column() {
          Text(this.aiEnabled ? 'AI 服务已配置' : 'AI 服务未配置')
            .fontSize(16)
            .fontWeight(FontWeight.Bold)
            .fontColor(Constants.COLOR_TEXT)
          
          Text(this.aiEnabled ? `当前模型: ${this.model}` : '请配置API Key以启用AI功能')
            .fontSize(12)
            .fontColor(Constants.COLOR_TEXT_SECONDARY)
            .margin({ top: 4 })
        }
        .alignItems(HorizontalAlign.Start)
        .layoutWeight(1)
        .margin({ left: 12 })

        Toggle({ type: ToggleType.Switch, isOn: this.aiEnabled })
          .onChange((isOn: boolean) => {
            this.aiEnabled = isOn;
            this.saveConfig();
          })
      }
      .width('100%')
    }
    .width('100%')
    .padding(16)
    .backgroundColor(Constants.COLOR_CARD)
    .borderRadius(16)
    .margin({ top: 16 })
  }

  @Builder buildApiConfig() {
    Column() {
      Text('API 配置')
        .fontSize(16)
        .fontWeight(FontWeight.Bold)
        .fontColor(Constants.COLOR_TEXT)
        .width('100%')
        .margin({ bottom: 12 })

      // API Key
      Column() {
        Row() {
          Text('API Key')
            .fontSize(12)
            .fontColor(Constants.COLOR_TEXT_SECONDARY)

          if (this.baseUrl.includes('deepseek')) {
            Text('DeepSeek Key已内置')
              .fontSize(10)
              .fontColor('#10B981')
              .margin({ left: 8 })
          }
        }
        .width('100%')
        .margin({ bottom: 6 })

        Row() {
          if (this.showApiKey) {
            TextInput({ text: this.apiKey })
              .layoutWeight(1)
              .height(44)
              .backgroundColor('#F5F5F5')
              .borderRadius(8)
              .onChange((val: string) => {
                this.apiKey = val;
              })
          } else {
            TextInput({ text: this.apiKey })
              .layoutWeight(1)
              .height(44)
              .backgroundColor('#F5F5F5')
              .borderRadius(8)
              .type(InputType.Password)
              .onChange((val: string) => {
                this.apiKey = val;
              })
          }

          Text(this.showApiKey ? '隐藏' : '显示')
            .fontSize(12)
            .fontColor(Constants.COLOR_PRIMARY)
            .margin({ left: 8 })
            .onClick(() => {
              this.showApiKey = !this.showApiKey;
            })
        }
        .width('100%')
      }
      .width('100%')
      .margin({ bottom: 12 })

      // Base URL
      Column() {
        Text('API 地址')
          .fontSize(12)
          .fontColor(Constants.COLOR_TEXT_SECONDARY)
          .width('100%')
          .margin({ bottom: 6 })

        TextInput({ text: this.baseUrl })
          .width('100%')
          .height(44)
          .backgroundColor('#F5F5F5')
          .borderRadius(8)
          .onChange((val: string) => {
            this.baseUrl = val;
          })
      }
      .width('100%')
    }
    .width('100%')
    .padding(16)
    .backgroundColor(Constants.COLOR_CARD)
    .borderRadius(16)
    .margin({ top: 12 })
  }

  @Builder buildModelConfig() {
    Column() {
      Text('模型选择')
        .fontSize(16)
        .fontWeight(FontWeight.Bold)
        .fontColor(Constants.COLOR_TEXT)
        .width('100%')
        .margin({ bottom: 12 })

      TextInput({ placeholder: '输入模型名称', text: this.model })
        .width('100%')
        .height(44)
        .backgroundColor('#F5F5F5')
        .borderRadius(8)
        .onChange((val: string) => {
          this.model = val;
        })

      Text('常用模型')
        .fontSize(12)
        .fontColor(Constants.COLOR_TEXT_SECONDARY)
        .width('100%')
        .margin({ top: 12, bottom: 8 })

      Flex({ wrap: FlexWrap.Wrap }) {
        ForEach(this.presetModels, (m: string) => {
          Text(m)
            .fontSize(11)
            .fontColor(this.model === m ? '#FFFFFF' : Constants.COLOR_PRIMARY)
            .backgroundColor(this.model === m ? Constants.COLOR_PRIMARY : 0x0F0078D7)
            .padding({ left: 10, right: 10, top: 6, bottom: 6 })
            .borderRadius(16)
            .margin({ right: 6, bottom: 6 })
            .onClick(() => {
              this.model = m;
            })
        }, (m: string) => m)
      }
      .width('100%')
    }
    .width('100%')
    .padding(16)
    .backgroundColor(Constants.COLOR_CARD)
    .borderRadius(16)
    .margin({ top: 12 })
  }

  @Builder buildPresetCards() {
    Column() {
      Text('预设配置（一键配置）')
        .fontSize(16)
        .fontWeight(FontWeight.Bold)
        .fontColor(Constants.COLOR_TEXT)
        .width('100%')
        .margin({ bottom: 12 })

      this.buildPresetItem('DeepSeek（内置Key·即开即用）', 'https://api.deepseek.com/v1', 'deepseek-chat', '#6366F1', true)
      this.buildPresetItem('OpenAI', 'https://api.openai.com/v1', 'gpt-3.5-turbo', Constants.COLOR_PRIMARY, false)
      this.buildPresetItem('通义千问', 'https://dashscope.aliyuncs.com/compatible-mode/v1', 'qwen-turbo', '#F97316', false)
      this.buildPresetItem('智谱GLM', 'https://open.bigmodel.cn/api/paas/v4', 'glm-4', '#10B981', false)
    }
    .width('100%')
    .padding(16)
    .backgroundColor(Constants.COLOR_CARD)
    .borderRadius(16)
    .margin({ top: 12 })
  }

  @Builder buildPresetItem(name: string, url: string, model: string, color: ResourceColor, hasBuiltInKey: boolean) {
    Row() {
      Column() {
        Row() {
          Text(name)
            .fontSize(14)
            .fontWeight(FontWeight.Bold)
            .fontColor(Constants.COLOR_TEXT)

          if (hasBuiltInKey) {
            Text('Key内置')
              .fontSize(9)
              .fontColor('#FFFFFF')
              .backgroundColor('#10B981')
              .padding({ left: 6, right: 6, top: 2, bottom: 2 })
              .borderRadius(8)
              .margin({ left: 6 })
          }
        }

        Text(model)
          .fontSize(11)
          .fontColor(Constants.COLOR_TEXT_SECONDARY)
          .margin({ top: 2 })
      }
      .alignItems(HorizontalAlign.Start)
      .layoutWeight(1)

      Text('使用')
        .fontSize(12)
        .fontColor('#FFFFFF')
        .backgroundColor(color)
        .padding({ left: 12, right: 12, top: 6, bottom: 6 })
        .borderRadius(16)
        .onClick(() => {
          this.baseUrl = url;
          this.model = model;
          if (hasBuiltInKey) {
            const defaultCfg = AIService.getDefaultDeepSeekConfig();
            this.apiKey = defaultCfg.apiKey;
            this.aiEnabled = true;
          }
        })
    }
    .width('100%')
    .padding({ top: 8, bottom: 8 })
  }

  @Builder buildActionButtons() {
    Column() {
      // 测试连接
      Button(this.isTesting ? '测试中...' : '测试连接')
        .width('100%')
        .height(48)
        .backgroundColor(Constants.COLOR_CARD)
        .fontColor(Constants.COLOR_PRIMARY)
        .borderRadius(24)
        .enabled(!this.isTesting && this.apiKey.length > 0)
        .onClick(() => {
          this.testConnection();
        })

      if (this.testResult.length > 0) {
        Text(this.testResult)
          .fontSize(12)
          .fontColor(this.testResult.includes('成功') ? Constants.COLOR_ACCENT_GREEN : Constants.COLOR_ACCENT_RED)
          .margin({ top: 8 })
      }

      // 保存配置
      Button('保存配置')
        .width('100%')
        .height(48)
        .backgroundColor(Constants.COLOR_PRIMARY)
        .fontColor('#FFFFFF')
        .borderRadius(24)
        .margin({ top: 12 })
        .onClick(() => {
          this.saveConfig();
          AlertDialog.show({
            title: '保存成功',
            message: 'AI配置已保存',
            confirm: { value: '好的', action: () => {} }
          });
        })

      // 使用说明
      Column() {
        Text('使用说明')
          .fontSize(14)
          .fontWeight(FontWeight.Bold)
          .fontColor(Constants.COLOR_TEXT)
          .width('100%')
          .margin({ bottom: 8 })

        Text('✅ DeepSeek已内置API Key，点击"一键使用"即可')
          .fontSize(11)
          .fontColor('#10B981')
          .width('100%')
          .margin({ bottom: 4 })

        Text('1. 其他平台需访问对应官网注册获取API Key')
          .fontSize(11)
          .fontColor(Constants.COLOR_TEXT_SECONDARY)
          .width('100%')
          .margin({ bottom: 4 })

        Text('2. 支持OpenAI兼容格式的API（包括国产大模型）')
          .fontSize(11)
          .fontColor(Constants.COLOR_TEXT_SECONDARY)
          .width('100%')
          .margin({ bottom: 4 })

        Text('3. 配置后即可使用AI生成知识图谱、争议点、测评题')
          .fontSize(11)
          .fontColor(Constants.COLOR_TEXT_SECONDARY)
          .width('100%')
      }
      .width('100%')
      .padding(16)
      .backgroundColor(0x05000000)
      .borderRadius(12)
      .margin({ top: 16, bottom: 20 })
    }
    .width('100%')
    .margin({ top: 16 })
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
    } else {
      this.testResult = '✗ 连接失败: ' + (response.error || '未知错误');
    }
  }
}
