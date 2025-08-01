"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "./ui/button"
// Corrected imports: Added MessageCircle back (if you want to keep it somewhere else)
// Removed Youtube as it's not used for the social links in your provided image.
import { Mail, Linkedin, Phone, MapPin, Instagram } from "lucide-react"
import { FaWhatsapp } from "react-icons/fa" // Import FaWhatsapp for the correct logo

export function Footer() {
  const [showContactModal, setShowContactModal] = useState(false)

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
                  {/* Using FaWhatsapp for the correct WhatsApp logo */}
                  <FaWhatsapp className="w-5 h-5 text-primary" />
                  <a href="https://chat.whatsapp.com/HBttAYRJsFlAOdJ8RcDFR7?mode=ac_t" target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                    Join our WhatsApp Community
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Instagram className="w-5 h-5 text-primary" />
                  <a href="https://www.instagram.com/infosoc.dtu/" target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                    Follow us on Instagram
                  </a>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-2xl font-bold">Quick Links</h3>
              <div className="flex flex-col gap-3">
                <Link href="/about">
                  <Button variant="outline" className="justify-start w-full">
                    About Us
                  </Button>
                </Link>
                {/* Add other quick links here if needed, e.g., to clubs, events, etc. */}
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-2xl font-bold">infoSoc</h3>
              <p className="text-muted-foreground leading-relaxed">
                Connecting students with societies and building a vibrant campus community at DTU.
              </p>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-border mt-12 pt-8 text-center text-muted-foreground text-sm">
            © 2025 infoSoc. All rights reserved
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
              {/* If you want a phone number in the modal, uncomment this */}
              {/* <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium">Phone</p>
                  <a href="tel:+919876543210" className="text-primary">
                    +91 98765 43210
                  </a>
                </div>
              </div> */}
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
    </>
  )
}