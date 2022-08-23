import { ActionFunction, ErrorBoundaryComponent, json, LoaderFunction, redirect } from "@remix-run/node";
import { getAssignment, setAssignmentAsComplete } from "~/utils/db.server";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { AssignmentHeader } from "~/routes/dashboard/courses/$courseId/assignments";
import {
	primaryButtonClasses,
	primaryGradientButtonClasses,
	secondaryButtonClasses,
	secondaryGradientButtonClasses,
} from "~/utils/classes";

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

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
	return (
		<div className="bg-red-100 rounded-3xl p-4">
			<h1 className='text-xl font-bold'>An error occurred in Assignments</h1>
			<p><span className='font-bold'>For debugging purposes: </span> { error.message }</p>
		</div>
	)
}


export default function AssignmentPage() {
	const data = useLoaderData<LoaderData>();
	return (
		<div>
			<div className="font-bold text-lg">
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
						<button type="submit" className={primaryGradientButtonClasses}>Mark as Completed</button>
					</form>
				</div>
				<div className="mr-3">
					<Link to='edit'>
						<button className={secondaryGradientButtonClasses}>Edit Assignment</button>
					</Link>
				</div>
			</div>
			<Outlet />
		</div>
	);
}