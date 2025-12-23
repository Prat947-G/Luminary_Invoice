const express = require('express');
const cors = require('cors');
const multer = require('multer');
const Tesseract = require('tesseract.js');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors({ origin: '*' }));

// Upload Config
const upload = multer({ dest: 'uploads/' });

// --- Root Endpoint (Health Check) ---
app.get('/', (req, res) => {
    res.send('✅ Luminary Invoice Backend is Running!');
});

// --- Helper: Regex Data Extraction Strategy ---
const parseInvoiceText = (text) => {
    // 1. Find Date (DD/MM/YYYY or similar)
    const dateMatch = text.match(/(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/);

    // 2. Find Vehicle Number (Standard Indian format like MH12FZ9334)
    const vehicleMatch = text.match(/([A-Z]{2}[ -]?[0-9]{1,2}[ -]?[A-Z]{1,2}[ -]?[0-9]{4})/i);

    // 3. Find Quantity (Looks for numbers followed by KG, Ton, etc.)
    // Matches: "15,920 KG", "1 Ton", "2890 kg"
    const qtyMatch = text.match(/(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*(KG|TON|MT|Kg)/i);

    // 4. Clean up Quantity (remove commas)
    let qty = 0;
    let unit = 'KG';
    if (qtyMatch) {
        qty = parseFloat(qtyMatch[1].replace(/,/g, ''));
        unit = qtyMatch[2].toUpperCase();
    }

    return {
        date: dateMatch ? dateMatch[0] : new Date().toLocaleDateString('en-IN'),
        vehicleNo: vehicleMatch ? vehicleMatch[0].toUpperCase().replace(/\s/g, '') : '',
        description: text.toLowerCase().includes('fire wood') ? 'Fire Wood' : 'Biomass Briquettes',
        qty: qty,
        unit: unit
    };
};

// --- API Endpoint: Extract Data ---
app.post('/api/extract', upload.single('file'), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const filePath = req.file.path;
    const mimeType = req.file.mimetype;
    const ext = path.extname(req.file.originalname).toLowerCase();

    let rawText = "";

    try {
        console.log(`Processing ${req.file.originalname}...`);

        // 1. PDF Extraction
        if (mimeType === 'application/pdf' || ext === '.pdf') {
            const dataBuffer = fs.readFileSync(filePath);
            const data = await pdfParse(dataBuffer);
            rawText = data.text;
        }
        // 2. Word (DOCX) Extraction (Reusing your mammoth logic)
        else if (ext === '.docx' || mimeType.includes('officedocument')) {
            const result = await mammoth.extractRawText({ path: filePath });
            rawText = result.value;
        }
        // 3. Image OCR (JPG/PNG)
        else if (mimeType.startsWith('image/') || ['.jpg', '.jpeg', '.png'].includes(ext)) {
            const result = await Tesseract.recognize(filePath, 'eng');
            rawText = result.data.text;
        }
        // 4. Text File
        else if (mimeType === 'text/plain' || ext === '.txt') {
            rawText = fs.readFileSync(filePath, 'utf8');
        }

        // Perform Extraction
        const extractedData = parseInvoiceText(rawText);

        // Cleanup
        fs.unlinkSync(filePath);

        res.json({ success: true, data: extractedData });

    } catch (error) {
        console.error("Extraction Error:", error);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        res.status(500).json({ error: 'Failed to extract data' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Invoice Backend running on http://127.0.0.1:${PORT}`));