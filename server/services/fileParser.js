import pdf from 'pdf-parse';
import mammoth from 'mammoth';

const FileParser = {
  async parsePDF(buffer) {
    if (!buffer || !Buffer.isBuffer(buffer)) {
      throw new Error('Invalid buffer passed to parsePDF');
    }
    try {
      const data = await pdf(buffer);
      return data.text;
    } catch (err) {
      console.error('PDF parsing failed:', err);
      throw new Error('Failed to parse PDF file');
    }
  },

  async parseDOCX(buffer) {
    if (!buffer || !Buffer.isBuffer(buffer)) {
      throw new Error('Invalid buffer passed to parseDOCX');
    }
    try {
      const result = await mammoth.extractRawText({ buffer });
      return result.value;
    } catch (err) {
      console.error('DOCX parsing failed:', err);
      throw new Error('Failed to parse DOCX file');
    }
  },

  async parseText(text) {
    return text;
  },

  async parseFile(file) {
    if (!file || !file.originalname || !file.buffer) {
      throw new Error('Invalid file object');
    }

    const extension = file.originalname.split('.').pop().toLowerCase();

    switch (extension) {
      case 'pdf':
        return this.parsePDF(file.buffer);
      case 'docx':
        return this.parseDOCX(file.buffer);
      case 'txt':
        return this.parseText(file.buffer.toString());
      default:
        throw new Error('Unsupported file type');
    }
  },
};

export default FileParser;
