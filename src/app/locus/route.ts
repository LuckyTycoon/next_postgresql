import { getErrorResponse } from "@/lib/helpers";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { ADMIN, LIMITED, NORMAL } from "../api/data";

// mockup data
import Users from '../api/data';

interface Filter {
    where?: object;
    include?: object;
    take?: number;
    skip?: number;
}

export async function GET(req: NextRequest) {
    const userId = req.headers.get("X-USER-ID");

    let role = LIMITED;

    if (userId) {
        console.log(userId);
        const user = Users.find(item => '' + item.id === userId);
        if (user) {
            role = user.role;
        }
    }

    /// Get filters variables from URL

    const url = new URL(req.nextUrl);

    const sideloading = url.searchParams.get('sideloading'); // Side loading
    const Id = url.searchParams.get('Id'); // `Id`, int enum (rl table)
    const assemblyId = url.searchParams.get('assemblyId'); // `assemblyId`, int, single value (rl table)
    const regionId = url.searchParams.get('regionId'); // `regionId`, enum, (rld table)
    const membershipStatus = url.searchParams.get('membershipStatus'); // `membershipStatus`, varchar,single value (rld table)
    const pageSize = parseInt(url.searchParams.get('pageSize') || '1000'); // page size
    const page = parseInt(url.searchParams.get('page') || '1'); // page number

    /// Make Query Object

    // Helper function
    const itemQuery = (cond: Boolean, obj: any) => cond ? obj : null;

    /** Sub query filter object used for look up related data. */
    const subQuery = {} as Filter;
    subQuery.where = {
        ...(role === LIMITED)
            ? { region_id: { in: [86118093, 86696489, 88186467] }}
            : itemQuery(regionId !== null, { region_id: parseInt(regionId || '-1') }),
        ...itemQuery(membershipStatus !== null, { membership_status: membershipStatus })
    };

    /** Main filter object */
    const query = {} as Filter;

    query.where = {
        ...itemQuery(Id !== null, { id: BigInt(Id || '') }),
        ...itemQuery(assemblyId !== null, { assembly_id: assemblyId }),

        // For side loading
        rnc_locus_members: {
            some: subQuery.where
        }
    };

    // Pagination
    query.take = pageSize;
    query.skip = (page - 1) * pageSize;

    // Side Loading
    if ((sideloading === '1') && (role !== NORMAL)) {
        query.include = {
            rnc_locus_members: subQuery
        };
    }

    console.clear();
    console.log('ROLE: ', role);
    console.log(subQuery);
    console.log(query);

    /// Find Items

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
}
