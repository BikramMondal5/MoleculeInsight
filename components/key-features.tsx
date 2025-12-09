"use client"

import { FileText, Globe, Search, Atom, Users } from "lucide-react"

const features = [
    {
        title: "AI-Powered Report Generation",
        description: "Transform raw data into actionable insights with our intelligent report generator. Automated agents analyze complex datasets to deliver comprehensive summaries and strategic recommendations in seconds.",
        icon: FileText,
        align: "left",
    },
    {
        title: "Real-Time Insight Monitoring",
        description: "Stay ahead with live analytics that track critical trends and anomalies as they emerge. Intelligent monitoring agents continuously evaluate incoming data streams to deliver timely alerts and actionable insights.",
        icon: Globe,
        align: "right",
    },
    {
        title: "Intelligent Data Extraction",
        description: "Automatically extract relevant data from documents, spreadsheets, APIs, and reports. Our AI agents parse unstructured information with precision to deliver clean, structured datasets ready for immediate analysis.",
        icon: Search,
        align: "left",
    },
    {
        title: "Advanced Data Visualization",
        description: "Transform complex datasets into clear, interactive visual dashboards. Dynamic charts, graphs, and visual elements allow users to explore patterns, compare metrics, and uncover insights with intuitive clarity.",
        icon: Atom,
        align: "right",
    },
    {
        title: "Seamless Workflow Integration",
        description: "Integrate effortlessly with your existing tools, databases, and pipelines. Automated connectors synchronize data across platforms to streamline operations and ensure a smooth, unified workflow.",
        icon: Users,
        align: "left",
    },
]

export default function KeyFeatures() {
    return (
        <section className="py-24 bg-background overflow-hidden relative" id="features">
            {/* Background decorations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/10 dark:bg-primary/5 rounded-full blur-3xl -translate-x-1/2" />
                <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-3xl translate-x-1/2" />
            </div>

            <div className="max-w-7xl mx-auto px-4 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-teal-500">
                        Transform Information into Action
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        Discover the suite of advanced tools designed to revolutionize how you analyze data, visualize molecules, and drive innovation.
                    </p>
                </div>

                <div className="flex flex-col space-y-24 md:space-y-32">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className={`flex flex-col ${feature.align === "left" ? "md:flex-row" : "md:flex-row-reverse"
                                } gap-8 md:gap-16 items-center`}
                        >
                            {/* Text Content */}
                            <div className="flex-1 space-y-6">
                                <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-xl w-fit">
                                    <feature.icon className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="text-3xl font-bold">{feature.title}</h3>
                                <p className="text-lg text-muted-foreground leading-relaxed">
                                    {feature.description}
                                </p>
                                <div className="pt-4">
                                    <div className="h-1 w-20 bg-gradient-to-r from-primary to-transparent rounded-full" />
                                </div>
                            </div>

                            {/* Media Placeholder */}
                            <div className="flex-1 w-full">
                                <div className="relative aspect-video w-full rounded-[2.5rem] overflow-hidden border border-border/50 bg-card shadow-2xl dark:shadow-primary/10 group">
                                    {/* Placeholder gradient/content */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-muted/50 dark:from-muted/30 to-muted/10 dark:to-transparent flex items-center justify-center group-hover:scale-105 transition-transform duration-700">
                                        <span className="text-muted-foreground/50 font-medium">
                                            Media Placeholder {index + 1}
                                        </span>
                                    </div>

                                    {/* Decorative corner accent */}
                                    <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary/10 dark:bg-primary/20 rounded-full blur-2xl group-hover:bg-primary/20 dark:group-hover:bg-primary/30 transition-colors" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
