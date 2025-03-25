"use server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/utils/prisma";
import { object } from "zod";
import { ObjectId } from "mongodb";
import { productImageType } from "@/types/itemTypes";
import { productType } from "@/types/itemTypes";

export async function createProduct(
  data: productType,
  productsImages: productImageType[]
) {
  if (!data.productName.trim()) {
    return { ok: false, message: "Product name is required" };
  }
  try {
    const product = await prisma.products.create({
      data: {
        productName: data.productName,
        price: data.price,
        categoryId: data.Category?.id, // bug here
        img: {
          create: productsImages.map((img) => ({
            cid: img.cid,
            url: img.url,
          })),
        },
      },
    });
    revalidatePath("/");
    return { ok: true, message: "Product created successfully" };
  } catch (error) {
    console.error("Error creating product:", error);
    return { ok: false, message: "Failed to create product" };
  }
}
export async function deleteProduct(id: string) {
  try {
    if (!id.trim()) {
      return;
    }
    await prisma.images.deleteMany({
      where: {
        productId: new ObjectId(id).toString(),
      },
    });
    await prisma.products.delete({
      where: {
        id: new ObjectId(id).toString(),
      },
    });
    revalidatePath("/");
    return { ok: true, message: "Product deleted successfully" };
  } catch (error) {
    return { ok: false, message: "Failed to delete product" };
  }
}
export async function updateProduct(
  formData: FormData,
  productsImages: string[] = [],
  id: string
) {
  const productName = formData.get("productName") as string;
  const price = parseFloat(formData.get("price") as string);
  const categoryId = formData.get("categoryId") as string;
  console.log(productName, price, categoryId);

  if (!productName.trim()) {
    return { ok: false, message: "Product name is required" };
  }
  try {
    await prisma.images.deleteMany({
      where: {
        productId: new ObjectId(id).toString(),
      },
    });

    await prisma.products.update({
      where: {
        id: new ObjectId(id).toString(),
      },
      data: {
        productName: productName,
        price: price,
        categoryId: categoryId,
        // img: {
        //   create: productsImages.map((url) => ({ // bug here
        //     cid: url,
        //   })),
        // },
      },
    });
    return { ok: true, message: "Product updated successfully" };
  } catch (error) {
    return { ok: false, message: "Failed to update product" };
  }
}
