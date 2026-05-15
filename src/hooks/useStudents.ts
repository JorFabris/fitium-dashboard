import { useState, useEffect } from 'react';
import { studentsService } from '@/services/students.service';
import type { Student } from '@/types/student';

export const useStudents = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDocs, setTotalDocs] = useState(0);

  const limit = 10;

  const fetchStudents = async (pageNumber: number) => {
    try {
      setLoading(true);
      const response = await studentsService.getPaginated(pageNumber, limit);



      const { data, total, totalPages } = response;
      setStudents(data || []);
      setTotalDocs(total || 0);
      setTotalPages(totalPages || 1);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const createStudent = async (data: any) => {
    try {
      setLoading(true);
      await studentsService.create(data);
      await fetchStudents(1);
      setPage(1);
      return true;
    } catch (error) {
      console.error('Error creating student:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateStudent = async (id: string, data: any) => {
    try {
      setLoading(true);
      await studentsService.update(id, data);
      await fetchStudents(page);
      return true;
    } catch (error) {
      console.error('Error updating student:', error);
      return false;
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
    fetchStudents,
    createStudent,
    updateStudent
  };
};
