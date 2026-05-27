import React, { useEffect, useState } from 'react';
import { ServerContext } from '@/state/server';
import { NavLink, useLocation } from 'react-router-dom';
import { encodePathSegments, hashToPath } from '@/helpers';
import tw from 'twin.macro';

interface Props {
    renderLeft?: React.ReactElement;
    withinFileEditor?: boolean;
    isNewFile?: boolean;
}

export default ({ renderLeft, withinFileEditor, isNewFile }: Props) => {
    const [file, setFile] = useState<string | null>(null);
    const id = ServerContext.useStoreState((state) => state.server.data!.id);
    const directory = ServerContext.useStoreState((state) => state.files.directory);
    const { hash } = useLocation();

    useEffect(() => {
        const path = hashToPath(hash);

        if (withinFileEditor && !isNewFile) {
            const name = path.split('/').pop() || null;
            setFile(name);
        }
    }, [withinFileEditor, isNewFile, hash]);

    const breadcrumbs = (): { name: string; path?: string }[] =>
        directory
            .split('/')
            .filter((directory) => !!directory)
            .map((directory, index, dirs) => {
                if (!withinFileEditor && index === dirs.length - 1) {
                    return { name: directory };
                }

                return { name: directory, path: `/${dirs.slice(0, index + 1).join('/')}` };
            });

    return (
        <div css={tw`flex flex-grow-0 items-center text-sm text-gray-500 overflow-x-hidden whitespace-nowrap`}>
            {renderLeft}
            <span>/</span>
            <span css={tw`text-gray-300`}>home</span>
            <span>/</span>
            <NavLink to={`/server/${id}/files`} css={tw`text-gray-200 no-underline hover:text-gray-100`}>
                container
            </NavLink>
            <span>/</span>
            {breadcrumbs().map((crumb, index) =>
                crumb.path ? (
                    <React.Fragment key={index}>
                        <NavLink
                            to={`/server/${id}/files#${encodePathSegments(crumb.path)}`}
                            css={tw`text-gray-200 no-underline hover:text-gray-100`}
                        >
                            {crumb.name}
                        </NavLink>
                        <span>/</span>
                    </React.Fragment>
                ) : (
                    <span key={index} css={tw`text-gray-300`}>
                        {crumb.name}
                    </span>
                )
            )}
            {file && (
                <React.Fragment>
                    <span>/</span>
                    <span css={tw`text-gray-300`}>{file}</span>
                </React.Fragment>
            )}
        </div>
    );
};
