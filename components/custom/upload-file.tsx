"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { imagesTpye } from "@/types/itemTypes";
import SkeletionImages from "./loading";
import { CircleX } from "lucide-react";
interface UploadFileProps {
  field: any; // Add this line to accept the field object from react-hook-form
  randomColor?: string;
  isLoadingFile: boolean;
  setIsLoadingFile: (value: boolean) => void;
}

const UploadFile: React.FC<UploadFileProps> = ({
  field,
  randomColor,
  isLoadingFile,
  setIsLoadingFile,
}) => {
  const [files, setFiles] = useState<Array<{ file: File }>>([]);

  const dropZoneConfig = {
    accept: ["jpg", "jpeg", "png"],
    maxSize: 1024 * 1024 * 10,
  };

  const handleFileChange = async (file: File) => {
    try {
      setIsLoadingFile(true);
      const data = new FormData();
      data.set("file", file);
      const uploadFile = await fetch("/api/uploadFiles", {
        method: "POST",
        body: data,
      });
      const response = await uploadFile.json();
      let list = field.value as string[]; // Get the current value of the field
      list.push(response.cid); // Add the new cid to the list
      field.onChange(list); // Update the form field with the current cid array
      setIsLoadingFile(false);
    } catch (error) {
      toast.error("Error uploading file");
      setIsLoadingFile(false);
    }
  };

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (files.length + acceptedFiles.length > 6) {
        toast.error("You can only upload up to 6 files.");
        return;
      }

      const errors: string[] = []; // Collect validation errors

      const validFiles = acceptedFiles.filter((file) => {
        // Check if the file already exists
        if (files.some((f) => f.file.name === file.name)) {
          errors.push(`File "${file.name}" already exists.`);
          return false;
        }

        // Validate file type
        if (!dropZoneConfig.accept.some((ext) => file.type.endsWith(ext))) {
          errors.push(`File "${file.name}" has an unsupported file type.`);
          return false;
        }

        // Validate file size
        if ((file.size ?? 0) > dropZoneConfig.maxSize) {
          errors.push(`File "${file.name}" exceeds the maximum size of 10MB.`);
          return false;
        }

        return true; // File is valid
      });

      // Show all errors in a single toast
      if (errors.length > 0) {
        toast.error(errors.join("\n"));
      }

      // Update state with valid files
      setFiles((prevFiles) => [
        ...prevFiles,
        ...validFiles.map((file) => ({ file })),
      ]);

      // Trigger file upload for valid files
      validFiles.forEach((file) => handleFileChange(file));
    },
    [files]
  );
  const handleRemoveFile = async (index: number) => {
    setIsLoadingFile(true);
    const deleteFile = await fetch("/api/deleteFile", {
      method: "DELETE",
      body: JSON.stringify({ fileName: files[index].file.name }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const response = await deleteFile.json();
    if (response.error) {
      toast.error("Error deleting file");
      setIsLoadingFile(false);
      return;
    }
    toast.success("File remove successfully");
    setFiles((prev) => prev.filter((_, i) => i !== index));
    const list = field.value as string[]; // Get the current value of the field
    list.splice(index, 1);
    field.onChange(list);
    setIsLoadingFile(false);
  };
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div
      {...getRootProps({
        className: "flex items-center justify-center w-full",
      })}
    >
      <div className="flex items-center justify-center w-full min-h-64 h-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <div>
            {isLoadingFile ? (
              <div>
                Hang tight pls{" "}
                <span
                  className="loading loading-dots loading-xs"
                  style={{ color: randomColor }}
                ></span>
              </div>
            ) : files.length > 0 ? (
              <div className="flex flex-wrap gap-2 mt-4">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="relative w-[200px] h-[150px] rounded-md overflow-hidden border border-gray-500 dark:border-gray-500"
                  >
                    <Image
                      src={URL.createObjectURL(file.file)}
                      alt="Uploaded image"
                      fill
                      className="rounded-md object-cover"
                      sizes="200px"
                      quality={100}
                    />
                    <CircleX
                      className="absolute top-1 right-2 cursor-pointer"
                      style={{ color: randomColor }}
                      onClick={() => handleRemoveFile(index)}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  PNG, JPG or JPEG (MAX. 10MB)
                </p>
              </div>
            )}
          </div>
        )}
      </div>
      <Input
        {...getInputProps()}
        id="productsImages"
        name="productsImages"
        type="file"
        className="hidden"
        disabled={isLoadingFile}
      />
    </div>
  );
};

export default UploadFile;
