"use client";

import { Badge } from "@packtok/ui/badge";
import { Button } from "@packtok/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@packtok/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@packtok/ui/dialog";
import { Input } from "@packtok/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@packtok/ui/table";
import { Check, Eye, Filter, Search } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useMessages, useUpdateMessageStatus } from "../../../../hooks";
import { ContactInquiry } from "../../../../types/contact";

export function MessagesTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedMessage, setSelectedMessage] = useState<ContactInquiry | null>(null);

  const { data: messages = [], isLoading } = useMessages();
  const updateStatusMutation = useUpdateMessageStatus();

  const handleStatusUpdate = async (id: string) => {
    try {
      await updateStatusMutation.mutateAsync(id);
      toast.success("Inquiry marked as handled");
      if (selectedMessage?.id === id) {
        setSelectedMessage({ ...selectedMessage, isHandled: true });
      }
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const filteredMessages = messages.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "HANDLED" ? m.isHandled : !m.isHandled);
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-6 w-40 rounded bg-gray-200" />
          <div className="h-4 w-64 rounded bg-gray-200 mt-2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-3 border-b">
                <div className="h-4 w-32 rounded bg-gray-200" />
                <div className="h-4 w-40 rounded bg-gray-200" />
                <div className="h-6 w-20 rounded-full bg-gray-200" />
                <div className="h-4 w-24 rounded bg-gray-200" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Inquiries</CardTitle>
        <CardDescription>View and manage messages from the contact form</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="HANDLED">Handled</option>
            </select>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMessages.map((msg) => (
              <TableRow key={msg.id}>
                <TableCell className="font-medium">{msg.name}</TableCell>
                <TableCell>{msg.email}</TableCell>
                <TableCell>
                  {msg.isHandled ? (
                    <Badge variant="default">Handled</Badge>
                  ) : (
                    <Badge variant="secondary">Pending</Badge>
                  )}
                </TableCell>
                <TableCell>{new Date(msg.createdAt).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedMessage(msg)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    {!msg.isHandled && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleStatusUpdate(msg.id)}
                      >
                        <Check className="h-4 w-4 text-green-600" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredMessages.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No messages found.
          </div>
        )}
      </CardContent>

      <Dialog open={!!selectedMessage} onOpenChange={() => setSelectedMessage(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Message from {selectedMessage?.name}</DialogTitle>
            <DialogDescription>
              Received on {selectedMessage && new Date(selectedMessage.createdAt).toLocaleString()}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Email</h4>
              <p>{selectedMessage?.email}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Message</h4>
              <div className="mt-1 p-3 bg-gray-50 rounded-md border text-sm whitespace-pre-wrap">
                {selectedMessage?.message}
              </div>
            </div>
            <div className="flex justify-between items-center pt-4">
              <Badge variant={selectedMessage?.isHandled ? "default" : "secondary"}>
                {selectedMessage?.isHandled ? "Handled" : "Pending"}
              </Badge>
              {!selectedMessage?.isHandled && (
                <Button
                  onClick={() => handleStatusUpdate(selectedMessage!.id)}
                  disabled={updateStatusMutation.isPending}
                >
                  Mark as Handled
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
