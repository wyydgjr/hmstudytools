import { router } from '@kit.ArkUI';
import { Course, AchievementInfo } from '../model/CourseModel';
import { globalData } from '../model/LearningData';
import { StorageUtil } from '../utils/StorageUtil';
import { Constants } from '../utils/Constants';
import { CourseCard } from '../components/CourseCard';

@Entry
@Component
struct Index {
  @State searchText: string = '';
  @State courses: Course[] = [];
  @State greetAnim: boolean = false;
  @State showAchievements: boolean = false;
  @State animateCards: boolean = false;
  @State suggestions: string[] = [];
  @State showSuggestions: boolean = false;
  @State achievementInfos: AchievementInfo[] = [];
  @State newAchievements: string[] = [];
  @State showCelebration: boolean = false;
  @State celebrationMsg: string = '';
  @State currentInspiration: string = '';
  @State todayFocusMinutes: number = 0;

  private inspirations: string[] = [
    '学习不是填满水桶，而是点燃火焰。',
    '知之者不如好之者，好之者不如乐之者。',
    '学而不思则罔，思而不学则殆。',
    '千里之行，始于足下。',
    '温故而知新，可以为师矣。',
    '努力不一定成功，但放弃一定失败。',
    '每一次专注都是对未来的投资。',
    '知识就是力量。',
    '学习是一辈子的事。',
    '不怕慢，就怕站。',
    '种一棵树最好的时间是十年前，其次是现在。',
    '不积跬步，无以至千里。'
  ];

  aboutToAppear(): void {
    StorageUtil.loadData();
    this.courses = globalData.getCourses();
    globalData.recordStudyActivity();
    this.todayFocusMinutes = globalData.getTodayFocusMinutes();
    this.currentInspiration = this.inspirations[Math.floor(Math.random() * this.inspirations.length)];
    const newlyEarned = globalData.checkAllAchievements();
    if (newlyEarned.length > 0) {
      this.newAchievements = newlyEarned;
      const names = newlyEarned.map(id => {
        const infos = globalData.getAllAchievementInfos();
        const info = infos.find(i => i.id === id);
        return info ? info.name : id;
      });
      this.celebrationMsg = '🎉 获得成就: ' + names.join(', ');
      this.showCelebration = true;
      setTimeout(() => {
        this.showCelebration = false;
      }, 4000);
    }
    this.achievementInfos = globalData.getAllAchievementInfos();
    setTimeout(() => {
      this.greetAnim = true;
    }, 100);
    setTimeout(() => {
      this.animateCards = true;
    }, 300);
    StorageUtil.saveData();
  }

  build() {
    Column() {
      this.buildHeader()

      this.buildDailyInspiration()

      if (this.courses.length > 0) {
        this.buildStatsStrip()
      }

      Scroll() {
        Column() {
          if (this.courses.length === 0) {
            this.buildEmptyState()
          } else {
            this.buildCourseList()
          }
        }
        .width('100%')
        .padding({ left: 20, right: 20 })
      }
      .layoutWeight(1)
      .margin({ top: 8 })

      if (this.showCelebration && this.celebrationMsg.length > 0) {
        Text(this.celebrationMsg)
          .fontSize(14)
          .fontColor('#FFFFFF')
          .fontWeight(FontWeight.Bold)
          .backgroundColor(0xCC0078D7)
          .padding({ left: 20, right: 20, top: 12, bottom: 12 })
          .borderRadius(24)
          .margin({ bottom: 16 })
          .shadow({ radius: 8, offsetY: 4, color: 0x330078D7 })
          .transition(TransitionEffect.opacity(0).combine(TransitionEffect.translate({ x: 0, y: 20 })))
      }
    }
    .width('100%')
    .height('100%')
    .backgroundColor(Constants.COLOR_BACKGROUND)
  }

  @Builder buildHeader() {
    Column() {
      Row() {
        Column() {
          Row() {
            Text(this.getGreeting())
              .fontSize(18)
              .fontWeight(FontWeight.Bold)
              .fontColor('#FFFFFF')
              .opacity(this.greetAnim ? 1 : 0)
            if (this.greetAnim) {
              Text(' 🌟')
                .fontSize(16)
            }
          }

          Text('三问高效学习法 · 今日学习')
            .fontSize(12)
            .fontColor('rgba(255,255,255,0.7)')
            .margin({ top: 2 })
        }

        Blank()

        Stack() {
          Circle()
            .width(36)
            .height(36)
            .fill(0x33FFFFFF)
          Text('AI')
            .fontSize(12)
            .fontColor('#FFFFFF')
            .fontWeight(FontWeight.Bold)
        }
        .width(36)
        .height(36)
        .onClick(() => {
          router.pushUrl({ url: 'pages/AISettings' });
        })
      }
      .width('100%')
      .padding({ top: 16, bottom: 4 })

      Row() {
        Stack() {
          TextInput({ placeholder: Constants.SEARCH_PLACEHOLDER, text: this.searchText })
            .layoutWeight(1)
            .height(48)
            .backgroundColor(0x33FFFFFF)
            .placeholderColor('rgba(255,255,255,0.6)')
            .fontColor('#FFFFFF')
            .borderRadius(24)
            .padding({ left: 16 })
            .onChange((val: string) => {
              this.searchText = val;
              this.updateSuggestions(val);
            })
            .onSubmit(() => {
              this.showSuggestions = false;
              this.createCourse();
            })

          if (this.showSuggestions && this.suggestions.length > 0) {
            Column() {
              ForEach(this.suggestions, (s: string) => {
                Text(s)
                  .fontSize(14)
                  .fontColor('#FFFFFF')
                  .padding({ left: 16, top: 10, bottom: 10, right: 16 })
                  .width('100%')
                  .onClick(() => {
                    this.searchText = s;
                    this.showSuggestions = false;
                    const existing = this.courses.find(c => c.title === s);
                    if (existing) {
                      existing.lastAccessedAt = Date.now();
                      StorageUtil.saveData();
                      router.pushUrl({
                        url: 'pages/LearningSpace',
                        params: { courseId: existing.id, courseTitle: existing.title }
                      });
                    }
                  })
              }, (s: string) => s)
            }
            .width('100%')
            .backgroundColor(0xE6005A9E)
            .borderRadius(12)
            .margin({ top: 4 })
            .position({ x: 0, y: 52 })
            .zIndex(10)
          }
        }
        .layoutWeight(1)

        Stack() {
          Circle()
            .width(48)
            .height(48)
            .fill(0x33FFFFFF)
          Column() {
            Text('创建')
              .fontSize(12)
              .fontColor('#FFFFFF')
              .fontWeight(FontWeight.Bold)
          }
        }
        .width(48)
        .height(48)
        .margin({ left: 8 })
        .onClick(() => {
          this.showSuggestions = false;
          this.createCourse();
        })
      }
      .width('100%')
      .margin({ top: 8 })
    }
    .width('100%')
    .padding({ left: 20, right: 20, bottom: 16 })
    .linearGradient({
      direction: GradientDirection.Bottom,
      colors: [[Constants.COLOR_GRADIENT_START, 0], [Constants.COLOR_GRADIENT_MID, 0.5], [Constants.COLOR_GRADIENT_END, 1]]
    })
    .borderRadius({ bottomLeft: 24, bottomRight: 24 })
    .shadow({ radius: 8, offsetY: 4, color: 0x1A0078D7 })
  }

  @Builder buildDailyInspiration() {
    if (this.currentInspiration.length > 0) {
      Row() {
        Text('💡')
          .fontSize(18)
          .margin({ right: 10 })

        Column() {
          Text(this.currentInspiration)
            .fontSize(13)
            .fontColor(Constants.COLOR_TEXT)
            .lineHeight(20)
            .fontWeight(FontWeight.Medium)

          Text(this.courses.length > 0 ? '💪 已坚持 ' + globalData.getStreak() + ' 天不间断学习' : '🌟 开始你的第一个课程吧')
            .fontSize(11)
            .fontColor(Constants.COLOR_TEXT_SECONDARY)
            .margin({ top: 4 })
        }
        .layoutWeight(1)
        .alignItems(HorizontalAlign.Start)
      }
      .width('100%')
      .padding({ left: 20, right: 20, top: 12, bottom: 12 })
      .backgroundColor(Constants.COLOR_CARD)
      .margin({ top: 8 })
    }
  }

  @Builder buildStatsStrip() {
    Row() {
      this.buildStatItem('📚', '课程总数', `${this.courses.length}`)
      this.buildStatItem('✅', '已完成', `${globalData.getCompletedCourses()}`)
      this.buildStatItem('🔥', '连续学习', `${globalData.getStreak()}天`)
    }
    .width('100%')
    .padding(14)
    .backgroundColor(Constants.COLOR_CARD)
    .borderRadius(16)
    .margin({ top: 12, left: 20, right: 20 })
    .shadow({ radius: 4, offsetY: 2, color: 0x0C000000 })

    Row() {
      this.buildQuickAction('🍅 专注', Constants.COLOR_ACCENT_RED, () => {
        router.pushUrl({ url: 'pages/StudyTimer' });
      })
      this.buildQuickAction('▶ 继续学习', Constants.COLOR_PRIMARY, () => {
        const last = globalData.getLastActiveCourse();
        if (last) {
          last.lastAccessedAt = Date.now();
          StorageUtil.saveData();
          router.pushUrl({
            url: 'pages/LearningSpace',
            params: { courseId: last.id, courseTitle: last.title }
          });
        } else if (this.courses.length > 0) {
          const c = this.courses[0];
          c.lastAccessedAt = Date.now();
          StorageUtil.saveData();
          router.pushUrl({
            url: 'pages/LearningSpace',
            params: { courseId: c.id, courseTitle: c.title }
          });
        }
      })
      this.buildQuickAction('📖 新课程', Constants.COLOR_ACCENT_GREEN, () => {
        this.searchText = '';
      })
    }
    .width('100%')
    .justifyContent(FlexAlign.SpaceBetween)
    .margin({ top: 10, left: 20, right: 20 })

    Row() {
      this.buildQuickAction('🏆 成就', Constants.COLOR_ACCENT_ORANGE, () => {
        this.showAchievements = !this.showAchievements;
        this.achievementInfos = globalData.getAllAchievementInfos();
      })
      this.buildQuickAction('⏱ 今日专注 ' + this.todayFocusMinutes + '分钟', Constants.COLOR_ACCENT_GREEN, () => {
        router.pushUrl({ url: 'pages/StudyTimer' });
      })
    }
    .width('100%')
    .justifyContent(FlexAlign.SpaceBetween)
    .margin({ top: 6, left: 20, right: 20 })

    if (this.showAchievements) {
      this.buildAchievementsPanel()
    }
  }

  @Builder buildStatItem(icon: string, label: string, value: string) {
    Column() {
      Row() {
        Text(icon)
          .fontSize(14)
        Text(value)
          .fontSize(18)
          .fontWeight(FontWeight.Bold)
          .fontColor(Constants.COLOR_TEXT)
          .margin({ left: 4 })
      }
      Text(label)
        .fontSize(11)
        .fontColor(Constants.COLOR_TEXT_SECONDARY)
        .margin({ top: 2 })
    }
    .layoutWeight(1)
    .alignItems(HorizontalAlign.Center)
  }

  @Builder buildQuickAction(text: string, color: ResourceColor, action: () => void) {
    Text(text)
      .fontSize(12)
      .fontWeight(FontWeight.Medium)
      .fontColor(color)
      .backgroundColor(0x0F000000)
      .padding({ left: 12, right: 12, top: 8, bottom: 8 })
      .borderRadius(16)
      .border({ width: 1, color: color })
      .onClick(() => { action(); })
  }

  @Builder buildAchievementsPanel() {
    Column() {
      Text('🏅 学习成就')
        .fontSize(16)
        .fontWeight(FontWeight.Bold)
        .fontColor(Constants.COLOR_TEXT)
        .width('100%')

      Scroll() {
        Row() {
          ForEach(this.achievementInfos, (info: AchievementInfo) => {
            Column() {
              Text(info.icon)
                .fontSize(28)
                .opacity(info.unlocked ? 1 : 0.3)
              Text(info.name)
                .fontSize(11)
                .fontWeight(FontWeight.Bold)
                .fontColor(info.unlocked ? Constants.COLOR_TEXT : Constants.COLOR_TEXT_SECONDARY)
                .margin({ top: 4 })
              Text(info.description)
                .fontSize(9)
                .fontColor(Constants.COLOR_TEXT_SECONDARY)
                .textAlign(TextAlign.Center)
                .maxLines(1)
                .textOverflow({ overflow: TextOverflow.Ellipsis })
              if (info.unlocked) {
                Text('✓ 已获得')
                  .fontSize(9)
                  .fontColor(Constants.COLOR_ACCENT_GREEN)
                  .margin({ top: 2 })
              } else {
                Text('未解锁')
                  .fontSize(9)
                  .fontColor(Constants.COLOR_TEXT_SECONDARY)
                  .margin({ top: 2 })
              }
            }
            .padding(10)
            .backgroundColor(info.unlocked ? 0x0F10B981 : Constants.COLOR_CARD)
            .borderRadius(12)
            .margin({ right: 8 })
            .width(100)
            .alignItems(HorizontalAlign.Center)
            .border({ width: 1, color: info.unlocked ? 0x2210B981 : Constants.COLOR_DIVIDER })
          }, (info: AchievementInfo) => info.id)
        }
      }
      .width('100%')
      .scrollable(ScrollDirection.Horizontal)
      .margin({ top: 8 })
    }
    .width('100%')
    .padding(14)
    .backgroundColor(Constants.COLOR_CARD)
    .borderRadius(16)
    .margin({ top: 8 })
    .shadow({ radius: 4, offsetY: 2, color: 0x0C000000 })
  }

  @Builder buildEmptyState() {
    Column() {
      Stack() {
        Circle()
          .width(80)
          .height(80)
          .fill(0x0F0078D7)
        Text('?')
          .fontSize(36)
          .fontColor(Constants.COLOR_PRIMARY)
          .fontWeight(FontWeight.Bold)
      }
      .width(80)
      .height(80)
      .margin({ top: 60 })

      Text('开始你的学习之旅')
        .fontSize(20)
        .fontWeight(FontWeight.Bold)
        .fontColor(Constants.COLOR_TEXT)
        .margin({ top: 20 })

      Text('输入你想学习的任何课程或问题\nAI将为你生成专属三问学习课程')
        .fontSize(14)
        .fontColor(Constants.COLOR_TEXT_SECONDARY)
        .textAlign(TextAlign.Center)
        .margin({ top: 12 })
        .lineHeight(22)

      this.buildQuickStart()

      Text('三问学习法三步走')
        .fontSize(13)
        .fontWeight(FontWeight.Bold)
        .fontColor(Constants.COLOR_TEXT)
        .margin({ top: 32 })

      Row() {
        this.buildStepCard('Q1', '心智模型', '建立知识框架', Constants.COLOR_PRIMARY)
        this.buildStepCard('Q2', '学术分歧', '培养批判思维', Constants.COLOR_ACCENT_PURPLE)
        this.buildStepCard('Q3', '深度测评', '检验学习效果', Constants.COLOR_ACCENT_GREEN)
      }
      .width('100%')
      .margin({ top: 12 })
      .justifyContent(FlexAlign.SpaceBetween)
    }
    .width('100%')
  }

  @Builder buildQuickStart() {
    Column() {
      Text('快速开始示例')
        .fontSize(12)
        .fontColor(Constants.COLOR_TEXT_SECONDARY)
        .margin({ top: 20, bottom: 8 })

      Flex({ wrap: FlexWrap.Wrap, justifyContent: FlexAlign.Center }) {
        ForEach(['鸿蒙ArkTS开发', '机器学习入门', '经济学原理', 'Python编程', '量子计算', '设计模式'], (topic: string) => {
          Text(topic)
            .fontSize(12)
            .fontColor(Constants.COLOR_PRIMARY)
            .backgroundColor(0x0F0078D7)
            .padding({ left: 12, right: 12, top: 6, bottom: 6 })
            .borderRadius(16)
            .margin(4)
            .onClick(() => {
              this.searchText = topic;
              this.createCourse();
            })
        }, (topic: string) => topic)
      }
      .width('100%')
    }
  }

  @Builder buildStepCard(q: string, title: string, desc: string, color: ResourceColor) {
    Column() {
      Stack() {
        Circle()
          .width(36)
          .height(36)
          .fill(color)
        Text(q).fontSize(14).fontColor('#FFFFFF').fontWeight(FontWeight.Bold)
      }
      .width(36)
      .height(36)
      Text(title)
        .fontSize(12)
        .fontWeight(FontWeight.Bold)
        .fontColor(Constants.COLOR_TEXT)
        .margin({ top: 6 })
      Text(desc)
        .fontSize(10)
        .fontColor(Constants.COLOR_TEXT_SECONDARY)
    }
    .padding(12)
    .backgroundColor(Constants.COLOR_CARD)
    .borderRadius(12)
    .shadow({ radius: 4, offsetY: 1, color: 0x0A000000 })
  }

  @Builder buildCourseList() {
    Column() {
      Text('我的课程')
        .fontSize(18)
        .fontWeight(FontWeight.Bold)
        .fontColor(Constants.COLOR_TEXT)
        .width('100%')
        .margin({ top: 4, bottom: 8 })

      List() {
        ForEach(this.courses, (course: Course) => {
          ListItem() {
            CourseCard({
              course: course,
              onCardClick: () => {
                course.lastAccessedAt = Date.now();
                StorageUtil.saveData();
                router.pushUrl({
                  url: 'pages/LearningSpace',
                  params: { courseId: course.id, courseTitle: course.title }
                });
              }
            })
            .transition(
              TransitionEffect.translate({ x: 60, y: 0 })
                .combine(TransitionEffect.opacity(0))
            )
          }
          .margin({ bottom: 12 })
          .transition(
            TransitionEffect.translate({ x: 60, y: 0 })
              .combine(TransitionEffect.opacity(0))
          )
        }, (course: Course) => course.id)
      }
      .width('100%')
    }
  }

  updateSuggestions(val: string): void {
    if (val.trim().length === 0) {
      this.suggestions = [];
      this.showSuggestions = false;
      return;
    }
    this.suggestions = this.courses
      .map(c => c.title)
      .filter(t => t.toLowerCase().includes(val.toLowerCase()))
      .slice(0, 5);
    this.showSuggestions = this.suggestions.length > 0;
  }

  getGreeting(): string {
    const hour = new Date().getHours();
    let timeMsg = '';
    let emoji = '';
    if (hour < 6) { timeMsg = '夜深了'; emoji = '🌙'; }
    else if (hour < 9) { timeMsg = '早上好'; emoji = '🌅'; }
    else if (hour < 12) { timeMsg = '上午好'; emoji = '☀️'; }
    else if (hour < 14) { timeMsg = '中午好'; emoji = '🌞'; }
    else if (hour < 18) { timeMsg = '下午好'; emoji = '📚'; }
    else if (hour < 22) { timeMsg = '晚上好'; emoji = '🌆'; }
    else { timeMsg = '夜深了'; emoji = '🌙'; }
    return `${timeMsg}！今天也要加油哦 ${emoji}`;
  }

  createCourse(): void {
    const text = this.searchText.trim();
    if (!text) return;

    const existing = this.courses.find(c => c.title === text);
    if (existing) {
      existing.lastAccessedAt = Date.now();
      StorageUtil.saveData();
      router.pushUrl({
        url: 'pages/LearningSpace',
        params: { courseId: existing.id, courseTitle: existing.title }
      });
      return;
    }

    const course = Course.createFromTopic(text);
    globalData.addCourse(course);
    this.courses = globalData.getCourses();
    this.searchText = '';
    this.showSuggestions = false;

    const newlyEarned = globalData.checkAllAchievements();
    if (newlyEarned.length > 0) {
      this.newAchievements = newlyEarned;
      const names = newlyEarned.map(id => {
        const infos = globalData.getAllAchievementInfos();
        const info = infos.find(i => i.id === id);
        return info ? info.name : id;
      });
      this.celebrationMsg = '🎉 获得成就: ' + names.join(', ');
      this.showCelebration = true;
      setTimeout(() => {
        this.showCelebration = false;
      }, 4000);
    }
    this.achievementInfos = globalData.getAllAchievementInfos();
    StorageUtil.saveData();

    router.pushUrl({
      url: 'pages/LearningSpace',
      params: { courseId: course.id, courseTitle: course.title }
    });
  }
}
