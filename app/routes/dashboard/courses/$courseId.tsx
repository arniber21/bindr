import { useParams } from "react-router";
import { json, LoaderFunction } from "@remix-run/node";
import { getUser } from "~/utils/session.server";
import { getCourse, getCourses } from "~/utils/db.server";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { primaryButtonClasses } from "~/utils/classes";

export const loader: LoaderFunction = async ({ request, params }) => {
	const user = await getUser(request);
	const courseId = params.courseId;
	if(!courseId) throw new Error("Something horribly wrong happened");
	if(!user) throw new Error("Could not find user");
	const course = await getCourse(user.id, Number.parseInt(courseId));
	return json({ course });
}


export default function CoursePage() {
	const params = useParams();
	const data = useLoaderData();
	return (
		<div className='p-3'>
			<h2 className='mb-3 text-lg font-bold'>{ data.course.name }</h2>
			<div className="flex flex-row mb-5">
				<Link to='assignments'>
					<button className={primaryButtonClasses}>View Assignments</button>
				</Link>
			</div>
			<Outlet />
		</div>
	)
}