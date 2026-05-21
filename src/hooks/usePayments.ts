import { useState, useEffect } from 'react';
import { paymentsService } from '@/services/payments.service';

export const usePayments = () => {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDocs, setTotalDocs] = useState(0);

  const limit = 10;

  const fetchPayments = async (pageNumber: number) => {
    try {
      setLoading(true);
      const response = await paymentsService.getPaginated(pageNumber, limit);
      const { data, total, totalPages: pages } = response || {};
      setPayments(data || []);
      setTotalDocs(total || 0);
      setTotalPages(pages || 1);
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const createPayment = async (data: any) => {
    try {
      setLoading(true);
      await paymentsService.create(data);
      await fetchPayments(1);
      setPage(1);
      return true;
    } catch (error) {
      console.error('Error creating payment:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updatePayment = async (id: string, data: any) => {
    try {
      setLoading(true);
      await paymentsService.update(id, data);
      await fetchPayments(page);
      return true;
    } catch (error) {
      console.error('Error updating payment:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deletePayment = async (id: string) => {
    try {
      setLoading(true);
      await paymentsService.delete(id);
      await fetchPayments(page);
      return true;
    } catch (error) {
      console.error('Error deleting payment:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments(page);
  }, [page]);

  return {
    payments,
    loading,
    page,
    setPage,
    totalPages,
    totalDocs,
    limit,
    fetchPayments,
    createPayment,
    updatePayment,
    deletePayment
  };
};
