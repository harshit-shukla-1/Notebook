import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface AddHierarchyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: 'folder' | 'project';
  onSubmit: (name: string) => void;
  initialValue?: string;
  isEditing?: boolean;
}

const AddHierarchyDialog = ({ 
  open, 
  onOpenChange, 
  type, 
  onSubmit, 
  initialValue = '', 
  isEditing = false 
}: AddHierarchyDialogProps) => {
  const [name, setName] = useState(initialValue);

  useEffect(() => {
    if (open) setName(initialValue);
  }, [open, initialValue]);

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
            {isEditing ? `Rename ${type}` : `New ${type}`}
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
              {isEditing ? 'Save Changes' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddHierarchyDialog;