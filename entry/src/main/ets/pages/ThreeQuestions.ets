import { router } from '@kit.ArkUI';
import { Course, Disagreement, KnowledgeNode } from '../model/CourseModel';
import { Question, QuestionOption, BloomLevel, QuestionBank } from '../model/QuestionModel';
import { globalData, ReviewItem } from '../model/LearningData';
import { Constants } from '../utils/Constants';
import { KnowledgeGraph } from '../components/KnowledgeGraph';
import { aiService, AIKnowledgeNode, AIDisagreement, AIQuestion } from '../model/AIService';
import { StorageUtil } from '../utils/StorageUtil';

@Entry
@Component
struct ThreeQuestions {
  @State courseId: string = '';
  @State courseTitle: string = '';
  @State initialTab: number = 0;
  @State currentTab: number = 0;
  @State course: Course | null = null;

  @State questions: Question[] = [];
  @State currentQIndex: number = 0;
  @State selectedOption: string = '';
  @State showResult: boolean = false;
  @State answerCorrect: boolean = false;
  @State answeredCount: number = 0;
  @State aiEnabled: boolean = false;
  @State isAILoading: boolean = false;

  @State aiKnowledgeNodes: AIKnowledgeNode[] = [];
  @State aiKGLoading: boolean = false;
  @State expandedNodeIds: string[] = [];

  @State aiDisagreements: AIDisagreement[] = [];
  @State aiDisLoading: boolean = false;

  @State aiQuizQuestions: AIQuestion[] = [];
  @State aiQuizLoading: boolean = false;
  @State quizAISource: boolean = false;
  @State dueReviewCount: number = 0;
  @State showReviewSection: boolean = false;
  @State reviewItems: ReviewItem[] = [];
  @State reviewIndex: number = 0;
  @State showReviewDetail: boolean = false;

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

  build() {
    Column() {
      this.buildTopBar()
      this.buildTabBar()
      this.buildProgressBar()

      if (this.course) {
        Scroll() {
          Column() {
            if (this.currentTab === 0) {
              this.buildMentalModel()
            } else if (this.currentTab === 1) {
              this.buildDisagreements()
            } else {
              this.buildAssessment()
            }
            this.buildReviewSection()
          }
          .width('100%')
          .padding({ left: 20, right: 20, bottom: 20 })
        }
        .layoutWeight(1)
      }
    }
    .width('100%')
    .height('100%')
    .backgroundColor(Constants.COLOR_BACKGROUND)
  }

  @Builder buildProgressBar() {
    if (this.course) {
      Row() {
        this.buildProgressStep('Q1', this.course.q1Completed, Constants.COLOR_PRIMARY)
        this.buildProgressConnector(this.course.q1Completed)
        this.buildProgressStep('Q2', this.course.q2Completed, Constants.COLOR_ACCENT_PURPLE)
        this.buildProgressConnector(this.course.q2Completed)
        this.buildProgressStep('Q3', this.course.q3Completed, Constants.COLOR_ACCENT_GREEN)
      }
      .width('100%')
      .padding({ left: 24, right: 24, top: 12, bottom: 4 })
    }
  }

  @Builder buildProgressStep(label: string, completed: boolean, color: ResourceColor) {
    Column() {
      Stack() {
        Circle()
          .width(24)
          .height(24)
          .fill(completed ? color : 0x0F000000)
          .stroke(completed ? color : Constants.COLOR_DIVIDER)
          .strokeWidth(2)
        Text(completed ? '✓' : label)
          .fontSize(completed ? 12 : 9)
          .fontColor(completed ? '#FFFFFF' : Constants.COLOR_TEXT_SECONDARY)
          .fontWeight(FontWeight.Bold)
      }
    }
  }

  @Builder buildProgressConnector(completed: boolean) {
    Row()
      .height(2)
      .layoutWeight(1)
      .backgroundColor(completed ? Constants.COLOR_PRIMARY_LIGHT : Constants.COLOR_DIVIDER)
      .margin({ left: 4, right: 4 })
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
        .onClick(() => { router.back(); })

      Blank()

      Text(this.courseTitle)
        .fontSize(17)
        .fontWeight(FontWeight.Bold)
        .fontColor(Constants.COLOR_TEXT)
        .maxLines(1)
        .textOverflow({ overflow: TextOverflow.Ellipsis })

      Blank()

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
    .width('100%')
    .padding({ left: 16, right: 16, top: 12, bottom: 12 })
    .backgroundColor('#FFFFFF')
    .shadow({ radius: 2, offsetY: 1, color: 0x0A000000 })
  }

  @Builder buildTabBar() {
    Row() {
      this.buildTabItem('Q1 心智模型', 0, Constants.COLOR_PRIMARY)
      this.buildTabItem('Q2 学术分歧', 1, Constants.COLOR_ACCENT_PURPLE)
      this.buildTabItem('Q3 深度测评', 2, Constants.COLOR_ACCENT_GREEN)
    }
    .width('100%')
    .padding(6)
    .backgroundColor(Constants.COLOR_CARD)
    .margin({ top: 8, left: 16, right: 16 })
    .borderRadius(12)
  }

  @Builder buildTabItem(label: string, index: number, color: ResourceColor) {
    Column() {
      Text(label)
        .fontSize(13)
        .fontWeight(this.currentTab === index ? FontWeight.Bold : FontWeight.Normal)
        .fontColor(this.currentTab === index ? '#FFFFFF' : Constants.COLOR_TEXT_SECONDARY)
    }
    .layoutWeight(1)
    .padding({ top: 8, bottom: 8 })
    .backgroundColor(this.currentTab === index ? color : 'transparent')
    .borderRadius(8)
    .onClick(() => { this.currentTab = index; })
  }

  @Builder buildMentalModel() {
    Column() {
      Text(Constants.TITLE_MENTAL_MODEL)
        .fontSize(18)
        .fontWeight(FontWeight.Bold)
        .fontColor(Constants.COLOR_TEXT)
        .width('100%')
        .margin({ top: 16 })

      Text(Constants.Q1_INFO)
        .fontSize(13)
        .fontColor(Constants.COLOR_TEXT_SECONDARY)
        .width('100%')
        .margin({ top: 6 })

      if (this.course) {
        KnowledgeGraph({ nodes: this.course.knowledgeGraph })
          .margin({ top: 16 })
      }

      Row() {
        Button('AI生成知识图谱')
          .height(40)
          .backgroundColor(Constants.COLOR_PRIMARY)
          .borderRadius(20)
          .layoutWeight(1)
          .onClick(() => {
            this.generateAIGraph();
          })

        if (this.aiKGLoading) {
          LoadingProgress()
            .width(24)
            .height(24)
            .color(Constants.COLOR_PRIMARY)
            .margin({ left: 12 })
        }
      }
      .width('100%')
      .margin({ top: 16 })

      if (this.aiKnowledgeNodes.length > 0) {
        this.buildAITreeView()
      }

      Column() {
        Text(this.aiKnowledgeNodes.length > 0 ? 'AI生成知识框架' : '学科框架拆解')
          .fontSize(14)
          .fontWeight(FontWeight.Bold)
          .fontColor(Constants.COLOR_TEXT)
          .width('100%')
          .margin({ bottom: 8 })

        ForEach(this.aiKnowledgeNodes.length > 0 ? this.getFlatNodeList() : this.getStaticNodeList(),
          (item: NodeListItem) => {
            this.buildTreeNode(item)
          },
          (item: NodeListItem) => item.id)
      }
      .width('100%')
      .padding(12)
      .backgroundColor(Constants.COLOR_CARD)
      .borderRadius(12)
      .margin({ top: 16 })

      if (!this.course?.q1Completed) {
        Button('标记第一问完成')
          .width('100%')
          .height(44)
          .backgroundColor(Constants.COLOR_PRIMARY)
          .borderRadius(22)
          .margin({ top: 20 })
          .onClick(() => {
            if (this.course) {
              this.course.q1Completed = true;
              globalData.updateCourseProgress(this.course.id, 33);
              AlertDialog.show({
                title: '已完成第一问',
                message: '心智模型已提取，建议进入第二问深入探索',
                confirm: { value: '好的', action: () => {} }
              });
            }
          })
      }
    }
    .width('100%')
  }

  @Builder buildAITreeView() {
    Column() {
      Text('AI生成的知识图谱')
        .fontSize(14)
        .fontWeight(FontWeight.Bold)
        .fontColor(Constants.COLOR_PRIMARY)
        .width('100%')
        .margin({ bottom: 8 })

      ForEach(this.getVisibleTreeNodes(), (item: TreeNodeItem) => {
        Row() {
          Row()
            .width(item.depth * 20)
            .height(1)

          if (item.node.children && item.node.children.length > 0) {
            Text(this.isNodeExpanded(item.node.id) ? '▼' : '▶')
              .fontSize(10)
              .fontColor(Constants.COLOR_TEXT_SECONDARY)
              .margin({ right: 4 })
          } else {
            Row()
              .width(14)
              .height(1)
          }

          Circle()
            .width(item.depth === 0 ? 12 : 8)
            .height(item.depth === 0 ? 12 : 8)
            .fill(this.getNodeLevelColor(item.node.level))
            .margin({ right: 8 })

          Text(item.node.name)
            .fontSize(item.depth === 0 ? 14 : 13)
            .fontWeight(item.depth === 0 ? FontWeight.Bold : FontWeight.Normal)
            .fontColor(Constants.COLOR_TEXT)
            .layoutWeight(1)
        }
        .width('100%')
        .padding({ top: 6, bottom: 6, left: 8, right: 8 })
        .borderRadius(6)
        .backgroundColor(item.depth === 0 ? 0x060078D7 : 'transparent')
        .onClick(() => {
          if (item.node.children && item.node.children.length > 0) {
            this.toggleNode(item.node.id);
          } else {
            AlertDialog.show({
              title: item.node.name,
              message: item.node.description || '暂无详细描述',
              confirm: { value: '知道了', action: () => {} }
            });
          }
        })

        if (this.isNodeExpanded(item.node.id) && item.node.description) {
          Text(item.node.description)
            .fontSize(12)
            .fontColor(Constants.COLOR_TEXT_SECONDARY)
            .lineHeight(18)
            .padding({ left: item.depth * 20 + 30, bottom: 6, right: 8 })
        }

        if (this.isNodeExpanded(item.node.id) && item.node.relatedConcepts && item.node.relatedConcepts.length > 0) {
          Row() {
            Text('关联: ')
              .fontSize(10)
              .fontColor(Constants.COLOR_ACCENT_ORANGE)
            ForEach(item.node.relatedConcepts, (rc: string) => {
              Text(rc)
                .fontSize(10)
                .fontColor(Constants.COLOR_TEXT_SECONDARY)
                .padding({ left: 4, right: 4, top: 2, bottom: 2 })
                .backgroundColor(0x0F000000)
                .borderRadius(4)
                .margin({ right: 4 })
            }, (rc: string) => rc)
          }
          .padding({ left: item.depth * 20 + 30, bottom: 6, right: 8 })
        }
      }, (item: TreeNodeItem) => item.node.id + '_' + item.depth)
    }
    .width('100%')
    .padding(12)
    .backgroundColor(0x060078D7)
    .borderRadius(12)
    .margin({ top: 16 })
  }

  @Builder buildTreeNode(item: NodeListItem) {
    Row() {
      Circle()
        .width(8)
        .height(8)
        .fill(item.color)
        .margin({ right: 8 })
      Text(item.name)
        .fontSize(13)
        .fontColor(Constants.COLOR_TEXT)
      Blank()
      if (item.hasChildren) {
        Text('展开 →')
          .fontSize(11)
          .fontColor(Constants.COLOR_PRIMARY)
      }
    }
    .width('100%')
    .padding({ top: 8, bottom: 8 })
    .borderRadius(8)
    .onClick(() => {
      if (item.isAIExpandable) {
        this.toggleNode(item.id);
      } else {
        AlertDialog.show({
          title: item.name,
          message: `${item.description}\n\n包含${item.childrenCount}个子知识点`,
          confirm: { value: '知道了', action: () => {} }
        });
      }
    })
  }

  @Builder buildDisagreements() {
    Column() {
      Text(Constants.TITLE_DISAGREEMENT)
        .fontSize(18)
        .fontWeight(FontWeight.Bold)
        .fontColor(Constants.COLOR_TEXT)
        .width('100%')
        .margin({ top: 16 })

      Text(Constants.Q2_INFO)
        .fontSize(13)
        .fontColor(Constants.COLOR_TEXT_SECONDARY)
        .width('100%')
        .margin({ top: 6 })

      Row() {
        Button('AI挖掘学术分歧')
          .height(40)
          .backgroundColor(Constants.COLOR_ACCENT_PURPLE)
          .borderRadius(20)
          .layoutWeight(1)
          .onClick(() => {
            this.generateAIDisagreements();
          })

        if (this.aiDisLoading) {
          LoadingProgress()
            .width(24)
            .height(24)
            .color(Constants.COLOR_ACCENT_PURPLE)
            .margin({ left: 12 })
        }
      }
      .width('100%')
      .margin({ top: 12 })

      ForEach(this.aiDisagreements.length > 0 ? this.aiDisagreements :
        (this.course ? this.course.disagreements : []), (dis: AIDisagreement | Disagreement) => {
        Column() {
          Text(dis.topic)
            .fontSize(14)
            .fontWeight(FontWeight.Bold)
            .fontColor(Constants.COLOR_TEXT)
            .width('100%')

          Row() {
            this.buildViewCard('观点 A', dis.viewA, Constants.COLOR_PRIMARY)
            this.buildViewCard('观点 B', dis.viewB, Constants.COLOR_ACCENT_PURPLE)
          }
          .width('100%')
          .margin({ top: 8 })

          this.buildEvidenceChain(dis)

          this.buildEnhancedConclusion(dis)
        }
        .width('100%')
        .padding(14)
        .backgroundColor(Constants.COLOR_CARD)
        .borderRadius(16)
        .shadow({ radius: 4, offsetY: 1, color: 0x0A000000 })
        .margin({ top: 16 })
      }, (dis: AIDisagreement | Disagreement) => dis.id)

      if (!this.course?.q2Completed) {
        Button('标记第二问完成')
          .width('100%')
          .height(44)
          .backgroundColor(Constants.COLOR_ACCENT_PURPLE)
          .borderRadius(22)
          .margin({ top: 20 })
          .onClick(() => {
            if (this.course) {
              this.course.q2Completed = true;
              globalData.updateCourseProgress(this.course.id, 66);
              AlertDialog.show({
                title: '已完成第二问',
                message: '学术分歧已挖掘，建议进入第三问检验学习效果',
                confirm: { value: '好的', action: () => {} }
              });
            }
          })
      }
    }
    .width('100%')
  }

  @Builder buildEvidenceChain(dis: AIDisagreement | Disagreement) {
    Column() {
      Text('证据链分析')
        .fontSize(12)
        .fontWeight(FontWeight.Bold)
        .fontColor(Constants.COLOR_TEXT)
        .width('100%')
        .margin({ bottom: 8 })

      Row() {
        Column() {
          Stack() {
            Circle()
              .width(20)
              .height(20)
              .fill(Constants.COLOR_PRIMARY)
            Text('A')
              .fontSize(10)
              .fontColor('#FFFFFF')
              .fontWeight(FontWeight.Bold)
          }
          .width(20)
          .height(20)
          .margin({ bottom: 4 })

          Text(dis.evidenceA)
            .fontSize(11)
            .fontColor(Constants.COLOR_TEXT_SECONDARY)
            .lineHeight(16)
        }
        .layoutWeight(1)
        .padding(8)
        .backgroundColor(0x0F0078D7)
        .borderRadius(8)
        .margin({ right: 4 })

        Column() {
          Text('→')
            .fontSize(18)
            .fontColor(Constants.COLOR_TEXT_SECONDARY)
        }
        .width(20)
        .justifyContent(FlexAlign.Center)

        Column() {
          Stack() {
            Circle()
              .width(24)
              .height(24)
              .fill(Constants.COLOR_ACCENT_GREEN)
            Text('结')
              .fontSize(10)
              .fontColor('#FFFFFF')
              .fontWeight(FontWeight.Bold)
          }
          .width(24)
          .height(24)
          .margin({ bottom: 4 })

          Text(dis.conclusion)
            .fontSize(12)
            .fontColor(Constants.COLOR_TEXT)
            .lineHeight(17)
            .fontWeight(FontWeight.Medium)
        }
        .layoutWeight(1.2)
        .padding(8)
        .backgroundColor(0x0F10B981)
        .borderRadius(8)
        .margin({ left: 4, right: 4 })

        Column() {
          Text('←')
            .fontSize(18)
            .fontColor(Constants.COLOR_TEXT_SECONDARY)
        }
        .width(20)
        .justifyContent(FlexAlign.Center)

        Column() {
          Stack() {
            Circle()
              .width(20)
              .height(20)
              .fill(Constants.COLOR_ACCENT_PURPLE)
            Text('B')
              .fontSize(10)
              .fontColor('#FFFFFF')
              .fontWeight(FontWeight.Bold)
          }
          .width(20)
          .height(20)
          .margin({ bottom: 4 })

          Text(dis.evidenceB)
            .fontSize(11)
            .fontColor(Constants.COLOR_TEXT_SECONDARY)
            .lineHeight(16)
        }
        .layoutWeight(1)
        .padding(8)
        .backgroundColor(0x0F8B5CF6)
        .borderRadius(8)
        .margin({ left: 4 })
      }
      .width('100%')
    }
    .width('100%')
    .padding(10)
    .backgroundColor(0x0F000000)
    .borderRadius(8)
    .margin({ top: 8 })
  }

  @Builder buildEnhancedConclusion(dis: AIDisagreement | Disagreement) {
    Column() {
      Row() {
        Text('💡')
          .fontSize(14)
          .margin({ right: 6 })
        Text('综合结论')
          .fontSize(12)
          .fontWeight(FontWeight.Bold)
          .fontColor(Constants.COLOR_ACCENT_GREEN)
      }

      Text(dis.conclusion)
        .fontSize(12)
        .fontColor(Constants.COLOR_TEXT)
        .lineHeight(18)
        .margin({ top: 4 })
    }
    .width('100%')
    .padding(12)
    .backgroundColor(0x0F10B981)
    .borderRadius(8)
    .margin({ top: 8 })
  }

  @Builder buildViewCard(label: string, content: string, color: ResourceColor) {
    Column() {
      Row() {
        Stack() {
          Circle()
            .width(16)
            .height(16)
            .fill(color)
          Text(label.slice(-1)).fontSize(9).fontColor('#FFFFFF')
        }
        .width(16)
        .height(16)
        Text(label)
          .fontSize(11)
          .fontWeight(FontWeight.Bold)
          .fontColor(color)
          .margin({ left: 4 })
      }
      Text(content)
        .fontSize(11)
        .fontColor(Constants.COLOR_TEXT)
        .lineHeight(16)
        .margin({ top: 6 })
    }
    .layoutWeight(1)
    .padding(10)
    .backgroundColor(0x0F000000)
    .borderRadius(8)
    .margin({ left: 4, right: 4 })
  }

  @Builder buildAssessment() {
    Column() {
      Text(Constants.TITLE_ASSESSMENT)
        .fontSize(18)
        .fontWeight(FontWeight.Bold)
        .fontColor(Constants.COLOR_TEXT)
        .width('100%')
        .margin({ top: 16 })

      Text(Constants.Q3_INFO)
        .fontSize(13)
        .fontColor(Constants.COLOR_TEXT_SECONDARY)
        .width('100%')
        .margin({ top: 6 })

      Row() {
        Button('AI生成测评题')
          .height(40)
          .backgroundColor(Constants.COLOR_ACCENT_GREEN)
          .borderRadius(20)
          .layoutWeight(1)
          .onClick(() => {
            this.generateAIQuiz();
          })

        if (this.aiQuizLoading) {
          LoadingProgress()
            .width(24)
            .height(24)
            .color(Constants.COLOR_ACCENT_GREEN)
            .margin({ left: 12 })
        }
      }
      .width('100%')
      .margin({ top: 12 })

      if (this.questions.length > 0 && this.currentQIndex < this.questions.length) {
        if (this.showResult) {
          this.buildResult()
        } else {
          this.buildQuestion()
        }
      } else if (this.answeredCount > 0 && this.currentQIndex >= this.questions.length) {
        this.buildComplete()
      } else {
        Column() {
          Text('开始测评以检验学习效果')
            .fontSize(14)
            .fontColor(Constants.COLOR_TEXT_SECONDARY)
            .margin({ top: 40 })

          Button('开始测评')
            .width(200)
            .height(48)
            .backgroundColor(Constants.COLOR_ACCENT_GREEN)
            .borderRadius(24)
            .margin({ top: 20 })
            .onClick(() => {
              if (this.aiQuizQuestions.length > 0) {
                this.questions = this.convertAIQuestionsToQuestions(this.aiQuizQuestions, this.courseId);
                this.quizAISource = true;
              } else {
                this.questions = QuestionBank.generateQuestions(this.courseId, this.courseTitle);
                this.quizAISource = false;
              }
              this.currentQIndex = 0;
              this.answeredCount = 0;
            })
        }
        .width('100%')
        .justifyContent(FlexAlign.Center)
      }
    }
    .width('100%')
  }

  @Builder buildQuestion() {
    if (this.currentQIndex < this.questions.length) {
      Column() {
      Row() {
        Text(`第 ${this.currentQIndex + 1}/${this.questions.length} 题`)
          .fontSize(12)
          .fontColor(Constants.COLOR_TEXT_SECONDARY)
        Blank()
        if (this.quizAISource) {
          Text('AI')
            .fontSize(9)
            .fontColor('#FFFFFF')
            .fontWeight(FontWeight.Bold)
            .padding({ left: 6, right: 6, top: 2, bottom: 2 })
            .backgroundColor(Constants.COLOR_ACCENT_GREEN)
            .borderRadius(8)
            .margin({ right: 6 })
        }
        Row() {
          Circle()
            .width(8)
            .height(8)
            .fill(this.getLevelColor(this.currentQIndex))
            .margin({ right: 4 })
          Text(this.getCurrentQuestion().bloomLevel)
            .fontSize(11)
            .fontWeight(FontWeight.Bold)
            .fontColor(this.getLevelColor(this.currentQIndex))
        }
        .padding({ left: 8, right: 8, top: 2, bottom: 2 })
        .backgroundColor(0x0F000000)
        .borderRadius(10)
      }
      .width('100%')
      .margin({ top: 16 })

      Text(this.getCurrentQuestion().questionText)
        .fontSize(15)
        .fontColor(Constants.COLOR_TEXT)
        .lineHeight(22)
        .margin({ top: 16 })

      Column() {
        ForEach(this.getCurrentQuestion().options, (opt: QuestionOption) => {
          Row() {
            Stack() {
              Circle()
                .width(22)
                .height(22)
                .stroke(this.selectedOption === opt.label ? Constants.COLOR_PRIMARY : Constants.COLOR_DIVIDER)
                .strokeWidth(2)
                .fill(this.selectedOption === opt.label ? Constants.COLOR_PRIMARY : 'transparent')
              Text(opt.label)
                .fontSize(11)
                .fontColor(this.selectedOption === opt.label ? '#FFFFFF' : Constants.COLOR_TEXT_SECONDARY)
            }
            .width(22)
            .height(22)

            Text(opt.content)
              .fontSize(13)
              .fontColor(Constants.COLOR_TEXT)
              .margin({ left: 10 })
              .layoutWeight(1)
              .lineHeight(18)
          }
          .width('100%')
          .padding(12)
          .backgroundColor(this.selectedOption === opt.label ? 0x0F0078D7 : Constants.COLOR_CARD)
          .borderRadius(12)
          .margin({ top: 8 })
          .onClick(() => {
            this.selectedOption = opt.label;
          })
        }, (opt: QuestionOption) => opt.label)
      }
      .width('100%')
      .margin({ top: 16 })

      Button('提交答案')
        .width('100%')
        .height(44)
        .backgroundColor(Constants.COLOR_PRIMARY)
        .borderRadius(22)
        .margin({ top: 20 })
        .enabled(this.selectedOption.length > 0)
        .onClick(() => {
          if (!this.selectedOption) return;
          const q = this.questions[this.currentQIndex];
          const correct = q.options.find(o => o.isCorrect);
          this.answerCorrect = correct?.label === this.selectedOption;

          globalData.submitAnswer(
            this.courseId,
            q.id,
            this.selectedOption,
            this.answerCorrect
          );

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
        })
    }
    .width('100%')
    }
  }

  @Builder buildResult() {
    if (this.currentQIndex < this.questions.length) {
      Column() {
      Stack() {
        Circle()
          .width(56)
          .height(56)
          .fill(this.answerCorrect ? Constants.COLOR_ACCENT_GREEN : Constants.COLOR_ACCENT_RED)
        Text(this.answerCorrect ? '✓' : '✗')
          .fontSize(28)
          .fontColor('#FFFFFF')
          .fontWeight(FontWeight.Bold)
      }
      .width(56)
      .height(56)
      .margin({ top: 30 })

      Text(this.answerCorrect ? '回答正确！' : '回答错误')
        .fontSize(18)
        .fontWeight(FontWeight.Bold)
        .fontColor(this.answerCorrect ? Constants.COLOR_ACCENT_GREEN : Constants.COLOR_ACCENT_RED)
        .margin({ top: 12 })

      Text(`正确答案：${this.getCorrectOption()?.label}. ${this.getCorrectOption()?.content}`)
        .fontSize(13)
        .fontColor(Constants.COLOR_TEXT)
        .lineHeight(18)
        .margin({ top: 12 })

      Text(`解析：${this.getCurrentQuestion().explanation}`)
        .fontSize(12)
        .fontColor(Constants.COLOR_TEXT_SECONDARY)
        .lineHeight(18)
        .margin({ top: 8 })

      if (this.quizAISource) {
        Row() {
          Text('✨ AI智能解析')
            .fontSize(11)
            .fontWeight(FontWeight.Bold)
            .fontColor(Constants.COLOR_ACCENT_GREEN)
        }
        .width('100%')
        .padding({ top: 8, bottom: 4 })
        .margin({ top: 4 })
      }

      Button(this.currentQIndex < this.questions.length - 1 ? '下一题' : '查看报告')
        .width('100%')
        .height(44)
        .backgroundColor(Constants.COLOR_PRIMARY)
        .borderRadius(22)
        .margin({ top: 24 })
        .onClick(() => {
          this.showResult = false;
          this.selectedOption = '';
          this.currentQIndex++;
          if (this.currentQIndex >= this.questions.length && this.course && !this.course.q3Completed) {
            this.course.q3Completed = true;
            this.course.status = 'completed';
            globalData.updateCourseProgress(this.course.id, 100);
          }
        })
    }
    .width('100%')
    .padding(20)
    .backgroundColor(Constants.COLOR_CARD)
    .borderRadius(16)
    .shadow({ radius: 4, offsetY: 2, color: 0x12000000 })
    .margin({ top: 16 })
    }
  }

  @Builder buildComplete() {
    Column() {
      Stack() {
        Circle()
          .width(72)
          .height(72)
          .fill(Constants.COLOR_ACCENT_GREEN)
        Text('🏆')
          .fontSize(36)
      }
      .width(72)
      .height(72)
      .margin({ top: 40 })

      Text('测评完成！')
        .fontSize(22)
        .fontWeight(FontWeight.Bold)
        .fontColor(Constants.COLOR_TEXT)
        .margin({ top: 16 })

      Text(`共完成 ${this.answeredCount}/${this.questions.length} 题`)
        .fontSize(14)
        .fontColor(Constants.COLOR_TEXT_SECONDARY)
        .margin({ top: 8 })

      if (this.quizAISource) {
        Text('本次测评使用AI生成题目')
          .fontSize(12)
          .fontColor(Constants.COLOR_ACCENT_GREEN)
          .margin({ top: 4 })
      }

      Button('查看完整评价报告')
        .width('100%')
        .height(48)
        .backgroundColor(Constants.COLOR_PRIMARY)
        .borderRadius(24)
        .margin({ top: 30 })
        .onClick(() => {
          router.pushUrl({
            url: 'pages/Profile',
            params: { courseId: this.courseId }
          });
        })

      Text('三问学习法全部完成！\n你已经掌握了该课程的核心心智模型、\n理解了学术争议，并通过了深度测评。')
        .fontSize(13)
        .fontColor(Constants.COLOR_TEXT_SECONDARY)
        .textAlign(TextAlign.Center)
        .lineHeight(20)
        .margin({ top: 16 })
    }
    .width('100%')
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
    } else {
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

  @Builder buildReviewSection() {
    if (this.dueReviewCount > 0) {
      Column() {
        Row() {
          Text('🔄 间隔复习')
            .fontSize(16)
            .fontWeight(FontWeight.Bold)
            .fontColor(Constants.COLOR_TEXT)

          Blank()

          Stack() {
            Circle()
              .width(22)
              .height(22)
              .fill(Constants.COLOR_ACCENT_RED)
            Text(this.dueReviewCount.toString())
              .fontSize(11)
              .fontColor('#FFFFFF')
              .fontWeight(FontWeight.Bold)
          }
          .width(22)
          .height(22)
        }
        .width('100%')

        Text('有 ' + this.dueReviewCount + ' 道题目待复习，点击查看')
          .fontSize(12)
          .fontColor(Constants.COLOR_TEXT_SECONDARY)
          .width('100%')
          .margin({ top: 4 })
      }
      .width('100%')
      .padding(16)
      .backgroundColor(Constants.COLOR_CARD)
      .borderRadius(16)
      .margin({ top: 16 })
      .border({ width: 1, color: 0x22EF4444 })
      .onClick(() => {
        this.showReviewSection = !this.showReviewSection;
        this.reviewItems = globalData.getDueReviews();
        this.reviewIndex = 0;
      })

      if (this.showReviewSection && this.reviewItems.length > 0) {
        this.buildReviewDetail()
      }
    } else if (globalData.getReviewQueue().length > 0) {
      Column() {
        Row() {
          Text('✅ 间隔复习')
            .fontSize(16)
            .fontWeight(FontWeight.Bold)
            .fontColor(Constants.COLOR_ACCENT_GREEN)

          Blank()

          Text('全部完成')
            .fontSize(12)
            .fontColor(Constants.COLOR_ACCENT_GREEN)
        }
        .width('100%')

        Text('暂时没有待复习的题目')
          .fontSize(12)
          .fontColor(Constants.COLOR_TEXT_SECONDARY)
          .width('100%')
          .margin({ top: 4 })
      }
      .width('100%')
      .padding(16)
      .backgroundColor(Constants.COLOR_CARD)
      .borderRadius(16)
      .margin({ top: 16 })
    }
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

  @Builder buildReviewDetail() {
    Column() {
      if (this.reviewIndex < this.reviewItems.length) {
        Text('第 ' + (this.reviewIndex + 1) + '/' + this.reviewItems.length + ' 题')
          .fontSize(12)
          .fontColor(Constants.COLOR_TEXT_SECONDARY)
          .width('100%')
          .margin({ bottom: 8 })

        Text(this.reviewItems[this.reviewIndex].questionText)
          .fontSize(16)
          .fontWeight(FontWeight.Bold)
          .fontColor(Constants.COLOR_TEXT)
          .width('100%')

        Column() {
          ForEach(this.reviewItems[this.reviewIndex].options, (opt: string, optIdx: number) => {
            Row() {
              Stack() {
                Circle()
                  .width(28)
                  .height(28)
                  .fill(optIdx === this.reviewItems[this.reviewIndex].correctIndex ? Constants.COLOR_ACCENT_GREEN :
                    optIdx === this.reviewItems[this.reviewIndex].userAnswer && optIdx !== this.reviewItems[this.reviewIndex].correctIndex ? Constants.COLOR_ACCENT_RED :
                    0x0F000000)
                Text(['A', 'B', 'C', 'D', 'E', 'F'][optIdx])
                  .fontSize(12)
                  .fontColor(optIdx === this.reviewItems[this.reviewIndex].correctIndex || optIdx === this.reviewItems[this.reviewIndex].userAnswer ? '#FFFFFF' : Constants.COLOR_TEXT)
                  .fontWeight(FontWeight.Bold)
              }
              .width(28)
              .height(28)

              Text(opt)
                .fontSize(14)
                .fontColor(Constants.COLOR_TEXT)
                .margin({ left: 10 })
                .layoutWeight(1)

              if (optIdx === this.reviewItems[this.reviewIndex].correctIndex) {
                Text('✓')
                  .fontSize(16)
                  .fontColor(Constants.COLOR_ACCENT_GREEN)
              } else if (optIdx === this.reviewItems[this.reviewIndex].userAnswer && optIdx !== this.reviewItems[this.reviewIndex].correctIndex) {
                Text('✗')
                  .fontSize(16)
                  .fontColor(Constants.COLOR_ACCENT_RED)
              }
            }
            .width('100%')
            .padding({ top: 8, bottom: 8 })
            .backgroundColor(optIdx === this.reviewItems[this.reviewIndex].correctIndex ? 0x0A10B981 :
              optIdx === this.reviewItems[this.reviewIndex].userAnswer && optIdx !== this.reviewItems[this.reviewIndex].correctIndex ? 0x0AEF4444 : 'transparent')
            .borderRadius(8)
            .margin({ bottom: 4 })
          }, (opt: string) => opt)
        }
        .width('100%')
        .margin({ top: 12 })

        Text('复习次数: ' + this.reviewItems[this.reviewIndex].reviewCount + ' | 当前间隔: ' + this.reviewItems[this.reviewIndex].interval + '天')
          .fontSize(11)
          .fontColor(Constants.COLOR_TEXT_SECONDARY)
          .width('100%')
          .margin({ top: 12 })

        Row() {
          Button() {
            Text('✓ 复习完成').fontSize(14).fontColor('#FFFFFF')
          }
          .layoutWeight(1)
          .height(44)
          .backgroundColor(Constants.COLOR_ACCENT_GREEN)
          .borderRadius(22)
          .onClick(() => {
            this.completeReview(this.reviewItems[this.reviewIndex]);
          })
        }
        .width('100%')
        .margin({ top: 12 })
      }
    }
    .width('100%')
    .padding(16)
    .backgroundColor(Constants.COLOR_CARD)
    .borderRadius(12)
    .margin({ top: 8 })
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
