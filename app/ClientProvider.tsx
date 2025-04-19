"use client";
import { Provider } from "react-redux";
import { store } from "./state/store";
import { Toaster } from "sonner";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
interface ClientProviderProps {
  children: React.ReactNode;
}

const ClientProvider: React.FC<ClientProviderProps> = ({ children }) => {
  const pathName = usePathname();
  const pathArray = pathName.split("/").slice(1);
  const breadcrumbItems = pathArray.reduce<string[]>((acc, item, index) => {
    const url = `${acc[index - 1] || ""}/${item}`;
    acc.push(url);
    return acc;
  }, []);
  return (
    <Provider store={store}>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="sticky top-0 z-10 backdrop-blur-2xl flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  {breadcrumbItems.map((url, index) => (
                    <div key={index} className="flex items-center">
                      <BreadcrumbItem>
                        {index !== breadcrumbItems.length - 1 ? (
                          <BreadcrumbLink href={url} className="capitalize">
                            {pathArray[index]}
                          </BreadcrumbLink>
                        ) : (
                          <BreadcrumbPage className="capitalize">
                            {pathArray[index]}
                          </BreadcrumbPage>
                        )}
                      </BreadcrumbItem>
                      {index !== pathArray.length - 1 && (
                        <BreadcrumbSeparator className="hidden md:block" />
                      )}
                    </div>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          {children}
        </SidebarInset>
      </SidebarProvider>
      <Toaster richColors closeButton position="bottom-right" />
    </Provider>
  );
};

export default ClientProvider;
