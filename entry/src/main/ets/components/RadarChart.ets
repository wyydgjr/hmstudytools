import { BloomLevel } from '../model/QuestionModel';
import { Constants } from '../utils/Constants';

@Component
export struct RadarChart {
  public levelScores: Map<BloomLevel, number> = new Map();
  @State renderFlag: number = 0;

  private readonly levels: BloomLevel[] = [
    BloomLevel.MEMORY,
    BloomLevel.UNDERSTAND,
    BloomLevel.APPLY,
    BloomLevel.ANALYZE,
    BloomLevel.EVALUATE,
    BloomLevel.CREATE
  ];

  getScore(level: BloomLevel): number {
    return this.levelScores.get(level) ?? 0;
  }

  build() {
    Column() {
      Text('能力维度雷达图')
        .fontSize(14)
        .fontWeight(FontWeight.Bold)
        .fontColor(Constants.COLOR_TEXT)
        .width('100%')
        .margin({ bottom: 12 })

      Flex({ wrap: FlexWrap.Wrap, justifyContent: FlexAlign.Center }) {
        ForEach(this.levels, (level: BloomLevel) => {
          Column() {
            Progress({ value: this.getScore(level) * 100, total: 100, type: ProgressType.Ring })
              .width(56)
              .height(56)
              .style({ strokeWidth: 6 })
              .color(this.getLevelColor(level))
              .backgroundColor(Constants.COLOR_DIVIDER)

            Text(level)
              .fontSize(11)
              .fontColor(Constants.COLOR_TEXT_SECONDARY)
              .margin({ top: 4 })

            Text(`${Math.round(this.getScore(level) * 100)}%`)
              .fontSize(13)
              .fontWeight(FontWeight.Bold)
              .fontColor(Constants.COLOR_TEXT)
          }
          .margin(8)
        }, (level: BloomLevel) => level)
      }
      .width('100%')
      .padding(8)
    }
    .width('100%')
    .padding(12)
    .backgroundColor(Constants.COLOR_CARD)
    .borderRadius(16)
    .shadow({ radius: 4, offsetY: 1, color: 0x1A000000 })
  }

  getLevelColor(level: BloomLevel): ResourceColor {
    const score = this.getScore(level);
    if (score >= 0.8) return Constants.COLOR_ACCENT_GREEN;
    if (score >= 0.5) return Constants.COLOR_ACCENT_ORANGE;
    return Constants.COLOR_ACCENT_RED;
  }
}
