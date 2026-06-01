import { globalData, StudySession, ReviewItem } from '../model/LearningData';
import { Course } from '../model/CourseModel';
import { LearningMaterial, MaterialType, MaterialSource } from '../model/MaterialModel';

export class StorageUtil {
  static readonly KEY_LEARNING_DATA = 'threeq_learning_data';

  static saveData(): void {
    try {
      const json = globalData.toJSON();
      AppStorage.set<string>(StorageUtil.KEY_LEARNING_DATA, json);
    } catch (e) {
      console.error('Save data failed: ' + JSON.stringify(e));
    }
  }

  static loadData(): void {
    try {
      const json = AppStorage.get<string>(StorageUtil.KEY_LEARNING_DATA);
      if (json && json.length > 0) {
        const parsed = JSON.parse(json) as Record<string, Object>;
        if (parsed.courses) {
          const coursesArr = parsed.courses as Record<string, Object>[];
          for (let i = 0; i < coursesArr.length; i++) {
            const c = coursesArr[i] as Record<string, Object>;
            const id = c['id'] as string;
            const existing = globalData.getCourse(id);
            if (!existing) {
              const course = new Course();
              course.id = c['id'] as string;
              course.title = c['title'] as string;
              course.description = c['description'] as string;
              const statusStr = c['status'] as string;
              course.status = (statusStr === 'completed') ? 'completed' : 'active';
              course.progress = c['progress'] as number;
              course.createdAt = c['createdAt'] as number;
              course.q1Completed = c['q1Completed'] as boolean;
              course.q2Completed = c['q2Completed'] as boolean;
              course.q3Completed = c['q3Completed'] as boolean;
              course.q3Accuracy = (c['q3Accuracy'] as number) ?? 0;
              course.lastAccessedAt = (c['lastAccessedAt'] as number) ?? 0;
              globalData.addCourse(course);
            }
          }
        }
        if (parsed.achievements) {
          const achObj = parsed.achievements as Record<string, number>;
          const achKeys: string[] = Object.keys(achObj);
          for (let i = 0; i < achKeys.length; i++) {
            const achId = achKeys[i];
            globalData.setAchievementEarned(achId, achObj[achId]);
          }
        }
        if (parsed.studyStreak !== undefined) {
          globalData.setStreakData(
            parsed.studyStreak as number,
            (parsed.lastStudyDate as number) ?? 0
          );
        }
        if (parsed.courseMaterials) {
          const materialsObj = parsed.courseMaterials as Record<string, Record<string, Object>[]>;
          const courseIds: string[] = [];
          const matKeys: string[] = Object.keys(materialsObj);
          for (let i = 0; i < matKeys.length; i++) {
            courseIds.push(matKeys[i]);
          }
          for (let j = 0; j < courseIds.length; j++) {
            const courseId = courseIds[j];
            const mats = materialsObj[courseId];
            const materials: LearningMaterial[] = [];
            for (let k = 0; k < mats.length; k++) {
              const m = mats[k];
              const lm = new LearningMaterial();
              lm.id = m['id'] as string;
              lm.title = m['title'] as string;
              const typeStr = m['type'] as string;
              lm.type = typeStr === 'pdf' ? MaterialType.PDF :
                typeStr === 'word' ? MaterialType.WORD :
                typeStr === 'markdown' ? MaterialType.MARKDOWN :
                typeStr === 'web' ? MaterialType.WEB :
                MaterialType.AI_GENERATED;
              const sourceStr = m['source'] as string;
              lm.source = sourceStr === 'user_upload' ? MaterialSource.USER_UPLOAD :
                sourceStr === 'ai_supplement' ? MaterialSource.AI_SUPPLEMENT :
                MaterialSource.WEB_SEARCH;
              lm.content = (m['content'] as string) || '';
              lm.summary = (m['summary'] as string) || '';
              lm.keywords = (m['keywords'] as string[]) || [];
              lm.courseId = (m['courseId'] as string) || '';
              lm.modulePath = (m['modulePath'] as string) || '';
              lm.url = (m['url'] as string) || '';
              lm.filePath = (m['filePath'] as string) || '';
              lm.fileSize = (m['fileSize'] as number) || 0;
              lm.createdAt = (m['createdAt'] as number) || 0;
              lm.updatedAt = (m['updatedAt'] as number) || 0;
              lm.isRead = (m['isRead'] as boolean) || false;
              lm.readProgress = (m['readProgress'] as number) || 0;
              lm.rating = (m['rating'] as number) || 0;
              lm.tags = (m['tags'] as string[]) || [];
              materials.push(lm);
            }
            globalData.setMaterials(courseId, materials);
          }
        }
        if (parsed.studySessions) {
          const sessionsArr = parsed.studySessions as Record<string, Object>[];
          for (let i = 0; i < sessionsArr.length; i++) {
            const s = sessionsArr[i];
            const session: StudySession = {
              date: s['date'] as string,
              minutes: s['minutes'] as number,
              courseId: s['courseId'] as string
            } as StudySession;
            globalData.restoreSession(session.date, session.minutes, session.courseId);
          }
        }
        if (parsed.notes) {
          const notesObj = parsed.notes as Record<string, string>;
          const noteKeys: string[] = Object.keys(notesObj);
          for (let i = 0; i < noteKeys.length; i++) {
            globalData.setNotes(noteKeys[i], notesObj[noteKeys[i]]);
          }
        }
        if (parsed.reviewQueue) {
          const reviewArr = parsed.reviewQueue as Record<string, Object>[];
          for (let i = 0; i < reviewArr.length; i++) {
            const r = reviewArr[i];
            const item: ReviewItem = {
              questionId: r['questionId'] as string,
              courseId: r['courseId'] as string,
              questionText: r['questionText'] as string,
              options: r['options'] as string[],
              correctIndex: r['correctIndex'] as number,
              userAnswer: r['userAnswer'] as number,
              lastReviewDate: r['lastReviewDate'] as number,
              nextReviewDate: r['nextReviewDate'] as number,
              interval: r['interval'] as number,
              reviewCount: r['reviewCount'] as number
            } as ReviewItem;
            globalData.addReviewItem(item);
          }
        }

      }
    } catch (e) {
      console.error('Load data failed: ' + JSON.stringify(e));
    }
  }
}
