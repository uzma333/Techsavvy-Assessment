import Sidebar from '../components/Sidebar';
import TopBar from '../components/Topbar';
import VisualizationArea from '../components/VisualizationArea';

const Dashboard = () => {
	return (
		<div className='flex h-screen bg-gray-100'>
			<Sidebar />

			<div className='flex flex-col flex-1 overflow-auto'>
				<TopBar />

				<main className='p-6 space-y-6 w-full'>
					<VisualizationArea />
				</main>
			</div>
		</div>
	);
};

export default Dashboard;
