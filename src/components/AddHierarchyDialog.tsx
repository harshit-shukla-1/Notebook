import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface AddHierarchyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: 'folder' | 'project';
  onSubmit: (name: string) => void;
}

const AddHierarchyDialog = ({ open, onOpenChange, type, onSubmit }: AddHierarchyDialogProps) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name);
      setName('');
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-[32px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-black">
            New {type === 'folder' ? 'Folder' : 'Project'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            autoFocus
            placeholder={`Enter ${type} name...`}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-xl bg-secondary/30 border-none h-12"
          />
          <DialogFooter>
            <Button type="submit" className="w-full rounded-xl bg-indigo-600 h-12 font-bold">
              Create
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddHierarchyDialog;