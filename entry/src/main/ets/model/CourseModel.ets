export class KnowledgeNode {
  id: string = '';
  name: string = '';
  description: string = '';
  level: number = 0;
  children: KnowledgeNode[] = [];
  x: number = 0;
  y: number = 0;
}

export class Disagreement {
  id: string = '';
  topic: string = '';
  viewA: string = '';
  viewB: string = '';
  evidenceA: string = '';
  evidenceB: string = '';
  conclusion: string = '';
}

interface SubtopicItem {
  name: string;
  desc: string;
}

export class AchievementInfo {
  id: string = '';
  name: string = '';
  description: string = '';
  icon: string = '';
  unlocked: boolean = false;
  unlockedAt: number = 0;
}

export class Course {
  id: string = '';
  title: string = '';
  description: string = '';
  createdAt: number = 0;
  status: 'active' | 'completed' = 'active';
  progress: number = 0;
  q1Completed: boolean = false;
  q2Completed: boolean = false;
  q3Completed: boolean = false;
  q3Accuracy: number = 0;
  lastAccessedAt: number = 0;
  knowledgeGraph: KnowledgeNode[] = [];
  disagreements: Disagreement[] = [];
  studyTime: number = 0;

  static generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  static createFromTopic(topic: string): Course {
    const course = new Course();
    course.id = Course.generateId();
    course.title = topic;
    course.description = `基于「${topic}」的个性化学习课程`;
    course.createdAt = Date.now();
    course.status = 'active';
    course.knowledgeGraph = Course.generateKnowledgeGraph(topic);
    course.disagreements = Course.generateDisagreements(topic);
    return course;
  }

  static generateKnowledgeGraph(topic: string): KnowledgeNode[] {
    const root = new KnowledgeNode();
    root.id = 'root';
    root.name = topic;
    root.description = `${topic} 核心知识体系`;
    root.level = 0;

    const subtopics: SubtopicItem[] = [
      { name: '基础概念', desc: `${topic}的基础理论` } as SubtopicItem,
      { name: '核心原理', desc: `${topic}的核心机制` } as SubtopicItem,
      { name: '实践应用', desc: `${topic}的实践方法` } as SubtopicItem,
      { name: '高级进阶', desc: `${topic}的进阶知识` } as SubtopicItem,
      { name: '前沿发展', desc: `${topic}的最新趋势` } as SubtopicItem,
    ];

    root.children = subtopics.map((st, i) => {
      const node = new KnowledgeNode();
      node.id = `sub_${i}`;
      node.name = st.name;
      node.description = st.desc;
      node.level = 1;
      node.children = [
        { id: `leaf_${i}_0`, name: `${st.name}·要点一`, description: `${st.desc}的核心要点`, level: 2, children: [], x: 0, y: 0 } as KnowledgeNode,
        { id: `leaf_${i}_1`, name: `${st.name}·要点二`, description: `${st.desc}的关键方法`, level: 2, children: [], x: 0, y: 0 } as KnowledgeNode,
        { id: `leaf_${i}_2`, name: `${st.name}·要点三`, description: `${st.desc}的典型案例`, level: 2, children: [], x: 0, y: 0 } as KnowledgeNode,
      ];
      return node;
    });
    return [root, ...root.children];
  }

  static generateDisagreements(topic: string): Disagreement[] {
    const d1 = new Disagreement();
    d1.id = 'd1';
    d1.topic = `${topic}的最佳实践路径`;
    d1.viewA = '主张系统性学习：从基础到高级循序渐进，建立完整的知识体系框架后再进行实践。';
    d1.viewB = '主张项目驱动学习：通过实际项目边做边学，在实践中发现问题并针对性补充理论知识。';
    d1.evidenceA = '支持证据：系统性学习能构建更稳固的知识结构，避免知识盲区，长期学习效率更高。研究表明，先建立知识框架的学习者，在复杂问题解决上表现更好。';
    d1.evidenceB = '支持证据：项目驱动学习能更快产出可见成果，学习动机更强，知识留存率高达75%（vs 传统教学5%）。真实案例：大量自学成才的开发者采用此路径。';
    d1.conclusion = '综合来看，两种方法各有优势。建议采用"混合式学习"：先快速建立整体认知框架（20%时间），然后通过项目实践深入（80%时间），在实践中不断回补理论。';

    const d2 = new Disagreement();
    d2.id = 'd2';
    d2.topic = `${topic}的核心争议：理论与实践比重`;
    d2.viewA = '理论先行派：扎实的理论基础是长远发展的关键，实践中遇到的问题需要理论指导。';
    d2.viewB = '实践优先派：理论只有在实践中才能真正理解和内化，过早陷入理论会降低学习效率。';
    d2.evidenceA = '支持证据：MIT等顶尖学府的教学研究显示，理论先行的学生在创新性和问题迁移能力上表现更优。理论框架有助于举一反三。';
    d2.evidenceB = '支持证据：Y Combinator的创业教育数据显示，实践导向的学习者平均节省40%的学习时间，且项目完成率高出35%。';
    d2.conclusion = '最佳方案是"理论-实践-理论"的螺旋式上升：先学核心原理的20%，然后实践，遇到瓶颈再深入学习理论。';

    return [d1, d2];
  }
}
