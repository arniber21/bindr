import { json, LoaderFunction } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { getCourses } from "~/utils/db.server";
import { getUser } from "~/utils/session.server";
import { secondaryButtonClasses } from "~/utils/classes";

export const loader: LoaderFunction = async ({ request }) => {
	const user = await getUser(request);
	if(!user) throw new Error("Could not find user");
	return json(await getCourses(user.id));
}

type CourseCardProps = {
	course: { id: number, name: string }
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
	return (
		<Link to={course.id.toString()}>
			<div className='mr-5 p-5 border-2 rounded-lg inline-block hover:bg-slate-100 hover:border-slate-500 focus:border-slate-500'>
				<h3 className='m-3'> { course.name } </h3>
			</div>
		</Link>
	)
}

export default function CoursesRootPage() {
	const data = useLoaderData();
	return (
		<div className='my-3'>
			<div className="flex flex-row m-3">
				{
					data.map((course: { id: number, name: string }) => (
						<div key={course.id}>
							<CourseCard course={course} />
						</div>
					))
				}
			</div>
			<Outlet />
		</div>
	)
}