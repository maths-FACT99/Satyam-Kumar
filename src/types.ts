export type ClassLevel =
  | 'Class III'
  | 'Class IV'
  | 'Class V'
  | 'Class VI'
  | 'Class VII'
  | 'Class VIII'
  | 'Class IX'
  | 'Class X'
  | 'Class XI'
  | 'Class XII';

export type Subject = 'Mathematics' | 'Science' | 'Social Science' | 'All Subjects' | 'Other Subjects';

export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard';

export type ExamType = 'School Practice' | 'Board Exam' | 'Competitive' | 'Olympiad' | 'Revision Test';

export type MaterialType =
  | 'Notes'
  | 'Worksheets'
  | 'Practice Questions'
  | 'Sample Papers'
  | 'Revision Material'
  | 'Important Questions'
  | 'Assignments';

export type EnquiryStatus = 'New' | 'Contacted' | 'Follow-up' | 'Closed';

export interface WebsiteContent {
  instituteName: string;
  tagline: string;
  heroHeading: string;
  heroHighlight: string;
  heroSubheading: string;
  heroBadge: string;
  heroBadgeSubtitle: string;
  heroDescription?: string;
  bannerTitle: string;
  bannerSubtitle: string;
  aboutTitle: string;
  aboutDescription: string;
  aboutPoints: string[];
  aboutImageUrl?: string;
  whyChooseTitle?: string;
  whyChooseSubtitle?: string;
  whyChoosePoints: {
    title: string;
    description: string;
    icon: string;
  }[];
  coursesSectionTitle?: string;
  coursesSectionSubtitle?: string;
  facultySectionTitle?: string;
  facultySectionSubtitle?: string;
  facultyName: string;
  facultyQualifications: string;
  facultyExperience: string;
  facultyBio: string;
  facultySubjects: string[];
  facultyPhotoUrl?: string;
  logoUrl?: string;
  heroBannerUrl?: string;
  contactSectionTitle?: string;
  contactSectionSubtitle?: string;
  contactPhone1: string;
  contactPhone2: string;
  contactEmail: string;
  whatsappNumber: string;
  address: string;
  googleMapsUrl?: string;
  googleMapsQrUrl?: string;
  footerText: string;
  socialYoutube?: string;
  socialFacebook?: string;
  socialInstagram?: string;
  socialTelegram?: string;
}

export interface Course {
  id: string;
  title: string;
  classes: string;
  subjects: string;
  badge?: string;
  description: string;
  icon: string;
  imageUrl?: string;
  features: string[];
  timing?: string;
  batchSize?: string;
  isPopular?: boolean;
}

export interface StudyMaterial {
  id: string;
  title: string;
  classLevel: ClassLevel;
  subject: Subject;
  type: MaterialType;
  description: string;
  fileUrl: string;
  fileName?: string;
  fileSize?: string;
  uploadDate: string;
  isPublished: boolean;
  downloadsCount?: number;
}

export interface QuestionPDF {
  id: string;
  title: string;
  classLevel: ClassLevel;
  subject: Subject;
  chapter: string;
  topic: string;
  difficulty: DifficultyLevel;
  examType: ExamType;
  description: string;
  fileUrl: string;
  fileName?: string;
  fileSize?: string;
  uploadDate: string;
  questionsCount?: number;
  tags?: string[];
  isPublished: boolean;
  downloadsCount?: number;
  sampleQuestions?: string[];
}

export interface DemoEnquiry {
  id: string;
  studentName: string;
  parentName: string;
  classLevel: ClassLevel;
  schoolName: string;
  phone: string;
  email: string;
  preferredSubject: Subject;
  preferredDate: string;
  message?: string;
  status: EnquiryStatus;
  createdAt: string;
}

export interface ContactEnquiry {
  id: string;
  name: string;
  phone: string;
  email: string;
  classLevel: string;
  subject: string;
  message: string;
  status: EnquiryStatus;
  createdAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  description: string;
  date: string;
  isImportant?: boolean;
  fileUrl?: string;
  isPublished: boolean;
}

export interface Achievement {
  id: string;
  studentName: string;
  classLevel: string;
  achievement: string;
  year: string;
  scoreOrRank: string;
  photoUrl?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'student';
  phone?: string;
  classLevel?: string;
  savedPdfs?: string[];
}

export interface AdminAuthStatus {
  isConfigured: boolean;
  adminEmail: string;
  demoModeAvailable?: boolean;
}

export interface DashboardStats {
  totalPdfs: number;
  totalStudyMaterials: number;
  totalDemoEnquiries: number;
  totalContactEnquiries: number;
  totalCourses: number;
  totalStudents: number;
}
