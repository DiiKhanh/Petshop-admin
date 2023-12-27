// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { Navigate, useLocation } from "react-router-dom";
// // import authApi from "../apis/modules/auth.api";
// // import { setUser } from "../redux/features/userSlice";
// import { toast } from "react-toastify";
// import { setUser } from "~/redux/features/userSlice";

// const ProtectedPage = ({ children }) => {
//   const { user } = useSelector(state => state.user);
//   // const navigate = useNavigate();

//   const location = useLocation();


//   if (!user) {
//     toast.error("Phải đăng nhập quyền admin mới có thể truy cập!");
//     return <Navigate to="/login" state={{ from: location }} replace />;
//   }

//   // useEffect(() => {
//   //   const authUser = async () => {
//   //     const { response, err } = await authApi.getInfo();
//   //     if (response) dispatch(setUser(response));
//   //     if (err) {
//   //       dispatch(setUser(null));
//   //       navigate("/login");
//   //     }
//   //   };
//   //   authUser();
//   // }, [dispatch, navigate]);

//   return children;
// };

// export default ProtectedPage;

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import authApi from "../apis/modules/auth.api";
import { setUser } from "../redux/features/userSlice";

const ProtectedPage = ({ children }) => {
  const { user } = useSelector(state => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const authUser = async () => {
      const { response, err } = await authApi.getInfo();
      if (response) dispatch(setUser(response));
      if (err) {
        dispatch(setUser(null));
        navigate("/login");
      }
    };
    authUser();
  }, [dispatch, navigate]);

  return (
    <>
      {
        user && children
      }
    </>
  );
};

export default ProtectedPage;