"use client";

import React, { useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface UploadFileProps {
  imageURL: string[];
  setImageURL: React.Dispatch<React.SetStateAction<string[]>>;
  field: any; // Add this line to accept the field object from react-hook-form
}

const UploadFile: React.FC<UploadFileProps> = ({
  imageURL,
  setImageURL,
  field, // Add this line to accept the field object from react-hook-form
}) => {
  const prevImageURLRef = useRef<string[]>(imageURL);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      try {
        const uploadedURLs = await Promise.all(
          Array.from(files).map(async (file) => {
            const data = new FormData();
            data.set("file", file);
            const response = await fetch("/api/uploadFiles", {
              method: "POST",
              body: data,
            });
            if (!response.ok) {
              throw new Error("Failed to upload file");
            }
            const signURL = await response.json();
            return signURL;
          })
        );
        if (imageURL.find((item) => uploadedURLs.includes(item))) {
          toast.error("Already uploaded");
        } else {
          setImageURL((prev) => {
            const newURLs = [...prev, ...uploadedURLs];
            return Array.from(new Set(newURLs)); // Ensure unique URLs
          });
        }
      } catch (error) {
        console.error("Error uploading files:", error);
        toast.error("Failed to upload files. Please try again.");
      }
    }
  };

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const handleClosed = (url: string) => {
    setImageURL((prev) => {
      const newURLs = prev.filter((item) => item !== url);
      return newURLs;
    });
  };

  // Update the form field when imageURL changes
  useEffect(() => {
    if (prevImageURLRef.current !== imageURL) {
      field.onChange(imageURL);
      prevImageURLRef.current = imageURL;
    }
  }, [imageURL, field]);

  return (
    <div className="flex items-center justify-center w-full">
      <Label
        htmlFor="productsImages"
        className="flex items-center justify-center w-full min-h-64 h-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
      >
        {imageURL.length > 0 ? (
          <div className="grid grid-cols-3 gap-2 p-2">
            {imageURL.map((url, i) => (
              <div
                className="relative w-[200px] h-[150px] rounded-md overflow-hidden border border-gray-500 dark:border-gray-500"
                key={i}
              >
                <Image
                  src={url || "/placeholder.svg"}
                  alt="Uploaded image"
                  fill
                  className="object-cover"
                />
                <Button
                  variant="outline"
                  className="absolute top-1 right-1 border-none rounded-full bg-[#EAEAEA] text-[#443627] px-3 py-22"
                  onClick={() => handleClosed(url)}
                >
                  X
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg
              className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 16"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
              />
            </svg>
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold">Click to upload</span> or drag and
              drop
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              SVG, PNG, JPG or GIF (MAX. 800x400px)
            </p>
          </div>
        )}
        <Input
          id="productsImages"
          type="file"
          className="hidden"
          name="productsImages"
          ref={fileInputRef}
          onChange={handleFileChange}
        />
      </Label>
    </div>
  );
};

export default UploadFile;
