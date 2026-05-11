"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { getPopupBanners } from "../lib/api";

export default function HomePopup() {
  const [popupData, setPopupData] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    // Slight delay so the UI loads first before popping up
    const timer = setTimeout(() => {
      const fetchPopup = async () => {
        try {
          const lastShown = localStorage.getItem("popup_last_shown");
          const now = Date.now();
          // 5 minutes in milliseconds
          const FIVE_MINUTES = 5 * 60 * 1000;

          // If not shown recently, fetch and show
          if (!lastShown || now - parseInt(lastShown) > FIVE_MINUTES) {
            const data = await getPopupBanners();
            
            if (isMounted && data.success && data.data && data.data.length > 0) {
              const popup = data.data[0];
              if (popup.image && typeof popup.image === 'string') {
                popup.image = popup.image.trim();
              }
              setPopupData(popup);
              setIsOpen(true);
              // Save timestamp when it's shown
              localStorage.setItem("popup_last_shown", now.toString());
            }
          }
        } catch (error) {
          console.error("Failed to fetch popup:", error);
        }
      };

      fetchPopup();
    }, 1500);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, []);

  if (!isOpen || !popupData) return null;

  // The popup modal container
  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm transition-opacity duration-300">
      {/* Background overlay click to close (optional - user said "cross button to close", so maybe just that. But it's good UX to close on backdrop click too) */}
      <div className="absolute inset-0" onClick={() => setIsOpen(false)} aria-hidden="true" />
      
      <div 
        className="relative z-10 w-full max-w-sm md:max-w-2xl bg-transparent animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()} 
      >
        {/* Close Button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute -top-3 -right-3 md:-top-5 md:-right-5 flex items-center justify-center w-8 h-8 md:w-10 md:h-10 bg-white text-gray-800 rounded-full shadow-xl hover:bg-gray-100 hover:scale-105 transition-all focus:outline-none z-20"
          aria-label="Close popup"
        >
          <X className="w-5 h-5 md:w-6 md:h-6" />
        </button>

        {/* Content */}
        {popupData.url ? (
          <Link href={popupData.url} onClick={() => setIsOpen(false)} className="block w-full h-full cursor-pointer relative z-10">
            <img
              src={popupData.image}
              alt={popupData.title || "Promotional Popup"}
              className="w-full h-auto max-h-[85vh] object-contain drop-shadow-2xl mx-auto"
            />
          </Link>
        ) : (
          <img
            src={popupData.image}
            alt={popupData.title || "Promotional Popup"}
            className="w-full h-auto max-h-[85vh] object-contain drop-shadow-2xl block mx-auto relative z-10"
          />
        )}
      </div>
    </div>
  );
}
