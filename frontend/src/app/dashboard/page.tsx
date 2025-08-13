// src/app/dashboard/page.tsx
'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import {
  HomeIcon,
  UserIcon,
  Cog6ToothIcon,
  ChartBarIcon,
  BellIcon,
  MagnifyingGlassIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const navigation = [
    { name: 'Dashboard', href: '#', icon: HomeIcon, current: true },
    { name: 'Analytics', href: '#', icon: ChartBarIcon, current: false },
    { name: 'Profile', href: '#', icon: UserIcon, current: false },
    { name: 'Settings', href: '#', icon: Cog6ToothIcon, current: false },
  ];

  const stats = [
    { name: 'Total Projects', value: '12', change: '+4.75%', changeType: 'positive' },
    { name: 'Active Tasks', value: '28', change: '+12.02%', changeType: 'positive' },
    { name: 'Completed', value: '156', change: '+3.14%', changeType: 'positive' },
    { name: 'Team Members', value: '8', change: '-2.4%', changeType: 'negative' },
  ];

  const recentActivity = [
    { id: 1, user: 'Sarah Wilson', action: 'completed task', target: 'Design Review', time: '2 hours ago' },
    { id: 2, user: 'Mike Johnson', action: 'created project', target: 'Mobile App Redesign', time: '4 hours ago' },
    { id: 3, user: 'Emily Chen', action: 'updated status', target: 'Backend API', time: '6 hours ago' },
    { id: 4, user: 'Alex Rodriguez', action: 'commented on', target: 'User Research', time: '8 hours ago' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      {/* Mobile sidebar */}
      <div className={`relative z-50 lg:hidden ${sidebarOpen ? '' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-900/80" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-0 flex">
          <div className="relative mr-16 flex w-full max-w-xs flex-1">
            <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
              <button
                type="button"
                className="-m-2.5 p-2.5"
                onClick={() => setSidebarOpen(false)}
              >
                <XMarkIcon className="h-6 w-6 text-white" />
              </button>
            </div>
            <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white/90 backdrop-blur-md px-6 pb-2 ring-1 ring-white/10">
              <div className="flex h-16 shrink-0 items-center">
                <div className="h-8 w-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">S</span>
                </div>
                <span className="ml-2 text-xl font-bold text-gray-900">SpaceMate</span>
              </div>
              <nav className="flex flex-1 flex-col">
                <ul className="flex flex-1 flex-col gap-y-7">
                  <li>
                    <ul className="-mx-2 space-y-1">
                      {navigation.map((item) => (
                        <li key={item.name}>
                          <a
                            href={item.href}
                            className={`group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold ${
                              item.current
                                ? 'bg-purple-50 text-purple-600'
                                : 'text-gray-700 hover:text-purple-600 hover:bg-purple-50'
                            }`}
                          >
                            <item.icon className="h-6 w-6 shrink-0" />
                            {item.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white/90 backdrop-blur-md px-6 ring-1 ring-white/10">
          <div className="flex h-16 shrink-0 items-center">
            <div className="h-8 w-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">S</span>
            </div>
            <span className="ml-2 text-xl font-bold text-gray-900">SpaceMate</span>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul className="-mx-2 space-y-1">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className={`group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors ${
                          item.current
                            ? 'bg-purple-50 text-purple-600'
                            : 'text-gray-700 hover:text-purple-600 hover:bg-purple-50'
                        }`}
                      >
                        <item.icon className="h-6 w-6 shrink-0" />
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-72">
        {/* Top navigation */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-white/20 bg-white/80 backdrop-blur-md px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>

          {/* Separator */}
          <div className="h-6 w-px bg-gray-200 lg:hidden" />

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <form className="relative flex flex-1" action="#" method="GET">
              <label htmlFor="search-field" className="sr-only">
                Search
              </label>
              <MagnifyingGlassIcon className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400" />
              <input
                id="search-field"
                className="block h-full w-full border-0 py-0 pl-8 pr-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm bg-transparent"
                placeholder="Search..."
                type="search"
                name="search"
              />
            </form>
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <button
                type="button"
                className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500"
              >
                <BellIcon className="h-6 w-6" />
              </button>

              {/* Profile dropdown */}
              <div className="relative">
                <button
                  type="button"
                  className="-m-1.5 flex items-center p-1.5"
                  onClick={handleLogout}
                >
                  <span className="sr-only">Open user menu</span>
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                    <span className="text-sm font-medium text-white">
                      {user?.firstName?.[0]}{user?.lastName?.[0]}
                    </span>
                  </div>
                  <span className="hidden lg:flex lg:items-center">
                    <span className="ml-4 text-sm font-semibold leading-6 text-gray-900">
                      {user?.firstName} {user?.lastName}
                    </span>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">
            {/* Welcome section */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user?.firstName}! 👋
              </h1>
              <p className="mt-2 text-gray-600">
                Here's what's happening with your projects today.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
              {stats.map((stat) => (
                <div
                  key={stat.name}
                  className="bg-white/80 backdrop-blur-sm overflow-hidden rounded-2xl shadow-sm ring-1 ring-white/20"
                >
                  <div className="p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="h-8 w-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            {stat.value.slice(0, 2)}
                          </span>
                        </div>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            {stat.name}
                          </dt>
                          <dd className="flex items-baseline">
                            <div className="text-2xl font-semibold text-gray-900">
                              {stat.value}
                            </div>
                            <div
                              className={`ml-2 flex items-baseline text-sm font-semibold ${
                                stat.changeType === 'positive'
                                  ? 'text-green-600'
                                  : 'text-red-600'
                              }`}
                            >
                              {stat.change}
                            </div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm ring-1 ring-white/20">
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Recent Activity
                  </h3>
                  <div className="flow-root">
                    <ul className="-mb-8">
                      {recentActivity.map((activity, activityIdx) => (
                        <li key={activity.id}>
                          <div className="relative pb-8">
                            {activityIdx !== recentActivity.length - 1 ? (
                              <span
                                className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200"
                                aria-hidden="true"
                              />
                            ) : null}
                            <div className="relative flex space-x-3">
                              <div>
                                <span className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center ring-8 ring-white">
                                  <span className="text-white text-xs font-medium">
                                    {activity.user.split(' ').map(n => n[0]).join('')}
                                  </span>
                                </span>
                              </div>
                              <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                                <div>
                                  <p className="text-sm text-gray-500">
                                    <span className="font-medium text-gray-900">
                                      {activity.user}
                                    </span>{' '}
                                    {activity.action}{' '}
                                    <span className="font-medium text-gray-900">
                                      {activity.target}
                                    </span>
                                  </p>
                                </div>
                                <div className="whitespace-nowrap text-right text-sm text-gray-500">
                                  {activity.time}
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm ring-1 ring-white/20">
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Quick Actions
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <button className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105">
                      <div className="text-left">
                        <div className="text-sm font-medium">New Project</div>
                        <div className="text-xs opacity-90">Start fresh</div>
                      </div>
                    </button>
                    <button className="p-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all transform hover:scale-105">
                      <div className="text-left">
                        <div className="text-sm font-medium">Add Task</div>
                        <div className="text-xs opacity-90">Stay organized</div>
                      </div>
                    </button>
                    <button className="p-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all transform hover:scale-105">
                      <div className="text-left">
                        <div className="text-sm font-medium">View Reports</div>
                        <div className="text-xs opacity-90">Track progress</div>
                      </div>
                    </button>
                    <button className="p-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 transition-all transform hover:scale-105">
                      <div className="text-left">
                        <div className="text-sm font-medium">Team Chat</div>
                        <div className="text-xs opacity-90">Collaborate</div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}