import { router } from '@kit.ArkUI';
import { Course } from '../model/CourseModel';
import { globalData } from '../model/LearningData';
import { Constants } from '../utils/Constants';
import { KnowledgeGraph } from '../components/KnowledgeGraph';
import { CourseCard } from '../components/CourseCard';
import { aiService, AIKnowledgeNode, AIDisagreement } from '../model/AIService';
import { StorageUtil } from '../utils/StorageUtil';
import { LearningMaterial, MaterialType, MaterialSource, MaterialParser } from '../model/MaterialModel';

@Entry
@Component
struct LearningSpace {
  @State courseId: string = '';
  @State courseTitle: string = '';
  @State course: Course | null = null;
  @State refreshKey: number = 0;
  @State currentCardIndex: number = 0;
  @State isAILoading: boolean = false;
  @State aiEnabled: boolean = false;
  @State aiNodes: AIKnowledgeNode[] = [];
  @State aiDisagreements: AIDisagreement[] = [];
  @State materials: LearningMaterial[] = [];
  @State searchQuery: string = '';
  @State activeMaterialTab: number = 0;
  @State showMaterialDetail: boolean = false;
  @State selectedMaterial: LearningMaterial | null = null;
  @State isGeneratingMaterials: boolean = false;
  @State showUploadInput: boolean = false;
  @State uploadTitle: string = '';
  @State uploadContent: string = '';
  @State showNotesEditor: boolean = false;
  @State notesContent: string = '';
  @State isGeneratingDetail: boolean = false;
  @State isDetailLoading: boolean = false;

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

  build() {
    Stack() {
      Column() {
        this.buildTopBar()

        if (this.course) {
          Scroll() {
            Column() {
              this.buildCourseHeader()
              this.buildAIChatCard()
              this.buildThreeQuestions()
              this.buildKnowledgeBase()
              this.buildAIGeneratedContent()
              this.buildCourseGrid()
            }
            .width('100%')
            .padding({ left: 20, right: 20, bottom: 20 })
          }
          .layoutWeight(1)
        } else {
          Column() {
            Text('课程未找到')
              .fontSize(16)
              .fontColor(Constants.COLOR_TEXT_SECONDARY)
          }
          .layoutWeight(1)
          .justifyContent(FlexAlign.Center)
        }
      }
      .width('100%')
      .height('100%')
      .backgroundColor(Constants.COLOR_BACKGROUND)

      if (this.showMaterialDetail && this.selectedMaterial) {
        this.buildMaterialDetail()
      }
    }
    .width('100%')
    .height('100%')
  }

  @Builder buildTopBar() {
    Row() {
      Stack() {
        Circle()
          .width(36)
          .height(36)
          .fill(0x0F000000)
        Text('←')
          .fontSize(18)
          .fontColor(Constants.COLOR_TEXT)
      }
      .width(36)
      .height(36)
        .onClick(() => {
          router.back();
        })

      Blank()

      Text(this.course?.title || '学习空间')
        .fontSize(18)
        .fontWeight(FontWeight.Bold)
        .fontColor(Constants.COLOR_TEXT)

      Blank()

      Row() {
        // AI状态指示
        if (this.aiEnabled) {
          Stack() {
            Circle()
              .width(8)
              .height(8)
              .fill(Constants.COLOR_ACCENT_GREEN)
          }
          .width(8)
          .height(8)
          .margin({ right: 4 })
        }

        Stack() {
          Circle()
            .width(36)
            .height(36)
            .fill(0x0F000000)
          Text('📊')
            .fontSize(16)
        }
        .width(36)
        .height(36)
          .onClick(() => {
            router.pushUrl({
              url: 'pages/Profile',
              params: { courseId: this.courseId }
            });
          })
      }
    }
    .width('100%')
    .padding({ left: 16, right: 16, top: 12, bottom: 12 })
    .backgroundColor('#FFFFFF')
    .shadow({ radius: 2, offsetY: 1, color: 0x0A000000 })
  }

  @Builder buildCourseHeader() {
    Column() {
      Row() {
        Stack() {
          Circle()
            .width(56)
            .height(56)
            .fill(Constants.COLOR_PRIMARY)
          Text(this.course!.title.charAt(0))
            .fontSize(28)
            .fontColor('#FFFFFF')
            .fontWeight(FontWeight.Bold)
        }
        .width(56)
        .height(56)

        Column() {
          Text(this.course!.title)
            .fontSize(20)
            .fontWeight(FontWeight.Bold)
            .fontColor(Constants.COLOR_TEXT)

          Text(this.course!.description)
            .fontSize(13)
            .fontColor(Constants.COLOR_TEXT_SECONDARY)
            .margin({ top: 4 })
        }
        .layoutWeight(1)
        .margin({ left: 16 })
      }
      .width('100%')
      .margin({ top: 16 })

      Row() {
        Text('课程进度')
          .fontSize(13)
          .fontColor(Constants.COLOR_TEXT_SECONDARY)
        Blank()
        Text(`${this.course!.progress}%`)
          .fontSize(13)
          .fontWeight(FontWeight.Bold)
          .fontColor(Constants.COLOR_PRIMARY)
      }
      .width('100%')
      .margin({ top: 12 })

      Progress({ value: this.course!.progress, total: 100, type: ProgressType.Linear })
        .width('100%')
        .height(8)
        .color(Constants.COLOR_PRIMARY)
        .backgroundColor(Constants.COLOR_DIVIDER)
        .borderRadius(4)

      Row() {
        Text('📝 学习笔记')
          .fontSize(14)
          .fontWeight(FontWeight.Medium)
          .fontColor(Constants.COLOR_PRIMARY)
        Blank()
        Text(this.notesContent.length > 0 ? '已保存' : '点击编辑')
          .fontSize(11)
          .fontColor(this.notesContent.length > 0 ? Constants.COLOR_ACCENT_GREEN : Constants.COLOR_TEXT_SECONDARY)
      }
      .width('100%')
      .margin({ top: 12 })
      .onClick(() => {
        this.showNotesEditor = !this.showNotesEditor;
        this.notesContent = globalData.getNotes(this.courseId);
      })

      if (this.showNotesEditor) {
        TextArea({ text: this.notesContent, placeholder: '在此输入你的学习笔记...' })
          .width('100%')
          .height(160)
          .backgroundColor('#FFFFFF')
          .borderRadius(8)
          .padding(8)
          .margin({ top: 8 })
          .onChange((val: string) => {
            this.notesContent = val;
            globalData.setNotes(this.courseId, val);
            StorageUtil.saveData();
          })
      }
    }
    .width('100%')
    .padding(16)
    .backgroundColor(Constants.COLOR_CARD)
    .borderRadius(16)
    .shadow({ radius: 4, offsetY: 2, color: 0x12000000 })
    .margin({ top: 16 })
  }

  @Builder buildAIChatCard() {
    Column() {
      Row() {
        Stack() {
          Circle()
            .width(44)
            .height(44)
            .fill(this.aiEnabled ? Constants.COLOR_PRIMARY : 0x20000000)
          Text('AI')
            .fontSize(16)
            .fontColor('#FFFFFF')
            .fontWeight(FontWeight.Bold)
        }
        .width(44)
        .height(44)

        Column() {
          Text('AI 学习助手')
            .fontSize(16)
            .fontWeight(FontWeight.Bold)
            .fontColor(Constants.COLOR_TEXT)

          if (this.aiEnabled) {
            Text('点击开始与AI对话学习')
              .fontSize(12)
              .fontColor(Constants.COLOR_TEXT_SECONDARY)
              .margin({ top: 2 })
          } else {
            Text('未配置 - 点击设置API')
              .fontSize(12)
              .fontColor(Constants.COLOR_ACCENT_ORANGE)
              .margin({ top: 2 })
          }
        }
        .layoutWeight(1)
        .alignItems(HorizontalAlign.Start)
        .margin({ left: 12 })

        Stack() {
          Circle()
            .width(32)
            .height(32)
            .fill(this.aiEnabled ? Constants.COLOR_ACCENT_GREEN : 0x10000000)
          Text('→')
            .fontSize(16)
            .fontColor(this.aiEnabled ? '#FFFFFF' : Constants.COLOR_TEXT_SECONDARY)
        }
        .width(32)
        .height(32)
      }
      .width('100%')
    }
    .width('100%')
    .padding(16)
    .backgroundColor(Constants.COLOR_CARD)
    .borderRadius(16)
    .margin({ top: 12 })
    .onClick(() => {
      if (this.aiEnabled) {
        router.pushUrl({
          url: 'pages/AIChat',
          params: { courseId: this.courseId, courseTitle: this.courseTitle }
        });
      } else {
        router.pushUrl({ url: 'pages/AISettings' });
      }
    })
  }

  @Builder buildThreeQuestions() {
    Column() {
      Text('三问认知引擎')
        .fontSize(16)
        .fontWeight(FontWeight.Bold)
        .fontColor(Constants.COLOR_TEXT)
        .width('100%')
        .margin({ top: 20, bottom: 12 })

      this.buildQCard(
        'Q1',
        '核心心智模型',
        '提取学科底层逻辑框架，构建动态知识图谱',
        Constants.COLOR_PRIMARY,
        this.course!.q1Completed,
        () => {
          this.executeQ1();
        }
      )

      this.buildQCard(
        'Q2',
        '学术分歧挖掘',
        '对比多源资料观点，培养批判性思维',
        Constants.COLOR_ACCENT_PURPLE,
        this.course!.q2Completed,
        () => {
          this.executeQ2();
        }
      )

      this.buildQCard(
        'Q3',
        '深度测评',
        '布鲁姆六层级多维自测，检验学习效果',
        Constants.COLOR_ACCENT_GREEN,
        this.course!.q3Completed,
        () => {
          this.executeQ3();
        }
      )
    }
    .width('100%')
  }

  @Builder buildQCard(q: string, title: string, desc: string, color: ResourceColor, completed: boolean, onAction: () => void) {
    Column() {
      Row() {
        Stack() {
          Circle()
            .width(40)
            .height(40)
            .fill(completed ? Constants.COLOR_ACCENT_GREEN : color)
          Text(completed ? '✓' : q)
            .fontSize(18)
            .fontColor('#FFFFFF')
            .fontWeight(FontWeight.Bold)
        }
        .width(40)
        .height(40)

        Column() {
          Text(title)
            .fontSize(15)
            .fontWeight(FontWeight.Bold)
            .fontColor(completed ? Constants.COLOR_ACCENT_GREEN : Constants.COLOR_TEXT)
          Text(desc)
            .fontSize(11)
            .fontColor(Constants.COLOR_TEXT_SECONDARY)
            .margin({ top: 2 })
        }
        .layoutWeight(1)
        .margin({ left: 12 })

        Stack() {
          Circle()
            .width(28)
            .height(28)
            .fill(completed ? Constants.COLOR_ACCENT_GREEN : 0x0F000000)
          Text('→')
            .fontSize(14)
            .fontColor(completed ? '#FFFFFF' : Constants.COLOR_TEXT_SECONDARY)
        }
        .width(28)
        .height(28)
      }
      .width('100%')
    }
    .width('100%')
    .padding(16)
    .backgroundColor(Constants.COLOR_CARD)
    .borderRadius(16)
    .shadow({ radius: 4, offsetY: 1, color: 0x0A000000 })
    .margin({ bottom: 12 })
    .onClick(() => {
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
    })
  }

  @Builder buildAIGeneratedContent() {
    if (this.aiNodes.length > 0 || this.aiDisagreements.length > 0) {
      Column() {
        Text('AI 生成内容')
          .fontSize(16)
          .fontWeight(FontWeight.Bold)
          .fontColor(Constants.COLOR_TEXT)
          .width('100%')
          .margin({ top: 16, bottom: 12 })

        // 知识图谱节点
        if (this.aiNodes.length > 0) {
          Column() {
            Text('知识图谱节点')
              .fontSize(14)
              .fontWeight(FontWeight.Bold)
              .fontColor(Constants.COLOR_TEXT)
              .width('100%')
              .margin({ bottom: 8 })

            ForEach(this.aiNodes, (node: AIKnowledgeNode) => {
              Row() {
                Stack() {
                  Circle()
                    .width(24)
                    .height(24)
                    .fill(Constants.COLOR_PRIMARY)
                  Text(node.level.toString())
                    .fontSize(10)
                    .fontColor('#FFFFFF')
                }
                .width(24)
                .height(24)

                Column() {
                  Text(node.name)
                    .fontSize(13)
                    .fontWeight(FontWeight.Bold)
                    .fontColor(Constants.COLOR_TEXT)
                  Text(node.description)
                    .fontSize(11)
                    .fontColor(Constants.COLOR_TEXT_SECONDARY)
                    .margin({ top: 2 })
                }
                .layoutWeight(1)
                .alignItems(HorizontalAlign.Start)
                .margin({ left: 8 })
              }
              .width('100%')
              .padding(8)
              .backgroundColor(0x05000000)
              .borderRadius(8)
              .margin({ bottom: 6 })
            }, (node: AIKnowledgeNode) => node.id)
          }
          .width('100%')
          .padding(12)
          .backgroundColor(Constants.COLOR_CARD)
          .borderRadius(12)
        }

        // 争议点
        if (this.aiDisagreements.length > 0) {
          Column() {
            Text('学术争议点')
              .fontSize(14)
              .fontWeight(FontWeight.Bold)
              .fontColor(Constants.COLOR_TEXT)
              .width('100%')
              .margin({ top: 12, bottom: 8 })

            ForEach(this.aiDisagreements, (d: AIDisagreement) => {
              Column() {
                Text(d.topic)
                  .fontSize(13)
                  .fontWeight(FontWeight.Bold)
                  .fontColor(Constants.COLOR_TEXT)
                  .width('100%')

                Row() {
                  Column() {
                    Text('观点A')
                      .fontSize(11)
                      .fontColor(Constants.COLOR_PRIMARY)
                    Text(d.viewA)
                      .fontSize(11)
                      .fontColor(Constants.COLOR_TEXT)
                      .margin({ top: 2 })
                  }
                  .layoutWeight(1)
                  .padding(8)
                  .backgroundColor(0x05000000)
                  .borderRadius(8)

                  Column() {
                    Text('观点B')
                      .fontSize(11)
                      .fontColor(Constants.COLOR_ACCENT_PURPLE)
                    Text(d.viewB)
                      .fontSize(11)
                      .fontColor(Constants.COLOR_TEXT)
                      .margin({ top: 2 })
                  }
                  .layoutWeight(1)
                  .padding(8)
                  .backgroundColor(0x05000000)
                  .borderRadius(8)
                  .margin({ left: 8 })
                }
                .width('100%')
                .margin({ top: 8 })
              }
              .width('100%')
              .padding(12)
              .backgroundColor(Constants.COLOR_CARD)
              .borderRadius(12)
              .margin({ bottom: 8 })
            }, (d: AIDisagreement) => d.id)
          }
          .width('100%')
        }
      }
      .width('100%')
    }
  }

  @Builder buildCourseGrid() {
    if (this.course) {
      Column() {
        Text('其他课程')
          .fontSize(16)
          .fontWeight(FontWeight.Bold)
          .fontColor(Constants.COLOR_TEXT)
          .width('100%')
          .margin({ top: 16, bottom: 12 })

        ForEach(globalData.getCourses().filter(c => c.id !== this.courseId), (otherCourse: Course) => {
          CourseCard({
            course: otherCourse,
            onCardClick: () => {
              router.pushUrl({
                url: 'pages/LearningSpace',
                params: { courseId: otherCourse.id, courseTitle: otherCourse.title }
              });
            }
          })
          .margin({ bottom: 12 })
        }, (otherCourse: Course) => otherCourse.id)
      }
    }
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
        confirm: { value: '进入学习', action: () => {} }
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
        confirm: { value: '查看详情', action: () => {} }
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
        }}
      });
    }
  }

  loadMaterials(): void {
    const existing = globalData.getMaterials(this.courseId);
    if (existing.length === 0) {
      this.initSampleMaterials();
    } else {
      this.materials = existing;
    }
  }

  initSampleMaterials(): void {
    const topic = this.courseTitle;
    const samples: LearningMaterial[] = [];

    const s1 = LearningMaterial.createFromAI(
      topic + '核心概念与知识体系全景',
      '## 概述\n\n' + topic + '是一个系统性的知识领域，其核心概念体系构成了理解和掌握该学科的基石。本材料将系统性地梳理' + topic + '的核心知识框架，帮助学习者建立完整、清晰的知识地图。\n\n## 一、基础概念层\n\n### 1.1 核心定义\n' + topic + '的基本定义涵盖了其研究范畴、对象和方法论。理解这一定义是进入该领域的第一步。从学术角度而言，' + topic + '关注的是特定现象和规律的探索，其研究对象具有明确的边界和特征。\n\n### 1.2 关键术语\n在该领域中，有几个关键术语是必须掌握的：首先是核心术语A，它描述了最基本的现象；其次是术语B，它连接了理论与实践的桥梁；最后是术语C，代表了该领域的前沿发展方向。\n\n### 1.3 概念关系图\n这些基本概念之间存在着密切的关联：术语A是基础，术语B是方法，术语C是目标。三者形成了一个完整的学习闭环。\n\n## 二、方法论层\n\n### 2.1 分析方法\n' + topic + '的核心分析方法包括：系统分析法、比较研究法和实证研究法。系统分析法强调整体性视角；比较研究法通过对比不同案例寻找规律；实证研究法则基于数据和事实进行验证。\n\n### 2.2 实践工具\n在实践中，常用的工具包括概念图、思维导图和决策矩阵。这些工具帮助学习者将抽象知识可视化、结构化，大大提高了学习效率。\n\n## 三、能力培养层\n\n### 3.1 批判性思维\n培养批判性思维能力是学习' + topic + '的重要目标。学习者需要学会质疑假设、分析论证、评估证据。这种能力不仅在学术中有价值，在实际工作和生活中同样重要。\n\n### 3.2 问题解决能力\n通过系统化学习，学习者应能运用所学知识解决实际问题。这包括：问题识别、方案设计、实施评估和反馈优化四个步骤。\n\n## 总结\n\n' + topic + '的核心知识框架是一个多层次、立体化的体系。初学者应该先从基础概念入手，逐步深入到方法论层面，最终培养出独立思考和解决问题的能力。建议学习者按照"概念→方法→能力"的路径循序渐进。',
      this.courseId,
      ['核心概念', '知识体系', '基础原理', '学习方法', '能力培养']
    );
    s1.summary = topic + '系统性知识框架，涵盖基础概念、分析方法与实践能力三大层次，帮助快速建立知识地图。';
    const s1Detail = s1.content.substring(0, 150);
    s1.summary = s1Detail;
    samples.push(s1);

    const s2 = LearningMaterial.createFromAI(
      topic + '高效学习策略与实践指南',
      '## 概述\n\n掌握' + topic + '不仅需要勤奋，更需要科学有效的学习策略。本材料将介绍经过验证的高效学习方法，帮助学习者在更短时间内取得更好的学习效果。\n\n## 一、主动学习策略\n\n### 1.1 费曼学习法\n费曼学习法被誉为最有效的学习方法之一，其核心理念是"如果你不能简单地解释它，你就没有真正理解它"。具体步骤包括：选择一个概念、向别人解释这个概念、发现解释中的 gaps、回顾和简化。\n\n### 1.2 SQ3R阅读法\nSQ3R是一种系统的阅读学习方法，包含五个步骤：Survey（浏览）、Question（提问）、Read（阅读）、Recite（复述）、Review（复习）。这种方法特别适合学习' + topic + '这类需要理解复杂概念的知识体系。\n\n## 二、知识管理策略\n\n### 2.1 间隔重复\n艾宾浩斯遗忘曲线表明，人类在学习了新知识后会在短时间内快速遗忘。间隔重复策略通过在最佳时间点进行复习，可以显著提高长期记忆效率。建议采用1-3-7-14-30天的复习间隔。\n\n### 2.2 知识关联\n将新知识与已有知识建立联系是深度学习的核心。在' + topic + '的学习中，可以构建知识网络图，将不同概念之间的关系可视化，这有助于形成立体化的知识结构。\n\n## 三、实践强化策略\n\n### 3.1 项目驱动学习\n选择一个与' + topic + '相关的实际项目，在完成项目的过程中学习所需知识。这种"做中学"的方式能够显著提高学习动机和知识保留率。\n\n### 3.2 教学相长\n尝试将所学内容教给别人或写文章分享。教学过程中需要组织知识、寻找合适的表达方式，这一过程本身就是深层次的复习和巩固。\n\n## 四、学习心态管理\n\n保持成长型思维是持续学习的关键。接受学习过程中的挫折和反复，将每一次"不会"视为学习的机会而非失败。建议每天固定学习时间，形成习惯。\n\n## 总结\n\n高效学习不是天赋，而是可以习得的技能。通过主动学习、科学的知识管理、实践强化和良好的心态管理，每个人都能够在' + topic + '领域取得显著进步。',
      this.courseId,
      ['学习策略', '主动学习', '间隔重复', '费曼学习法', '知识管理']
    );
    s2.summary = topic + '高效学习策略全攻略，包含费曼学习法、SQ3R阅读法、间隔重复等科学方法。';
    samples.push(s2);

    const s3 = LearningMaterial.createFromAI(
      topic + '进阶学习路径与深度探索',
      '## 概述\n\n当学习者掌握了' + topic + '的基础后，如何向更高层次进阶就成为关键。本材料规划了一条清晰的进阶学习路径，帮助学习者从入门到精通，最终达到专业水平。\n\n## 一、进阶三阶段\n\n### 阶段一：系统深化（1-2个月）\n在第一阶段，学习者需要对基础知识进行系统化深化。具体目标包括：掌握所有核心概念、能够独立完成基础项目、建立完整的知识框架。推荐的学习方式包括精读权威教材、参与在线课程和完成配套练习。\n\n### 阶段二：应用拓展（2-3个月）\n在第二阶段，重点转向实际应用。学习者应该：参与实际项目、阅读业界案例、尝试解决真实问题。这一阶段的目标是能够将所学知识灵活运用于不同场景。\n\n### 阶段三：创新突破（3个月以上）\n第三阶段是真正的进阶阶段。学习者应该开始：阅读前沿论文、参与学术讨论、开展独立研究或创新项目。目标是形成自己的见解和贡献。\n\n## 二、核心能力进阶\n\n### 2.1 分析能力\n从基础的分析框架开始，逐步掌握更复杂的分析工具。建议从经典案例分析开始，逐步过渡到真实场景的复杂问题分析。\n\n### 2.2 综合能力\n综合能力是指将不同领域的知识融会贯通的能力。在' + topic + '的高级学习中，学习者需要具备跨学科视野，能够将不同知识领域的方法和理论整合运用。\n\n### 2.3 评价能力\n高级学习者应该能够对理论、方法和实践结果进行批判性评价。这包括识别假设、评估证据质量、判断结论合理性等能力。\n\n## 三、学习资源推荐\n\n### 3.1 经典教材\n选择2-3本该领域的经典教材作为主要学习资源。建议先通读一遍建立整体印象，再精读重点章节。\n\n### 3.2 学术资源\nGoogle Scholar、知网等学术搜索引擎是获取前沿研究的重要渠道。建议每周抽出时间阅读1-2篇该领域的论文。\n\n### 3.3 实践平台\nGitHub、Kaggle等平台提供了丰富的实践项目和数据集。通过参与这些平台的实践项目，可以显著提高实际能力。\n\n## 总结\n\n进阶学习是一个持续的过程，需要耐心和毅力。建议制定明确的学习计划，定期评估自己的进步，并适时调整学习策略。记住，真正的大师永远保持学习者的心态。',
      this.courseId,
      ['学习路径', '进阶', '深度探索', '能力提升', '资源推荐']
    );
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
    } else if (this.activeMaterialTab === 2) {
      result = result.filter(m => m.source === MaterialSource.USER_UPLOAD);
    }
    if (this.searchQuery.length > 0) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(m =>
        m.title.toLowerCase().includes(q) ||
        m.summary.toLowerCase().includes(q)
      );
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
    if (type === MaterialType.PDF) return Constants.COLOR_PRIMARY;
    if (type === MaterialType.WORD) return Constants.COLOR_ACCENT_PURPLE;
    if (type === MaterialType.MARKDOWN) return Constants.COLOR_ACCENT_GREEN;
    if (type === MaterialType.WEB) return Constants.COLOR_ACCENT_ORANGE;
    return Constants.COLOR_ACCENT_PURPLE;
  }

  getTypeBgColor(type: MaterialType): ResourceColor {
    if (type === MaterialType.PDF) return 0x1A0078D7;
    if (type === MaterialType.WORD) return 0x1A8B5CF6;
    if (type === MaterialType.MARKDOWN) return 0x1A10B981;
    if (type === MaterialType.WEB) return 0x1AF59E0B;
    return 0x1A8B5CF6;
  }

  getTypeLabel(type: MaterialType): string {
    if (type === MaterialType.PDF) return 'PDF';
    if (type === MaterialType.WORD) return 'Word';
    if (type === MaterialType.MARKDOWN) return 'MD';
    if (type === MaterialType.WEB) return 'WEB';
    return 'AI';
  }

  getSourceLabel(source: MaterialSource): string {
    if (source === MaterialSource.USER_UPLOAD) return '用户上传';
    if (source === MaterialSource.AI_SUPPLEMENT) return 'AI补充';
    return '联网检索';
  }

  getSourceColor(source: MaterialSource): ResourceColor {
    if (source === MaterialSource.USER_UPLOAD) return Constants.COLOR_PRIMARY;
    if (source === MaterialSource.AI_SUPPLEMENT) return Constants.COLOR_ACCENT_PURPLE;
    return Constants.COLOR_ACCENT_GREEN;
  }

  getSourceBgColor(source: MaterialSource): ResourceColor {
    if (source === MaterialSource.USER_UPLOAD) return 0x1A0078D7;
    if (source === MaterialSource.AI_SUPPLEMENT) return 0x1A8B5CF6;
    return 0x1A10B981;
  }

  @Builder buildKnowledgeBase() {
    Column() {
      Row() {
        Text('知识库')
          .fontSize(16)
          .fontWeight(FontWeight.Bold)
          .fontColor(Constants.COLOR_TEXT)
        Blank()
        Row() {
          Text('共' + this.getFilteredMaterials().length + '项')
            .fontSize(12)
            .fontColor(Constants.COLOR_TEXT_SECONDARY)
            .margin({ right: 12 })
          Text('AI ' + this.getAIMaterials().length)
            .fontSize(12)
            .fontColor(Constants.COLOR_ACCENT_PURPLE)
            .margin({ right: 12 })
          Text('用户 ' + this.getUserMaterials().length)
            .fontSize(12)
            .fontColor(Constants.COLOR_PRIMARY)
        }
      }
      .width('100%')
      .margin({ top: 16, bottom: 12 })

      TextInput({ placeholder: '搜索知识库资料...', text: this.searchQuery })
        .width('100%')
        .height(40)
        .backgroundColor('#FFFFFF')
        .borderRadius(20)
        .padding({ left: 16, right: 16 })
        .onChange((value: string) => {
          this.searchQuery = value;
        })
        .margin({ bottom: 12 })

      Row() {
        Column() {
          Text('全部')
            .fontSize(14)
            .fontWeight(this.activeMaterialTab === 0 ? FontWeight.Bold : FontWeight.Normal)
            .fontColor(this.activeMaterialTab === 0 ? Constants.COLOR_PRIMARY : Constants.COLOR_TEXT_SECONDARY)
        }
        .padding({ top: 6, bottom: 6, left: 12, right: 12 })
        .backgroundColor(this.activeMaterialTab === 0 ? 0x1A0078D7 : 'transparent')
        .borderRadius(16)
        .onClick(() => {
          this.activeMaterialTab = 0;
        })
        .margin({ right: 8 })

        Column() {
          Text('AI补充')
            .fontSize(14)
            .fontWeight(this.activeMaterialTab === 1 ? FontWeight.Bold : FontWeight.Normal)
            .fontColor(this.activeMaterialTab === 1 ? Constants.COLOR_PRIMARY : Constants.COLOR_TEXT_SECONDARY)
        }
        .padding({ top: 6, bottom: 6, left: 12, right: 12 })
        .backgroundColor(this.activeMaterialTab === 1 ? 0x1A0078D7 : 'transparent')
        .borderRadius(16)
        .onClick(() => {
          this.activeMaterialTab = 1;
        })
        .margin({ right: 8 })

        Column() {
          Text('用户上传')
            .fontSize(14)
            .fontWeight(this.activeMaterialTab === 2 ? FontWeight.Bold : FontWeight.Normal)
            .fontColor(this.activeMaterialTab === 2 ? Constants.COLOR_PRIMARY : Constants.COLOR_TEXT_SECONDARY)
        }
        .padding({ top: 6, bottom: 6, left: 12, right: 12 })
        .backgroundColor(this.activeMaterialTab === 2 ? 0x1A0078D7 : 'transparent')
        .borderRadius(16)
        .onClick(() => {
          this.activeMaterialTab = 2;
        })
      }
      .width('100%')
      .margin({ bottom: 12 })

      Row() {
        Button() {
          Row() {
            if (this.isGeneratingMaterials) {
              LoadingProgress()
                .width(16)
                .height(16)
                .margin({ right: 4 })
            }
            Text(this.isGeneratingMaterials ? '生成中...' : '🤖 AI补充资料')
              .fontSize(14)
              .fontColor('#FFFFFF')
          }
        }
        .layoutWeight(1)
        .height(40)
        .backgroundColor(Constants.COLOR_PRIMARY)
        .borderRadius(20)
        .onClick(() => {
          this.generateAIMaterials();
        })

        Button() {
          Text(this.showUploadInput ? '✕ 收起' : '📤 上传')
            .fontSize(14)
            .fontColor(Constants.COLOR_TEXT)
        }
        .height(40)
        .backgroundColor('#FFFFFF')
        .borderRadius(20)
        .margin({ left: 8 })
        .onClick(() => {
          this.showUploadInput = !this.showUploadInput;
        })
        .shadow({ radius: 2, offsetY: 1, color: 0x0A000000 })
      }
      .width('100%')
      .margin({ bottom: 8 })

      if (this.showUploadInput) {
        Column() {
          TextInput({ placeholder: '资料标题', text: this.uploadTitle })
            .width('100%')
            .height(40)
            .backgroundColor('#FFFFFF')
            .borderRadius(8)
            .padding({ left: 12, right: 12 })
            .onChange((value: string) => {
              this.uploadTitle = value;
            })
            .margin({ bottom: 8 })

          TextInput({ placeholder: '粘贴内容或URL', text: this.uploadContent })
            .width('100%')
            .height(40)
            .backgroundColor('#FFFFFF')
            .borderRadius(8)
            .padding({ left: 12, right: 12 })
            .onChange((value: string) => {
              this.uploadContent = value;
            })
            .margin({ bottom: 8 })

          Button() {
            Text('确认上传')
              .fontSize(14)
              .fontColor('#FFFFFF')
          }
          .width('100%')
          .height(36)
          .backgroundColor(Constants.COLOR_PRIMARY)
          .borderRadius(18)
          .onClick(() => {
            this.addUserMaterial();
          })
        }
        .width('100%')
        .padding(12)
        .backgroundColor(Constants.COLOR_CARD)
        .borderRadius(12)
        .margin({ bottom: 12 })
      }

      ForEach(this.getFilteredMaterials(), (material: LearningMaterial) => {
        Column() {
          Row() {
            Stack() {
              Circle()
                .width(36)
                .height(36)
                .fill(this.getTypeBgColor(material.type))
              Text(this.getTypeLabel(material.type))
                .fontSize(10)
                .fontColor(this.getTypeColor(material.type))
                .fontWeight(FontWeight.Bold)
            }
            .width(36)
            .height(36)

            Column() {
              Text(material.title)
                .fontSize(14)
                .fontWeight(FontWeight.Bold)
                .fontColor(Constants.COLOR_TEXT)
                .maxLines(1)
                .textOverflow({ overflow: TextOverflow.Ellipsis })

              Text(material.summary)
                .fontSize(11)
                .fontColor(Constants.COLOR_TEXT_SECONDARY)
                .margin({ top: 2 })
                .maxLines(2)
                .textOverflow({ overflow: TextOverflow.Ellipsis })

              Row() {
                Text(this.getTypeLabel(material.type))
                  .fontSize(10)
                  .fontColor(this.getTypeColor(material.type))
                  .padding({ top: 2, bottom: 2, left: 6, right: 6 })
                  .backgroundColor(this.getTypeBgColor(material.type))
                  .borderRadius(8)

                Text(this.getSourceLabel(material.source))
                  .fontSize(10)
                  .fontColor(this.getSourceColor(material.source))
                  .padding({ top: 2, bottom: 2, left: 6, right: 6 })
                  .backgroundColor(this.getSourceBgColor(material.source))
                  .borderRadius(8)
                  .margin({ left: 6 })
              }
              .margin({ top: 4 })
            }
            .layoutWeight(1)
            .margin({ left: 10 })
            .alignItems(HorizontalAlign.Start)

            Text('→')
              .fontSize(16)
              .fontColor(Constants.COLOR_TEXT_SECONDARY)
              .margin({ left: 4 })
          }
          .width('100%')
        }
        .width('100%')
        .padding(12)
        .backgroundColor(Constants.COLOR_CARD)
        .borderRadius(12)
        .shadow({ radius: 2, offsetY: 1, color: 0x06000000 })
        .margin({ bottom: 8 })
        .onClick(() => {
          this.selectedMaterial = material;
          this.showMaterialDetail = true;
          this.onMaterialClicked(material);
        })
      }, (material: LearningMaterial) => material.id)

      if (this.getFilteredMaterials().length === 0) {
        Column() {
          Text('📚')
            .fontSize(32)
          Text('暂无学习资料')
            .fontSize(14)
            .fontColor(Constants.COLOR_TEXT_SECONDARY)
            .margin({ top: 8 })
          Text('点击按钮AI补充或手动上传学习资料')
            .fontSize(12)
            .fontColor(Constants.COLOR_TEXT_SECONDARY)
            .margin({ top: 4 })
        }
        .width('100%')
        .padding({ top: 32, bottom: 32 })
        .alignItems(HorizontalAlign.Center)
      }
    }
    .width('100%')
  }

  @Builder buildMaterialDetail() {
    Column() {
      Column()
        .width('100%')
        .layoutWeight(1)
        .onClick(() => {
          this.closeMaterialDetail();
        })

      Column() {
        Row() {
          Text(this.selectedMaterial!.title)
            .fontSize(18)
            .fontWeight(FontWeight.Bold)
            .fontColor(Constants.COLOR_TEXT)
            .layoutWeight(1)

          Text('✕')
            .fontSize(20)
            .fontColor(Constants.COLOR_TEXT_SECONDARY)
            .onClick(() => {
              this.closeMaterialDetail();
            })
        }
        .width('100%')
        .margin({ bottom: 12 })

        Row() {
          Text(this.getTypeLabel(this.selectedMaterial!.type))
            .fontSize(11)
            .fontColor('#FFFFFF')
            .padding({ top: 3, bottom: 3, left: 8, right: 8 })
            .backgroundColor(this.getTypeColor(this.selectedMaterial!.type))
            .borderRadius(10)

          Text(this.getSourceLabel(this.selectedMaterial!.source))
            .fontSize(11)
            .fontColor(this.getSourceColor(this.selectedMaterial!.source))
            .padding({ top: 3, bottom: 3, left: 8, right: 8 })
            .backgroundColor(this.getSourceBgColor(this.selectedMaterial!.source))
            .borderRadius(10)
            .margin({ left: 8 })

          if (this.selectedMaterial!.content.length >= 500) {
            Text('详细')
              .fontSize(10)
              .fontColor('#10B981')
              .backgroundColor(0x1A10B981)
              .padding({ left: 6, right: 6, top: 2, bottom: 2 })
              .borderRadius(8)
              .margin({ left: 6 })
          }
        }
        .margin({ bottom: 12 })

        Scroll() {
          Column() {
            if (this.selectedMaterial!.content.length > 0) {
              if (this.selectedMaterial!.content.length < 300) {
                Row() {
                  Text('📝')
                    .fontSize(14)
                    .margin({ right: 6 })
                  Text('当前内容较为简略，点击下方按钮生成完整详细讲解')
                    .fontSize(12)
                    .fontColor(Constants.COLOR_ACCENT_ORANGE)
                    .lineHeight(18)
                }
                .width('100%')
                .padding(12)
                .backgroundColor(0x1AF59E0B)
                .borderRadius(8)
                .margin({ bottom: 12 })
              }

              Text(this.selectedMaterial!.content)
                .fontSize(14)
                .fontColor(Constants.COLOR_TEXT)
                .lineHeight(24)
                .width('100%')
            } else {
              Column() {
                Text('暂无内容')
                  .fontSize(14)
                  .fontColor(Constants.COLOR_TEXT_SECONDARY)
                  .margin({ bottom: 8 })
                Text('点击下方按钮即可让AI生成完整的详细教学内容')
                  .fontSize(12)
                  .fontColor(Constants.COLOR_TEXT_SECONDARY)
              }
              .width('100%')
              .padding({ top: 20, bottom: 20 })
              .alignItems(HorizontalAlign.Center)
            }

            if (this.selectedMaterial!.keywords.length > 0) {
              Text('关键词')
                .fontSize(14)
                .fontWeight(FontWeight.Bold)
                .fontColor(Constants.COLOR_TEXT)
                .width('100%')
                .margin({ top: 16, bottom: 8 })

              Flex({ wrap: FlexWrap.Wrap }) {
                ForEach(this.selectedMaterial!.keywords, (kw: string) => {
                  Text(kw)
                    .fontSize(11)
                    .fontColor(Constants.COLOR_PRIMARY)
                    .padding({ top: 4, bottom: 4, left: 10, right: 10 })
                    .backgroundColor(Constants.COLOR_ACCENT_BLUE_LIGHT)
                    .borderRadius(12)
                    .margin({ right: 6, bottom: 6 })
                }, (kw: string) => kw)
              }
              .width('100%')
            }

            if (this.selectedMaterial!.content.length >= 500) {
              Text('提示：内容采用Markdown格式，## 表示章节标题，每个章节下包含详细讲解')
                .fontSize(11)
                .fontColor(Constants.COLOR_TEXT_SECONDARY)
                .width('100%')
                .margin({ top: 16 })
                .lineHeight(16)
            }
          }
          .width('100%')
        }
        .layoutWeight(1)
        .margin({ top: 8 })

        if (this.aiEnabled) {
          Button() {
            if (this.isGeneratingDetail) {
              Row() {
                LoadingProgress()
                  .width(18)
                  .height(18)
                  .margin({ right: 6 })
                Text('正在生成详细讲解...')
                  .fontSize(14)
                  .fontColor('#FFFFFF')
              }
            } else {
              Text('🤖 AI 深度讲解')
                .fontSize(14)
                .fontColor('#FFFFFF')
            }
          }
          .width('100%')
          .height(44)
          .backgroundColor(Constants.COLOR_ACCENT_PURPLE)
          .borderRadius(22)
          .enabled(!this.isGeneratingDetail)
          .onClick(() => {
            this.generateAIForMaterial();
          })
          .margin({ top: 8 })
        }

        Button() {
          Text('关闭')
            .fontSize(14)
            .fontColor('#FFFFFF')
        }
        .width('100%')
        .height(40)
        .backgroundColor(Constants.COLOR_PRIMARY)
        .borderRadius(20)
        .margin({ top: 8 })
        .onClick(() => {
          this.closeMaterialDetail();
        })
      }
      .width('100%')
      .height('90%')
      .padding(20)
      .backgroundColor(Constants.COLOR_CARD)
      .borderRadius({ topLeft: 20, topRight: 20 })
    }
    .width('100%')
    .height('100%')
    .backgroundColor(0x66000000)
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
      const detail = await aiService.generateMaterialDetail(
        this.courseTitle,
        this.selectedMaterial.title
      );
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
    } catch (e) {
      console.error('Generate material detail failed: ' + JSON.stringify(e));
    }
    this.isGeneratingDetail = false;
  }

  async generateAIMaterials(): Promise<void> {
    this.isGeneratingMaterials = true;

    if (this.aiEnabled) {
      try {
        const response = await aiService.ask(
          '请为"' + this.courseTitle + '"课程生成4个高质量学习资料。每个资料必须包含：标题、详细的Markdown格式教学内容（至少800字，包含##概述、##核心知识（3个小节）、##实践应用、##总结要点）、关键词数组。返回JSON数组，格式：[{"title": "...", "content": "...完整详细内容...", "keywords": [...]}]。内容一定要详细专业。',
          '你是顶级学科专家和教材撰写专家。生成的学习资料要有深度、有结构、有教育价值。每个资料的内容部分是完整的知识点讲解，不是摘要。使用Markdown格式。只返回JSON数组。'
        );

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
            const mat = LearningMaterial.createFromAI(
              (item['title'] as string) || this.courseTitle + '资料' + (i + 1),
              itemContent,
              this.courseId,
              (item['keywords'] as string[]) || []
            );
            mat.summary = (item['summary'] as string) || itemContent.substring(0, 100) + '...';
            newMaterials.push(mat);
          }
          if (newMaterials.length >= 2) {
            this.materials = this.materials.concat(newMaterials);
            globalData.setMaterials(this.courseId, this.materials);
            StorageUtil.saveData();
          } else {
            this.addDefaultAIMaterials();
          }
        } else {
          this.addDefaultAIMaterials();
        }
      } catch (e) {
        console.error('AI generate materials failed: ' + JSON.stringify(e));
        this.addDefaultAIMaterials();
      }
    } else {
      this.addDefaultAIMaterials();
    }
    this.isGeneratingMaterials = false;
  }

  addDefaultAIMaterials(): void {
    const topic = this.courseTitle;
    const defaults: LearningMaterial[] = [];

    const d1 = LearningMaterial.createFromAI(
      topic + '核心知识体系深度解析',
      '## 概述\n\n' + topic + '的核心知识体系是一个多层次、多维度的知识网络。掌握这一体系是学好' + topic + '的关键。本资料将从头开始，系统性地构建起完整的知识框架。\n\n## 核心知识\n\n### 1. 理论基础\n' + topic + '的理论基础建立在前人大量研究和实践基础之上。其核心理论包括：系统论、信息论和控制论三大支柱。理解这些基础理论有助于把握' + topic + '的本质特征和发展规律。\n\n### 2. 方法论体系\n' + topic + '的方法论体系包含多个层面的分析方法和技术工具。从定性分析到定量计算，从理论推演到实证验证，形成了一个完整的方法工具箱。\n\n### 3. 应用框架\n将理论知识转化为实践能力，需要一个清晰的应用框架。本部分将介绍' + topic + '的标准应用流程和最佳实践模式。\n\n## 实践应用\n\n在实际学习中，建议采用"理解-练习-反思"的循环模式。每学习一个知识点后，立即通过练习来巩固，然后反思自己的理解是否存在偏差。\n\n## 总结要点\n1. 建立系统性认知是学好' + topic + '的第一步\n2. 理论与实践相结合是最有效的学习路径\n3. 持续反思和总结能够加速知识内化',
      this.courseId,
      ['知识框架', '核心概念', '方法论', '学习路径']
    );
    defaults.push(d1);

    const d2 = LearningMaterial.createFromAI(
      topic + '常见误区与避坑指南',
      '## 概述\n\n学习' + topic + '的过程中，初学者往往会陷入一些常见的误区和思维陷阱。提前了解这些误区，可以帮助你避开学习路上的"坑"，事半功倍。\n\n## 核心知识\n\n### 1. 概念混淆\n最常见的误区是混淆' + topic + '中的相近概念。例如对基本概念的理解停留在表面，没有深入把握其本质区别。建议通过对比学习法和案例分析法来加深理解。\n\n### 2. 方法误用\n很多学习者在掌握了某种方法后，会在所有场景中生搬硬套。正确的做法是根据具体问题选择合适的方法，必要时进行方法组合。\n\n### 3. 实践盲区\n理论学习充分但实践不足是另一个常见问题。知识只有在应用中才能真正内化。建议在每个学习阶段都配合相应的实践练习。\n\n## 实践应用\n\n建立一个"错题本"或"误区记录本"，记录自己在学习和实践中遇到的问题和错误，定期回顾和总结。\n\n## 总结要点\n1. 概念理解要追根溯源\n2. 方法选择要因地制宜\n3. 实践练习要贯穿始终',
      this.courseId,
      ['常见误区', '避坑指南', '概念辨析', '学习方法']
    );
    defaults.push(d2);

    const d3 = LearningMaterial.createFromAI(
      topic + '实践案例分析',
      '## 概述\n\n通过真实世界中的案例分析，将' + topic + '的抽象理论知识具体化、场景化，是最高效的学习方式之一。本资料精选多个经典案例进行深度剖析。\n\n## 核心知识\n\n### 1. 案例一：基础应用场景\n该案例展示了' + topic + '基础知识的典型应用场景。通过对这个案例的详细分析，学习者可以建立起"理论→实践"的基本认知路径。\n\n### 2. 案例二：复杂问题解决\n在掌握了基础应用后，本案例展示了如何运用' + topic + '知识解决更复杂的实际问题。这需要学习者具备知识整合和灵活运用的能力。\n\n### 3. 案例三：创新性应用\n最高层次的应用是创新。本案例展示了如何在前人工作的基础上，运用' + topic + '知识进行创新性的探索和实践。\n\n## 实践应用\n\n建议学习者在阅读案例的同时，尝试自己动手复现案例中的分析和决策过程。只有亲手做一遍，才能真正理解其中的精髓。\n\n## 总结要点\n1. 案例学习是连接理论和实践的桥梁\n2. 从模仿到创新是能力提升的必由之路\n3. 多角度分析案例能够拓宽思维视野',
      this.courseId,
      ['实践案例', '应用分析', '场景学习', '最佳实践']
    );
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
        confirm: { value: '确定', action: () => {} }
      });
      return;
    }

    const material = LearningMaterial.createFromUpload(
      this.uploadTitle,
      this.uploadContent.startsWith('http') ? MaterialType.WEB : MaterialType.MARKDOWN,
      this.uploadContent,
      this.courseId
    );
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
      confirm: { value: '确定', action: () => {} }
    });
  }
}
