import { json, LoaderFunction } from "@remix-run/node";
import { getUser } from "~/utils/session.server";
import { Link, useLoaderData } from "@remix-run/react";

type LoaderData = {
	user?: {
		email: string;
		name: string;
		id: number;
	}
}

export const loader: LoaderFunction = async ({ request }) => {
	const user = await getUser(request);
	return json({ user });
}

export default function DashboardIndex() {
	const data = useLoaderData<LoaderData>();
	return (
		<div className='p-3'>
			<h1 className='text-xl'>Welcome to Bindr</h1>
			<Link to='courses'>
				<p>Go To Courses</p>
			</Link>
		</div>
	)
}