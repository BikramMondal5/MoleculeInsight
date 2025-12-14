import mongoose from 'mongoose'

const ArchiveSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    reportName: {
        type: String,
        required: true,
    },
    molecule: {
        type: String,
        required: true,
    },
    query: {
        type: String,
        required: true,
    },
    region: {
        type: String,
        required: true,
    },
    pdfData: {
        type: String, // Base64 encoded PDF
        required: true,
    },
    results: {
        type: Object,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
})

export default mongoose.models.Archive || mongoose.model('Archive', ArchiveSchema)
