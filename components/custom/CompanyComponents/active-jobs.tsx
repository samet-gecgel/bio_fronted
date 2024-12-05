import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const activeJobs = [
  {
    title: "Senior Frontend Developer",
    applications: 12,
    deadline: "2024-03-15",
    status: "Aktif",
  },
  {
    title: "UI/UX Designer",
    applications: 8,
    deadline: "2024-03-20",
    status: "Aktif",
  },
  {
    title: "Product Manager",
    applications: 5,
    deadline: "2024-03-25",
    status: "Aktif",
  },
]

export function ActiveJobs() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>İlan Başlığı</TableHead>
          <TableHead>Başvuru Sayısı</TableHead>
          <TableHead>Son Başvuru</TableHead>
          <TableHead>Durum</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {activeJobs.map((job) => (
          <TableRow key={job.title}>
            <TableCell className="font-medium">{job.title}</TableCell>
            <TableCell>{job.applications}</TableCell>
            <TableCell>
              {new Date(job.deadline).toLocaleDateString("tr-TR")}
            </TableCell>
            <TableCell>
              <Badge variant="secondary">{job.status}</Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

