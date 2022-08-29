import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { ErrorBoundaryComponent, LoaderFunction } from "@remix-run/node";
import { primaryButtonClasses, secondaryButtonClasses } from "~/utils/classes";
import { requireUserId } from "~/utils/session.server";

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
	return (
		<div className="bg-red-100 p-4">
			<h1 className='text-xl font-bold'>An error occurred in Dashboard</h1>
			<p><span className='font-bold'>For debugging purposes: </span> { error.message }</p>
		</div>
	)
}

export const loader: LoaderFunction = async ({ request }) => {
	await requireUserId(request, '/signin');
	return null;
}

export default function DashboardIndex() {
	// This is just to redirect if you are not authed
	const data = useLoaderData();
	return (
		<div className=''>
			<div className="flex flex-row justify-between">
				<h1 className='text-xl font-bold m-3 mb-3'>Dashboard</h1>
				<div className="mx-3 mb-3">
					<Link to='courses/new'>
						<button className={ secondaryButtonClasses }>Add Course</button>
					</Link>
				</div>
			</div>
			<Outlet />
		</div>
	)
}