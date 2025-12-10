import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle, TrendingUp, Database, Globe, FileText } from "lucide-react"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts"

interface SummaryCardProps {
  results: {
    iqvia?: { success: boolean; report?: string }
    clinical_trials?: { success: boolean; report?: string }
    patents?: { success: boolean; report?: string }
    exim?: { success: boolean; report?: string }
    web_intel?: { success: boolean; report?: string }
    internal_knowledge?: { success: boolean; report?: string }
  }
  molecule: string
}

export default function SummaryCard({ results, molecule }: SummaryCardProps) {
  const agentStatus = [
    { name: "Market Insights", success: results.iqvia?.success, icon: TrendingUp, color: "#3b82f6" },
    { name: "Clinical Trials", success: results.clinical_trials?.success, icon: Database, color: "#10b981" },
    { name: "Patents", success: results.patents?.success, icon: FileText, color: "#f59e0b" },
    { name: "Trade Data", success: results.exim?.success, icon: Globe, color: "#8b5cf6" },
    { name: "Web Intelligence", success: results.web_intel?.success, icon: Globe, color: "#ec4899" },
    { name: "Internal Knowledge", success: results.internal_knowledge?.success, icon: Database, color: "#06b6d4" },
  ]

  const successCount = agentStatus.filter((a) => a.success).length
  
  // Extract data quality metrics from each agent
  const extractDataQuality = () => {
    const quality = []
    
    // IQVIA - check for competitors and market data
    if (results.iqvia?.report) {
      const hasCompetitors = results.iqvia.report.toLowerCase().includes('competitor')
      const hasMarketSize = results.iqvia.report.toLowerCase().includes('market') || 
                           results.iqvia.report.toLowerCase().includes('cagr')
      const score = (hasCompetitors ? 50 : 0) + (hasMarketSize ? 50 : 0)
      quality.push({ name: "Market", value: score, color: "#3b82f6" })
    } else {
      quality.push({ name: "Market", value: 0, color: "#3b82f6" })
    }
    
    // Clinical Trials - check for phase distribution
    if (results.clinical_trials?.report) {
      const hasPhases = results.clinical_trials.report.toLowerCase().includes('phase')
      const hasTrialCount = results.clinical_trials.report.match(/\d+\s*trial/i)
      const score = (hasPhases ? 50 : 0) + (hasTrialCount ? 50 : 0)
      quality.push({ name: "Clinical", value: score, color: "#10b981" })
    } else {
      quality.push({ name: "Clinical", value: 0, color: "#10b981" })
    }
    
    // Patents - check for assignees and trends
    if (results.patents?.report) {
      const hasAssignees = results.patents.report.toLowerCase().includes('assignee')
      const hasCount = results.patents.report.match(/\d+\s*patent/i)
      const score = (hasAssignees ? 50 : 0) + (hasCount ? 50 : 0)
      quality.push({ name: "Patents", value: score, color: "#f59e0b" })
    } else {
      quality.push({ name: "Patents", value: 0, color: "#f59e0b" })
    }
    
    // Trade Data - check for import/export
    if (results.exim?.report) {
      const hasImport = results.exim.report.toLowerCase().includes('import')
      const hasExport = results.exim.report.toLowerCase().includes('export')
      const score = (hasImport ? 50 : 0) + (hasExport ? 50 : 0)
      quality.push({ name: "Trade", value: score, color: "#8b5cf6" })
    } else {
      quality.push({ name: "Trade", value: 0, color: "#8b5cf6" })
    }
    
    // Web Intelligence - check for news articles
    if (results.web_intel?.report) {
      const hasNews = results.web_intel.report.toLowerCase().includes('news') ||
                     results.web_intel.report.toLowerCase().includes('article')
      const hasRecent = results.web_intel.report.toLowerCase().includes('recent')
      const score = (hasNews ? 50 : 0) + (hasRecent ? 50 : 0)
      quality.push({ name: "Web Intel", value: score, color: "#ec4899" })
    } else {
      quality.push({ name: "Web Intel", value: 0, color: "#ec4899" })
    }
    
    // Internal Knowledge
    if (results.internal_knowledge?.report) {
      const hasInsights = results.internal_knowledge.report.toLowerCase().includes('insight') ||
                         results.internal_knowledge.report.toLowerCase().includes('properties')
      const hasApplications = results.internal_knowledge.report.toLowerCase().includes('application')
      const score = (hasInsights ? 50 : 0) + (hasApplications ? 50 : 0)
      quality.push({ name: "Internal", value: score, color: "#06b6d4" })
    } else {
      quality.push({ name: "Internal", value: 0, color: "#06b6d4" })
    }
    
    return quality
  }

  const dataQuality = extractDataQuality()
  const avgQuality = Math.round(dataQuality.reduce((sum, d) => sum + d.value, 0) / dataQuality.length)

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">Executive Summary - {molecule}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-sm text-foreground leading-relaxed">
          Analysis completed for <strong>{molecule}</strong> using multiple intelligence agents.
          {successCount === 6
            ? " All data sources processed successfully."
            : ` ${successCount}/6 data sources processed successfully.`}
        </p>

        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground">Agent Status:</p>
          <div className="grid grid-cols-2 gap-2">
            {agentStatus.map((agent) => (
              <div key={agent.name} className="flex items-center gap-2 text-xs">
                {agent.success ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-500" />
                )}
                <span className={agent.success ? "text-foreground" : "text-muted-foreground"}>
                  {agent.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Data Quality Pie Chart */}
        <div className="pt-4 border-t border-border">
          <p className="text-xs font-semibold text-muted-foreground mb-4 text-center">
            Data Richness by Source
          </p>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <defs>
                <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#60a5fa" stopOpacity={1}/>
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.8}/>
                </linearGradient>
                <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#34d399" stopOpacity={1}/>
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0.8}/>
                </linearGradient>
                <linearGradient id="orangeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#fbbf24" stopOpacity={1}/>
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.8}/>
                </linearGradient>
                <linearGradient id="purpleGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#a78bfa" stopOpacity={1}/>
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                </linearGradient>
                <linearGradient id="pinkGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f472b6" stopOpacity={1}/>
                  <stop offset="100%" stopColor="#ec4899" stopOpacity={0.8}/>
                </linearGradient>
                <linearGradient id="cyanGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22d3ee" stopOpacity={1}/>
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.8}/>
                </linearGradient>
              </defs>
              <Pie
                data={dataQuality}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => value > 0 ? `${value}%` : ''}
                outerRadius={90}
                innerRadius={55}
                fill="#8884d8"
                dataKey="value"
                paddingAngle={3}
                strokeWidth={2}
                stroke="rgba(0,0,0,0.2)"
              >
                {dataQuality.map((entry, index) => {
                  const gradients = ['url(#blueGrad)', 'url(#greenGrad)', 'url(#orangeGrad)', 
                                   'url(#purpleGrad)', 'url(#pinkGrad)', 'url(#cyanGrad)']
                  return <Cell key={`cell-${index}`} fill={gradients[index]} />
                })}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                  border: '1px solid rgba(148, 163, 184, 0.3)',
                  borderRadius: '8px',
                  color: '#e2e8f0',
                  backdropFilter: 'blur(10px)'
                }}
                formatter={(value: any) => [`${value}%`, 'Data Quality']}
              />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                iconType="circle"
                formatter={(value) => <span className="text-xs text-foreground">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
          
          {/* Data Quality Score */}
          <div className="text-center mt-3 space-y-1">
            <div className="relative inline-block">
              <p className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                {avgQuality}%
              </p>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 blur-xl opacity-20"></div>
            </div>
            <p className="text-xs text-muted-foreground">Average Data Richness Score</p>
          </div>
        </div>

        {/* Bar Chart - Data Coverage */}
        <div className="pt-4 border-t border-border">
          <p className="text-xs font-semibold text-muted-foreground mb-4 text-center">
            Data Coverage Comparison
          </p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={dataQuality}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
              <XAxis 
                dataKey="name" 
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                tickLine={{ stroke: 'rgba(148, 163, 184, 0.2)' }}
              />
              <YAxis 
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                tickLine={{ stroke: 'rgba(148, 163, 184, 0.2)' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                  border: '1px solid rgba(148, 163, 184, 0.3)',
                  borderRadius: '8px',
                  backdropFilter: 'blur(10px)'
                }}
                cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
              />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {dataQuality.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-muted-foreground pt-2 border-t border-border">
          Review the detailed insights in each section below. Data is sourced from FDA, ClinicalTrials.gov,
          PatentsView, UN Comtrade, and news APIs.
        </p>
      </CardContent>
    </Card>
  )
}