import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { ProductFilters as ProductFiltersType } from '../../types';

interface ProductFiltersProps {
  filters: ProductFiltersType;
  onFilterChange: (filters: ProductFiltersType) => void;
  isOpen: boolean;
  onClose: () => void;
  categories: { id: string; name: string }[];
  brands: { id: string; name: string }[];
}

export function ProductFilters({
  filters,
  onFilterChange,
  isOpen,
  onClose,
  categories,
  brands,
}: ProductFiltersProps) {
  const handleChange = (key: keyof ProductFiltersType, value: string | number | undefined) => {
    onFilterChange({ ...filters, [key]: value });
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                    <div className="px-4 py-6 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-lg font-medium text-gray-900">
                          Filters
                        </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="relative rounded-md bg-white text-gray-400 hover:text-gray-500"
                            onClick={onClose}
                          >
                            <span className="sr-only">Close panel</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="relative flex-1 px-4 sm:px-6">
                      <div className="space-y-6">
                        {/* Category Filter */}
                        <div>
                          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                            Category
                          </label>
                          <select
                            id="category"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            value={filters.categoryId || ''}
                            onChange={(e) => handleChange('categoryId', e.target.value || undefined)}
                          >
                            <option value="">All Categories</option>
                            {categories.map((category) => (
                              <option key={category.id} value={category.id}>
                                {category.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Brand Filter */}
                        <div>
                          <label htmlFor="brand" className="block text-sm font-medium text-gray-700">
                            Brand
                          </label>
                          <select
                            id="brand"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            value={filters.brandId || ''}
                            onChange={(e) => handleChange('brandId', e.target.value || undefined)}
                          >
                            <option value="">All Brands</option>
                            {brands.map((brand) => (
                              <option key={brand.id} value={brand.id}>
                                {brand.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Price Range */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Price Range</label>
                          <div className="mt-1 grid grid-cols-2 gap-4">
                            <div>
                              <label htmlFor="minPrice" className="sr-only">
                                Min Price
                              </label>
                              <input
                                type="number"
                                id="minPrice"
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                placeholder="Min"
                                value={filters.minPrice || ''}
                                onChange={(e) => handleChange('minPrice', e.target.value ? Number(e.target.value) : undefined)}
                              />
                            </div>
                            <div>
                              <label htmlFor="maxPrice" className="sr-only">
                                Max Price
                              </label>
                              <input
                                type="number"
                                id="maxPrice"
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                placeholder="Max"
                                value={filters.maxPrice || ''}
                                onChange={(e) => handleChange('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Minimum Rating */}
                        <div>
                          <label htmlFor="minRating" className="block text-sm font-medium text-gray-700">
                            Minimum Rating
                          </label>
                          <select
                            id="minRating"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            value={filters.minRating || ''}
                            onChange={(e) => handleChange('minRating', e.target.value ? Number(e.target.value) : undefined)}
                          >
                            <option value="">Any Rating</option>
                            <option value="4">4+ Stars</option>
                            <option value="3">3+ Stars</option>
                            <option value="2">2+ Stars</option>
                            <option value="1">1+ Stars</option>
                          </select>
                        </div>

                        {/* Search */}
                        <div>
                          <label htmlFor="search" className="block text-sm font-medium text-gray-700">
                            Search
                          </label>
                          <input
                            type="text"
                            id="search"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            placeholder="Search products..."
                            value={filters.search || ''}
                            onChange={(e) => handleChange('search', e.target.value || undefined)}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-shrink-0 justify-end px-4 py-4">
                      <button
                        type="button"
                        className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        onClick={onClose}
                      >
                        Apply Filters
                      </button>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
} 