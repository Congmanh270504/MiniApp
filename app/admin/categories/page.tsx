import React from "react";
import { PrismaClient } from "@prisma/client";
import CategoryTable from "./category-table";
async function getData() {
  const prisma = new PrismaClient();
  const data = await prisma.categories.findMany();
  return data;
}

const page = async () => {
  const category = await getData();
  return (
    <div className="w-full overflow-y-scoll no-scollbar">
      <CategoryTable category={category} />
    </div>
  );
};

export default page;
