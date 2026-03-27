"use client";

import { useAuth } from "@/components/auth/AuthProvider";
import {
  CarbonData,
  fetchOrganizationDashboardCarbon,
} from "@/lib/organizations/dashboard";
import { useRouter } from "next/dist/client/components/navigation";
import { useEffect, useState } from "react";
import {
  Cell,
  Pie,
  PieChart,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
} from "recharts";

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

  const monthlyData = [
    {
      name: "Used",
      value: carbon.currentMonthEmissions,
    },
    {
      name: "Remaining",
      value: Math.max(
        0,
        carbon.monthlyEmissionsTarget ?? 0 - carbon.currentMonthEmissions,
      ),
    },
  ];

  return (
    <div className="p-10 flex flex-col gap-8 items-center justify-center">
      <p className="heading3 text-base-900">Carbon Dashboard</p>
      <div className="bg-base-100 p-6 rounded-lg shadow-custom w-full max-w-xl">
        <p className="paragraph1 text-base-900">Monthly Emissions</p>
        <div className="max-h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={monthlyData}
                dataKey="value"
                innerRadius={60}
                outerRadius={90}
                labelLine={false}
                label={({ percent }: { percent: number }) =>
                  `${(percent * 100).toFixed(0)}%`
                }
              >
                <Cell fill="functional-success" />
                <Cell fill="functional-error" />
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

        <div className="max-h-64">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              innerRadius="70%"
              outerRadius="100%"
              data={[
                { name: "Progress", value: carbon.annualEmissionsUsagePercent },
              ]}
            >
              <RadialBar dataKey="value" fill="functional-success" />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>
        <p className="text-center heading6 text-base-900">
          {carbon.annualEmissionsUsagePercent?.toFixed(2)}% used
        </p>
      </div>
      <div className="grid grid-cols-3 gap-4 max-w-3xl">
        <div className="bg-base-100 p-4 rounded shadow-custom">
          <p className="caption1">Total Emissions</p>
          <p className="heading7">{carbon.totalEmissions}</p>
        </div>

        <div className="bg-base-100 p-4 rounded shadow-custom">
          <p className="caption1">Energy Saved</p>
          <p className="heading7">{carbon.totalEnergySaved}</p>
        </div>

        <div className="bg-base-100 p-4 rounded shadow-custom">
          <p className="caption1">Tasks Executed</p>
          <p className="heading7">{carbon.totalTasksExecuted}</p>
        </div>
      </div>
    </div>
  );
};

export default StatsPage;
