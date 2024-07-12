"use client"

import Link from "next/link"
import {
  CircleUser,
  Home,
  Menu,
  Package,
  Package2,
  Search,
  ShoppingCart,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { SearchProductCard } from "@/components/search-product-card"
import SavedItemsList from "@/components/saved-items"
import { AllProducts } from "@/components/all-products"
import { useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import { useSavedItems } from "@/contexts/SavedItemsContext";




export function HomeDashboard({ data, user }: any) {
    const supabase = createClient();
    const router = useRouter();
    async function handleSignOut() {
      await supabase.auth.signOut();
      router.replace("/login");
    }

    const [showSavedItems, setShowSavedItems] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const { savedItems } = useSavedItems();

    return (
        <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
          <div className="hidden border-r bg-muted/40 md:block">
            <div className="flex h-full max-h-screen flex-col gap-2">
              <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                <Link href="/" className="flex items-center gap-2 font-semibold">
                  <Package2 className="h-6 w-6" />
                  <span className="">Catalogue</span>
                </Link>
              </div>
              <div className="flex-1">
                <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                  <p className="px-3 py-2">Logged in as {data.user.email}</p>
                  <Link
                    href=""
                    className="flex items-center gap-3 rounded-lg  px-3 py-2 text-muted-foreground hover:text-primary" onClick={() => setShowSavedItems(false)}
                  >
                    <Home className="h-4 w-4" />
                    All products
                  </Link>
                  <Link
                    href=""
                    className="flex items-center gap-3 rounded-lg  px-3 py-2 text-muted-foreground transition-all hover:text-primary" onClick={() => setShowSavedItems(true)}
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Saved items
                    <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                      {savedItems.length}
                    </Badge>
                  </Link>
                  <Link
                    href="/contact"
                    className="flex items-center gap-3 rounded-lg  px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                  >
                    <Package className="h-4 w-4" />
                    Contact
                  </Link>
                </nav>
              </div>
              {user?.role === "admin" && <div className="mt-auto p-4 items-end">
                <Card x-chunk="dashboard-02-chunk-0">
                  <CardHeader className="p-2 pt-0 md:p-4">
                    <CardTitle>Admin page</CardTitle>
                  </CardHeader>
                  <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
                    <Button size="sm" className="w-full">
                      <Link href="/admin">Upload excel file</Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>}
            </div>
          </div>
          <div className="flex flex-col">
            <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="shrink-0 md:hidden"
                  >
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle navigation menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="flex flex-col">
                  <nav className="grid gap-2 text-lg font-medium">
                    <Link
                      href="/"
                      className="flex items-center gap-2 text-lg font-semibold"
                    >
                      <Package2 className="h-6 w-6" />
                      <span className="sr-only">Catalogue</span>
                    </Link>
                    <Link
                      href=""
                      className="mx-[-0.65rem] flex items-center gap-4 rounded-xl  px-3 py-2 focus:text-foreground text-muted-foreground hover:text-foreground" onClick={() => setShowSavedItems(false)}
                    >
                      <Home className="h-5 w-5" />
                      All products
                    </Link>
                    <Link
                      href="#"
                      className="mx-[-0.65rem] flex items-center gap-4 rounded-xl  px-3 py-2 focus:text-foreground text-muted-foreground hover:text-foreground" onClick={() => setShowSavedItems(true)}
                    >
                      <ShoppingCart className="h-5 w-5" />
                      Saved items
                      <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                        {savedItems.length}
                      </Badge>
                    </Link>
                    <Link
                      href="/contact"
                      className="mx-[-0.65rem] flex items-center gap-4 rounded-xl  px-3 py-2 focus:text-foreground text-muted-foreground hover:text-foreground"
                    >
                      <Package className="h-5 w-5" />
                      Contact
                    </Link>
                  </nav>
                  {user?.role === "admin" && <div className="mt-auto">
                <Card x-chunk="dashboard-02-chunk-0">
                  <CardHeader className="p-2 pt-0 md:p-4">
                    <CardTitle>Admin page</CardTitle>
                  </CardHeader>
                  <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
                    <Button size="sm" className="w-full">
                      <Link href="/admin">Upload excel file</Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>}
                </SheetContent>
              </Sheet>
              <div className="w-full flex-1">
                <form>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search product id's..."
                      className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
                      value={searchTerm}
                      onChange={(event) => setSearchTerm(event.target.value)}
                    />
                  </div>
                </form>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="secondary" size="icon" className="rounded-full bg-background">
                    <CircleUser className="h-5 w-5" />
                    <span className="sr-only">Toggle user menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleSignOut}>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </header>
            {showSavedItems === false ? (
              <>
                {searchTerm ? (
                  <main className="grid grid-cols-1 my-auto mx-2"><SearchProductCard searchTerm={searchTerm} /></main>
                ) : (
                  <main className="grid grid-cols-2 lg:grid-cols-3 gap-4 p-4 lg:gap-6 lg:p-6">
                    <AllProducts />
                    <AllProducts />
                    <AllProducts />
                    <AllProducts />
                    <AllProducts />
                    <AllProducts />
                    <AllProducts />
                    <AllProducts />
                    <AllProducts />
                    <AllProducts />
                  </main>
                )}
              </>
            ) : (
              <main className="grid grid-cols-1 text-black bg-primary my-auto mx-2 rounded-lg">
                {searchTerm ? (
                  <SearchProductCard searchTerm={searchTerm} />
                ) : (
                  <SavedItemsList showSavedItems={showSavedItems} setShowSavedItems={setShowSavedItems} />
                )}
              </main>
            )}
          </div>
        </div>
      );

}