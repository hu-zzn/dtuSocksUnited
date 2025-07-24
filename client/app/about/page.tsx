"use client"

import { Linkedin } from "lucide-react"
import Image from "next/image"

const coreMembers = [
  {
    id: "1",
    name: "Rishabh M. Sinha",
    designation: "President",
    image: "/council/rishabh.jpg",
    linkedinUrl: "https://www.linkedin.com/in/rishabh-mohan-sinha/",
  },
  {
    id: "2",
    name: "Ritvik M. Sinha",
    designation: "Vice-President",
    image: "/council/ritvik.jpg",
    linkedinUrl: "https://www.linkedin.com/in/ritvik-mohan-sinha/",
  },
  {
    id: "3",
    name: "Hussain A. Zaidi",
    designation: "General Secretary",
    image: "/council/hussain.jpg",
    linkedinUrl: "https://www.linkedin.com/in/hussain-zaidi-742758264/",
  },
  {
    id: "4",
    name: "Ashish",
    designation: "Treasurer",
    image: "/council/ashish.jpg",
    linkedinUrl: "https://www.linkedin.com/in/ashish-861072325/",
  },
  {
    id: "5",
    name: "Abhinav Jha",
    designation: "Jt. Secretary",
    image: "/council/abhinav.jpg",
    linkedinUrl: "https://www.linkedin.com/in/abhinav-jha-9380a823a/",
  },
  {
    id: "6",
    name: "Hitesh Mehta",
    designation: "Jt. Secretary",
    image: "/council/hitesh.jpg",
    linkedinUrl: "https://www.linkedin.com/in/hiteshmehta02/",
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground py-16 px-4 sm:px-8 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center">About infoSoc</h1>

      <div className="text-muted-foreground text-lg max-w-3xl mx-auto text-center mb-12">
        <p className="mb-4">
          infoSoc is the central platform connecting students with all the societies and clubs at Delhi Technological University.
        </p>
        <p className="mb-4">
          Our goal is to build a vibrant, inclusive, and collaborative campus environment where students can explore interests,
          build skills, and make meaningful connections.
        </p>
        <p>
          Whether you're into tech, culture, art, debate, music, or sports — there's a place for you at infoSoc.
        </p>
      </div>

      {/* Instagram Section */}
      <div className="text-center mb-16">
        <p className="text-lg font-medium mb-2">Follow us on Instagram</p>
        <a
          href="https://www.instagram.com/infosoc.dtu"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-primary font-semibold underline"
        >
          @infosoc.dtu
        </a>
      </div>

      {/* Core Team */}
      <h2 className="text-3xl font-bold text-center mb-8">Our Core Team</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 justify-items-center">
        {coreMembers.map((member) => (
          <div key={member.id} className="text-center group">
            <div className="relative mb-4">
              <div className="w-32 h-32 sm:w-36 sm:h-36 mx-auto rounded-full overflow-hidden border-4 border-border group-hover:border-primary transition-colors bg-white relative">
                <Image
                  src={member.image}
                  alt={member.name}
                  width={144}
                  height={144}
                  className="w-full h-full object-cover"
                />
                <a
                  href={member.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-50 rounded-full transition-all duration-300"
                >
                  <Linkedin className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </div>
            </div>
            <h4 className="text-lg font-semibold">{member.name}</h4>
            <p className="text-muted-foreground text-sm">{member.designation}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
