import { Link } from "@remix-run/react";
import { primaryButtonClasses } from "~/utils/classes";

export default function CoursesIndexPage() {
	return (
		<div className="my-5">
			<Link to='courses'>
				<button className={ primaryButtonClasses }>View All Courses</button>
			</Link>
		</div>
	)
}