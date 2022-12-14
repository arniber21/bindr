import type { LoaderFunction } from '@remix-run/node'
import type { FC } from "react";
import { Link, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { getAssignments } from "~/utils/assignments.server";
const calendarGridElementClasses = "border-2 p-5 font-medium";

type LoaderData = {
	assignments: any[]
}

export const loader: LoaderFunction = async ({ params, request }) => {
	const courseId = params.courseId;
	if (!courseId) throw new Error("Something horribly wrong happened");

	const assignments = await getAssignments(Number.parseInt(courseId));
	return json({ assignments });
};

const CalendarHeader: FC = () => {
	return <>
		<div className={calendarGridElementClasses}>
			Sunday
		</div>
		<div className={calendarGridElementClasses}>
			Monday
		</div>
		<div className={calendarGridElementClasses}>
			Tuesday
		</div>
		<div className={calendarGridElementClasses}>
			Wednesday
		</div>
		<div className={calendarGridElementClasses}>
			Thursday
		</div>
		<div className={calendarGridElementClasses}>
			Friday
		</div>
		<div className={calendarGridElementClasses}>
			Saturday
		</div>
	</>;
}

export default function CalendarPage() {
	const data = useLoaderData<LoaderData>();
	const daysArray = [] as number[];
	// Fill the arrays with days
	const dayOffset = (() => {
		const date = new Date();
		return new Date(
			date.getFullYear(),
			date.getMonth(),
			1,
		).getDay();
	})();
	const daysInCurrentMonth = (() => {
		const date = new Date();
		return new Date(
			date.getFullYear(),
			date.getMonth() + 1,
			0,
		).getDate();
	})();
	for (let i = 1; i <= 35; i++) {
		daysArray.push(i - dayOffset);
	}
	return (
		<div>
			<h1 className="text-lg mb-5">Calendar</h1>
			<div className="grid grid-cols-7">
				<CalendarHeader />
				{daysArray.map((day) =>
					<div className={calendarGridElementClasses} key={day}>
						{day > 0 ? day <= daysInCurrentMonth ? day : day - 31 : day + 31}
						{day > 0 && day <= 31 && data.assignments.filter(assignment => new Date(assignment.dueDate).getDate() === day).map(assignment => (
							<div key={assignment.id}>
								<Link to={`../assignments/${assignment.id}`}>
									<span className="text-red-600">{assignment.name}</span>
									<br />
								</Link>
							</div>
						))}
					</div>,
				)}
			</div>
		</div>
	);
}