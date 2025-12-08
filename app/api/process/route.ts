import { NextRequest, NextResponse } from 'next/server'

const FASTAPI_URL = process.env.FASTAPI_URL || 'http://localhost:8000'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { query, molecule, geography } = body

        if (!query && !molecule) {
            return NextResponse.json(
                { error: 'Please provide either a query or molecule name' },
                { status: 400 }
            )
        }

        // Call FastAPI backend
        const response = await fetch(`${FASTAPI_URL}/api/analyze`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: query || '',
                molecule: molecule || '',
                geography: geography || 'Global',
            }),
        })

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            return NextResponse.json(
                { error: errorData.detail || 'Failed to analyze molecule' },
                { status: response.status }
            )
        }

        const data = await response.json()

        return NextResponse.json({
            success: true,
            molecule: data.molecule,
            results: data.results,
            updates: data.updates,
        })
    } catch (error) {
        console.error('Error in /api/process:', error)
        return NextResponse.json(
            {
                error: 'Failed to process analysis request',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        )
    }
}

export async function GET() {
    return NextResponse.json({
        message: 'MoleculeInsight API endpoint',
        status: 'active',
        fastapi_url: FASTAPI_URL,
    })
}
