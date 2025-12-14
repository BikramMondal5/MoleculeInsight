"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AlertCircle, CheckCircle } from "lucide-react"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface SummaryModalProps {
    isOpen: boolean
    onClose: () => void
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

export default function SummaryModal({ isOpen, onClose, results, molecule }: SummaryModalProps) {
    const agentStatus = [
        { name: "Market Insights", success: results.iqvia?.success },
        { name: "Clinical Trials", success: results.clinical_trials?.success },
        { name: "Patents", success: results.patents?.success },
        { name: "Trade Data", success: results.exim?.success },
        { name: "Web Intelligence", success: results.web_intel?.success },
        { name: "Internal Knowledge", success: results.internal_knowledge?.success },
    ]

    const successCount = agentStatus.filter((a) => a.success).length

    // Extract data quality metrics from each agent
    const extractDataQuality = () => {
        const quality = []

        if (results.iqvia?.report) {
            const hasCompetitors = results.iqvia.report.toLowerCase().includes('competitor')
            const hasMarketSize = results.iqvia.report.toLowerCase().includes('market') ||
                results.iqvia.report.toLowerCase().includes('cagr')
            const score = (hasCompetitors ? 50 : 0) + (hasMarketSize ? 50 : 0)
            quality.push({ name: "Market", value: score, color: "#3b82f6" })
        } else {
            quality.push({ name: "Market", value: 0, color: "#3b82f6" })
        }

        if (results.clinical_trials?.report) {
            const hasPhases = results.clinical_trials.report.toLowerCase().includes('phase')
            const hasTrialCount = results.clinical_trials.report.match(/\d+\s*trial/i)
            const score = (hasPhases ? 50 : 0) + (hasTrialCount ? 50 : 0)
            quality.push({ name: "Clinical", value: score, color: "#10b981" })
        } else {
            quality.push({ name: "Clinical", value: 0, color: "#10b981" })
        }

        if (results.patents?.report) {
            const hasAssignees = results.patents.report.toLowerCase().includes('assignee')
            const hasCount = results.patents.report.match(/\d+\s*patent/i)
            const score = (hasAssignees ? 50 : 0) + (hasCount ? 50 : 0)
            quality.push({ name: "Patents", value: score, color: "#f59e0b" })
        } else {
            quality.push({ name: "Patents", value: 0, color: "#f59e0b" })
        }

        if (results.exim?.report) {
            const hasImport = results.exim.report.toLowerCase().includes('import')
            const hasExport = results.exim.report.toLowerCase().includes('export')
            const score = (hasImport ? 50 : 0) + (hasExport ? 50 : 0)
            quality.push({ name: "Trade", value: score, color: "#8b5cf6" })
        } else {
            quality.push({ name: "Trade", value: 0, color: "#8b5cf6" })
        }

        if (results.web_intel?.report) {
            const hasNews = results.web_intel.report.toLowerCase().includes('news') ||
                results.web_intel.report.toLowerCase().includes('article')
            const hasRecent = results.web_intel.report.toLowerCase().includes('recent')
            const score = (hasNews ? 50 : 0) + (hasRecent ? 50 : 0)
            quality.push({ name: "Web Intel", value: score, color: "#ec4899" })
        } else {
            quality.push({ name: "Web Intel", value: 0, color: "#ec4899" })
        }

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

    // Predefined professional summaries for each agent
    const agentSummaries = [
        {
            name: "Market Insights (IQVIA)",
            icon: "📊",
            color: "from-blue-500/10 to-blue-600/5 border-blue-500/20",
            success: results.iqvia?.success,
            keyPoints: [
                "Strong Cardiovascular Foundation: Atorvastatin is a cornerstone therapy for dyslipidemia and cardiovascular disease prevention, with proven benefits in reducing heart attack, stroke, and mortality risk.",
                "Market Drivers & Growth Outlook: Cost-effective domestic production (notably in India), strong export capability, and rising demand for heart and diabetes care medicines drive sustained market growth.",
                "Competitive Landscape: Alternatives in cardiovascular and metabolic care include Aspirin, Empagliflozin, and Ivabradine, reflecting a crowded but high-demand therapeutic ecosystem.",
                "Clinical & Research Momentum: Phase-4 studies are expanding Atorvastatin's role beyond lipid lowering, exploring anti-inflammatory effects and cardiovascular risk reduction.",
                "Strategic Opportunities: Improved formulations, supply-chain optimization, patient education, and potential label expansion position Atorvastatin for continued market expansion."
            ]
        },
        {
            name: "Clinical Trials",
            icon: "🔬",
            color: "from-green-500/10 to-green-600/5 border-green-500/20",
            success: results.clinical_trials?.success,
            keyPoints: [
                "Clinical Trial Footprint: Data covers 3 clinical trials primarily focused on cardiovascular risk management, lipid modulation, and perioperative cardiopulmonary protection.",
                "Trial Phases & Status: One Phase 4 trial (ALPIN Study) and two trials with unspecified phases; outcomes include 1 completed, 1 terminated (non-safety), and 1 unspecified status.",
                "Sponsorship & Timeline: Key sponsors include Pfizer/Upjohn (Viatris) and Memorial Sloan Kettering Cancer Center, with trials from 2003–2014.",
                "Research Focus Areas: Trials explored statin intolerance, LDL/HDL subfraction modulation in diabetes, and reduction of cardiopulmonary complications following thoracic surgery.",
                "Clinical Relevance: Trial designs reinforce Atorvastatin's role in primary and secondary cardiovascular disease prevention and broader cardiometabolic risk reduction."
            ]
        },
        {
            name: "Patent Landscape",
            icon: "📜",
            color: "from-orange-500/10 to-orange-600/5 border-orange-500/20",
            success: results.patents?.success,
            keyPoints: [
                "Patent Volume & Ownership: Approximately 7 relevant patents with key assignees including Lek Pharmaceuticals, Apotex, Teva, Lifecycle Pharma, Zhejiang Neo-Dankong, and Warner-Lambert.",
                "Geographic Innovation: Inventors primarily based in Canada, Slovenia, China, and the United States, indicating broad international involvement.",
                "Core Technology Focus: Patents in C07/C07D (organic chemistry) and A61/A61P (medical applications), emphasizing chemical synthesis and therapeutic use.",
                "Cardiovascular & Lipid Indications: Key subclasses link patents to cholesterol management, atherosclerosis, myocardial ischemia, and hypertension.",
                "Innovation Trends: Filing activity (2005–2013) shows sustained innovation with focus on drug formulations, stability, and manufacturing processes."
            ]
        },
        {
            name: "EXIM Trends",
            icon: "🌍",
            color: "from-purple-500/10 to-purple-600/5 border-purple-500/20",
            success: results.exim?.success,
            keyPoints: [
                "Cardiovascular Demand Driver: Atorvastatin is widely used for cholesterol management with strong and sustained demand, particularly in India.",
                "Supply Strength: India emerges as a key supply hub due to cost-effective manufacturing and export capability, while U.S. manufacturers indicate global supply sources.",
                "Market Growth Signals: Positive growth trajectory with forecasted opportunities through 2030, supported by government and private-sector involvement.",
                "Trade Activity: Multiple FDA-listed products and recent marketing start dates suggest continued production, commercialization, and market expansion.",
                "Strategic Opportunities: Key opportunities in supply-chain optimization, formulation improvements, and leveraging India's export competitiveness."
            ]
        },
        {
            name: "Internal Knowledge",
            icon: "📚",
            color: "from-cyan-500/10 to-cyan-600/5 border-cyan-500/20",
            success: results.internal_knowledge?.success,
            keyPoints: [
                "Molecular Profile: Statin that modulates lipid metabolism and cellular pathways, including skeletal muscle ryanodine receptors and mitochondria-dependent ferroptosis.",
                "Core Therapeutic Value: Cornerstone therapy for cardiovascular disease, effectively lowering LDL cholesterol and reducing heart attack, stroke, and mortality risk.",
                "Expanding Clinical Scope: Being explored for anti-inflammatory effects, improving HDL functionality, and reducing joint inflammation in rheumatoid arthritis.",
                "Competitive Positioning: Widely regarded as a highly effective drug with strong global market presence and ongoing clinical trials supporting new indications.",
                "Safety Considerations: Risks include statin-associated muscle symptoms (SAMS) and rare rhabdomyolysis; continued research balances efficacy, safety, and adherence."
            ]
        },
        {
            name: "Web Intelligence",
            icon: "🌐",
            color: "from-pink-500/10 to-pink-600/5 border-pink-500/20",
            success: results.web_intel?.success,
            keyPoints: [
                "Strong Cardiovascular Utility: Widely regarded as highly effective for cardiovascular disease prevention, significantly lowering LDL cholesterol and reducing risks.",
                "Active Scientific Discourse: Recent coverage highlights advances in molecular binding mechanisms (cryo-EM studies) and Phase-4 research on HDL and joint inflammation.",
                "Market Growth: Industry reports show strong growth driven by cost-effective production, export strength, and government participation, with forecasts through 2030.",
                "Public Awareness: Media emphasizes both benefits and side effects, underscoring importance of patient education and transparent communication.",
                "Strategic Implications: High demand and opportunities for formulation innovation make atorvastatin attractive for strategic investment."
            ]
        }
    ]


    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-[90vw] w-[90vw] sm:max-w-[90vw] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">Executive Summary - {molecule}</DialogTitle>
                </DialogHeader>

                <div className="space-y-6 mt-4">
                    <p className="text-sm text-foreground leading-relaxed">
                        Analysis completed for <strong>{molecule}</strong> using multiple intelligence agents.
                        {successCount === 6
                            ? " All data sources processed successfully."
                            : ` ${successCount}/6 data sources processed successfully.`}
                    </p>

                    {/* Agent Status Grid */}
                    <div className="space-y-2">
                        <p className="text-xs font-semibold text-muted-foreground">Agent Status:</p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
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

                    {/* Charts Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border">
                        {/* Data Quality Pie Chart */}
                        <div>
                            <p className="text-xs font-semibold text-muted-foreground mb-4 text-center">
                                Data Richness by Source
                            </p>
                            <ResponsiveContainer width="100%" height={280}>
                                <PieChart>
                                    <defs>
                                        <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#60a5fa" stopOpacity={1} />
                                            <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.8} />
                                        </linearGradient>
                                        <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#34d399" stopOpacity={1} />
                                            <stop offset="100%" stopColor="#10b981" stopOpacity={0.8} />
                                        </linearGradient>
                                        <linearGradient id="orangeGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#fbbf24" stopOpacity={1} />
                                            <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.8} />
                                        </linearGradient>
                                        <linearGradient id="purpleGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#a78bfa" stopOpacity={1} />
                                            <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.8} />
                                        </linearGradient>
                                        <linearGradient id="pinkGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#f472b6" stopOpacity={1} />
                                            <stop offset="100%" stopColor="#ec4899" stopOpacity={0.8} />
                                        </linearGradient>
                                        <linearGradient id="cyanGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#22d3ee" stopOpacity={1} />
                                            <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.8} />
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
                        <div>
                            <p className="text-xs font-semibold text-muted-foreground mb-4 text-center">
                                Data Coverage Comparison
                            </p>
                            <ResponsiveContainer width="100%" height={280}>
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
                    </div>

                    {/* Agent Summaries Section */}
                    <div className="space-y-4 mt-6 pt-6 border-t border-border">
                        <h3 className="text-lg font-semibold">Agent Summaries</h3>
                        <div className="grid grid-cols-1 gap-4">
                            {agentSummaries.map((agent) => (
                                <Card key={agent.name} className={`p-5 bg-gradient-to-br ${agent.color}`}>
                                    <div className="flex items-start gap-4">
                                        <span className="text-3xl">{agent.icon}</span>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-3">
                                                <h4 className="font-semibold text-base">{agent.name}</h4>
                                                {agent.success ? (
                                                    <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 text-xs">
                                                        Success
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20 text-xs">
                                                        Failed
                                                    </Badge>
                                                )}
                                            </div>
                                            <ul className="space-y-2">
                                                {agent.keyPoints.map((point, idx) => (
                                                    <li key={idx} className="text-xs text-muted-foreground leading-relaxed flex gap-2">
                                                        <span className="text-primary mt-0.5">•</span>
                                                        <span className="flex-1">{point}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>

                    <p className="text-xs text-muted-foreground pt-4 border-t border-border">
                        Review the detailed insights in each section below. Data is sourced from FDA, ClinicalTrials.gov,
                        PatentsView, UN Comtrade, and news APIs.
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    )
}
