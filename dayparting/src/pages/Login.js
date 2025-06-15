import LoginForm from '../components/LoginForm';
import Logo from '../components/Logo';

const Login = () => {
	return (
		<main className='min-h-screen flex flex-col gap-5 items-center justify-center bg-gradient-to-br from-purple-200 via-white to-primary p-10'>
			<section className='flex gap-3 items-center justify-center'>
				<Logo className='size-14' />
				<h1 className='uppercase text-4xl font-oswald tracking-widest'>
					TechSavvy
				</h1>
			</section>
			<section className='bg-slate-50 border-4 border-white p-20 rounded-2xl space-y-3 w-full md:w-2/3 lg:w-1/2'>
				<h2 className='text-3xl font-semibold text-center'>
					Welcome Back!
				</h2>
				<LoginForm />
			</section>
		</main>
	);
};

export default Login;
