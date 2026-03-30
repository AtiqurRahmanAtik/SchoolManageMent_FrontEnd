
import {
  MdDashboard,
  MdLogout,
  MdOutlineAddBox,
  MdOutlineAddShoppingCart,
  MdOutlineAssignmentReturn,
  MdOutlineCategory,
  MdOutlineImage,
  MdOutlineInventory,
  MdOutlineList,
  MdOutlineListAlt,
  MdOutlineMoreHoriz,
  MdOutlinePayments,
  MdOutlinePeople,
  MdOutlinePerson,
  MdOutlinePhotoSizeSelectActual,
  MdOutlinePointOfSale,
  MdOutlineReceiptLong,
  MdOutlineSettings,
  MdOutlineShoppingBag,
  MdOutlineShoppingCart,
  MdOutlineVerified,

} from "react-icons/md";
import PrivateRoot from "./PrivateRoot";

const useMenuItems = () => {

  const allItems = [
    {
      title: "Dashboard",
      path: "/dashboard",
      icon: <MdDashboard className="text-lg" />,
    },
   



    
 



{
      title: "Logout",
      path: "/logout",
      icon: <MdLogout className="text-lg" />,
    },
  ];

  return allItems;
};

export default useMenuItems;