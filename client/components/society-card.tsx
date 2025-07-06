"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { Heart, Users, Calendar, Plus, Check } from "lucide-react"
import type { Society } from "../types/index"
import { useAuth } from "../context/auth-context"


interface SocietyCardProps {
  society: Society
  onViewDetails?: () => void
  onToggle?: () => void
  isInCart?: boolean
}

export function SocietyCard({
  society,
  onViewDetails,
  onToggle,
  isInCart = false,
}: SocietyCardProps) {
  const { user } = useAuth()
  const isAuthenticated = !!user

  const [isToggling, setIsToggling] = useState(false)

  const handleToggleCart = async () => {
    if (!isAuthenticated || !onToggle) return

    setIsToggling(true)
    try {
      await onToggle()
    } catch (error) {
      console.error("Failed to toggle cart:", error)
    } finally {
      setIsToggling(false)
    }
  }

  return (
    <Card className="h-full flex flex-col hover:shadow-2xl transition-all duration-300 border-gray-100 bg-white group hover:-translate-y-1">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-medium line-clamp-2 text-gray-900 group-hover:text-black transition-colors">
            {society.socName}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Heart className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {society.socCategory.slice(0, 2).map((category) => (
            <Badge
              key={category}
              variant="secondary"
              className="text-xs bg-gray-100 text-gray-700 hover:bg-gray-200 border-0 rounded-full"
            >
              {category}
            </Badge>
          ))}
          {society.socCategory.length > 2 && (
            <Badge variant="outline" className="text-xs border-gray-300 text-gray-600 rounded-full">
              +{society.socCategory.length - 2}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 pb-4">
        <p className="text-gray-600 text-sm line-clamp-3 mb-6 leading-relaxed">{society.socAbout}</p>

        {society.socHighlights?.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-gray-900">Highlights</h4>
            <ul className="text-xs text-gray-600 space-y-2">
              {society.socHighlights.slice(0, 2).map((highlight, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0" />
                  <span className="leading-relaxed">{highlight}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex items-center gap-6 mt-6 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <Users className="w-3.5 h-3.5" />
            <span>{society.socContact?.team?.length ?? 0} members</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5" />
            <span>{society.socKeyEvents?.length ?? 0} events</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex gap-3 pt-0">
        <Button
          variant="outline"
          onClick={onViewDetails}
          className="flex-1 border-gray-300 hover:bg-gray-50 rounded-full font-light"
        >
          View Details
        </Button>

        {isAuthenticated && (
          <Button
            onClick={handleToggleCart}
            disabled={isToggling}
            variant={isInCart ? "default" : "outline"}
            className={`flex-1 rounded-full font-light ${
              isInCart ? "bg-black hover:bg-gray-800 text-white" : "border-gray-300 hover:bg-gray-50"
            }`}
          >
            {isToggling ? (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : isInCart ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Added
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Add to Cart
              </>
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
