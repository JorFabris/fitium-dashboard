import React, { useState } from 'react';
import {
  Search, Plus, Download, Eye, Edit2, Trash2, ChevronLeft, ChevronRight, Loader2
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useStudents } from '../hooks/useStudents';
import { formatDate, formatCurrency } from '@/utils/formatters';
import { STUDENTS_TEXTS, COMMON_TEXTS } from '@/constants/texts';
import { CreateStudentSidebar } from '@/components/CreateStudentSidebar';
import type { Student } from '@/types/student';
import { classesService } from '@/services/classes.service';

const Students: React.FC = () => {
  const {
    students,
    loading,
    page,
    setPage,
    totalPages,
    totalDocs,
    limit,
    createStudent,
    updateStudent,
    deleteStudent
  } = useStudents();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'view' | 'edit' | 'create'>('create');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStudents = students.filter(s => {
    const fullName = `${s.firstName || ''} ${s.lastName || ''}`.toLowerCase();
    const email = (s.email || '').toLowerCase();
    return fullName.includes(searchQuery.toLowerCase()) || email.includes(searchQuery.toLowerCase());
  });

  const handleOpenCreate = () => {
    setSelectedStudent(null);
    setViewMode('create');
    setIsSidebarOpen(true);
  };

  const handleOpenEdit = (student: Student) => {
    setSelectedStudent(student);
    setViewMode('edit');
    setIsSidebarOpen(true);
  };

  const handleOpenView = (student: Student) => {
    setSelectedStudent(student);
    setViewMode('view');
    setIsSidebarOpen(true);
  };

  const handleDeleteClick = async (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este estudiante? Esta acción no se puede deshacer.')) {
      const success = await deleteStudent(id);
      if (success) {
        toast.success('Estudiante eliminado correctamente');
      } else {
        toast.error('Hubo un error al eliminar al estudiante');
      }
    }
  };

  const handleSidebarSubmit = async (data: any, id?: string) => {
    const { selectedClasses, ...studentPayload } = data;
    
    let targetStudentId = id;
    
    if (id) {
      const success = await updateStudent(id, studentPayload);
      if (!success) {
        toast.error('Error al actualizar el estudiante');
        return;
      }
      toast.success('Estudiante actualizado correctamente');
    } else {
      const createdStudent = await createStudent(studentPayload);
      if (!createdStudent) {
        toast.error('Error al crear el estudiante');
        return;
      }
      targetStudentId = createdStudent._id;
      toast.success('Estudiante creado correctamente');
    }

    if (targetStudentId && selectedClasses) {
      try {
        // Sync class enrollments
        const response = await classesService.getPaginated(1, 100);
        const allClasses = response.data || [];
        
        for (const classObj of allClasses) {
          const currentBookings = classObj.bookings || [];
          const isCurrentlyEnrolled = currentBookings.some((b: any) => 
            typeof b === 'object' ? b._id === targetStudentId : b === targetStudentId
          );
          const shouldBeEnrolled = selectedClasses.includes(classObj._id);
          
          const bookingIds = currentBookings.map((b: any) => typeof b === 'object' ? b._id : b);

          if (shouldBeEnrolled && !isCurrentlyEnrolled) {
            // Enroll: Add student ID to bookings
            await classesService.update(classObj._id, {
              bookings: [...bookingIds, targetStudentId]
            });
          } else if (!shouldBeEnrolled && isCurrentlyEnrolled) {
            // Unenroll: Remove student ID from bookings
            await classesService.update(classObj._id, {
              bookings: bookingIds.filter((bid: string) => bid !== targetStudentId)
            });
          }
        }
      } catch (err) {
        console.error('Error synchronizing class bookings:', err);
        toast.error('Error al actualizar las inscripciones de clases');
      }
    }

    setIsSidebarOpen(false);
  };

  const getStatusBadge = (active: boolean) => {
    if (active) {
      return <span className="px-2.5 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full border border-green-100">{COMMON_TEXTS.STATUS_ACTIVE}</span>;
    }
    return <span className="px-2.5 py-1 bg-red-50 text-red-600 text-xs font-semibold rounded-full border border-red-100">{COMMON_TEXTS.STATUS_INACTIVE}</span>;
  };

  const getPaymentBadge = (lastPayment: any) => {
    if (!lastPayment || (!lastPayment.paidAt && !lastPayment.dueDate)) {
      return <span className="px-2.5 py-1 bg-gray-50 text-gray-600 text-xs font-semibold rounded-full border border-gray-200">{STUDENTS_TEXTS.BADGE_SIN_PAGO}</span>;
    }

    const paymentDate = new Date(lastPayment.paidAt || lastPayment.dueDate);

    if (isNaN(paymentDate.getTime())) {
      return <span className="px-2.5 py-1 bg-gray-50 text-gray-600 text-xs font-semibold rounded-full border border-gray-200">{STUDENTS_TEXTS.BADGE_SIN_PAGO}</span>;
    }

    const expirationDate = new Date(paymentDate);
    expirationDate.setMonth(expirationDate.getMonth() + 1);

    const today = new Date();
    const isExpired = today > expirationDate;

    if (isExpired) {
      return <span className="px-2.5 py-1 bg-red-50 text-red-600 text-[10px] font-bold rounded-full border border-red-100">{STUDENTS_TEXTS.BADGE_VENCIDA}</span>;
    }

    return <span className="px-2.5 py-1 bg-green-50 text-green-700 text-[10px] font-bold rounded-full border border-green-100">{STUDENTS_TEXTS.BADGE_EN_TERMINO}</span>;
  };

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-10">

      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{STUDENTS_TEXTS.TITLE}</h1>
          <p className="text-sm text-gray-500 mt-1">{STUDENTS_TEXTS.SUBTITLE}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar estudiante..."
              className="w-full md:w-64 pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm shrink-0">
            <Download className="w-4 h-4 text-gray-500 shrink-0" />
            <span>Exportar</span>
          </button>
          <button onClick={handleOpenCreate} className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm w-full sm:w-auto">
            <Plus className="w-4 h-4 shrink-0" />
            {STUDENTS_TEXTS.BUTTON_ADD}
          </button>
        </div>
      </div>
      {/* Table Section */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">

        {/* Table Data */}
        <div className="overflow-x-auto min-h-[300px]">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#F8F9FA] border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-900 text-xs">{STUDENTS_TEXTS.TABLE_COL_STUDENT}</th>
                <th className="px-6 py-4 font-semibold text-gray-900 text-xs">{STUDENTS_TEXTS.TABLE_COL_CONTACT}</th>
                <th className="px-6 py-4 font-semibold text-gray-900 text-xs">{STUDENTS_TEXTS.TABLE_COL_STATUS}</th>
                <th className="px-6 py-4 font-semibold text-gray-900 text-xs">{STUDENTS_TEXTS.TABLE_COL_NEXT_PAYMENT}</th>
                <th className="px-6 py-4 font-semibold text-gray-900 text-xs text-center">{STUDENTS_TEXTS.TABLE_COL_ACTIONS}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 relative">
              {loading ? (
                <tr>
                  <td colSpan={7} className="h-48 text-center">
                    <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
                  </td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="h-48 text-center text-gray-500">
                    {STUDENTS_TEXTS.TABLE_NO_STUDENTS}
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => {
                  const enrollDate = formatDate(student.enrollmentDate);




                  return (
                    <tr key={student._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">

                          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold shrink-0">
                            {student.firstName?.[0]}{student.lastName?.[0]}
                          </div>

                          <div>
                            <p className="font-bold text-gray-900">{student.firstName} {student.lastName}</p>
                            <p className="text-xs text-gray-500">{STUDENTS_TEXTS.LABEL_DESDE} {enrollDate}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-900">{student.email || STUDENTS_TEXTS.BADGE_SIN_EMAIL}</p>
                        <p className="text-xs text-gray-500">{student.phone || STUDENTS_TEXTS.BADGE_SIN_TELEFONO}</p>
                      </td>


                      <td className="px-6 py-4">
                        {getStatusBadge(student.active)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1 items-start">
                          {getPaymentBadge(student.lastPayment)}
                          {student.lastPayment && (
                            <p className="text-xs text-gray-500 mt-1">
                              {formatDate(student.lastPayment.paidAt || student.lastPayment.dueDate)} • {formatCurrency(student.lastPayment.amount)}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => handleOpenView(student)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleOpenEdit(student)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDeleteClick(student._id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0">
          <p className="text-xs text-gray-500 font-medium">
            {COMMON_TEXTS.PAGINATION_SHOWING} {filteredStudents.length > 0 ? (page - 1) * limit + 1 : 0} {COMMON_TEXTS.PAGINATION_TO} {Math.min(page * limit, totalDocs)} {COMMON_TEXTS.PAGINATION_OF} {totalDocs} estudiantes
          </p>
          <div className="flex items-center gap-1 w-full sm:w-auto justify-between sm:justify-start">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1 || loading}
              className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
            >
              <ChevronLeft className="w-3 h-3" />
              {COMMON_TEXTS.PAGINATION_PREV}
            </button>
            <div className="flex items-center gap-1 mx-2">
              <span className="text-sm font-semibold text-gray-700">{COMMON_TEXTS.PAGINATION_PAGE} {page} {COMMON_TEXTS.PAGINATION_OF} {totalPages}</span>
            </div>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || loading || totalPages === 0}
              className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
            >
              {COMMON_TEXTS.PAGINATION_NEXT}
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

      </div>

      <CreateStudentSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onSubmit={handleSidebarSubmit}
        studentData={selectedStudent}
        onlyView={viewMode === 'view'}
      />
    </div>
  );
};

export default Students;
