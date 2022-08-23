import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { ErrorBoundaryComponent, LoaderFunction } from "@remix-run/node";
import { primaryButtonClasses, secondaryButtonClasses } from "~/utils/classes";

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
	return (
		<div className="bg-red-100 p-4">
			<h1 className='text-xl font-bold'>An error occurred in Dashboard</h1>
			<p><span className='font-bold'>For debugging purposes: </span> { error.message }</p>
		</div>
	)
}

export default function DashboardIndex() {
	return (
		<div className=''>
			<div className="flex flex-row justify-between">
				<h1 className='text-xl font-bold m-3 mb-3'>Dashboard</h1>
				<div className="mx-3 mb-3">
					<Link to='new'>
						<button className={ secondaryButtonClasses }>Add Course</button>
					</Link>
				</div>
			</div>
			<Outlet />
		</div>
	)
}