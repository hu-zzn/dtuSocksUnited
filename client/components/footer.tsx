"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "./ui/button"
import { Mail, Linkedin, Phone, MapPin } from "lucide-react"

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
                  <MapPin className="w-5 h-5 text-primary" />
                  <span>Delhi, India</span>
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
            © 2025 infoSoc. All rights reserved.
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
