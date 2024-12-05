import React from "react";
import Image from "next/image";
import { FaXTwitter } from "react-icons/fa6";
import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";


import BioLogoSvg from "@/public/images/bio-logo-light.svg";

const Footer = () => {
  return (
    <footer className="bg-[#1A1A40] text-gray-400 py-16">
      <div className="container mx-auto px-4">
        {/* Logo Section */}
        <div className="flex items-center space-x-4 mb-16">
          <div className="relative h-16 w-36">
            <Image
              src="/images/logo-light.png"
              alt="Balıkesir Büyükşehir Belediyesi"
              fill
              className="object-contain"
              unoptimized
            />
          </div>
          <div className="w-0.5 h-20 bg-white"></div>
          <div className="relative h-16 w-20">
            <Image
              src={BioLogoSvg}
              alt="Balıkesir İstihdam Ofisi"
              fill
            />
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Hakkımızda Section */}
          <div className="md:col-span-3 space-y-4">
            <h2 className="text-white text-xl font-medium mb-6">HAKKIMIZDA</h2>
            <p className="text-sm leading-relaxed">
              Balıkesir İstihdam Ofisi, Balıkesir`de özel sektörde iş arayanlar ile işverenleri buluşturmak amacıyla Balıkesir Büyükşehir Belediyesi tarafından 2024 yılında kurulmuştur.
            </p>
            <p className="text-sm leading-relaxed">
              Balıkesir İstihdam Ofisi projesi, Balıkesir`de istihdamın desteklenmesi amacıyla hayata geçirilmiştir. İlk aşamada merkezde kurulan ofisler ve bio.balikesir.bel.tr adresi üzerinden faaliyete geçen Balıkesir İstihdam Ofisleri tüm Balıkesirlere hizmet vermektedir.
            </p>
            <p className="text-sm leading-relaxed">
              Kariyer danışmanlarımız aracılığıyla, iş arayanlar kendilerine en uygun işe, işverenler ise ihtiyaç duydukları işgücüne ulaşma imkanına sahip olmaktadır.
            </p>
          </div>

          {/* Bağlantılar Section */}
          <div className="space-y-4 md:col-span-1">
            <h2 className="text-white text-xl font-medium mb-6">BAĞLANTILAR</h2>
            <ul className="space-y-2">
              <li>
                <a href="/" className="hover:text-white">Anasayfa</a>
              </li>
              <li>
                <a href="/about-us" className="hover:text-white">Hakkımızda</a>
              </li>
              <li>
                <a href="/news" className="hover:text-white">Haberler</a>
              </li>
              <li>
                <a href="/offices" className="hover:text-white">Ofislerimiz</a>
              </li>
            </ul>
          </div>

          {/* Bize Ulaşın Section */}
          <div className="space-y-4 md:col-span-1">
            <h2 className="text-white text-xl font-medium mb-6">BİZE ULAŞIN</h2>
            <ul className="space-y-2">
              <li>
                <a href="/iletisim" className="hover:text-white">İletişim</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Media and Copyright */}
        <div className="mt-16 flex flex-col md:flex-row justify-between items-center">
          <div className="flex space-x-4 mb-4 md:mb-0">
            <a href="#" className="hover:text-white">
              <FaInstagram className="w-6 h-6" />
            </a>
            <a href="#" className="hover:text-white">
              <FaXTwitter className="w-6 h-6" />
            </a>
            <a href="#" className="hover:text-white">
              <FaFacebook className="w-6 h-6" />
            </a>
          </div>
          <div className="text-sm">
            © 2024 Balıkesir Büyükşehir Belediyesi
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
