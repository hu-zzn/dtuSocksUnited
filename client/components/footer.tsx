// client/components/footer.tsx
"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Mail, Linkedin, Phone, MapPin } from "lucide-react"

interface CouncilMember {
  id: string
  name: string
  designation: string
  image: string
  linkedinUrl: string
}

const councilMembers: CouncilMember[] = [
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

export function Footer() {
  const [showContactModal, setShowContactModal] = useState(false)
  const [showAboutModal, setShowAboutModal] = useState(false)

  return (
    <>
      <footer className="bg-background border-t border-border mt-20 text-foreground">
        <div className="container mx-auto px-4 py-12">
          {/* Top Footer */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-12">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold">Get In Touch</h3>
              <div className="space-y-4 text-muted-foreground">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-primary" />
                  <a href="mailto:infosoc.queries@gmail.com" className="hover:text-primary">
                    infosoc.queries@gmail.com
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-primary" />
                  <span>+91 XXX XXX XXXX</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span>Delhi Technological University</span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-2xl font-bold">Quick Links</h3>
              <div className="flex flex-col gap-3">
                <Button variant="outline" onClick={() => setShowContactModal(true)} className="justify-start">
                  Contact Us
                </Button>
                <Button variant="outline" onClick={() => setShowAboutModal(true)} className="justify-start">
                  About Us
                </Button>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-2xl font-bold">InfoSOC</h3>
              <p className="text-muted-foreground leading-relaxed">
                Connecting students with societies and building a vibrant campus community at DTU.
              </p>
            </div>
          </div>

          {/* Council Section */}
          <div className="border-t border-border pt-12">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Our Team</h2>

            {/* Desktop */}
            <div className="hidden md:grid md:grid-cols-3 gap-8 lg:gap-12 max-w-6xl mx-auto">
              {councilMembers.map((member) => (
                <div key={member.id} className="text-center group">
                  <div className="relative mb-4">
                    <div className="w-32 h-32 lg:w-40 lg:h-40 mx-auto rounded-full overflow-hidden border-4 border-border group-hover:border-primary transition-colors bg-white relative">
                      <img
                        src={member.image}
                        alt={member.name}
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

            {/* Mobile */}
            <div className="md:hidden grid grid-cols-2 gap-6 max-w-md mx-auto">
              {councilMembers.map((member) => (
                <div key={member.id} className="text-center group">
                  <div className="relative mb-3">
                    <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-2 border-border bg-white relative">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                      <a
                        href={member.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute -bottom-1 -right-1 bg-primary rounded-full p-1.5 shadow-lg"
                      >
                        <Linkedin className="w-3.5 h-3.5 text-white" />
                      </a>
                    </div>
                  </div>
                  <h4 className="text-base font-semibold">{member.name}</h4>
                  <p className="text-muted-foreground text-sm">{member.designation}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-border mt-12 pt-8 text-center text-muted-foreground text-sm">
            © 2024 InfoSOC. All rights reserved. | Delhi Technological University
          </div>
        </div>
      </footer>

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-background text-foreground rounded-lg p-6 max-w-md w-full border border-border">
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <div className="space-y-4 text-muted-foreground">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium">Email</p>
                  <a href="mailto:infosoc.queries@gmail.com" className="text-primary">
                    infosoc.queries@gmail.com
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium">Phone</p>
                  <p>+91 XXX XXX XXXX</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium">Address</p>
                  <p>Delhi Technological University</p>
                </div>
              </div>
            </div>
            <Button onClick={() => setShowContactModal(false)} className="w-full mt-6">
              Close
            </Button>
          </div>
        </div>
      )}

      {/* About Modal */}
      {showAboutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-background text-foreground rounded-lg p-6 max-w-lg w-full border border-border max-h-[80vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">About Us</h3>
            <div className="space-y-4 text-muted-foreground">
              <p>
                InfoSOC is the central platform connecting students with various societies and clubs at Delhi
                Technological University. Our mission is to foster a vibrant campus community where every student can
                find their passion and build meaningful connections.
              </p>
              <p>
                Whether you're interested in technical clubs, cultural societies, or sports teams, InfoSOC helps you
                discover and join the communities that align with your interests.
              </p>
              <p>
                Our platform is built by students, for students, ensuring that it meets the real needs of the DTU
                community.
              </p>
            </div>
            <Button onClick={() => setShowAboutModal(false)} className="w-full mt-6">
              Close
            </Button>
          </div>
        </div>
      )}
    </>
  )
}
