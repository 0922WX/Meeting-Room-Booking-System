import Dashboard from "@/components/ui/dashboard";
import Hero from "@/view/hero";
import Home from "@/view/home";
import Login from "@/view/login";
import Register from "@/view/register";
import UserManagement from "@/view/user-management";
import { createBrowserRouter } from "react-router-dom";
import MeetingroomManagement from '../view/meeting-roomManagement';
import {ReservationManagement} from "@/view/reservationManagement";
import SystenSetting from "@/view/systenSetting";
import StatisticS from "@/view/statistic";

const routes = [
  {
    path: "/",
    element: <Hero />,
  },
  {
    path: "login",
    element: <Login />,
  },
  {
    path: "register",
    element: <Register />,
  },
  {
    path: "/home",
    element: <Home />,
    children: [
      {
        index: true,
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "userManagement",
        element: <UserManagement />,
      },
      {
        path: "meetingroomManagement",
        element: <MeetingroomManagement/>,
      },
      {
        path:'reservationManagement',
        element:<ReservationManagement/>
      },
      {
        path:'systemSetting',
        element: <SystenSetting/>
      },
      {
        path:'statics',
        element: <StatisticS/>
      }
    ],
  },
];

export const router = createBrowserRouter(routes);
