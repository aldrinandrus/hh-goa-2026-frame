"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { randomBuilderTitle } from "@/lib/builder-titles";

interface BuilderFormProps {
  name: string;
  role: string;
  twitter: string;
  builderTitle: string;
  onChange: (field: "name" | "role" | "twitter" | "builderTitle", value: string) => void;
}

export function BuilderForm({
  name,
  role,
  twitter,
  builderTitle,
  onChange,
}: BuilderFormProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => onChange("name", e.target.value)}
          placeholder="Ada Lovelace"
          autoComplete="name"
          maxLength={40}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="role">Role / Stack</Label>
        <Input
          id="role"
          value={role}
          onChange={(e) => onChange("role", e.target.value)}
          placeholder="Full Stack · AI × Crypto"
          maxLength={48}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="twitter">Twitter / X (optional)</Label>
        <Input
          id="twitter"
          value={twitter}
          onChange={(e) => onChange("twitter", e.target.value.replace(/^@/, ""))}
          placeholder="username"
          maxLength={32}
        />
      </div>
      <div className="space-y-2">
        <Label>Builder Title</Label>
        <div className="flex gap-2">
          <Input value={builderTitle} readOnly aria-live="polite" />
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Reroll builder title"
            onClick={() => onChange("builderTitle", randomBuilderTitle())}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
