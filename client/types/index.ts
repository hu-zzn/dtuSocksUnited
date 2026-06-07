// User Types

export interface User {
  _id: string;
  name: string;
  email: string;
  role: "Admin" | "User";
  accountVerified: boolean;
  avatar?: {
    public_id: string;
    url: string;
  };
  cart: string[];
  isSocAdmin?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}

export interface GenericResponse {
  success: boolean;
  message: string;
}

// Society Types

export interface SocKeyEvent {
  name: string;
  description: string;
}

export interface SocContact {
  team: {
    role: string;
    name: string;
  }[];
  email: string;
  socSocials: {
    instagram: string;
    linkedin: string;
    linktree: string;
  };
}

export interface Society {
  _id: string;
  socName: string;
  socCategory: string[];
  socAbout: string;
  socKeyEvents: SocKeyEvent[];
  socHighlights: string[];
  socKeyWord: string[];
  socContact: SocContact;
  socLogo?: string;
  socAdmin?: string | null;
  createdAt: string;
  updatedAt: string;
}

// Orientation Types

export interface Orientation {
  _id: string;
  socId: string;
  socName?: string;
  socLogo?: string;
  eventDate: string; // ISO date (YYYY-MM-DD)
  venue: string;
  time: string;
  isNew: boolean;
  createdAt: string | null;
  updatedAt: string | null;
}
