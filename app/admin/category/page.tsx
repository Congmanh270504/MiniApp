import React from "react";
import { PrismaClient } from "@prisma/client";
import CategoryTable from "./category-table";

async function getData() {
  const prisma = new PrismaClient();
  const data = await prisma.category.findMany();
  return data;
}

const page = async () => {
  const category = await getData();
  return (
    <div className="w-full bg-gray-50">
      <h1>Category</h1>
      <CategoryTable category={category} />
    </div>
  );
};

export default page;
