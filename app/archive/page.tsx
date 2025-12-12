"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Download, Eye, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import Header from "@/components/header"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination"

// Sample archive data
const archiveReports = [
  {
    id: 1,
    name: "Molecule X – Respiratory India Analysis",
    molecule: "X",
    region: "India",
    date: "08-Dec-25",
    timestamp: new Date("2025-12-08"),
  },
  {
    id: 2,
    name: "Molecule Y – CNS Global Opportunities",
    molecule: "Y",
    region: "Global",
    date: "07-Dec-25",
    timestamp: new Date("2025-12-07"),
  },
  {
    id: 3,
    name: "Molecule Z – Oncology US Market",
    molecule: "Z",
    region: "US",
    date: "06-Dec-25",
    timestamp: new Date("2025-12-06"),
  },
  {
    id: 4,
    name: "Molecule A – Cardiovascular Europe",
    molecule: "A",
    region: "Europe",
    date: "05-Dec-25",
    timestamp: new Date("2025-12-05"),
  },
  {
    id: 5,
    name: "Molecule B – Immunology APAC",
    molecule: "B",
    region: "APAC",
    date: "04-Dec-25",
    timestamp: new Date("2025-12-04"),
  },
  {
    id: 6,
    name: "Molecule C – Diabetes Worldwide",
    molecule: "C",
    region: "Global",
    date: "03-Dec-25",
    timestamp: new Date("2025-12-03"),
  },
]

const ITEMS_PER_PAGE = 5

export default function ArchivePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  // Filter reports based on search query
  const filteredReports = useMemo(() => {
    return archiveReports.filter((report) => {
      const query = searchQuery.toLowerCase()
      return (
        report.name.toLowerCase().includes(query) ||
        report.molecule.toLowerCase().includes(query) ||
        report.region.toLowerCase().includes(query)
      )
    })
  }, [searchQuery])

  // Paginate filtered results
  const totalPages = Math.ceil(filteredReports.length / ITEMS_PER_PAGE)
  const paginatedReports = filteredReports.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  const handleView = (reportId: number) => {
    console.log("[v0] Viewing report:", reportId)
    // In production, navigate to the report detail page or open dashboard
  }

  const handleDownloadPDF = (reportId: number, reportName: string) => {
    console.log("[v0] Downloading PDF for report:", reportId)
    // In production, trigger PDF download
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="pt-20 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2 bg-gradient-to-r from-primary to-teal-500 text-transparent bg-clip-text">Report Archive</h1>
            <p className="text-muted-foreground">
              Access all your previous analyses and insights. View dashboards or download PDF reports.
            </p>
          </div>

          {/* Search Bar */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by molecule, region, or report name..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setCurrentPage(1) // Reset to first page on search
                  }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Reports Table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Reports ({filteredReports.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {paginatedReports.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs">Report Name</TableHead>
                        <TableHead className="text-xs">Molecule</TableHead>
                        <TableHead className="text-xs">Region</TableHead>
                        <TableHead className="text-xs">Date</TableHead>
                        <TableHead className="text-xs text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedReports.map((report) => (
                        <TableRow key={report.id}>
                          <TableCell className="text-sm font-medium text-foreground">{report.name}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{report.molecule}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{report.region}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{report.date}</TableCell>
                          <TableCell className="text-sm">
                            <div className="flex items-center gap-2 justify-end">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleView(report.id)}
                                title="View report dashboard"
                              >
                                <Eye className="w-4 h-4" />
                                <span className="hidden sm:inline">View</span>
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDownloadPDF(report.id, report.name)}
                                title="Download PDF report"
                              >
                                <Download className="w-4 h-4" />
                                <span className="hidden sm:inline">PDF</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No reports found matching your search.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        if (currentPage > 1) setCurrentPage(currentPage - 1)
                      }}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>

                  {Array.from({ length: totalPages }).map((_, idx) => {
                    const pageNum = idx + 1
                    return (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault()
                            setCurrentPage(pageNum)
                          }}
                          isActive={currentPage === pageNum}
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  })}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        if (currentPage < totalPages) setCurrentPage(currentPage + 1)
                      }}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
