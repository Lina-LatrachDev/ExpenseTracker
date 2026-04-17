import React from "react";
import { FiTrendingUp } from "react-icons/fi";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Line,
  LineChart,
} from "recharts";

export const ActivityGraph = ({ transactions }) => {

  // keep only expenses
  const expenseTx = transactions.filter(tx => tx.type === "expense");

  // group expenses by date
  const grouped = {};

  expenseTx.forEach(tx => {
    //const date = new Date(tx.date).toLocaleDateString();
    const date = new Date(tx.date).toISOString().split("T")[0];

    if (!grouped[date]) {
      grouped[date] = 0;
    }

    grouped[date] += Number(tx.montant);
  });

  // convert grouped data to chart format
  const data = Object.keys(grouped)
  .sort((a, b) => new Date(a) - new Date(b))
  .map(date => ({
    name: date,
    Expenses: grouped[date]
  }));

  //const data = Object.keys(grouped).map(date => ({
  //name: date,
  // Expenses: grouped[date]
  // }));

  return (
    <div className="col-span-8 min-w-0 overflow-hidden rounded border border-stone-300">

      <div className="p-4">
        <h3 className="flex items-center gap-1.5 font-medium">
          <FiTrendingUp /> Dépenses au fil du temps
        </h3>
      </div>

      <div className="h-64 min-w-0 px-4">

        <ResponsiveContainer width="100%" height="100%">

          <LineChart
            data={data}
            margin={{
              top: 0,
              right: 0,
              left: -24,
              bottom: 0,
            }}
          >

            <CartesianGrid stroke="#e4e4e7" />

            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              className="text-xs font-bold"
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              className="text-xs font-bold"
            />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="Expenses"
              stroke="#5b21b6"
              strokeWidth={2}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
};