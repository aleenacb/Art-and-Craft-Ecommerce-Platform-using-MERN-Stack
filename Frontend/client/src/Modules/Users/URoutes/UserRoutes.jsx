import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../UComponents/Login";
import ViewProduct from "../../Admin/AComponents/ViewProduct";
import ViewProductDetail from "../UComponents/ViewProductDetail";
import Register from "../UComponents/Register";
import UpdateProfile from "../UComponents/updateProfile";
import OrderHistory from "../UComponents/OrderHistory";
import FilterCategory from "../UComponents/FilterCategory";
import Cart from "../UComponents/Cart";
import Booking from "../UComponents/Booking";
import TrackOrder from "../UComponents/TrackOrder";
import Payment from "../UComponents/Payment";
import PaymentHistory from '../UComponents/PaymentHistory';
import WriteReview from "../UComponents/WriteReview";
import MyReviews from "../UComponents/MyReviews";

function UserRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="Register" replace />} />
      <Route path="Login" element={<Login />} />
      <Route path="ViewProduct" element={<ViewProduct />} />
      <Route path="ViewProductDetail/:id" element={<ViewProductDetail />} />
      {/* <Route path="ViewProductDetail" element={<ViewProductDetail />} /> */}
      <Route path="Register" element={<Register />} />
      <Route path="UpdateProfile" element={<UpdateProfile />} />
      <Route path="OrderHistory" element={<OrderHistory />} />
      <Route path="FilterCategory" element={<FilterCategory />} />
      <Route path="Cart" element={<Cart />} />
      <Route path="Booking" element={<Booking />} />
      <Route path="track/:orderId" element={<TrackOrder/>}/>
      <Route path="Payment" element={<Payment/>}/>
      <Route path="PaymentHistory" element={<PaymentHistory />} />
      <Route path="WriteReview" element={<WriteReview/>}/>
      <Route path="MyReviews" element={<MyReviews/>}></Route> 
    </Routes>
  );
}

export default UserRoutes;