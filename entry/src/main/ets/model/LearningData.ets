import { Course, AchievementInfo } from './CourseModel';
import { Question, AnswerRecord, EvaluationReport, BloomLevel, QuestionBank } from './QuestionModel';
import { LearningMaterial, MaterialType, MaterialSource } from './MaterialModel';

interface AchievementDef {
  id: string;
  name: string;
  desc: string;
  icon: string;
}

interface StreakData {
  streak: number;
  lastDate: number;
}

export interface StudySession {
  date: string;
  minutes: number;
  courseId: string;
}

export interface ReviewItem {
  questionId: string;
  courseId: string;
  questionText: string;
  options: string[];
  correctIndex: number;
  userAnswer: number;
  lastReviewDate: number;
  nextReviewDate: number;
  interval: number;
  reviewCount: number;
}

export class LearningDataManager {
  private courses: Course[] = [];
  private answerRecords: Map<string, AnswerRecord[]> = new Map();
  private reports: EvaluationReport[] = [];
  private earnedAchievements: Record<string, number> = {};
  private studyStreak: number = 0;
  private lastStudyDate: number = 0;
  private courseMaterials: Map<string, LearningMaterial[]> = new Map();
  private studySessions: StudySession[] = [];
  private notes: Record<string, string> = {};
  private reviewQueue: ReviewItem[] = [];
  private totalFocusMinutes: number = 0;

  private getAchievementDefs(): AchievementDef[] {
    const defs: AchievementDef[] = [
      { id: 'first_course', name: '初学者', desc: '创建了第一门课程', icon: '🌱' } as AchievementDef,
      { id: 'completed_3', name: '勤学者', desc: '完成了3门课程', icon: '📚' } as AchievementDef,
      { id: 'completed_5', name: '学霸', desc: '完成了5门课程', icon: '🏆' } as AchievementDef,
      { id: 'critical_thinker', name: '批判思维者', desc: '完成了第二问·学术分歧', icon: '🧠' } as AchievementDef,
      { id: 'assessment_master', name: '测评达人', desc: 'Q3测评正确率超过80%', icon: '🎯' } as AchievementDef,
    ];
    return defs;
  }

  getAllAchievementInfos(): AchievementInfo[] {
    return this.getAchievementDefs().map(def => {
      const info = new AchievementInfo();
      info.id = def.id;
      info.name = def.name;
      info.description = def.desc;
      info.icon = def.icon;
      info.unlocked = this.earnedAchievements[def.id] !== undefined;
      info.unlockedAt = this.earnedAchievements[def.id] ?? 0;
      return info;
    });
  }

  getEarnedAchievementIds(): string[] {
    return Object.keys(this.earnedAchievements);
  }

  isAchievementEarned(id: string): boolean {
    return this.earnedAchievements[id] !== undefined;
  }

  setAchievementEarned(id: string, timestamp: number): void {
    this.earnedAchievements[id] = timestamp;
  }

  checkAndAwardAchievement(id: string): boolean {
    if (this.earnedAchievements[id] !== undefined) return false;
    const courseCount = this.courses.length;
    const completedCount = this.courses.filter(c => c.status === 'completed').length;
    let earned = false;
    switch (id) {
      case 'first_course':
        earned = courseCount >= 1;
        break;
      case 'completed_3':
        earned = completedCount >= 3;
        break;
      case 'completed_5':
        earned = completedCount >= 5;
        break;
      case 'critical_thinker':
        earned = this.courses.some(c => c.q2Completed);
        break;
      case 'assessment_master':
        earned = this.courses.some(c => c.q3Completed && c.q3Accuracy >= 80);
        break;
    }
    if (earned) {
      this.earnedAchievements[id] = Date.now();
    }
    return earned;
  }

  checkAllAchievements(): string[] {
    const newlyEarned: string[] = [];
    const defs = this.getAchievementDefs();
    for (const def of defs) {
      if (this.checkAndAwardAchievement(def.id)) {
        newlyEarned.push(def.id);
      }
    }
    return newlyEarned;
  }

  recordStudyActivity(): void {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    if (this.lastStudyDate === 0) {
      this.studyStreak = 1;
    } else {
      const yesterday = today - 86400000;
      if (this.lastStudyDate >= today) {
        return;
      } else if (this.lastStudyDate >= yesterday) {
        this.studyStreak++;
      } else {
        this.studyStreak = 1;
      }
    }
    this.lastStudyDate = today;
  }

  getStreak(): number {
    return this.studyStreak;
  }

  setStreakData(streak: number, lastDate: number): void {
    this.studyStreak = streak;
    this.lastStudyDate = lastDate;
  }

  getStreakData(): StreakData {
    const data: StreakData = { streak: this.studyStreak, lastDate: this.lastStudyDate } as StreakData;
    return data;
  }

  addCourse(course: Course): void {
    this.courses.unshift(course);
  }

  getCourses(): Course[] {
    return this.courses;
  }

  getCourse(id: string): Course | undefined {
    return this.courses.find(c => c.id === id);
  }

  getLastActiveCourse(): Course | null {
    const active = this.courses.filter(c => c.progress > 0 && c.progress < 100);
    if (active.length === 0) return null;
    active.sort((a, b) => b.lastAccessedAt - a.lastAccessedAt);
    return active[0];
  }

  updateCourseProgress(courseId: string, progress: number): void {
    const course = this.getCourse(courseId);
    if (course) {
      course.progress = Math.min(progress, 100);
      if (course.progress >= 100) {
        course.status = 'completed';
      }
    }
  }

  submitAnswer(courseId: string, questionId: string, selectedLabel: string, isCorrect: boolean): void {
    const record = new AnswerRecord();
    record.questionId = questionId;
    record.courseId = courseId;
    record.selectedLabel = selectedLabel;
    record.isCorrect = isCorrect;
    record.timestamp = Date.now();
    record.timeSpent = 30;

    if (!this.answerRecords.has(courseId)) {
      this.answerRecords.set(courseId, []);
    }
    this.answerRecords.get(courseId)!.push(record);

    const course = this.getCourse(courseId);
    if (course) {
      const totalQuestions = QuestionBank.generateQuestions(courseId, course.title).length;
      const answered = this.answerRecords.get(courseId)!.length;
      course.progress = Math.min(Math.round((answered / totalQuestions) * 100), 100);
      if (course.progress >= 100) {
        course.status = 'completed';
      }
      const records = this.answerRecords.get(courseId)!;
      const correct = records.filter(r => r.isCorrect).length;
      course.q3Accuracy = totalQuestions > 0 ? Math.round((correct / totalQuestions) * 100) : 0;
    }
  }

  getAnswerRecords(courseId: string): AnswerRecord[] {
    return this.answerRecords.get(courseId) || [];
  }

  generateReport(courseId: string): EvaluationReport {
    const course = this.getCourse(courseId);
    const records = this.getAnswerRecords(courseId);
    const questions = course ? QuestionBank.generateQuestions(courseId, course.title) : [];

    const report = new EvaluationReport();
    report.courseId = courseId;
    report.courseTitle = course?.title ?? '';
    report.totalQuestions = questions.length;
    report.correctCount = records.filter(r => r.isCorrect).length;
    report.accuracy = report.totalQuestions > 0 ? report.correctCount / report.totalQuestions : 0;
    report.completedAt = Date.now();
    report.dialogueRecords = records;

    const levelCorrect = new Map<BloomLevel, number>();
    const levelTotal = new Map<BloomLevel, number>();
    questions.forEach(q => {
      levelTotal.set(q.bloomLevel, (levelTotal.get(q.bloomLevel) ?? 0) + 1);
    });
    records.forEach(r => {
      const q = questions.find(q => q.id === r.questionId);
      if (q && r.isCorrect) {
        levelCorrect.set(q.bloomLevel, (levelCorrect.get(q.bloomLevel) ?? 0) + 1);
      }
    });

    levelTotal.forEach((total, level) => {
      const correct = levelCorrect.get(level) ?? 0;
      report.levelScores.set(level, total > 0 ? correct / total : 0);
    });

    report.levelScores.forEach((score, level) => {
      if (score < 0.5) report.weakPoints.push(`${level}层级能力较弱，需加强练习`);
      else if (score >= 0.8) report.strongPoints.push(`${level}层级掌握良好`);
    });
    if (report.weakPoints.length === 0) report.weakPoints.push('整体掌握较好，建议挑战更高难度');
    if (report.strongPoints.length === 0) report.strongPoints.push('继续努力，建议回顾基础知识');

    report.suggestions.push('建议使用三问学习法重学薄弱环节');
    report.suggestions.push('推荐进行间隔复习，加深长期记忆');
    report.suggestions.push('尝试将所学知识教授他人，检验理解深度');

    this.reports.push(report);
    return report;
  }

  getReports(): EvaluationReport[] {
    return this.reports;
  }

  getMaterials(courseId: string): LearningMaterial[] {
    return this.courseMaterials.get(courseId) || [];
  }

  addMaterial(courseId: string, material: LearningMaterial): void {
    if (!this.courseMaterials.has(courseId)) {
      this.courseMaterials.set(courseId, []);
    }
    this.courseMaterials.get(courseId)!.push(material);
  }

  removeMaterial(courseId: string, materialId: string): void {
    const list = this.courseMaterials.get(courseId);
    if (list) {
      this.courseMaterials.set(courseId, list.filter(m => m.id !== materialId));
    }
  }

  setMaterials(courseId: string, materials: LearningMaterial[]): void {
    this.courseMaterials.set(courseId, materials);
  }

  getTotalStudyTime(): number {
    return this.courses.reduce((sum, c) => sum + c.studyTime, 0);
  }

  getTotalCourses(): number {
    return this.courses.length;
  }

  getCompletedCourses(): number {
    return this.courses.filter(c => c.status === 'completed').length;
  }

  getStudyTimeDisplay(): string {
    const totalSeconds = this.getTotalStudyTime();
    const totalMinutes = Math.floor(totalSeconds / 60);
    if (totalMinutes < 60) {
      return `${totalMinutes}分钟`;
    }
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    return `${hours}小时${mins}分钟`;
  }

  getOverallAccuracy(): number {
    let correct = 0;
    let total = 0;
    this.answerRecords.forEach(records => {
      correct += records.filter(r => r.isCorrect).length;
      total += records.length;
    });
    return total > 0 ? correct / total : 0;
  }

  getAllAnswerRecords(): AnswerRecord[] {
    let all: AnswerRecord[] = [];
    this.answerRecords.forEach(records => {
      all = all.concat(records);
    });
    return all;
  }

  getWeeklyActivity(): number[] {
    const dayMs = 24 * 60 * 60 * 1000;
    const now = Date.now();
    const activity: number[] = [];
    for (let i = 6; i >= 0; i--) {
      const dayStart = new Date(now - i * dayMs);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(dayStart.getTime() + dayMs);
      let dayMinutes = 0;
      this.answerRecords.forEach(records => {
        records.forEach(r => {
          if (r.timestamp >= dayStart.getTime() && r.timestamp < dayEnd.getTime()) {
            dayMinutes += r.timeSpent;
          }
        });
      });
      activity.push(Math.min(Math.round(dayMinutes / 60), 120));
    }
    return activity;
  }

  getDayLabels(): string[] {
    const now = new Date();
    const dayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    const labels: string[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      labels.push(dayNames[d.getDay()]);
    }
    return labels;
  }

  addStudySession(date: string, minutes: number, courseId: string): void {
    const session: StudySession = { date: date, minutes: minutes, courseId: courseId } as StudySession;
    this.studySessions.push(session);
    this.totalFocusMinutes += minutes;
    this.recordStudyActivity();
  }

  restoreSession(date: string, minutes: number, courseId: string): void {
    const session: StudySession = { date: date, minutes: minutes, courseId: courseId } as StudySession;
    this.studySessions.push(session);
    this.totalFocusMinutes += minutes;
  }

  getStudySessions(): StudySession[] {
    return this.studySessions;
  }

  getTotalFocusMinutes(): number {
    return this.totalFocusMinutes;
  }

  getTodayFocusMinutes(): number {
    const today = new Date();
    const todayStr = today.getFullYear() + '-' +
      String(today.getMonth() + 1).padStart(2, '0') + '-' +
      String(today.getDate()).padStart(2, '0');
    let total = 0;
    for (let i = 0; i < this.studySessions.length; i++) {
      if (this.studySessions[i].date === todayStr) {
        total += this.studySessions[i].minutes;
      }
    }
    return total;
  }

  getNotes(courseId: string): string {
    return this.notes[courseId] || '';
  }

  setNotes(courseId: string, content: string): void {
    this.notes[courseId] = content;
  }

  addReviewItem(item: ReviewItem): void {
    const existing = this.reviewQueue.find(r =>
      r.questionId === item.questionId && r.courseId === item.courseId);
    if (existing) {
      existing.reviewCount = item.reviewCount;
      existing.lastReviewDate = item.lastReviewDate;
      existing.nextReviewDate = item.nextReviewDate;
      existing.interval = item.interval;
    } else {
      this.reviewQueue.push(item);
    }
  }

  getReviewQueue(): ReviewItem[] {
    return this.reviewQueue;
  }

  getDueReviews(): ReviewItem[] {
    const now = Date.now();
    const due: ReviewItem[] = [];
    for (let i = 0; i < this.reviewQueue.length; i++) {
      if (this.reviewQueue[i].nextReviewDate <= now) {
        due.push(this.reviewQueue[i]);
      }
    }
    return due;
  }

  getDueReviewCount(): number {
    return this.getDueReviews().length;
  }

  removeReviewItem(questionId: string, courseId: string): void {
    this.reviewQueue = this.reviewQueue.filter(r =>
      !(r.questionId === questionId && r.courseId === courseId));
  }

  getWeeklyCalendar(): number[][] {
    const weeks: number[][] = [];
    const now = new Date();
    const dayMs = 24 * 60 * 60 * 1000;
    for (let w = 6; w >= 0; w--) {
      const week: number[] = [];
      for (let d = 6; d >= 0; d--) {
        const dayStart = new Date(now.getTime() - (w * 7 + d) * dayMs);
        dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date(dayStart.getTime() + dayMs);
        let totalMin = 0;
        for (let s = 0; s < this.studySessions.length; s++) {
          const sessionDate = this.studySessions[s].date;
          const parts = sessionDate.split('-');
          const sessionTime = new Date(
            parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2])
          ).getTime();
          if (sessionTime >= dayStart.getTime() && sessionTime < dayEnd.getTime()) {
            totalMin += this.studySessions[s].minutes;
          }
        }
        week.push(Math.min(Math.round(totalMin / 15), 8));
      }
      weeks.push(week);
    }
    return weeks;
  }

  toJSON(): string {
    const materialsObj: Record<string, Object[]> = {};
    this.courseMaterials.forEach((mats, key) => {
      const items: Object[] = [];
      for (let i = 0; i < mats.length; i++) {
        const m = mats[i];
        const item: Record<string, Object> = {};
        item['id'] = m.id;
        item['title'] = m.title;
        item['type'] = m.type as string;
        item['source'] = m.source as string;
        item['content'] = m.content;
        item['summary'] = m.summary;
        item['keywords'] = m.keywords;
        item['courseId'] = m.courseId;
        item['modulePath'] = m.modulePath;
        item['url'] = m.url;
        item['filePath'] = m.filePath;
        item['fileSize'] = m.fileSize;
        item['createdAt'] = m.createdAt;
        item['updatedAt'] = m.updatedAt;
        item['isRead'] = m.isRead;
        item['readProgress'] = m.readProgress;
        item['rating'] = m.rating;
        item['tags'] = m.tags;
        items.push(item);
      }
      materialsObj[key] = items as Object[];
    });
    return JSON.stringify({
      courses: this.courses,
      answerRecords: Array.from(this.answerRecords.entries()),
      reports: this.reports,
      achievements: this.earnedAchievements,
      studyStreak: this.studyStreak,
      lastStudyDate: this.lastStudyDate,
      courseMaterials: materialsObj,
      studySessions: this.studySessions,
      notes: this.notes,
      reviewQueue: this.reviewQueue
    });
  }
}

export const globalData = new LearningDataManager();
