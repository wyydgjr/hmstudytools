if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface KnowledgeGraph_Params {
    nodes?: KnowledgeNode[];
    renderFlag?: number;
}
import type { KnowledgeNode } from '../model/CourseModel';
import { Constants } from "@normalized:N&&&entry/src/main/ets/utils/Constants&";
export class KnowledgeGraph extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__nodes = new SynchedPropertyObjectOneWayPU(params.nodes, this, "nodes");
        this.__renderFlag = new ObservedPropertySimplePU(0, this, "renderFlag");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: KnowledgeGraph_Params) {
        if (params.nodes === undefined) {
            this.__nodes.set([]);
        }
        if (params.renderFlag !== undefined) {
            this.renderFlag = params.renderFlag;
        }
    }
    updateStateVars(params: KnowledgeGraph_Params) {
        this.__nodes.reset(params.nodes);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__nodes.purgeDependencyOnElmtId(rmElmtId);
        this.__renderFlag.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__nodes.aboutToBeDeleted();
        this.__renderFlag.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __nodes: SynchedPropertySimpleOneWayPU<KnowledgeNode[]>;
    get nodes() {
        return this.__nodes.get();
    }
    set nodes(newValue: KnowledgeNode[]) {
        this.__nodes.set(newValue);
    }
    private __renderFlag: ObservedPropertySimplePU<number>;
    get renderFlag() {
        return this.__renderFlag.get();
    }
    set renderFlag(newValue: number) {
        this.__renderFlag.set(newValue);
    }
    aboutToAppear(): void {
        this.layoutNodes();
    }
    layoutNodes(): void {
        if (this.nodes.length === 0)
            return;
        const centerX = 180;
        const centerY = 80;
        this.nodes[0].x = centerX;
        this.nodes[0].y = centerY;
        const radius = 100;
        const children = this.nodes[0].children || [];
        children.forEach((child, i) => {
            const angle = (i / children.length) * 2 * Math.PI - Math.PI / 2;
            child.x = centerX + radius * Math.cos(angle);
            child.y = centerY + radius * Math.sin(angle);
            const leaves = child.children || [];
            leaves.forEach((leaf, j) => {
                const leafAngle = angle + (j - (leaves.length - 1) / 2) * 0.4;
                leaf.x = child.x + 70 * Math.cos(leafAngle);
                leaf.y = child.y + 70 * Math.sin(leafAngle);
            });
        });
        this.renderFlag++;
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
            Text.create('动态知识图谱');
            Text.fontSize(14);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(Constants.COLOR_TEXT);
            Text.width('100%');
            Text.margin({ bottom: 8 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.nodes.length > 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Stack.create();
                        Stack.width('100%');
                        Stack.height(280);
                        Stack.clip(true);
                        Stack.margin({ top: 8 });
                    }, Stack);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        ForEach.create();
                        const forEachItemGenFunction = _item => {
                            const edge = _item;
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Path.create();
                                Path.commands(`M ${edge.x1} ${edge.y1} L ${edge.x2} ${edge.y2}`);
                                Path.stroke(Constants.COLOR_PRIMARY_LIGHT);
                                Path.strokeWidth(1.5);
                                Path.fill(Color.Transparent);
                            }, Path);
                        };
                        this.forEachUpdateFunction(elmtId, this.getAllEdges(), forEachItemGenFunction, (edge: EdgeData) => `${edge.x1}-${edge.y1}-${edge.x2}-${edge.y2}`, false, false);
                    }, ForEach);
                    ForEach.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        ForEach.create();
                        const forEachItemGenFunction = _item => {
                            const node = _item;
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Column.create();
                                Column.position({ x: node.x - (node.level === 0 ? 18 : (node.level === 1 ? 14 : 10)), y: node.y - (node.level === 0 ? 18 : (node.level === 1 ? 14 : 10)) });
                                Column.onClick(() => {
                                    AlertDialog.show({
                                        title: node.name,
                                        message: node.description,
                                        confirm: { value: '知道了', action: () => { } }
                                    });
                                });
                            }, Column);
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Stack.create();
                                Stack.width(node.level === 0 ? 36 : (node.level === 1 ? 28 : 20));
                                Stack.height(node.level === 0 ? 36 : (node.level === 1 ? 28 : 20));
                            }, Stack);
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Circle.create();
                                Circle.width(node.level === 0 ? 36 : (node.level === 1 ? 28 : 20));
                                Circle.height(node.level === 0 ? 36 : (node.level === 1 ? 28 : 20));
                                Circle.fill(node.level === 0 ? Constants.COLOR_PRIMARY :
                                    (node.level === 1 ? Constants.COLOR_PRIMARY_LIGHT : Constants.COLOR_ACCENT_GREEN));
                                Circle.shadow({ radius: 4, color: 0x33000000 });
                            }, Circle);
                            Stack.pop();
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create(node.name);
                                Text.fontSize(node.level === 0 ? 11 : (node.level === 1 ? 10 : 9));
                                Text.fontColor(Constants.COLOR_TEXT);
                                Text.textAlign(TextAlign.Center);
                                Text.maxLines(2);
                                Text.textOverflow({ overflow: TextOverflow.Ellipsis });
                                Text.width(80);
                                Text.margin({ top: 4 });
                            }, Text);
                            Text.pop();
                            Column.pop();
                        };
                        this.forEachUpdateFunction(elmtId, this.getAllNodes(), forEachItemGenFunction, (node: KnowledgeNode) => node.id, false, false);
                    }, ForEach);
                    ForEach.pop();
                    Stack.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                        Column.height(200);
                        Column.justifyContent(FlexAlign.Center);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('完成第一问后生成知识图谱');
                        Text.fontSize(14);
                        Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
                    }, Text);
                    Text.pop();
                    Column.pop();
                });
            }
        }, If);
        If.pop();
        Column.pop();
    }
    getAllNodes(): KnowledgeNode[] {
        const result: KnowledgeNode[] = [];
        const traverse = (nodes: KnowledgeNode[]) => {
            nodes.forEach(n => {
                result.push(n);
                if (n.children)
                    traverse(n.children);
            });
        };
        traverse(this.nodes);
        return result;
    }
    getAllEdges(): EdgeData[] {
        const edges: EdgeData[] = [];
        const traverse = (nodes: KnowledgeNode[]) => {
            nodes.forEach(n => {
                if (n.children) {
                    n.children.forEach(child => {
                        edges.push({ x1: n.x, y1: n.y, x2: child.x, y2: child.y });
                        traverse([child]);
                    });
                }
            });
        };
        traverse(this.nodes);
        return edges;
    }
    rerender() {
        this.updateDirtyElements();
    }
}
interface EdgeData {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
}
