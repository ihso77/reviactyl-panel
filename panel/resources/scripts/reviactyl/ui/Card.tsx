import React from 'react';
import classNames from 'classnames';
import tw from 'twin.macro';
import styled from 'styled-components';

interface CardProps {
    className?: string;
    children: React.ReactNode;
}

const CardDefault = styled.div`
    ${tw`rounded-ui bg-gray-700 border border-gray-600`}
`;

export default ({ className, children, ...props }: CardProps & React.HTMLAttributes<HTMLDivElement>) => (
    <CardDefault {...props} className={classNames('p-5', className)}>
        {children}
    </CardDefault>
);
