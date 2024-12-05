import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const recentApplications = [
  {
    name: "Ahmet Yılmaz",
    email: "ahmet@example.com",
    position: "Senior Developer",
    date: "2024-02-20",
  },
  {
    name: "Ayşe Demir",
    email: "ayse@example.com",
    position: "UI Designer",
    date: "2024-02-19",
  },
  {
    name: "Mehmet Kaya",
    email: "mehmet@example.com",
    position: "Product Manager",
    date: "2024-02-18",
  },
]

export function RecentApplications() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Aday</TableHead>
          <TableHead>Pozisyon</TableHead>
          <TableHead>Başvuru Tarihi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {recentApplications.map((application) => (
          <TableRow key={application.email}>
            <TableCell className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback>
                  {application.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-medium">{application.name}</span>
                <span className="text-sm text-muted-foreground">
                  {application.email}
                </span>
              </div>
            </TableCell>
            <TableCell>{application.position}</TableCell>
            <TableCell>
              {new Date(application.date).toLocaleDateString("tr-TR")}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

