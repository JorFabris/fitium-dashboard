import { useState, useEffect } from 'react';
import { classesService } from '@/services/classes.service';

export const useClasses = () => {
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDocs, setTotalDocs] = useState(0);

  const limit = 10;

  const fetchClasses = async (pageNumber: number) => {
    try {
      setLoading(true);
      const response = await classesService.getPaginated(pageNumber, limit);
      const { data, total, totalPages: pages } = response || {};
      setClasses(data || []);
      setTotalDocs(total || 0);
      setTotalPages(pages || 1);
    } catch (error) {
      console.error('Error fetching classes:', error);
    } finally {
      setLoading(false);
    }
  };

  const createClass = async (data: any) => {
    try {
      setLoading(true);
      await classesService.create(data);
      await fetchClasses(1);
      setPage(1);
      return true;
    } catch (error) {
      console.error('Error creating class:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateClass = async (id: string, data: any) => {
    try {
      setLoading(true);
      await classesService.update(id, data);
      await fetchClasses(page);
      return true;
    } catch (error) {
      console.error('Error updating class:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses(page);
  }, [page]);

  return {
    classes,
    loading,
    page,
    setPage,
    totalPages,
    totalDocs,
    limit,
    fetchClasses,
    createClass,
    updateClass
  };
};
