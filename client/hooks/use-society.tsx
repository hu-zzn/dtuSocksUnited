"use client";

import { useState } from "react";
import { societyApi } from "../lib/apis";
import type { Society } from "../types/index";

export function useSocieties() {
  const [societies, setSocieties] = useState<Society[]>([]);
  const [loading, setLoading] = useState(false);

  const getAllSocieties = async () => {
  setLoading(true);
    try {
      const res = await societyApi.getAll();
      setSocieties(res.data?.socs ?? []);
    } finally {
      setLoading(false);
    }
  };


  const addSociety = async (societyData: Partial<Society>) => {
    setLoading(true);
    try {
      await societyApi.add(societyData);
      await getAllSocieties(); // refresh after add
    } finally {
      setLoading(false);
    }
  };

  const updateSociety = async (id: string, societyData: Partial<Society>) => {
    setLoading(true);
    try {
      await societyApi.update(id, societyData);
      await getAllSocieties();
    } finally {
      setLoading(false);
    }
  };

  const deleteSociety = async (id: string) => {
    setLoading(true);
    try {
      await societyApi.delete(id);
      await getAllSocieties();
    } finally {
      setLoading(false);
    }
  };

  return { societies, loading, getAllSocieties, addSociety, updateSociety, deleteSociety };
}
