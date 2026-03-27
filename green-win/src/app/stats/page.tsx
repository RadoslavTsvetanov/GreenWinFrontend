"use client";

import { useAuth } from "@/components/auth/AuthProvider";
import {
  CarbonData,
  fetchOrganizationDashboardCarbon,
} from "@/lib/organizations/dashboard";
import { useRouter } from "next/dist/client/components/navigation";
import { useEffect, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

const StatsPage = () => {
  const { user } = useAuth();
  const [carbon, setCarbon] = useState<CarbonData | null>(null);
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      console.log(user);
      if (!user?.organizationId) {
        return router.replace("/login");
      }

      const data = await fetchOrganizationDashboardCarbon(user.organizationId);
      setCarbon(data);
    };

    load();
  }, [user]);

  if (!carbon) {
    return <div className="p-10 heading1 text-base-900">Loading...</div>;
  }

  const used = Math.max(0, carbon.currentMonthEmissions);
  const target = carbon.monthlyEmissionsTarget ?? 0;

  const monthlyData = [
    { name: "Used", value: used },
    { name: "Remaining", value: Math.max(0, target - used) },
  ];

  const annualUsed = Math.max(0, carbon.totalEmissions);
  const annualTarget = carbon.annualEmissionsTarget ?? 0;

  const annualData = [
    { name: "Used", value: annualUsed },
    { name: "Remaining", value: Math.max(0, annualTarget - annualUsed) },
  ];

  const COLORS = ["#df2104", "#868c84"];

  return (
    <div className="p-10 flex flex-col gap-16 items-center justify-center">
      <p className="heading3 text-base-900">Carbon Dashboard</p>
      <div className="flex gap-4 w-full items-center justify-center">
        <div className="bg-base-100 p-6 rounded-lg shadow-custom w-full max-w-xl">
          <p className="paragraph1 text-base-900">Monthly Emissions</p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={monthlyData}
                  dataKey="value"
                  innerRadius={60}
                  outerRadius={90}
                >
                  {monthlyData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          <p className="text-center heading6 text-base-900">
            {carbon.monthlyEmissionsUsagePercent?.toFixed(2)}% used
          </p>
        </div>

        <div className="bg-base-100 p-6 rounded-lg shadow-custom w-full max-w-xl">
          <p className="paragraph1 text-base-900">Annual Progress</p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={annualData}
                  dataKey="value"
                  innerRadius={60}
                  outerRadius={90}
                >
                  {annualData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <p className="text-center heading6 text-base-900">
            {carbon.annualEmissionsUsagePercent?.toFixed(2)}% used
          </p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 max-w-3xl">
        <div className="bg-base-100 p-4 rounded shadow-custom flex flex-col items-center justify-center text-center">
          <p className="caption1">Total Emissions</p>
          <p className="heading7">{carbon.totalEmissions}</p>
        </div>

        <div className="bg-base-100 p-4 rounded shadow-custom flex flex-col items-center justify-center text-center">
          <p className="caption1">Energy Saved</p>
          <p className="heading7">{carbon.totalEnergySaved}</p>
        </div>

        <div className="bg-base-100 p-4 rounded shadow-custom flex flex-col items-center justify-center text-center">
          <p className="caption1">Tasks Executed</p>
          <p className="heading7">{carbon.totalTasksExecuted}</p>
        </div>
      </div>
    </div>
  );
};

export default StatsPage;
