import { ActionFunction, json, LoaderFunction, redirect } from "@remix-run/node";
import { getAssignment, setAssignmentAsComplete } from "~/utils/db.server";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { AssignmentHeader } from "~/routes/dashboard/courses/$courseId/assignments";
import { primaryButtonClasses, secondaryButtonClasses } from "~/utils/classes";

export const action: ActionFunction = async ({ params, request }) => {
	const assignmentId = params.assignmentId;
	const courseId = params.courseId;
	if(!assignmentId || !courseId) throw new Error("Something horribly wrong occurred");
	await setAssignmentAsComplete(Number.parseInt(assignmentId));
	// For some reason an empty url breaks this.
	// When testing make sure to try and update the assignment, and see what happens
	return redirect(`/dashboard/courses/${courseId}/assignments/${assignmentId}`);
}


type LoaderData = {
	id: number,
	name: string,
	description: string,
	startDate: Date,
	dueDate: Date,
	completed: Boolean,
}

export const loader: LoaderFunction = async ({ params }) => {
	const assignmentId = params.assignmentId;
	if (!assignmentId) throw new Error("Something horribly wrong ocurred");
	const assignment = await getAssignment(Number.parseInt(assignmentId));
	if (!assignment) throw new Error("This assignment doesn't exist");
	return json(assignment);
};


export default function AssignmentPage() {
	const data = useLoaderData<LoaderData>();
	return (
		<div>
			<div className="font-bold">
				<AssignmentHeader name={data.name} completed={data.completed} dueDate={new Date(data.dueDate)} />
			</div>
			<p className="text-sm mb-3">{data.description}</p>
			<p className="text-sm mb-3">
				<span className="font-bold mr-1">
					Date Given:
				</span>
				{new Date(data.startDate).toLocaleString()}
			</p>
			<div className="flex flex-row">
				<div className="mr-3">
					<form method="post">
						<button type="submit" className={primaryButtonClasses}>Mark as Completed</button>
					</form>
				</div>
				<div className="mr-3">
					<Link to='edit'>
						<button className={secondaryButtonClasses}>Edit Assignment</button>
					</Link>
				</div>
			</div>
			<Outlet />
		</div>
	);
}