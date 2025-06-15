import { useState } from 'react';
import { FaGear } from 'react-icons/fa6';
import Logo from './Logo';
import { NavLink } from 'react-router-dom';
import { BiSolidTachometer, BiTachometer } from 'react-icons/bi';

const Sidebar = () => {
	const [isHovered, setIsHovered] = useState(false);

	return (
		<>
			<aside
				className='h-full bg-white w-16 border'
				onMouseEnter={() => setIsHovered(true)}>
				<div className='flex flex-col items-center justify-between h-full'>
					<section className='flex flex-col items-center justify-start space-y-5'>
						<Logo className='border-b p-4 size-16' />
						<nav className='flex flex-col items-center justify-center space-y-2 p-3'>
							<button className='rounded-lg p-3 bg-primary-300'>
								<BiSolidTachometer className='text-white' />
							</button>
						</nav>
					</section>
					<footer className='border-t p-4 w-full flex items-center justify-center'>
						<FaGear className='text-slate-300' />
					</footer>
				</div>
			</aside>

			{/* Sidebar */}
			<aside
				className={`fixed top-0 left-0 h-full w-64 bg-white text-black shadow-lg z-40 transition-transform duration-300
          ${isHovered ? 'translate-x-0' : '-translate-x-full'}`}
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}>
				<div className='flex flex-col items-start justify-between h-full'>
					<section className='flex flex-col items-center justify-start space-y-5 w-full'>
						<section className='flex gap-1 items-end justify-start p-2 border-b w-full'>
							<Logo className='size-12' />
							<h1 className='uppercase text-3xl font-light font-oswald tracking-wide'>
								TechSavvy
							</h1>
						</section>
						<nav className='flex flex-col space-y-2 p-3 w-full'>
							<NavLink
								to='/dashboard'
								className={({ isActive }) =>
									`rounded-lg w-full p-3 flex items-center font-semibold gap-2 text-sm text-primary-300 ${
										isActive
											? 'bg-primary-100 bg-opacity-10'
											: 'bg-transparent'
									}`
								}>
								<BiTachometer className='size-6 stroke-primary-100' />
								Dashboard
							</NavLink>
						</nav>
					</section>
					<footer className='border-t p-4 w-full flex items-center justify-start gap-2 text-slate-400 text-sm'>
						<FaGear />
						Settings
					</footer>
				</div>
			</aside>
		</>
	);
};

export default Sidebar;
