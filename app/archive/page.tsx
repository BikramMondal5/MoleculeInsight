"use client"

import { useState, useMemo, useEffect } from "react"
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
import { useToast } from "@/hooks/use-toast"

interface ArchiveReport {
  id: string
  reportName: string
  molecule: string
  region: string
  date: string
  timestamp: Date
}

const ITEMS_PER_PAGE = 5

export default function ArchivePage() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [archiveReports, setArchiveReports] = useState<ArchiveReport[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchArchives()
  }, [])

  const fetchArchives = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/archive')
      const data = await response.json()

      if (response.ok && data.success) {
        setArchiveReports(data.archives)
      } else {
        throw new Error(data.error || 'Failed to fetch archives')
      }
    } catch (error) {
      console.error('Fetch archives error:', error)
      toast({
        title: "Error",
        description: "Failed to load archived reports.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Filter reports based on search query
  const filteredReports = useMemo(() => {
    return archiveReports.filter((report) => {
      const query = searchQuery.toLowerCase()
      return (
        report.reportName.toLowerCase().includes(query) ||
        report.molecule.toLowerCase().includes(query) ||
        report.region.toLowerCase().includes(query)
      )
    })
  }, [searchQuery, archiveReports])

  // Paginate filtered results
  const totalPages = Math.ceil(filteredReports.length / ITEMS_PER_PAGE)
  const paginatedReports = filteredReports.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  const handleView = (reportId: string) => {
    console.log("[v0] Viewing report:", reportId)
    // In production, navigate to the report detail page or open dashboard
  }

  const handleDownloadPDF = async (reportId: string, reportName: string) => {
    try {
      const response = await fetch(`/api/archive/${reportId}`)
      const data = await response.json()

      if (response.ok && data.success) {
        // Convert base64 to blob and download
        const byteCharacters = atob(data.pdfData)
        const byteNumbers = new Array(byteCharacters.length)
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i)
        }
        const byteArray = new Uint8Array(byteNumbers)
        const blob = new Blob([byteArray], { type: 'application/pdf' })

        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${reportName.replace(/[^a-z0-9]/gi, '_')}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)

        toast({
          title: "Success!",
          description: "PDF downloaded successfully.",
        })
      } else {
        throw new Error(data.error || 'Failed to download PDF')
      }
    } catch (error) {
      console.error('Download PDF error:', error)
      toast({
        title: "Error",
        description: "Failed to download PDF. Please try again.",
        variant: "destructive",
      })
    }
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
              {isLoading ? (
                <div className="text-center py-12 text-muted-foreground">
                  Loading archived reports...
                </div>
              ) : paginatedReports.length > 0 ? (
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
                          <TableCell className="text-sm font-medium text-foreground">{report.reportName}</TableCell>
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
                                onClick={() => handleDownloadPDF(report.id, report.reportName)}
                                title="Download PDF"
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
          {
            totalPages > 1 && (
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
            )
          }
        </div >
      </div >
    </div >
  )
}
