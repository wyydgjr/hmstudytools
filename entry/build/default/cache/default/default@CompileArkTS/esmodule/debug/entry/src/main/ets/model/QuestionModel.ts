export enum BloomLevel {
    MEMORY = "\u8BB0\u5FC6",
    UNDERSTAND = "\u7406\u89E3",
    APPLY = "\u5E94\u7528",
    ANALYZE = "\u5206\u6790",
    EVALUATE = "\u8BC4\u4EF7",
    CREATE = "\u521B\u9020"
}
export class QuestionOption {
    label: string = '';
    content: string = '';
    isCorrect: boolean = false;
}
export class Question {
    id: string = '';
    courseId: string = '';
    bloomLevel: BloomLevel = BloomLevel.MEMORY;
    questionText: string = '';
    options: QuestionOption[] = [];
    explanation: string = '';
    difficulty: number = 1;
}
export class AnswerRecord {
    questionId: string = '';
    courseId: string = '';
    selectedLabel: string = '';
    isCorrect: boolean = false;
    timestamp: number = 0;
    timeSpent: number = 0;
}
export class EvaluationReport {
    courseId: string = '';
    courseTitle: string = '';
    totalQuestions: number = 0;
    correctCount: number = 0;
    accuracy: number = 0;
    levelScores: Map<BloomLevel, number> = new Map();
    weakPoints: string[] = [];
    strongPoints: string[] = [];
    suggestions: string[] = [];
    dialogueRecords: AnswerRecord[] = [];
    completedAt: number = 0;
    getLevelScore(level: BloomLevel): number {
        return this.levelScores.get(level) ?? 0;
    }
}
export class QuestionBank {
    static generateQuestions(courseId: string, topic: string): Question[] {
        const levels = [
            BloomLevel.MEMORY, BloomLevel.UNDERSTAND, BloomLevel.APPLY,
            BloomLevel.ANALYZE, BloomLevel.EVALUATE, BloomLevel.CREATE
        ];
        const questions: Question[] = [];
        levels.forEach((level, idx) => {
            const q = QuestionBank.makeQuestion(courseId, topic, level, idx);
            if (q)
                questions.push(q);
        });
        return questions;
    }
    static makeQuestion(courseId: string, topic: string, level: BloomLevel, idx: number): Question {
        const q = new Question();
        q.id = `q_${courseId}_${idx}`;
        q.courseId = courseId;
        q.bloomLevel = level;
        q.difficulty = idx + 1;
        switch (level) {
            case BloomLevel.MEMORY:
                q.questionText = `关于「${topic}」，以下哪个是核心概念的正确定义？`;
                q.options = [
                    { label: 'A', content: `${topic}是指对相关领域知识体系进行系统化组织和结构化表达的方法论`, isCorrect: true },
                    { label: 'B', content: `${topic}是指随机获取信息并简单堆砌的过程`, isCorrect: false },
                    { label: 'C', content: `${topic}是指完全依赖他人经验而不加思考的学习方式`, isCorrect: false },
                    { label: 'D', content: `${topic}是指只关注理论而忽视实践应用的研究方法`, isCorrect: false },
                ];
                q.explanation = `${topic}的核心在于系统化组织和结构化表达，形成可复用的知识体系。`;
                break;
            case BloomLevel.UNDERSTAND:
                q.questionText = `请用自己的语言理解：为什么「${topic}」中的核心概念是相互关联的？`;
                q.options = [
                    { label: 'A', content: '因为它们共同构成了一个有机的知识生态系统，每个概念都依赖于其他概念而存在', isCorrect: true },
                    { label: 'B', content: '它们之间没有实质关联，只是被强行归类在一起', isCorrect: false },
                    { label: 'C', content: '关联性仅存在于理论层面，实践中没有体现', isCorrect: false },
                    { label: 'D', content: '只有少数核心概念有关联，其他都是独立的', isCorrect: false },
                ];
                q.explanation = `${topic}中的概念相互依存、相互支撑，形成一个完整的知识生态系统。`;
                break;
            case BloomLevel.APPLY:
                q.questionText = `请运用「${topic}」中的方法论，解决以下场景问题：\n你正在学习一个全新的领域，如何应用三问学习法制定学习计划？`;
                q.options = [
                    { label: 'A', content: '先问核心心智模型建立框架，再问学术分歧深入理解，最后通过测评验证学习效果', isCorrect: true },
                    { label: 'B', content: '只关注第三问的测评结果，忽视前两个步骤', isCorrect: false },
                    { label: 'C', content: '跳过理解直接背诵所有内容', isCorrect: false },
                    { label: 'D', content: '只专注于第一问，忽略后续深入', isCorrect: false },
                ];
                q.explanation = '三问学习法的正确应用顺序是：心智模型（框架）→ 学术分歧（深入）→ 深度测评（验证）。';
                break;
            case BloomLevel.ANALYZE:
                q.questionText = `分析在「${topic}」学习过程中，不同教学方法的优劣。以下哪个分析最准确？`;
                q.options = [
                    { label: 'A', content: '主动探究式学习优于被动接收式学习，因为前者能促进深度认知加工和知识迁移', isCorrect: true },
                    { label: 'B', content: '所有教学方法的效果都一样，关键是学习时间长短', isCorrect: false },
                    { label: 'C', content: '被动接收式学习效率更高，因为可以快速获取大量信息', isCorrect: false },
                    { label: 'D', content: '教学方法的效果取决于老师的水平而非方法本身', isCorrect: false },
                ];
                q.explanation = '主动探究式学习通过深度认知加工，促进理解、记忆和知识迁移，效果显著优于被动接收。';
                break;
            case BloomLevel.EVALUATE:
                q.questionText = `请评价以下学习策略对「${topic}」的有效性：\n"每天学习8小时，连续一周专攻一个主题" vs "每天学习2小时，持续一个月"。哪种策略更优？`;
                q.options = [
                    { label: 'A', content: '分散学习（间隔效应）更优：每天2小时持续一个月，利用间隔效应提升长期记忆 retention', isCorrect: true },
                    { label: 'B', content: '集中学习更优：连续高强度学习可以在短时间内掌握大量内容', isCorrect: false },
                    { label: 'C', content: '两种策略效果相同，取决于个人偏好', isCorrect: false },
                    { label: 'D', content: '应该更极端：每天学习16小时连续3天', isCorrect: false },
                ];
                q.explanation = '认知心理学研究表明，间隔学习（分散练习）能显著提升长期记忆效果，优于集中填鸭式学习。';
                break;
            case BloomLevel.CREATE:
                q.questionText = `基于「${topic}」的学习心得，请设计一个创新的学习方案，帮助初学者高效入门。`;
                q.options = [
                    { label: 'A', content: '设计"三阶九步"学习法：第一阶段建立心智地图（3步），第二阶段同步实践验证（3步），第三阶段知识创新输出（3步）', isCorrect: true },
                    { label: 'B', content: '随便看看视频和文章就行', isCorrect: false },
                    { label: 'C', content: '只做题目不学理论', isCorrect: false },
                    { label: 'D', content: '让别人替学然后转述', isCorrect: false },
                ];
                q.explanation = '优秀的学习方案应该包含：知识框架建立、实践验证、创新输出三个完整阶段，形成学习闭环。';
                break;
        }
        return q;
    }
}
