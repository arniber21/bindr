import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { ErrorBoundaryComponent, LoaderFunction } from "@remix-run/node";
import { primaryButtonClasses } from "~/utils/classes";

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
			<h1 className='text-xl font-bold m-3 mb-5'>Dashboard</h1>
			<Outlet />
		</div>
	)
}