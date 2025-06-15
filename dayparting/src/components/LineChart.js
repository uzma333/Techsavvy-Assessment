import { useCallback, useEffect, useState } from 'react';
import api from '../services/apiservice';
import {
	LineChart as ReLineChart,
	Line,
	XAxis,
	YAxis,
	Tooltip,
	CartesianGrid,
	Legend,
	ResponsiveContainer,
} from 'recharts';
import Dropdown from './Dropdown';
import { FiRefreshCcw } from 'react-icons/fi';

const getRandomColor = () =>
	`hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`;

//  Chart Renderer
const LineChart = ({ isLoading, data, selectedMetrics, error, setRetry }) => {
	if (error) {
		return (
			<div className='h-52 w-full rounded-b-xl text-red-500 bg-red-50 flex items-center justify-center flex-col gap-2 text-xs'>
				{error}
				<button onClick={() => setRetry(true)}>
					<FiRefreshCcw />
				</button>
			</div>
		);
	}

	if (isLoading) {
		return (
			<div className='h-52 w-full rounded-b-xl bg-slate-100 animate-pulse'></div>
		);
	}

	if (!selectedMetrics.length) {
		return (
			<div className='h-52 w-full rounded-b-xl bg-slate-100 flex justify-center items-center text-sm text-slate-500'>
				Please select a metric
			</div>
		);
	}

	if (!data.length) {
		return (
			<div className='h-52 w-full rounded-b-xl bg-slate-100 flex justify-center items-center text-sm text-slate-500'>
				No data available!
			</div>
		);
	}

	return (
		<ResponsiveContainer
			width='100%'
			height={300}
			className='rounded-b-xl p-2'>
			<ReLineChart data={data} className='text-xs'>
				<CartesianGrid strokeDasharray='3 3' />
				<XAxis dataKey='date' />
				<YAxis
					tickFormatter={(value) => `₹${(value / 1000).toFixed(1)}k`}
				/>
				<Tooltip
					formatter={(value) =>
						typeof value === 'number'
							? value.toLocaleString()
							: value
					}
				/>
				<Legend />
				{selectedMetrics.map((metric) => (
					<Line
						key={metric}
						type='monotone'
						dataKey={metric}
						stroke={getRandomColor()}
						strokeWidth={1}
						dot={{ r: 2 }}
					/>
				))}
			</ReLineChart>
		</ResponsiveContainer>
	);
};

// Container with logic
const LineChartContainer = ({ selectedMetrics, setSelectedMetrics }) => {
	const [data, setData] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);
	const [retry, setRetry] = useState(false);

	const fetchData = useCallback(async () => {
		try {
			setIsLoading(true);
			setError(null);

			if (!selectedMetrics.length) {
				setData([]);
				return;
			}

			const res = await api.post(
				'/day-parting/DayPartingPerformanceGraphList',
				{
					startDate: '2024-06-08',
					endDate: '2024-07-07',
					metrics: selectedMetrics,
				}
			);

			const { categories, series } = res.data.result;

			const formatted = categories.map((time, idx) => {
				const hour = parseInt(time.split(':')[0]); // e.g., "00:00:00" -> 0
				const entry = { date: `${hour} Hr` };
				series.forEach((metric) => {
					entry[metric.name] = metric.data[idx];
				});
				return entry;
			});

			setData(formatted);
		} catch (err) {
			console.error('Error fetching performance chart:', err);
			setError('Failed to fetch performance chart');
		} finally {
			setIsLoading(false);
		}
	}, [selectedMetrics]);

	useEffect(() => {
		fetchData();
		setRetry(false);
	}, [fetchData, retry]);

	return (
		<div className='bg-white rounded-xl shadow'>
			<header className='flex justify-between items-center border-b p-3'>
				<section>
					<h3 className=''>Performance Chart</h3>
					<h6 className='font-extralight text-xs text-slate-500'>
						Key Metrics for Dayparting Schedule Performance
						Evaluation
					</h6>
				</section>
				<Dropdown
					selectedMetrics={selectedMetrics}
					setSelectedMetrics={setSelectedMetrics}
				/>
			</header>
			<LineChart
				data={data}
				selectedMetrics={selectedMetrics}
				isLoading={isLoading}
				error={error}
				setRetry={setRetry}
			/>
		</div>
	);
};

export default LineChartContainer;
