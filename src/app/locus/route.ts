import { getErrorResponse } from "@/lib/helpers";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { ADMIN, LIMITED, NORMAL } from "../api/data";

export async function GET(req: NextRequest) {
    const userId = req.headers.get("X-USER-ID");
    let role = LIMITED;

    if (userId) {
        console.log(userId);
    }

    // Filters
    const url = new URL(req.nextUrl);
    const Id = url.searchParams.get('Id') || ''; // `Id`, int enum (rl table)
    const assemblyId = url.searchParams.get('assemblyId'); // `assemblyId`, int, single value (rl table)
    const regionId = url.searchParams.get('regionId'); // `regionId`, enum, (rld table)
    const membershipStatus = url.searchParams.get('membershipStatus'); // `membershipStatus`, varchar,single value (rld table)

    // Pagination
    const pageSize = parseInt(url.searchParams.get('pageSize') || '100');
    const page = parseInt(url.searchParams.get('page') || '1');

    // Side loading
    const sideloading = url.searchParams.get('sideloading');

    const query = {} as any;

    // Helper function
    const itemQuery = (cond: Boolean, obj: any) => cond ? obj : null;

    // Filters
    query.where = {
        ...itemQuery(Id !== '', { id: BigInt(Id) }),
        ...itemQuery(assemblyId !== null, { assembly_id: assemblyId }),

        // For side loading
        rnc_locus_members: {
            some: {
                ...itemQuery(regionId !== null, { region_id: parseInt(regionId || '-1') }),
                ...itemQuery(membershipStatus !== null, { membership_status: membershipStatus })
            }
        }
    };

    // Pagination
    query.take = pageSize;
    query.skip = (page - 1) * pageSize;

    // Look up
    // const subQuery = {} as any;
    // subQuery.where = {
    //     ...itemQuery(regionId !== null, { region_id: parseInt(regionId || '-1') }),
    //     ...itemQuery(membershipStatus !== null, { membership_status: membershipStatus })
    // };

    // Side Loading
    if ((sideloading === '1') && (role !== NORMAL)) {
        query.include = {
            rnc_locus_members: true // subQuery
        };
    }

    // Find Items

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
