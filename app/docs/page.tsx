"use client"

import React, { useState } from 'react';
import { Book, Rocket, Cpu, Database, FileText, Code, ChevronRight, ChevronDown, Search, ExternalLink } from 'lucide-react';
import Header from '@/components/header';
import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';

const MoleculeInsightDocs = () => {
    const [activeSection, setActiveSection] = useState('introduction');
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
        'getting-started': true,
        'core-concepts': false,
        'guides': false,
        'resources': false
    });

    const toggleSection = (section: string) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const documentation = {
        'getting-started': {
            title: 'Getting Started',
            icon: Rocket,
            subsections: [
                { id: 'introduction', title: 'Introduction', badge: null },
                { id: 'quick-start', title: 'Quick Start Guide', badge: 'Popular' }
            ]
        },
        'core-concepts': {
            title: 'Core Concepts',
            icon: Book,
            subsections: [
                { id: 'how-it-works', title: 'How MoleculeInsight Works', badge: null },
                { id: 'multi-agent', title: 'Multi-Agent System', badge: null },
                { id: 'rag-system', title: 'RAG Knowledge Engine', badge: null }
            ]
        },
        'guides': {
            title: 'User Guides',
            icon: FileText,
            subsections: [
                { id: 'running-analysis', title: 'Running an Analysis', badge: null }
            ]
        },
        'resources': {
            title: 'Resources',
            icon: Database,
            subsections: [
                { id: 'examples', title: 'Example Queries', badge: 'Popular' },
                { id: 'troubleshooting', title: 'Troubleshooting', badge: null }
            ]
        }
    };

    const getContent = (sectionId: string) => {
        const contentMap: Record<string, string> = {
            'introduction': `# Welcome to MoleculeInsight Documentation

**MoleculeInsight** is an AI-powered research platform that accelerates pharmaceutical innovation scouting from months to minutes. Designed for researchers and students, it orchestrates specialized AI agents to analyze molecular opportunities across multiple data sources simultaneously.

## What is MoleculeInsight?

MoleculeInsight transforms how pharmaceutical research is conducted by:

- **Automating Literature Review**: No more spending weeks reading hundreds of papers
- **Parallel Data Analysis**: 7 specialized agents work simultaneously across different data sources
- **Intelligent Synthesis**: AI combines findings into actionable innovation strategies
- **Internal Knowledge Integration**: Leverage your own research data through RAG technology

## Why MoleculeInsight?

Traditional molecular research requires:
- Reading 100+ research papers (2-3 weeks)
- Checking clinical trial databases (3-5 days)
- Analyzing patent landscapes (1-2 weeks)
- Studying market dynamics (1 week)
- Reviewing internal documents (ongoing)

**With MoleculeInsight**: Complete this entire process in **5-10 minutes**.

## Who Should Use This?

- **Graduate Students**: Accelerate your thesis research and literature reviews
- **Pharmaceutical Researchers**: Identify repurposing opportunities and innovation gaps
- **Academic Labs**: Quickly assess competitive landscapes before starting projects
- **Biotech Startups**: Validate ideas with comprehensive market and IP analysis

## Key Features

### Multi-Agent Orchestration
Seven specialized AI agents work in parallel covering clinical trials, patents, trade data, market intelligence, web research, and internal knowledge.

### RAG-Powered Knowledge
Upload your own research papers, internal reports, and data. The system uses Retrieval-Augmented Generation to provide context-aware insights from your proprietary knowledge base.

### Real-Time Analysis
Watch agents work in real-time with live progress indicators and status updates via WebSocket connections.

### Comprehensive Results
Get insights on clinical development status, patent landscapes, market projections, trade dependencies, recent publications, and internal research findings.`,

            'quick-start': `# Quick Start Guide

Get MoleculeInsight running in less than 10 minutes.

## Prerequisites

- **Node.js** v18 or higher
- **Python** 3.9 or higher
- **Google Gemini API Key** (free for students with .edu email)
- At least 8GB RAM (16GB recommended)
- 2GB free disk space

## Installation (5 minutes)

### Step 1: Clone the Repository
\`\`\`bash
git clone https://github.com/BikramMondal5/MoleculeInsight.git
cd MoleculeInsight
\`\`\`

### Step 2: Backend Setup
\`\`\`bash
cd agents
python -m venv venv
source venv/bin/activate  # On Windows: venv\\Scripts\\activate
pip install -r requirements.txt
\`\`\`

### Step 3: Frontend Setup
\`\`\`bash
cd ..
npm install -g pnpm
pnpm install
\`\`\`

### Step 4: Configure API Keys

Create \`.env\` file in \`agents/RAG/\`:
\`\`\`env
GOOGLE_API_KEY=your_gemini_api_key_here
NEWS_API_KEY=your_newsapi_key
COMTRADE_KEY=your_comtrade_key
CHROMA_PERSIST_DIR=./db
COLLECTION_NAME=molecule_knowledge
\`\`\`

Create \`.env.local\` in project root:
\`\`\`env
NEXT_PUBLIC_API_URL=http://localhost:8000
\`\`\`

## Running MoleculeInsight

### Start Backend
\`\`\`bash
cd agents
python main.py
\`\`\`

### Start Frontend (new terminal)
\`\`\`bash
pnpm dev
\`\`\`

Access at: **http://localhost:3000**

## Your First Analysis

1. Navigate to http://localhost:3000/analysis
2. Enter query: "Analyze market potential for Aspirin in cardiovascular disease"
3. Click "Run Agentic Analysis"
4. Watch real-time progress (5-8 minutes)
5. Review results and download report`,

            'how-it-works': `# How MoleculeInsight Works

## System Architecture Overview

MoleculeInsight uses a sophisticated multi-agent architecture powered by Google's Gemini AI to orchestrate parallel research across multiple data sources.

## The Research Pipeline

### Phase 1: Query Understanding
When you submit a research query, the Master Orchestration Agent:
1. Parses intent using Gemini AI
2. Identifies entities (molecules, diseases, therapeutic areas)
3. Decomposes into specialized subtasks for each agent

### Phase 2: Parallel Execution
All worker agents execute simultaneously:
- **Clinical Trials Agent**: ClinicalTrials.gov
- **Patent Landscape Agent**: PatentsView API
- **EXIM Trade Agent**: UN Comtrade database
- **Market Intelligence Agent**: Market databases
- **Web Intelligence Agent**: NewsAPI + web search
- **Internal Knowledge Agent**: ChromaDB RAG system

Typical execution time: 5-8 minutes for all agents running in parallel.

### Phase 3: Data Aggregation
The Master Agent collects results from all workers and structures the data.

### Phase 4: Intelligent Synthesis
The Innovation Strategy Agent:
1. Cross-references data across sources
2. Identifies patterns and opportunities
3. Evaluates feasibility
4. Creates actionable recommendations using Gemini AI

### Phase 5: Presentation
Results displayed in interactive dashboard with visualizations, AI-generated innovation concept, and downloadable comprehensive report.

## Real-Time Updates
WebSocket connections provide live updates throughout the process showing which agents are active, progress percentages, and estimated completion time.`,

            'multi-agent': `# Multi-Agent System Architecture

## Agent Hierarchy

MoleculeInsight employs a hierarchical multi-agent system where a Master Orchestration Agent coordinates seven specialized Worker Agents.

## Master Orchestration Agent

**Role**: Central coordinator and synthesizer  
**Technology**: Google Gemini 1.5 Pro  
**Location**: agents/orchestrator.py

### Responsibilities
1. Query parsing and entity extraction
2. Task decomposition into agent-specific subtasks
3. Orchestration of parallel worker execution
4. Data aggregation and synthesis
5. Innovation strategy generation

## Worker Agents

### 1. Clinical Trials Agent
**Data Source**: ClinicalTrials.gov API

**Captures**:
- Trial phases (I, II, III, IV)
- Enrollment status
- Study sponsors and collaborators
- Geographic distribution
- Patient enrollment numbers

**Research Value**: Identify clinical development stage, find trial gaps, assess competitive activity

### 2. Patent Landscape Agent
**Data Source**: PatentsView API / USPTO

**Captures**:
- Active patent numbers and titles
- Filing and expiry dates
- Patent assignees
- Technology classifications
- Freedom-to-Operate (FTO) assessment

**Research Value**: Assess IP barriers, identify expiring patents, map competitor portfolios

### 3. EXIM Trade Agent
**Data Source**: UN Comtrade API

**Captures**:
- Import/export volumes by country
- API trade flows
- Supply chain dependencies
- Regulatory compliance by region

**Research Value**: Understand global supply chains, identify manufacturing locations, assess geopolitical risks

### 4. Market Intelligence Agent
**Data Source**: Mock IQVIA data

**Captures**:
- Current market size
- Projected CAGR
- Top competitors and market shares
- Unmet medical needs
- Pricing trends

**Research Value**: Validate commercial potential, understand competitive dynamics

### 5. Web Intelligence Agent
**Data Source**: NewsAPI + Web Search

**Captures**:
- Recent research publications
- Regulatory guidelines
- Industry news
- Conference proceedings
- Clinical practice guidelines

**Research Value**: Stay updated on latest research, track regulatory decisions

### 6. Internal Knowledge Agent
**Data Source**: ChromaDB RAG System

**Captures**:
- Past project summaries
- Internal research reports
- Lab notebooks and protocols
- Regulatory submissions
- Manufacturing SOPs

**Research Value**: Avoid repeating experiments, access institutional expertise

### 7. Innovation Strategy Agent
**Purpose**: Final synthesis and recommendation

**Process**:
1. Data integration from all agents
2. Pattern recognition across sources
3. Opportunity assessment
4. Strategy generation with specific recommendations`,

            'rag-system': `# RAG Knowledge Engine

The Retrieval-Augmented Generation (RAG) system transforms your research documents into a queryable knowledge base.

## What is RAG?

**Traditional AI**: Only knows training data (with cutoff date)  
**RAG Approach**: Retrieves relevant passages from YOUR documents and generates answers grounded in your specific knowledge

## Architecture

1. **Document Loading**: PDF, JSON, TXT files
2. **Text Chunking**: Split into 500-token segments
3. **Embedding Generation**: Convert to vectors using Gemini
4. **Vector Storage**: Store in ChromaDB
5. **Semantic Search**: Find similar content
6. **LLM Generation**: Generate contextualized answers

## Document Ingestion

Place documents in \`agents/RAG/KnowledgeBase/\`

Supported formats:
- **PDF**: Research papers, reports
- **JSON**: Structured project data
- **TXT**: Lab notebooks, protocols

Run ingestion:
\`\`\`bash
cd agents/RAG
python ingest_all.py
\`\`\`

## Query Process

1. Generate query embedding
2. Search ChromaDB for similar vectors
3. Build context from top-k results
4. Generate answer with Gemini
5. Return answer with citations

## Best Practices

### Document Organization
\`\`\`
KnowledgeBase/
├── clinical_trials/
├── literature/
├── protocols/
├── regulatory/
└── internal_reports/
\`\`\`

### Naming Conventions
Use descriptive filenames:
- ✅ 2023_11_metformin_breast_cancer_phase2_results.pdf
- ❌ document1.pdf

### Update Frequency
Re-run ingestion when:
- New research papers published
- Clinical trials complete
- Protocols updated
- Quarterly reports finalized

## Performance Tuning

**Chunk Size**: 500 tokens (balanced precision and context)  
**Top-k Results**: 5 for quick queries, 15 for complex research  
**Embedding Cache**: First ingestion slow, queries fast (<1 second)`,

            'running-analysis': `# Running an Analysis

Complete guide from query to results.

## Before You Start

### Research Question Clarity

✅ **Good queries**:
- "Find repurposing opportunities for Metformin in Alzheimer's disease"
- "Analyze patent landscape for SGLT2 inhibitors expiring in 3 years"
- "Market potential for GLP-1 agonists in obesity treatment"

❌ **Vague queries**:
- "Tell me about diabetes drugs"
- "Find opportunities"

### Define Your Scope

Consider:
- **Molecule focus**: Specific drug or entire class?
- **Indication**: Disease area or therapeutic application?
- **Geography**: Global, specific regions, or regulatory markets?
- **Time horizon**: Current state or future projections?

## Step-by-Step Analysis

### 1. Access Interface
Navigate to http://localhost:3000/analysis

### 2. Enter Research Query
Basic query:
\`\`\`
Analyze market potential for Aspirin in cardiovascular disease
\`\`\`

### 3. Configure Options
- **Geographic Filters**: USA, EU, China, India, Global
- **Therapeutic Areas**: Cardiology, Oncology, Neurology, etc.
- **Time Ranges**: Last 5 years, Last 10 years, All time
- **Data Sources**: Select which agents to use

### 4. Launch Analysis
Click "Run Agentic Analysis"

### 5. Monitor Progress
Watch real-time status:
- ✅ Complete
- 🔄 Working
- ⏳ Pending
- ❌ Error

### 6. Review Results
Results appear as interactive cards:
- Market Insights
- Patent Landscape
- Clinical Trials
- Trade Analysis
- Web Intelligence
- Internal Knowledge
- AI Innovation Strategy

### 7. Export Report
Click "Download Full Report"
- **PDF**: Professional report with charts
- **Markdown**: Text format for editing
- **JSON**: Raw data

## Tips for Best Results

- Use specific molecule names (INN or brand)
- Include indication for focused results
- Specify research intent clearly
- Select relevant geographic regions
- Choose appropriate time ranges`,

            'examples': `# Example Queries

Real-world examples for pharmaceutical research.

## Drug Repurposing

### Example 1: Metformin in Oncology
**Query**: "Find repurposing opportunities for Metformin in oncology"

**Expected Results**:
- 47 clinical trials (mostly Phase II)
- Limited Phase III data for solid tumors
- Patent landscape clear (main patents expired)
- $2.8B addressable market
- Innovation opportunity: Extended-release pediatric formulation

### Example 2: Aspirin in Alzheimer's
**Query**: "Evaluate Aspirin for Alzheimer's disease prevention"

**Expected Results**:
- 12 ongoing trials
- Mixed efficacy signals
- Generic competition high
- Safety concerns in elderly population

## Patent Analysis

### Example 3: SGLT2 Inhibitor Patents
**Query**: "Analyze patent landscape for SGLT2 inhibitors expiring in next 3 years"

**Expected Results**:
- 23 active patents
- 5 expiring 2025-2027
- FTO opportunities in combination therapies
- Top assignees: Pharma companies

## Market Assessment

### Example 4: GLP-1 Market
**Query**: "What is the market potential for GLP-1 agonists in obesity?"

**Expected Results**:
- $15B current market
- 25% CAGR projected
- High unmet need
- Multiple Phase III trials ongoing

## Competitive Intelligence

### Example 5: Diabetes Pipeline
**Query**: "Analyze competitive landscape for Type 2 diabetes treatments"

**Expected Results**:
- 156 clinical trials active
- 45 new molecular entities
- Major players identified
- Market segmentation analysis

## Supply Chain Analysis

### Example 6: API Dependencies
**Query**: "Assess supply chain risks for Metformin APIs"

**Expected Results**:
- 43% from China
- 30% from India
- Trade volume $890M
- High dependency risk identified`,

            'troubleshooting': `# Troubleshooting

Common issues and solutions.

## Installation Issues

### Backend Won't Start
**Problem**: Port 8000 in use  
**Solution**:
\`\`\`bash
# Check what's using port 8000
lsof -i :8000
# Kill the process or change port in config
\`\`\`

### Frontend Connection Error
**Problem**: Cannot connect to backend  
**Solution**:
- Verify backend running on port 8000
- Check NEXT_PUBLIC_API_URL in .env.local
- Confirm firewall settings

### ChromaDB Collection Not Found
**Problem**: RAG system not initialized  
**Solution**:
\`\`\`bash
cd agents/RAG
python ingest_all.py
\`\`\`

## Runtime Issues

### Gemini API Quota Exceeded
**Error**: 429 Too Many Requests  
**Solution**:
- Check quota at Google AI Studio
- Implement rate limiting
- Wait for quota reset

### Agent Timeout Errors
**Error**: TimeoutError after 30s  
**Solution**:
- Increase AGENT_TIMEOUT in config
- Check network connectivity
- Verify API endpoint availability

### Slow Query Performance
**Problem**: RAG queries taking too long  
**Solution**:
- Reduce top_k parameter
- Filter by metadata first
- Rebuild with HNSW index

## Data Quality Issues

### No Relevant Documents Found
**Problem**: RAG returns no results  
**Solution**:
- Broaden query terms
- Verify documents were ingested
- Check if query matches document content

### Incomplete Results
**Problem**: Some agents failing  
**Solution**:
- Check logs for specific errors
- Verify API keys are valid
- Ensure network connectivity

## Performance Issues

### Analysis Taking Too Long
**Problem**: >10 minutes for completion  
**Solution**:
- Reduce number of active agents
- Narrow geographic scope
- Limit time range for searches

### High Memory Usage
**Problem**: System using >8GB RAM  
**Solution**:
- Reduce concurrent agents
- Clear ChromaDB cache
- Restart backend service

## Getting Help

- Check logs in agents/logs/
- Enable debug mode in config
- Report issues on GitHub
- Contact support with error details`
        };

        return contentMap[sectionId] || '# Content not found';
    };

    // Custom components for ReactMarkdown
    const markdownComponents: Components = {
        h1: ({ children }) => (
            <h1 className="text-4xl font-bold mt-8 mb-6 text-foreground">
                {children}
            </h1>
        ),
        h2: ({ children }) => (
            <h2 className="text-3xl font-semibold mt-8 mb-4 text-foreground">
                {children}
            </h2>
        ),
        h3: ({ children }) => (
            <h3 className="text-2xl font-semibold mt-6 mb-3 text-foreground">
                {children}
            </h3>
        ),
        p: ({ children }) => (
            <p className="text-muted-foreground mb-4 leading-relaxed text-base">
                {children}
            </p>
        ),
        ul: ({ children }) => (
            <ul className="list-disc list-inside space-y-2 mb-4 text-muted-foreground">
                {children}
            </ul>
        ),
        ol: ({ children }) => (
            <ol className="list-decimal list-inside space-y-2 mb-4 text-muted-foreground">
                {children}
            </ol>
        ),
        li: ({ children }) => (
            <li className="ml-4 text-muted-foreground">
                {children}
            </li>
        ),
        code: ({ inline, children, ...props }: any) => {
            return inline ? (
                <code className="bg-muted/50 text-primary px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
                    {children}
                </code>
            ) : (
                <code className="block bg-muted/50 border border-border text-foreground p-4 rounded-lg my-4 font-mono text-sm overflow-x-auto" {...props}>
                    {children}
                </code>
            );
        },
        pre: ({ children }) => (
            <pre className="bg-muted/50 border border-border rounded-lg p-4 my-4 overflow-x-auto">
                {children}
            </pre>
        ),
        strong: ({ children }) => (
            <strong className="font-semibold text-foreground">
                {children}
            </strong>
        ),
        a: ({ href, children }) => (
            <a href={href} className="text-primary hover:text-primary/80 underline transition-colors" target="_blank" rel="noopener noreferrer">
                {children}
            </a>
        ),
        blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primary/30 pl-4 my-4 italic text-muted-foreground">
                {children}
            </blockquote>
        ),
    };

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <div className="flex pt-16 min-h-screen">
                {/* Sidebar */}
                <div className="w-80 bg-card border-r border-border overflow-y-auto h-[calc(100vh-4rem)] sticky top-16">
                    <div className="p-6">
                        <div className="flex items-center gap-2 mb-6">
                            <Database className="w-8 h-8 text-primary" />
                            <h1 className="text-2xl font-bold text-foreground">Documentation</h1>
                        </div>

                        <div className="mb-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="Search docs..."
                                    className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder:text-muted-foreground"
                                />
                            </div>
                        </div>

                        {Object.entries(documentation).map(([key, section]) => {
                            const Icon = section.icon;
                            return (
                                <div key={key} className="mb-2">
                                    <button
                                        onClick={() => toggleSection(key)}
                                        className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-foreground hover:bg-accent rounded-lg transition-colors"
                                    >
                                        <div className="flex items-center gap-2">
                                            <Icon className="w-4 h-4" />
                                            <span>{section.title}</span>
                                        </div>
                                        {expandedSections[key] ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                    </button>

                                    {expandedSections[key] && (
                                        <div className="ml-6 mt-1 space-y-1">
                                            {section.subsections.map(sub => (
                                                <button
                                                    key={sub.id}
                                                    onClick={() => setActiveSection(sub.id)}
                                                    className={`w-full text-left px-3 py-1.5 text-sm rounded-lg transition-colors ${activeSection === sub.id
                                                            ? 'bg-primary/10 text-primary font-medium'
                                                            : 'text-muted-foreground hover:bg-accent'
                                                        }`}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <span>{sub.title}</span>
                                                        {sub.badge && (
                                                            <span className={`px-2 py-0.5 text-xs rounded-full ${sub.badge === 'Popular' ? 'bg-purple-500/10 text-purple-500' :
                                                                    sub.badge === 'New' ? 'bg-green-500/10 text-green-500' :
                                                                        'bg-primary/10 text-primary'
                                                                }`}>
                                                                {sub.badge}
                                                            </span>
                                                        )}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 overflow-y-auto">
                    <div className="max-w-6xl mx-auto p-8 px-12">
                        <div className="markdown-content">
                            <ReactMarkdown components={markdownComponents}>
                                {getContent(activeSection)}
                            </ReactMarkdown>
                        </div>

                        <div className="mt-12 pt-6 border-t border-border">
                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                                <span>Last updated: December 2024</span>
                                <a href="https://github.com/BikramMondal5/MoleculeInsight" className="flex items-center gap-1 text-primary hover:text-primary/80 transition-colors">
                                    View on GitHub <ExternalLink className="w-4 h-4" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MoleculeInsightDocs;
