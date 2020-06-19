import React, { useCallback, useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown/with-html';

const useResize = (myRef: React.RefObject<HTMLDivElement>) => {
    const getWidth = useCallback(() => myRef?.current?.offsetWidth, [myRef]);

    const [width, setWidth] = useState<number | undefined>(undefined);

    useEffect(() => {
        const handleResize = () => {
            setWidth(getWidth());
        };

        if (myRef.current) {
            setWidth(getWidth());
        }

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [myRef, getWidth]);

    return width && width > 25 ? width - 25 : width;
};

const ExampleMarkdown = ({ maxWidth }: { maxWidth?: number }) => {
    const [input, setInput] = useState('');

    const getInput = useCallback(async () => {
        const instructionsPath = require('./catInstructions.md');

        try {
            const instructionsFile = await fetch(instructionsPath);
            const instructionsText = await instructionsFile.text();
            setInput(instructionsText);
        } catch (err) {
            console.error('Problem reading markdown file', err);
        }
    }, [setInput]);

    useEffect(() => {
        getInput();
    }, [getInput]);

    //ReactMarkdown accepts custom renderers
    const renderers = {
        //This custom renderer changes how images are rendered
        //we use it to constrain the max width of an image to its container
        image: ({
            alt,
            src,
            title,
        }: {
            alt?: string;
            src?: string;
            title?: string;
        }) => <img alt={alt} src={src} title={title} style={{ maxWidth }} />,
    };

    return (
        <ReactMarkdown
            escapeHtml={false}
            source={input}
            renderers={renderers}
        />
    );
};

function App() {
    const divRef = useRef<HTMLDivElement>(null);
    const maxWidth = useResize(divRef);

    return (
        <div
            ref={divRef}
            style={{
                border: 'solid',
                borderRadius: 15,
                marginLeft: 100,
                marginTop: 50,
                width: '80vh',
            }}
        >
            <ExampleMarkdown maxWidth={maxWidth} />
        </div>
    );
}

export default App;
