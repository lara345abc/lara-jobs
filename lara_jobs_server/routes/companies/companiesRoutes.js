const expres = require('express');
const companiesRoutes = expres.Router();

const companyController = require('../../controllers/companies/companyController')

companiesRoutes.post('/save-company',companyController.createCompanyController);

companiesRoutes.get('/get-company/:companyId',companyController.getCompanyByIdController);

companiesRoutes.get('/get-all-companies',companyController.getAllCompaniesController);

companiesRoutes.put('/update-company/:companyId',companyController.updateCompanyController);

companiesRoutes.delete('/delete-company/:companyId',companyController.deleteCompanyController);

companiesRoutes.post('/upload-excel', companyController.uploadCompanyExcel);


module.exports = companiesRoutes;