"use client";

import * as React from "react";
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import getRoleFromToken from "@/utils/getRoleFromTokens";
import { userAPI, companyAPI } from "@/app/api";
import getIdFromToken from "@/utils/getIdFromToken";

const NavigationMenu = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <NavigationMenuPrimitive.Root
    ref={ref}
    className={cn(
      "relative z-10 w-full bg-white border-b border-gray-200",
      className
    )}
    {...props}
  >
    {children}
  </NavigationMenuPrimitive.Root>
));
NavigationMenu.displayName = NavigationMenuPrimitive.Root.displayName;

const NavigationMenuList = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.List>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.List
    ref={ref}
    className={cn(
      "hidden md:flex max-w-screen-xl w-full list-none items-center justify-start px-8 space-x-4",
      className
    )}
    {...props}
  />
));
NavigationMenuList.displayName = NavigationMenuPrimitive.List.displayName;

const NavigationMenuItem = NavigationMenuPrimitive.Item;

const NavigationMenuLink = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Link>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Link> & {
    isActive?: boolean;
  }
>(({ className, isActive, ...props }, ref) => (
  <NavigationMenuPrimitive.Link
    ref={ref}
    className={cn(
      "relative block py-3 px-4 text-base font-medium transition-colors",
      isActive ? "text-black font-semibold" : "text-gray-600",
      "hover:text-black",
      className
    )}
    {...props}
  />
));
NavigationMenuLink.displayName = NavigationMenuPrimitive.Link.displayName;

export function MainNav() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [userName, setUserName] = React.useState<string | null>(null);
  const [companyName, setCompanyName] = React.useState<string | null>(null);
  const [role, setRole] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchUserOrCompanyName = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      const userRole = getRoleFromToken(token);
      setRole(userRole);
      const userId = getIdFromToken(token);

      if (userRole === "JobSeeker") {
        try {
          const response = await userAPI.getById(userId);
          const data = response.data;
          setUserName(data.fullName);
        } catch (error) {
          console.error("Kullanıcı bilgisi alınırken hata:", error);
        }
      } else if (userRole === "Company") {
        try {
          const response = await companyAPI.getById(userId);
          const data = response.data;
          setCompanyName(data.companyName);
        } catch (error) {
          console.error("Şirket bilgisi alınırken hata:", error);
        }
      }
    };

    fetchUserOrCompanyName();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <NavigationMenu>
      <div className="flex items-center justify-between w-full px-4 md:px-8 h-24">
        {/* Logo */}
        <Link href="/">
          <div className="flex items-center space-x-4 cursor-pointer">
            <div className="w-28 h-28 relative">
              <Image
                src="/images/bio-logo.png"
                alt="Balıkesir Logo"
                layout="fill"
                objectFit="contain"
                priority
              />
            </div>
          </div>
        </Link>

        {/* Hamburger Menu (Mobile Only) */}
        <button
          className="md:hidden flex items-center ml-auto"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>

        {/* Desktop Navigation */}
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink href="/" isActive={pathname === "/"}>
              Anasayfa
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              href="/about-us"
              isActive={pathname === "/about-us"}
            >
              Hakkımızda
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink href="/news" isActive={pathname === "/news"}>
              Haberler
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              href="/job-posts"
              isActive={pathname === "/job-posts"}
            >
              İş İlanları
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              href="/offices"
              isActive={pathname === "/offices"}
            >
              Ofislerimiz
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              href="/contact"
              isActive={pathname === "/contact"}
            >
              İletişim
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>

        {/* Kullanıcı veya Şirket Bilgisi */}
        <div className="hidden md:flex space-x-2">
          {userName || companyName ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="bg-black text-white hover:bg-gray-800">
                  {userName || companyName}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Link
                    href={userName ? "/user/profile" : "/company"}
                  >
                    Hesabıma Git
                  </Link>
                </DropdownMenuItem>
                {role === "JobSeeker" && (
                  <DropdownMenuItem>
                    <Link href="/user/settings">Ayarlar</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={handleLogout}>
                  Çıkış Yap
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link href="/user/login">
                <Button variant="outline" className="border-black text-black">
                  Kullanıcı Girişi
                </Button>
              </Link>
              <Link href="/company/login">
                <Button className="bg-black text-white hover:bg-gray-800">
                  Şirket Girişi
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white">
          <ul className="flex flex-col space-y-2 p-4">
            <li>
              <NavigationMenuLink href="/" isActive={pathname === "/"}>
                Anasayfa
              </NavigationMenuLink>
            </li>
            <li>
              <NavigationMenuLink
                href="/about-us"
                isActive={pathname === "/about-us"}
              >
                Hakkımızda
              </NavigationMenuLink>
            </li>
            <li>
              <NavigationMenuLink href="/news" isActive={pathname === "/news"}>
                Haberler
              </NavigationMenuLink>
            </li>
            <li>
              <NavigationMenuLink
                href="/job-posts"
                isActive={pathname === "/job-posts"}
              >
                İş İlanları
              </NavigationMenuLink>
            </li>
            <li>
              <NavigationMenuLink
                href="/offices"
                isActive={pathname === "/offices"}
              >
                Ofislerimiz
              </NavigationMenuLink>
            </li>
            <li>
              <NavigationMenuLink
                href="/contact"
                isActive={pathname === "/contact"}
              >
                İletişim
              </NavigationMenuLink>
            </li>
            {userName || companyName ? (
              <>
                <li>
                  <NavigationMenuLink
                    href={userName ? "/user/profile" : "/company"}
                  >
                    Hesabıma Git
                  </NavigationMenuLink>
                </li>
                {role === "JobSeeker" && (
                  <li>
                    <NavigationMenuLink href="/user/settings">
                      Ayarlar
                    </NavigationMenuLink>
                  </li>
                )}
                <li>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left py-2 px-4 text-base font-medium text-black hover:bg-gray-100 rounded"
                  >
                    Çıkış Yap
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <NavigationMenuLink href="/user/login">
                    Kullanıcı Girişi
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink href="/company/login">
                    Şirket Girişi
                  </NavigationMenuLink>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </NavigationMenu>
  );
}

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
};
