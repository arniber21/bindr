import { getUser } from "~/utils/session.server";
import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";


export default function Index() {
	return (
		<div>
			<h1 className='text-xl font-bold '>Bindr</h1>
		</div>
	);
}
