import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ICertificate } from "@/types/certificate";

interface CertificatesTableProps {
  certificates: ICertificate[];
}

export const CertificatesTable: React.FC<CertificatesTableProps> = ({
  certificates,
}) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-3/4">Sertifika Adı</TableHead>
            <TableHead className="w-1/4 text-right">Veriliş Tarihi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {certificates.map((certificate) => (
            <TableRow key={certificate.id}>
              <TableCell>{certificate.certificateName}</TableCell>
              <TableCell className="text-right">
                {new Date(certificate.issueDate).toLocaleDateString("tr-TR")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
