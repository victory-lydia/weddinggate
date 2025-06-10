import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface Booking {
  id: string
  couple: string
  date: string
  amount: number
  status: string
  location: string
}

interface DataTableProps {
  data: Booking[]
  formatCurrency: (value: number) => string
}

export function DataTable({ data, formatCurrency }: DataTableProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Couple</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Location</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((booking) => (
            <TableRow key={booking.id}>
              <TableCell className="font-medium">{booking.id}</TableCell>
              <TableCell>{booking.couple}</TableCell>
              <TableCell>{booking.date}</TableCell>
              <TableCell>{formatCurrency(booking.amount)}</TableCell>
              <TableCell>
                <Badge variant="outline" className={getStatusColor(booking.status)}>
                  {booking.status}
                </Badge>
              </TableCell>
              <TableCell>{booking.location}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
