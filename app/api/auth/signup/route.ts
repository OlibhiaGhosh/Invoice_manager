import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

interface userinfo{
    name: string;
    email: string;
    password: string;
    company_name?: string;
}

export async function POST(req: NextRequest, res:NextResponse){
    const {name, email, password, company_name }= await req.json() as userinfo;
    if(!name || !email || !password){
        return NextResponse.json({message: "Missing required fields"}, {status: 400});
    }
    const existingUser = await db.select().from(users).where(eq(users.email, email));

    if(existingUser.length > 0){
        return NextResponse.json({message: "User already exists"}, {status: 409});
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newuser = await db.insert(users).values({
        name,
        email,
        password: hashedPassword,
        company_name
    });

    return NextResponse.json({message: "User created successfully", user: newuser}, {status: 201});
}