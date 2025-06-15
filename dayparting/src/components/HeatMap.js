import { useCallback, useEffect, useState } from 'react';
import api from '../services/apiservice';
import { FiRefreshCcw } from 'react-icons/fi';

const HOURS = Array.from({ length: 24 }, (_, h) => {
	const suffix =
		h === 0
			? '12am'
			: h < 12
			? `${h}am`
			: h === 12
			? '12pm'
			: `${h - 12}pm`;
	return suffix;
});

const getColor = (value, min, max) => {
	const ratio = (value - min) / (max - min || 1);
	const lightness = 95 - ratio * 50;
	return `hsl(240, 100%, ${lightness}%)`;
};

const HeatMap = ({ data, selectedMetrics, isLoading, error, setRetry }) => {
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

	const bounds = {};
	selectedMetrics.forEach((metric) => {
		let values = [];
		data.forEach((day) => {
			day.Hourly_Data.forEach((h) => values.push(h[metric]));
		});
		bounds[metric] = {
			min: Math.min(...values),
			max: Math.max(...values),
		};
	});

	return (
		<div className='overflow-auto'>
			<table className='min-w-[1000px] table-auto text-[10px] text-center'>
				<thead>
					<tr>
						<th className='sticky left-0 z-10 bg-white border px-1 py-1'>
							Time
						</th>
						{data.map((day) => (
							<th
								key={day.weekday}
								colSpan={selectedMetrics.length}
								className='bg-slate-50 text-xs font-medium'>
								{day.weekday}
							</th>
						))}
					</tr>
					<tr>
						<th className='sticky left-0 z-10 bg-white border px-1 py-1'></th>
						{data.map((day) =>
							selectedMetrics.map((metric) => (
								<th
									key={`${day.weekday}-${metric}`}
									className='bg-slate-100 text-[10px]'>
									{metric}
								</th>
							))
						)}
					</tr>
				</thead>
				<tbody>
					{HOURS.map((hourLabel, hourIdx) => (
						<tr key={hourLabel}>
							<th className='sticky left-0 z-10 bg-white border px-1 py-1'>
								{hourLabel}
							</th>
							{data.map((day) =>
								selectedMetrics.map((metric) => {
									const value =
										day.Hourly_Data[hourIdx]?.[metric] ?? 0;
									const { min, max } = bounds[metric];
									const bg = getColor(value, min, max);
									return (
										<td
											key={`${day.weekday}-${hourLabel}-${metric}`}
											style={{ backgroundColor: bg }}
											className='border px-1 py-1 min-w-[55px] text-xs'>
											{Math.round(value)}
										</td>
									);
								})
							)}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

const HeatMapContainer = ({ selectedMetrics }) => {
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

			const res = await api.post('/day-parting/heatmap-list', {
				startDate: '2024-06-08',
				endDate: '2024-07-07',
				metrics: selectedMetrics,
			});

			setData(res.data.result);
		} catch (err) {
			console.error('Error fetching heat map:', err);
			setError('Failed to fetch heat map');
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
			<header className='border-b p-3'>
				<h3 className=''>Heat Map</h3>
				<h6 className='font-extralight text-xs text-slate-500'>
					Select hours to schedule Dayparting
				</h6>
			</header>
			<HeatMap
				data={data}
				selectedMetrics={selectedMetrics}
				isLoading={isLoading}
				error={error}
				setRetry={setRetry}
			/>
		</div>
	);
};

export default HeatMapContainer;
