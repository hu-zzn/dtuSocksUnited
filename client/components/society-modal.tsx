"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Mail, Instagram, Linkedin, ExternalLink, Users, Calendar, Plus, Check } from "lucide-react";
import type { Society } from "../types/index";
import { useCart } from "../hooks/use-cart";
import { useAuth } from "../context/auth-context"

import { useState } from "react";

interface SocietyModalProps {
  society: Society | null;
  isOpen: boolean;
  onClose: () => void;
}

export function SocietyModal({ society, isOpen, onClose }: SocietyModalProps) {
  const { cart, toggleCart } = useCart();
  const { user } = useAuth();
  const isAuthenticated = !!user;
  const [isToggling, setIsToggling] = useState(false);

  if (!society) return null;

  const inCart = cart?.some((item) => item._id === society._id) ?? false;

  const handleToggleCart = async () => {
    if (!isAuthenticated) return;

    setIsToggling(true);
    try {
      await toggleCart(society._id); // ✅ Fix: pass ID instead of full object
    } catch (error) {
      console.error("Failed to toggle cart:", error);
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto border-gray-200 bg-white">
        <DialogHeader className="pb-6">
          <DialogTitle className="text-3xl font-light text-gray-900 leading-tight">{society.socName}</DialogTitle>
          <div className="flex flex-wrap gap-2 mt-4">
            {society.socCategory.map((category) => (
              <Badge key={category} variant="secondary" className="bg-gray-100 text-gray-700 border-0 rounded-full">
                {category}
              </Badge>
            ))}
          </div>
        </DialogHeader>

        <div className="space-y-8">
          <div>
            <h3 className="font-medium mb-3 text-gray-900">About</h3>
            <p className="text-gray-600 leading-relaxed">{society.socAbout}</p>
          </div>

          {society.socHighlights.length > 0 && (
            <div>
              <h3 className="font-medium mb-4 text-gray-900">Highlights</h3>
              <ul className="space-y-3">
                {society.socHighlights.map((highlight, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-gray-400 rounded-full mt-2.5 flex-shrink-0" />
                    <span className="text-gray-600 leading-relaxed">{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {society.socKeyEvents.length > 0 && (
            <div>
              <h3 className="font-medium mb-4 flex items-center gap-3 text-gray-900">
                <Calendar className="w-5 h-5" />
                Key Events
              </h3>
              <div className="space-y-4">
                {society.socKeyEvents.map((event, index) => (
                  <div key={index} className="border border-gray-200 rounded-xl p-5 hover:bg-gray-50 transition-colors">
                    <h4 className="font-medium text-gray-900 mb-2">{event.name}</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">{event.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="border-t border-gray-200 pt-8">
            <h3 className="font-medium mb-6 flex items-center gap-3 text-gray-900">
              <Users className="w-5 h-5" />
              Team & Contact
            </h3>

            {society.socContact.team.length > 0 && (
              <div className="mb-6">
                <h4 className="font-medium mb-4 text-gray-900">Council Members</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {society.socContact.team.map((member, index) => (
                    <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                      <span className="font-medium text-gray-900">{member.name}</span>
                      <Badge variant="outline" className="text-xs border-gray-300 text-gray-600 rounded-full">
                        {member.role}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-4">
              {society.socContact.email && society.socContact.email !== "_@." && (
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-500" />
                  <a
                    href={`mailto:${society.socContact.email}`}
                    className="text-gray-900 hover:text-black transition-colors"
                  >
                    {society.socContact.email}
                  </a>
                </div>
              )}

              <div className="flex gap-6">
                {society.socContact.socSocials.instagram && society.socContact.socSocials.instagram !== "_" && (
                  <a
                    href={society.socContact.socSocials.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
                  >
                    <Instagram className="w-4 h-4" />
                    Instagram
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}

                {society.socContact.socSocials.linkedin && society.socContact.socSocials.linkedin !== "_" && (
                  <a
                    href={society.socContact.socSocials.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
                  >
                    <Linkedin className="w-4 h-4" />
                    LinkedIn
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}

                {society.socContact.socSocials.linktree && society.socContact.socSocials.linktree !== "_" && (
                  <a
                    href={society.socContact.socSocials.linktree}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Linktree
                  </a>
                )}
              </div>
            </div>
          </div>

          {isAuthenticated && (
            <div className="flex gap-4 pt-6 border-t border-gray-200">
              <Button
                onClick={onClose}
                variant="outline"
                className="flex-1 border-gray-300 hover:bg-gray-50 rounded-full"
              >
                Close
              </Button>
              <Button
                onClick={handleToggleCart}
                disabled={isToggling}
                className={`flex-1 rounded-full ${
                  inCart ? "bg-black hover:bg-gray-800 text-white" : "bg-black hover:bg-gray-800 text-white"
                }`}
              >
                {isToggling ? (
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : inCart ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Remove from Cart
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Add to Cart
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
