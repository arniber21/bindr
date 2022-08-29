import { useParams } from "react-router";
import { ErrorBoundaryComponent, json, LoaderFunction } from "@remix-run/node";
import { getUser } from "~/utils/session.server";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { primaryButtonClasses, secondaryButtonClasses } from "~/utils/classes";
import { getCourse, getCourses } from "~/utils/assignments.server";

export const loader: LoaderFunction = async ({ request, params }) => {
	const user = await getUser(request);
	const courseId = params.courseId;
	if(!courseId) throw new Error("Something horribly wrong happened");
	if(!user) throw new Error("Could not find user");
	const course = await getCourse(Number.parseInt(courseId));
	if(!course) throw new Error("Course not found");
	return json({ course });
}

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
	return (
		<div className="bg-red-100 rounded-3xl p-4">
			<h1 className='text-xl font-bold'>An error occurred in Courses</h1>
			<p><span className='font-bold'>For debugging purposes: </span> { error.message }</p>
		</div>
	)
}


export default function CoursePage() {
	const params = useParams();
	const data = useLoaderData();
	return (
		<div className='p-3'>
			<div className="flex flex-row justify-between">
				<h2 className='mb-3 text-lg font-bold'>{ data.course.name }</h2>
				<div className="flex flex-row mb-5">
					<div className="mx-1">
						<Link to='assignments'>
							<button className={primaryButtonClasses}>View Assignments</button>
						</Link>
					</div>
					<div className="mx-1">
						<Link to='calendar'>
							<button className={secondaryButtonClasses}>View Calendar</button>
						</Link>
					</div>
				</div>
			</div>
			<Outlet />
		</div>
	)
}