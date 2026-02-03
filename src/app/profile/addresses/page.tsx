"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore";
import { Badge } from "@/components/ui/badge";
import { MapPin, Plus, Trash2, Edit2 } from "lucide-react";

export default function AddressesPage() {
  const { user } = useAuthStore();

  return (
    <>
      <div>
        <h1 className="text-3xl font-bold font-serif text-[#1a1a1a] mb-2">
          Saved Addresses
        </h1>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-[#FF6B35]">
            Home
          </Link>
          <span>/</span>
          <Link href="/profile" className="hover:text-[#FF6B35]">
            Profile
          </Link>
          <span>/</span>
          <span className="text-gray-900">Addresses</span>
        </div>
      </div>

      <div className="grid gap-6">
        {user?.address ? (
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-orange-100/50 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-gray-400 hover:text-[#FF6B35]"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-gray-400 hover:text-red-500"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-full bg-orange-50 flex items-center justify-center text-[#FF6B35] shrink-0">
                <MapPin className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-900">Home Address</span>
                  <Badge
                    variant="secondary"
                    className="bg-orange-100 text-[#FF6B35] border-orange-200"
                  >
                    Default
                  </Badge>
                </div>
                <p className="text-gray-600">{user.address}</p>
                <p className="text-sm text-gray-400 mt-2">{user.phone}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-gray-200">
            <MapPin className="h-10 w-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 mb-4">No addresses saved yet</p>
          </div>
        )}

        <Button className="h-12 border-dashed border-gray-300 bg-transparent text-gray-500 hover:bg-gray-50 hover:text-[#FF6B35] shadow-none border-2 text-base font-medium rounded-2xl w-full">
          <Plus className="h-5 w-5 mr-2" />
          Add New Address
        </Button>
      </div>
    </>
  );
}
