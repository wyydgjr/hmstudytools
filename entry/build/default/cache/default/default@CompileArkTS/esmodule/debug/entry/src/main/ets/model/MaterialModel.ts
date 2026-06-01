// 学习资料类型
export enum MaterialType {
    PDF = "pdf",
    WORD = "word",
    MARKDOWN = "markdown",
    WEB = "web",
    AI_GENERATED = "ai_generated"
}
// 资料来源
export enum MaterialSource {
    USER_UPLOAD = "user_upload",
    AI_SUPPLEMENT = "ai_supplement",
    WEB_SEARCH = "web_search" // 联网检索
}
// 学习资料模型
export class LearningMaterial {
    id: string = '';
    title: string = '';
    type: MaterialType = MaterialType.PDF;
    source: MaterialSource = MaterialSource.USER_UPLOAD;
    content: string = '';
    summary: string = '';
    keywords: string[] = [];
    courseId: string = '';
    modulePath: string = ''; // 关联的课程模块路径
    url: string = ''; // 原始URL（如果是网页）
    filePath: string = ''; // 本地文件路径
    fileSize: number = 0;
    createdAt: number = 0;
    updatedAt: number = 0;
    isRead: boolean = false;
    readProgress: number = 0;
    rating: number = 0; // 用户评分 1-5
    tags: string[] = [];
    static generateId(): string {
        return 'mat_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
    }
    static createFromUpload(title: string, type: MaterialType, content: string, courseId: string): LearningMaterial {
        const material = new LearningMaterial();
        material.id = LearningMaterial.generateId();
        material.title = title;
        material.type = type;
        material.source = MaterialSource.USER_UPLOAD;
        material.content = content;
        material.courseId = courseId;
        material.createdAt = Date.now();
        material.updatedAt = Date.now();
        return material;
    }
    static createFromAI(title: string, content: string, courseId: string, keywords: string[] = []): LearningMaterial {
        const material = new LearningMaterial();
        material.id = LearningMaterial.generateId();
        material.title = title;
        material.type = MaterialType.AI_GENERATED;
        material.source = MaterialSource.AI_SUPPLEMENT;
        material.content = content;
        material.courseId = courseId;
        material.keywords = keywords;
        material.createdAt = Date.now();
        material.updatedAt = Date.now();
        return material;
    }
    static createFromWeb(title: string, url: string, content: string, courseId: string): LearningMaterial {
        const material = new LearningMaterial();
        material.id = LearningMaterial.generateId();
        material.title = title;
        material.type = MaterialType.WEB;
        material.source = MaterialSource.WEB_SEARCH;
        material.url = url;
        material.content = content;
        material.courseId = courseId;
        material.createdAt = Date.now();
        material.updatedAt = Date.now();
        return material;
    }
}
// 知识库模块
export class KnowledgeModule {
    id: string = '';
    name: string = '';
    description: string = '';
    courseId: string = '';
    materials: LearningMaterial[] = [];
    parentModuleId: string = '';
    childModules: KnowledgeModule[] = [];
    keywords: string[] = [];
    createdAt: number = 0;
    static generateId(): string {
        return 'mod_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
    }
    static create(name: string, description: string, courseId: string, parentId: string = ''): KnowledgeModule {
        const module = new KnowledgeModule();
        module.id = KnowledgeModule.generateId();
        module.name = name;
        module.description = description;
        module.courseId = courseId;
        module.parentModuleId = parentId;
        module.createdAt = Date.now();
        return module;
    }
    addMaterial(material: LearningMaterial): void {
        material.modulePath = this.id;
        this.materials.push(material);
    }
    removeMaterial(materialId: string): void {
        this.materials = this.materials.filter(m => m.id !== materialId);
    }
    getMaterialCount(): number {
        return this.materials.length;
    }
    getTotalSize(): number {
        return this.materials.reduce((sum, m) => sum + m.fileSize, 0);
    }
}
// 复合知识库
export class CompositeKnowledgeBase {
    id: string = '';
    courseId: string = '';
    courseTitle: string = '';
    modules: KnowledgeModule[] = [];
    allMaterials: LearningMaterial[] = [];
    aiMaterials: LearningMaterial[] = [];
    userMaterials: LearningMaterial[] = [];
    createdAt: number = 0;
    updatedAt: number = 0;
    static generateId(): string {
        return 'kb_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
    }
    static create(courseId: string, courseTitle: string): CompositeKnowledgeBase {
        const kb = new CompositeKnowledgeBase();
        kb.id = CompositeKnowledgeBase.generateId();
        kb.courseId = courseId;
        kb.courseTitle = courseTitle;
        kb.createdAt = Date.now();
        kb.updatedAt = Date.now();
        return kb;
    }
    addModule(module: KnowledgeModule): void {
        this.modules.push(module);
        this.updatedAt = Date.now();
    }
    removeModule(moduleId: string): void {
        this.modules = this.modules.filter(m => m.id !== moduleId);
        this.rebuildMaterialLists();
        this.updatedAt = Date.now();
    }
    addMaterial(material: LearningMaterial, moduleId?: string): void {
        if (moduleId) {
            const module = this.findModule(moduleId);
            if (module) {
                module.addMaterial(material);
            }
        }
        this.rebuildMaterialLists();
        this.updatedAt = Date.now();
    }
    removeMaterial(materialId: string): void {
        for (const module of this.modules) {
            module.removeMaterial(materialId);
        }
        this.rebuildMaterialLists();
        this.updatedAt = Date.now();
    }
    rebuildMaterialLists(): void {
        this.allMaterials = [];
        this.aiMaterials = [];
        this.userMaterials = [];
        for (const module of this.modules) {
            for (const material of module.materials) {
                this.allMaterials.push(material);
                if (material.source === MaterialSource.AI_SUPPLEMENT ||
                    material.source === MaterialSource.WEB_SEARCH) {
                    this.aiMaterials.push(material);
                }
                else {
                    this.userMaterials.push(material);
                }
            }
        }
    }
    findModule(moduleId: string): KnowledgeModule | null {
        for (const module of this.modules) {
            if (module.id === moduleId) {
                return module;
            }
            const found = this.findModuleRecursive(module, moduleId);
            if (found) {
                return found;
            }
        }
        return null;
    }
    private findModuleRecursive(parent: KnowledgeModule, targetId: string): KnowledgeModule | null {
        for (const child of parent.childModules) {
            if (child.id === targetId) {
                return child;
            }
            const found = this.findModuleRecursive(child, targetId);
            if (found) {
                return found;
            }
        }
        return null;
    }
    searchMaterials(query: string): LearningMaterial[] {
        const lowerQuery = query.toLowerCase();
        return this.allMaterials.filter(m => m.title.toLowerCase().includes(lowerQuery) ||
            m.summary.toLowerCase().includes(lowerQuery) ||
            m.keywords.some(k => k.toLowerCase().includes(lowerQuery)) ||
            m.tags.some(t => t.toLowerCase().includes(lowerQuery)));
    }
    filterByType(type: MaterialType): LearningMaterial[] {
        return this.allMaterials.filter(m => m.type === type);
    }
    filterBySource(source: MaterialSource): LearningMaterial[] {
        return this.allMaterials.filter(m => m.source === source);
    }
    getStatistics(): KnowledgeBaseStats {
        const stats = new KnowledgeBaseStats();
        stats.totalMaterials = this.allMaterials.length;
        stats.aiMaterials = this.aiMaterials.length;
        stats.userMaterials = this.userMaterials.length;
        stats.totalSize = this.allMaterials.reduce((sum, m) => sum + m.fileSize, 0);
        stats.moduleCount = this.modules.length;
        stats.readCount = this.allMaterials.filter(m => m.isRead).length;
        stats.averageRating = this.calculateAverageRating();
        return stats;
    }
    private calculateAverageRating(): number {
        const rated = this.allMaterials.filter(m => m.rating > 0);
        if (rated.length === 0)
            return 0;
        return rated.reduce((sum, m) => sum + m.rating, 0) / rated.length;
    }
}
// 知识库统计
export class KnowledgeBaseStats {
    totalMaterials: number = 0;
    aiMaterials: number = 0;
    userMaterials: number = 0;
    totalSize: number = 0;
    moduleCount: number = 0;
    readCount: number = 0;
    averageRating: number = 0;
}
// 资料融合结果
export class FusionResult {
    success: boolean = false;
    mergedContent: string = '';
    conflicts: string[] = [];
    suggestions: string[] = [];
    keywords: string[] = [];
}
// 资料解析器
export class MaterialParser {
    static parsePDF(content: string): string {
        // 简化的PDF解析，实际需要使用专业库
        return content;
    }
    static parseWord(content: string): string {
        // 简化的Word解析
        return content;
    }
    static parseMarkdown(content: string): string {
        // Markdown解析，保留格式
        return content;
    }
    static extractKeywords(content: string): string[] {
        // 简单的关键词提取（实际应使用NLP）
        const words = content.split(/\s+/);
        const wordCount: Map<string, number> = new Map();
        for (const word of words) {
            const lower = word.toLowerCase();
            if (lower.length > 3) {
                wordCount.set(lower, (wordCount.get(lower) || 0) + 1);
            }
        }
        const sorted = Array.from(wordCount.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(item => item[0]);
        return sorted;
    }
    static generateSummary(content: string, maxLength: number = 200): string {
        if (content.length <= maxLength) {
            return content;
        }
        // 简单截取，实际应使用AI生成摘要
        return content.substring(0, maxLength) + '...';
    }
}
