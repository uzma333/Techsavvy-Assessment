import { useState } from 'react';
import LineChartContainer from './LineChart';
import HeatMapContainer from './HeatMap';

const VisualizationArea = () => {
	const [selectedMetrics, setSelectedMetrics] = useState([]);
	return (
		<>
			<LineChartContainer
				selectedMetrics={selectedMetrics}
				setSelectedMetrics={setSelectedMetrics}
			/>
			<HeatMapContainer selectedMetrics={selectedMetrics} />
		</>
	);
};

export default VisualizationArea;
