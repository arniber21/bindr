import { ActionFunction } from "@remix-run/node";
import { BsArrowRightCircle } from "react-icons/bs";
import { createUserSession, signin } from "~/utils/session.server";
import { formControlClasses, primaryButtonClasses } from "~/utils/classes";

export const action: ActionFunction = async({ request }) => {
	const formData = await request.formData();

	const email = formData.get("email") as string;
	const password = formData.get("password") as string;

	const user = await signin(email, password);
	if(!user) throw new Error("Invalid Signin Data");
	return createUserSession(user.id, '/');
}

export default function SigninPage() {
	return (
		<div className='flex flex-row justify-center'>
			<form method="post" className="p-3 flex flex-col items-center">
				<h1 className="text-xl font-bold">Sign In</h1>
				<div className="m-3">
						<input type="email" name="email" placeholder='Email' className={formControlClasses}/>
				</div>
				<div className="m-3">
					<input type="password" name="password" placeholder='Password' className={formControlClasses} />
				</div>
				<div className="m-3">
					<button type='submit' className={primaryButtonClasses}>
						 Sign In <BsArrowRightCircle style={{display: "inline-block", marginLeft: '0.3rem'}}/>
					</button>
				</div>
			</form>
		</div>
	);
}