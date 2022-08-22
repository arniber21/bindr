import { Outlet, useLoaderData, useNavigate } from "@remix-run/react";
import { json, LoaderFunction } from "@remix-run/node";
import { getUser } from "~/utils/session.server";
import { useEffect } from "react";


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

export default function AuthIndex() {
	let navigate = useNavigate();
	const data = useLoaderData<LoaderData>();
	useEffect(() => {
		if(data.user) {
			navigate("/dashboard");
		}
	}, [data]);

	return (
		<div>
			<Outlet />
		</div>
	)
}