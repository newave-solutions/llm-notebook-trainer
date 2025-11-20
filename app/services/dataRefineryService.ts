/**
 * @file dataRefineryService.ts
 * @description Data Refinery Service
 * @module services
 *
 * Transforms raw PDF files into clean, structured training data.
 * Handles the complete pipeline from upload to formatted output.
 *
 * Pipeline Stages:
 * 1. Upload to Supabase Storage
 * 2. Extract text with layout preservation
 * 3. Clean and structure content
 * 4. Format as JSON or CSV
 * 5. Store in database with metadata
 *
 * @example
 * const file = await dataRefineryService.uploadPdf(pdfBlob, projectId);
 * const refined = await dataRefineryService.refinePdf(file.id, 'json');
 */

import { fileService, UploadedFile } from './database';

export type OutputFormat = 'json' | 'csv';

export interface RefineryConfig {
  fileId: string;
  outputFormat: OutputFormat;
  cleaningOptions?: {
    removeHeaders?: boolean;
    removeFooters?: boolean;
    preserveFormatting?: boolean;
  };
}

export interface RefinedData {
  fileId: string;
  extractedText: string;
  formattedData: string;
  format: OutputFormat;
  recordCount: number;
  processingTime: number;
}

export interface UploadProgress {
  stage: 'uploading' | 'extracting' | 'formatting' | 'complete';
  progress: number;
  message: string;
}

/**
 * Upload a PDF file to storage
 *
 * @param {Blob} file - The PDF file blob
 * @param {string} projectId - Associated project ID (optional)
 * @returns {Promise<UploadedFile>} File metadata record
 */
export async function uploadPdf(
  file: Blob,
  projectId?: string
): Promise<UploadedFile> {
  const fileName = `upload_${Date.now()}.pdf`;
  const storagePath = `uploads/${fileName}`;

  // Upload to Supabase Storage
  await fileService.uploadToStorage(storagePath, file);

  // Create database record
  const fileRecord = await fileService.create({
    user_id: '', // Will be filled by RLS
    project_id: projectId,
    file_name: fileName,
    file_type: 'application/pdf',
    file_size: file.size,
    storage_path: storagePath,
    processing_status: 'pending',
  });

  return fileRecord;
}

/**
 * Extract text from uploaded PDF
 *
 * @param {string} fileId - The file record ID
 * @returns {Promise<string>} Extracted text content
 */
export async function extractText(fileId: string): Promise<string> {
  // Update status to processing
  await fileService.update(fileId, {
    processing_status: 'processing',
  });

  try {
    // IMPLEMENTATION NOTE: In production, this would use a PDF parsing
    // library or service. For React Native, we'd need to use a backend
    // service or edge function with PDF.js or similar.

    // Simulate text extraction
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const mockExtractedText = `
Sample extracted text from PDF document.

This is a demonstration of the text extraction process.
The actual implementation would use PDF parsing libraries.

Key points:
- Structured data extraction
- Layout preservation
- Clean formatting
- Ready for AI training
    `.trim();

    // Update with extracted text
    await fileService.update(fileId, {
      extracted_text: mockExtractedText,
      processing_status: 'completed',
    });

    return mockExtractedText;
  } catch (error: any) {
    // Update with error
    await fileService.update(fileId, {
      processing_status: 'failed',
      error_message: error.message,
    });

    throw error;
  }
}

/**
 * Format extracted text as JSON
 *
 * @param {string} text - Raw extracted text
 * @returns {string} JSON formatted string
 */
export function formatAsJson(text: string): string {
  // Parse text into structured records
  const lines = text.split('\n').filter((line) => line.trim().length > 0);

  const records = lines.map((line, index) => ({
    id: index + 1,
    text: line.trim(),
    source: 'pdf_extraction',
    timestamp: new Date().toISOString(),
  }));

  return JSON.stringify(records, null, 2);
}

/**
 * Format extracted text as CSV
 *
 * @param {string} text - Raw extracted text
 * @returns {string} CSV formatted string
 */
export function formatAsCsv(text: string): string {
  const lines = text.split('\n').filter((line) => line.trim().length > 0);

  // CSV header
  let csv = 'id,text,source,timestamp\n';

  // CSV rows
  lines.forEach((line, index) => {
    const escapedText = line.trim().replace(/"/g, '""');
    csv += `${index + 1},"${escapedText}","pdf_extraction","${new Date().toISOString()}"\n`;
  });

  return csv;
}

/**
 * Complete refinery process from file ID
 *
 * @param {string} fileId - The uploaded file ID
 * @param {OutputFormat} format - Desired output format
 * @param {Function} onProgress - Progress callback
 * @returns {Promise<RefinedData>} Refined and formatted data
 */
export async function refinePdf(
  fileId: string,
  format: OutputFormat,
  onProgress?: (progress: UploadProgress) => void
): Promise<RefinedData> {
  const startTime = Date.now();

  // Stage 1: Extract text
  onProgress?.({
    stage: 'extracting',
    progress: 33,
    message: 'Extracting text from PDF...',
  });

  const extractedText = await extractText(fileId);

  // Stage 2: Format data
  onProgress?.({
    stage: 'formatting',
    progress: 66,
    message: `Formatting as ${format.toUpperCase()}...`,
  });

  await new Promise((resolve) => setTimeout(resolve, 1000));

  const formattedData =
    format === 'json' ? formatAsJson(extractedText) : formatAsCsv(extractedText);

  // Stage 3: Complete
  onProgress?.({
    stage: 'complete',
    progress: 100,
    message: 'Data ready!',
  });

  const processingTime = Date.now() - startTime;

  return {
    fileId,
    extractedText,
    formattedData,
    format,
    recordCount: extractedText.split('\n').filter((l) => l.trim()).length,
    processingTime,
  };
}

/**
 * Get processing status for a file
 *
 * @param {string} fileId - The file record ID
 * @returns {Promise<UploadedFile>} Current file status
 */
export async function getProcessingStatus(fileId: string): Promise<UploadedFile> {
  const file = await fileService.getById(fileId);

  if (!file) {
    throw new Error(`File not found: ${fileId}`);
  }

  return file;
}

/**
 * List all uploaded files for the current user
 *
 * @returns {Promise<UploadedFile[]>} Array of file records
 */
export async function listUserFiles(): Promise<UploadedFile[]> {
  return await fileService.getAll();
}

/**
 * Delete an uploaded file and its data
 *
 * @param {string} fileId - The file record ID
 * @returns {Promise<void>}
 */
export async function deleteFile(fileId: string): Promise<void> {
  await fileService.delete(fileId);
}

/**
 * Get formatted data preview (first N characters)
 *
 * @param {string} formattedData - The formatted data string
 * @param {number} maxChars - Maximum characters to preview
 * @returns {string} Data preview
 */
export function getDataPreview(formattedData: string, maxChars = 500): string {
  if (formattedData.length <= maxChars) {
    return formattedData;
  }

  return formattedData.substring(0, maxChars) + '\n... (truncated)';
}

// Export as service object
export const dataRefineryService = {
  uploadPdf,
  extractText,
  formatAsJson,
  formatAsCsv,
  refinePdf,
  getProcessingStatus,
  listUserFiles,
  deleteFile,
  getDataPreview,
};
