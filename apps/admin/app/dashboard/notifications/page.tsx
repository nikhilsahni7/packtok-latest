"use client";

import { Button } from "@packtok/ui/components/button";
import { Input } from "@packtok/ui/components/input";
import { useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import {
  useAdminNotifications,
  useSendAdminNotification,
} from "../../../hooks/useAdminNotifications";
import { useAdminUsers } from "../../../hooks/useUsers";

export default function NotificationsPage() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [actionUrl, setActionUrl] = useState("");
  const [audienceMode, setAudienceMode] = useState<"ALL" | "CUSTOM">("ALL");
  const [userSearch, setUserSearch] = useState("");
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  const { data: users = [] } = useAdminUsers();
  const { data: notifications, isLoading: isLoadingNotifications } =
    useAdminNotifications(1, 20);
  const sendNotification = useSendAdminNotification();

  const filteredUsers = useMemo(() => {
    const q = userSearch.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(q) ||
        user.email.toLowerCase().includes(q),
    );
  }, [users, userSearch]);

  const allFilteredSelected =
    filteredUsers.length > 0 &&
    filteredUsers.every((user) => selectedUserIds.includes(user.id));

  const toggleUserSelection = (userId: string) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  const selectAllFiltered = () => {
    setSelectedUserIds((prev) => {
      const map = new Set(prev);
      filteredUsers.forEach((user) => map.add(user.id));
      return Array.from(map);
    });
  };

  const unselectAllFiltered = () => {
    const filteredIds = new Set(filteredUsers.map((user) => user.id));
    setSelectedUserIds((prev) => prev.filter((id) => !filteredIds.has(id)));
  };

  const submit = async () => {
    if (!title.trim() || !message.trim()) {
      toast.error("Title and message are required");
      return;
    }

    if (audienceMode === "CUSTOM" && selectedUserIds.length === 0) {
      toast.error("Select at least one user");
      return;
    }

    await sendNotification.mutateAsync({
      title: title.trim(),
      message: message.trim(),
      audience: audienceMode === "ALL" ? "ALL_USERS" : "CUSTOM_USERS",
      targetUserIds: audienceMode === "CUSTOM" ? selectedUserIds : undefined,
      actionUrl: actionUrl.trim() || undefined,
    });

    setTitle("");
    setMessage("");
    setActionUrl("");
    if (audienceMode === "CUSTOM") {
      setSelectedUserIds([]);
    }
  };

  return (
    <div className="p-8 space-y-6 bg-slate-50/30 min-h-screen">
      <div>
        <h1 className="text-3xl font-black text-slate-900">Notifications</h1>
        <p className="text-sm text-slate-600 mt-1">
          Send notifications to all users or selected users.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-7 bg-white border rounded-2xl p-5 space-y-4">
          <h2 className="text-lg font-bold text-slate-900">
            Send Notification
          </h2>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Notification title"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Message
            </label>
            <textarea
              className="w-full min-h-28 rounded-md border border-input bg-transparent px-3 py-2 text-sm"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your message"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Action URL (optional)
            </label>
            <Input
              value={actionUrl}
              onChange={(e) => setActionUrl(e.target.value)}
              placeholder="/marketplace or https://..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Audience
            </label>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant={audienceMode === "ALL" ? "default" : "outline"}
                onClick={() => setAudienceMode("ALL")}
              >
                All Users
              </Button>
              <Button
                type="button"
                variant={audienceMode === "CUSTOM" ? "default" : "outline"}
                onClick={() => setAudienceMode("CUSTOM")}
              >
                Selected Users
              </Button>
            </div>
          </div>

          {audienceMode === "CUSTOM" && (
            <div className="space-y-3 border rounded-xl p-4 bg-slate-50/60">
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:justify-between">
                <Input
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  placeholder="Search users by name or email"
                  className="md:max-w-sm"
                />
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={selectAllFiltered}
                  >
                    Select All
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={unselectAllFiltered}
                  >
                    Unselect All
                  </Button>
                </div>
              </div>

              <p className="text-xs text-slate-500">
                Selected: {selectedUserIds.length}
                {allFilteredSelected ? " (all visible selected)" : ""}
              </p>

              <div className="max-h-64 overflow-auto border rounded-lg bg-white">
                {filteredUsers.length === 0 ? (
                  <p className="p-3 text-sm text-slate-500">No users found.</p>
                ) : (
                  <ul>
                    {filteredUsers.map((user) => {
                      const checked = selectedUserIds.includes(user.id);
                      return (
                        <li key={user.id} className="border-b last:border-b-0">
                          <label className="flex items-center gap-3 px-3 py-2 text-sm cursor-pointer hover:bg-slate-50">
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => toggleUserSelection(user.id)}
                            />
                            <span className="font-medium text-slate-900">
                              {user.name}
                            </span>
                            <span className="text-slate-500">{user.email}</span>
                          </label>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </div>
          )}

          <div>
            <Button onClick={submit} disabled={sendNotification.isPending}>
              {sendNotification.isPending ? "Sending..." : "Send Notification"}
            </Button>
          </div>
        </div>

        <div className="xl:col-span-5 bg-white border rounded-2xl p-5 space-y-4">
          <h2 className="text-lg font-bold text-slate-900">
            Recent Notifications
          </h2>
          {isLoadingNotifications ? (
            <p className="text-sm text-slate-500">Loading notifications...</p>
          ) : (notifications?.data?.length ?? 0) === 0 ? (
            <p className="text-sm text-slate-500">No notifications sent yet.</p>
          ) : (
            <div className="space-y-3 max-h-[640px] overflow-auto pr-1">
              {notifications?.data.map((item) => (
                <div key={item.id} className="border rounded-xl p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold text-slate-900 text-sm">
                      {item.title}
                    </p>
                    <span className="text-[11px] rounded-full px-2 py-1 bg-slate-100 text-slate-600">
                      {item.audience}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mt-1">{item.message}</p>
                  <p className="text-xs text-slate-400 mt-2">
                    {new Date(item.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
