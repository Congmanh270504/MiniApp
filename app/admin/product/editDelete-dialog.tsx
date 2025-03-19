"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MoreVertical } from "lucide-react";
import { toggleDropdown } from "@/app/state/modify/modifyItem";
import { RootState } from "@/app/state/store"; // Import RootState
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import EditFormDialog from "@/app/admin/category/edit/editForm-dialog";
import DeleteFormDialog from "./delete/delete-dialog";
import { productType } from "@/types/itemTypes";
export default function EditDeleteDialog({
  product,
}: {
  product: productType;
}) {
  const activeDropdown = useSelector(
    (state: RootState) => state.modifyItem.activeDropdown
  );
  const dispatch = useDispatch();
  return (
    <>
      <button
        className="text-gray-400 hover:text-gray-500"
        onClick={(e) => {
          e.stopPropagation();
          dispatch(toggleDropdown(product.id));
        }}
      >
        <MoreVertical className="h-5 w-5" />
      </button>
      {activeDropdown === product.id && (
        <div
          className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10"
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="py-1"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            <EditFormDialog id={product.id} />
            {/* <DeleteFormDialog id={product.id} /> */}
          </div>
        </div>
      )}
    </>
  );
}
