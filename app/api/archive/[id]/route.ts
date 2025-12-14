import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import connectDB from '@/lib/mongodb'
import Archive from '@/models/Archive'

export async function GET(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
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
        const params = await context.params

        await connectDB()

        const archive = await Archive.findOne({
            _id: params.id,
            userId: sessionData.email,
        })

        if (!archive) {
            return NextResponse.json(
                { error: 'Archive not found' },
                { status: 404 }
            )
        }

        // Return PDF data as base64
        return NextResponse.json({
            success: true,
            pdfData: archive.pdfData,
            reportName: archive.reportName,
        })
    } catch (error) {
        console.error('Archive download error:', error)
        return NextResponse.json(
            { error: 'Failed to download archive' },
            { status: 500 }
        )
    }
}
