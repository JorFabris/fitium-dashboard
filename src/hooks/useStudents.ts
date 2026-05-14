import { useState, useEffect } from 'react';
import api from '../api/axios';

export const useStudents = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDocs, setTotalDocs] = useState(0);

  const limit = 10;

  const fetchStudents = async (pageNumber: number) => {
    try {
      setLoading(true);
      const response = await api.get('/api/v1/students/paginate', {
        params: { page: pageNumber, limit }
      });
      
      const { docs, totalDocs: total, totalPages: pages } = response.data;
      setStudents(docs || []);
      setTotalDocs(total || 0);
      setTotalPages(pages || 1);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents(page);
  }, [page]);

  return {
    students,
    loading,
    page,
    setPage,
    totalPages,
    totalDocs,
    limit,
    fetchStudents
  };
};
