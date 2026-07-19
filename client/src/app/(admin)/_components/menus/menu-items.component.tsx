import Image from "next/image"
import profileImg from "@/app/_common/assets/images/avatar/profile-xs.png"
import { _routes } from "../../_configs/_routes"
import {
  AnalyticsIcon,
  AttentionIcon,
  CalendarIcon,
  ClipboardIcon,
  EditBadgeIcon,
  HistoryIcon,
  HomeIcon,
  HourglassIcon,
  IntegrationIcon,
  LogoutIcon,
  NotificationIcon,
  ProxyIcon,
  ScrapeIcon,
  SettingsIcon,
  SmmIcon,
  StatisticsIcon,
  SupportIcon,
  TestIcon,
  UserIcon,
  WalletIcon,
} from "./icons"
import { Menu } from "@/app/(admin)/_components/menus/types/menu.type"
import { CountBadge } from "./count-badge.component"

export const MenuItems: Menu[] = [
  {
    category: "Menu",
    items: [
      {
        title: "Home",
        icon: <HomeIcon />,
        link: _routes.contents,
      },
      {
        title: "Generation",
        icon: <IntegrationIcon />,
        items: [
          {
            title: "Contents",
            link: _routes.contents,
          },
        ],
      },
      {
        title: "Settings",
        link: _routes.configuration,
        icon: <SettingsIcon />,
      },
      {
        title: "Users",
        link: _routes.users,
        icon: <UserIcon />,
      },
      {
        title: "Logout",
        link: _routes.signout,
        icon: <LogoutIcon />,
      },
    ],
  },
]
