import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { json, LoaderFunction } from "@remix-run/node";
import { getAssignments } from "~/utils/db.server";
import { secondaryButtonClasses } from "~/utils/classes";

type Assignment = {
	id: number,
	name: string,
	description: string,
	startDate: Date,
	dueDate: Date,
	completed: Boolean
}

type LoaderData = {
	assignments: Assignment[]
}

export const loader: LoaderFunction = async ({ params, request }) => {
	const courseId = params.courseId;
	if (!courseId) throw new Error("Something horribly wrong occurred");

	const assignments = await getAssignments(Number.parseInt(courseId));
	return json({ assignments });
};


type AssignmentHeaderProps = {
	name: string,
	completed: Boolean,
	dueDate: Date
}
export const AssignmentHeader: React.FC<AssignmentHeaderProps> = ({ name, completed, dueDate }) => {
	return (
		<h3>
			{name}
			<span className='text-blue-600'> Due { dueDate.toLocaleDateString()} </span>
			{completed ? <span className="text-green-600"> Completed </span> :
				<span className="text-yellow-600"> Incomplete </span>}
			{(dueDate < new Date() && !completed) && <span className="text-red-600"> Overdue </span>}
		</h3>
	);
};

type AssignmentListCardTypes = {
	id: number,
	name: string,
	completed: Boolean,
	dueDate: Date
}

const AssignmentListCard: React.FC<AssignmentListCardTypes> = ({ id, name, completed, dueDate }) => {
	return (
		<Link to={id.toString()}>
			<div className="rounded-xl px-5 py-3 mb-5 border-2 hover:border-slate-500 hover:bg-slate-100">
				<AssignmentHeader
					name={name}
					completed={completed}
					dueDate={dueDate}
				/>
			</div>
		</Link>
	);
};

const sortAssignmentFunction = (assnOne: any, assnTwo: any) => {
	const one = assnOne.dueDate;
	const two = assnTwo.dueDate;
	if(one === two) return 0;
	return one > two ? 1 : -1;
}

export default function AssignmentRootRoute() {
	const data = useLoaderData<LoaderData>();
	const assignments = data.assignments;
	const assignmentListClasses = assignments.length != 0 ? '' : 'col-span-0';
	const assignmentOutletClasses = assignments.length != 0 ? '' : 'col-span-2';
	return (
		<div>
			<div className="grid grid-cols-2 gap-10">
				<div className={assignmentListClasses}>
					{data.assignments.sort(sortAssignmentFunction).map(assignment => (
						<div key={assignment.id}>
							<AssignmentListCard
								name={assignment.name}
								completed={assignment.completed}
								dueDate={new Date(assignment.dueDate)}
								id={assignment.id}
							/>
						</div>
					))}
				</div>
				<div className={assignmentOutletClasses}>
					<Outlet />
				</div>
			</div>
			<Link to="new">
				<button className={secondaryButtonClasses}>Add Assignment</button>
			</Link>
		</div>
	);
}
