import { useState, useEffect } from "react";

export interface AdminStat {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: string;
  color: string;
}

export interface ServiceStat {
  name: string;
  orders: number;
  revenue: string;
  icon: string;
  growth?: number;
}

export function useAdminStats() {
  const [stats, setStats] = useState<AdminStat[]>([]);
  const [serviceStats, setServiceStats] = useState<ServiceStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call - Replace with real data fetching later
    const fetchStats = async () => {
      setLoading(true);
      
      // Mock delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockStats: AdminStat[] = [
        {
          title: "Total Orders",
          value: "2,847",
          change: "+12.5%",
          changeType: "positive",
          icon: "ShoppingCart",
          color: "text-blue-600"
        },
        {
          title: "Active Users",
          value: "18,420",
          change: "+8.2%",
          changeType: "positive",
          icon: "Users",
          color: "text-emerald-600"
        },
        {
          title: "Revenue",
          value: "₹4,56,780",
          change: "+15.3%",
          changeType: "positive",
          icon: "TrendingUp",
          color: "text-purple-600"
        },
        {
          title: "Products",
          value: "1,250",
          change: "+3.1%",
          changeType: "positive",
          icon: "Package",
          color: "text-orange-600"
        }
      ];

      const mockServiceStats: ServiceStat[] = [
        { name: "Medicines", orders: 1240, revenue: "₹2,84,560", icon: "Heart", growth: 12.5 },
        { name: "Lab Tests", orders: 580, revenue: "₹87,600", icon: "TestTube", growth: 8.7 },
        { name: "Doctor Consultations", orders: 420, revenue: "₹63,000", icon: "Stethoscope", growth: 15.2 },
        { name: "Home Care", orders: 180, revenue: "₹54,000", icon: "Activity", growth: 22.1 },
        { name: "Scans", orders: 320, revenue: "₹96,000", icon: "Scan", growth: 18.9 },
        { name: "Diabetes Care", orders: 150, revenue: "₹45,000", icon: "Heart", growth: 9.3 }
      ];

      setStats(mockStats);
      setServiceStats(mockServiceStats);
      setLoading(false);
    };

    fetchStats();
  }, []);

  return { stats, serviceStats, loading };
}