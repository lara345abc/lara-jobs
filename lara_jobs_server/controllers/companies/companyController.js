const multer = require('multer');
const path = require('path');
const fs = require('fs');


const handleError = require('../../errors/errorHandler');
const companyService = require('../../services/company/companyServices')



// Create a new company
const createCompanyController = async (req, res) => {
    try {
        const companyData = req.body;
        const company = await companyService.createCompany(companyData);

        return res.status(201).json({
            success: true,
            data: company,
        });
    } catch (error) {
        handleError(res, error);
    }
};

// Get all companies with pagination
const getAllCompaniesController = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;

        const { total, companies } = await companyService.getAllCompanies(page, pageSize);

        return res.status(200).json({
            success: true,
            data: companies,
            total,  
            page,
            pageSize,
        });
    } catch (error) {
        handleError(res, error);
    }
};

// Get a single company by ID
const getCompanyByIdController = async (req, res) => {
    try {
        const { companyId } = req.params;
        const company = await companyService.getCompanyById(companyId);

        return res.status(200).json({
            success: true,
            data: company,
        });
    } catch (error) {
        handleError(res, error);
    }
};

// Update company details
const updateCompanyController = async (req, res) => {
    try {
        const { companyId } = req.params;
        const companyData = req.body;
        const company = await companyService.updateCompany(companyId, companyData);

        return res.status(200).json({
            success: true,
            data: company,
        });
    } catch (error) {
        handleError(res, error);
    }
};

// Delete a company by ID
const deleteCompanyController = async (req, res) => {
    try {
        const { companyId } = req.params;
        const result = await companyService.deleteCompany(companyId);

        return res.status(200).json({
            success: true,
            message: result.message,
        });
    } catch (error) {
        handleError(res, error);
    }
};




// Set the destination folder path
const uploadFolder = path.join(__dirname, '../uploads/excel');

// Check if the directory exists, if not, create it
const ensureDirectoryExistence = (folderPath) => {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });  // Creates the directory if it doesn't exist
  }
};

// Set storage engine for Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Ensure the directory exists before uploading the file
    ensureDirectoryExistence(uploadFolder);

    cb(null, uploadFolder); // Set destination folder for uploads
  },
  filename: (req, file, cb) => {
    // Use a unique filename based on timestamp and original file extension
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
  // File filter (to accept only Excel files)
  const fileFilter = (req, file, cb) => {
    const allowedFileTypes = /xlsx|xls/;
    const mimeType = file.mimetype;
    const extname = path.extname(file.originalname).toLowerCase();
  
    if (allowedFileTypes.test(extname) && mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      return cb(null, true);
    } else {
      return cb(new Error('Only Excel files are allowed!'), false);  // Reject non-Excel files
    }
  };
  
  // Initialize multer with storage and file filter
  const upload = multer({ storage, fileFilter });
  
  // The uploadCompanyExcel function
  const uploadCompanyExcel = async (req, res) => {
    upload.single('file')(req, res, async (err) => {  
      if (err) {
        console.error('Error uploading file:', err.message);
        return res.status(400).json({ success: false, message: 'Error uploading file', error: err.message });
      }
      console.log('Received file:', req.file);  // Check if file is available
      try {
        const filePath = path.join(__dirname, '../uploads/excel', req.file.filename);
        const companies = await companyService.processExcelFile(filePath);
  
        return res.status(200).json({
          success: true,
          message: 'Companies data uploaded successfully',
          data: companies,
        });
      } catch (error) {
        console.error('Error while uploading companies excel:', error);
        return res.status(500).json({ success: false, message: error.message });
      }
    });
  };

module.exports = {
    createCompanyController,
    getAllCompaniesController,
    getCompanyByIdController,
    updateCompanyController,
    deleteCompanyController,
    uploadCompanyExcel,
};
