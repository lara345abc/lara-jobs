import React, { Suspense } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
// import "./App.css";
import Dashboard from "./components/candidate/Dashboard";
import AdminDashboard from "./components/admin/AdminDashboard";
import EmailForm from "./components/signUp/EmailForm";
import Loading from "./components/loading/Loading";
import { Toaster } from "react-hot-toast";
import { NotFound } from "./404Page/NotFound";
import InActiveTest from "./placement-test/test-platform/InActiveTest";
import CandidateTestResults from "./placement-test/results/CandidateTestResults";
import MalpracticeDetected from "./placement-test/test-platform/MalpracticeDetected";
import CompanyForm from "./companies/CompanyForm";
import CompanyList from "./companies/CompanyList";
import CompanyDetails from "./companies/CompanyDetails";
import UplaodCompaniesExcel from "./companies/UplaodCompaniesExcel";
import ResetPassword from "./components/signIn/ResetPassword";

// Lazy load components
const SignInForm = React.lazy(() => import("./components/signIn/SignInForm"));
const ForgotPassword = React.lazy(() => import("./components/signIn/ForgotPassword"));
const AddSubject = React.lazy(() => import("./placement-test/subject/AddSubject"));
const Profile = React.lazy(() => import("./components/candidate/Profile"));
const CreateTestLink = React.lazy(()=> import("./placement-test/test-link/CreateTestLink"))
const AllPlacementTests = React.lazy(()=> import("./placement-test/test-link/AllPlacementTests"))
const EditTestLinkQuestions = React.lazy(()=> import("./placement-test/questions/EditTestLinkQuestions"))
const AddExistingQuestionsToLink = React.lazy(()=> import("./placement-test/test-link/AddExistingQuestionsToLink"))
const UploadQuestionsToLink = React.lazy(()=> import("./placement-test/test-link/UploadQuestionsToLink"))
const AddQuestions = React.lazy(()=> import("./placement-test/questions/AddQuestions"))
const PlacementTest = React.lazy(()=> import("./placement-test/test-platform/PlacementTest"))
const TestResultsById = React.lazy(()=> import("./placement-test/results/TestResultsById"))
// const ManageTests = React.lazy(() => import("./components/admin/ManageTests"));
// const AddQuestion = React.lazy(() => import("./components/admin/AddQuestion"));
// const ViewQuestions = React.lazy(() => import("./components/admin/ViewQuestions"));

/** ProtectedRoute -  authentication & role-based access */
const ProtectedRoute = ({ children, requiredRole }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/signin" />;
  }

  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/not-found" />;
  }

  return children;
};

function App() {
  return (
    <>
      <Toaster />
      <Router>
        <Suspense fallback={<Loading />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/signin" element={<SignInForm />} />
            <Route path="/signup" element={<EmailForm />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/resetPassword" element={<ResetPassword />} />
            <Route path="/not-found" element={<NotFound />} />
            <Route path="/test/:test_id" element={<PlacementTest />} />
            <Route path="/inactive-test" element={<InActiveTest />} />
            <Route path="/malpractice-detected" element={<MalpracticeDetected />} />
            

            {/* Protected Dashboard Routes (for all authenticated users) */}
            <Route
              path="/common-dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            >
              <Route index element={<Profile />} />
            </Route>

            {/* Protected Candidate Routes */}
            <Route
              path="/candidate"
              element={
                <ProtectedRoute requiredRole="CANDIDATE">
                  <Dashboard />
                </ProtectedRoute>
              }
            >
              <Route path="companies/show" element={<CompanyDetails />} />
            </Route>
            {/* Protected Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <Dashboard />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="subject/add-subject" element={<AddSubject />} />
              <Route path="testlink/create" element={<CreateTestLink />} />
              <Route path="testlink/all-links" element={<AllPlacementTests />} />
              <Route path="test/add-new-question/:test_id" element={<AddQuestions />} />
              <Route path="test/edit-question/:test_id" element={<EditTestLinkQuestions />} />
              <Route path="test/upload-excel-link/:test_id" element={<UploadQuestionsToLink />} />
              <Route path="test/add-existing-questions/:test_id" element={<AddExistingQuestionsToLink />} />


              {/* companies  */}
              <Route path="company/create" element={<CompanyForm />} />
              <Route path="company/edit/:companyId" element={<CompanyForm isEditMode />} />
              <Route path="company/companies-list" element={<CompanyList />} />
              <Route path="company/upload" element={<UplaodCompaniesExcel />} />
              {/* <Route path="manage-tests" element={<ManageTests />} />
              <Route path="add-question" element={<AddQuestion />} />
              <Route path="view-questions" element={<ViewQuestions />} /> */}
            </Route>

            {/* Catch-all 404 Route */}
            <Route path="*" element={<Navigate to="/not-found" />} />
            <Route path="/" element={<SignInForm />} />
          </Routes>
        </Suspense>
      </Router>
    </>
  );
}

export default App;
