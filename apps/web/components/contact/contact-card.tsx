import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@packtok/ui/components/card";
import { ReactNode } from "react";

type ContactCardProps = {
  icon: ReactNode;
  title: string;
  content: string;
  content2?: string;
};

export default function ContactCard({
  icon,
  title,
  content,
  content2
}: ContactCardProps) {
  return (
    <Card className="md:w-[33%] w-full bg-gray-100  border-none">
      <div className="flex p-5 flex-col justify-between w-full h-full items-center text-center">
        <div className="flex flex-col gap-4">
        <CardHeader>{icon}</CardHeader>

          <CardTitle className="text-lg font-medium">{title}</CardTitle>
          <CardContent className="text-gray-500">{content}</CardContent>
          <CardContent className="text-gray-500">{content2}</CardContent>

        </div>
      </div>
    </Card>
  );
}
