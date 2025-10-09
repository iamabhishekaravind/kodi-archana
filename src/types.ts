export interface Devotee {
  id: string;
  name: string;
  nakshatra: string;
  date: string;
}

export interface ContactInfo {
  mobile: string;
  email: string;
}

export interface BookingData {
  devotees: Devotee[];
  contact: ContactInfo;
  paymentId?: string;
  bookingReference?: string;
}
