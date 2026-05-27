import styled from 'styled-components';
import tw from 'twin.macro';

export const ContentContainer = styled.div`
    ${tw`flex pt-16`}
    padding-inline-end: 0.25rem;

    @media (min-width: 1024px) {
        padding-inline-start: 250px;
    }
`;
