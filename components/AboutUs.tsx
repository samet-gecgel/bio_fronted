import React from "react";

const AboutUs = () => {
  return (
    <div className="bg-white py-16 px-4 md:px-24">
      <div className="max-w-5xl mx-auto">
        {/* Başlık */}
        <h1 className="text-4xl font-bold text-blue-600 mb-12 tracking-tight">
          Hakkımızda
        </h1>
        
        <div className="grid grid-cols-12 gap-8">
          {/* Sol Çizgi */}
          <div className="col-span-1 hidden md:block">
            <div className="w-1 h-full bg-blue-600 mx-auto"></div>
          </div>

          {/* Metin Alanı */}
          <div className="col-span-12 md:col-span-11 space-y-6 text-gray-800 leading-relaxed">
            <p>
              <strong>Balıkesir İstihdam Ofisi</strong>, Balıkesirde özel sektörde iş arayanlar ile işverenleri
              buluşturmak amacıyla Balıkesir Büyükşehir Belediyesi tarafından 2024 yılında
              kurulmuştur.
            </p>
            <p>
              Balıkesir İstihdam Ofisi projesi, Balıkesir’de istihdamın desteklenmesi amacıyla
              hayata geçirilmiştir. İlk aşamada merkezde kurulan ofisler ve{" "}
              <a
                href="https://bio.balikesir.bel.tr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-black font-semibold no-underline"
              >
                bio.balikesir.bel.tr
              </a>{" "}
              adresi üzerinden faaliyete geçen Balıkesir İstihdam Ofisleri tüm Balıkesirlere
              hizmet vermektedir.
            </p>
            <p>
              Kariyer danışmanlarımız aracılığıyla, iş arayanlar kendilerine en uygun işe,
              işverenler ise ihtiyaç duydukları işgücüne ulaşma imkanına sahip olmaktadır.
            </p>
            <h3 className="text-xl font-semibold text-black mt-6">
              İş arıyorsanız;
            </h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>
                Kariyer danışmanlarımız eşliğinde özgeçmişinizi oluşturabilir ve kendinize en
                uygun iş fırsatlarını inceleyebilirsiniz.
              </li>
              <li>
                Web sitemiz üzerinden aday profili oluşturarak aktif iş ilanlarını inceleyebilirsiniz.
              </li>
            </ul>
            <h3 className="text-xl font-semibold text-black mt-6">
              Çalışan arıyorsanız;
            </h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>
                Kariyer danışmanlarımız aracılığıyla uygun adaylara ulaşabilir,
              </li>
              <li>
                Web sitemiz üzerinden şirket profili oluşturarak ücretsiz olarak ilan verebilirsiniz.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
