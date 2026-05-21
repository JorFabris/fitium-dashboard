import { useState, useEffect } from 'react';
import { routinesService } from '@/services/routines.service';

export const useRoutines = () => {
  const [routines, setRoutines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDocs, setTotalDocs] = useState(0);

  const limit = 10;

  const fetchRoutines = async (pageNumber: number) => {
    try {
      setLoading(true);
      const response = await routinesService.getPaginated(pageNumber, limit);
      // response should be { data: Routine[], total, page, limit, totalPages }
      const { data, total, totalPages: pages } = response || {};
      setRoutines(data || []);
      setTotalDocs(total || 0);
      setTotalPages(pages || 1);
    } catch (error) {
      console.error('Error fetching routines:', error);
    } finally {
      setLoading(false);
    }
  };

  const createRoutine = async (data: any) => {
    try {
      setLoading(true);
      await routinesService.create(data);
      await fetchRoutines(1);
      setPage(1);
      return true;
    } catch (error) {
      console.error('Error creating routine:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateRoutine = async (id: string, data: any) => {
    try {
      setLoading(true);
      await routinesService.update(id, data);
      await fetchRoutines(page);
      return true;
    } catch (error) {
      console.error('Error updating routine:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteRoutine = async (id: string) => {
    try {
      setLoading(true);
      await routinesService.delete(id);
      await fetchRoutines(page);
      return true;
    } catch (error) {
      console.error('Error deleting routine:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoutines(page);
  }, [page]);

  return {
    routines,
    loading,
    page,
    setPage,
    totalPages,
    totalDocs,
    limit,
    fetchRoutines,
    createRoutine,
    updateRoutine,
    deleteRoutine
  };
};
