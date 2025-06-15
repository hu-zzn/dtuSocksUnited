"use client"

import { useState, useEffect } from "react"
import { SocietyCard } from "@/components/society-card"
import { SocietyModal } from "@/components/society-modal"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"
import type { Society } from "@/types/society"
import { societyApi } from "@/lib/api"

export function SocietyGrid() {
  const [societies, setSocieties] = useState<Society[]>([])
  const [filteredSocieties, setFilteredSocieties] = useState<Society[]>([])
  const [selectedSociety, setSelectedSociety] = useState<Society | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSocieties()
  }, [])

  useEffect(() => {
    filterSocieties()
  }, [societies, searchTerm, categoryFilter])

  const fetchSocieties = async () => {
    try {
      const data = await societyApi.getAll()
      setSocieties(data)
    } catch (error) {
      console.error("Failed to fetch societies:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterSocieties = () => {
    let filtered = societies

    if (searchTerm) {
      filtered = filtered.filter(
        (society) =>
          society.socName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          society.socAbout.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter((society) => society.socCategory.includes(categoryFilter))
    }

    setFilteredSocieties(filtered)
  }

  const categories = Array.from(new Set(societies.flatMap((society) => society.socCategory)))

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-64 bg-gray-200 animate-pulse rounded-lg" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6 mb-12">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="Search societies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 h-12 border-gray-200 rounded-full bg-white focus:border-gray-400 text-gray-900"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full md:w-64 h-12 border-gray-200 rounded-full bg-white focus:border-gray-400">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent className="border-gray-200">
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredSocieties.map((society) => (
          <SocietyCard key={society._id} society={society} onViewDetails={() => setSelectedSociety(society)} />
        ))}
      </div>

      {filteredSocieties.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-500 text-xl font-light">No societies found matching your criteria.</p>
        </div>
      )}

      <SocietyModal society={selectedSociety} isOpen={!!selectedSociety} onClose={() => setSelectedSociety(null)} />
    </div>
  )
}
