import { Course } from '../model/CourseModel';
import { Constants } from '../utils/Constants';

@Component
export struct CourseCard {
  @Prop course: Course = new Course();
  @State progressValue: number = 0;
  onCardClick: () => void = () => {};

  aboutToAppear(): void {
    this.progressValue = this.course.progress;
  }

  build() {
    Column() {
      Row() {
        Stack() {
          Circle()
            .width(48)
            .height(48)
            .fill(this.getIconBgColor())
          Text(this.course.title.charAt(0))
            .fontSize(20)
            .fontColor('#FFFFFF')
            .fontWeight(FontWeight.Bold)
        }
        .width(48)
        .height(48)

        Column() {
          Row() {
            Text(this.course.title)
              .fontSize(16)
              .fontWeight(FontWeight.Bold)
              .fontColor(Constants.COLOR_TEXT)
              .maxLines(1)
              .textOverflow({ overflow: TextOverflow.Ellipsis })
            Blank()
            this.buildStatusBadge()
          }
          .width('100%')

          Text(this.course.description)
            .fontSize(12)
            .fontColor(Constants.COLOR_TEXT_SECONDARY)
            .maxLines(1)
            .textOverflow({ overflow: TextOverflow.Ellipsis })
            .margin({ top: 2 })
        }
        .layoutWeight(1)
        .margin({ left: 12 })

        Text(`${this.progressValue}%`)
          .fontSize(14)
          .fontWeight(FontWeight.Bold)
          .fontColor(this.course.progress >= 100 ? Constants.COLOR_ACCENT_GREEN : Constants.COLOR_PRIMARY)
      }
      .width('100%')

      Progress({ value: this.progressValue, total: 100, type: ProgressType.Linear })
        .width('100%')
        .height(4)
        .value(this.progressValue)
        .color(this.course.progress >= 100 ? Constants.COLOR_ACCENT_GREEN : Constants.COLOR_PRIMARY)
        .backgroundColor(Constants.COLOR_DIVIDER)
        .borderRadius(2)
        .margin({ top: 10 })

      Row() {
        this.getStepDot('Q1', '心智模型', this.course.q1Completed)
        this.getStepDot('Q2', '学术分歧', this.course.q2Completed)
        this.getStepDot('Q3', '深度测评', this.course.q3Completed)
        Blank()
        Image($r('app.media.startIcon'))
          .width(16)
          .height(16)
          .opacity(0.4)
      }
      .width('100%')
      .margin({ top: 8 })
    }
    .width('100%')
    .padding(16)
    .backgroundColor(Constants.COLOR_CARD)
    .borderRadius(16)
    .shadow({
      radius: this.course.progress >= 100 ? 10 : 6,
      offsetX: 0,
      offsetY: this.course.progress >= 100 ? 3 : 2,
      color: this.course.progress >= 100 ? 0x2210B981 : 0x12000000
    })
    .onClick(() => {
      this.course.lastAccessedAt = Date.now();
      this.onCardClick();
    })
    .transition(
      TransitionEffect.translate({ x: 40, y: 0 })
        .combine(TransitionEffect.opacity(0))
    )
  }

  @Builder buildStatusBadge() {
    if (this.course.status === 'completed') {
      Text('已完成')
        .fontSize(10)
        .fontColor(Constants.COLOR_ACCENT_GREEN)
        .backgroundColor(0x1510B981)
        .padding({ left: 8, right: 8, top: 3, bottom: 3 })
        .borderRadius(10)
    } else if (this.course.progress > 0) {
      Text('学习中')
        .fontSize(10)
        .fontColor(Constants.COLOR_PRIMARY)
        .backgroundColor(0x150078D7)
        .padding({ left: 8, right: 8, top: 3, bottom: 3 })
        .borderRadius(10)
    } else {
      Text('待开始')
        .fontSize(10)
        .fontColor(Constants.COLOR_TEXT_SECONDARY)
        .backgroundColor(0x0F6B7280)
        .padding({ left: 8, right: 8, top: 3, bottom: 3 })
        .borderRadius(10)
    }
  }

  @Builder getStepDot(q: string, label: string, completed: boolean) {
    Row() {
      Circle()
        .width(18)
        .height(18)
        .fill(completed ? Constants.COLOR_ACCENT_GREEN : Constants.COLOR_DIVIDER)
      Text(q)
        .fontSize(9)
        .fontColor('#FFFFFF')
        .fontWeight(FontWeight.Bold)
    }
    .width(18)
    .height(18)
    .margin({ right: 4 })
    Text(label)
      .fontSize(11)
      .fontColor(completed ? Constants.COLOR_ACCENT_GREEN : Constants.COLOR_TEXT_SECONDARY)
      .margin({ right: 8 })
  }

  getIconBgColor(): ResourceColor {
    if (this.course.status === 'completed') return Constants.COLOR_ACCENT_GREEN;
    if (this.course.progress > 0) return Constants.COLOR_PRIMARY;
    return Constants.COLOR_PRIMARY_LIGHT;
  }

  getStatusColor(): ResourceColor {
    if (this.course.status === 'completed') return Constants.COLOR_ACCENT_GREEN;
    if (this.course.progress > 0) return Constants.COLOR_PRIMARY;
    return Constants.COLOR_PRIMARY_LIGHT;
  }
}
