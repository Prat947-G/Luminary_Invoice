// src/data/networkData.js
import { Users, Settings, Truck, Factory, Building2, Wheat, HardHat, Milk, BrickWall } from 'lucide-react';

export const CATEGORIES = [
  {
    id: 'labour',
    title: 'Workforce & Labour',
    description: 'Manage contractor attendance, shift rosters, and payout ledgers for on-site teams.',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80',
    theme: 'green',
    icon: Users
  },
  {
    id: 'operations',
    title: 'Industrial Operations',
    description: 'Supply chain management, firewood logistics, and boiler maintenance contracts.',
    image: 'https://images.unsplash.com/photo-1565610222536-ef125c59da2e?auto=format&fit=crop&q=80',
    theme: 'amber',
    icon: Settings
  }
];

export const COMPANIES = [
  // --- OPERATIONS CLIENTS ---
  { 
    id: 'hatsun', 
    name: 'Hatsun Agro Product Ltd', 
    location: 'Daund, Pune', 
    type: 'Dairy Processing', 
    category: 'operations',
    icon: Milk,
    details: "Largest private sector dairy in India. Daund Unit requires consistent biomass fuel supply and boiler maintenance.",
    email: 'purchase@hatsun.com' 
  },
  { 
    id: 'jvs', 
    name: 'JVS Comatsco', 
    location: 'Ranjangaon MIDC', 
    type: 'Steel Manufacturing', 
    category: 'operations',
    icon: Factory,
    details: "Specializes in steel processing. Requires high-grade coal/briquettes for furnace operations.",
    email: 'accounts@jvs.com' 
  },
  { 
    id: 'global', 
    name: 'Globus Petrochemicals', 
    location: 'Shirur', 
    type: 'Chemical/Energy', 
    category: 'operations',
    icon: Settings,
    details: "Petrochemical refinery operations. Strict safety protocols for on-site boiler maintenance teams.",
    email: 'info@globus.com' 
  },
  {
    id: 'jk-cake',
    name: 'JK Cake & Dairy',
    location: 'Pune District',
    type: 'Food Processing',
    category: 'operations',
    icon: Wheat,
    details: "Large scale bakery and dairy unit. Requires food-grade steam generation protocols.",
    email: 'admin@jkcake.com'
  },

  // --- LABOUR CLIENTS (UPDATED WITH SPECIFIC DATA) ---
  { 
    id: 'lv-foods', 
    name: 'LV FOODS INDIA PVT LTD', 
    shortName: 'LV Foods (Creamy Delight)',
    location: 'Patas, Daund', 
    type: 'Bakery Manufacturing', 
    category: 'labour',
    icon: Milk,
    email: 'accounts_lvdairy@live.com',
    details: "CIN: U15410PN2015PTC154722 | Reg: 154722 | Gat No. 947/4, At Post-Patas, Tal- Daund. Auth Capital: ₹10L.",
    billingConfig: {
      rate: 650, // Daily Rate Example
      unit: 'Shift',
      defaultItem: 'Bakery Line Operator (8Hr Shift)',
      tax: 18
    }
  },
  { 
    id: 'srikar', 
    name: 'SRIKAR BUILDING MATERIALS (MH) PVT LTD', 
    shortName: 'Srikar Materials',
    location: 'Telangana / MH Unit', 
    type: 'Chemical/Metal Mfg', 
    category: 'labour',
    icon: BrickWall,
    email: 'contact@srikar-materials.com', // Placeholder if not provided
    details: "Paidup Capital: ₹6.83 Cr | Mfg of Chemical Products. Inc: 25 April 2022. Unlisted Private Company.",
    billingConfig: {
      rate: 550, 
      unit: 'Man-Day',
      defaultItem: 'Material Handler / Loader',
      tax: 18
    }
  },
  { 
    id: 'rutam', 
    name: 'RUTAM ENGINEERING', 
    shortName: 'Rutam Engg.',
    location: 'Aundh, Pune / Navi Mumbai', 
    type: 'Ceramic/Pipe Mfg', 
    category: 'labour',
    icon: HardHat,
    email: 'rutam.eng@example.com',
    details: "Proprietorship (Est 2011) | Micro Enterprise. Mfg of non-refractory ceramic pipes & conduits. Unit: New Panvel.",
    billingConfig: {
      rate: 750, 
      unit: 'Technician Day',
      defaultItem: 'Ceramic Pipe Technician',
      tax: 18
    }
  }
];