import { router } from '@kit.ArkUI';
import { aiService, ChatMessage, AIResponse } from '../model/AIService';
import { Constants } from '../utils/Constants';
import { globalData } from '../model/LearningData';

interface ChatRecord {
  role: 'user' | 'assistant';
  content: string;
  time: number;
}

@Entry
@Component
struct AIChat {
  @State courseId: string = '';
  @State courseTitle: string = '';
  @State messages: ChatRecord[] = [];
  @State inputText: string = '';
  @State isLoading: boolean = false;
  @State isConfigured: boolean = false;
  @State scrollHeight: number = 0;

  private chatHistory: ChatMessage[] = [];
  private scroller: Scroller = new Scroller();

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
    } else {
      this.messages.push({
        role: 'assistant',
        content: 'AI服务未配置，请先在设置中配置API Key。',
        time: Date.now()
      });
    }
  }

  build() {
    Column() {
      this.buildHeader()
      
      if (this.isConfigured) {
        this.buildChatArea()
        this.buildInputArea()
      } else {
        this.buildNotConfigured()
      }
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

      Column() {
        Text('AI 学习助手')
          .fontSize(18)
          .fontWeight(FontWeight.Bold)
          .fontColor(Constants.COLOR_TEXT)

        Text(this.courseTitle)
          .fontSize(12)
          .fontColor(Constants.COLOR_TEXT_SECONDARY)
          .margin({ top: 2 })
      }
      .alignItems(HorizontalAlign.Start)
      .layoutWeight(1)
      .margin({ left: 12 })

      Stack() {
        Circle()
          .width(36)
          .height(36)
          .fill(Constants.COLOR_PRIMARY)
        Text('AI')
          .fontSize(12)
          .fontColor('#FFFFFF')
          .fontWeight(FontWeight.Bold)
      }
      .width(36)
      .height(36)
    }
    .width('100%')
    .padding({ left: 16, right: 16, top: 12, bottom: 12 })
    .backgroundColor('#FFFFFF')
    .shadow({ radius: 2, offsetY: 1, color: 0x0A000000 })
  }

  @Builder buildChatArea() {
    Scroll(this.scroller) {
      Column() {
        ForEach(this.messages, (msg: ChatRecord, index: number) => {
          this.buildMessageItem(msg, index)
        }, (msg: ChatRecord) => msg.time.toString())

        if (this.isLoading) {
          this.buildLoadingIndicator()
        }
      }
      .width('100%')
      .padding({ left: 16, right: 16, top: 12, bottom: 12 })
    }
    .layoutWeight(1)
    .width('100%')
    .backgroundColor(Constants.COLOR_BACKGROUND)
  }

  @Builder buildMessageItem(msg: ChatRecord, index: number) {
    Column() {
      if (msg.role === 'user') {
        // 用户消息 - 右对齐
        Row() {
          Blank()
          Column() {
            Text(msg.content)
              .fontSize(14)
              .fontColor('#FFFFFF')
              .lineHeight(22)
          }
          .padding({ left: 14, right: 14, top: 10, bottom: 10 })
          .backgroundColor(Constants.COLOR_PRIMARY)
          .borderRadius({ topLeft: 16, topRight: 4, bottomLeft: 16, bottomRight: 16 })
          .constraintSize({ maxWidth: '75%' })
        }
        .width('100%')
      } else {
        // AI消息 - 左对齐
        Row() {
          Column() {
            Text(msg.content)
              .fontSize(14)
              .fontColor(Constants.COLOR_TEXT)
              .lineHeight(22)
          }
          .padding({ left: 14, right: 14, top: 10, bottom: 10 })
          .backgroundColor('#FFFFFF')
          .borderRadius({ topLeft: 4, topRight: 16, bottomLeft: 16, bottomRight: 16 })
          .constraintSize({ maxWidth: '85%' })
          .alignItems(HorizontalAlign.Start)

          Blank()
        }
        .width('100%')
      }

      Text(this.formatTime(msg.time))
        .fontSize(10)
        .fontColor(Constants.COLOR_TEXT_SECONDARY)
        .width('100%')
        .textAlign(msg.role === 'user' ? TextAlign.End : TextAlign.Start)
        .margin({ top: 4 })
    }
    .width('100%')
    .margin({ bottom: 12 })
  }

  @Builder buildLoadingIndicator() {
    Row() {
      Column() {
        Row() {
          LoadingProgress()
            .width(20)
            .height(20)
            .color(Constants.COLOR_PRIMARY)
          
          Text('AI正在思考...')
            .fontSize(12)
            .fontColor(Constants.COLOR_TEXT_SECONDARY)
            .margin({ left: 8 })
        }
      }
      .padding({ left: 14, right: 14, top: 10, bottom: 10 })
      .backgroundColor('#FFFFFF')
      .borderRadius(16)

      Blank()
    }
    .width('100%')
    .margin({ bottom: 12 })
  }

  @Builder buildInputArea() {
    Column() {
      // 快捷问题
      Scroll() {
        Row() {
          ForEach(this.getQuickQuestions(), (q: string) => {
            Text(q)
              .fontSize(11)
              .fontColor(Constants.COLOR_PRIMARY)
              .backgroundColor(0x0F0078D7)
              .padding({ left: 10, right: 10, top: 6, bottom: 6 })
              .borderRadius(16)
              .margin({ right: 8 })
              .onClick(() => {
                this.inputText = q;
                this.sendMessage();
              })
          }, (q: string) => q)
        }
        .padding({ left: 4, right: 4 })
      }
      .width('100%')
      .scrollable(ScrollDirection.Horizontal)
      .height(40)
      .scrollBar(BarState.Off)

      // 输入框
      Row() {
        TextArea({ placeholder: '输入你的问题...', text: this.inputText })
          .layoutWeight(1)
          .height(44)
          .backgroundColor('#FFFFFF')
          .borderRadius(22)
          .placeholderColor(Constants.COLOR_TEXT_SECONDARY)
          .onChange((val: string) => {
            this.inputText = val;
          })
          .onSubmit(() => {
            this.sendMessage();
          })

        Stack() {
          Circle()
            .width(44)
            .height(44)
            .fill(this.inputText.length > 0 ? Constants.COLOR_PRIMARY : 0x20000000)
          Text('发送')
            .fontSize(12)
            .fontColor(this.inputText.length > 0 ? '#FFFFFF' : Constants.COLOR_TEXT_SECONDARY)
            .fontWeight(FontWeight.Bold)
        }
        .width(44)
        .height(44)
        .margin({ left: 8 })
        .onClick(() => {
          if (this.inputText.length > 0) {
            this.sendMessage();
          }
        })
      }
      .width('100%')
      .margin({ top: 8 })
    }
    .width('100%')
    .padding({ left: 16, right: 16, top: 8, bottom: 12 })
    .backgroundColor('#FFFFFF')
    .border({ width: { top: 1 }, color: 0x10000000 })
  }

  @Builder buildNotConfigured() {
    Column() {
      Stack() {
        Circle()
          .width(80)
          .height(80)
          .fill(0x0F0078D7)
        Text('AI')
          .fontSize(32)
          .fontColor(Constants.COLOR_PRIMARY)
          .fontWeight(FontWeight.Bold)
      }
      .width(80)
      .height(80)
      .margin({ top: 80 })

      Text('AI服务未配置')
        .fontSize(20)
        .fontWeight(FontWeight.Bold)
        .fontColor(Constants.COLOR_TEXT)
        .margin({ top: 20 })

      Text('请先配置API Key以启用AI学习助手功能')
        .fontSize(14)
        .fontColor(Constants.COLOR_TEXT_SECONDARY)
        .margin({ top: 8 })

      Button('前往设置')
        .width(160)
        .height(48)
        .backgroundColor(Constants.COLOR_PRIMARY)
        .fontColor('#FFFFFF')
        .borderRadius(24)
        .margin({ top: 24 })
        .onClick(() => {
          router.pushUrl({ url: 'pages/AISettings' });
        })
    }
    .width('100%')
    .layoutWeight(1)
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
    if (!text || this.isLoading) return;

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
    } else {
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
}
