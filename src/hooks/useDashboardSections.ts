import { useState, useEffect } from 'react';
import { dashboardSectionsService } from '@/services/dashboard-sections.service';

export const useDashboardSections = () => {
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDocs, setTotalDocs] = useState(0);

  const limit = 10;

  const fetchSections = async (pageNumber: number) => {
    try {
      setLoading(true);
      const response = await dashboardSectionsService.getPaginated(pageNumber, limit);
      const { data, total, totalPages: pages } = response || {};
      setSections(data || []);
      setTotalDocs(total || 0);
      setTotalPages(pages || 1);
    } catch (error) {
      console.error('Error fetching sections:', error);
    } finally {
      setLoading(false);
    }
  };

  const createSection = async (data: any) => {
    try {
      setLoading(true);
      await dashboardSectionsService.create(data);
      await fetchSections(1);
      setPage(1);
      return true;
    } catch (error) {
      console.error('Error creating section:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateSection = async (id: string, data: any) => {
    try {
      setLoading(true);
      await dashboardSectionsService.update(id, data);
      await fetchSections(page);
      return true;
    } catch (error) {
      console.error('Error updating section:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteSection = async (id: string) => {
    try {
      setLoading(true);
      await dashboardSectionsService.delete(id);
      await fetchSections(page);
      return true;
    } catch (error) {
      console.error('Error deleting section:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSections(page);
  }, [page]);

  return {
    sections,
    loading,
    page,
    setPage,
    totalPages,
    totalDocs,
    limit,
    fetchSections,
    createSection,
    updateSection,
    deleteSection
  };
};
