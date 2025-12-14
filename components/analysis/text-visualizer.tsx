"use client"

import { useEffect, useRef, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface TextVisualizerProps {
    isOpen: boolean
    onClose: () => void
    title: string
    content: string
}

interface NumericData {
    label: string
    value: number
    category?: string
}

export default function TextVisualizer({ isOpen, onClose, title, content }: TextVisualizerProps) {
    const [wordFrequency, setWordFrequency] = useState<Array<{ word: string; count: number; size: number }>>([])
    const [keyPhrases, setKeyPhrases] = useState<string[]>([])
    const [stats, setStats] = useState({ words: 0, sentences: 0, chars: 0 })
    const [numericData, setNumericData] = useState<NumericData[]>([])
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        if (isOpen && content) {
            analyzeText(content)
            extractNumericData(content)
            // Delay word cloud rendering to ensure canvas is ready
            setTimeout(() => createWordCloud(content), 100)
        }
    }, [isOpen, content])

    const analyzeText = (text: string) => {
        // Remove markdown and special characters
        const cleanText = text
            .replace(/[#*`_\[\]()]/g, '')
            .replace(/\n+/g, ' ')
            .toLowerCase()

        // Word frequency
        const words = cleanText.split(/\s+/).filter(word =>
            word.length > 3 &&
            !['the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'has', 'had', 'this', 'that', 'with', 'from', 'have', 'been', 'were', 'will', 'your', 'what', 'when', 'make', 'like', 'time', 'just', 'know', 'take', 'into', 'year', 'some', 'them', 'than', 'other', 'would', 'which', 'their', 'about', 'also', 'there', 'more'].includes(word)
        )

        const frequency: { [key: string]: number } = {}
        words.forEach(word => {
            frequency[word] = (frequency[word] || 0) + 1
        })

        const sorted = Object.entries(frequency)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 30)
            .map(([word, count]) => ({
                word,
                count,
                size: Math.min(40, 12 + count * 3)
            }))

        setWordFrequency(sorted)

        // Extract key phrases (2-3 word combinations)
        const phrases: { [key: string]: number } = {}
        for (let i = 0; i < words.length - 1; i++) {
            const phrase = `${words[i]} ${words[i + 1]}`
            if (phrase.length > 8) {
                phrases[phrase] = (phrases[phrase] || 0) + 1
            }
        }

        const topPhrases = Object.entries(phrases)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([phrase]) => phrase)

        setKeyPhrases(topPhrases)

        // Stats
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length
        setStats({
            words: words.length,
            sentences,
            chars: text.length
        })
    }

    const extractNumericData = (text: string) => {
        const data: NumericData[] = []

        // Pattern 1: "X trials", "X studies", "X patients", etc.
        const countPatterns = [
            /(\d+(?:,\d{3})*(?:\.\d+)?)\s*(trials?|studies|patients?|participants?|subjects?|cases?|samples?|compounds?|molecules?|drugs?|tests?|results?|years?|months?|days?)/gi,
            /(\d+(?:,\d{3})*(?:\.\d+)?)\s*(?:mg|g|kg|ml|l|mcg|μg)/gi, // dosages
            /(\d+(?:,\d{3})*(?:\.\d+)?)%/g, // percentages
            /\$(\d+(?:,\d{3})*(?:\.\d+)?)\s*(?:million|billion|M|B)?/gi, // money
        ]

        countPatterns.forEach(pattern => {
            const matches = text.matchAll(pattern)
            for (const match of matches) {
                const value = parseFloat(match[1].replace(/,/g, ''))
                const label = match[2] || match[0]
                if (!isNaN(value) && value > 0) {
                    data.push({ label: label.toLowerCase(), value })
                }
            }
        })

        // Pattern 2: Tables with numbers (e.g., "Phase I: 50, Phase II: 100")
        const tablePattern = /([A-Za-z\s]+):\s*(\d+(?:,\d{3})*(?:\.\d+)?)/g
        const tableMatches = text.matchAll(tablePattern)
        for (const match of tableMatches) {
            const value = parseFloat(match[2].replace(/,/g, ''))
            if (!isNaN(value) && value > 0 && match[1].trim().length < 30) {
                data.push({ label: match[1].trim(), value })
            }
        }

        // Aggregate similar labels
        const aggregated: { [key: string]: number } = {}
        data.forEach(({ label, value }) => {
            const normalizedLabel = label.toLowerCase().replace(/s$/, '') // Remove plural
            aggregated[normalizedLabel] = (aggregated[normalizedLabel] || 0) + value
        })

        const finalData = Object.entries(aggregated)
            .map(([label, value]) => ({ label, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 10) // Top 10

        setNumericData(finalData)
    }

    const createWordCloud = (text: string) => {
        if (!canvasRef.current) return

        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        // Set canvas size based on actual rendered size
        const rect = canvas.getBoundingClientRect()
        canvas.width = rect.width * 2 // 2x for retina displays
        canvas.height = rect.height * 2
        ctx.scale(2, 2)

        // Clear canvas with dark background
        ctx.fillStyle = '#0f172a'
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // Extract words
        const cleanText = text
            .replace(/[#*`_\[\]()]/g, '')
            .replace(/\n+/g, ' ')
            .toLowerCase()

        const words = cleanText.split(/\s+/).filter(word =>
            word.length > 3 &&
            !['the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'has', 'had', 'this', 'that', 'with', 'from', 'have', 'been', 'were', 'will', 'your', 'what', 'when', 'make', 'like', 'time', 'just', 'know', 'take', 'into', 'year', 'some', 'them', 'than', 'other', 'would', 'which', 'their', 'about', 'also', 'there', 'more'].includes(word)
        )

        const frequency: { [key: string]: number } = {}
        words.forEach(word => {
            frequency[word] = (frequency[word] || 0) + 1
        })

        const sorted = Object.entries(frequency)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 40)

        if (sorted.length === 0) return

        const colors = ['#60a5fa', '#34d399', '#fbbf24', '#f472b6', '#a78bfa', '#22d3ee']

        // Calculate actual canvas dimensions
        const width = rect.width
        const height = rect.height

        // Draw words in spiral pattern
        let angle = 0
        let radius = 20
        sorted.forEach(([word, count], index) => {
            const fontSize = Math.min(32, 10 + count * 1.5)
            ctx.font = `bold ${fontSize}px Arial, sans-serif`
            ctx.fillStyle = colors[index % colors.length]

            const x = width / 2 + radius * Math.cos(angle)
            const y = height / 2 + radius * Math.sin(angle)

            ctx.save()
            ctx.translate(x, y)
            const rotation = (Math.random() - 0.5) * 0.4
            ctx.rotate(rotation)
            ctx.fillText(word, -ctx.measureText(word).width / 2, fontSize / 3)
            ctx.restore()

            angle += 0.6 + Math.random() * 0.3
            radius += 8 + fontSize / 4
        })
    }

    const CHART_COLORS = ['#60a5fa', '#34d399', '#fbbf24', '#f472b6', '#a78bfa', '#22d3ee', '#fb923c', '#4ade80', '#818cf8', '#c084fc']

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-[95vw] w-[95vw] sm:max-w-[95vw] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">Visualization - {title}</DialogTitle>
                </DialogHeader>

                <div className="space-y-6 mt-4">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-3 gap-4">
                        <Card className="p-4 bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
                            <p className="text-sm text-muted-foreground mb-1">Total Words</p>
                            <p className="text-3xl font-bold text-blue-400">{stats.words.toLocaleString()}</p>
                        </Card>
                        <Card className="p-4 bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
                            <p className="text-sm text-muted-foreground mb-1">Sentences</p>
                            <p className="text-3xl font-bold text-green-400">{stats.sentences.toLocaleString()}</p>
                        </Card>
                        <Card className="p-4 bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
                            <p className="text-sm text-muted-foreground mb-1">Characters</p>
                            <p className="text-3xl font-bold text-purple-400">{stats.chars.toLocaleString()}</p>
                        </Card>
                    </div>

                    {/* Numeric Data Visualizations */}
                    {numericData.length > 0 && (
                        <div className="grid grid-cols-2 gap-6">
                            {/* Pie Chart */}
                            <Card className="p-6">
                                <h3 className="text-lg font-semibold mb-4 text-center">Data Distribution Overview</h3>
                                <ResponsiveContainer width="100%" height={350}>
                                    <PieChart>
                                        <Pie
                                            data={numericData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ label, percent }) => `${label}: ${(percent * 100).toFixed(0)}%`}
                                            outerRadius={110}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {numericData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(value: number) => value.toLocaleString()} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </Card>

                            {/* Bar Chart */}
                            <Card className="p-6">
                                <h3 className="text-lg font-semibold mb-4 text-center">Quantitative Analysis</h3>
                                <ResponsiveContainer width="100%" height={350}>
                                    <BarChart data={numericData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                        <XAxis
                                            dataKey="label"
                                            angle={-45}
                                            textAnchor="end"
                                            height={100}
                                            tick={{ fill: '#94a3b8', fontSize: 12 }}
                                        />
                                        <YAxis tick={{ fill: '#94a3b8' }} />
                                        <Tooltip
                                            formatter={(value: number) => value.toLocaleString()}
                                            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
                                        />
                                        <Legend />
                                        <Bar dataKey="value" name="Count/Value">
                                            {numericData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </Card>
                        </div>
                    )}

                    {/* Keywords and Frequency Grid */}
                    <div className="grid grid-cols-2 gap-6">
                        {/* Top Keywords */}
                        <Card className="p-6">
                            <h3 className="text-lg font-semibold mb-4">Top Keywords</h3>
                            <div className="flex flex-wrap gap-2">
                                {wordFrequency.slice(0, 20).map(({ word, count }, index) => (
                                    <Badge
                                        key={word}
                                        variant="outline"
                                        className="px-3 py-1.5 text-sm hover:scale-105 transition-transform"
                                        style={{
                                            background: `hsl(${index * 18}, 70%, 15%)`,
                                            borderColor: `hsl(${index * 18}, 70%, 50%)`,
                                            color: `hsl(${index * 18}, 70%, 70%)`
                                        }}
                                    >
                                        {word} ({count})
                                    </Badge>
                                ))}
                            </div>
                        </Card>

                        {/* Word Frequency Chart */}
                        <Card className="p-6">
                            <h3 className="text-lg font-semibold mb-4">Word Frequency Distribution</h3>
                            <div className="space-y-2">
                                {wordFrequency.slice(0, 15).map(({ word, count }, index) => {
                                    const maxCount = wordFrequency[0]?.count || 1
                                    const percentage = (count / maxCount) * 100
                                    return (
                                        <div key={word} className="flex items-center gap-3">
                                            <span className="text-sm font-medium w-32 truncate capitalize">{word}</span>
                                            <div className="flex-1 h-6 bg-muted rounded-full overflow-hidden">
                                                <div
                                                    className="h-full rounded-full transition-all duration-500 ease-out"
                                                    style={{
                                                        width: `${percentage}%`,
                                                        background: `linear-gradient(90deg, hsl(${index * 24}, 70%, 50%), hsl(${index * 24 + 40}, 70%, 60%))`
                                                    }}
                                                />
                                            </div>
                                            <span className="text-sm text-muted-foreground w-12 text-right">{count}</span>
                                        </div>
                                    )
                                })}
                            </div>
                        </Card>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
