import { SubTitle } from "../atoms/subTitle";
import { Title } from "../atoms/title";

interface HeaderProps {
    className?: string;
    title: string;
    subTitle: string;
}


export const Header = ({
    className,
    title,
    subTitle
}: HeaderProps) => {
    return (
        <>
            <Title>{title}</Title>
            <SubTitle className={className}>
                {subTitle}
            </SubTitle>
        </>
    );
}
