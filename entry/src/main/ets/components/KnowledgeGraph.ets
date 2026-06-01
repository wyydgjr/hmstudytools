import { KnowledgeNode } from '../model/CourseModel';
import { Constants } from '../utils/Constants';

@Component
export struct KnowledgeGraph {
  @Prop nodes: KnowledgeNode[] = [];
  @State renderFlag: number = 0;

  aboutToAppear(): void {
    this.layoutNodes();
  }

  layoutNodes(): void {
    if (this.nodes.length === 0) return;
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

  build() {
    Column() {
      Text('动态知识图谱')
        .fontSize(14)
        .fontWeight(FontWeight.Bold)
        .fontColor(Constants.COLOR_TEXT)
        .width('100%')
        .margin({ bottom: 8 })

      if (this.nodes.length > 0) {
        Stack() {
          ForEach(this.getAllEdges(), (edge: EdgeData) => {
            Path()
              .commands(`M ${edge.x1} ${edge.y1} L ${edge.x2} ${edge.y2}`)
              .stroke(Constants.COLOR_PRIMARY_LIGHT)
              .strokeWidth(1.5)
              .fill(Color.Transparent)
          }, (edge: EdgeData) => `${edge.x1}-${edge.y1}-${edge.x2}-${edge.y2}`)

          ForEach(this.getAllNodes(), (node: KnowledgeNode) => {
            Column() {
              Stack() {
                Circle()
                  .width(node.level === 0 ? 36 : (node.level === 1 ? 28 : 20))
                  .height(node.level === 0 ? 36 : (node.level === 1 ? 28 : 20))
                  .fill(node.level === 0 ? Constants.COLOR_PRIMARY :
                        (node.level === 1 ? Constants.COLOR_PRIMARY_LIGHT : Constants.COLOR_ACCENT_GREEN))
                  .shadow({ radius: 4, color: 0x33000000 })
              }
              .width(node.level === 0 ? 36 : (node.level === 1 ? 28 : 20))
              .height(node.level === 0 ? 36 : (node.level === 1 ? 28 : 20))

              Text(node.name)
                .fontSize(node.level === 0 ? 11 : (node.level === 1 ? 10 : 9))
                .fontColor(Constants.COLOR_TEXT)
                .textAlign(TextAlign.Center)
                .maxLines(2)
                .textOverflow({ overflow: TextOverflow.Ellipsis })
                .width(80)
                .margin({ top: 4 })
            }
            .position({ x: node.x - (node.level === 0 ? 18 : (node.level === 1 ? 14 : 10)), y: node.y - (node.level === 0 ? 18 : (node.level === 1 ? 14 : 10)) })
            .onClick(() => {
              AlertDialog.show({
                title: node.name,
                message: node.description,
                confirm: { value: '知道了', action: () => {} }
              });
            })
          }, (node: KnowledgeNode) => node.id)
        }
        .width('100%')
        .height(280)
        .clip(true)
        .margin({ top: 8 })
      } else {
        Column() {
          Text('完成第一问后生成知识图谱')
            .fontSize(14)
            .fontColor(Constants.COLOR_TEXT_SECONDARY)
        }
        .width('100%')
        .height(200)
        .justifyContent(FlexAlign.Center)
      }
    }
    .width('100%')
    .padding(12)
    .backgroundColor(Constants.COLOR_CARD)
    .borderRadius(16)
    .shadow({ radius: 4, offsetY: 1, color: 0x1A000000 })
  }

  getAllNodes(): KnowledgeNode[] {
    const result: KnowledgeNode[] = [];
    const traverse = (nodes: KnowledgeNode[]) => {
      nodes.forEach(n => {
        result.push(n);
        if (n.children) traverse(n.children);
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
}

interface EdgeData {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}
