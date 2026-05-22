import { useState, useEffect } from 'react';
import { expensesService } from '@/services/expenses.service';

export const useExpenses = () => {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDocs, setTotalDocs] = useState(0);

  const limit = 10;

  const fetchExpenses = async (pageNumber: number) => {
    try {
      setLoading(true);
      const response = await expensesService.getPaginated(pageNumber, limit);
      const { data, total, totalPages: pages } = response || {};
      setExpenses(data || []);
      setTotalDocs(total || 0);
      setTotalPages(pages || 1);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  const createExpense = async (data: any) => {
    try {
      setLoading(true);
      await expensesService.create(data);
      await fetchExpenses(1);
      setPage(1);
      return true;
    } catch (error) {
      console.error('Error creating expense:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateExpense = async (id: string, data: any) => {
    try {
      setLoading(true);
      await expensesService.update(id, data);
      await fetchExpenses(page);
      return true;
    } catch (error) {
      console.error('Error updating expense:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteExpense = async (id: string) => {
    try {
      setLoading(true);
      await expensesService.delete(id);
      await fetchExpenses(page);
      return true;
    } catch (error) {
      console.error('Error deleting expense:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses(page);
  }, [page]);

  return {
    expenses,
    loading,
    page,
    setPage,
    totalPages,
    totalDocs,
    limit,
    fetchExpenses,
    createExpense,
    updateExpense,
    deleteExpense
  };
};
