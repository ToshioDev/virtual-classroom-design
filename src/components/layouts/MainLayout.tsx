
import { SidebarProvider } from "@/components/ui/sidebar";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { ModeToggle } from "@/components/mode-toggle";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-secondary-50 dark:bg-gray-950">
          <main className="flex-1 px-4 sm:px-6 lg:px-8">
            <div className="absolute right-4 top-4">
              <ModeToggle />
            </div>
            {children}
          </main>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
}
