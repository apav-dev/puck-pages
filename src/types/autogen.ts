export interface Address {
  line1?: string;
  line2?: string;
  line3?: string;
  sublocality?: string;
  city?: string;
  region?: string;
  postalCode?: string;
  extraDescription?: string;
  countryCode?: string;
}

export interface Interval {
  start: any;
  end: any;
}

export interface DayHour {
  openIntervals?: Interval[];
  isClosed?: boolean;
}

export interface HolidayHours {
  date: string;
  openIntervals?: Interval[];
  isClosed?: boolean;
  isRegularHours?: boolean;
}

export interface Hours {
  monday?: DayHour;
  tuesday?: DayHour;
  wednesday?: DayHour;
  thursday?: DayHour;
  friday?: DayHour;
  saturday?: DayHour;
  sunday?: DayHour;
  holidayHours?: HolidayHours[];
  reopenDate?: string;
}

export interface Coordinate {
  latitude?: number;
  longitude?: number;
}

export interface ImageThumbnail {
  url: string;
  width: number;
  height: number;
}

export interface Image {
  url: string;
  width: number;
  height: number;
  thumbnails?: ImageThumbnail[];
  alternateText?: string;
}

export interface ComplexImage {
  image: Image;
  details?: string;
  description?: string;
  clickthroughUrl?: string;
}

export interface C_linkedTemplate {
  id: string;
  c_template?: any;
}

export interface Locations {
  id: string;
  additionalHoursText: string;
  address: Address;
  description: string;
  hours: Hours;
  name: string;
  cityCoordinate: Coordinate;
  photoGallery: ComplexImage[];
  geocodedCoordinate: Coordinate;
  mainPhone: any;
  emails: string[];
  slug: string;
  c_linkedTemplate: C_linkedTemplate[];
}
