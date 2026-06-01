import { router } from '@kit.ArkUI';
import { globalData } from '../model/LearningData';
import { Constants } from '../utils/Constants';
import { StorageUtil } from '../utils/StorageUtil';

@Entry
@Component
struct StudyTimer {
  @State focusMinutes: number = 25;
  @State breakMinutes: number = 5;
  @State secondsLeft: number = 25 * 60;
  @State isActive: boolean = false;
  @State isBreak: boolean = false;
  @State sessionCount: number = 0;
  @State todayFocus: number = 0;
  @State selectedMinutes: number = 25;
  @State showPreset: boolean = false;
  private timerId: number = -1;

  aboutToAppear(): void {
    this.todayFocus = globalData.getTodayFocusMinutes();
    this.resetTimer();
  }

  aboutToDisappear(): void {
    this.stopTimer();
  }

  build() {
    Column() {
      this.buildHeader()
      Scroll() {
        Column() {
          this.buildTimerCard()
          this.buildPresetSelector()
          this.buildSessionStats()
          this.buildTodaySummary()
        }
        .width('100%')
        .padding({ left: 20, right: 20 })
      }
      .layoutWeight(1)
      .margin({ top: 8 })
    }
    .width('100%')
    .height('100%')
    .backgroundColor(Constants.COLOR_BACKGROUND)
  }

  @Builder buildHeader() {
    Row() {
      Stack() {
        Circle().width(36).height(36).fill(0x0F000000)
        Text('←').fontSize(18).fontColor(Constants.COLOR_TEXT)
      }
      .width(36).height(36)
      .onClick(() => {
        router.back();
      })

      Blank()

      Text('番茄专注钟')
        .fontSize(18).fontWeight(FontWeight.Bold).fontColor(Constants.COLOR_TEXT)

      Blank()

      Stack() {
        Circle().width(36).height(36).fill(0x0F000000)
        Text('📊').fontSize(16)
      }
      .width(36).height(36)
      .onClick(() => {
        this.showPreset = !this.showPreset;
      })
    }
    .width('100%')
    .padding({ left: 16, right: 16, top: 12, bottom: 12 })
    .backgroundColor('#FFFFFF')
    .shadow({ radius: 2, offsetY: 1, color: 0x0A000000 })
  }

  @Builder buildTimerCard() {
    Column() {
      if (!this.isBreak) {
        Text('专注时间')
          .fontSize(14).fontColor(Constants.COLOR_PRIMARY)
          .fontWeight(FontWeight.Medium)
      } else {
        Text('休息时间')
          .fontSize(14).fontColor('#F59E0B')
          .fontWeight(FontWeight.Medium)
      }

      Text(this.formatTime(this.secondsLeft))
        .fontSize(64).fontWeight(FontWeight.Bold)
        .fontColor(this.isBreak ? '#F59E0B' : Constants.COLOR_TEXT)
        .margin({ top: 12 })
        .fontFamily('Courier New')

      if (this.isActive) {
        Text('学习中... 保持专注')
          .fontSize(12)
          .fontColor(Constants.COLOR_ACCENT_GREEN)
          .margin({ top: 4 })
      } else if (this.secondsLeft > 0) {
        Text('点击开始专注')
          .fontSize(12)
          .fontColor(Constants.COLOR_TEXT_SECONDARY)
          .margin({ top: 4 })
      }

      Row() {
        if (!this.isActive) {
          Button() {
            Text('▶ 开始').fontSize(16).fontColor('#FFFFFF')
          }
          .width(120).height(48)
          .backgroundColor(Constants.COLOR_ACCENT_GREEN)
          .borderRadius(24)
          .onClick(() => {
            this.startTimer();
          })
        } else {
          Button() {
            Text('⏸ 暂停').fontSize(16).fontColor('#FFFFFF')
          }
          .width(120).height(48)
          .backgroundColor(Constants.COLOR_ACCENT_ORANGE)
          .borderRadius(24)
          .onClick(() => {
            this.pauseTimer();
          })
        }

        Button() {
          Text('↺ 重置').fontSize(16).fontColor(Constants.COLOR_TEXT)
        }
        .width(100).height(48)
        .backgroundColor('#FFFFFF')
        .borderRadius(24)
        .margin({ left: 12 })
        .shadow({ radius: 2, offsetY: 1, color: 0x0A000000 })
        .onClick(() => {
          this.stopTimer();
          this.resetTimer();
        })
      }
      .width('100%')
      .justifyContent(FlexAlign.Center)
      .margin({ top: 20 })
    }
    .width('100%')
    .padding(24)
    .backgroundColor(Constants.COLOR_CARD)
    .borderRadius(20)
    .alignItems(HorizontalAlign.Center)
    .shadow({ radius: 8, offsetY: 4, color: 0x1A000000 })
    .margin({ top: 20 })
  }

  @Builder buildPresetSelector() {
    Column() {
      Text('专注时长')
        .fontSize(12).fontColor(Constants.COLOR_TEXT_SECONDARY)
        .width('100%').margin({ bottom: 8 })

      Row() {
        this.buildPresetButton(15)
        this.buildPresetButton(25)
        this.buildPresetButton(30)
        this.buildPresetButton(45)
        this.buildPresetButton(60)
      }
      .width('100%')
      .justifyContent(FlexAlign.SpaceBetween)
    }
    .width('100%')
    .margin({ top: 16 })
  }

  @Builder buildPresetButton(minutes: number) {
    Column() {
      Text(minutes.toString())
        .fontSize(18)
        .fontWeight(this.selectedMinutes === minutes ? FontWeight.Bold : FontWeight.Normal)
        .fontColor(this.selectedMinutes === minutes ? '#FFFFFF' : Constants.COLOR_TEXT)
      Text('分钟')
        .fontSize(10)
        .fontColor(this.selectedMinutes === minutes ? 'rgba(255,255,255,0.7)' : Constants.COLOR_TEXT_SECONDARY)
    }
    .padding({ top: 10, bottom: 10, left: 16, right: 16 })
    .backgroundColor(this.selectedMinutes === minutes ? Constants.COLOR_PRIMARY : Constants.COLOR_CARD)
    .borderRadius(12)
    .onClick(() => {
      if (!this.isActive) {
        this.selectedMinutes = minutes;
        this.focusMinutes = minutes;
        this.resetTimer();
      }
    })
  }

  @Builder buildSessionStats() {
    Row() {
      Column() {
        Text('已完成')
          .fontSize(12).fontColor(Constants.COLOR_TEXT_SECONDARY)
        Text(this.sessionCount.toString())
          .fontSize(28).fontWeight(FontWeight.Bold)
          .fontColor(Constants.COLOR_TEXT)
          .margin({ top: 4 })
        Text('个专注时段')
          .fontSize(11).fontColor(Constants.COLOR_TEXT_SECONDARY)
      }
      .layoutWeight(1)
      .alignItems(HorizontalAlign.Center)

      Column() {
        Text('本周专注')
          .fontSize(12).fontColor(Constants.COLOR_TEXT_SECONDARY)
        Text(this.getWeekFocusMinutes().toString())
          .fontSize(28).fontWeight(FontWeight.Bold)
          .fontColor(Constants.COLOR_PRIMARY)
          .margin({ top: 4 })
        Text('分钟')
          .fontSize(11).fontColor(Constants.COLOR_TEXT_SECONDARY)
      }
      .layoutWeight(1)
      .alignItems(HorizontalAlign.Center)
    }
    .width('100%')
    .padding(16)
    .backgroundColor(Constants.COLOR_CARD)
    .borderRadius(16)
    .margin({ top: 16 })
    .shadow({ radius: 4, offsetY: 2, color: 0x0C000000 })
  }

  @Builder buildTodaySummary() {
    Column() {
      Text('📋 今日学习概览')
        .fontSize(14).fontWeight(FontWeight.Bold)
        .fontColor(Constants.COLOR_TEXT)
        .width('100%')

      Row() {
        Text('今日专注')
          .fontSize(12).fontColor(Constants.COLOR_TEXT_SECONDARY)
        Blank()
        Text(this.todayFocus + ' 分钟')
          .fontSize(14).fontWeight(FontWeight.Bold)
          .fontColor(Constants.COLOR_PRIMARY)
      }
      .width('100%')
      .margin({ top: 8 })

      Row() {
        Text('连续学习')
          .fontSize(12).fontColor(Constants.COLOR_TEXT_SECONDARY)
        Blank()
        Text(globalData.getStreak() + ' 天')
          .fontSize(14).fontWeight(FontWeight.Bold)
          .fontColor(Constants.COLOR_ACCENT_ORANGE)
      }
      .width('100%')
      .margin({ top: 4 })

      Text('番茄工作法：专注25分钟 + 休息5分钟，每4个循环后长休息15-30分钟')
        .fontSize(11).fontColor(Constants.COLOR_TEXT_SECONDARY).margin({ top: 12 })
        .lineHeight(16)
    }
    .width('100%')
    .padding(16)
    .backgroundColor(Constants.COLOR_CARD)
    .borderRadius(16)
    .margin({ top: 12, bottom: 20 })
  }

  startTimer(): void {
    this.isActive = true;
    this.timerId = setInterval(() => {
      if (this.secondsLeft <= 1) {
        this.completeTimer();
      } else {
        this.secondsLeft--;
      }
    }, 1000);
  }

  pauseTimer(): void {
    this.isActive = false;
    if (this.timerId > 0) {
      clearInterval(this.timerId);
      this.timerId = -1;
    }
  }

  stopTimer(): void {
    this.isActive = false;
    if (this.timerId > 0) {
      clearInterval(this.timerId);
      this.timerId = -1;
    }
  }

  completeTimer(): void {
    this.stopTimer();
    if (!this.isBreak) {
      this.sessionCount++;
      const now = new Date();
      const dateStr = now.getFullYear() + '-' +
        String(now.getMonth() + 1).padStart(2, '0') + '-' +
        String(now.getDate()).padStart(2, '0');
      const lastCourse = globalData.getLastActiveCourse();
      globalData.addStudySession(dateStr, this.focusMinutes, lastCourse ? lastCourse.id : '');
      StorageUtil.saveData();
      this.todayFocus = globalData.getTodayFocusMinutes();

      AlertDialog.show({
        title: '🎉 专注完成！',
        message: '已完成 ' + this.focusMinutes + ' 分钟专注学习\n休息一下吧～',
        confirm: { value: '开始休息', action: () => {
          this.isBreak = true;
          this.secondsLeft = this.breakMinutes * 60;
          this.startTimer();
        }}
      });
    } else {
      AlertDialog.show({
        title: '☕ 休息结束',
        message: '休息好了吗？准备开始下一轮专注！',
        confirm: { value: '开始专注', action: () => {
          this.isBreak = false;
          this.resetTimer();
        }}
      });
    }
  }

  resetTimer(): void {
    this.isBreak = false;
    this.secondsLeft = this.selectedMinutes * 60;
  }

  formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
  }

  getWeekFocusMinutes(): number {
    const sessions = globalData.getStudySessions();
    const now = new Date();
    const weekAgo = now.getTime() - 7 * 24 * 60 * 60 * 1000;
    let total = 0;
    for (let i = 0; i < sessions.length; i++) {
      const parts = sessions[i].date.split('-');
      const sessionTime = new Date(
        parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2])
      ).getTime();
      if (sessionTime >= weekAgo) {
        total += sessions[i].minutes;
      }
    }
    return total;
  }
}
