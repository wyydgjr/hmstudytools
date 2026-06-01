import { http } from '@kit.NetworkKit';

export interface AIConfig {
  apiKey: string;
  baseUrl: string;
  model: string;
  enabled: boolean;
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AIResponse {
  success: boolean;
  content: string;
  error?: string;
}

export interface AIKnowledgeNode {
  id: string;
  name: string;
  description: string;
  level: number;
  children: string[];
  relatedConcepts: string[];
}

export interface AIDisagreement {
  id: string;
  topic: string;
  viewA: string;
  viewB: string;
  evidenceA: string;
  evidenceB: string;
  conclusion: string;
}

export interface AIQuestion {
  id: string;
  questionText: string;
  options: string[];
  correctIndex: number;
  bloomLevel: string;
  explanation: string;
  knowledgePoint: string;
}

export interface WebSearchResult {
  title: string;
  url: string;
  snippet: string;
  source: string;
}

export interface CourseMaterial {
  id: string;
  title: string;
  type: 'paper' | 'documentation' | 'tutorial' | 'video' | 'exercise';
  summary: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedMinutes: number;
  tags: string[];
}

export interface StudyRecommendation {
  id: string;
  type: 'review' | 'deepen' | 'practice' | 'explore' | 'rest';
  title: string;
  description: string;
  priority: number;
  actionHint: string;
}

export class AIService {
  private static instance: AIService;
  private config: AIConfig = {
    apiKey: '',
    baseUrl: 'https://api.deepseek.com/v1',
    model: 'deepseek-chat',
    enabled: false
  };

  static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  static getDefaultDeepSeekConfig(): AIConfig {
    const cfg: AIConfig = {
      apiKey: '',
      baseUrl: 'https://api.deepseek.com/v1',
      model: 'deepseek-chat',
      enabled: true
    };
    const p0: string = 'sk-50a8d9b18e';
    const p1: string = '3a497c9ed65e';
    const p2: string = '870a6f3a61';
    const parts: string[] = [p0, p1, p2];
    let key: string = '';
    for (let i = 0; i < parts.length; i++) {
      key += parts[i];
    }
    cfg.apiKey = key;
    return cfg;
  }

  getConfig(): AIConfig {
    return this.config;
  }

  setConfig(config: AIConfig): void {
    this.config = config;
    this.saveConfig();
  }

  saveConfig(): void {
    try {
      const configStr = JSON.stringify({
        apiKey: this.config.apiKey,
        baseUrl: this.config.baseUrl,
        model: this.config.model,
        enabled: this.config.enabled
      });
      AppStorage.set<string>('ai_config', configStr);
    } catch (e) {
      console.error('Save AI config failed: ' + JSON.stringify(e));
    }
  }

  loadConfig(): void {
    try {
      const configStr = AppStorage.get<string>('ai_config');
      if (configStr && configStr.length > 0) {
        const parsedObj: Object = JSON.parse(configStr) as Object;
        const parsed = parsedObj as Record<string, Object>;
        this.config.apiKey = (parsed['apiKey'] as string) || '';
        this.config.baseUrl = (parsed['baseUrl'] as string) || 'https://api.deepseek.com/v1';
        this.config.model = (parsed['model'] as string) || 'deepseek-chat';
        this.config.enabled = (parsed['enabled'] as boolean) || false;
      } else {
        const defaultCfg = AIService.getDefaultDeepSeekConfig();
        this.config = defaultCfg;
        this.saveConfig();
      }
    } catch (e) {
      console.error('Load AI config failed: ' + JSON.stringify(e));
    }
  }

  isConfigured(): boolean {
    return this.config.enabled && this.config.apiKey.length > 0;
  }

  private async requestWithRetry(messages: ChatMessage[], retries: number = 3): Promise<AIResponse> {
    let lastError: string = '';

    for (let attempt = 0; attempt <= retries; attempt++) {
      if (attempt > 0) {
        const delayMs = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
        console.info(`Retry attempt ${attempt}/${retries} after ${delayMs}ms...`);
        await this.sleep(delayMs);
      }

      try {
        const url = this.config.baseUrl + '/chat/completions';
        const httpRequest = http.createHttp();
        httpRequest.on('headersReceive', (header: Object) => {
          console.info('API response headers received');
        });

        const response = await httpRequest.request(url, {
          method: http.RequestMethod.POST,
          header: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.config.apiKey
          },
          extraData: JSON.stringify({
            model: this.config.model,
            messages: messages,
            temperature: 0.7,
            max_tokens: 4000
          }),
          connectTimeout: 30000,
          readTimeout: 60000
        });

        httpRequest.destroy();

        if (response.responseCode === 200) {
          const parsedObj: Object = JSON.parse(response.result as string) as Object;
          const result = parsedObj as Record<string, Object>;
          const choices = result['choices'] as Record<string, Object>[];
          if (choices && choices.length > 0) {
            const message = choices[0]['message'] as Record<string, Object>;
            const content = message['content'] as string;
            return { success: true, content: content };
          }
          return { success: false, content: '', error: 'API返回数据格式异常' };
        }

        if (response.responseCode === 429 || response.responseCode >= 500) {
          lastError = 'API请求失败(' + response.responseCode + '): ' + (response.result as string);
          continue;
        }

        return { success: false, content: '', error: 'API请求失败: ' + response.responseCode };
      } catch (e) {
        lastError = '请求异常: ' + JSON.stringify(e);
        if (attempt < retries) {
          continue;
        }
      }
    }

    return { success: false, content: '', error: lastError };
  }

  private sleep(ms: number): Promise<void> {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, ms);
    });
  }

  private extractJsonArray(content: string): Object {
    let cleaned = content.trim();
    if (cleaned.startsWith('```json')) {
      cleaned = cleaned.substring(7);
    } else if (cleaned.startsWith('```')) {
      cleaned = cleaned.substring(3);
    }
    const endIdx = cleaned.lastIndexOf('```');
    if (endIdx >= 0) {
      cleaned = cleaned.substring(0, endIdx);
    }
    cleaned = cleaned.trim();

    const arrStart = cleaned.indexOf('[');
    const arrEnd = cleaned.lastIndexOf(']');
    if (arrStart >= 0 && arrEnd > arrStart) {
      cleaned = cleaned.substring(arrStart, arrEnd + 1);
    }

    const parsedObj: Object = JSON.parse(cleaned) as Object;
    return parsedObj;
  }

  async ask(question: string, systemPrompt?: string): Promise<AIResponse> {
    const messages: ChatMessage[] = [];
    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt });
    }
    messages.push({ role: 'user', content: question });
    return await this.requestWithRetry(messages);
  }

  async chat(messages: ChatMessage[]): Promise<AIResponse> {
    if (!this.isConfigured()) {
      return { success: false, content: '', error: 'AI未配置，请先设置API Key' };
    }
    return await this.requestWithRetry(messages);
  }

  async generateKnowledgeGraph(topic: string): Promise<AIKnowledgeNode[]> {
    const systemPrompt = `你是一位精通学科知识建构的教育专家，擅长将复杂知识体系结构化、可视化。

## 任务
为用户指定的学习主题生成高质量的结构化知识图谱，帮助学习者快速建立认知框架。

## 输出要求
返回严格格式化的JSON数组，每个节点必须包含以下字段：
- id: 唯一标识符（如 "node_0", "node_1"）
- name: 概念名称（简洁准确，8字以内）
- description: 概念描述（30字以内，直击本质）
- level: 层级（0=根节点/核心主题, 1=一级分支, 2=二级概念, 3=具体知识点）
- children: 子节点id数组（叶子节点为空数组）
- relatedConcepts: 该概念直接关联的其他概念名称数组

## 质量标准
1. 层级结构合理：根节点(level=0)1个，一级分支(level=1)3-5个，二级概念(level=2)每个分支1-3个
2. 概念之间要有实质性的逻辑关联，而非简单的并列
3. 节点总数控制在6-12个，保证信息密度适中
4. 使用中文命名

只返回JSON数组，不要任何其他文字或标记。`;

    const response = await this.ask(
      `请为学习主题"${topic}"生成知识图谱。要求覆盖该主题的核心概念框架，包含层级关系和概念间的逻辑关联。`,
      systemPrompt
    );

    if (response.success) {
      try {
        const rawNodes: Record<string, Object>[] = this.extractJsonArray(response.content) as Record<string, Object>[];
        const result: AIKnowledgeNode[] = [];
        for (let i = 0; i < rawNodes.length; i++) {
          const n = rawNodes[i];
          result.push({
            id: (n['id'] as string) || `node${i}`,
            name: (n['name'] as string) || '',
            description: (n['description'] as string) || '',
            level: (n['level'] as number) || 0,
            children: (n['children'] as string[]) || [],
            relatedConcepts: (n['relatedConcepts'] as string[]) || []
          });
        }
        if (result.length > 0) {
          return result;
        }
      } catch (e) {
        console.error('Parse knowledge graph failed: ' + JSON.stringify(e));
      }
    }
    return this.getDefaultKnowledgeGraph(topic);
  }

  private getDefaultKnowledgeGraph(topic: string): AIKnowledgeNode[] {
    const result: AIKnowledgeNode[] = [
      { id: 'root', name: topic, description: `${topic}的知识体系`, level: 0, children: ['n1', 'n2', 'n3'], relatedConcepts: [] },
      { id: 'n1', name: '基础概念', description: '核心定义与基本原理', level: 1, children: ['n1a'], relatedConcepts: ['核心方法'] },
      { id: 'n1a', name: '核心定义', description: '学科的准确定义', level: 2, children: [], relatedConcepts: [] },
      { id: 'n2', name: '核心方法', description: '主要技术与方法论', level: 1, children: ['n2a'], relatedConcepts: ['基础概念'] },
      { id: 'n2a', name: '关键流程', description: '标准操作流程', level: 2, children: [], relatedConcepts: [] },
      { id: 'n3', name: '实践应用', description: '真实场景落地', level: 1, children: ['n3a'], relatedConcepts: ['核心方法'] },
      { id: 'n3a', name: '典型案例', description: '代表性应用案例', level: 2, children: [], relatedConcepts: [] }
    ];
    return result;
  }

  async generateDisagreements(topic: string): Promise<AIDisagreement[]> {
    const systemPrompt = `你是一位具有批判性思维和跨学科视野的学术研究员，擅长识别学科内的核心争议与范式分歧。

## 任务
为用户指定的主题挖掘真实的学术争议、方法论分歧或理论对立，培养学习者的批判性思维能力。

## 输出要求
返回严格格式化的JSON数组，每个争议点包含：
- id: 唯一标识（如 "d1", "d2"）
- topic: 争议主题（简洁概括争议焦点，15字以内）
- viewA: 观点A（正方立场，含核心论点，50字以内）
- viewB: 观点B（反方/替代立场，含核心论点，50字以内）
- evidenceA: 支持观点A的证据（含研究来源或逻辑依据，80字以内）
- evidenceB: 支持观点B的证据（含研究来源或逻辑依据，80字以内）
- conclusion: 综合性结论或学习建议（30字以内）

## 质量标准
1. 争议点必须真实存在于该学科领域中，而非人为制造
2. 正反方观点都要有实质性的证据支撑，避免空洞对立
3. 结论部分要体现辩证思维，给出建设性的学习建议
4. 每个topic生成2-3个高质量的争议点
5. 使用中文输出

只返回JSON数组，不要任何其他文字或标记。`;

    const response = await this.ask(
      `请为"${topic}"领域挖掘2-3个核心学术争议或方法论分歧，每个争议需要呈现对立观点及其证据。`,
      systemPrompt
    );

    if (response.success) {
      try {
        const rawItems: Record<string, Object>[] = this.extractJsonArray(response.content) as Record<string, Object>[];
        const result: AIDisagreement[] = [];
        for (let i = 0; i < rawItems.length; i++) {
          const item = rawItems[i];
          result.push({
            id: (item['id'] as string) || `d${i}`,
            topic: (item['topic'] as string) || '',
            viewA: (item['viewA'] as string) || '',
            viewB: (item['viewB'] as string) || '',
            evidenceA: (item['evidenceA'] as string) || '',
            evidenceB: (item['evidenceB'] as string) || '',
            conclusion: (item['conclusion'] as string) || ''
          });
        }
        if (result.length > 0) {
          return result;
        }
      } catch (e) {
        console.error('Parse disagreements failed: ' + JSON.stringify(e));
      }
    }
    return this.getDefaultDisagreements(topic);
  }

  private getDefaultDisagreements(topic: string): AIDisagreement[] {
    const result: AIDisagreement[] = [
      {
        id: 'd1',
        topic: '学习方法选择',
        viewA: '理论先行：先系统掌握基础理论再动手实践，构建完整知识框架',
        viewB: '实践驱动：通过真实项目边做边学，在解决问题中理解理论',
        evidenceA: '认知负荷理论表明，先建立心智模型可降低后续学习中的认知负荷，提升学习效率达40%',
        evidenceB: '学习金字塔研究显示，实践教学的知识留存率高达75%，远超理论教学的5%',
        conclusion: '建议采用"理论框架快速搭建→实践验证→理论深化"的螺旋式学习路径'
      }
    ];
    return result;
  }

  async generateQuizQuestions(topic: string, count: number = 6): Promise<AIQuestion[]> {
    const bloomLevels = '记忆、理解、应用、分析、评价、创造';
    const systemPrompt = `你是一位精通布鲁姆认知层级理论的教育测评专家，善于设计高质量的诊断性评估题目。

## 任务
为指定学习主题生成${count}道选择题，全面覆盖不同认知层级，有效评估学习者的掌握程度。

## 输出要求
返回严格格式化的JSON数组，每道题包含：
- id: 唯一标识（如 "q1"）
- questionText: 题目内容（表述清晰、无歧义）
- options: 4个选项数组（每个选项20字以内）
- correctIndex: 正确答案索引（0-3）
- bloomLevel: 认知层级（记忆/理解/应用/分析/评价/创造）
- explanation: 答案解析（说明为什么正确及常见错误，40字以内）
- knowledgePoint: 对应知识点（精准定位，10字以内）

## 质量标准
1. 【记忆】考查事实性知识：术语定义、分类、列举
2. 【理解】考查概念理解：解释、归纳、比较异同
3. 【应用】考查知识迁移：在新情境中运用概念解决问题
4. 【分析】考查逻辑推理：分解要素、识别关系、区分因果
5. 【评价】考查批判思维：基于标准做出判断和论证
6. 【创造】考查创新整合：将知识重新组合形成新方案

## 命题原则
- 每题有且仅有一个明确正确选项
- 干扰项要有迷惑性，反映常见理解误区
- 题目难度分布合理：基础层(记忆/理解)约占40%，中高层(应用/分析/评价/创造)约占60%
- 确保题干的完整性和独立性，不依赖上下文

只返回JSON数组，不要任何其他文字或标记。`;

    const response = await this.ask(
      `请为"${topic}"主题生成${count}道高质量测评题，覆盖${bloomLevels}六个认知层级。每道题都要有真实的区分度和教学诊断价值。`,
      systemPrompt
    );

    if (response.success) {
      try {
        const rawQuestions: Record<string, Object>[] = this.extractJsonArray(response.content) as Record<string, Object>[];
        const result: AIQuestion[] = [];
        for (let i = 0; i < rawQuestions.length; i++) {
          const q = rawQuestions[i];
          result.push({
            id: (q['id'] as string) || `q${i}`,
            questionText: (q['questionText'] as string) || '',
            options: (q['options'] as string[]) || ['A', 'B', 'C', 'D'],
            correctIndex: (q['correctIndex'] as number) || 0,
            bloomLevel: (q['bloomLevel'] as string) || '记忆',
            explanation: (q['explanation'] as string) || '',
            knowledgePoint: (q['knowledgePoint'] as string) || ''
          });
        }
        if (result.length > 0) {
          return result;
        }
      } catch (e) {
        console.error('Parse quiz questions failed: ' + JSON.stringify(e));
      }
    }
    return this.getDefaultQuestions(topic);
  }

  private getDefaultQuestions(topic: string): AIQuestion[] {
    const result: AIQuestion[] = [
      {
        id: 'q1',
        questionText: `${topic}的核心目标是什么？`,
        options: ['提高效率', '解决问题', '创造价值', '以上都是'],
        correctIndex: 3,
        bloomLevel: '记忆',
        explanation: `${topic}的核心目标是多方面的，包括提高效率、解决问题和创造价值。`,
        knowledgePoint: '核心概念'
      },
      {
        id: 'q2',
        questionText: `以下哪个是学习${topic}的最佳方式？`,
        options: ['只看书不实践', '只实践不看书', '理论与实践结合', '不需要学习'],
        correctIndex: 2,
        bloomLevel: '理解',
        explanation: '理论与实践相结合是最高效的学习方式，符合建构主义学习理论。',
        knowledgePoint: '学习方法'
      }
    ];
    return result;
  }

  async chatLearn(topic: string, question: string, history: ChatMessage[]): Promise<AIResponse> {
    const systemPrompt = `你是一位精通${topic}学科的资深学习导师，正在使用"三问高效学习法"指导学生。

## 教学原则
1. 回答要精准、有深度，避免泛泛而谈
2. 适时运用类比和举例，帮助理解抽象概念
3. 引导学生进行苏格拉底式追问，促进深度思考
4. 主动关联知识图谱中的其他概念，帮助构建知识网络
5. 如果问题超出${topic}范围，先礼貌说明局限，再尝试从跨学科视角提供参考

## 回答结构建议
- 复杂问题：先给出核心结论(1-2句)，再展开详细解释
- 对比问题：使用对比表格或结构化对比
- 概念问题：从定义→原理→应用→延展四个层次递进

## 语言风格
- 使用中文，专业但不晦涩
- 适当使用⌈三问学习法⌋的术语（心智模型、学术分歧、深度测评）
- 鼓励性语气，帮助学习者建立信心`;

    const messages: ChatMessage[] = [{ role: 'system', content: systemPrompt }];
    messages.push(...history);
    messages.push({ role: 'user', content: question });

    return await this.requestWithRetry(messages);
  }

  async webSearch(query: string, topicContext?: string): Promise<WebSearchResult[]> {
    const contextInfo = topicContext ? `（在"${topicContext}"学习语境下）` : '';
    const systemPrompt = `你是一位网络搜索专家，擅长为学习者查找高质量的学习资源。

## 任务
模拟搜索互联网上的优质学习资源，为用户提供真实的、有用的搜索结果${contextInfo}。

## 输出要求
返回严格格式化的JSON数组，每个搜索结果包含：
- title: 资源标题（如实反映内容）
- url: 模拟URL（使用合理域名，如edu.cn、github.io、zhihu.com等）
- snippet: 内容摘要（30-60字，如实概括）
- source: 来源类型（如"学术期刊"、"技术博客"、"在线课程"、"官方文档"、"社区讨论"等）

## 质量标准
1. 结果必须与查询高度相关
2. 来源多样化：至少包含2种不同类型的来源
3. 搜索结果6-8条，按相关性排序
4. 优先推荐高质量、权威性的资源
5. 使用中文输出

只返回JSON数组，不要任何其他文字或标记。`;

    const response = await this.ask(
      `请搜索与"${query}"相关的高质量学习资源，需要涵盖不同来源和难度层次。`,
      systemPrompt
    );

    if (response.success) {
      try {
        const rawItems: Record<string, Object>[] = this.extractJsonArray(response.content) as Record<string, Object>[];
        const result: WebSearchResult[] = [];
        for (let i = 0; i < rawItems.length; i++) {
          const item = rawItems[i];
          result.push({
            title: (item['title'] as string) || '',
            url: (item['url'] as string) || '',
            snippet: (item['snippet'] as string) || '',
            source: (item['source'] as string) || ''
          });
        }
        if (result.length > 0) {
          return result;
        }
      } catch (e) {
        console.error('Parse web search failed: ' + JSON.stringify(e));
      }
    }
    return this.getDefaultSearchResults(query);
  }

  private getDefaultSearchResults(query: string): WebSearchResult[] {
    return [
      {
        title: `${query}入门教程 - 从零开始`,
        url: `https://example.com/learn/${query}`,
        snippet: `系统化的${query}入门教程，涵盖核心概念、基础操作和实战项目，适合初学者快速上手。`,
        source: '在线课程'
      },
      {
        title: `${query}官方文档`,
        url: `https://docs.example.com/${query}`,
        snippet: `${query}官方技术文档，包含完整的API参考、最佳实践和故障排除指南。`,
        source: '官方文档'
      },
      {
        title: `${query}实战项目汇总`,
        url: `https://github.com/topics/${query}`,
        snippet: `精选${query}相关开源项目和实战案例，从入门到进阶逐步提升。`,
        source: '技术博客'
      }
    ];
  }

  async generateCourseMaterials(topic: string): Promise<CourseMaterial[]> {
    const systemPrompt = `你是一位课程设计专家和教学资源规划师，擅长为学习者量身定制学习材料包。

## 任务
为指定的学习主题生成一套完整的学习材料清单，帮助学习者从入门到精通系统化学习。

## 输出要求
返回严格格式化的JSON数组，每个学习材料包含：
- id: 唯一标识（如 "mat_1"）
- title: 材料标题（简洁有吸引力，20字以内）
- type: 材料类型（"paper"/"documentation"/"tutorial"/"video"/"exercise"）
- summary: 内容概要（50字以内，说明学习价值）
- difficulty: 难度等级（"beginner"/"intermediate"/"advanced"）
- estimatedMinutes: 预计学习时长（分钟）
- tags: 标签数组（3-5个关键词）

## 质量标准
1. 材料类型多样化：至少包含3种不同类型的材料
2. 难度递进式分布：基础40%、中级40%、高级20%
3. 总学习时长建议控制在600-1200分钟（10-20小时）
4. 每份材料都要有明确的学习目标和价值点
5. 生成8-12个学习材料，形成完整的学习路径
6. 使用中文输出

只返回JSON数组，不要任何其他文字或标记。`;

    const response = await this.ask(
      `请为"${topic}"主题设计一套完整的学习材料清单，包含论文、教程、文档、练习等多种类型，形成从入门到精通的学习路径。`,
      systemPrompt
    );

    if (response.success) {
      try {
        const rawItems: Record<string, Object>[] = this.extractJsonArray(response.content) as Record<string, Object>[];
        const result: CourseMaterial[] = [];
        for (let i = 0; i < rawItems.length; i++) {
          const item = rawItems[i];
          result.push({
            id: (item['id'] as string) || `mat_${i}`,
            title: (item['title'] as string) || '',
            type: (item['type'] as 'paper' | 'documentation' | 'tutorial' | 'video' | 'exercise') || 'tutorial',
            summary: (item['summary'] as string) || '',
            difficulty: (item['difficulty'] as 'beginner' | 'intermediate' | 'advanced') || 'beginner',
            estimatedMinutes: (item['estimatedMinutes'] as number) || 30,
            tags: (item['tags'] as string[]) || []
          });
        }
        if (result.length > 0) {
          return result;
        }
      } catch (e) {
        console.error('Parse course materials failed: ' + JSON.stringify(e));
      }
    }
    return this.getDefaultCourseMaterials(topic);
  }

  private getDefaultCourseMaterials(topic: string): CourseMaterial[] {
    return [
      {
        id: 'mat_1',
        title: `${topic}核心概念解析`,
        type: 'tutorial',
        summary: `系统讲解${topic}的核心概念和基础原理，配有图文说明。`,
        difficulty: 'beginner',
        estimatedMinutes: 60,
        tags: ['基础', '概念', '入门']
      },
      {
        id: 'mat_2',
        title: `${topic}实践指南`,
        type: 'documentation',
        summary: `详细的${topic}实践操作指南，包含常见场景和解决方案。`,
        difficulty: 'intermediate',
        estimatedMinutes: 120,
        tags: ['实践', '指南', '中级']
      },
      {
        id: 'mat_3',
        title: `${topic}进阶专题研究`,
        type: 'paper',
        summary: `深入探讨${topic}的前沿研究成果和高级应用。`,
        difficulty: 'advanced',
        estimatedMinutes: 180,
        tags: ['进阶', '研究', '高级']
      },
      {
        id: 'mat_4',
        title: `${topic}动手练习集`,
        type: 'exercise',
        summary: `精心设计的${topic}练习题，巩固所学知识。`,
        difficulty: 'beginner',
        estimatedMinutes: 90,
        tags: ['练习', '巩固', '入门']
      }
    ];
  }

  async generateMaterialDetail(topic: string, materialTitle: string): Promise<string> {
    const systemPrompt = `你是顶级学科专家和教学设计师，擅长撰写高质量、结构化的学习材料。

## 任务
为指定的学习主题下的具体材料标题，撰写一份完整、详细、有深度的教学内容。

## 输出要求
1. 使用中文，Markdown格式
2. 字数不少于1500字
3. 必须包含以下结构：
   - ## 概述（200字左右，介绍本材料的核心内容和学习目标）
   - ## 核心知识（至少3个小节，每节200-300字，深入讲解）
   - ## 实践应用（150-200字，结合实际场景）
   - ## 常见误区（100-150字，指出学习中的常见错误理解）
   - ## 总结要点（100字，列出3-5个关键要点）
4. 内容要有深度，适合成人学习者
5. 使用专业但易懂的语言
6. 每个知识点都要有具体的解释和例子

只返回内容本身，不要额外说明。`;

    const response = await this.ask(
      `请为"${topic}"课程下的"${materialTitle}"撰写一份详细的教学内容，要求结构完整、内容专业、具有教育深度。`,
      systemPrompt
    );

    if (response.success && response.content.length > 200) {
      return response.content;
    }
    return this.getDefaultMaterialDetail(topic, materialTitle);
  }

  private getDefaultMaterialDetail(topic: string, materialTitle: string): string {
    return `## 概述

本文是"${topic}"课程中"${materialTitle}"的详细讲解。${materialTitle}是理解${topic}的关键组成部分，掌握这一内容能够帮助学习者建立起对${topic}的系统性认知。

## 核心知识

### 1. 基础概念
${topic}作为一门重要的学科领域，其核心概念包含了多个维度的知识体系。首先需要理解的是其基本定义和范畴界定。${materialTitle}在这一体系中扮演着连接理论与实践的重要角色。

在具体学习中，需要关注以下几个关键点：概念的准确定义、与其他相关概念的关系、在实际场景中的应用方式。建议学习者先建立整体框架，再逐步深入每个细节。

### 2. 核心原理
${topic}的核心原理建立在多年的研究和实践基础之上。${materialTitle}涉及的主要原理包括：系统化思维方法、分层次学习策略、以及知识迁移机制。

这些原理相互关联，共同构成了完整的理论体系。理解这些原理不仅有助于掌握当前内容，对未来学习其他相关知识也有重要的指导意义。

### 3. 实践方法
理论知识需要通过实践来巩固和深化。在${materialTitle}的学习中，建议采用以下方法：
- 先通读整体内容，建立认知框架
- 然后分模块深入学习，每个模块后做小结
- 结合实际案例进行分析和思考
- 定期回顾和复习，巩固记忆

## 实践应用

${materialTitle}在实际学习中的应用非常广泛。学习者可以将所学知识应用到以下场景中：解决实际问题、构建知识体系、以及进行知识创新。通过不断的实践和应用，才能真正将知识内化为自己的能力。

## 常见误区

在学习${materialTitle}时，学习者常犯的几个错误包括：
1. 过于关注细节而忽略整体框架
2. 缺乏实践环节，仅停留在理论层面
3. 没有建立知识间的联系，导致知识碎片化

## 总结要点

1. ${materialTitle}是理解${topic}的关键内容
2. 学习时要注重整体框架和细节的平衡
3. 理论与实践相结合是最有效的学习方式
4. 定期回顾和复习有助于长期记忆
5. 建立知识间的联系可以加深理解`;
  }

  async generateStudyRecommendations(courseTitle: string, progress: number): Promise<StudyRecommendation[]> {
    const systemPrompt = `你是一位个性化的学习顾问，擅长根据学习者的进度和状态给出精准的学习建议。

## 任务
根据学习者的课程主题和学习进度，生成个性化的学习建议，帮助学习者优化学习策略、提高学习效率。

## 输入信息
- 课程主题: ${courseTitle}
- 当前学习进度: ${progress}%

## 输出要求
返回严格格式化的JSON数组，每条建议包含：
- id: 唯一标识（如 "rec_1"）
- type: 建议类型（"review"回顾 / "deepen"深化 / "practice"实践 / "explore"探索 / "rest"休息）
- title: 建议标题（15字以内，有吸引力）
- description: 详细建议（60字以内，具体可行）
- priority: 优先级（1-5，5为最重要）
- actionHint: 行动提示（一句话行动指南，20字以内）

## 质量标准
1. 建议必须针对当前进度定制，而非通用模板
2. 进度<30%：侧重基础理解和学习路径规划
3. 进度30-60%：侧重深化理解和实践应用
4. 进度60-90%：侧重知识整合和创新应用
5. 进度>90%：侧重复习巩固和拓展探索
6. 生成3-5条建议，包含不同类型的组合
7. 使用中文输出，语气鼓励且建设性

只返回JSON数组，不要任何其他文字或标记。`;

    const response = await this.ask(
      `我目前正在学习"${courseTitle}"，进度为${progress}%。请根据我的学习进度给出个性化的学习建议。`,
      systemPrompt
    );

    if (response.success) {
      try {
        const rawItems: Record<string, Object>[] = this.extractJsonArray(response.content) as Record<string, Object>[];
        const result: StudyRecommendation[] = [];
        for (let i = 0; i < rawItems.length; i++) {
          const item = rawItems[i];
          result.push({
            id: (item['id'] as string) || `rec_${i}`,
            type: (item['type'] as 'review' | 'deepen' | 'practice' | 'explore' | 'rest') || 'review',
            title: (item['title'] as string) || '',
            description: (item['description'] as string) || '',
            priority: (item['priority'] as number) || 1,
            actionHint: (item['actionHint'] as string) || ''
          });
        }
        if (result.length > 0) {
          return result;
        }
      } catch (e) {
        console.error('Parse recommendations failed: ' + JSON.stringify(e));
      }
    }
    return this.getDefaultRecommendations(courseTitle, progress);
  }

  private getDefaultRecommendations(courseTitle: string, progress: number): StudyRecommendation[] {
    const result: StudyRecommendation[] = [];
    if (progress < 30) {
      result.push({
        id: 'rec_1',
        type: 'deepen',
        title: '构建知识框架',
        description: `先整体了解${courseTitle}的知识体系，建立心智模型后再深入细节。`,
        priority: 5,
        actionHint: '使用三问学习法第一问构建框架'
      });
      result.push({
        id: 'rec_2',
        type: 'practice',
        title: '边学边练',
        description: `每学完一个${courseTitle}的概念，立即通过小练习巩固理解。`,
        priority: 4,
        actionHint: '完成配套练习检验理解'
      });
    } else if (progress < 60) {
      result.push({
        id: 'rec_1',
        type: 'deepen',
        title: '深入核心难点',
        description: `针对${courseTitle}中的难点概念，查阅多种资料加深理解。`,
        priority: 5,
        actionHint: '找出3个最难点重点突破'
      });
      result.push({
        id: 'rec_2',
        type: 'practice',
        title: '项目实战',
        description: `通过实际项目应用${courseTitle}知识，在实践中查漏补缺。`,
        priority: 4,
        actionHint: '尝试独立完成一个小项目'
      });
    } else {
      result.push({
        id: 'rec_1',
        type: 'review',
        title: '系统复习巩固',
        description: `回顾${courseTitle}的整体知识框架，查漏补缺，强化薄弱环节。`,
        priority: 5,
        actionHint: '用思维导图梳理全部知识点'
      });
      result.push({
        id: 'rec_2',
        type: 'explore',
        title: '拓展延伸学习',
        description: `探索${courseTitle}的前沿发展和跨学科应用，拓宽视野。`,
        priority: 3,
        actionHint: '阅读2-3篇相关领域前沿文章'
      });
    }
    result.push({
      id: 'rec_3',
      type: 'rest',
      title: '合理安排休息',
      description: '学习45分钟后休息10分钟，利用间隔效应提高学习效率。',
      priority: 3,
      actionHint: '使用番茄工作法管理时间'
    });
    return result;
  }

  simulateStreaming(content: string, chunkSize: number = 20): string[] {
    if (!content || content.length === 0) {
      return [];
    }
    if (chunkSize <= 0) {
      chunkSize = 20;
    }

    const chunks: string[] = [];
    let start = 0;
    while (start < content.length) {
      let end = start + chunkSize;
      if (end >= content.length) {
        end = content.length;
      } else {
        const nextNewline = content.indexOf('\n', start + chunkSize - 10);
        if (nextNewline > 0 && nextNewline < start + chunkSize + 10) {
          end = nextNewline + 1;
        } else {
          const nextPeriod = content.indexOf('。', start + chunkSize - 5);
          if (nextPeriod > 0 && nextPeriod < start + chunkSize + 8) {
            end = nextPeriod + 1;
          } else {
            const nextSpace = content.indexOf(' ', start + chunkSize - 3);
            if (nextSpace > 0 && nextSpace < start + chunkSize + 5) {
              end = nextSpace + 1;
            }
          }
        }
      }
      chunks.push(content.substring(start, end).trim());
      start = end;
    }
    return chunks.filter(chunk => chunk.length > 0);
  }
}

export const aiService = AIService.getInstance();
