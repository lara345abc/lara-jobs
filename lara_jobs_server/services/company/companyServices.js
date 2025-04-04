const CustomError = require("../../errors/CustomErrors");
const { Company } = require("../../models");
const XLSX = require('xlsx');


// Create a new company
const createCompany = async (companyData) => {
    try {
        const company = await Company.create(companyData);
        return company;
    } catch (error) {
        if (error.name === 'SequelizeDatabaseError') {
            throw new CustomError('Database error occurred while creating the company', 'DATABASE_ERROR');
        }
        throw new CustomError('Error creating company: ' + error.message, 'INTERNAL_SERVER_ERROR');
    }
};

// Get all companies with pagination
const getAllCompanies = async (page = 1, pageSize = 10) => {
    try {
        const { count, rows } = await Company.findAndCountAll({
            offset: (page - 1) * pageSize,
            limit: pageSize,
        });

        return {
            total: count,
            companies: rows,
        };
    } catch (error) {
        if (error.name === 'SequelizeDatabaseError') {
            throw new CustomError('Database error occurred', 'DATABASE_ERROR');
        }
        throw new CustomError('Error fetching companies: ' + error.message, 'INTERNAL_SERVER_ERROR');
    }
};

// Get a single company by ID
const getCompanyById = async (companyId) => {
    try {
        const company = await Company.findByPk(companyId);
        if (!company) {
            throw new CustomError('Company not found', 'NOT_FOUND');
        }
        return company;
    } catch (error) {
        if (error.name === 'SequelizeDatabaseError') {
            throw new CustomError('Database error occurred', 'DATABASE_ERROR');
        }
        throw new CustomError('Error fetching company: ' + error.message, 'INTERNAL_SERVER_ERROR');
    }
};

// Update company details
const updateCompany = async (companyId, companyData) => {
    try {
        const company = await Company.findByPk(companyId);
        if (!company) {
            throw new CustomError('Company not found', 'NOT_FOUND');
        }

        await company.update(companyData);
        return company;
    } catch (error) {
        if (error.name === 'SequelizeDatabaseError') {
            throw new CustomError('Database error occurred', 'DATABASE_ERROR');
        }
        throw new CustomError('Error updating company: ' + error.message, 'INTERNAL_SERVER_ERROR');
    }
};

// Delete a company by ID
const deleteCompany = async (companyId) => {
    try {
        const company = await Company.findByPk(companyId);
        if (!company) {
            throw new CustomError('Company not found', 'NOT_FOUND');
        }

        await company.destroy();
        return { message: 'Company deleted successfully' };
    } catch (error) {
        if (error.name === 'SequelizeDatabaseError') {
            throw new CustomError('Database error occurred', 'DATABASE_ERROR');
        }
        throw new CustomError('Error deleting company: ' + error.message, 'INTERNAL_SERVER_ERROR');
    }
};

const processExcelFile = async (filePath) => {
    try {
        // Read the Excel file
        const workbook = XLSX.readFile(filePath);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        const companiesToInsert = [];
        const failedRows = [];

        // Process each row in the Excel sheet
        for (const row of jsonData) {
            const companyData = {
                company_name: row.company_name || null,
                website_url: row.website_url || null,
                logo_url: row.logo_url || null,
                contact_phone: row.contact_phone || null,
                contact_email: row.contact_email || null,
                pincode: row.pincode || null,
                location: row.location || null,
                district: row.district || null,
                state: row.state || null,
            };

            if (!companyData.company_name) {
                failedRows.push({ row, error: 'Company name is required' });
                continue;  
            }
            if (companyData.contact_email && !isValidEmail(companyData.contact_email)) {
                failedRows.push({ row, error: 'Invalid email address' });
                continue;  
            }

            companiesToInsert.push(companyData);
        }

        if (companiesToInsert.length > 0) {
            await Company.bulkCreate(companiesToInsert, { validate: true });
        }

        return { inserted: companiesToInsert.length, failed: failedRows };
    } catch (error) {
        console.error('error whle uploading companies excel :', error)
        throw new CustomError('Error processing Excel file: ' + error.message, 'EXCEL_PROCESSING_ERROR');
    }
};

const isValidEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
};


module.exports = {
    createCompany,
    getAllCompanies,
    getCompanyById,
    updateCompany,
    deleteCompany,
    processExcelFile,
};
