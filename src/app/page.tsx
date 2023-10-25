"use client";
import Header from "@/components/Header";
import { Container, createStyles, rem } from "@mantine/core";
import { useRouter } from "next/navigation";
import { cookies } from "next/headers";

const useStyles = createStyles((theme) => ({
    inner: {
        paddingTop: `calc(${theme.spacing.xl} * 4)`,
        paddingBottom: `calc(${theme.spacing.xl} * 4)`,
        display: "flex",
        justifyContent: "space-between",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",

        [theme.fn.smallerThan("md")]: {
            marginRight: 0,
        },
    },

    title: {
        fontFamily: `Greycliff CF, ${theme.fontFamily}`,
        fontWeight: 900,
        lineHeight: 1.05,
        fontSize: rem(64),

        [theme.fn.smallerThan("md")]: {
            maxWidth: "100%",
            fontSize: rem(34),
            lineHeight: 1.15,
        },
    },

    subtitle: {
        paddingTop: theme.spacing.xl,
        fontFamily: `Greycliff CF, ${theme.fontFamily}`,
        fontWeight: 800,
        lineHeight: 1.05,
        fontSize: rem(40),

        [theme.fn.smallerThan("md")]: {
            maxWidth: "100%",
            fontSize: rem(26),
            lineHeight: 1.15,
        },
    },
}));
export default function Home() {
    const { classes } = useStyles();
    const router = useRouter();
    
    return (
        <>
            <Header />
            <Container pt="sm" size="xl">
                <div className={classes.inner}>
                    
                </div>
            </Container>
        </>
    );
}
