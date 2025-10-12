'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Conference, ConferenceFilters } from '@/types/conference';
import { ConferenceCard } from '@/components/ConferenceCard';
import { ConferenceFilters as Filters } from '@/components/ConferenceFilters';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/Button';

export default function Home() {
  const t = useTranslations();
  const [conferences, setConferences] = useState<Conference[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ConferenceFilters>({});
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      setCategories(data.categories || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  }, []);

  const fetchConferences = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12',
        ...(filters.searchTerm && { search: filters.searchTerm }),
        ...(filters.dateRange?.start && { dateStart: filters.dateRange.start }),
        ...(filters.dateRange?.end && { dateEnd: filters.dateRange.end }),
        ...(filters.categories?.length && { categories: filters.categories.join(',') }),
        ...(filters.priceRange?.min !== undefined && { priceMin: filters.priceRange.min.toString() }),
        ...(filters.priceRange?.max !== undefined && { priceMax: filters.priceRange.max.toString() }),
      });

      const response = await fetch(`/api/conferences?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch conferences');
      }

      const data = await response.json();
      setConferences(data.conferences);
      setTotalPages(data.pagination.totalPages);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => {
    fetchCategories();
    fetchConferences();
  }, [fetchCategories, fetchConferences]);

  const handleFilterChange = (newFilters: ConferenceFilters) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page when filters change
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {t('home.title')}
          </h1>
          <p className="text-xl text-blue-100">
            {t('home.subtitle')}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-80 flex-shrink-0">
            <div className="lg:hidden mb-4">
              <Button
                onClick={() => setShowFilters(!showFilters)}
                fullWidth
                variant="outline"
              >
                {showFilters ? t('home.hideFilters') : t('home.showFilters')}
              </Button>
            </div>
            <div className={`${showFilters ? 'block' : 'hidden'} lg:block`}>
              <Filters onFilterChange={handleFilterChange} categories={categories} />
            </div>
          </aside>

          {/* Conference Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <LoadingSpinner size="lg" />
              </div>
            ) : error ? (
              <div className="text-center py-20">
                <p className="text-red-600 text-lg">{error}</p>
                <Button onClick={fetchConferences} className="mt-4">
                  {t('common.tryAgain')}
                </Button>
              </div>
            ) : conferences.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-600 text-lg">{t('home.noResults')}</p>
                <Button onClick={() => handleFilterChange({})} className="mt-4" variant="outline">
                  {t('home.clearFilters')}
                </Button>
              </div>
            ) : (
              <>
                <div className="mb-4 flex justify-between items-center">
                  <p className="text-gray-600">
                    {t('home.showingCount', { count: conferences.length })}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {conferences.map((conference) => (
                    <ConferenceCard key={conference.id} conference={conference} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-8">
                    <Button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      variant="outline"
                    >
                      {t('common.previous')}
                    </Button>
                    <span className="text-gray-700 px-4">
                      {t('home.pageOf', { page, total: totalPages })}
                    </span>
                    <Button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      variant="outline"
                    >
                      {t('common.next')}
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
