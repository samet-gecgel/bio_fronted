import { AtSign, Building, MapPin, Phone, User, Users } from "lucide-react";
import { CardContent } from "@/components/ui/card";
import { ICompany } from "@/types/company";
import { employeesRangeLabels } from "@/utils/enumTypeConvert";

interface CompanyInfoProps {
  company: ICompany;
}

export function CompanyInfo({
  company
}: CompanyInfoProps) {
  const details = [
    { icon: User, label: "Ad ve Soyad", value: company.fullName },
    { icon: AtSign, label: "Email", value: company.email },
    { icon: Phone, label: "Şirket Telefonu", value: company.phone },
    { icon: MapPin, label: "İlçe", value: company.district },
    { icon: Building, label: "VKN", value: company.vkn },
    { icon: Users, label: "Şehir Çalışanları", value: employeesRangeLabels[company.employeesInCity] },
    { icon: Users, label: "Ülke Çalışanları", value: employeesRangeLabels[company.employeesInCountry] },
  ];

  return (
    <CardContent className="mt-6">
      <div className="grid gap-4 md:grid-cols-2">
        {details.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-center space-x-4">
            <div className="rounded-lg border bg-card p-2">
              <Icon className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-medium leading-none">{label}</p>
              <p className="text-sm text-muted-foreground">{value}</p>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  );
}
