import { getErrorResponse } from "@/lib/helpers";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    // const userId = req.headers.get("X-USER-ID");
    // if (!userId) {
    //     return getErrorResponse(401, "You are not logged in, please provide token to gain access");
    // }

    // Filters
    const url = new URL(req.nextUrl);
    const Id = url.searchParams.get('Id') || ''; // `Id`, int enum (rl table)
    const assemblyId = url.searchParams.get('assemblyId'); // `assemblyId`, int, single value (rl table)
    const regionId = url.searchParams.get('regionId'); // `regionId`, enum, (rld table)
    const membershipStatus = url.searchParams.get('membershipStatus'); // `membershipStatus`, varchar,single value (rld table)

    // Side loading
    const sideloading = url.searchParams.get('sideloading');

    console.log('--------------------------------------');
    console.log(Id, assemblyId, regionId, membershipStatus);

    const query = {} as any;

    const itemQuery = (cond: Boolean, obj: any) => cond ? obj : null;

    query.where = {
        ...itemQuery(Id !== '', { id: BigInt(Id) }),
        ...itemQuery(assemblyId !== null, { assembly_id: assemblyId })
    };

    query.take = 10;

    try {
        const result = await prisma.rnc_locus.findMany(query);

        const serializedResult = JSON.stringify(result, (key, value) => {
            if (typeof value === 'bigint') {
                return value.toString();
            }
            return value;
        });

        return NextResponse.json({
            status: "success",
            data: serializedResult,
        });
    } catch (error) {
        console.log("error", error);
        return getErrorResponse(500, "Something went wrong");
    }

    // prisma.rnc_locus.fin
}
