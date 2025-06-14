import { FiLoader, FiLock, FiMail } from 'react-icons/fi';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/Authcontext';
import api from '../services/apiservice';

const LoginForm = () => {
	const emailRef = useRef(null);
	const passwordRef = useRef(null);
	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();
	const { login } = useAuth();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError(null); // Reset error state before making API call

		try {
			setIsLoading(true); // Set loading state

			const email = emailRef.current.value.trim();
			const password = passwordRef.current.value.trim();

			if (!email || !password) {
				setError('Email and Password are required');
				return;
			}

			const res = await api.post('/auth/login', {
				email,
				password,
				isLoggedInHere: 0,
			});

			console.debug('Login API Response:', res.data); //for debug purpose

			const reactAppIdentity = process.env.REACT_APP_IDENTITY;

			if (!reactAppIdentity) {
				setError(
					'REACT_APP_IDENTITY is not set in environment variables'
				);
				return;
			}

			const token = res.data.token;
			const identity = reactAppIdentity;

			if (!token) {
				throw new Error('Missing token from login response');
			}

			const userData = {
				email: res.data.userDetails.email,
				token,
				identity,
			};

			login(userData);
			navigate('/dashboard');
		} catch (err) {
			console.error('Login Error:', err);
			setError('Invalid credentials!');
		} finally {
			setIsLoading(false); // Reset loading state
		}
	};
	return (
		<form className='space-y-3' onSubmit={handleSubmit}>
			<div className='w-full space-y-1'>
				<label htmlFor='email' className='text-xs font-extralight'>
					Email
				</label>
				<div className='border flex items-center rounded-lg p-3 space-x-3 focus-within:border-primary-100 focus-within:text-primary-100 border-slate-600'>
					<FiMail className='size-5 stroke-1' />
					<input
						type='email'
						id='email'
						ref={emailRef}
						placeholder='john.doe@example.com'
						className='outline-none w-full bg-transparent text-sm text-slate-700'
					/>
				</div>
			</div>
			<div className='w-full space-y-1'>
				<label htmlFor='password' className='text-xs font-extralight'>
					Password
				</label>
				<div className='border flex items-center justify-between rounded-lg p-3 space-x-3 focus-within:border-primary focus-within:text-primary border-slate-600'>
					<div className='flex items-center space-x-3 basis-3/4'>
						<FiLock className='size-5 stroke-1 flex-shrink-0' />
						<input
							type='password'
							ref={passwordRef}
							id='password'
							placeholder='********'
							className='outline-none bg-transparent text-sm text-slate-700 w-full'
						/>
					</div>

					<button
						type='button'
						title='Forgot Password?'
						className='text-xs text-red-500 basis-1/4'>
						Forgot Password?
					</button>
				</div>
			</div>
			{error && <p className='text-red-500 text-xs'>{error}</p>}
			<div className='flex justify-end'>
				<div className='flex items-center space-x-2'>
					<input
						type='checkbox'
						id='remember-me'
						className='accent-primary-100 cursor-pointer'
					/>
					<label
						htmlFor='remember-me'
						className='text-xs text-slate-700 cursor-pointer'>
						Remember Me
					</label>
				</div>
			</div>
			<button
				type='submit'
				disabled={isLoading}
				className='w-full uppercase text-white bg-primary hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2 rounded-lg py-3 text-sm font-semibold transition-colors duration-500'>
				{isLoading ? (
					<FiLoader className='mx-auto animate-spin' />
				) : (
					'Sign In'
				)}
			</button>
		</form>
	);
};

export default LoginForm;
