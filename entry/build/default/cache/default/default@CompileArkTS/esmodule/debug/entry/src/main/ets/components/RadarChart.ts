if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface RadarChart_Params {
    levelScores?: Map<BloomLevel, number>;
    renderFlag?: number;
    levels?: BloomLevel[];
}
import { BloomLevel } from "@normalized:N&&&entry/src/main/ets/model/QuestionModel&";
import { Constants } from "@normalized:N&&&entry/src/main/ets/utils/Constants&";
export class RadarChart extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.levelScores = new Map();
        this.__renderFlag = new ObservedPropertySimplePU(0, this, "renderFlag");
        this.levels = [
            BloomLevel.MEMORY,
            BloomLevel.UNDERSTAND,
            BloomLevel.APPLY,
            BloomLevel.ANALYZE,
            BloomLevel.EVALUATE,
            BloomLevel.CREATE
        ];
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: RadarChart_Params) {
        if (params.levelScores !== undefined) {
            this.levelScores = params.levelScores;
        }
        if (params.renderFlag !== undefined) {
            this.renderFlag = params.renderFlag;
        }
        if (params.levels !== undefined) {
            this.levels = params.levels;
        }
    }
    updateStateVars(params: RadarChart_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__renderFlag.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__renderFlag.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    public levelScores: Map<BloomLevel, number>;
    private __renderFlag: ObservedPropertySimplePU<number>;
    get renderFlag() {
        return this.__renderFlag.get();
    }
    set renderFlag(newValue: number) {
        this.__renderFlag.set(newValue);
    }
    private readonly levels: BloomLevel[];
    getScore(level: BloomLevel): number {
        return this.levelScores.get(level) ?? 0;
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.padding(12);
            Column.backgroundColor(Constants.COLOR_CARD);
            Column.borderRadius(16);
            Column.shadow({ radius: 4, offsetY: 1, color: 0x1A000000 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('能力维度雷达图');
            Text.fontSize(14);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(Constants.COLOR_TEXT);
            Text.width('100%');
            Text.margin({ bottom: 12 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Flex.create({ wrap: FlexWrap.Wrap, justifyContent: FlexAlign.Center });
            Flex.width('100%');
            Flex.padding(8);
        }, Flex);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = _item => {
                const level = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Column.create();
                    Column.margin(8);
                }, Column);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Progress.create({ value: this.getScore(level) * 100, total: 100, type: ProgressType.Ring });
                    Progress.width(56);
                    Progress.height(56);
                    Progress.style({ strokeWidth: 6 });
                    Progress.color(this.getLevelColor(level));
                    Progress.backgroundColor(Constants.COLOR_DIVIDER);
                }, Progress);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(level);
                    Text.fontSize(11);
                    Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
                    Text.margin({ top: 4 });
                }, Text);
                Text.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(`${Math.round(this.getScore(level) * 100)}%`);
                    Text.fontSize(13);
                    Text.fontWeight(FontWeight.Bold);
                    Text.fontColor(Constants.COLOR_TEXT);
                }, Text);
                Text.pop();
                Column.pop();
            };
            this.forEachUpdateFunction(elmtId, this.levels, forEachItemGenFunction, (level: BloomLevel) => level, false, false);
        }, ForEach);
        ForEach.pop();
        Flex.pop();
        Column.pop();
    }
    getLevelColor(level: BloomLevel): ResourceColor {
        const score = this.getScore(level);
        if (score >= 0.8)
            return Constants.COLOR_ACCENT_GREEN;
        if (score >= 0.5)
            return Constants.COLOR_ACCENT_ORANGE;
        return Constants.COLOR_ACCENT_RED;
    }
    rerender() {
        this.updateDirtyElements();
    }
}
