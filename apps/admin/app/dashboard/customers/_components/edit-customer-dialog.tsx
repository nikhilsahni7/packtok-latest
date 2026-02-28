"use client";

import { Button } from "@packtok/ui/components/button";
import { Input } from "@packtok/ui/components/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@packtok/ui/components/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@packtok/ui/dialog";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { AdminUser, useUpdateUser } from "../../../../hooks/useUsers";

interface EditCustomerDialogProps {
  customer: AdminUser | null;
  onClose: () => void;
}

const ROLES = [
  { value: "NORMAL_USER", label: "Normal User" },
  { value: "VENDOR", label: "Vendor" },
  { value: "ADMIN", label: "Admin" },
];

export function EditCustomerDialog({
  customer,
  onClose,
}: EditCustomerDialogProps) {
  const updateUser = useUpdateUser();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("");
  const [country, setCountry] = useState("");

  useEffect(() => {
    if (customer) {
      setName(customer.name || "");
      setPhone(customer.phone_number || "");
      setRole(customer.role || "NORMAL_USER");
      setCountry(customer.country || "IN");
    }
  }, [customer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer) return;

    await updateUser.mutateAsync({
      id: customer.id,
      data: {
        name: name.trim(),
        phone_number: phone.trim() || null,
        role,
        country: country.trim() || null,
      },
    });
    onClose();
  };

  return (
    <Dialog open={!!customer} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Update details for {customer?.name}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Email</label>
            <Input
              value={customer?.email || ""}
              disabled
              className="bg-slate-50 text-slate-500"
            />
            <p className="text-xs text-slate-400">Email cannot be changed</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Phone</label>
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91XXXXXXXXXX"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Role</label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {ROLES.map((r) => (
                  <SelectItem key={r.value} value={r.value}>
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Country
            </label>
            <Input
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="e.g. IN"
            />
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={updateUser.isPending}>
              {updateUser.isPending && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
