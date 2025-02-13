"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  HomeIcon,
  KeyIcon,
  DocumentTextIcon,
  CursorArrowRaysIcon,
  CreditCardIcon,
  Cog6ToothIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);

  const menuItems = [
    { name: "Overview", href: "https://cursor.directory", icon: HomeIcon },
    { name: "API Keys", href: "/api-keys", icon: KeyIcon },
    {
      name: "Documentation",
      href: "https://cursor.directory",
      icon: DocumentTextIcon,
    },
    {
      name: "Cursor",
      href: "https://cursor.directory",
      icon: CursorArrowRaysIcon,
    },
    { name: "Billing", href: "https://cursor.directory", icon: CreditCardIcon },
    { name: "Settings", href: "https://cursor.directory", icon: Cog6ToothIcon },
  ];

  return (
    <>
      {/* Toggle Button - Fixed Position */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-[#1a1d26] text-white hover:bg-gray-700 transition-colors"
      >
        {isOpen ? (
          <XMarkIcon className="w-6 h-6" />
        ) : (
          <Bars3Icon className="w-6 h-6" />
        )}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } w-64 bg-[#1a1d26] transition-transform duration-300 ease-in-out z-40`}
      >
        <div className="h-full flex flex-col">
          {/* Logo Section */}
          <div className="p-6 border-b border-gray-800">
            <Link
              href="/"
              className="flex items-center justify-center hover:opacity-80 transition-opacity"
            >
              <span className="text-2xl font-serif text-white">AIBeast</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 mt-6">
            <ul className="space-y-1">
              {menuItems.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-6 py-3 text-sm font-medium ${
                      pathname === item.href
                        ? "text-white bg-gray-800"
                        : "text-gray-400 hover:text-white hover:bg-gray-800"
                    } transition-colors`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="transition-opacity duration-200">
                      {item.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-gray-800">
            <div className="flex items-center gap-3 px-4 py-2">
              <div className="w-8 h-8 rounded-full bg-gray-700" />
              <div>
                <div className="text-sm font-medium text-white">Your Name</div>
                <div className="text-xs text-gray-400">your@email.com</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
