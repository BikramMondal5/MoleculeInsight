import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import connectDB from '@/lib/mongodb'
import Archive from '@/models/Archive'

export async function POST(req: NextRequest) {
    try {
        const cookieStore = await cookies()
        const userSession = cookieStore.get('user_session')

        if (!userSession) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const sessionData = JSON.parse(userSession.value)

        const { reportName, molecule, query, region, pdfData, results } = await req.json()

        if (!reportName || !molecule || !region || !pdfData || !results) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }

        await connectDB()

        const archive = new Archive({
            userId: sessionData.email,
            reportName,
            molecule,
            query: query || '',
            region,
            pdfData,
            results,
        })

        await archive.save()

        return NextResponse.json({
            success: true,
            message: 'Report saved to archive',
            archiveId: archive._id,
        })
    } catch (error) {
        console.error('Archive save error:', error)
        return NextResponse.json(
            { error: 'Failed to save report to archive' },
            { status: 500 }
        )
    }
}

export async function GET(req: NextRequest) {
    try {
        const cookieStore = await cookies()
        const userSession = cookieStore.get('user_session')

        if (!userSession) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const sessionData = JSON.parse(userSession.value)

        await connectDB()

        const archives = await Archive.find({ userId: sessionData.email })
            .select('-pdfData -results') // Exclude heavy fields for list view
            .sort({ createdAt: -1 })

        return NextResponse.json({
            success: true,
            archives: archives.map(archive => ({
                id: archive._id.toString(),
                reportName: archive.reportName,
                molecule: archive.molecule,
                region: archive.region,
                date: archive.createdAt.toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: '2-digit',
                }),
                timestamp: archive.createdAt,
            })),
        })
    } catch (error) {
        console.error('Archive fetch error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch archives' },
            { status: 500 }
        )
    }
}
