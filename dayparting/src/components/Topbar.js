import { FiCalendar, FiChevronDown, FiLogOut } from 'react-icons/fi';
import { BsFullscreen } from 'react-icons/bs';
import { LuMoon } from 'react-icons/lu';
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import { FaRegUser } from 'react-icons/fa6';
import { getUserFullName } from '../utils/localStorage';
import { useAuth } from '../context/Authcontext';

const ProfileButton = () => {
	const { logout } = useAuth();
	return (
		<Popover>
			<PopoverButton>
				<FaRegUser className='size-3 stroke-1 outline-none ring-0' />
			</PopoverButton>
			<PopoverPanel transition anchor='bottom'>
				<div className='bg-white w-48 p-2'>
					<div className='flex items-center gap-3 p-4 text-xs font-extralight'>
						<div className='rounded-full p-3 text-white bg-primary-100'>
							<FaRegUser className='size-3 stroke-1' />
						</div>

						{getUserFullName() || 'User Name'}
					</div>
					<button
						type='button'
						title='logout'
						onClick={logout}
						className='flex items-center p-4 gap-3 text-xs font-extralight hover:bg-slate-100 transition-colors duration-500 w-full py-2'>
						<FiLogOut className='size-3 stroke-1' />
						Logout
					</button>
				</div>
			</PopoverPanel>
		</Popover>
	);
};

const TopBar = () => {
	return (
		<header className='w-full bg-white flex items-center justify-between flex-wrap px-4 py-2'>
			<div className='flex items-center space-x-3'>
				<h1 className='text-lg font-semibold'>Dashboard</h1>
			</div>

			<section className='flex items-center space-x-4 text-slate-500 '>
				<button
					type='button'
					title='Pick a date'
					className='rounded border flex items-center space-x-3 px-3 text-[10px] pr-2 py-0.5'>
					<FiCalendar className='size-3' />
					<div>
						<h3 className='col-span-3'>
							<span className='text-slate-900'>Last 7 days:</span>{' '}
							Jan 14 - Jan 20, 2024
						</h3>
						<h4 className='col-span-3 text-slate-400'>
							Compared: Jan 07 - Jan 13, 2024
						</h4>
					</div>
					<FiChevronDown className='size-3' />
				</button>
				<button>
					<BsFullscreen className='size-3' />
				</button>
				<button>
					<LuMoon className='size-4 stroke-1' />
				</button>
				<ProfileButton />
			</section>
		</header>
	);
};

export default TopBar;
