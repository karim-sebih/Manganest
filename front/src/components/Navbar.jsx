import React from "react";
import { Link } from "react-router";
import { Search,Menu,Sun,Bell,User } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="bg-[#1E293B] text-white">
  <div className="max-w-7xl mx-auto px-12">
    <div className="flex h-16 items-center justify-between">
      
      <Link to="/">
        <img src="../assets/Manganest-removebg-preview.png" alt="Manganest" className="h-10" />
      </Link>

      <div className="flex-1 max-w-md mx-8">
        <div className="flex items-center justify-between h-9 bg-[#403B3B] rounded-md px-4 text-[#94A3B8]">
          <div className="flex items-center gap-2">
            <Search size={24} />
            <span className="text-sm">Search</span>
          </div>
          <div className="bg-[#1E293B] px-3 py-1 text-xs rounded-sm">Filter</div>
        </div>
      </div>

      <div className="flex gap-3">
        <Menu/>
        <Sun />
        <Bell />
        <User />
      </div>
    </div>
  </div>
</nav>
  );
}
