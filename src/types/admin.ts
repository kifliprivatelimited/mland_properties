export type EnquiryStatus = 'new' | 'read' | 'replied' | 'archived';

export interface Enquiry {
  id: number | string;
  name: string;
  email: string;
  project_location: string;
  scope: string;
  status: EnquiryStatus;
  submitted_at: string;
  created_at?: string;
  notes?: string;
}

