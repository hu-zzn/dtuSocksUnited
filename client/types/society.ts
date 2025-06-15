export interface Society {
  _id: string
  socName: string
  socCategory: string[]
  socAbout: string
  socKeyEvents: {
    name: string
    description: string
  }[]
  socHighlights: string[]
  socContact: {
    team: {
      role: string
      name: string
    }[]
    email: string
    socSocials: {
      instagram: string
      linkedin: string
      linktree: string
    }
  }
  createdAt: string
  updatedAt: string
}
