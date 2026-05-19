import { Routes, Route } from "react-router-dom";
import ResponsiveAppBar from "../AComponents/ResponsiveAppBar";
import Register from "../AComponents/Register";
import Dashboard from "../AComponents/DashBoard";
import AddUser from "../AComponents/AddUser";
import ViewUser from "../AComponents/viewUser";
import UpdateUser from "../AComponents/updateUser";
import AddProduct from "../AComponents/AddProduct";
import ViewProduct from "../AComponents/viewProduct";
import UpdateProduct from "../AComponents/updateProduct";
import ViewCategory from "../AComponents/viewCategory";
import AddCategory from "../AComponents/AddCategory";
import UpdateCategory from "../AComponents/updateCategory";
import Manageorder from "../AComponents/Manageorder";
import Approveorder from "../AComponents/Approveorder";
import UpdateOrderStatus from "../AComponents/updateorderstatus";
import AdminBooking from '../AComponents/AdminBooking';
import ManagePayment from "../AComponents/ManagePayment";
import ViewFeedback from "../AComponents/ViewFeedback";

export default function AdminRoute() {
  return (
    <div>
      <Routes>
        <Route path="/ResponsiveAppBar"      element={<ResponsiveAppBar />} />
        <Route path="/Register"              element={<Register />} />
        <Route path="/Dashboard"             element={<Dashboard />} />
        <Route path="/AddUser"               element={<AddUser />} />
        <Route path="/ViewUser"              element={<ViewUser />} />
        <Route path="/UpdateUser/:id"        element={<UpdateUser />} />
        <Route path="/AddProduct"            element={<AddProduct />} />
        <Route path="/ViewProduct"           element={<ViewProduct />} />
        <Route path="/UpdateProduct/:id"     element={<UpdateProduct />} />
        <Route path="/AddCategory"           element={<AddCategory />} />
        <Route path="/ViewCategory"        element={<ViewCategory />} />
        <Route path="/UpdateCategory/:id"    element={<UpdateCategory />} />
        <Route path="/Manageorder"           element={<Manageorder />} />
        <Route path="/Approveorder/:id"      element={<Approveorder />} />
        <Route path="/Updateorderstatus/:id" element={<UpdateOrderStatus />} />
        <Route path="/AdminBooking" element={<AdminBooking />} />
        <Route path="/ManagePayment" element={<ManagePayment/>}/>
        <Route path="/ViewFeedback" element={<ViewFeedback/>}/>
        {/* <Route path="/Booking"               element={<Booking />} /> */}
      </Routes>
    </div>
  );
}
