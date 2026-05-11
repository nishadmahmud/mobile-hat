"use client";

import { useState } from "react";
import { 
    FiFileText, 
    FiGift, 
    FiTruck, 
    FiCreditCard, 
    FiX, 
    FiShield, 
    FiCheckCircle, 
    FiClock, 
    FiMapPin 
} from "react-icons/fi";

const bankEmiData = [
    { bank: "AB Bank", logo: "https://upload.wikimedia.org/wikipedia/commons/7/73/Logo_of_AB_Bank.svg", initial: "A", color: "bg-red-500", m3: 4.16, m6: 6.38, m9: 7.52, m12: 8.69, m18: null, m24: null, m36: null },
    { bank: "AB Bank - Online", logo: "https://upload.wikimedia.org/wikipedia/commons/7/73/Logo_of_AB_Bank.svg", initial: "A", color: "bg-red-400", m3: 5.65, m6: 7.27, m9: 9.51, m12: 11.85, m18: 15.55, m24: 20.90, m36: 26.78 },
    { bank: "Al-Arafah Islami Bank", logo: "https://images.seeklogo.com/logo-png/36/1/al-arafah-islami-bank-limited-logo-png_seeklogo-367896.png", initial: "A", color: "bg-red-600", m3: 4.71, m6: 5.82, m9: 6.95, m12: 8.69, m18: null, m24: null, m36: null },
    { bank: "Al-Arafah Islami Bank - Online", logo: "https://images.seeklogo.com/logo-png/36/1/al-arafah-islami-bank-limited-logo-png_seeklogo-367896.png", initial: "A", color: "bg-red-300", m3: 5.65, m6: 7.27, m9: 9.51, m12: 11.85, m18: 15.55, m24: 20.90, m36: 26.78 },
    { bank: "Bank Asia", logo: "https://upload.wikimedia.org/wikipedia/commons/d/d6/Logo_of_Bank_Asia.svg", initial: "B", color: "bg-orange-500", m3: 4.71, m6: 5.82, m9: 6.95, m12: 8.69, m18: null, m24: null, m36: null },
    { bank: "Bank Asia - Online", logo: "https://upload.wikimedia.org/wikipedia/commons/d/d6/Logo_of_Bank_Asia.svg", initial: "B", color: "bg-orange-400", m3: 5.65, m6: 7.27, m9: 9.51, m12: 11.85, m18: 15.55, m24: 20.90, m36: null },
    { bank: "Brac Bank", logo: "https://cdn.brandfetch.io/idcfUmYxDL/w/1882/h/1882/theme/dark/icon.jpeg?c=1bxid64Mup7aczewSAYMX&t=1764488567824", initial: "B", color: "bg-orange-600", m3: 4.16, m6: 5.26, m9: 7.52, m12: 8.69, m18: 12.35, m24: 16.27, m36: null },
    { bank: "CBBL - Online", logo: "https://www.communitybankbd.com/wp-content/uploads/2020/10/community-cash.png", initial: "C", color: "bg-blue-400", m3: 5.65, m6: 7.27, m9: 9.51, m12: 11.85, m18: 15.55, m24: 20.90, m36: 26.78 },
    { bank: "Citizens Bank", logo: "https://cdn.brandfetch.io/idKfR1XVeV/w/846/h/367/theme/dark/logo.png?c=1bxid64Mup7aczewSAYMX&t=1715047471790", initial: "C", color: "bg-blue-500", m3: 4.16, m6: 5.26, m9: 7.52, m12: 8.69, m18: null, m24: null, m36: null },
    { bank: "Citizens Bank - Online", logo: "https://cdn.brandfetch.io/idKfR1XVeV/w/846/h/367/theme/dark/logo.png?c=1bxid64Mup7aczewSAYMX&t=1715047471790", initial: "C", color: "bg-blue-300", m3: 5.65, m6: 7.27, m9: 9.51, m12: 11.85, m18: null, m24: null, m36: null },
    { bank: "City Bank", logo: "https://images.seeklogo.com/logo-png/26/1/city-bank-logo-png_seeklogo-263036.png", initial: "C", color: "bg-blue-600", m3: 4.16, m6: 5.82, m9: 6.95, m12: 8.10, m18: 11.73, m24: 15.60, m36: 24.22 },
    { bank: "City Bank (AMEX) - Online", logo: "https://images.seeklogo.com/logo-png/26/1/city-bank-logo-png_seeklogo-263036.png", initial: "C", color: "bg-blue-700", m3: 6.72, m6: 8.34, m9: 10.58, m12: 12.92, m18: 16.62, m24: 21.97, m36: 27.85 },
    { bank: "Commercial Bank of Ceylon", logo: "https://upload.wikimedia.org/wikipedia/commons/f/fb/Commercial_Bank_logo.svg", initial: "C", color: "bg-blue-800", m3: 5.26, m6: 7.52, m9: 9.89, m12: 11.73, m18: 14.94, m24: 19.04, m36: null },
    { bank: "DBBL", logo: "https://upload.wikimedia.org/wikipedia/commons/1/16/Dutch-bangla-bank-ltd.svg", initial: "D", color: "bg-green-600", m3: 4.60, m6: 6.83, m9: 7.99, m12: 9.17, m18: 14.15, m24: 15.47, m36: 18.20 },
    { bank: "DBBL - Online", logo: "https://upload.wikimedia.org/wikipedia/commons/1/16/Dutch-bangla-bank-ltd.svg", initial: "D", color: "bg-green-500", m3: 5.65, m6: 7.27, m9: 9.51, m12: 11.85, m18: 15.55, m24: 20.90, m36: 26.78 },
    { bank: "Dhaka Bank", logo: "https://upload.wikimedia.org/wikipedia/commons/4/4c/Logo_of_Dhaka_Bank.svg", initial: "D", color: "bg-green-700", m3: 3.62, m6: 5.26, m9: 6.38, m12: 7.52, m18: 11.11, m24: 14.94, m36: 23.45 },
    { bank: "Dhaka Bank - Online", logo: "https://upload.wikimedia.org/wikipedia/commons/4/4c/Logo_of_Dhaka_Bank.svg", initial: "D", color: "bg-green-400", m3: 5.65, m6: 7.27, m9: 9.51, m12: 11.85, m18: null, m24: null, m36: null },
    { bank: "Eastern Bank", logo: "https://cdn.brandfetch.io/id-Sih_qNB/theme/dark/logo.svg?c=1bxid64Mup7aczewSAYMX&t=1764583453827", initial: "E", color: "bg-purple-500", m3: 4.16, m6: 5.26, m9: 7.52, m12: 8.69, m18: 11.73, m24: 16.27, m36: 23.45 },
    { bank: "Eastern Bank - Online", logo: "https://cdn.brandfetch.io/id-Sih_qNB/theme/dark/logo.svg?c=1bxid64Mup7aczewSAYMX&t=1764583453827", initial: "E", color: "bg-purple-400", m3: 5.65, m6: 7.27, m9: 9.51, m12: 11.85, m18: 15.55, m24: 20.90, m36: 26.78 },
    { bank: "Exim Bank - Online", logo: "https://upload.wikimedia.org/wikipedia/commons/f/fd/Logo_of_Exim_Bank_%28Bangladesh%29.svg", initial: "E", color: "bg-purple-600", m3: 5.65, m6: 7.27, m9: 9.51, m12: 11.85, m18: null, m24: null, m36: null },
    { bank: "Islami Bank", logo: "https://zarss-bibm.s3-ap-southeast-1.amazonaws.com/bibm_org/members_photo/x9OQKixv9r9WlsdxKXmo3uVWGoZn9GGjrJt0lhf6.jpeg", initial: "I", color: "bg-teal-500", m3: 4.16, m6: 5.26, m9: 6.38, m12: 7.52, m18: null, m24: null, m36: null },
    { bank: "Islami Bank - Online", logo: "https://zarss-bibm.s3-ap-southeast-1.amazonaws.com/bibm_org/members_photo/x9OQKixv9r9WlsdxKXmo3uVWGoZn9GGjrJt0lhf6.jpeg", initial: "I", color: "bg-teal-400", m3: 5.65, m6: 7.27, m9: 9.51, m12: 11.85, m18: 15.55, m24: 20.90, m36: 26.78 },
    { bank: "Jamuna Bank", logo: "https://upload.wikimedia.org/wikipedia/commons/d/d2/Logo_of_Jamuna_Bank.svg", initial: "J", color: "bg-indigo-500", m3: 4.16, m6: 5.26, m9: 6.38, m12: 7.52, m18: 11.11, m24: 14.94, m36: null },
    { bank: "Jamuna Bank - Online", logo: "https://upload.wikimedia.org/wikipedia/commons/d/d2/Logo_of_Jamuna_Bank.svg", initial: "J", color: "bg-indigo-400", m3: 5.65, m6: 7.27, m9: 9.51, m12: 11.85, m18: 15.55, m24: 20.90, m36: 26.78 },
    { bank: "Lanka Bangla", logo: "https://upload.wikimedia.org/wikipedia/commons/f/f8/Logo_of_LankaBangla_Finance.svg", initial: "L", color: "bg-lime-600", m3: 4.16, m6: 6.38, m9: 7.52, m12: 9.89, m18: null, m24: null, m36: null },
    { bank: "Lanka Bangla - Online", logo: "https://upload.wikimedia.org/wikipedia/commons/f/f8/Logo_of_LankaBangla_Finance.svg", initial: "L", color: "bg-lime-500", m3: 5.65, m6: 7.27, m9: 9.51, m12: 11.85, m18: 15.55, m24: 20.90, m36: null },
    { bank: "Meghna Bank", logo: "https://upload.wikimedia.org/wikipedia/commons/c/cf/Meghna-Bank_Logo_JPG.jpg", initial: "M", color: "bg-pink-500", m3: 3.62, m6: 5.26, m9: 6.38, m12: 7.52, m18: 11.11, m24: 14.94, m36: null },
    { bank: "Meghna Bank - Online", logo: "https://upload.wikimedia.org/wikipedia/commons/c/cf/Meghna-Bank_Logo_JPG.jpg", initial: "M", color: "bg-pink-400", m3: 5.65, m6: 7.27, m9: 9.51, m12: 11.85, m18: 15.55, m24: 20.90, m36: 26.78 },
    { bank: "Mercantile Bank", logo: "https://images.seeklogo.com/logo-png/30/1/mercantile-bank-ltd-logo-png_seeklogo-308216.png", initial: "M", color: "bg-pink-600", m3: 4.16, m6: 5.26, m9: 7.52, m12: 8.69, m18: null, m24: null, m36: null },
    { bank: "Mercantile Bank - Online", logo: "https://images.seeklogo.com/logo-png/30/1/mercantile-bank-ltd-logo-png_seeklogo-308216.png", initial: "M", color: "bg-pink-300", m3: 5.65, m6: 7.27, m9: 9.51, m12: 11.85, m18: 15.55, m24: 20.90, m36: 26.78 },
    { bank: "Midland Bank", logo: "https://upload.wikimedia.org/wikipedia/commons/6/66/Logo_of_Midland_Bank.svg", initial: "M", color: "bg-fuchsia-500", m3: 3.62, m6: 5.26, m9: 6.38, m12: 7.52, m18: 11.11, m24: 14.94, m36: null },
    { bank: "Midland Bank - Online", logo: "https://upload.wikimedia.org/wikipedia/commons/6/66/Logo_of_Midland_Bank.svg", initial: "M", color: "bg-fuchsia-400", m3: 5.65, m6: 7.27, m9: 9.51, m12: 11.85, m18: 15.55, m24: 20.90, m36: null },
    { bank: "Modhumoti Bank", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Logo_of_Modhumoti_Bank-en.svg/2560px-Logo_of_Modhumoti_Bank-en.svg.png", initial: "M", color: "bg-violet-500", m3: 3.62, m6: 5.26, m9: 6.38, m12: 8.69, m18: 11.11, m24: 14.94, m36: null },
    { bank: "Modhumoti Bank - Online", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Logo_of_Modhumoti_Bank-en.svg/2560px-Logo_of_Modhumoti_Bank-en.svg.png", initial: "M", color: "bg-violet-400", m3: 5.65, m6: 7.27, m9: 9.51, m12: 11.85, m18: 15.55, m24: 20.90, m36: null },
    { bank: "Mutual Trust Bank", logo: "https://cdn.brandfetch.io/idw9NqUipN/w/368/h/270/theme/dark/logo.png?c=1bxid64Mup7aczewSAYMX&t=1766308741582", initial: "M", color: "bg-rose-500", m3: 3.62, m6: 5.26, m9: 6.95, m12: 9.28, m18: null, m24: null, m36: null },
    { bank: "Mutual Trust Bank - Online", logo: "https://cdn.brandfetch.io/idw9NqUipN/w/368/h/270/theme/dark/logo.png?c=1bxid64Mup7aczewSAYMX&t=1766308741582", initial: "M", color: "bg-rose-400", m3: 5.65, m6: 7.27, m9: 9.51, m12: 11.85, m18: 15.55, m24: 20.90, m36: 26.78 },
    { bank: "NCC Bank", logo: "https://upload.wikimedia.org/wikipedia/en/b/b5/NCC_bank_logo.png", initial: "N", color: "bg-cyan-500", m3: 3.62, m6: 4.16, m9: 6.38, m12: 7.52, m18: 11.11, m24: null, m36: null },
    { bank: "NCC Bank - Online", logo: "https://upload.wikimedia.org/wikipedia/en/b/b5/NCC_bank_logo.png", initial: "N", color: "bg-cyan-400", m3: 5.65, m6: 7.27, m9: 9.51, m12: 11.85, m18: 15.55, m24: 20.90, m36: 26.78 },
    { bank: "NRB Bank", logo: "https://upload.wikimedia.org/wikipedia/commons/6/65/Logo_of_NRB_Bank.svg", initial: "N", color: "bg-cyan-600", m3: 3.09, m6: 5.26, m9: 6.38, m12: 7.52, m18: 12.35, m24: 14.94, m36: 19.04 },
    { bank: "NRB Bank - Online", logo: "https://upload.wikimedia.org/wikipedia/commons/6/65/Logo_of_NRB_Bank.svg", initial: "N", color: "bg-cyan-300", m3: 5.65, m6: 7.27, m9: 9.51, m12: 11.85, m18: 15.55, m24: 20.90, m36: 26.78 },
    { bank: "NRB Commercial Bank", logo: "https://images.seeklogo.com/logo-png/55/1/nrbc-bank-logo-png_seeklogo-551967.png", initial: "N", color: "bg-sky-500", m3: 3.62, m6: 5.26, m9: 6.38, m12: 8.10, m18: null, m24: null, m36: null },
    { bank: "NRBC Bank - Online", logo: "https://images.seeklogo.com/logo-png/55/1/nrbc-bank-logo-png_seeklogo-551967.png", initial: "N", color: "bg-sky-400", m3: 5.65, m6: 7.27, m9: 9.51, m12: 11.85, m18: 15.55, m24: 20.90, m36: null },
    { bank: "One Bank", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Logo_of_ONE_Bank-en.svg/2560px-Logo_of_ONE_Bank-en.svg.png", initial: "O", color: "bg-amber-500", m3: 4.16, m6: 5.26, m9: 7.52, m12: 8.69, m18: null, m24: null, m36: null },
    { bank: "One Bank - Online", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Logo_of_ONE_Bank-en.svg/2560px-Logo_of_ONE_Bank-en.svg.png", initial: "O", color: "bg-amber-400", m3: 5.65, m6: 7.27, m9: 9.51, m12: 11.85, m18: null, m24: null, m36: null },
    { bank: "Premier Bank", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Logo_of_Premier_Bank-en.svg/2560px-Logo_of_Premier_Bank-en.svg.png", initial: "P", color: "bg-amber-600", m3: 4.16, m6: 5.26, m9: 6.38, m12: 8.69, m18: null, m24: null, m36: null },
    { bank: "Premier Bank - Online", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Logo_of_Premier_Bank-en.svg/2560px-Logo_of_Premier_Bank-en.svg.png", initial: "P", color: "bg-amber-300", m3: 5.65, m6: 7.27, m9: 9.51, m12: 11.85, m18: null, m24: null, m36: null },
    { bank: "Prime Bank", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Logo_of_Prime_Bank.svg/2560px-Logo_of_Prime_Bank.svg.png", initial: "P", color: "bg-yellow-600", m3: 4.16, m6: 5.26, m9: 6.38, m12: 7.52, m18: null, m24: null, m36: null },
    { bank: "Prime Bank - Online", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Logo_of_Prime_Bank.svg/2560px-Logo_of_Prime_Bank.svg.png", initial: "P", color: "bg-yellow-500", m3: 5.65, m6: 7.27, m9: 9.51, m12: 11.85, m18: 15.55, m24: 20.90, m36: null },
    { bank: "Pubali Bank", logo: "https://images.seeklogo.com/logo-png/51/1/pubali-bank-plc-logo-png_seeklogo-511721.png", initial: "P", color: "bg-yellow-400", m3: 4.16, m6: 5.26, m9: 6.38, m12: 7.52, m18: 11.11, m24: 14.94, m36: null },
    { bank: "Pubali Bank - Online", logo: "https://images.seeklogo.com/logo-png/51/1/pubali-bank-plc-logo-png_seeklogo-511721.png", initial: "P", color: "bg-yellow-300", m3: 5.65, m6: 7.27, m9: 9.51, m12: 11.85, m18: 15.55, m24: 20.90, m36: null },
    { bank: "SBAC", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a2/SBAC_Bank_Ltd.png", initial: "S", color: "bg-emerald-500", m3: 3.62, m6: 5.26, m9: 6.38, m12: 8.69, m18: null, m24: null, m36: null },
    { bank: "SBAC - Online", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a2/SBAC_Bank_Ltd.png", initial: "S", color: "bg-emerald-400", m3: 5.65, m6: 7.27, m9: 9.51, m12: 11.85, m18: 15.55, m24: 20.90, m36: null },
    { bank: "Shahjalal Islami Bank", logo: "https://upload.wikimedia.org/wikipedia/commons/0/02/SJIBL_Logo_English_Blue-01.jpg", initial: "S", color: "bg-emerald-600", m3: 4.71, m6: 5.26, m9: 6.95, m12: 9.28, m18: 11.11, m24: 14.28, m36: null },
    { bank: "Shahjalal Islami Bank - Online", logo: "https://upload.wikimedia.org/wikipedia/commons/0/02/SJIBL_Logo_English_Blue-01.jpg", initial: "S", color: "bg-emerald-300", m3: 5.65, m6: 7.27, m9: 9.51, m12: 11.85, m18: null, m24: null, m36: null },
    { bank: "Shimanto Bank - Online", logo: "https://upload.wikimedia.org/wikipedia/en/9/9c/Logo_of_Shimanto_Bank.png", initial: "S", color: "bg-green-300", m3: 5.65, m6: 7.27, m9: 9.51, m12: 11.85, m18: 15.55, m24: 20.90, m36: null },
    { bank: "Social Islami Bank", logo: "https://upload.wikimedia.org/wikipedia/en/8/8f/Logo_of_Social_Islami_Bank.svg", initial: "S", color: "bg-teal-600", m3: 4.71, m6: 5.26, m9: 6.95, m12: 9.28, m18: 11.11, m24: 14.28, m36: null },
    { bank: "Southeast Bank", logo: "https://upload.wikimedia.org/wikipedia/commons/1/1c/Logo_of_Southeast_Bank.svg", initial: "S", color: "bg-teal-700", m3: 4.16, m6: 5.26, m9: 7.52, m12: 9.89, m18: 13.63, m24: 19.04, m36: 25.00 },
    { bank: "Southeast Bank - Online", logo: "https://upload.wikimedia.org/wikipedia/commons/1/1c/Logo_of_Southeast_Bank.svg", initial: "S", color: "bg-teal-300", m3: 5.65, m6: 7.27, m9: 9.51, m12: 11.85, m18: 15.55, m24: 20.90, m36: 26.78 },
    { bank: "Standard Bank", logo: "https://www.standardbankbd.com/Content/Images/standard-logo.png", initial: "S", color: "bg-indigo-600", m3: 3.62, m6: 5.26, m9: 6.38, m12: 7.52, m18: 11.11, m24: 14.94, m36: null },
    { bank: "Standard Bank - Online", logo: "https://www.standardbankbd.com/Content/Images/standard-logo.png", initial: "S", color: "bg-indigo-300", m3: 5.65, m6: 7.27, m9: 9.51, m12: 11.85, m18: 15.55, m24: 20.90, m36: null },
    { bank: "Standard Chartered", logo: "https://upload.wikimedia.org/wikipedia/commons/0/0c/Standard_Chartered_%282021%29.svg", initial: "S", color: "bg-blue-900", m3: 4.16, m6: 6.38, m9: 9.28, m12: 12.35, m18: 16.27, m24: 21.95, m36: 29.87 },
    { bank: "Standard Chartered - Online", logo: "https://upload.wikimedia.org/wikipedia/commons/0/0c/Standard_Chartered_%282021%29.svg", initial: "S", color: "bg-blue-800", m3: 6.19, m6: 8.38, m9: 11.26, m12: 14.29, m18: 18.17, m24: 23.77, m36: null },
    { bank: "Trust Bank", logo: "https://upload.wikimedia.org/wikipedia/bn/4/4a/%E0%A6%9F%E0%A7%8D%E0%A6%B0%E0%A6%BE%E0%A6%B8%E0%A7%8D%E0%A6%9F_%E0%A6%AC%E0%A7%8D%E0%A6%AF%E0%A6%BE%E0%A6%82%E0%A6%95%E0%A7%87%E0%A6%B0_%E0%A6%B2%E0%A7%8B%E0%A6%97%E0%A7%8B.svg", initial: "T", color: "bg-rose-600", m3: 4.16, m6: 5.82, m9: 7.52, m12: 9.28, m18: 13.63, m24: 17.64, m36: 23.45 },
    { bank: "Trust Bank - Online", logo: "https://upload.wikimedia.org/wikipedia/bn/4/4a/%E0%A6%9F%E0%A7%8D%E0%A6%B0%E0%A6%BE%E0%A6%B8%E0%A7%8D%E0%A6%9F_%E0%A6%AC%E0%A7%8D%E0%A6%AF%E0%A6%BE%E0%A6%82%E0%A6%95%E0%A7%87%E0%A6%B0_%E0%A6%B2%E0%A7%8B%E0%A6%97%E0%A7%8B.svg", initial: "T", color: "bg-rose-400", m3: 5.65, m6: 7.27, m9: 9.51, m12: 11.85, m18: 15.55, m24: 20.90, m36: 26.78 },
    { bank: "UCBL", logo: "https://upload.wikimedia.org/wikipedia/en/b/b9/Logo_of_United_Commercial_Bank.svg", initial: "U", color: "bg-gray-600", m3: 3.30, m6: 5.48, m9: 7.75, m12: 9.52, m18: 13.63, m24: 17.64, m36: null },
    { bank: "UCBL - Online", logo: "https://upload.wikimedia.org/wikipedia/en/b/b9/Logo_of_United_Commercial_Bank.svg", initial: "U", color: "bg-gray-500", m3: 5.65, m6: 7.27, m9: 9.51, m12: 11.85, m18: null, m24: 20.90, m36: null },
];

function EMICalculator({ currentPrice, bankEmiData }) {
    const [selectedBank, setSelectedBank] = useState(bankEmiData[0]);
    const [customAmount, setCustomAmount] = useState(currentPrice);

    // Calculate EMI for a given price, months, and charge percentage
    const calculateEMI = (price, months, chargePercent) => {
        if (!chargePercent) return null;
        const chargeAmount = (price * chargePercent) / 100;
        const totalAmount = price + chargeAmount;
        const monthlyEMI = totalAmount / months;
        return {
            emi: monthlyEMI,
            charge: chargePercent,
            effectiveCost: totalAmount
        };
    };

    // Get EMI plans for selected bank based on customAmount
    const getEmiPlans = (bank) => {
        const plans = [];
        const months = [
            { key: 'm3', label: 3 },
            { key: 'm6', label: 6 },
            { key: 'm9', label: 9 },
            { key: 'm12', label: 12 },
            { key: 'm18', label: 18 },
            { key: 'm24', label: 24 },
            { key: 'm36', label: 36 }
        ];

        months.forEach(({ key, label }) => {
            if (bank[key]) {
                const calc = calculateEMI(customAmount, label, bank[key]);
                if (calc) {
                    plans.push({
                        months: label,
                        ...calc
                    });
                }
            }
        });

        return plans;
    };

    const plans = getEmiPlans(selectedBank);

    return (
        <div className="space-y-4">
            <h3 className="font-bold text-lg text-gray-900 tracking-tight">EMI Options</h3>

            <div className="flex flex-row gap-2 md:gap-4 h-[500px] md:h-[600px]">
                {/* Left: Bank List */}
                <div className="w-[110px] md:w-1/3 border border-gray-100 rounded-2xl flex flex-col h-full sticky top-0 overflow-hidden">
                    <div className="p-3 bg-gray-50 border-b border-gray-100 font-black text-[10px] text-gray-400 uppercase tracking-widest sticky top-0 z-10">
                        Select Bank
                    </div>
                    <div className="overflow-y-auto flex-1 bg-white">
                        {bankEmiData.map((bank, idx) => (
                            <button
                                key={idx}
                                onClick={() => setSelectedBank(bank)}
                                className={`w-full flex flex-col md:flex-row items-center md:items-center gap-1 md:gap-3 p-3 text-center md:text-left border-b border-gray-50 last:border-0 transition-all ${selectedBank.bank === bank.bank
                                    ? 'bg-blue-50 border-r-4 md:border-r-0 md:border-l-4 border-blue-600'
                                    : 'hover:bg-gray-50'
                                    }`}
                            >
                                <div className={`w-8 h-8 md:w-10 md:h-10 ${!bank.logo && bank.color} rounded-xl flex items-center justify-center text-white font-black text-xs md:text-sm flex-shrink-0 mx-auto md:mx-0 overflow-hidden bg-white shadow-sm`}>
                                    {bank.logo ? (
                                        <img
                                            src={bank.logo}
                                            alt={bank.bank}
                                            className="w-full h-full object-contain p-1"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.parentElement.classList.remove('bg-white');
                                                e.target.parentElement.classList.add(bank.color.split(' ')[0]);
                                                e.target.parentElement.innerHTML = bank.initial;
                                            }}
                                        />
                                    ) : (
                                        <div className={`w-full h-full ${bank.color} flex items-center justify-center font-black`}>
                                            {bank.initial}
                                        </div>
                                    )}
                                </div>
                                <span className={`text-[10px] md:text-[13px] font-bold ${selectedBank.bank === bank.bank ? 'text-blue-600' : 'text-gray-600'} truncate w-full md:w-auto`}>{bank.bank}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right: EMI Details */}
                <div className="flex-1 space-y-4 h-full overflow-y-auto pr-1">
                    {/* Amount Input */}
                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Purchase Amount</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-900 font-black text-lg">৳</span>
                            <input
                                type="number"
                                value={customAmount}
                                onChange={(e) => setCustomAmount(Number(e.target.value))}
                                className="w-full py-3 px-4 pl-9 bg-white border-2 border-transparent rounded-xl text-lg font-black text-gray-900 focus:outline-none focus:border-blue-600/20 focus:ring-4 focus:ring-blue-600/5 transition-all shadow-sm"
                            />
                        </div>
                    </div>

                    {/* EMI Table */}
                    <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                        <table className="w-full text-[13px] whitespace-nowrap">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="text-center p-3 font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">Plan</th>
                                    <th className="text-left p-3 font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">Monthly EMI</th>
                                    <th className="text-right p-3 font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">Total Cost</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white">
                                {plans.length > 0 ? plans.map((plan, idx) => (
                                    <tr key={idx} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                                        <td className="p-4 text-center align-middle font-black text-gray-900">
                                            {plan.months} <span className="text-[10px] text-gray-400">Months</span>
                                        </td>
                                        <td className="p-4 align-middle">
                                            <div className="flex flex-col">
                                                <span className="text-blue-600 font-black text-sm">৳ {plan.emi.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                                                <span className="text-[10px] font-bold text-gray-400">Charge {plan.charge}%</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-right align-middle text-gray-900 font-black">
                                            ৳ {plan.effectiveCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={3} className="p-8 text-center text-gray-400 font-bold italic uppercase tracking-tighter">No EMI plans available for this bank</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex items-center gap-2 p-3 bg-blue-50/50 rounded-xl border border-blue-100">
                        <FiCheckCircle className="text-blue-600 w-4 h-4 shrink-0" />
                        <p className="text-[11px] font-bold text-blue-600 leading-tight">
                            EMI facility is available for purchases over ৳5,000. Terms and conditions apply based on bank policies.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ProductExtras({ product, selectedCarePlans, toggleCarePlan, currentPrice: currentPriceProp }) {
    const currentPrice = currentPriceProp ?? product.rawPrice ?? 0;
    const [activeDrawer, setActiveDrawer] = useState(null);

    const closeDrawer = () => setActiveDrawer(null);

    const allExtras = [
        {
            id: "care",
            label: "Applex Care",
            description: selectedCarePlans.length > 0 ? `${selectedCarePlans.length} Selected` : "Protect Now",
            icon: FiShield,
            badge: selectedCarePlans.length > 0
        },
        {
            id: "emi",
            label: "EMI Plans",
            description: "Starts from ৳2.5k",
            icon: FiCreditCard
        },
        {
            id: "perks",
            label: "Benefits",
            description: "Trust Promise",
            icon: FiGift
        },
        {
            id: "delivery",
            label: "Shipping",
            description: "Fast Delivery",
            icon: FiTruck
        }
    ];

    const renderDrawerContent = () => {
        switch (activeDrawer) {
            case "care":
                const categoryLower = (product.category?.name || '').toLowerCase();
                const isPhoneCategory = categoryLower.includes('phone') || categoryLower.includes('phones');
                const isLaptop = categoryLower.includes('laptop') || categoryLower.includes('macbook');
                const productPrice = currentPrice;

                const defaultPlans = [
                    { id: 'care_plus', name: 'Applex Care+ 1 Year', detail: "Covers hardware and software issues", price: Math.round(productPrice * 0.05) },
                    { id: 'screen_protection', name: 'Screen Protection', detail: "One-time screen replacement", price: Math.round(productPrice * 0.07) },
                ];

                const carePlansToShow = isPhoneCategory || isLaptop ? defaultPlans : [
                    { id: 'ext_warranty', name: 'Extended Warranty', detail: "1 Year extra hardware warranty", price: Math.round(productPrice * 0.08) }
                ];

                return (
                    <div className="space-y-6 flex flex-col h-full">
                        <div>
                            <h3 className="text-3xl font-black text-gray-900 tracking-tighter">Applex Care</h3>
                            <p className="text-sm font-bold text-gray-400">Choose the best protection for your device</p>
                        </div>
                        
                        <div className="grid gap-3 overflow-y-auto pr-2">
                            {carePlansToShow.map((plan) => {
                                const isSelected = selectedCarePlans.some(p => p.id === plan.id);
                                return (
                                    <label
                                        key={plan.id}
                                        className={`cursor-pointer group relative overflow-hidden p-6 rounded-[2rem] border-2 transition-all duration-300 ${isSelected
                                            ? "border-blue-600 bg-blue-600 text-white shadow-2xl shadow-blue-500/30"
                                            : "border-gray-100 bg-gray-50 hover:border-blue-200"
                                            }`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={isSelected}
                                            onChange={() => toggleCarePlan(plan)}
                                            className="hidden"
                                        />
                                        <div className="flex justify-between items-start relative z-10">
                                            <div className="space-y-1">
                                                <h4 className="font-black text-lg leading-tight">{plan.name}</h4>
                                                <p className={`text-xs font-bold leading-relaxed ${isSelected ? "text-blue-100" : "text-gray-400"}`}>
                                                    {plan.detail}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <span className={`text-xl font-black block ${isSelected ? "text-white" : "text-blue-600"}`}>
                                                    ৳{plan.price.toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                        {isSelected && (
                                            <FiCheckCircle className="absolute -bottom-2 -right-2 h-16 w-16 opacity-10" />
                                        )}
                                    </label>
                                );
                            })}
                        </div>

                        <div className="mt-auto pt-6">
                            <button 
                                onClick={closeDrawer}
                                className="w-full py-5 bg-gray-900 text-white font-black rounded-[1.5rem] hover:bg-blue-600 transition-all shadow-xl active:scale-[0.98]"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                );
            case "perks":
                const categoryLowerPerks = (product.category?.name || '').toLowerCase();
                const isPhonesCategory = categoryLowerPerks.includes('phone') || categoryLowerPerks.includes('phones');

                let warrantyTitle = "3 Days Full Replacement";
                let warrantyDesc = "Get 3-Days Full Replacement of your device";

                if (isPhonesCategory) {
                    warrantyTitle = "Brand Warranty";
                    warrantyDesc = "Get official manufacturer warranty coverage";
                }

                return (
                    <div className="space-y-6">
                        <h3 className="text-3xl font-black text-gray-900 tracking-tighter">Benefits & Perks</h3>
                        <div className="grid gap-4">
                            {[
                                { title: warrantyTitle, desc: warrantyDesc, icon: FiShield },
                                { title: "Fast Shipping", desc: "Express delivery options nationwide", icon: FiTruck },
                                { title: "Authentic Device", desc: "100% genuine products, sealed box", icon: FiCheckCircle },
                                { title: "Secure Checkout", desc: "Verified payment & data protection", icon: FiShield }
                            ].map((perk, i) => (
                                <div key={i} className="flex gap-5 p-5 rounded-[2rem] bg-gray-50 border border-gray-100 items-center">
                                    <div className="bg-white p-4 rounded-2xl shadow-sm text-blue-600">
                                        <perk.icon className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-base text-gray-900 leading-none">{perk.title}</h4>
                                        <p className="text-xs font-bold text-gray-400 mt-1">{perk.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case "delivery":
                return (
                    <div className="space-y-6">
                        <h3 className="text-3xl font-black text-gray-900 tracking-tighter">Shipping Info</h3>
                        <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100 space-y-4">
                            <div className="flex items-center justify-between p-5 bg-white rounded-2xl shadow-sm">
                                <span className="font-black text-[10px] uppercase tracking-widest text-gray-400">Inside Dhaka</span>
                                <span className="font-black text-sm text-blue-600 bg-blue-50 px-4 py-2 rounded-xl">24–48 Hours</span>
                            </div>
                            <div className="flex items-center justify-between p-5 bg-white rounded-2xl shadow-sm">
                                <span className="font-black text-[10px] uppercase tracking-widest text-gray-400">Outside Dhaka</span>
                                <span className="font-black text-sm text-gray-900 bg-gray-50 px-4 py-2 rounded-xl">3–5 Days</span>
                            </div>
                        </div>
                        <p className="text-[10px] font-black text-gray-400 text-center uppercase tracking-widest leading-relaxed">
                            * Delivery charges vary based on location and parcel weight. Standard rates apply.
                        </p>
                    </div>
                );
            case "emi":
                return (
                    <EMICalculator
                        currentPrice={currentPrice}
                        bankEmiData={bankEmiData}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="border border-gray-100 rounded-[1.2rem] bg-white p-1 shadow-sm overflow-hidden">
            <div className="flex items-center divide-x divide-gray-100">
                {allExtras.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveDrawer(item.id)}
                        className="flex-1 py-3 px-2 flex items-center justify-center gap-2.5 hover:bg-blue-50 transition-all group"
                    >
                        <div className={`relative ${item.badge ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-600'}`}>
                            <item.icon className="h-4 w-4 transition-transform group-hover:scale-110" />
                            {item.badge && (
                                <span className="absolute -top-1.5 -right-1.5 w-2 h-2 bg-blue-600 rounded-full border-2 border-white" />
                            )}
                        </div>
                        <div className="text-left hidden md:block">
                            <span className="block font-black text-[10px] text-gray-900 leading-none group-hover:text-blue-600 transition-colors">{item.label}</span>
                            <span className="font-bold text-[8px] text-gray-400 group-hover:text-gray-500 truncate max-w-[60px] block">{item.description}</span>
                        </div>
                        {/* Mobile view: Only Label */}
                        <span className="md:hidden font-black text-[10px] text-gray-700 group-hover:text-blue-600">{item.label}</span>
                    </button>
                ))}
            </div>

            {/* Premium Overlay System */}
            {activeDrawer && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md animate-in fade-in duration-300" onClick={closeDrawer} />
                    
                    <div className={`
                        relative bg-white shadow-[0_32px_128px_-12px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col 
                        transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1) animate-in zoom-in-95 slide-in-from-bottom-5
                        ${activeDrawer === 'emi'
                            ? 'w-full max-w-5xl rounded-[3rem] h-[90vh]'
                            : 'w-full max-w-lg rounded-[3rem] h-fit max-h-[85vh]'
                        }
                    `}>
                        <div className="absolute top-6 right-6 z-20">
                            <button
                                onClick={closeDrawer}
                                className="p-3 bg-gray-100 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-2xl transition-all active:scale-95"
                            >
                                <FiX className="h-6 w-6" />
                            </button>
                        </div>

                        <div className="overflow-y-auto flex-1 p-8 md:p-12">
                            {renderDrawerContent()}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
