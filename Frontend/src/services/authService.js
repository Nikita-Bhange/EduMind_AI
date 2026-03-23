export const uploadDocument = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Please upload a PDF file',
        statusCode: 400
      });
    }

    const { title } = req.body;

    if (!title) {
      // Delete uploaded file if no title provided
      await fs.unlink(req.file.path);
      return res.status(400).json({
        success: false,
        error: 'Please provide a document title',
        statusCode: 400
      });
    }

    // Construct the URL for the uploaded file
    const baseUrl = `http://localhost:${process.env.PORT || 8000}`;
    const fileUrl = `${baseUrl}/uploads/${req.file.filename}`;

  } catch (error) {
    // Clean up file on error
    if (req.file) {
      await fs.unlink(req.file.path).catch(() => {});
    }
    next(error);
  }
};