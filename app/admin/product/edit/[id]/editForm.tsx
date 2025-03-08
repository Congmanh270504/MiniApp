"use client";
import React, { useState } from "react";
import * as z from "zod";
import { formSchema } from "../../form-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import UploadFile from "@/components/own/upload-file";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createProduct } from "@/app/action/toDoAction";
import { productType } from "@/types/productType";

const EditForm = ({ product }: { product: productType }) => {
  const [imageURL, setImageURL] = useState<string[]>(
    product.img ? product.img.map((img) => img.url) : []
  );
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productName: "",
      price: 0,
      categoryId: 0,
      productsImages: [],
    },
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setIsUploading(true);
      const uploadedURLs = await Promise.all(
        Array.from(files).map(async (file) => {
          const data = new FormData();
          data.set("file", file);
          const response = await fetch("/api/uploadFiles", {
            method: "POST",
            body: data,
          });
          const signURL = await response.json();
          return signURL;
        })
      );
      setImageURL((prev) => [...prev, ...uploadedURLs]);
      setIsUploading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const response = await createProduct(formData, imageURL);
      if (response.ok) {
        toast.success("Thêm sản phẩm thành công.");
        router.push("/");
        router.refresh();
      } else {
        toast.error("Đã xảy ra lỗi. Vui lòng thử lại");
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi thêm sản phẩm. Vui lòng thử lại.");
    } finally {
      router.push("/");
    }
  };

  return (
    <div className="mt-2">
      <Form {...form}>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col p-2 md:p-5 w-full mx-auto rounded-md max-w-3xl gap-2 border"
        >
          <h2 className="text-2xl font-bold">Eidt product</h2>
          <p className="text-base">Please fill the form below to contact us</p>

          <div className="flex items-center justify-between flex-wrap sm:flex-nowrap w-full gap-2">
            <FormField
              control={form.control}
              name="productName"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Product name</FormLabel> *
                  <FormControl>
                    <Input
                      placeholder="Enter your name"
                      name="productName"
                      type={"text"}
                      value={product.productName}
                      onChange={(e) => {
                        const val = e.target.value;
                        field.onChange(val);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Price</FormLabel> *
                  <FormControl>
                    <Input
                      placeholder="Enter product price"
                      type={"number"}
                      name="price"
                      value={product.price}
                      onChange={(e) => {
                        const val = e.target.value;
                        field.onChange(+val);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Category</FormLabel> *
                <FormControl>
                  <Input
                    placeholder="Enter your text"
                    type={"number"}
                    name="categoryId"
                    value={product.categoryId}
                    onChange={(e) => {
                      const val = e.target.value;
                      field.onChange(+val);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="productsImages"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Upload file image</FormLabel> *
                <FormControl>
                  <UploadFile
                    imageURL={imageURL}
                    handleFileChange={handleFileChange}
                    setImageURL={setImageURL}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end items-center w-full pt-3 gap-8">
            <Button className="rounded-lg" size="sm" variant="destructive">
              Cancel
            </Button>

            <Button
              className="rounded-lg"
              size="sm"
              onClick={() => setIsSubmitting(true)}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EditForm;
