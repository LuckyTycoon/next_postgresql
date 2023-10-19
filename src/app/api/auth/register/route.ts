import { getErrorResponse } from "@/lib/helpers";
import { prisma } from "@/lib/prisma";
import { RegisterUserInput, RegisterUserSchema } from "@/lib/validations/user.schema";
import { hash } from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import Users, { User } from '../../data';

export async function POST(req: NextRequest) {
    try {
        const body = (await req.json()) as RegisterUserInput;
        const data = RegisterUserSchema.parse(body);
        const hashedPassword = await hash(data.password, 12);
        const nameSplit = data.name.split(' ');

        // Make fake users data
        let id = Math.max(...Users.map(item => item.id));
        let user = {
            id,
            name: data.name,
            email: data.email,
            role: 'user',
            verified: true,
            createdAt: new Date().toString(),
            updatedAt: new Date().toString(),
            password: hashedPassword
        } as User;

        Users.push(user);

        // const user = await prisma.auth_user.create({
        //     data: {
        //         password: hashedPassword,
        //         is_superuser: false,
        //         username: data.name,
        //         first_name: nameSplit[0],
        //         last_name: nameSplit[nameSplit.length - 1],
        //         email: data.email,
        //         is_staff: false,
        //         is_active: true,
        //         date_joined: new Date()
        //         // photo: data.photo,
        //     }
        // });

        return new NextResponse(
            JSON.stringify({
                status: "success",
                data: { user: { ...user, password: undefined } },
            }),
            {
                status: 201,
                headers: { "Content-Type": "application/json" },
            }
        );
    } catch (error: any) {
        console.error(error);
        if (error instanceof ZodError) {
            return getErrorResponse(400, "failed validations", error);
        }

        if (error.code === "P2002") {
            return getErrorResponse(409, "user with that email already exists");
        }

        return getErrorResponse(500, error.message);
    }
}
