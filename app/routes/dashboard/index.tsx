import { json, LoaderFunction } from "@remix-run/node";
import { getUser } from "~/utils/session.server";
import { Link, useLoaderData } from "@remix-run/react";
import { primaryButtonClasses } from "~/utils/classes";

type LoaderData = {
	user?: {
		email: string;
		name: string;
		id: number;
	}
}

export const loader: LoaderFunction = async ({ request }) => {
	const user = await getUser(request);
	if(!user) throw new Error("Authentication failed, try signing out and signing back in");
	return json({ user });
}

export default function DashboardIndex() {
	const data = useLoaderData<LoaderData>();
	return (
		<div className='p-3'>
			<Link to='courses'>
				<button className={primaryButtonClasses}>Go To Courses</button>
			</Link>
		</div>
	)
}