import {
	HiOutlineViewGrid,
	HiOutlineCube,
	HiOutlineShoppingCart,
	HiOutlineUsers
} from 'react-icons/hi'

export const DASHBOARD_SIDEBAR_LINKS = [
	{
		key: 'dashboard',
		label: 'Dashboard',
		path: '/',
		icon: <HiOutlineViewGrid />
	},
	{
		key: 'newboard',
		label: 'Newboard',
		path: '/newboard',
		icon: <HiOutlineViewGrid />
	},
	{
		key: 'DataSenSor',
		label: 'DataSenSor',
		path: '/datasensor',
		icon: <HiOutlineCube />
	},
	{
		key: 'ActionHistory',
		label: 'ActionHistory',
		path: '/actionhistory',
		icon: <HiOutlineShoppingCart />
	},
	{
		key: 'Profile',
		label: 'Profile',
		path: '/profile',
		icon: <HiOutlineUsers />
	}
]

// export const DASHBOARD_SIDEBAR_BOTTOM_LINKS = [
// 	{
// 		key: 'settings',
// 		label: 'Settings',
// 		path: '/settings',
// 		icon: <HiOutlineCog />
// 	},
// 	{
// 		key: 'support',
// 		label: 'Help & Support',
// 		path: '/support',
// 		icon: <HiOutlineQuestionMarkCircle />
// 	}
// ]