import React from 'react';

const Style = ({attributes,clientId,isBackend=false}) => {
    const id = `#block-${clientId}`;
    const mainSl = `${id} .`
    return (
        <style dangerouslySetInnerHTML={{
            __html: `

            `}}/>
    );
};

export default Style;