import { useState, useEffect } from 'react';
import { coachesService } from '@/services/coaches.service';
import type { Coach } from '@/types/coach';

export const useCoaches = () => {
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDocs, setTotalDocs] = useState(0);

  const limit = 10;

  const fetchCoaches = async (pageNumber: number) => {
    try {
      setLoading(true);
      const response = await coachesService.getPaginated(pageNumber, limit);
      // Depending on the exact wrapper, response could be { ok, data: { data, total, ... } }
      // In the provided response: response is { ok: true, data: { data: [...], total, page, limit, totalPages } }
      const payload = response.data || {};
      const { data, total, totalPages } = payload;
      
      setCoaches(data || []);
      setTotalDocs(total || 0);
      setTotalPages(totalPages || 1);
    } catch (error) {
      console.error('Error fetching coaches:', error);
    } finally {
      setLoading(false);
    }
  };

  const createCoach = async (data: any) => {
    try {
      setLoading(true);
      await coachesService.create(data);
      setPage(1); // Return to first page
      await fetchCoaches(1); // Refresh list
      return true;
    } catch (error) {
      console.error('Error creating coach:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateCoach = async (id: string, data: any) => {
    try {
      setLoading(true);
      await coachesService.update(id, data);
      await fetchCoaches(page);
      return true;
    } catch (error) {
      console.error('Error updating coach:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteCoach = async (id: string) => {
    try {
      setLoading(true);
      await coachesService.delete(id);
      await fetchCoaches(page);
      return true;
    } catch (error) {
      console.error('Error deleting coach:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoaches(page);
  }, [page]);

  return {
    coaches,
    loading,
    page,
    setPage,
    totalPages,
    totalDocs,
    limit,
    fetchCoaches,
    createCoach,
    updateCoach,
    deleteCoach
  };
};
