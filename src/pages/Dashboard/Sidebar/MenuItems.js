import {
  IoIosArchive,
  IoMdCash,
  IoMdListBox,
  IoMdPaper,
  IoMdPlay,
  IoMdSettings,
} from "react-icons/io";
import { FaTemperatureLow } from "react-icons/fa";

import { GiStack, GiShop } from "react-icons/gi";
import { AiFillShop } from "react-icons/ai";
import { RiTimeFill } from "react-icons/ri";
import { BiFile } from "react-icons/bi";
import { MdDashboard, MdAccessTime } from "react-icons/md";

export default [
  // {
  //   name: 'Dashboard',
  //   icon: MdDashboard,
  //   path: ''
  // },

  {
    name: "Orders",
    icon: IoMdPaper,
    path: "",
    path: "",
    isOpen: false,
  },
  {
    name: "Outlets",
    icon: AiFillShop,
    path: "outlets",
  },
  // {
  //   name: 'Customers',
  //   icon: IoMdPeople,
  //   path: 'customers'
  // },
  {
    name: "Billing",
    icon: IoMdCash,
    path: "billing",
  },
  // {
  //   name: "Temperature",
  //   icon: FaTemperatureLow,
  //   path: "temperature",
  // },
  { name: "Attendance", icon: RiTimeFill, path: "attendance" },
  {
    name: "Reports",
    icon: BiFile,
    path: "reports",
    // div: true
  },
  {
    name: "Forms",
    icon: IoIosArchive,
    path: "forms",
  },
];
