import type { ErrorBoundaryComponent, LinksFunction, MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import {
	Links,
	LiveReload,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
} from "@remix-run/react";
import styles from "./styles/app.css";
import { json, LoaderFunction } from "@remix-run/node";
import { getUser } from "~/utils/session.server";

export const meta: MetaFunction = () => ({
	charset: "utf-8",
	title: "Bindr",
	viewport: "width=device-width,initial-scale=1",
});

export function links() {
	return [{
		rel: "stylesheet",
		href: styles,
	}];
}

const Navbar: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	return (
		<div className="p-3 flex flex-row justify-center">
			{children}
		</div>
	);
};

const NavbarElement: React.FC<{ children: React.ReactNode, href: string }> = ({ children, href }) => {
	return (
		<Link prefetch='intent' to={href}>
			<div
				className="border-2 border-slate-300 rounded-full py-3 px-5 mx-3 hover:bg-slate-100 hover:border-slate-500">
				{children}
			</div>
		</Link>
	);
};

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
	console.log(error);
	return (
		<html>
		<head>
			<title>Oh no!</title>
			<Meta />
			<Links />
		</head>
		<body className="m-4 bg-red-100">
			<h1 className="text-xl">An error occurred. </h1>
			<p><span className='font-bold'>For debugging purposes: </span> {error.message}</p>
			<Scripts />
		</body>
		</html>
	);
};

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
};

export default function App() {
	const data = useLoaderData<LoaderData>();
	const authed = !!data.user;
	return (
		<html lang="en">
		<head>
			<Meta />
			<Links />
		</head>
		<body>
		<Navbar>
			<NavbarElement href="/">
				Home
			</NavbarElement>
			<NavbarElement href="/about">
				About
			</NavbarElement>
			{authed && <NavbarElement href="/dashboard">
				Dashboard
			</NavbarElement>}
			{!authed && <NavbarElement href="/auth/signin">
				Sign In
			</NavbarElement>}
			{!authed && <NavbarElement href="/auth/signup">
				Sign Up
			</NavbarElement>}
			{authed &&
				<form action="/auth/signout" method="post"
					  className="border-2 border-slate-300 rounded-full py-3 px-5 mx-3 hover:bg-slate-100 hover:border-slate-500">
					<button type="submit" className="button">
						Sign Out
					</button>
				</form>
			}
		</Navbar>
		<div className="m-10">
			<Outlet />
		</div>
		<ScrollRestoration />
		<Scripts />
		</body>
		</html>
	);
}
