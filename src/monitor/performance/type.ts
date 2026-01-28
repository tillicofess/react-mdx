// performance/type.ts
export interface PerformanceMetrics {
  type: 'performance';
  subType: 'cls' | 'lcp' | 'fid' | 'fcp';
  value: number;
  url?: string;
  effectiveType: '4g' | '3g' | '2g' | 'slow-2g' | 'unknown',
}
