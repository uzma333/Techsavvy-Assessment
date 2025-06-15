import techSavvyImg from '../assets/techsavvyimg.jpg';

const Logo = ({ className }) => {
	return (
		<img
			src={techSavvyImg}
			alt='Logo'
			className={`mix-blend-multiply ${className ?? ''}`}
		/>
	);
};

export default Logo;
