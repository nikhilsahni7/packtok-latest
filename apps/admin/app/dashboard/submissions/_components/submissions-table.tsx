"use client";

import { Badge } from "@packtok/ui/badge";
import { Button } from "@packtok/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@packtok/ui/components/alert-dialog";
import { Input } from "@packtok/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@packtok/ui/table";
import { Check, Eye, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import {
    Submission,
    useApproveSubmission,
    useRejectSubmission,
    useSubmissions,
} from "../../../../hooks";
import { SubmissionDetailsDialog } from "./submission-details-dialog";

interface SubmissionsTableProps {
  initialSubmissions?: Submission[];
}

export function SubmissionsTable({
  initialSubmissions = [],
}: SubmissionsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("PENDING_APPROVAL");
  const [selectedSubmission, setSelectedSubmission] =
    useState<Submission | null>(null);

  const {
    data: submissions = initialSubmissions,
    isLoading,
    error,
  } = useSubmissions();
  const approveMutation = useApproveSubmission();
  const rejectMutation = useRejectSubmission();

  useEffect(() => {
    if (error) {
      toast.error("Failed to fetch submissions");
    }
  }, [error]);

  const handleApproval = async (
    submissionId: string,
    action: "approve" | "reject",
  ) => {
    try {
      if (action === "approve") {
        await approveMutation.mutateAsync(submissionId);
      } else {
        await rejectMutation.mutateAsync(submissionId);
      }

      toast.success(
        `Submission ${action === "approve" ? "approved" : "rejected"} successfully`,
      );
    } catch (error) {
      toast.error(`Failed to ${action} submission`);
    }
  };

  const filteredSubmissions = submissions.filter((submission) => {
    const matchesSearch =
      submission.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || submission.submissionStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING_APPROVAL":
        return <Badge variant="secondary">Pending</Badge>;
      case "APPROVED":
        return <Badge variant="default">Approved</Badge>;
      case "REJECTED":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getConditionBadge = (condition: string) => {
    return condition === "NEW" ? (
      <Badge variant="default">New</Badge>
    ) : (
      <Badge variant="secondary">Used</Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm animate-pulse">
        <div className="p-6 border-b">
          <div className="flex items-center space-x-4">
            <div className="h-10 w-64 rounded-md bg-gray-200" />
            <div className="h-10 w-36 rounded-md bg-gray-200" />
          </div>
        </div>
        <div className="divide-y">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-4">
              <div className="h-4 w-40 rounded bg-gray-200" />
              <div className="h-4 w-24 rounded bg-gray-200" />
              <div className="h-6 w-16 rounded-full bg-gray-200" />
              <div className="h-4 w-20 rounded bg-gray-200" />
              <div className="h-6 w-20 rounded-full bg-gray-200" />
              <div className="h-4 w-28 rounded bg-gray-200" />
              <div className="h-4 w-24 rounded bg-gray-200" />
              <div className="h-8 w-24 rounded bg-gray-200" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Search and Filters */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search submissions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="PENDING_APPROVAL">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
            <option value="all">All</option>
          </select>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="py-4 px-6">Title</TableHead>
            <TableHead className="py-4 px-6">Type</TableHead>
            <TableHead className="py-4 px-6">Condition</TableHead>
            <TableHead className="py-4 px-6">Price</TableHead>
            <TableHead className="py-4 px-6">Status</TableHead>
            <TableHead className="py-4 px-6">Submitted By</TableHead>
            <TableHead className="py-4 px-6">Date</TableHead>
            <TableHead className="py-4 px-6 w-[150px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredSubmissions.map((submission) => (
            <TableRow key={submission.id}>
              <TableCell className="py-4 px-6 font-medium">
                {submission.title}
              </TableCell>
              <TableCell className="py-4 px-6">
                {submission.productType.replace("_", " ")}
              </TableCell>
              <TableCell className="py-4 px-6">
                {getConditionBadge(submission.condition)}
              </TableCell>
              <TableCell className="py-4 px-6">
                {submission.currency || "INR"} {Number(submission.price).toLocaleString()}
              </TableCell>
              <TableCell className="py-4 px-6">
                {getStatusBadge(
                  submission.submissionStatus || "PENDING_APPROVAL",
                )}
              </TableCell>
              <TableCell className="py-4 px-6">
                {submission.createdByUser?.name || "Unknown"}
              </TableCell>
              <TableCell className="py-4 px-6">
                {new Date(submission.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell className="py-4 px-6">
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedSubmission(submission)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>

                  {/* Approve button - show for PENDING and REJECTED */}
                  {submission.submissionStatus !== "APPROVED" && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-green-600 hover:text-green-800"
                          title="Approve"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Approve Submission?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to approve the submission
                            &quot;{submission.title}&quot;? This will make it
                            available as a marketplace product.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() =>
                              handleApproval(submission.id, "approve")
                            }
                            className="bg-green-600 hover:bg-green-700"
                          >
                            {approveMutation.isPending
                              ? "Approving..."
                              : "Approve"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}

                  {/* Reject button - show for PENDING and APPROVED */}
                  {submission.submissionStatus !== "REJECTED" && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-800"
                          title={submission.submissionStatus === "APPROVED" ? "Revert / Reject" : "Reject"}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            {submission.submissionStatus === "APPROVED"
                              ? "Revert Approval & Reject?"
                              : "Reject Submission?"}
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            {submission.submissionStatus === "APPROVED"
                              ? `Are you sure you want to revert and reject the submission "${submission.title}"? This will remove it from the marketplace.`
                              : `Are you sure you want to reject the submission "${submission.title}"?`}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() =>
                              handleApproval(submission.id, "reject")
                            }
                            className="bg-red-600 hover:bg-red-700"
                          >
                            {(() => {
                              if (rejectMutation.isPending) return "Rejecting...";
                              if (submission.submissionStatus === "APPROVED") return "Revert & Reject";
                              return "Reject";
                            })()}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Empty State */}
      {filteredSubmissions.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500">
            <p className="text-lg font-medium text-gray-900 mb-2">
              No submissions found
            </p>
            <p className="text-gray-600">
              {searchTerm
                ? "Try adjusting your search criteria."
                : "No submissions to review."}
            </p>
          </div>
        </div>
      )}

      <SubmissionDetailsDialog
        submission={selectedSubmission}
        onClose={() => setSelectedSubmission(null)}
      />
    </div>
  );
}
