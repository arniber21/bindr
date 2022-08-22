import { compare, genSalt, hash } from "bcryptjs";
import { db } from "~/utils/db.server";
import { createCookieSessionStorage, redirect } from "@remix-run/node";

export const createUser = async (email: string, password: string, name: string) => {
	// Hash the password
	const salt = await genSalt(10);
	const hashedPassword = await hash(password, salt);

	// Create the user
	const user = await db.user.create({ data: { email: email, password: hashedPassword, name: name } });
	return user;
};

export const signin = async (email: string, password: string) => {
	// Verify that the user has the right email and password
	const user = await db.user.findUnique({ where: { email } });
	if (!user) return null;

	const correctPassword = await compare(password, user.password);
	if (!correctPassword) return null;

	return user;
};

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
	throw new Error("SESSION_SECRET must be set");
}

const storage = createCookieSessionStorage({
	cookie: {
		name: "RJ_session",
		secure: false,
		secrets: [sessionSecret],
		sameSite: "lax",
		path: "/",
		maxAge: 60 * 60 * 24 * 30,
		httpOnly: true,
	},
});

async function getUserSession (request: Request) {
	const session = await storage.getSession(request.headers.get("Cookie"))
	return session;
}

export async function getUserId(request: Request) {
	const session = await getUserSession(request);
	return session.get("userId");
}

export async function requireUserId(
	request: Request,
	redirectTo: string = new URL(request.url).pathname,
) {
	const session = await getUserSession(request);
	const userId = session.get("userId");
	if (!userId || typeof userId !== "number") {
		const searchParams = new URLSearchParams([
			["redirectTo", redirectTo],
		]);
		throw redirect(`/auth/signin`);
	}
	return userId;
}

export async function getUser(request: Request) {
	const userId = await getUserId(request);
	if(!userId || typeof userId !== 'number') return null;
	const user = await db.user.findUnique({
		where: { id: userId },
	});
	return user;
}

export async function signout(request: Request) {
	const session = await getUserSession(request);
	return redirect("/auth/signin", {
		headers: {
			"Set-Cookie": await storage.destroySession(session),
		},
	});
}

export async function createUserSession(
	userId: number,
	redirectTo: string,
) {
	const session = await storage.getSession();
	session.set("userId", userId);
	return redirect(redirectTo, {
		headers: {
			"Set-Cookie": await storage.commitSession(session),
		},
	});
}
