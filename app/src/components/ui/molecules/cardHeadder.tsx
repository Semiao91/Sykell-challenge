import { CardDescription, CardHeader, CardTitle } from "../atoms/card";

export const CardHeading = ({
    title,
    subTitle,
}: {
    title: string;
    subTitle: string;
}) => {
    return (
        <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{subTitle}</CardDescription>
        </CardHeader>
    );
};
