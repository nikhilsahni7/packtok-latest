"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@packtok/ui/card";
import { CheckCircle2, Clock, MessageSquare } from "lucide-react";
import { useMessages } from "../../../../hooks";

export function MessagesStats() {
  const { data: messages = [] } = useMessages();

  const total = messages.length;
  const handled = messages.filter((m) => m.isHandled).length;
  const pending = total - handled;

  const stats = [
    {
      title: "Total Messages",
      value: total,
      icon: MessageSquare,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Pending",
      value: pending,
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      title: "Handled",
      value: handled,
      icon: CheckCircle2,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <div className={`p-2 rounded-full ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
