import React, { Fragment } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon, UserCircleIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Products', href: '/products' },
  { name: 'Brands', href: '/brands' },
];

const Navbar: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <Disclosure as="nav" className="sticky top-0 z-40 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-slate-200">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between">
              <div className="flex">
                <div className="flex flex-shrink-0 items-center">
                  <Link to="/" className="text-xl font-extrabold tracking-tight text-slate-900">
                    RateMate
                  </Link>
                </div>
                <div className="hidden sm:ml-8 sm:flex sm:space-x-1">
                  {navigation.map((item) => (
                    <NavLink
                      key={item.name}
                      to={item.href}
                      className={({ isActive }) =>
                        `inline-flex items-center px-3 pt-1 pb-2 text-sm font-medium rounded-md transition-colors ${
                          isActive
                            ? 'text-slate-900 bg-slate-100'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                        }`
                      }
                    >
                      {item.name}
                    </NavLink>
                  ))}
                </div>
              </div>

              <div className="hidden sm:ml-6 sm:flex sm:items-center gap-3">
                {isAuthenticated ? (
                  <Menu as="div" className="relative">
                    <div>
                      <Menu.Button className="flex rounded-full bg-white/70 p-1 text-sm ring-1 ring-slate-200 hover:ring-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                        <span className="sr-only">Open user menu</span>
                        <UserCircleIcon className="h-8 w-8 text-slate-400" />
                      </Menu.Button>
                    </div>

                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-200"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-xl bg-white py-1 shadow-lg ring-1 ring-slate-200 focus:outline-none">
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to="/profile"
                              className={`${active ? 'bg-slate-50' : ''} block px-4 py-2 text-sm text-slate-700`}
                            >
                              Your Profile
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={logout}
                              className={`${active ? 'bg-slate-50' : ''} block w-full px-4 py-2 text-left text-sm text-slate-700`}
                            >
                              Sign out
                            </button>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                ) : (
                  <>
                    <div className="space-x-2">
                      <Link
                        to="/login"
                        className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm"
                      >
                        Sign in
                      </Link>
                      <Link
                        to="/register"
                        className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md text-slate-700 bg-white ring-1 ring-slate-200 hover:bg-slate-50"
                      >
                        Sign up
                      </Link>
                    </div>

                    <Menu as="div" className="relative">
                      <div>
                        <Menu.Button className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-orange-700 bg-orange-50 ring-1 ring-orange-200 hover:bg-orange-100">
                          <BuildingOfficeIcon className="h-4 w-4 mr-1" />
                          For Brands
                        </Menu.Button>
                      </div>

                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-xl bg-white py-1 shadow-lg ring-1 ring-slate-200 focus:outline-none">
                          <Menu.Item>
                            {({ active }) => (
                              <Link
                                to="/brand/login"
                                className={`${active ? 'bg-slate-50' : ''} block px-4 py-2 text-sm text-slate-700`}
                              >
                                Brand Login
                              </Link>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <Link
                                to="/brand/register"
                                className={`${active ? 'bg-slate-50' : ''} block px-4 py-2 text-sm text-slate-700`}
                              >
                                Register Brand
                              </Link>
                            )}
                          </Menu.Item>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </>
                )}
              </div>

              <div className="-mr-2 flex items-center sm:hidden">
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 pb-3 pt-2">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    `block rounded-md py-2 pl-3 pr-4 text-base font-medium ${
                      isActive ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              ))}
            </div>
            {!isAuthenticated && (
              <div className="border-t border-slate-200 pb-3 pt-4">
                <div className="space-y-1">
                  <Link
                    to="/login"
                    className="block rounded-md px-4 py-2 text-base font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/register"
                    className="block rounded-md px-4 py-2 text-base font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  >
                    Sign up
                  </Link>
                  <div className="border-t border-slate-200 mt-2 pt-2">
                    <p className="px-4 py-1 text-xs font-medium text-slate-400 uppercase tracking-wide">For Brands</p>
                    <Link
                      to="/brand/login"
                      className="block rounded-md px-4 py-2 text-base font-medium text-orange-700 hover:bg-orange-50 hover:text-orange-800"
                    >
                      Brand Login
                    </Link>
                    <Link
                      to="/brand/register"
                      className="block rounded-md px-4 py-2 text-base font-medium text-orange-700 hover:bg-orange-50 hover:text-orange-800"
                    >
                      Register Brand
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default Navbar; 