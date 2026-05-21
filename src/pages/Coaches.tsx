import React, { useState } from 'react';
import {
  Search, Plus, Download, Eye, Edit2, MoreVertical, ChevronLeft, ChevronRight, Loader2
} from 'lucide-react';
import { useCoaches } from '@/hooks/useCoaches';
import { formatDate } from '@/utils/formatters';
import { CreateCoachSidebar } from '@/components/CreateCoachSidebar';
import { COACHES_TEXTS, COMMON_TEXTS } from '@/constants/texts';
import type { Coach } from '@/types/coach';

const Coaches: React.FC = () => {
  const {
    coaches,
    loading,
    page,
    setPage,
    totalPages,
    totalDocs,
    limit,
    createCoach,
    updateCoach
  } = useCoaches();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null);
  const [viewMode, setViewMode] = useState<'create' | 'edit' | 'view'>('create');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCoaches = coaches.filter(c => {
    const fullName = `${c.firstName || ''} ${c.lastName || ''}`.toLowerCase();
    const email = (c.email || '').toLowerCase();
    return fullName.includes(searchQuery.toLowerCase()) || email.includes(searchQuery.toLowerCase());
  });

  const handleOpenCreate = () => {
    setSelectedCoach(null);
    setViewMode('create');
    setIsSidebarOpen(true);
  };

  const handleOpenEdit = (coach: Coach) => {
    setSelectedCoach(coach);
    setViewMode('edit');
    setIsSidebarOpen(true);
  };

  const handleOpenView = (coach: Coach) => {
    setSelectedCoach(coach);
    setViewMode('view');
    setIsSidebarOpen(true);
  };

  const handleSidebarSubmit = async (data: any, id?: string) => {
    if (id) {
      await updateCoach(id, data);
    } else {
      await createCoach(data);
    }
  };

  const getStatusBadge = (active: boolean) => {
    if (active) {
      return <span className="px-2.5 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full border border-green-100">{COMMON_TEXTS.STATUS_ACTIVE}</span>;
    }
    return <span className="px-2.5 py-1 bg-red-50 text-red-600 text-xs font-semibold rounded-full border border-red-100">{COMMON_TEXTS.STATUS_INACTIVE}</span>;
  };

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-10">

      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{COACHES_TEXTS.TITLE}</h1>
          <p className="text-sm text-gray-500 mt-1">{COACHES_TEXTS.SUBTITLE}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={COACHES_TEXTS.SEARCH_COACH}
              className="w-full md:w-64 pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm shrink-0">
            <Download className="w-4 h-4 text-gray-500 shrink-0" />
            <span>Exportar</span>
          </button>
          <button onClick={handleOpenCreate} className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm w-full sm:w-auto">
            <Plus className="w-4 h-4 shrink-0" />
            {COACHES_TEXTS.BUTTON_ADD}
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="border-b border-gray-100 bg-white">
                <th className="px-6 py-4 font-semibold text-gray-900 text-xs">{COACHES_TEXTS.TABLE_COL_COACH}</th>
                <th className="px-6 py-4 font-semibold text-gray-900 text-xs">{COACHES_TEXTS.TABLE_COL_EMAIL}</th>
                <th className="px-6 py-4 font-semibold text-gray-900 text-xs">{COACHES_TEXTS.TABLE_COL_STATUS}</th>
                <th className="px-6 py-4 font-semibold text-gray-900 text-xs">{COACHES_TEXTS.TABLE_COL_CREATED_AT}</th>
                <th className="px-6 py-4 font-semibold text-gray-900 text-xs text-center">{COACHES_TEXTS.TABLE_COL_ACTIONS}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 relative">
              {loading ? (
                <tr>
                  <td colSpan={6} className="h-48 text-center">
                    <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
                  </td>
                </tr>
              ) : filteredCoaches.length === 0 ? (
                <tr>
                  <td colSpan={6} className="h-48 text-center text-gray-500">
                    {COACHES_TEXTS.TABLE_NO_COACHES}
                  </td>
                </tr>
              ) : (
                filteredCoaches.map((coach) => {
                  const creationDate = formatDate(coach.createdAt);

                  return (
                    <tr key={coach._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold shrink-0">
                            {coach.firstName?.[0]}{coach.lastName?.[0]}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">{coach.firstName} {coach.lastName}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-900">{coach.email}</p>
                      </td>

                      <td className="px-6 py-4">
                        {getStatusBadge(coach.active)}
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-900">{creationDate}</p>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => handleOpenView(coach)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleOpenEdit(coach)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors border border-transparent hover:border-gray-200">
                            <MoreVertical className="w-4 h-4" />
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
            {COMMON_TEXTS.PAGINATION_SHOWING} {filteredCoaches.length > 0 ? (page - 1) * limit + 1 : 0} {COMMON_TEXTS.PAGINATION_TO} {Math.min(page * limit, totalDocs)} {COMMON_TEXTS.PAGINATION_OF} {totalDocs} coaches
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

      <CreateCoachSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onSubmit={handleSidebarSubmit}
        coachData={selectedCoach}
        onlyView={viewMode === 'view'}
      />

    </div>
  );
};

export default Coaches;
